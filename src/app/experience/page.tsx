import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import ExperienceApp from '@/components/experience/ExperienceApp';
import { HeritageProvider } from '@/context/HeritageContext';
import { readProgress } from '@/lib/progress';
import { CommunityProvider } from '@/context/CommunityContext';
import { MediaProvider } from '@/context/MediaContext';
import { mediaCatalog } from '@/lib/destination-media';

export default async function ExperiencePage({ searchParams }: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    const params = await searchParams;
    const query = new URLSearchParams();
    for (const key of ['tab', 'destination']) {
      if (typeof params[key] === 'string') query.set(key, params[key]);
    }
    const next = '/experience' + (query.size ? `?${query}` : '');
    redirect(`/sign-up?next=${encodeURIComponent(next)}`);
  }
  const [progress,catalog] = await Promise.all([readProgress(session.user.id),mediaCatalog(session.user.id)]);
  return <HeritageProvider key={session.user.id} initialProgress={progress}><CommunityProvider><MediaProvider initialCatalog={catalog}><ExperienceApp /></MediaProvider></CommunityProvider></HeritageProvider>;
}
