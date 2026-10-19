import { auth,authPool } from '@/lib/auth';
import { MEDIA_CHUNK_SIZE } from '@/lib/destination-media';
import { mediaRange } from '@/lib/media-range';

async function serve(request: Request, context: { params: Promise<{ assetId: string }> }, head: boolean) {
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session) return new Response(null,{ status: 401 });
  const { assetId } = await context.params;
  const asset = (await authPool.query("SELECT content_type,byte_size FROM vien_media_assets WHERE id=$1 AND status='ready'",[assetId])).rows[0];
  if (!asset) return new Response(null,{ status: 404 });
  const range = mediaRange(request.headers.get('Range'),asset.byte_size);
  if (!range) return new Response(null,{ status: 416,headers: { 'Content-Range': `bytes */${asset.byte_size}` } });
  const responseHeaders: Record<string,string> = { 'Content-Type': asset.content_type, 'Content-Length': String(range.end-range.start+1), 'Accept-Ranges': 'bytes', 'Cache-Control': 'private, max-age=86400, immutable', 'X-Content-Type-Options': 'nosniff' };
  if (range.partial) responseHeaders['Content-Range'] = `bytes ${range.start}-${range.end}/${asset.byte_size}`;
  let position = range.start;
  let cancelled = false;
  const body = head ? null : new ReadableStream<Uint8Array>({
    async pull(controller) {
      if (cancelled) return;
      if (position > range.end) { controller.close(); return; }
      try {
        const chunk = (await authPool.query('SELECT data FROM vien_media_chunks WHERE asset_id=$1 AND chunk_index=$2',[assetId,Math.floor(position/MEDIA_CHUNK_SIZE)])).rows[0]?.data as Buffer | undefined;
        if (!chunk) throw new Error('MISSING_MEDIA_CHUNK');
        if (cancelled) return;
        const offset = position % MEDIA_CHUNK_SIZE;
        const length = Math.min(chunk.length-offset,range.end-position+1);
        controller.enqueue(new Uint8Array(chunk.subarray(offset,offset+length)));
        position += length;
      } catch { if (!cancelled) controller.error(new Error('MEDIA_READ_FAILED')); }
    },
    cancel() { cancelled = true; },
  });
  return new Response(body,{ status: range.partial ? 206 : 200,headers: responseHeaders });
}
export async function GET(request: Request,context: { params: Promise<{ assetId: string }> }) { return serve(request,context,false); }
export async function HEAD(request: Request,context: { params: Promise<{ assetId: string }> }) { return serve(request,context,true); }
