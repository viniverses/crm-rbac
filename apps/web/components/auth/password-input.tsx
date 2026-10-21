'use client';

import { FormControl } from '@crm/ui/components/form';
import { Input } from '@crm/ui/components/input';
import { cn } from '@crm/ui/lib/utils';
import {
  LockPasswordIcon,
  ViewIcon,
  ViewOffSlashIcon,
} from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import * as React from 'react';

const iconCrossfadeLayer = cn(
  '[grid-area:1/1] transition-[opacity,filter,scale] duration-300',
  'ease-[cubic-bezier(0.2,0,0,1)]',
  'motion-reduce:scale-100 motion-reduce:blur-[0px]',
);
const iconShown = 'scale-100 opacity-100 blur-[0px]';
const iconHidden = 'scale-[0.25] opacity-0 blur-[4px]';

export function usePasswordVisibility() {
  const [visible, setVisible] = React.useState(false);

  function toggleVisibility() {
    setVisible((current) => !current);
  }

  return { visible, toggleVisibility };
}

type PasswordInputProps = Omit<React.ComponentProps<typeof Input>, 'type'> & {
  visible: boolean;
  onVisibilityToggle?: () => void;
};

export function PasswordInput({
  visible,
  onVisibilityToggle,
  className,
  ...props
}: PasswordInputProps) {
  return (
    <div className="relative">
      <HugeiconsIcon
        icon={LockPasswordIcon}
        strokeWidth={1.6}
        className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
      />
      <FormControl>
        <Input
          type={visible ? 'text' : 'password'}
          className={cn(
            'h-9 rounded-xl bg-background pl-9 text-xs shadow-2xs transition-[border-color,box-shadow,background-color] duration-150 ease-out hover:border-ring/50 focus-visible:border-indigo-500 focus-visible:ring-indigo-500/25',
            onVisibilityToggle ? 'pr-9' : 'pr-3',
            className,
          )}
          {...props}
        />
      </FormControl>
      {onVisibilityToggle && (
        <button
          type="button"
          onClick={onVisibilityToggle}
          aria-label={visible ? 'Hide password' : 'Show password'}
          aria-pressed={visible}
          className="absolute top-1/2 right-1.5 flex size-6 -translate-y-1/2 items-center justify-center rounded-lg text-muted-foreground transition-colors duration-150 ease-out hover:bg-muted hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring/40 outline-none"
        >
          <span className="grid place-items-center">
            <span
              className={cn(
                iconCrossfadeLayer,
                visible ? iconShown : iconHidden,
              )}
            >
              <HugeiconsIcon
                icon={ViewOffSlashIcon}
                strokeWidth={1.6}
                className="size-3.5"
              />
            </span>
            <span
              className={cn(
                iconCrossfadeLayer,
                visible ? iconHidden : iconShown,
              )}
            >
              <HugeiconsIcon
                icon={ViewIcon}
                strokeWidth={1.6}
                className="size-3.5"
              />
            </span>
          </span>
        </button>
      )}
    </div>
  );
}
