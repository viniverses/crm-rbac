'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type React from 'react';

import { cn } from '@/lib/utils';

interface Tab {
  href: string;
  label: string;
  icon?: React.ReactNode;
}

interface RouteTabsProps {
  tabs: Tab[];
  className?: string;
}

export function RouteTabs({ tabs, className }: RouteTabsProps) {
  const pathname = usePathname();

  return (
    <div className={cn('border-b', className)}>
      <nav className="flex space-x-4" aria-label="Tabs">
        {tabs.map((tab) => {
          const isActive = pathname === tab.href;

          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={cn(
                'relative px-3 py-2 text-sm font-medium transition-colors',
                isActive ? 'text-primary' : 'text-muted-foreground hover:text-foreground',
              )}
              aria-current={isActive ? 'page' : undefined}
            >
              <span className="flex items-center gap-2">
                {tab.icon && <span className="h-4 w-4">{tab.icon}</span>}
                {tab.label}
              </span>
              {isActive && (
                <motion.div
                  className="bg-primary absolute right-0 bottom-0 left-0 h-0.5"
                  layoutId="tab-indicator"
                  transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                />
              )}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
