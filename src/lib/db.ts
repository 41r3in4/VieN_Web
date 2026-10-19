import { neon } from '@neondatabase/serverless';

/** Call only from server code; never expose the connection URL to the browser. */
export function getDatabase() {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error('DATABASE_URL_MISSING');
  return neon(url);
}
