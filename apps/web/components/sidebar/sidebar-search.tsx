'use client';

import {
  SidebarInput,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@crm/ui/components/sidebar';
import { Search01Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import * as React from 'react';

interface SidebarSearchProps {
  value: string;
  onChange: (value: string) => void;
}

export function SidebarSearch({ value, onChange }: SidebarSearchProps) {
  const { state, setOpen } = useSidebar();
  const inputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key.toLowerCase() === 'k' && (event.metaKey || event.ctrlKey)) {
        event.preventDefault();
        if (state === 'collapsed') {
          setOpen(true);
          requestAnimationFrame(() => inputRef.current?.focus());
        } else {
          inputRef.current?.focus();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [state, setOpen]);

  return (
    <>
      {/* Expanded Search Input */}
      <div className="relative group-data-[collapsible=icon]:hidden">
        <HugeiconsIcon
          icon={Search01Icon}
          strokeWidth={1.75}
          className="pointer-events-none absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2 text-muted-foreground"
        />
        <SidebarInput
          ref={inputRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Search"
          className="h-8 rounded-xl border-transparent bg-background/70 pr-11 pl-8 text-[13px] shadow-(--shadow-border) transition-[background-color,box-shadow] duration-150 ease-out placeholder:text-muted-foreground/80 hover:bg-background hover:shadow-(--shadow-border-hover) focus-visible:border-ring focus-visible:bg-background dark:bg-sidebar-accent/50 dark:hover:bg-sidebar-accent"
        />
        <kbd className="pointer-events-none absolute top-1/2 right-1.5 inline-flex h-5 -translate-y-1/2 items-center rounded-md border border-transparent bg-sidebar-accent px-1.5 font-sans text-[10px] font-medium text-muted-foreground shadow-(--shadow-border) select-none dark:bg-background/60">
          ⌘K
        </kbd>
      </div>

      {/* Collapsed Icon Button */}
      <SidebarMenu className="hidden items-center group-data-[collapsible=icon]:flex">
        <SidebarMenuItem className="group-data-[collapsible=icon]:flex group-data-[collapsible=icon]:w-full group-data-[collapsible=icon]:justify-center">
          <SidebarMenuButton
            tooltip="Search (⌘K)"
            onClick={() => {
              setOpen(true);
              requestAnimationFrame(() => inputRef.current?.focus());
            }}
            className="text-muted-foreground hover:text-sidebar-foreground group-data-[collapsible=icon]:size-8! group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:p-0!"
          >
            <HugeiconsIcon icon={Search01Icon} strokeWidth={1.6} className="size-4" />
            <span>Search</span>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </>
  );
}
