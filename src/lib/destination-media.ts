import { randomUUID } from 'node:crypto';
import { authPool } from '@/lib/auth';
import { isAdmin } from '@/lib/admin';
import { DESTINATIONS } from '@/data/destinations';
import { MediaError } from '@/lib/media-error';
import type { MediaCatalog } from '@/types/media';

export const MEDIA_CHUNK_SIZE = 1024 * 1024;
export async function mediaCatalog(userId: string): Promise<MediaCatalog> {
  const [rows, admin] = await Promise.all([authPool.query('SELECT destination_id,cover_id,video_id,updated_at FROM vien_destination_media'), isAdmin(userId)]);
  return { isAdmin: admin, media: rows.rows.map(row => ({ destinationId: row.destination_id, coverUrl: row.cover_id ? `/api/media/${row.cover_id}` : undefined, videoUrl: row.video_id ? `/api/media/${row.video_id}` : undefined, updatedAt: new Date(row.updated_at).toISOString() })) };
}
export async function mediaJson(request: Request) {
  const text = await request.text();
  if (text.length > 16000) throw new MediaError(413, 'REQUEST_TOO_LARGE');
  try {
    const body = JSON.parse(text);
    if (!body || typeof body !== 'object' || Array.isArray(body)) throw new Error();
    return body as Record<string, unknown>;
  } catch { throw new MediaError(400, 'INVALID_JSON'); }
}
export async function beginMediaUpload(userId: string, body: Record<string, unknown>) {
  const { destinationId, kind, contentType, size } = body;
  if (!DESTINATIONS.some(d => d.id === destinationId) || !['cover','video'].includes(String(kind)) || !Number.isInteger(size) || typeof size !== 'number' || size <= 0 || size > (kind === 'cover' ? 2 * MEDIA_CHUNK_SIZE : 50 * MEDIA_CHUNK_SIZE)) throw new MediaError(400, 'INVALID_UPLOAD');
  if (kind === 'cover' ? contentType !== 'image/webp' : !['video/mp4','video/webm'].includes(String(contentType))) throw new MediaError(400, 'INVALID_MEDIA_TYPE');
  // Replacing an unfinished upload only discards that admin's temporary chunks.
  await authPool.query("DELETE FROM vien_media_assets WHERE created_by=$1 AND destination_id=$2 AND kind=$3 AND status='uploading'", [userId, destinationId, kind]);
  const id = randomUUID();
  await authPool.query('INSERT INTO vien_media_assets(id,destination_id,kind,content_type,byte_size,created_by) VALUES ($1,$2,$3,$4,$5,$6)', [id,destinationId,kind,contentType,size,userId]);
  return { uploadId: id, chunkSize: MEDIA_CHUNK_SIZE };
}
function validSignature(bytes: Buffer, type: string) {
  if (type === 'image/webp') return bytes.toString('ascii',0,4) === 'RIFF' && bytes.toString('ascii',8,12) === 'WEBP';
  if (type === 'video/mp4') return bytes.toString('ascii',4,8) === 'ftyp';
  return bytes.length >= 4 && bytes.readUInt32BE(0) === 0x1a45dfa3;
}
export async function writeMediaChunk(userId: string, id: string, index: number, bytes: Buffer) {
  if (!Number.isInteger(index) || index < 0 || bytes.length > MEDIA_CHUNK_SIZE) throw new MediaError(400,'INVALID_CHUNK');
  const client = await authPool.connect();
  try {
    await client.query('BEGIN');
    const result = await client.query("SELECT byte_size,content_type FROM vien_media_assets WHERE id=$1 AND created_by=$2 AND status='uploading' FOR UPDATE", [id,userId]);
    const asset = result.rows[0];
    if (!asset) throw new MediaError(404,'UPLOAD_NOT_FOUND');
    const expected = Math.min(MEDIA_CHUNK_SIZE, asset.byte_size - index * MEDIA_CHUNK_SIZE);
    if (expected <= 0 || bytes.length !== expected || (index === 0 && !validSignature(bytes,asset.content_type))) throw new MediaError(400,'INVALID_CHUNK');
    await client.query('INSERT INTO vien_media_chunks(asset_id,chunk_index,data) VALUES ($1,$2,$3) ON CONFLICT (asset_id,chunk_index) DO UPDATE SET data=EXCLUDED.data', [id,index,bytes]);
    await client.query('COMMIT');
  } catch (error) { await client.query('ROLLBACK'); throw error; }
  finally { client.release(); }
}
export async function publishMedia(userId: string, id: string) {
  const client = await authPool.connect();
  try {
    await client.query('BEGIN');
    const asset = (await client.query('SELECT * FROM vien_media_assets WHERE id=$1 AND created_by=$2 FOR UPDATE',[id,userId])).rows[0];
    if (!asset) throw new MediaError(404,'UPLOAD_NOT_FOUND');
    if (asset.status === 'ready') { await client.query('COMMIT'); return; }
    const chunks = (await client.query('SELECT count(*)::integer AS n,COALESCE(sum(octet_length(data)),0)::integer AS size FROM vien_media_chunks WHERE asset_id=$1',[id])).rows[0];
    if (chunks.n !== Math.ceil(asset.byte_size / MEDIA_CHUNK_SIZE) || chunks.size !== asset.byte_size) throw new MediaError(409,'UPLOAD_INCOMPLETE');
    await client.query("UPDATE vien_media_assets SET status='ready' WHERE id=$1",[id]);
    if (asset.kind === 'cover') await client.query('INSERT INTO vien_destination_media(destination_id,cover_id,updated_by) VALUES ($1,$2,$3) ON CONFLICT (destination_id) DO UPDATE SET cover_id=EXCLUDED.cover_id,updated_by=EXCLUDED.updated_by,updated_at=now()', [asset.destination_id,id,userId]);
    else await client.query('INSERT INTO vien_destination_media(destination_id,video_id,updated_by) VALUES ($1,$2,$3) ON CONFLICT (destination_id) DO UPDATE SET video_id=EXCLUDED.video_id,updated_by=EXCLUDED.updated_by,updated_at=now()', [asset.destination_id,id,userId]);
    await client.query('COMMIT');
  } catch (error) { await client.query('ROLLBACK'); throw error; }
  finally { client.release(); }
}
