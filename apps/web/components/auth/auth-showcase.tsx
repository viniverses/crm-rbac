import { Badge } from '@crm/ui/components/badge';
import {
  Building03Icon,
  ChartLineData01Icon,
  CheckmarkCircle02Icon,
  CommandIcon,
  Shield01Icon,
} from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';

const pipelinePreviewDeals = [
  {
    company: 'Spinova Enterprise',
    stage: 'Negotiation',
    value: '$48,500',
    role: 'ADMIN',
    probability: '85%',
  },
  {
    company: 'Northstar Cloud Migration',
    stage: 'Proposal Sent',
    value: '$24,000',
    role: 'MEMBER',
    probability: '60%',
  },
  {
    company: 'Linear Global Expansion',
    stage: 'Closed Won',
    value: '$92,400',
    role: 'BILLING',
    probability: '100%',
  },
];

const securityFeatures = [
  'Fine-grained CASL role-based permissions',
  'Automatic organization domain matching',
  'Multi-tenant workspace isolation',
];

export function AuthShowcase() {
  return (
    <div className="relative hidden flex-1 flex-col justify-between overflow-hidden rounded-2xl border border-transparent bg-sidebar p-8 text-sidebar-foreground shadow-(--shadow-border) lg:flex xl:p-10">
      {/* Subtle ambient radial glow & architectural grid */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-28 -right-28 size-96 rounded-full bg-indigo-500/10 blur-3xl dark:bg-indigo-500/15"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-28 -left-28 size-96 rounded-full bg-indigo-600/8 blur-3xl dark:bg-indigo-500/10"
      />

      {/* Top status bar */}
      <div className="relative z-10 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="flex size-8 items-center justify-center rounded-lg bg-indigo-600 text-white! shadow-xs outline-1 -outline-offset-1 outline-white/15 **:text-white!">
            <HugeiconsIcon
              icon={CommandIcon}
              strokeWidth={2.25}
              className="size-4"
            />
          </div>
          <div className="flex flex-col leading-tight">
            <span className="text-xs font-semibold tracking-tight text-sidebar-foreground">
              Synapse CRM
            </span>
            <span className="text-[11px] text-muted-foreground">
              RBAC Revenue Workspace
            </span>
          </div>
        </div>

        <Badge
          variant="outline"
          className="h-6 gap-1.5 rounded-full border-transparent bg-background/80 px-2.5 text-[11px] font-medium text-muted-foreground shadow-(--shadow-border) dark:bg-sidebar-accent/70"
        >
          <span className="size-1.5 rounded-full bg-emerald-500" />
          API Connected
        </Badge>
      </div>

      {/* Center concentric preview surface: outer rounded-2xl (16px) with p-2 (8px) -> inner rounded-lg (8px) */}
      <div className="relative z-10 my-auto py-6">
        <div className="rounded-2xl border border-transparent bg-background/60 p-2 shadow-(--shadow-border) backdrop-blur-xs dark:bg-sidebar-accent/40">
          <div className="rounded-lg border border-transparent bg-background p-4 shadow-(--shadow-border) dark:bg-background/90">
            <div className="flex items-center justify-between border-b pb-3">
              <div className="flex items-center gap-2">
                <div className="flex size-7 items-center justify-center rounded-md bg-indigo-500/10 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-400">
                  <HugeiconsIcon
                    icon={ChartLineData01Icon}
                    strokeWidth={1.75}
                    className="size-4"
                  />
                </div>
                <div>
                  <p className="text-xs font-semibold text-foreground">
                    Active Deals Pipeline
                  </p>
                  <p className="text-[11px] text-muted-foreground">
                    Q4 Forecast &middot; Multi-tenant RBAC
                  </p>
                </div>
              </div>
              <div className="text-right tabular-nums">
                <p className="text-xs font-semibold text-foreground">
                  $164,900
                </p>
                <p className="text-[10px] font-medium text-emerald-600 dark:text-emerald-400">
                  +24.8% vs last month
                </p>
              </div>
            </div>

            <div className="mt-3 flex flex-col gap-1.5">
              {pipelinePreviewDeals.map((deal) => (
                <div
                  key={deal.company}
                  className="flex items-center justify-between rounded-md px-2.5 py-2 transition-colors duration-150 ease-out hover:bg-muted/60"
                >
                  <div className="flex min-w-0 items-center gap-2.5">
                    <div className="flex size-6 shrink-0 items-center justify-center rounded-md bg-sidebar-accent text-muted-foreground">
                      <HugeiconsIcon
                        icon={Building03Icon}
                        strokeWidth={1.6}
                        className="size-3.5"
                      />
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-xs font-medium text-foreground">
                        {deal.company}
                      </p>
                      <p className="text-[11px] text-muted-foreground">
                        {deal.stage}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5 tabular-nums">
                    <span className="rounded-sm bg-sidebar-accent px-1.5 py-0.5 text-[10px] font-semibold text-muted-foreground">
                      {deal.role}
                    </span>
                    <span className="min-w-14 text-right text-xs font-semibold text-foreground">
                      {deal.value}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom security highlights */}
      <div className="relative z-10 flex flex-col gap-3">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-sidebar-foreground">
          <HugeiconsIcon
            icon={Shield01Icon}
            strokeWidth={2}
            className="size-4 text-indigo-600 dark:text-indigo-400"
          />
          <span>Enterprise-grade access control</span>
        </div>
        <div className="grid grid-cols-1 gap-2 xl:grid-cols-3">
          {securityFeatures.map((feature) => (
            <div
              key={feature}
              className="flex items-start gap-2 rounded-xl border border-transparent bg-background/70 p-2.5 text-[11px] leading-snug text-muted-foreground shadow-(--shadow-border) dark:bg-sidebar-accent/40"
            >
              <HugeiconsIcon
                icon={CheckmarkCircle02Icon}
                strokeWidth={1.75}
                className="mt-0.5 size-3.5 shrink-0 text-indigo-600 dark:text-indigo-400"
              />
              <span>{feature}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
