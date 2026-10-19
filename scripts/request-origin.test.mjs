import test from 'node:test';
import assert from 'node:assert/strict';
import { hasValidOrigin } from '../src/lib/request-origin.ts';

test('validates the public origin behind a proxy without trusting forwarded headers', () => {
  const previous = process.env.BETTER_AUTH_URL;
  try {
    process.env.BETTER_AUTH_URL = 'https://vien-web.onrender.com';
    const request = origin => new Request('http://0.0.0.0:10000/api/progress', { headers: { ...(origin ? { origin } : {}), 'x-forwarded-host': 'attacker.example', 'x-forwarded-proto': 'https' } });
    assert.equal(hasValidOrigin(request('https://vien-web.onrender.com')), true);
    for (const origin of ['https://attacker.example', 'http://vien-web.onrender.com', 'null', undefined]) assert.equal(hasValidOrigin(request(origin)), false);
    delete process.env.BETTER_AUTH_URL;
    assert.equal(hasValidOrigin(new Request('http://localhost:3000/api/progress', { headers: { origin: 'http://localhost:3000' } })), true);
    process.env.BETTER_AUTH_URL = 'invalid';
    assert.equal(hasValidOrigin(request('https://vien-web.onrender.com')), false);
  } finally {
    if (previous === undefined) delete process.env.BETTER_AUTH_URL;
    else process.env.BETTER_AUTH_URL = previous;
  }
});
