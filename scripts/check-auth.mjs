import nextEnv from '@next/env';
import { randomBytes, randomUUID } from 'node:crypto';
import assert from 'node:assert/strict';

nextEnv.loadEnvConfig(process.cwd(), true);
const { auth, authPool } = await import('../src/lib/auth.ts');
const email = `vien-auth-test-${randomUUID()}@example.com`;
const password = randomBytes(24).toString('hex');
const origin = new URL(process.env.BETTER_AUTH_URL).origin;
const web = process.argv.includes('--web');
let createdUserId;

async function call(path, body, cookie) {
  const headers = { origin, 'content-type': 'application/json' };
  if (cookie) headers.cookie = cookie;
  const request = new Request(`${origin}/api/auth/${path}`, {
    method: body ? 'POST' : 'GET', headers,
    ...(body ? { body: JSON.stringify(body) } : {}),
  });
  return web ? fetch(request) : auth.handler(request);
}
function cookies(response) {
  return response.headers.getSetCookie().map(c => c.split(';')[0]).join('; ');
}

try {
  if (web) {
    assert.equal((await fetch(origin)).status, 200);
    const locked = await fetch(`${origin}/experience?tab=explore`, { redirect: 'manual' });
    assert.equal(locked.status, 307);
    assert.ok(locked.headers.get('location')?.startsWith('/sign-up?next='));
    assert.equal((await fetch(`${origin}/api/destinations`)).status, 401);
    const legacy = await fetch(`${origin}/landing/index.html`);
    assert.ok(!(await legacy.text()).includes('VIEN_DATA'));
    console.log('PASS: public introduction; experience and destination API require login');
  }
  const signup = await call('sign-up/email', { name: 'VieN test account', email, password });
  assert.equal(signup.status, 200, 'Sign-up must succeed');
  const signupData = await signup.json();
  createdUserId = signupData.user.id;
  const signupCookie = cookies(signup);
  assert.ok(signupCookie, 'Sign-up must set session cookies');
  const stored = await authPool.query('SELECT password FROM account WHERE "userId" = $1', [createdUserId]);
  assert.equal(stored.rows.length, 1);
  assert.ok(stored.rows[0].password && stored.rows[0].password !== password, 'Password must be hashed');
  const current = await call('get-session', undefined, signupCookie);
  assert.equal((await current.json()).user.id, createdUserId);
  if (web) {
    const headers = { cookie: signupCookie };
    assert.equal((await fetch(`${origin}/experience`, { headers, redirect: 'manual' })).status, 200);
    assert.equal((await fetch(`${origin}/api/destinations`, { headers })).status, 200);
    const repeatSignup = await fetch(`${origin}/sign-up?next=${encodeURIComponent('/experience?tab=explore')}`, { headers, redirect: 'manual' });
    assert.equal(repeatSignup.status, 307);
    assert.equal(repeatSignup.headers.get('location'), '/experience?tab=explore');
    console.log('PASS: authenticated member can explore and skips registration');
  }
  console.log('PASS: sign-up, password hashing, authenticated session');

  const signout = await call('sign-out', {}, signupCookie);
  assert.equal(signout.status, 200);
  const revoked = await call('get-session', undefined, signupCookie);
  assert.equal(await revoked.json(), null);
  if (web) assert.equal((await fetch(`${origin}/api/destinations`, { headers: { cookie: signupCookie } })).status, 401);
  console.log('PASS: sign-out revokes session');

  const wrong = await call('sign-in/email', { email, password: 'incorrect-test-password' });
  assert.equal(wrong.status, 401);
  const signin = await call('sign-in/email', { email, password });
  assert.equal(signin.status, 200);
  const restored = await call('get-session', undefined, cookies(signin));
  assert.equal((await restored.json()).user.id, createdUserId);
  console.log('PASS: incorrect password rejected; valid sign-in restores session');
} catch {
  console.error('AUTH_CHECK_FAILED: Auth flow did not pass. No credentials are logged.');
  process.exitCode = 1;
} finally {
  // Delete only the temporary account created by this run.
  if (!createdUserId) {
    const found = await authPool.query('SELECT id FROM "user" WHERE email = $1', [email]);
    createdUserId = found.rows[0]?.id;
  }
  if (createdUserId) {
    const client = await authPool.connect();
    try {
      await client.query('BEGIN');
      await client.query('DELETE FROM session WHERE "userId" = $1', [createdUserId]);
      await client.query('DELETE FROM account WHERE "userId" = $1', [createdUserId]);
      await client.query('DELETE FROM "user" WHERE id = $1 AND email = $2', [createdUserId, email]);
      await client.query('COMMIT');
      console.log('Temporary test account removed.');
    } catch {
      await client.query('ROLLBACK');
      console.error('TEST_CLEANUP_FAILED');
      process.exitCode = 1;
    } finally { client.release(); }
  }
  await authPool.end();
}
