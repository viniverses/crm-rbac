import { redirect } from 'next/navigation';

import { isAuthenticated } from '@/auth/auth';
import { Header } from '@/components/header/header';

import { OrgTabs } from './org/[slug]/tabs';

export default async function AppLayout({
  children,
  sheet,
}: Readonly<{
  children: React.ReactNode;
  sheet: React.ReactNode;
}>) {
  if (!(await isAuthenticated())) {
    redirect('/sign-in');
  }

  return (
    <>
      <Header />
      <OrgTabs />
      <main className="mx-auto w-full max-w-[1200px] py-4">
        {children}
        {sheet}
      </main>
    </>
  );
}
