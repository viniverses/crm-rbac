'use client';

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@crm/ui/components/collapsible';
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@crm/ui/components/sidebar';
import { cn } from '@crm/ui/lib/utils';
import { HugeiconsIcon } from '@hugeicons/react';

import type { SidebarNavGroup } from './types';

interface NavGroupProps {
  group: SidebarNavGroup;
  activeItem: string;
  onSelect: (title: string) => void;
}

export function NavGroup({ group, activeItem, onSelect }: NavGroupProps) {
  return (
    <Collapsible defaultOpen={group.defaultOpen ?? true} className="group/collapsible">
      <SidebarGroup className="px-2 py-1.5 group-data-[collapsible=icon]:items-center group-data-[collapsible=icon]:px-0">
        <SidebarGroupLabel
          render={<CollapsibleTrigger />}
          className="h-7 w-fit cursor-pointer gap-1.5 px-2 text-[11px] font-semibold tracking-wider text-muted-foreground/75 uppercase transition-colors duration-100 hover:text-sidebar-foreground group-data-[collapsible=icon]:hidden"
        >
          <span>{group.label}</span>
          <svg
            viewBox="0 0 10 6"
            aria-hidden="true"
            className="size-2! shrink-0 fill-current text-muted-foreground/70 -rotate-90 motion-safe:transition-transform motion-safe:duration-150 motion-safe:ease-out group-data-[panel-open]/collapsible:rotate-0"
          >
            <path d="M1 1L5 5L9 1H1Z" />
          </svg>
        </SidebarGroupLabel>
        <CollapsibleContent>
          <SidebarGroupContent className="group-data-[collapsible=icon]:flex group-data-[collapsible=icon]:flex-col group-data-[collapsible=icon]:items-center">
            <SidebarMenu className="gap-1 group-data-[collapsible=icon]:items-center">
              {group.items.map((item) => {
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
                      {item.icon ? (
                        <HugeiconsIcon
                          icon={item.icon}
                          strokeWidth={isActive ? 2 : 1.6}
                          className={cn(
                            'size-4 shrink-0 text-muted-foreground transition-colors duration-150',
                            isActive && 'text-indigo-600 dark:text-indigo-400',
                          )}
                        />
                      ) : (
                        item.initial && (
                          <span
                            className={cn(
                              'flex size-4.5 shrink-0 items-center justify-center rounded-[5px] text-[10px] font-bold',
                              item.colorClass,
                            )}
                          >
                            {item.initial}
                          </span>
                        )
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
        </CollapsibleContent>
      </SidebarGroup>
    </Collapsible>
  );
}
