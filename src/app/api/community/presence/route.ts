import { authPool } from '@/lib/auth';
import { communityHeaders, communityRoute } from '@/lib/community-api';

async function countOnline() {
  const result = await authPool.query("SELECT count(*)::integer AS online FROM vien_presence WHERE last_seen > now()-interval '75 seconds'");
  return Response.json(result.rows[0], { headers: communityHeaders });
}
export async function GET(request: Request) { return communityRoute(request, countOnline); }
export async function POST(request: Request) {
  return communityRoute(request, async userId => {
    await authPool.query('INSERT INTO vien_presence (user_id,last_seen) VALUES ($1,now()) ON CONFLICT (user_id) DO UPDATE SET last_seen=now()', [userId]);
    return countOnline();
  });
}
