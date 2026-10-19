import type { Metadata } from 'next';
import { AuthForm } from '@/components/auth/AuthForm';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import { experienceRedirect } from '@/lib/auth-redirect';

export const metadata: Metadata = { title: 'Đăng nhập | VieN' };

export default async function SignInPage({ searchParams }: { searchParams: Promise<{ next?: string | string[] }> }) {
  const next = experienceRedirect((await searchParams).next);
  if (await auth.api.getSession({ headers: await headers() })) redirect(next);
  return <AuthForm mode="sign-in" next={next} />;
}
