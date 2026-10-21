import { SidebarInset, SidebarProvider, SidebarTrigger } from '@crm/ui/components/sidebar';
import { redirect } from 'next/navigation';
import * as React from 'react';

import { getCurrentOrganization, getCurrentUser } from '@/auth/auth';
import { AppSidebar } from '@/components/sidebar/app-sidebar';
import { ThemeSwitcher } from '@/components/theme-switcher';
import { getOrganizations } from '@/services/organization/get-organizations';

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

  const [organizations, currentOrganization] = await Promise.all([getOrganizations(), getCurrentOrganization()]);

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
      <AppSidebar user={profile.user} organizations={organizations} currentOrganization={currentOrganization} />
      <SidebarInset>
        <header className="flex h-12 shrink-0 items-center gap-2 border-b px-6">
          <SidebarTrigger className="text-muted-foreground hover:text-foreground -ml-2" />
          <span className="text-foreground text-xs font-medium">Deals Pipeline</span>
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
