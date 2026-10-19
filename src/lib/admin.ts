import { auth, authPool } from '@/lib/auth';
import { MediaError } from '@/lib/media-error';

export async function isAdmin(userId: string) {
  return !!(await authPool.query('SELECT 1 FROM vien_admins WHERE user_id=$1', [userId])).rowCount;
}
export async function adminRoute(request: Request, action: (userId: string) => Promise<Response>) {
  try {
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session) return Response.json({ error: 'UNAUTHORIZED' }, { status: 401 });
  if (!await isAdmin(session.user.id)) return Response.json({ error: 'ADMIN_ONLY' }, { status: 403 });
  if (request.method !== 'GET' && request.headers.get('origin') !== new URL(request.url).origin) return Response.json({ error: 'INVALID_ORIGIN' }, { status: 403 });
  return await action(session.user.id);
  } catch (error) {
    return Response.json({ error: error instanceof MediaError ? error.message : 'MEDIA_UNAVAILABLE' }, { status: error instanceof MediaError ? error.status : 503 });
  }
}
