import nextEnv from '@next/env';
import { randomBytes, randomUUID } from 'node:crypto';
import assert from 'node:assert/strict';

nextEnv.loadEnvConfig(process.cwd(), true);
const { auth, authPool } = await import('../src/lib/auth.ts');
const origin = new URL(process.env.BETTER_AUTH_URL).origin;
const accounts = [];
async function account(label) {
  const email = `vien-community-${randomUUID()}@example.com`;
  const response = await auth.handler(new Request(`${origin}/api/auth/sign-up/email`, { method: 'POST', headers: { origin, 'Content-Type': 'application/json' }, body: JSON.stringify({ name: label, email, password: randomBytes(24).toString('hex') }) }));
  assert.equal(response.status, 200);
  const { user } = await response.json();
  const result = { id: user.id, email, name: label, cookie: response.headers.getSetCookie().map(c => c.split(';')[0]).join('; ') };
  accounts.push(result);
  return result;
}
async function request(path, cookie, body, method = 'GET', includeOrigin = true) {
  return fetch(`${origin}${path}`, { method, headers: { cookie, 'Content-Type': 'application/json', ...(includeOrigin ? { origin } : {}) }, ...(body === undefined ? {} : { body: JSON.stringify(body) }) });
}
async function json(response) { assert.equal(response.status, 200); return response.json(); }
let step = 'authorization';
try {
  const previousTests = await authPool.query("SELECT id,email FROM \"user\" WHERE email ~ '^vien-community-[0-9a-f-]{36}@example[.]com$' AND name IN ('Community test A','Community test B')");
  accounts.push(...previousTests.rows);
  for (const path of ['/api/leaderboard', '/api/community/chat', '/api/community/presence']) assert.equal((await fetch(`${origin}${path}`)).status, 401);
  const a = await account('Community test A');
  const b = await account('Community test B');
  step = 'leaderboard';
  const unranked = await json(await request('/api/leaderboard?period=all', a.cookie));
  assert.equal(unranked.currentUser, null);
  assert.ok(!unranked.users.some(user => user.id === a.id || user.id === b.id));
  const destinations = await json(await request('/api/destinations', a.cookie));
  const cp = destinations[0].checkpoints[0];
  const checkpoint = { kind: 'checkpoint', targetId: cp.id, answers: cp.quizzes.map(q => q.correctIndex), riddleAnswer: cp.riddle.options.find(o => o.isCorrect).id, persona: 'historian' };
  await json(await request('/api/progress', a.cookie, checkpoint, 'POST'));
  await json(await request('/api/progress', b.cookie, checkpoint, 'POST'));
  await authPool.query("UPDATE vien_progress_events SET created_at=(date_trunc('month',now() AT TIME ZONE 'Asia/Bangkok')-interval '1 day') AT TIME ZONE 'Asia/Bangkok' WHERE user_id=$1", [a.id]);
  const all = await json(await request('/api/leaderboard?period=all', a.cookie));
  const month = await json(await request('/api/leaderboard?period=month', a.cookie));
  const week = await json(await request('/api/leaderboard?period=week', b.cookie));
  assert.equal(all.currentUser.id, a.id);
  assert.equal(all.currentUser.exp, cp.expReward);
  assert.equal(month.currentUser, null);
  assert.equal(week.currentUser.exp, cp.expReward);
  assert.ok(!JSON.stringify(all).includes(a.email));
  const storedIds = (await authPool.query('SELECT id FROM "user"')).rows.map(row => row.id);
  assert.ok(all.users.every(user => storedIds.includes(user.id)));
  assert.ok(all.users.every(user => user.exp > 0));
  assert.ok(week.users.every(user => user.exp > 0));
  assert.ok(!month.users.some(user => user.id === a.id));
  assert.equal((await request('/api/leaderboard?period=invalid', a.cookie)).status, 400);
  console.log('PASS: authenticated leaderboard uses real accounts, server EXP and period boundaries; no email exposure');

  if (!process.argv.includes('--leaderboard-only')) {
  step = 'messages';
  const clientId = randomUUID();
  const message = { text: 'Temporary integration test <script>plain text</script>', clientId, sender: 'Spoofed sender', userId: b.id };
  const sent = await json(await request('/api/community/chat', a.cookie, message, 'POST'));
  const ownMessage = sent.messages.find(item => item.text === message.text && item.isSelf);
  assert.ok(ownMessage);
  assert.equal(ownMessage.sender, a.name);
  await json(await request('/api/community/chat', a.cookie, message, 'POST'));
  assert.equal((await authPool.query('SELECT count(*)::integer AS n FROM vien_chat_messages WHERE user_id=$1 AND client_id=$2', [a.id, clientId])).rows[0].n, 1);
  const seen = await json(await request('/api/community/chat', b.cookie));
  assert.equal(seen.messages.find(item => item.id === ownMessage.id).isSelf, false);
  assert.equal((await request('/api/community/chat', a.cookie, { text: '', clientId: randomUUID() }, 'POST')).status, 400);
  assert.equal((await request('/api/community/chat', a.cookie, message, 'POST', false)).status, 403);
  console.log('PASS: shared persisted chat, authenticated sender, retry deduplication, validation and origin protection');

  step = 'likes';
  for (let index = 0; index < 2; index++) {
    const liked = await json(await request('/api/community/likes', b.cookie, { messageId: ownMessage.id, liked: true, userId: a.id }, 'POST'));
    assert.equal(liked.likes, 1);
  }
  const afterLike = await json(await request('/api/community/chat', b.cookie));
  assert.equal(afterLike.messages.find(item => item.id === ownMessage.id).hasLiked, true);
  assert.equal((await json(await request('/api/community/likes', b.cookie, { messageId: ownMessage.id, liked: false }, 'POST'))).likes, 0);
  console.log('PASS: real per-user likes, idempotent retry and unlike');

  step = 'photos and avatars';
  const photo = 'data:image/webp;base64,UklGRiIAAABXRUJQVlA4IBYAAAAwAQCdASoBAAEADsD+JaQAA3AAAAAA';
  const photoMessage = await json(await request('/api/community/chat', b.cookie, { text: '', photo, clientId: randomUUID() }, 'POST'));
  const attachment = photoMessage.messages.find(item => item.isSelf && item.photoUrl);
  assert.ok(attachment);
  assert.equal((await fetch(`${origin}${attachment.photoUrl}`)).status, 401);
  const storedPhoto = await request(attachment.photoUrl, a.cookie);
  assert.equal(storedPhoto.status, 200);
  assert.equal(storedPhoto.headers.get('content-type'), 'image/webp');
  await json(await request('/api/profile/avatar', a.cookie, { image: photo }, 'POST'));
  const latest = await json(await request('/api/community/chat', b.cookie));
  const author = latest.messages.find(item => item.id === ownMessage.id);
  assert.equal((await request(author.avatar, b.cookie)).status, 200);
  console.log('PASS: real photo attachment and current avatar; media requires authentication');

  step = 'pagination and rate limit';
  await authPool.query(`INSERT INTO vien_chat_messages(id,user_id,client_id,content,created_at)
    SELECT 'test-'||$1||'-'||i,$1,'test-page-'||i,'Temporary pagination test',now()-i*interval '1 minute'
    FROM generate_series(1,35) AS i`, [b.id]);
  const firstPage = await json(await request('/api/community/chat', a.cookie));
  assert.equal(firstPage.hasMore, true);
  const nextPage = await json(await request(`/api/community/chat?before=${firstPage.messages[0].id}`, a.cookie));
  assert.ok(nextPage.messages.length > 0);
  assert.ok(nextPage.messages.every(item => !firstPage.messages.some(first => first.id === item.id)));
  await authPool.query('UPDATE vien_chat_messages SET created_at=now() WHERE id=$1', [ownMessage.id]);
  assert.equal((await request('/api/community/chat', a.cookie, { text: 'Temporary rate limit test', clientId: randomUUID() }, 'POST')).status, 429);
  console.log('PASS: persisted history pagination and server message rate limit');

  step = 'presence';
  assert.ok((await json(await request('/api/community/presence', a.cookie, undefined, 'POST'))).online >= 1);
  assert.ok((await authPool.query("SELECT 1 FROM vien_presence WHERE user_id=$1 AND last_seen > now()-interval '75 seconds'", [a.id])).rowCount);
  console.log('PASS: active-member count comes from authenticated database heartbeats');
  }
} catch {
  console.error(`COMMUNITY_CHECK_FAILED at ${step}. No credentials or private data are logged.`);
  process.exitCode = 1;
} finally {
  for (const account of accounts) await authPool.query('DELETE FROM "user" WHERE id=$1 AND email=$2', [account.id, account.email]);
  await authPool.end();
  console.log('Temporary accounts, messages, likes, presence and progress removed.');
}
