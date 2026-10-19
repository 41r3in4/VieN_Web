import fs from 'node:fs/promises';
import { randomBytes } from 'node:crypto';
import nextEnv from '@next/env';

nextEnv.loadEnvConfig(process.cwd(), true);
if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL_MISSING');
let content = await fs.readFile('.env', 'utf8');
if (!process.env.BETTER_AUTH_SECRET?.trim()) {
  const line = `BETTER_AUTH_SECRET="${randomBytes(32).toString('hex')}"`;
  content = /^BETTER_AUTH_SECRET\s*=.*$/m.test(content)
    ? content.replace(/^BETTER_AUTH_SECRET\s*=.*$/m, line)
    : `${content.trimEnd()}\n${line}\n`;
} else if (process.env.BETTER_AUTH_SECRET.trim().length < 32) {
  throw new Error('BETTER_AUTH_SECRET must contain at least 32 characters.');
}
if (!process.env.BETTER_AUTH_URL?.trim()) content += '\nBETTER_AUTH_URL="http://localhost:3000"\n';
await fs.writeFile('.env', content);
console.log('Auth environment configured. Secret values are not displayed.');
