import {
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@crm/ui/components/sheet';
import { Building02Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';

import { InterceptedSheetContent } from '@/components/intercepted-sheet-content';
import { OrganizationForm } from '@/components/organization/organization-form';

export default function CreateOrganizationSheetPage() {
  return (
    <InterceptedSheetContent className="flex flex-col p-0 sm:max-w-md">
      <SheetHeader className="flex flex-row items-center gap-3 border-b px-5 py-4">
        <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-indigo-600 text-white shadow-xs outline-1 -outline-offset-1 outline-white/15">
          <HugeiconsIcon
            icon={Building02Icon}
            strokeWidth={2}
            className="size-4"
          />
        </div>
        <div className="grid gap-0.5 text-left">
          <SheetTitle className="text-[13px] font-semibold tracking-tight text-foreground">
            Create organization
          </SheetTitle>
          <SheetDescription className="text-[11px] text-muted-foreground">
            Set up a new workspace for your team and pipelines.
          </SheetDescription>
        </div>
      </SheetHeader>

      <div className="flex flex-1 flex-col overflow-y-auto overscroll-contain p-5">
        <OrganizationForm showCancel />
      </div>
    </InterceptedSheetContent>
  );
}
