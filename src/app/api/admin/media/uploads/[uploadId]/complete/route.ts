import { adminRoute } from '@/lib/admin';
import { mediaCatalog,publishMedia } from '@/lib/destination-media';

export async function POST(request: Request, context: { params: Promise<{ uploadId: string }> }) {
  return adminRoute(request, async userId => {
    await publishMedia(userId,(await context.params).uploadId);
    return Response.json(await mediaCatalog(userId), { headers: { 'Cache-Control': 'no-store' } });
  });
}
