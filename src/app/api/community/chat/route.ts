import { readChat, sendMessage } from '@/lib/community';
import { communityBody, communityHeaders, communityRoute } from '@/lib/community-api';

export async function GET(request: Request) {
  return communityRoute(request, async userId => Response.json(await readChat(userId, new URL(request.url).searchParams.get('before')), { headers: communityHeaders }));
}
export async function POST(request: Request) {
  return communityRoute(request, async userId => {
    await sendMessage(userId, await communityBody(request));
    return Response.json(await readChat(userId), { headers: communityHeaders });
  });
}
