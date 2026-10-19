import { betterAuth } from 'better-auth';
import { Pool } from 'pg';

const globalDatabase = globalThis as typeof globalThis & { authPool?: Pool; authPoolConnection?: string };
const connection = process.env.DATABASE_URL;
const reusablePool = globalDatabase.authPoolConnection === connection ? globalDatabase.authPool : undefined;
if (!reusablePool && globalDatabase.authPool) void globalDatabase.authPool.end().catch(() => {});
export const authPool = reusablePool ?? new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 5,
  connectionTimeoutMillis: 15000,
  idleTimeoutMillis: 30000,
});
// A dropped idle Neon connection must not terminate the web process.
if (authPool.listenerCount('error') === 0) {
  authPool.on('error', () => { console.error('DATABASE_IDLE_CONNECTION_CLOSED: The next request will reconnect.'); });
}
if (process.env.NODE_ENV !== 'production') {
  globalDatabase.authPool = authPool;
  globalDatabase.authPoolConnection = connection;
}

export const auth = betterAuth({
  appName: 'VieN',
  database: authPool,
  emailAndPassword: { enabled: true, minPasswordLength: 8, maxPasswordLength: 128 },
});
