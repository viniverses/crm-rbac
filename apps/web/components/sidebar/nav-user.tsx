'use client';

import {
  Avatar,
  AvatarBadge,
  AvatarFallback,
  AvatarImage,
} from '@crm/ui/components/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '@crm/ui/components/dropdown-menu';
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@crm/ui/components/sidebar';
import {
  ComputerIcon,
  CreditCardIcon,
  Logout01Icon,
  Moon02Icon,
  Notification01Icon,
  SparklesIcon,
  Sun01Icon,
  UnfoldMoreIcon,
  UserCheck01Icon,
} from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { useTheme } from 'next-themes';

import { signOut } from '@/app/(app)/actions';
import type { GetProfileResponse } from '@/services/auth/get-profile';

export function NavUser({ user }: { user: GetProfileResponse['user'] }) {
  const { isMobile } = useSidebar();
  const { setTheme } = useTheme();
  const initials = user.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <SidebarMenu className="group-data-[collapsible=icon]:items-center">
      <SidebarMenuItem className="group-data-[collapsible=icon]:flex group-data-[collapsible=icon]:w-full group-data-[collapsible=icon]:justify-center">
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <SidebarMenuButton
                size="lg"
                className="h-11 gap-2.5 rounded-xl border border-transparent bg-background/60 p-2 pe-2.5 shadow-(--shadow-border) motion-safe:transition-[scale,background-color,box-shadow] motion-safe:duration-150 motion-safe:ease-out hover:bg-background hover:shadow-(--shadow-border-hover) enabled:active:scale-[0.96] group-data-[collapsible=icon]:mx-auto group-data-[collapsible=icon]:size-8! group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:rounded-lg! group-data-[collapsible=icon]:border-transparent group-data-[collapsible=icon]:bg-transparent group-data-[collapsible=icon]:p-0! group-data-[collapsible=icon]:shadow-none data-open:bg-background data-open:shadow-(--shadow-border-hover) dark:bg-sidebar-accent/50 dark:hover:bg-sidebar-accent dark:data-open:bg-sidebar-accent"
              />
            }
          >
            <Avatar className="size-7 rounded-full outline-1 -outline-offset-1 outline-black/10 dark:outline-white/10">
              <AvatarImage src={user.avatarUrl ?? undefined} alt={user.name} />
              <AvatarFallback className="rounded-full bg-indigo-500/15 text-[11px] font-semibold text-indigo-600 dark:bg-indigo-500/25 dark:text-indigo-300">
                {initials}
              </AvatarFallback>
              <AvatarBadge className="bg-emerald-500 ring-sidebar" />
            </Avatar>
            <div className="grid flex-1 text-left leading-tight group-data-[collapsible=icon]:hidden">
              <div className="flex items-center gap-1.5">
                <span className="truncate text-xs font-semibold text-sidebar-foreground">
                  {user.name}
                </span>
              </div>
              <span className="truncate text-[11px] text-muted-foreground">
                {user.email}
              </span>
            </div>
            <HugeiconsIcon
              icon={UnfoldMoreIcon}
              strokeWidth={1.75}
              className="ml-auto size-3.5 text-muted-foreground group-data-[collapsible=icon]:hidden"
            />
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="min-w-56 rounded-xl"
            side={isMobile ? 'bottom' : 'right'}
            align="end"
            sideOffset={6}
          >
            <DropdownMenuGroup>
              <DropdownMenuLabel className="p-0 font-normal">
                <div className="flex items-center gap-2.5 px-2 py-1.5 text-left text-xs">
                  <Avatar className="size-8 rounded-full outline-1 -outline-offset-1 outline-black/10 dark:outline-white/10">
                    <AvatarImage src={user.avatarUrl ?? undefined} alt={user.name} />
                    <AvatarFallback className="rounded-full bg-indigo-500/15 text-xs font-semibold text-indigo-600 dark:bg-indigo-500/25 dark:text-indigo-300">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left leading-tight">
                    <span className="truncate text-xs font-medium text-foreground">{user.name}</span>
                    <span className="truncate text-[11px] text-muted-foreground">{user.email}</span>
                  </div>
                </div>
              </DropdownMenuLabel>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <HugeiconsIcon icon={SparklesIcon} strokeWidth={1.75} className="text-indigo-500" />
                Upgrade to Pro
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <HugeiconsIcon icon={UserCheck01Icon} strokeWidth={1.75} />
                Account
              </DropdownMenuItem>
              <DropdownMenuItem>
                <HugeiconsIcon icon={CreditCardIcon} strokeWidth={1.75} />
                Billing
              </DropdownMenuItem>
              <DropdownMenuItem>
                <HugeiconsIcon icon={Notification01Icon} strokeWidth={1.75} />
                Notifications
              </DropdownMenuItem>
              <DropdownMenuSub>
                <DropdownMenuSubTrigger>
                  <HugeiconsIcon icon={Sun01Icon} strokeWidth={1.75} />
                  Appearance
                </DropdownMenuSubTrigger>
                <DropdownMenuSubContent>
                  <DropdownMenuItem onClick={() => setTheme('light')}>
                    <HugeiconsIcon icon={Sun01Icon} strokeWidth={1.75} />
                    Light
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setTheme('dark')}>
                    <HugeiconsIcon icon={Moon02Icon} strokeWidth={1.75} />
                    Dark
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setTheme('system')}>
                    <HugeiconsIcon icon={ComputerIcon} strokeWidth={1.75} />
                    System
                  </DropdownMenuItem>
                </DropdownMenuSubContent>
              </DropdownMenuSub>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem
                variant="destructive"
                onClick={async () => {
                  await signOut();
                }}
              >
                <HugeiconsIcon icon={Logout01Icon} strokeWidth={1.75} />
                Log out
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
