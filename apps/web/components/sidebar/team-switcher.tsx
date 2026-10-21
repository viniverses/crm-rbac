'use client';

import { Avatar, AvatarImage } from '@crm/ui/components/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from '@crm/ui/components/dropdown-menu';
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from '@crm/ui/components/sidebar';
import { ArrowUpDownIcon, Building02Icon, PlusSignIcon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { selectOrganization } from '@/app/(app)/actions';
import type { OrganizationListItem } from '@/services/organization/get-organizations';

export function TeamSwitcher({
  organizations,
  currentOrganization,
}: {
  organizations: OrganizationListItem[];
  currentOrganization: string | null;
}) {
  const router = useRouter();
  const { isMobile } = useSidebar();
  const activeTeam = organizations.find((organization) => organization.slug === currentOrganization);

  const handleSelect = async (slug: string) => {
    if (slug === currentOrganization) return;
    const result = await selectOrganization(slug);
    if (result.success) router.refresh();
  };

  return (
    <SidebarMenu className="group-data-[collapsible=icon]:items-center">
      <SidebarMenuItem className="group-data-[collapsible=icon]:flex group-data-[collapsible=icon]:w-full group-data-[collapsible=icon]:justify-center">
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <SidebarMenuButton
                size="lg"
                className="bg-background/80 shadow-(--shadow-border) hover:bg-background hover:shadow-(--shadow-border-hover) group-data-[collapsible=icon]:size-8! group-data-[collapsible=icon]:rounded-lg! group-data-[collapsible=icon]:p-0! data-open:bg-background data-open:shadow-(--shadow-border-hover) dark:bg-sidebar-accent/60 dark:hover:bg-sidebar-accent dark:data-open:bg-sidebar-accent h-auto w-full gap-2.5 rounded-2xl border border-transparent p-2 pe-2.5 enabled:active:scale-[0.96] group-data-[collapsible=icon]:mx-auto group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:bg-transparent group-data-[collapsible=icon]:shadow-none group-data-[collapsible=icon]:hover:bg-transparent group-data-[collapsible=icon]:hover:shadow-none motion-safe:transition-[scale,background-color,box-shadow] motion-safe:duration-150 motion-safe:ease-out"
              />
            }
          >
            <div className="text-white! shadow-xs **:text-white! flex size-9 shrink-0 items-center justify-center rounded-lg bg-indigo-600 outline-1 -outline-offset-1 outline-white/15 transition-colors duration-150 group-hover/menu-button:bg-indigo-500 group-data-[collapsible=icon]:size-8">
              {activeTeam?.avatarUrl ? (
                <Avatar className="size-full rounded-lg after:hidden">
                  <AvatarImage src={activeTeam.avatarUrl} alt="" className="rounded-lg object-cover" />
                </Avatar>
              ) : (
                <HugeiconsIcon icon={Building02Icon} strokeWidth={2.25} className="size-4.5" />
              )}
            </div>
            <div className="grid flex-1 text-left leading-tight group-data-[collapsible=icon]:hidden">
              <span className="text-sidebar-foreground truncate text-[13px] font-semibold tracking-tight">
                {activeTeam?.name ?? 'Organizations'}
              </span>
              <span className="text-muted-foreground truncate text-xs">{activeTeam?.role ?? 'Select a workspace'}</span>
            </div>
            <HugeiconsIcon
              icon={ArrowUpDownIcon}
              strokeWidth={1.75}
              className="text-muted-foreground group-hover/menu-button:text-sidebar-foreground ml-auto size-4 shrink-0 transition-colors duration-150 group-data-[collapsible=icon]:hidden"
            />
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--anchor-width) min-w-56 rounded-xl"
            align="start"
            side={isMobile ? 'bottom' : 'right'}
            sideOffset={6}
          >
            <DropdownMenuGroup>
              <DropdownMenuLabel className="text-muted-foreground text-xs">Organizations</DropdownMenuLabel>
              {organizations.map((team, index) => (
                <DropdownMenuItem
                  key={team.id}
                  onClick={() => void handleSelect(team.slug)}
                  className="gap-2.5 rounded-lg p-2"
                >
                  <div className="text-white! **:text-white! flex size-7 items-center justify-center rounded-md bg-indigo-600 outline-1 -outline-offset-1 outline-white/15 transition-colors duration-150 group-focus/dropdown-menu-item:bg-indigo-500">
                    {team.avatarUrl ? (
                      <Avatar className="size-full rounded-md after:hidden">
                        <AvatarImage src={team.avatarUrl} alt="" className="rounded-md object-cover" />
                      </Avatar>
                    ) : (
                      <HugeiconsIcon icon={Building02Icon} strokeWidth={2} className="size-3.5 shrink-0" />
                    )}
                  </div>
                  <div className="flex flex-1 flex-col leading-tight">
                    <span className="truncate text-xs font-medium">{team.name}</span>
                    <span className="text-muted-foreground truncate text-[10px]">{team.role}</span>
                  </div>
                  <DropdownMenuShortcut>⌘{index + 1}</DropdownMenuShortcut>
                </DropdownMenuItem>
              ))}
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem
                render={<Link href="/create-organization" />}
                className="cursor-pointer gap-2.5 rounded-lg p-2"
              >
                <div className="bg-background flex size-7 items-center justify-center rounded-md border">
                  <HugeiconsIcon icon={PlusSignIcon} strokeWidth={2} className="size-3.5" />
                </div>
                <span className="text-muted-foreground font-medium">Add organization</span>
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
