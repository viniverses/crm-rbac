import { redirect } from 'next/navigation';

import { isAuthenticated } from '@/auth/auth';
import { Header } from '@/components/header/header';

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
    <div className="relative">
      <div className="space-y-4">
        <Header />
        <main className="mx-auto w-full max-w-[1200px]">
          {children}
          {sheet}
        </main>
      </div>
    </div>
  );
}
