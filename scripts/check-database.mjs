import nextEnv from '@next/env';
import { neon } from '@neondatabase/serverless';

nextEnv.loadEnvConfig(process.cwd(), true);

if (!process.env.DATABASE_URL) {
  console.error('DATABASE_URL_MISSING: Add DATABASE_URL to .env.');
  process.exitCode = 1;
} else {
  try {
    const sql = neon(process.env.DATABASE_URL);
    await sql`SELECT 1 AS connected`;
    console.log('DATABASE_CONNECTED: Neon connection successful.');
  } catch (error) {
    // Do not log the error object: it may contain connection credentials.
    const code = typeof error?.code === 'string' && /^[A-Z0-9_]+$/.test(error.code)
      ? error.code : 'CONNECTION_FAILED';
    console.error(`DATABASE_CHECK_FAILED (${code}): Check credentials and network.`);
    process.exitCode = 1;
  }
}
