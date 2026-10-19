import { authPool } from '@/lib/auth';
import { communityRoute } from '@/lib/community-api';

export async function GET(request: Request, { params }: { params: Promise<{ messageId: string }> }) {
  return communityRoute(request, async () => {
    const { messageId } = await params;
    if (messageId.length > 50) return new Response(null, { status: 404 });
    const result = await authPool.query('SELECT photo FROM vien_chat_messages WHERE id=$1', [messageId]);
    if (!result.rows[0]?.photo) return new Response(null, { status: 404 });
    return new Response(new Uint8Array(result.rows[0].photo), { headers: { 'Content-Type': 'image/webp', 'Cache-Control': 'private, max-age=3600', 'X-Content-Type-Options': 'nosniff' } });
  });
}
