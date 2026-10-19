import nextEnv from '@next/env';
import { Pool } from 'pg';

nextEnv.loadEnvConfig(process.cwd(), true);
const index = process.argv.indexOf('--email');
const email = process.argv[index + 1]?.trim().toLowerCase();
if (index < 0 || !email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
  console.error('Usage: npm run admin:grant -- --email YOUR_REGISTERED_EMAIL');
  process.exit(1);
}
const pool = new Pool({ connectionString: process.env.DATABASE_URL, connectionTimeoutMillis: 15000 });
try {
  const found = await pool.query('SELECT id FROM "user" WHERE lower(email)=$1', [email]);
  if (found.rowCount !== 1) throw new Error('REGISTERED_ACCOUNT_NOT_FOUND');
  await pool.query('INSERT INTO vien_admins (user_id) VALUES ($1) ON CONFLICT DO NOTHING', [found.rows[0].id]);
  console.log('ADMIN_ROLE_GRANTED: This registered account can now manage destination media.');
} catch {
  console.error('ADMIN_GRANT_FAILED: Check the registered email and run media:migrate first.');
  process.exitCode = 1;
} finally { await pool.end(); }
