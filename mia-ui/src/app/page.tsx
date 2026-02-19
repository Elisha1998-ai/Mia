import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { MonaWaitlist } from '@/components/MonaWaitlist';

export default async function Home() {
  const session = await auth();

  if (session) {
    redirect('/dashboard');
  }

  return (
    <MonaWaitlist />
  );
}
