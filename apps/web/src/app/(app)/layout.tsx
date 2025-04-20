import { redirect } from 'next/navigation';

import { isAuthenticated } from '@/auth/auth';
import { Header } from '@/components/header/header';

export default async function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  if (!isAuthenticated()) {
    redirect('/sign-in');
  }

  return (
    <div>
      <Header />
      {children}
    </div>
  );
}
