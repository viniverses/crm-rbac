import {
  Analytics01Icon,
  Building02Icon,
  Calendar03Icon,
  Call02Icon,
  Contact01Icon,
  DatabaseIcon,
  Home01Icon,
  InboxIcon,
  KanbanIcon,
  Mail01Icon,
  Settings01Icon,
  Target02Icon,
  Task01Icon,
  UserGroupIcon,
} from '@hugeicons/core-free-icons';

import type { SidebarNavGroup, SidebarNavItem } from './types';

export const sidebarData = {
  navItems: [
    {
      title: 'Dashboard',
      url: '#',
      icon: Home01Icon,
    },
    {
      title: 'Inbox',
      url: '#',
      icon: InboxIcon,
      badge: 4,
      badgeVariant: 'alert',
    },
    {
      title: 'Tasks',
      url: '#',
      icon: Task01Icon,
      badge: 12,
    },
    {
      title: 'Calendar',
      url: '#',
      icon: Calendar03Icon,
    },
  ] satisfies SidebarNavItem[],
  groups: [
    {
      label: 'Sales & Pipeline',
      defaultOpen: true,
      items: [
        {
          title: 'Leads',
          url: '#',
          icon: Target02Icon,
          badge: 'New',
          badgeVariant: 'alert',
        },
        {
          title: 'Deals Pipeline',
          url: '#',
          icon: KanbanIcon,
          isActive: true,
        },
        {
          title: 'Contacts',
          url: '#',
          icon: Contact01Icon,
          badge: 148,
        },
        {
          title: 'Companies',
          url: '#',
          icon: Building02Icon,
        },
        {
          title: 'Calls & Activities',
          url: '#',
          icon: Call02Icon,
        },
      ],
    },
    {
      label: 'Pipelines',
      defaultOpen: true,
      items: [
        {
          title: 'Enterprise Sales',
          url: '#',
          initial: 'E',
          colorClass:
            'bg-sidebar-accent text-sidebar-foreground ring-1 ring-border',
          badge: '$240k',
        },
        {
          title: 'Inbound Qualified',
          url: '#',
          initial: 'I',
          colorClass:
            'bg-sidebar-accent text-sidebar-foreground ring-1 ring-border',
          badge: '$85k',
        },
        {
          title: 'Key Accounts',
          url: '#',
          initial: 'K',
          colorClass:
            'bg-sidebar-accent text-sidebar-foreground ring-1 ring-border',
          badge: '$510k',
        },
        {
          title: 'Renewals & Churn',
          url: '#',
          initial: 'R',
          colorClass:
            'bg-sidebar-accent text-sidebar-foreground ring-1 ring-border',
        },
      ],
    },
    {
      label: 'Management',
      defaultOpen: false,
      items: [
        {
          title: 'Reports & Analytics',
          url: '#',
          icon: Analytics01Icon,
        },
        {
          title: 'Campaigns',
          url: '#',
          icon: Mail01Icon,
        },
        {
          title: 'Custom Tables',
          url: '#',
          icon: DatabaseIcon,
        },
        {
          title: 'Members & Roles',
          url: '#',
          icon: UserGroupIcon,
        },
        {
          title: 'Settings',
          url: '#',
          icon: Settings01Icon,
        },
      ],
    },
  ] satisfies SidebarNavGroup[],
};
