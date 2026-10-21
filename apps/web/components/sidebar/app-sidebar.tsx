'use client';

import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarRail } from '@crm/ui/components/sidebar';
import * as React from 'react';

import type { GetProfileResponse } from '@/services/auth/get-profile';
import type { OrganizationListItem } from '@/services/organization/get-organizations';

import { sidebarData } from './data';
import { NavGroup } from './nav-group';
import { NavItem } from './nav-item';
import { NavUser } from './nav-user';
import { SidebarSearch } from './sidebar-search';
import { TeamSwitcher } from './team-switcher';

export function AppSidebar({
  user,
  organizations,
  currentOrganization,
  ...props
}: React.ComponentProps<typeof Sidebar> & {
  user: GetProfileResponse['user'];
  organizations: OrganizationListItem[];
  currentOrganization: string | null;
}) {
  const [activeItem, setActiveItem] = React.useState('Deals Pipeline');
  const [searchQuery, setSearchQuery] = React.useState('');

  const normalizedQuery = searchQuery.trim().toLowerCase();

  const filteredNavItems = React.useMemo(() => {
    if (!normalizedQuery) return sidebarData.navItems;
    return sidebarData.navItems.filter((item) => item.title.toLowerCase().includes(normalizedQuery));
  }, [normalizedQuery]);

  const filteredGroups = React.useMemo(() => {
    if (!normalizedQuery) return sidebarData.groups;
    return sidebarData.groups
      .map((group) => ({
        ...group,
        items: group.items.filter((item) => item.title.toLowerCase().includes(normalizedQuery)),
      }))
      .filter((group) => group.items.length > 0);
  }, [normalizedQuery]);

  return (
    <Sidebar variant="inset" collapsible="icon" {...props}>
      <SidebarHeader className="gap-2.5 px-2 pb-1 pt-2 group-data-[collapsible=icon]:items-center group-data-[collapsible=icon]:px-0">
        <TeamSwitcher organizations={organizations} currentOrganization={currentOrganization} />
        <SidebarSearch value={searchQuery} onChange={setSearchQuery} />
      </SidebarHeader>

      <SidebarContent className="gap-1 py-1 group-data-[collapsible=icon]:items-center">
        {filteredNavItems.length > 0 && (
          <NavItem items={filteredNavItems} activeItem={activeItem} onSelect={setActiveItem} />
        )}

        {filteredGroups.map((group) => (
          <NavGroup key={group.label} group={group} activeItem={activeItem} onSelect={setActiveItem} />
        ))}
      </SidebarContent>

      <SidebarFooter className="px-2 pb-2 group-data-[collapsible=icon]:items-center group-data-[collapsible=icon]:px-0">
        <NavUser user={user} />
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}
