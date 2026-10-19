import nextEnv from '@next/env';
import { getMigrations } from 'better-auth/db/migration';

nextEnv.loadEnvConfig(process.cwd(), true);
if (!process.env.DATABASE_URL || !process.env.BETTER_AUTH_SECRET) {
  throw new Error('Missing auth environment configuration.');
}
const { auth, authPool } = await import('../src/lib/auth.ts');
try {
  const plan = await getMigrations(auth.options);
  if (plan.unsafeChanges.length || plan.schemaProblems.length) {
    throw new Error('Schema requires manual review before migration.');
  }
  console.log('Auth tables to create:', plan.toBeCreated.map(t => t.table).join(', ') || 'none');
  await plan.runMigrations();
  console.log('AUTH_SCHEMA_READY');
} catch {
  console.error('AUTH_MIGRATION_FAILED: Check database access and schema compatibility.');
  process.exitCode = 1;
} finally { await authPool.end(); }
