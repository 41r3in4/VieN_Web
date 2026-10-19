import { hasValidOrigin } from '@/lib/request-origin';
import { auth, authPool } from '@/lib/auth';

export async function POST(request: Request) {
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session) return Response.json({ error: 'UNAUTHORIZED' }, { status: 401 });
  if (!hasValidOrigin(request)) return Response.json({ error: 'INVALID_ORIGIN' }, { status: 403 });
  try {
    const text = await request.text();
    if (text.length > 300000) return Response.json({ error: 'IMAGE_TOO_LARGE' }, { status: 413 });
    const { image } = JSON.parse(text);
    if (image !== null) {
      if (typeof image !== 'string' || !/^data:image\/webp;base64,[A-Za-z0-9+/]+=*$/.test(image)) throw new Error();
      const bytes = Buffer.from(image.split(',')[1], 'base64');
      if (bytes.length > 200000 || bytes.toString('ascii', 0, 4) !== 'RIFF' || bytes.toString('ascii', 8, 12) !== 'WEBP') throw new Error();
    }
    await authPool.query('UPDATE "user" SET image = $1, "updatedAt" = now() WHERE id = $2', [image, session.user.id]);
    return Response.json({ image }, { headers: { 'Cache-Control': 'no-store' } });
  } catch { return Response.json({ error: 'INVALID_IMAGE' }, { status: 400 }); }
}
