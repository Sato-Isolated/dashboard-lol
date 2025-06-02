import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth/auth';
import SettingsPageClient from '@/components/common/settings/SettingsPageClient';

export default async function SettingsPage() {
  const session = await auth.api.getSession({
    headers: await import('next/headers').then(mod => mod.headers()),
  });

  if (!session) {
    redirect('/');
  }

  return <SettingsPageClient user={session.user} />;
}
