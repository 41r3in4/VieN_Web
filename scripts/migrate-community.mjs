import nextEnv from '@next/env';
import { Pool } from 'pg';
import { readFile } from 'node:fs/promises';

nextEnv.loadEnvConfig(process.cwd(), true);
if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL_MISSING');
const pool = new Pool({ connectionString: process.env.DATABASE_URL, connectionTimeoutMillis: 15000 });
let client;
try {
  client = await pool.connect();
  await client.query('BEGIN');
  await client.query(await readFile(new URL('../db/community.sql', import.meta.url), 'utf8'));
  await client.query('COMMIT');
  console.log('COMMUNITY_SCHEMA_READY');
} catch {
  if (client) await client.query('ROLLBACK');
  console.error('COMMUNITY_MIGRATION_FAILED');
  process.exitCode = 1;
} finally { client?.release(); await pool.end(); }
