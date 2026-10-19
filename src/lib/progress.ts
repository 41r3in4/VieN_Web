import { authPool } from '@/lib/auth';
import { DESTINATIONS } from '@/data/destinations';
import { ALL_BADGES } from '@/data/leaderboardData';
import type { PersonaId } from '@/types';
import type { ProgressSnapshot } from '@/types/progress';

const personas = ['historian', 'explorer', 'artisan'];
export class ProgressInputError extends Error {}
export interface EventRow { kind: string; target_id: string; payload: { score?: number; total?: number; persona?: PersonaId; reflection?: string; riddleCorrect?: boolean }; created_at: Date }

export async function readProgress(userId: string): Promise<ProgressSnapshot> {
  const [events, preferences, days] = await Promise.all([
    authPool.query<EventRow>('SELECT kind, target_id, payload, created_at FROM vien_progress_events WHERE user_id = $1 ORDER BY created_at DESC, target_id', [userId]),
    authPool.query('SELECT persona FROM vien_user_preferences WHERE user_id = $1', [userId]),
    authPool.query<{ day: string }>('SELECT activity_day::text AS day FROM vien_activity_days WHERE user_id = $1 ORDER BY activity_day', [userId]),
  ]);
  return summarizeProgress(events.rows, preferences.rows[0]?.persona ?? 'historian', days.rows.map(row => row.day));
}

export function summarizeProgress(eventRows: EventRow[], persona: PersonaId, dayStrings: string[]): ProgressSnapshot {
  const completed = eventRows.filter(e => e.kind === 'checkpoint');
  const completedIds = completed.map(e => e.target_id);
  const finishedDestinations = DESTINATIONS.filter(d => d.checkpoints.every(cp => completedIds.includes(cp.id)));
  const badgeIds = ALL_BADGES.filter(b => b.destinationId && finishedDestinations.some(d => d.id === b.destinationId)).map(b => b.id);
  const solvedTypes = new Set(completed.filter(e => e.payload.riddleCorrect).flatMap(e => DESTINATIONS.flatMap(d => d.checkpoints.filter(cp => cp.id === e.target_id).map(cp => cp.riddle.type))));
  const hanNomCheckpoints = DESTINATIONS.flatMap(d => d.checkpoints.filter(cp => cp.riddle.type === 'han-nom'));
  if (hanNomCheckpoints.length && hanNomCheckpoints.every(cp => completed.some(e => e.target_id === cp.id && e.payload.riddleCorrect))) badgeIds.push('badge-han-nom');
  if (solvedTypes.has('spatial-angle')) badgeIds.push('badge-explorer-lens');
  if (solvedTypes.has('sculpture-relic')) badgeIds.push('badge-sculpture');
  const day = (date: Date) => new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Bangkok', year: 'numeric', month: '2-digit', day: '2-digit' }).format(date);
  const activityDays = new Set(dayStrings);
  let streak = 0;
  const cursor = new Date();
  if (!activityDays.has(day(cursor))) cursor.setUTCDate(cursor.getUTCDate() - 1);
  while (activityDays.has(day(cursor))) { streak++; cursor.setUTCDate(cursor.getUTCDate() - 1); }
  let longestStreak = 0;
  let run = 0;
  let previousDay = 0;
  for (const date of [...dayStrings].sort()) {
    const time = Date.parse(`${date}T00:00:00Z`);
    run = time - previousDay === 86400000 ? run + 1 : 1;
    longestStreak = Math.max(longestStreak, run);
    previousDay = time;
  }
  if (longestStreak >= 7) badgeIds.push('badge-streak-master');
  const perfectDestinations = DESTINATIONS.filter(d => completed.some(e => d.checkpoints.some(cp => cp.id === e.target_id) && e.payload.total && e.payload.score === e.payload.total));
  const loreIds = [...new Set([...finishedDestinations, ...perfectDestinations].map(d => d.hiddenLoreId).filter(Boolean))];
  let exp = 0;
  const journeyEntries = completed.flatMap(e => {
    const destination = DESTINATIONS.find(d => d.checkpoints.some(cp => cp.id === e.target_id));
    const checkpoint = destination?.checkpoints.find(cp => cp.id === e.target_id);
    if (!destination || !checkpoint) return [];
    exp += checkpoint.expReward;
    return [{ id: `journey-${checkpoint.id}`, timestamp: new Date(e.created_at).toLocaleString('vi-VN', { timeZone: 'Asia/Bangkok' }), destinationId: destination.id, destinationName: destination.name, checkpointName: checkpoint.name, personaUsed: e.payload.persona ?? 'historian' as PersonaId, expGained: checkpoint.expReward, quizScore: `${e.payload.score ?? 0}/${e.payload.total ?? 0}`, reflection: e.payload.reflection ?? '' }];
  });
  return {
    userExp: exp, userStreak: streak, selectedPersona: persona, completedCheckpointIds: completedIds,
    listenedCheckpointIds: eventRows.filter(e => e.kind === 'audio').map(e => e.target_id), watchedDestinationIds: eventRows.filter(e => e.kind === 'trailer').map(e => e.target_id),
    unlockedBadgeIds: badgeIds, unlockedLoreIds: loreIds, journeyEntries,
    challengeScore: completed.reduce((sum, e) => sum + (e.payload.score ?? 0), 0), challengeTotal: completed.reduce((sum, e) => sum + (e.payload.total ?? 0), 0),
  };
}

export async function saveProgressEvent(userId: string, body: Record<string, unknown>) {
  const { kind, targetId } = body;
  if (kind === 'persona') {
    if (typeof body.persona !== 'string' || !personas.includes(body.persona)) throw new ProgressInputError();
    await authPool.query('INSERT INTO vien_user_preferences (user_id, persona) VALUES ($1, $2) ON CONFLICT (user_id) DO UPDATE SET persona = EXCLUDED.persona', [userId, body.persona]);
    return;
  }
  if (typeof targetId !== 'string' || !['checkpoint', 'audio', 'trailer'].includes(String(kind))) throw new ProgressInputError();
  const destination = DESTINATIONS.find(d => kind === 'trailer' ? d.id === targetId : d.checkpoints.some(cp => cp.id === targetId));
  if (!destination) throw new ProgressInputError();
  const checkpoint = destination.checkpoints.find(cp => cp.id === targetId);
  let payload = {};
  if (kind === 'checkpoint') {
    const answers = body.answers;
    if (!checkpoint || !Array.isArray(answers) || answers.length !== checkpoint.quizzes.length || !answers.every((answer, i) => Number.isInteger(answer) && answer >= 0 && answer < checkpoint.quizzes[i].options.length) || !checkpoint.riddle.options.some(o => o.id === body.riddleAnswer)) throw new ProgressInputError();
    payload = { score: answers.filter((answer, i) => answer === checkpoint.quizzes[i].correctIndex).length, total: checkpoint.quizzes.length, riddleCorrect: checkpoint.riddle.options.some(o => o.id === body.riddleAnswer && o.isCorrect), persona: personas.includes(String(body.persona)) ? body.persona : 'historian', reflection: typeof body.reflection === 'string' ? body.reflection.slice(0, 2000) : '' };
  }
  const client = await authPool.connect();
  try {
    await client.query('BEGIN');
    await client.query('INSERT INTO vien_progress_events (user_id, kind, target_id, payload) VALUES ($1, $2, $3, $4) ON CONFLICT (user_id, kind, target_id) DO NOTHING', [userId, kind, targetId, JSON.stringify(payload)]);
    await client.query("INSERT INTO vien_activity_days (user_id, activity_day) VALUES ($1, (CURRENT_TIMESTAMP AT TIME ZONE 'Asia/Bangkok')::date) ON CONFLICT DO NOTHING", [userId]);
    await client.query('COMMIT');
  } catch (error) { await client.query('ROLLBACK'); throw error; }
  finally { client.release(); }
}

export async function clearProgress(userId: string) {
  const client = await authPool.connect();
  try {
    await client.query('BEGIN');
    await client.query('DELETE FROM vien_progress_events WHERE user_id = $1', [userId]);
    await client.query('DELETE FROM vien_activity_days WHERE user_id = $1', [userId]);
    await client.query('COMMIT');
  } catch (error) { await client.query('ROLLBACK'); throw error; }
  finally { client.release(); }
}
