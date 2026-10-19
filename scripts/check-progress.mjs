import nextEnv from '@next/env';
import { randomBytes, randomUUID } from 'node:crypto';
import assert from 'node:assert/strict';

nextEnv.loadEnvConfig(process.cwd(), true);
const { auth, authPool } = await import('../src/lib/auth.ts');
const origin = new URL(process.env.BETTER_AUTH_URL).origin;
const users = [];
async function account() {
  const email = `vien-progress-${randomUUID()}@example.com`;
  const response = await auth.handler(new Request(`${origin}/api/auth/sign-up/email`, { method: 'POST', headers: { origin, 'Content-Type': 'application/json' }, body: JSON.stringify({ name: 'Progress test', email, password: randomBytes(24).toString('hex') }) }));
  assert.equal(response.status, 200);
  const { user } = await response.json();
  users.push({ id: user.id, email });
  return response.headers.getSetCookie().map(c => c.split(';')[0]).join('; ');
}
async function request(path, cookie, body, method = 'POST') {
  return fetch(`${origin}${path}`, { method, headers: { origin, cookie, 'Content-Type': 'application/json' }, ...(body !== undefined ? { body: JSON.stringify(body) } : {}) });
}
try {
  assert.equal((await fetch(`${origin}/api/progress`)).status, 401);
  assert.equal((await request('/api/profile/avatar', '', { image: null })).status, 401);
  const cookie = await account();
  const otherCookie = await account();
  const destinations = await (await request('/api/destinations', cookie, undefined, 'GET')).json();
  const checkpoint = destinations[0].checkpoints[0];
  const event = { kind: 'checkpoint', targetId: checkpoint.id, answers: checkpoint.quizzes.map(q => q.correctIndex), riddleAnswer: checkpoint.riddle.options.find(o => o.isCorrect).id, persona: 'historian', userExp: 10000000 };
  const completions = await Promise.all([request('/api/progress', cookie, event), request('/api/progress', cookie, event)]);
  assert.ok(completions.every(r => r.status === 200));
  let progress = await (await request('/api/progress', cookie, undefined, 'GET')).json();
  assert.equal(progress.userExp, checkpoint.expReward);
  assert.equal(progress.completedCheckpointIds.length, 1);
  assert.equal(progress.challengeScore, checkpoint.quizzes.length);
  assert.equal(progress.challengeTotal, checkpoint.quizzes.length);
  assert.equal(progress.userStreak, 1);
  assert.equal((await request('/experience?tab=profile', cookie, undefined, 'GET')).status, 200);
  console.log('PASS: server scoring, concurrent duplicate protection, EXP, challenge results, streak');
  const invalid = await request('/api/progress', cookie, { ...event, targetId: 'not-a-checkpoint' });
  assert.equal(invalid.status, 400);
  await request('/api/progress', cookie, { kind: 'audio', targetId: checkpoint.id });
  await request('/api/progress', cookie, { kind: 'audio', targetId: checkpoint.id });
  await request('/api/progress', cookie, { kind: 'trailer', targetId: destinations[0].id });
  await request('/api/progress', cookie, { kind: 'persona', persona: 'explorer' });
  progress = await (await request('/api/progress', cookie, undefined, 'GET')).json();
  assert.equal(progress.listenedCheckpointIds.length, 1);
  assert.equal(progress.watchedDestinationIds.length, 1);
  assert.equal(progress.selectedPersona, 'explorer');
  assert.equal(progress.journeyEntries.length, 1);
  const isolated = await (await request('/api/progress', otherCookie, undefined, 'GET')).json();
  assert.equal(isolated.userExp, 0);
  assert.equal(isolated.listenedCheckpointIds.length, 0);
  console.log('PASS: persisted listening/video activity, persona, journal, per-user isolation');
  const webp = 'data:image/webp;base64,UklGRiIAAABXRUJQVlA4IBYAAAAwAQCdASoBAAEADsD+JaQAA3AAAAAA';
  assert.equal((await request('/api/profile/avatar', cookie, { image: webp })).status, 200);
  const updated = await authPool.query('SELECT image FROM "user" WHERE id=$1', [users[0].id]);
  assert.equal(updated.rows[0].image, webp);
  const sessionResponse = await request('/api/auth/get-session', cookie, undefined, 'GET');
  assert.equal((await sessionResponse.json()).user.image, webp);
  const other = await authPool.query('SELECT image FROM "user" WHERE id=$1', [users[1].id]);
  assert.equal(other.rows[0].image, null);
  assert.equal((await request('/api/profile/avatar', cookie, { image: 'data:image/svg+xml;base64,PHN2Zz4=' })).status, 400);
  assert.equal((await request('/api/profile/avatar', cookie, { image: null })).status, 200);
  console.log('PASS: avatar save/removal, invalid image rejection, avatar isolation');
  const reset = await request('/api/progress', cookie, undefined, 'DELETE');
  assert.equal(reset.status, 200);
  assert.equal((await reset.json()).userExp, 0);
  console.log('PASS: reset only affects authenticated user');
} catch {
  console.error('PROGRESS_CHECK_FAILED: Check API behavior. Credentials are not logged.');
  process.exitCode = 1;
} finally {
  for (const user of users) await authPool.query('DELETE FROM "user" WHERE id=$1 AND email=$2', [user.id, user.email]);
  await authPool.end();
  console.log('Temporary test accounts and their activity removed.');
}
