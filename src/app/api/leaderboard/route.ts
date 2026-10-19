import { auth } from '@/lib/auth';
import { readLeaderboard } from '@/lib/leaderboard';
import type { LeaderboardPeriod } from '@/types/community';

export async function GET(request: Request) {
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session) return Response.json({ error: 'UNAUTHORIZED' }, { status: 401 });
  const period = new URL(request.url).searchParams.get('period') ?? 'week';
  if (!['week', 'month', 'all'].includes(period)) return Response.json({ error: 'INVALID_PERIOD' }, { status: 400 });
  return Response.json(await readLeaderboard(session.user.id, period as LeaderboardPeriod), { headers: { 'Cache-Control': 'private, no-store' } });
}
