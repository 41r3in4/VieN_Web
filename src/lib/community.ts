import { randomUUID } from 'node:crypto';
import { authPool } from '@/lib/auth';
import { PERSONAS } from '@/data/personas';
import type { ChatResponse } from '@/types/community';

export class CommunityError extends Error { constructor(public status: number, message: string) { super(message); } }
export function decodeCommunityPhoto(value: unknown): Buffer | null {
  if (value === undefined || value === null) return null;
  if (typeof value !== 'string' || !/^data:image\/webp;base64,[A-Za-z0-9+/]+=*$/.test(value)) throw new CommunityError(400, 'INVALID_PHOTO');
  const bytes = Buffer.from(value.split(',')[1], 'base64');
  if (bytes.length > 200000 || bytes.toString('ascii', 0, 4) !== 'RIFF' || bytes.toString('ascii', 8, 12) !== 'WEBP') throw new CommunityError(400, 'INVALID_PHOTO');
  return bytes;
}

export async function readChat(userId: string, before?: string | null): Promise<ChatResponse> {
  let cursor: { created_at: string; id: string } | undefined;
  if (before) {
    cursor = (await authPool.query('SELECT id, created_at::text AS created_at FROM vien_chat_messages WHERE id=$1', [before])).rows[0];
    if (!cursor) throw new CommunityError(400, 'INVALID_CURSOR');
  }
  const result = await authPool.query(`
    SELECT m.id, m.user_id, m.content, m.created_at, m.photo IS NOT NULL AS has_photo,
      u.name, u."updatedAt" AS updated, COALESCE(p.persona,'historian') AS persona,
      (SELECT count(*)::integer FROM vien_chat_likes l WHERE l.message_id=m.id) AS likes,
      EXISTS(SELECT 1 FROM vien_chat_likes l WHERE l.message_id=m.id AND l.user_id=$1) AS liked
    FROM vien_chat_messages m JOIN "user" u ON u.id=m.user_id
    LEFT JOIN vien_user_preferences p ON p.user_id=u.id
    WHERE ($2::timestamptz IS NULL OR (m.created_at,m.id) < ($2::timestamptz,$3::text))
    ORDER BY m.created_at DESC,m.id DESC LIMIT 31
  `, [userId, cursor?.created_at ?? null, cursor?.id ?? null]);
  return { hasMore: result.rows.length > 30, messages: result.rows.slice(0, 30).reverse().map(row => ({ id: row.id, createdAt: new Date(row.created_at).toISOString(), sender: row.name, avatar: `/api/community/avatar/${encodeURIComponent(row.user_id)}?v=${new Date(row.updated).getTime()}`, role: PERSONAS.find(p => p.id === row.persona)?.title ?? 'Thành viên VieN', text: row.content, timestamp: new Date(row.created_at).toLocaleString('vi-VN', { timeZone: 'Asia/Bangkok', hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit' }), isSelf: row.user_id === userId, photoUrl: row.has_photo ? `/api/community/photos/${row.id}` : undefined, likes: row.likes, hasLiked: row.liked })) };
}

export async function sendMessage(userId: string, body: Record<string, unknown>) {
  const { text, clientId } = body;
  if (typeof text !== 'string' || text.length > 2000 || typeof clientId !== 'string' || !/^[0-9a-f-]{36}$/i.test(clientId)) throw new CommunityError(400, 'INVALID_MESSAGE');
  const photo = decodeCommunityPhoto(body.photo);
  if (!text.trim() && !photo) throw new CommunityError(400, 'EMPTY_MESSAGE');
  const client = await authPool.connect();
  try {
    await client.query('BEGIN');
    await client.query('SELECT pg_advisory_xact_lock(hashtextextended($1,0))', [userId]);
    const duplicate = await client.query('SELECT id FROM vien_chat_messages WHERE user_id=$1 AND client_id=$2', [userId, clientId]);
    if (!duplicate.rowCount) {
      const recent = await client.query("SELECT 1 FROM vien_chat_messages WHERE user_id=$1 AND created_at > now()-interval '2 seconds' LIMIT 1", [userId]);
      if (recent.rowCount) throw new CommunityError(429, 'TOO_FAST');
      await client.query('INSERT INTO vien_chat_messages (id,user_id,client_id,content,photo) VALUES ($1,$2,$3,$4,$5)', [randomUUID(), userId, clientId, text.trim(), photo]);
    }
    await client.query('COMMIT');
  } catch (error) { await client.query('ROLLBACK'); throw error; }
  finally { client.release(); }
}
