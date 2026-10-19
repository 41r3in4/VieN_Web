import nextEnv from '@next/env';
import { Pool } from 'pg';
import { readFile } from 'node:fs/promises';

nextEnv.loadEnvConfig(process.cwd(), true);
if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL_MISSING');
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const client = await pool.connect();
try {
  await client.query('BEGIN');
  await client.query(await readFile(new URL('../db/progress.sql', import.meta.url), 'utf8'));
  await client.query('COMMIT');
  const verified = await client.query("SELECT to_regclass('vien_progress_events') IS NOT NULL AND to_regclass('vien_user_preferences') IS NOT NULL AND to_regclass('vien_activity_days') IS NOT NULL AS ready");
  if (!verified.rows[0]?.ready) throw new Error('SCHEMA_NOT_READY');
  console.log('PROGRESS_SCHEMA_READY');
} catch {
  await client.query('ROLLBACK');
  console.error('PROGRESS_MIGRATION_FAILED');
  process.exitCode = 1;
} finally { client.release(); await pool.end(); }
