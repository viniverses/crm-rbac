import { Building02Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';

import { OrganizationForm } from '@/components/organization/organization-form';

export default function CreateOrganizationPage() {
  return (
    <div className="flex flex-1 items-start justify-center p-6 md:pt-12">
      <div className="flex w-full max-w-md flex-col rounded-2xl border border-transparent bg-card shadow-(--shadow-border)">
        <div className="flex items-center gap-3 border-b px-5 py-4">
          <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-indigo-600 text-white shadow-xs outline-1 -outline-offset-1 outline-white/15">
            <HugeiconsIcon
              icon={Building02Icon}
              strokeWidth={2}
              className="size-4"
            />
          </div>
          <div className="grid gap-0.5">
            <h1 className="text-[13px] font-semibold tracking-tight text-foreground">
              Create organization
            </h1>
            <p className="text-[11px] text-muted-foreground">
              Set up a new workspace for your team and pipelines.
            </p>
          </div>
        </div>

        <div className="p-5">
          <OrganizationForm />
        </div>
      </div>
    </div>
  );
}
