import { hasValidOrigin } from '@/lib/request-origin';
import { auth } from '@/lib/auth';
import { readProgress, saveProgressEvent, clearProgress, ProgressInputError } from '@/lib/progress';

const noStore = { 'Cache-Control': 'private, no-store' };
export async function GET(request: Request) {
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session) return Response.json({ error: 'UNAUTHORIZED' }, { status: 401 });
  return Response.json(await readProgress(session.user.id), { headers: noStore });
}
export async function POST(request: Request) {
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session) return Response.json({ error: 'UNAUTHORIZED' }, { status: 401 });
  if (!hasValidOrigin(request)) return Response.json({ error: 'INVALID_ORIGIN' }, { status: 403 });
  try {
    const text = await request.text();
    if (text.length > 10000) return Response.json({ error: 'REQUEST_TOO_LARGE' }, { status: 413 });
    const body = JSON.parse(text);
    if (!body || typeof body !== 'object' || Array.isArray(body)) throw new ProgressInputError();
    await saveProgressEvent(session.user.id, body);
    return Response.json(await readProgress(session.user.id), { headers: noStore });
  } catch (error) {
    return Response.json({ error: error instanceof ProgressInputError || error instanceof SyntaxError ? 'INVALID_PROGRESS' : 'SAVE_FAILED' }, { status: error instanceof ProgressInputError || error instanceof SyntaxError ? 400 : 503 });
  }
}
export async function DELETE(request: Request) {
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session) return Response.json({ error: 'UNAUTHORIZED' }, { status: 401 });
  if (!hasValidOrigin(request)) return Response.json({ error: 'INVALID_ORIGIN' }, { status: 403 });
  await clearProgress(session.user.id);
  return Response.json(await readProgress(session.user.id), { headers: noStore });
}
