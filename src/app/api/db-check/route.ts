import { getDatabase } from '@/lib/db';

export const runtime = 'nodejs';

export async function GET() {
  if (process.env.NODE_ENV !== 'development') {
    return new Response(null, { status: 404 });
  }

  const headers = { 'Cache-Control': 'no-store' };
  if (!process.env.DATABASE_URL) {
    return Response.json(
      { ok: false, message: 'Chưa có DATABASE_URL trong .env' },
      { status: 503, headers }
    );
  }

  try {
    const sql = getDatabase();
    await sql`SELECT 1 AS connected`;
    return Response.json(
      { ok: true, message: 'Kết nối Neon thành công' },
      { headers }
    );
  } catch {
    return Response.json(
      { ok: false, message: 'Không kết nối được Neon. Kiểm tra DATABASE_URL và mạng.' },
      { status: 503, headers }
    );
  }
}
