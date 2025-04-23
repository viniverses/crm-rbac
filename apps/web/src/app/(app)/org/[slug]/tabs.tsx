'use client';

import { Settings } from 'lucide-react';
import { FileText } from 'lucide-react';
import { Users } from 'lucide-react';
import { BarChart3 } from 'lucide-react';
import { useParams } from 'next/navigation';

import { RouteTabs } from '@/components/route-tabs';

export function OrgTabs() {
  const { slug } = useParams<{ slug: string }>();

  const tabs = [
    {
      href: `/org/${slug}`,
      label: 'Visão Geral',
      icon: <BarChart3 className="h-4 w-4" />,
    },
    {
      href: `/org/${slug}/members`,
      label: 'Usuários',
      icon: <Users className="h-4 w-4" />,
    },
    {
      href: `/org/${slug}/reports`,
      label: 'Relatórios',
      icon: <FileText className="h-4 w-4" />,
    },
    {
      href: `/org/${slug}/settings`,
      label: 'Configurações',
      icon: <Settings className="h-4 w-4" />,
    },
  ];

  return <RouteTabs tabs={tabs} className="mb-8" />;
}
