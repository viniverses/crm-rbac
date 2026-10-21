import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from '@crm/ui/components/sidebar';
import { redirect } from 'next/navigation';
import * as React from 'react';

import { getCurrentUser } from '@/auth/auth';
import { AppSidebar } from '@/components/sidebar/app-sidebar';
import { ThemeSwitcher } from '@/components/theme-switcher';

export default async function AppLayout({
  children,
  sheet,
}: Readonly<{
  children: React.ReactNode;
  sheet: React.ReactNode;
}>) {
  const profile = await getCurrentUser();

  if (!profile) {
    redirect('/sign-in');
  }

  return (
    <SidebarProvider
      className="h-svh overflow-hidden"
      style={
        {
          '--sidebar-width': '15rem',
          '--sidebar-width-icon': '3rem',
        } as React.CSSProperties
      }
    >
      <AppSidebar user={profile.user} />
      <SidebarInset>
        <header className="flex h-12 shrink-0 items-center gap-2 border-b px-6">
          <SidebarTrigger className="-ml-2 text-muted-foreground hover:text-foreground" />
          <span className="text-xs font-medium text-foreground">
            Deals Pipeline
          </span>
          <div className="ml-auto">
            <ThemeSwitcher />
          </div>
        </header>
        <div className="flex min-h-0 flex-1 flex-col overflow-y-auto">
          {children}
          {sheet}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
