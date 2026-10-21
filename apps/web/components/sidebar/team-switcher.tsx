'use client';

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
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@crm/ui/components/sidebar';
import { ArrowUpDownIcon, PlusSignIcon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import Link from 'next/link';
import * as React from 'react';

import type { TeamItem } from './types';

export function TeamSwitcher({ teams }: { teams: TeamItem[] }) {
  const { isMobile } = useSidebar();
  const [activeTeam, setActiveTeam] = React.useState(teams[0]);

  if (!activeTeam) {
    return null;
  }

  return (
    <SidebarMenu className="group-data-[collapsible=icon]:items-center">
      <SidebarMenuItem className="group-data-[collapsible=icon]:flex group-data-[collapsible=icon]:w-full group-data-[collapsible=icon]:justify-center">
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <SidebarMenuButton
                size="lg"
                className="h-auto w-full gap-2.5 rounded-2xl border border-transparent bg-background/80 p-2 pe-2.5 shadow-(--shadow-border) motion-safe:transition-[scale,background-color,box-shadow] motion-safe:duration-150 motion-safe:ease-out hover:bg-background hover:shadow-(--shadow-border-hover) enabled:active:scale-[0.96] group-data-[collapsible=icon]:mx-auto group-data-[collapsible=icon]:size-8! group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:rounded-lg! group-data-[collapsible=icon]:bg-transparent group-data-[collapsible=icon]:p-0! group-data-[collapsible=icon]:shadow-none group-data-[collapsible=icon]:hover:bg-transparent group-data-[collapsible=icon]:hover:shadow-none data-open:bg-background data-open:shadow-(--shadow-border-hover) dark:bg-sidebar-accent/60 dark:hover:bg-sidebar-accent dark:data-open:bg-sidebar-accent"
              />
            }
          >
            <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-indigo-600 text-white! shadow-xs outline-1 -outline-offset-1 outline-white/15 transition-colors duration-150 group-hover/menu-button:bg-indigo-500 group-data-[collapsible=icon]:size-8 **:text-white!">
              <HugeiconsIcon
                icon={activeTeam.logo}
                strokeWidth={2.25}
                className="size-4.5"
              />
            </div>
            <div className="grid flex-1 text-left leading-tight group-data-[collapsible=icon]:hidden">
              <span className="truncate text-[13px] font-semibold tracking-tight text-sidebar-foreground">
                {activeTeam.name}
              </span>
              <span className="truncate text-xs text-muted-foreground">
                {activeTeam.plan}
              </span>
            </div>
            <HugeiconsIcon
              icon={ArrowUpDownIcon}
              strokeWidth={1.75}
              className="ml-auto size-4 shrink-0 text-muted-foreground transition-colors duration-150 group-hover/menu-button:text-sidebar-foreground group-data-[collapsible=icon]:hidden"
            />
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--anchor-width) min-w-56 rounded-xl"
            align="start"
            side={isMobile ? 'bottom' : 'right'}
            sideOffset={6}
          >
            <DropdownMenuGroup>
              <DropdownMenuLabel className="text-xs text-muted-foreground">
                Organizations
              </DropdownMenuLabel>
              {teams.map((team, index) => (
                <DropdownMenuItem
                  key={team.name}
                  onClick={() => setActiveTeam(team)}
                  className="gap-2.5 rounded-lg p-2"
                >
                  <div className="flex size-7 items-center justify-center rounded-md bg-indigo-600 text-white! outline-1 -outline-offset-1 outline-white/15 transition-colors duration-150 group-focus/dropdown-menu-item:bg-indigo-500 **:text-white!">
                    <HugeiconsIcon icon={team.logo} strokeWidth={2} className="size-3.5 shrink-0" />
                  </div>
                  <div className="flex flex-1 flex-col leading-tight">
                    <span className="truncate text-xs font-medium">{team.name}</span>
                    <span className="truncate text-[10px] text-muted-foreground">{team.plan}</span>
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
                <div className="flex size-7 items-center justify-center rounded-md border bg-background">
                  <HugeiconsIcon icon={PlusSignIcon} strokeWidth={2} className="size-3.5" />
                </div>
                <span className="font-medium text-muted-foreground">Add organization</span>
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
