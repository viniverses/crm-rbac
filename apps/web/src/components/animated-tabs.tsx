'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { usePathname, useRouter } from 'next/navigation';
import React, { JSX } from 'react';

import { cn } from '@/lib/utils';

import { Card } from './ui/card';

interface Tab {
  label: string;
  href: string;
  icon: JSX.Element;
}

interface AnimatedTabsProps {
  tabs: Tab[];
}

const transition = {
  type: 'tween',
  ease: 'easeOut',
  duration: 0.15,
};

const getHoverAnimationProps = (hoveredRect: DOMRect, navRect: DOMRect) => ({
  x: hoveredRect.left - navRect.left - 10,
  y: hoveredRect.top - navRect.top - 4,
  width: hoveredRect.width + 20,
  height: hoveredRect.height + 10,
});

const Tabs = ({ tabs }: { tabs: Tab[] }): React.ReactElement => {
  const [buttonRefs, setButtonRefs] = React.useState<Array<HTMLButtonElement | null>>([]);
  const pathname = usePathname();
  const router = useRouter();

  React.useEffect(() => {
    setButtonRefs((prev) => prev.slice(0, tabs.length));
  }, [tabs.length]);

  const navRef = React.useRef<HTMLDivElement>(null);
  const navRect = navRef.current?.getBoundingClientRect();

  const selectedTabIndex = tabs.findIndex((tab) => pathname === tab.href);
  const selectedRect = buttonRefs[selectedTabIndex]?.getBoundingClientRect();

  const [hoveredTabIndex, setHoveredTabIndex] = React.useState<number | null>(null);
  const hoveredRect = buttonRefs[hoveredTabIndex ?? -1]?.getBoundingClientRect();

  return (
    <nav
      ref={navRef}
      className="relative z-0 flex flex-shrink-0 items-center justify-center py-2"
      onPointerLeave={() => setHoveredTabIndex(null)}
    >
      {tabs.map((item, i) => {
        const isActive = pathname === item.href;

        return (
          <React.Fragment key={item.href}>
            <button
              className="relative z-20 flex h-8 cursor-pointer items-center rounded-md bg-transparent px-4 text-sm transition-colors select-none"
              onPointerEnter={() => setHoveredTabIndex(i)}
              onFocus={() => setHoveredTabIndex(i)}
              onClick={() => router.push(item.href)}
            >
              <motion.span
                ref={(el) => {
                  buttonRefs[i] = el as HTMLButtonElement;
                }}
                className={cn('flex items-center gap-x-2 py-1', {
                  'text-zinc-500': !isActive,
                  'font-semibold text-black dark:text-white': isActive,
                })}
              >
                {item.icon}
                {item.label}
              </motion.span>
            </button>
            {i < tabs.length - 1 && <div className="h-4 w-[1px] bg-zinc-200 dark:bg-zinc-800" />}
          </React.Fragment>
        );
      })}

      <AnimatePresence>
        {hoveredRect && navRect && (
          <motion.div
            key="hover"
            className="absolute top-0 left-0 z-10 rounded-md bg-black/5 dark:bg-zinc-800"
            initial={{ ...getHoverAnimationProps(hoveredRect, navRect), opacity: 0 }}
            animate={{ ...getHoverAnimationProps(hoveredRect, navRect), opacity: 1 }}
            exit={{ ...getHoverAnimationProps(hoveredRect, navRect), opacity: 0 }}
            transition={transition}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {selectedRect && navRect && (
          <motion.div
            className="absolute bottom-0 left-0 z-10 h-[2px] bg-black dark:bg-white"
            initial={false}
            animate={{
              width: selectedRect.width + 18,
              x: `calc(${selectedRect.left - navRect.left - 9}px)`,
              opacity: 1,
            }}
            transition={transition}
          />
        )}
      </AnimatePresence>
    </nav>
  );
};

export function AnimatedTabs({ tabs }: AnimatedTabsProps) {
  return (
    <Card className="items-start rounded-md border-b border-none p-0 py-1">
      <div className="mx-auto flex w-[1200px] items-start justify-start">
        <Tabs tabs={tabs} />
      </div>
    </Card>
  );
}
