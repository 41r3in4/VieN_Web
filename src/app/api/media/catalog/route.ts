import { auth } from '@/lib/auth';
import { mediaCatalog } from '@/lib/destination-media';

export async function GET(request: Request) {
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session) return Response.json({ error: 'UNAUTHORIZED' }, { status: 401 });
  return Response.json(await mediaCatalog(session.user.id), { headers: { 'Cache-Control': 'private, no-store' } });
}
