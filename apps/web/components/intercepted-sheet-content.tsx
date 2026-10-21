'use client';

import { Sheet, SheetContent } from '@crm/ui/components/sheet';
import { cn } from '@crm/ui/lib/utils';
import { useRouter } from 'next/navigation';
import * as React from 'react';

export function InterceptedSheetContent({
  className,
  children,
  side = 'right',
  ...props
}: React.ComponentProps<typeof SheetContent>) {
  const router = useRouter();

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      router.back();
    }
  };

  return (
    <Sheet defaultOpen onOpenChange={handleOpenChange}>
      <SheetContent
        side={side}
        className={cn(
          side === 'right' &&
            'data-[side=right]:inset-y-2 data-[side=right]:right-2 data-[side=right]:h-[calc(100svh-1rem)] data-[side=right]:rounded-2xl data-[side=right]:border data-[side=right]:border-transparent data-[side=right]:shadow-(--shadow-border)',
          side === 'left' &&
            'data-[side=left]:inset-y-2 data-[side=left]:left-2 data-[side=left]:h-[calc(100svh-1rem)] data-[side=left]:rounded-2xl data-[side=left]:border data-[side=left]:border-transparent data-[side=left]:shadow-(--shadow-border)',
          className,
        )}
        {...props}
      >
        {children}
      </SheetContent>
    </Sheet>
  );
}
