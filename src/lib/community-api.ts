import { auth } from '@/lib/auth';
import { CommunityError } from '@/lib/community';

export async function communityRoute(request: Request, action: (userId: string) => Promise<Response>) {
  try {
    const session = await auth.api.getSession({ headers: request.headers });
    if (!session) return Response.json({ error: 'UNAUTHORIZED' }, { status: 401 });
    if (request.method !== 'GET' && request.headers.get('origin') !== new URL(request.url).origin) return Response.json({ error: 'INVALID_ORIGIN' }, { status: 403 });
    return await action(session.user.id);
  } catch (error) {
    const status = error instanceof CommunityError ? error.status : error instanceof SyntaxError ? 400 : 503;
    return Response.json({ error: error instanceof CommunityError ? error.message : status === 400 ? 'INVALID_JSON' : 'COMMUNITY_UNAVAILABLE' }, { status, headers: { 'Cache-Control': 'no-store', ...(status === 429 ? { 'Retry-After': '2' } : {}) } });
  }
}
export const communityHeaders = { 'Cache-Control': 'private, no-store' };
export async function communityBody(request: Request): Promise<Record<string, unknown>> {
  const text = await request.text();
  if (text.length > 300000) throw new CommunityError(413, 'REQUEST_TOO_LARGE');
  const value = JSON.parse(text);
  if (!value || typeof value !== 'object' || Array.isArray(value)) throw new CommunityError(400, 'INVALID_BODY');
  return value;
}
