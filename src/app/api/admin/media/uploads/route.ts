import { adminRoute } from '@/lib/admin';
import { beginMediaUpload, mediaJson } from '@/lib/destination-media';

export async function POST(request: Request) {
  return adminRoute(request, async userId => Response.json(await beginMediaUpload(userId,await mediaJson(request))));
}
