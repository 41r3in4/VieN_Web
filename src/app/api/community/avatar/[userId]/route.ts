import { authPool } from '@/lib/auth';
import { communityRoute } from '@/lib/community-api';

export async function GET(request: Request, { params }: { params: Promise<{ userId: string }> }) {
  return communityRoute(request, async () => {
    const { userId } = await params;
    if (userId.length > 128) return new Response(null, { status: 404 });
    const result = await authPool.query('SELECT image FROM "user" WHERE id=$1', [userId]);
    const image = result.rows[0]?.image;
    if (typeof image !== 'string' || !/^data:image\/(webp|png|jpeg);base64,/.test(image)) return Response.redirect(new URL('/avatar-default.svg', request.url));
    const [prefix, encoded] = image.split(',');
    const bytes = Buffer.from(encoded, 'base64');
    if (bytes.length > 200000) return Response.redirect(new URL('/avatar-default.svg', request.url));
    return new Response(new Uint8Array(bytes), { headers: { 'Content-Type': prefix.slice(5).split(';')[0], 'Cache-Control': 'private, max-age=300', 'X-Content-Type-Options': 'nosniff' } });
  });
}
