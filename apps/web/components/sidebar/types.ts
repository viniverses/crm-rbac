import type { IconSvgElement } from '@hugeicons/react';

export type SidebarUser = {
  name: string;
  email: string;
  avatar: string;
  role?: string;
};

export type TeamItem = {
  name: string;
  logo: IconSvgElement;
  plan: string;
};

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
