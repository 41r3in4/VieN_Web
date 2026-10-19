import { DESTINATIONS } from '@/data/destinations';
import { headers } from 'next/headers';
import { auth } from '@/lib/auth';
import { mediaCatalog } from '@/lib/destination-media';
import { applyDestinationMedia } from '@/lib/apply-destination-media';

export async function GET() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return Response.json({ error: 'Vui lòng đăng nhập để khám phá di sản.' }, { status: 401, headers: { 'Cache-Control': 'no-store' } });
  const catalog = await mediaCatalog(session.user.id);
  return Response.json(applyDestinationMedia(DESTINATIONS,catalog.media), { headers: { 'Cache-Control': 'private, no-store' } });
}
