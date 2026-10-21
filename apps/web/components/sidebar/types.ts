import type { IconSvgElement } from '@hugeicons/react';

export type SidebarNavItem = {
  title: string;
  url: string;
  icon?: IconSvgElement;
  initial?: string;
  colorClass?: string;
  badge?: number | string;
  badgeVariant?: 'default' | 'alert';
  isActive?: boolean;
};

export type SidebarNavGroup = {
  label: string;
  defaultOpen?: boolean;
  items: SidebarNavItem[];
};
