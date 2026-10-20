'use client';

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@crm/ui/components/sidebar';
import { cn } from '@crm/ui/lib/utils';
import { HugeiconsIcon } from '@hugeicons/react';

import type { SidebarNavItem } from './types';

interface NavItemProps {
  items: SidebarNavItem[];
  activeItem: string;
  onSelect: (title: string) => void;
}

export function NavItem({ items, activeItem, onSelect }: NavItemProps) {
  return (
    <SidebarGroup className="px-2 py-1.5 group-data-[collapsible=icon]:items-center group-data-[collapsible=icon]:px-0">
      <SidebarGroupContent className="group-data-[collapsible=icon]:flex group-data-[collapsible=icon]:flex-col group-data-[collapsible=icon]:items-center">
        <SidebarMenu className="gap-1 group-data-[collapsible=icon]:items-center">
          {items.map((item) => {
            const isActive = activeItem === item.title;
            return (
              <SidebarMenuItem
                key={item.title}
                className="group-data-[collapsible=icon]:flex group-data-[collapsible=icon]:w-full group-data-[collapsible=icon]:justify-center"
              >
                <SidebarMenuButton
                  render={<a href={item.url} />}
                  tooltip={item.title}
                  isActive={isActive}
                  onClick={() => onSelect(item.title)}
                  className={cn(
                    'h-8 gap-2.5 rounded-lg border border-transparent px-2 text-[13px] font-normal text-sidebar-foreground/80 transition-[background-color,color,box-shadow] duration-150 ease-out hover:bg-sidebar-accent/80 hover:text-sidebar-foreground data-active:bg-background data-active:font-medium data-active:text-sidebar-foreground data-active:shadow-(--shadow-border) dark:data-active:bg-sidebar-accent group-data-[collapsible=icon]:size-8! group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:p-0!',
                  )}
                >
                  {item.icon && (
                    <HugeiconsIcon
                      icon={item.icon}
                      strokeWidth={isActive ? 2 : 1.6}
                      className={cn(
                        'size-4 shrink-0 text-muted-foreground transition-colors duration-150',
                        isActive && 'text-indigo-600 dark:text-indigo-400',
                      )}
                    />
                  )}
                  <span>{item.title}</span>
                </SidebarMenuButton>
                {item.badge !== undefined && (
                  <SidebarMenuBadge
                    className="right-2 h-5 min-w-5 rounded-md bg-sidebar-accent/80 px-1.5 text-[11px] font-semibold text-muted-foreground tabular-nums dark:bg-sidebar-accent"
                  >
                    {item.badge}
                  </SidebarMenuBadge>
                )}
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
