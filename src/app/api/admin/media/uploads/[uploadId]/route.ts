import { adminRoute } from '@/lib/admin';
import { authPool } from '@/lib/auth';
import { MEDIA_CHUNK_SIZE,writeMediaChunk } from '@/lib/destination-media';
import { MediaError } from '@/lib/media-error';

type Context = { params: Promise<{ uploadId: string }> };
export async function PUT(request: Request, context: Context) {
  return adminRoute(request, async userId => {
    if (Number(request.headers.get('Content-Length')) > MEDIA_CHUNK_SIZE) throw new MediaError(413,'CHUNK_TOO_LARGE');
    const { uploadId } = await context.params;
    const raw = new URL(request.url).searchParams.get('index');
    if (raw === null || !/^\d+$/.test(raw)) throw new MediaError(400,'INVALID_CHUNK');
    await writeMediaChunk(userId,uploadId,Number(raw),Buffer.from(await request.arrayBuffer()));
    return Response.json({ saved: true });
  });
}
export async function DELETE(request: Request, context: Context) {
  return adminRoute(request, async userId => {
    const { uploadId } = await context.params;
    await authPool.query("DELETE FROM vien_media_assets WHERE id=$1 AND created_by=$2 AND status='uploading'",[uploadId,userId]);
    return Response.json({ cancelled: true });
  });
}
