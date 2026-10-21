'use client';

import { Button, buttonVariants } from '@crm/ui/components/button';
import { cn } from '@crm/ui/lib/utils';
import {
  ArrowLeft02Icon,
  CommandIcon,
  Compass01Icon,
  Home01Icon,
  KanbanIcon,
  UserGroupIcon,
} from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import * as React from 'react';

import { ThemeSwitcher } from '@/components/theme-switcher';

const QUICK_LINKS = [
  {
    title: 'Deals Pipeline',
    description: 'Access active deals, stage columns, and workspace metrics',
    href: '/',
    icon: KanbanIcon,
  },
  {
    title: 'Team & Auth',
    description: 'Switch profiles, review permissions, or sign in to your organization',
    href: '/sign-in',
    icon: UserGroupIcon,
  },
] as const;

export default function NotFound() {
  const router = useRouter();

  function handleGoBack() {
    if (typeof window !== 'undefined' && window.history.length > 1) {
      router.back();
    } else {
      router.push('/');
    }
  }

  return (
    <div className="bg-sidebar flex h-svh w-full flex-col overflow-hidden p-2 sm:p-3">
      <div className="bg-background relative flex h-full w-full flex-col justify-between overflow-y-auto overscroll-contain rounded-xl border border-transparent p-6 shadow-(--shadow-border) sm:rounded-2xl sm:p-10">
        {/* Top Header */}
        <header className="flex items-center justify-between">
          <Link
            href="/"
            className="group inline-flex items-center gap-2.5 rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-ring/40"
          >
            <div className="flex size-8 items-center justify-center rounded-lg bg-indigo-600 text-white shadow-xs outline outline-1 -outline-offset-1 outline-white/15 transition-colors duration-150 group-hover:bg-indigo-500">
              <HugeiconsIcon
                icon={CommandIcon}
                strokeWidth={2.25}
                className="size-4 text-white"
              />
            </div>
            <div className="flex flex-col leading-tight">
              <span className="text-[13px] font-semibold tracking-tight text-foreground">
                Synapse CRM
              </span>
              <span className="text-[11px] text-muted-foreground">
                CRM Workspace
              </span>
            </div>
          </Link>

          <ThemeSwitcher />
        </header>

        {/* Main 404 Centerpiece */}
        <main className="my-auto flex flex-col items-center justify-center py-8 text-center">
          <div className="mx-auto flex max-w-lg flex-col items-center">
            {/* Concentric Icon Badge: outer 18px (rounded-[18px]) = inner 12px (rounded-xl) + 6px (p-1.5) */}
            <div className="stagger-item mb-5 rounded-[18px] border border-transparent p-1.5 shadow-(--shadow-border)">
              <div className="flex size-14 items-center justify-center rounded-xl border border-transparent bg-muted/60 text-foreground shadow-xs">
                <HugeiconsIcon
                  icon={Compass01Icon}
                  strokeWidth={1.75}
                  className="size-7 text-muted-foreground"
                />
              </div>
            </div>

            {/* Error Code & Status Pill */}
            <div className="stagger-item mb-3">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-transparent bg-muted/70 px-2.5 py-0.5 font-mono text-[11px] font-medium text-muted-foreground shadow-(--shadow-border)">
                <span className="size-1.5 rounded-full bg-amber-500" aria-hidden="true" />
                404 &bull; Page Not Found
              </span>
            </div>

            {/* Title & Description */}
            <div className="stagger-item mb-2">
              <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
                We lost this deal in orbit
              </h1>
            </div>

            <div className="stagger-item mb-8 max-w-md">
              <p className="text-xs/relaxed text-muted-foreground sm:text-sm/relaxed">
                The page or workspace resource you are looking for does not exist,
                may have been relocated, or is temporarily restricted by access controls.
              </p>
            </div>

            {/* Primary & Secondary Actions with optical alignment and tap scale */}
            <div className="stagger-item flex flex-wrap items-center justify-center gap-2.5">
              <Link
                href="/"
                data-icon="inline-start"
                className={cn(
                  buttonVariants({ variant: 'default', size: 'default' }),
                  'ps-2.5 pe-3 font-medium motion-safe:active:scale-[0.96]',
                )}
              >
                <HugeiconsIcon
                  icon={Home01Icon}
                  strokeWidth={2}
                  className="size-3.5"
                />
                <span>Return to Dashboard</span>
              </Link>

              <Button
                type="button"
                variant="outline"
                size="default"
                onClick={handleGoBack}
                data-icon="inline-start"
                className="ps-2.5 pe-3 font-medium"
              >
                <HugeiconsIcon
                  icon={ArrowLeft02Icon}
                  strokeWidth={2}
                  className="size-3.5 rtl:-scale-x-100"
                />
                <span>Go back</span>
              </Button>
            </div>

            {/* Quick Navigation Cards: Concentric outer 20px = inner 10px + 10px (p-2.5) */}
            <div className="stagger-item mt-10 grid w-full grid-cols-1 gap-2.5 sm:grid-cols-2">
              {QUICK_LINKS.map((link) => {
                const IconComponent = link.icon;
                return (
                  <Link
                    key={link.title}
                    href={link.href}
                    className="group relative flex items-start gap-3 rounded-[20px] border border-transparent p-2.5 text-left shadow-(--shadow-border) transition-[box-shadow,background-color] duration-150 ease-out hover:bg-muted/30 hover:shadow-(--shadow-border-hover) motion-safe:active:scale-[0.98]"
                  >
                    <div className="flex size-9 shrink-0 items-center justify-center rounded-[10px] border border-transparent bg-muted/60 text-muted-foreground transition-colors duration-150 group-hover:bg-background group-hover:text-foreground">
                      <HugeiconsIcon
                        icon={IconComponent}
                        strokeWidth={1.75}
                        className="size-4"
                      />
                    </div>
                    <div className="flex min-w-0 flex-col pt-0.5">
                      <span className="text-xs font-semibold text-foreground">
                        {link.title}
                      </span>
                      <span className="line-clamp-2 text-[11px] text-muted-foreground">
                        {link.description}
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="flex items-center justify-between text-[11px] text-muted-foreground">
          <span>&copy; {new Date().getFullYear()} Synapse CRM</span>
          <span>Secured with JWT &amp; RBAC</span>
        </footer>
      </div>
    </div>
  );
}
