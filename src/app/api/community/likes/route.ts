import { authPool } from '@/lib/auth';
import { CommunityError } from '@/lib/community';
import { communityBody, communityHeaders, communityRoute } from '@/lib/community-api';

export async function POST(request: Request) {
  return communityRoute(request, async userId => {
    const { messageId, liked } = await communityBody(request);
    if (typeof messageId !== 'string' || messageId.length > 50 || typeof liked !== 'boolean') throw new CommunityError(400, 'INVALID_LIKE');
    if (!(await authPool.query('SELECT 1 FROM vien_chat_messages WHERE id=$1', [messageId])).rowCount) throw new CommunityError(404, 'MESSAGE_NOT_FOUND');
    if (liked) await authPool.query('INSERT INTO vien_chat_likes (message_id,user_id) VALUES ($1,$2) ON CONFLICT DO NOTHING', [messageId, userId]);
    else await authPool.query('DELETE FROM vien_chat_likes WHERE message_id=$1 AND user_id=$2', [messageId, userId]);
    const result = await authPool.query('SELECT count(*)::integer AS likes FROM vien_chat_likes WHERE message_id=$1', [messageId]);
    return Response.json({ messageId, likes: result.rows[0].likes, hasLiked: liked }, { headers: communityHeaders });
  });
}
