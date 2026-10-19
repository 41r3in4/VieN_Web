import { authPool } from '@/lib/auth';
import { DESTINATIONS } from '@/data/destinations';
import { PERSONAS } from '@/data/personas';
import { summarizeProgress, type EventRow } from '@/lib/progress';
import type { PersonaId } from '@/types';
import type { LeaderboardPeriod, LeaderboardResponse } from '@/types/community';

interface RankRow { id: string; name: string; updated: Date; persona: PersonaId; rank: string; exp: string; total: string; above: string | null }
export async function readLeaderboard(userId: string, period: LeaderboardPeriod): Promise<LeaderboardResponse> {
  const rewards = DESTINATIONS.flatMap(d => d.checkpoints.map(cp => ({ id: cp.id, exp: cp.expReward })));
  const result = await authPool.query<RankRow>(`
    WITH rewards AS (SELECT * FROM jsonb_to_recordset($1::jsonb) AS r(id text, exp integer)),
    scores AS (
      SELECT e.user_id, sum(r.exp) AS exp FROM vien_progress_events e
      JOIN rewards r ON r.id=e.target_id
      WHERE e.kind='checkpoint' AND e.created_at >= COALESCE(
        date_trunc($2::text, now() AT TIME ZONE 'Asia/Bangkok') AT TIME ZONE 'Asia/Bangkok', '-infinity'::timestamptz)
      GROUP BY e.user_id HAVING sum(r.exp) > 0
    ), ranked AS (
      SELECT u.id, u.name, u."updatedAt" AS updated, COALESCE(p.persona,'historian') AS persona,
        COALESCE(s.exp,0)::bigint AS exp,
        row_number() OVER (ORDER BY COALESCE(s.exp,0) DESC, u."createdAt", u.id) AS rank,
        lag(COALESCE(s.exp,0)) OVER (ORDER BY COALESCE(s.exp,0) DESC, u."createdAt", u.id) AS above,
        count(*) OVER () AS total
      FROM "user" u JOIN scores s ON s.user_id=u.id
      LEFT JOIN vien_user_preferences p ON p.user_id=u.id
    ) SELECT * FROM ranked WHERE rank <= 50 OR id=$3 ORDER BY rank
  `, [JSON.stringify(rewards), period === 'all' ? null : period, userId]);
  const ids = result.rows.map(row => row.id);
  const [events, days] = await Promise.all([
    authPool.query<EventRow & { user_id: string }>('SELECT user_id, kind, target_id, payload, created_at FROM vien_progress_events WHERE user_id=ANY($1::text[]) ORDER BY created_at DESC', [ids]),
    authPool.query<{ user_id: string; day: string }>('SELECT user_id, activity_day::text AS day FROM vien_activity_days WHERE user_id=ANY($1::text[]) ORDER BY activity_day', [ids]),
  ]);
  const members = result.rows.map(row => {
    const progress = summarizeProgress(events.rows.filter(e => e.user_id === row.id), row.persona, days.rows.filter(d => d.user_id === row.id).map(d => d.day));
    return { id: row.id, name: row.name, avatar: `/api/community/avatar/${encodeURIComponent(row.id)}?v=${new Date(row.updated).getTime()}`, role: PERSONAS.find(p => p.id === row.persona)?.title ?? 'Thành viên VieN', rank: Number(row.rank), exp: Number(row.exp), badgesCount: progress.unlockedBadgeIds.length, isCurrentUser: row.id === userId, recentAchievement: progress.journeyEntries[0]?.checkpointName ?? 'Bắt đầu hành trình di sản' };
  });
  const ownRow = result.rows.find(row => row.id === userId);
  return { users: members.filter(member => member.rank <= 50), currentUser: members.find(member => member.id === userId) ?? null, totalUsers: Number(result.rows[0]?.total ?? 0), nextRankExp: ownRow?.above === null || !ownRow ? null : Math.max(1, Number(ownRow.above) - Number(ownRow.exp) + 1) };
}
