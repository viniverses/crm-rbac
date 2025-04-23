'use client';

import * as SheetPrimitive from '@radix-ui/react-dialog';
import { XIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';

import { cn } from '@/lib/utils';

import { Sheet, SheetOverlay, SheetPortal } from './ui/sheet';

export function InterceptedSheetContent({
  className,
  children,
  side = 'right',
  ...props
}: React.ComponentProps<typeof SheetPrimitive.Content> & {
  side?: 'top' | 'right' | 'bottom' | 'left';
}) {
  const router = useRouter();

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      router.back();
    }
  };

  return (
    <Sheet defaultOpen onOpenChange={handleOpenChange}>
      <SheetPortal>
        <SheetOverlay />
        <SheetPrimitive.Content
          data-slot="sheet-content"
          className={cn(
            'bg-background data-[state=open]:animate-in data-[state=closed]:animate-out fixed z-50 m-3 flex h-[calc(100vh-1.5rem)] flex-col gap-4 rounded-md shadow-lg transition ease-in-out data-[state=closed]:duration-300 data-[state=open]:duration-500',
            side === 'right' &&
              'data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right inset-y-0 right-0 w-3/4 border-l sm:max-w-sm',
            side === 'left' &&
              'data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left inset-y-0 left-0 w-3/4 border-r sm:max-w-sm',
            side === 'top' &&
              'data-[state=closed]:slide-out-to-top data-[state=open]:slide-in-from-top inset-x-0 top-0 h-auto border-b',
            side === 'bottom' &&
              'data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom inset-x-0 bottom-0 h-auto border-t',
            className,
          )}
          {...props}
        >
          {children}
          <SheetPrimitive.Close className="ring-offset-background focus:ring-ring data-[state=open]:bg-secondary absolute top-4 right-4 rounded-xs opacity-70 transition-opacity hover:opacity-100 focus:ring-2 focus:ring-offset-2 focus:outline-hidden disabled:pointer-events-none">
            <XIcon className="size-4" />
            <span className="sr-only">Close</span>
          </SheetPrimitive.Close>
        </SheetPrimitive.Content>
      </SheetPortal>
    </Sheet>
  );
}
