import nextEnv from '@next/env';
import { Pool } from 'pg';

nextEnv.loadEnvConfig(process.cwd(), true);
const pool = new Pool({ connectionString: process.env.DATABASE_URL, connectionTimeoutMillis: 15000 });
try {
  const result = await pool.query(`SELECT u.name, count(e.target_id)::integer AS completed_challenges
    FROM "user" u JOIN vien_progress_events e ON e.user_id=u.id AND e.kind='checkpoint'
    GROUP BY u.id,u.name ORDER BY u.name`);
  console.log(JSON.stringify({ participatingAccounts: result.rows }, null, 2));
} finally { await pool.end(); }
