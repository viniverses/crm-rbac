'use client';

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@crm/ui/components/avatar';
import { Button } from '@crm/ui/components/button';
import { Checkbox } from '@crm/ui/components/checkbox';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@crm/ui/components/form';
import { Input } from '@crm/ui/components/input';
import { cn } from '@crm/ui/lib/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Building02Icon,
  Delete02Icon,
  Globe02Icon,
  ImageUploadIcon,
  PlusSignIcon,
} from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { useRouter } from 'next/navigation';
import * as React from 'react';
import { useForm, useWatch } from 'react-hook-form';

import {
  organizationFormSchema,
  type OrganizationFormValues,
} from './schema';

const MAX_AVATAR_SIZE_BYTES = 4 * 1024 * 1024;
const ALLOWED_AVATAR_TYPES = [
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
];

interface OrganizationFormProps {
  showCancel?: boolean;
  defaultValues?: Partial<OrganizationFormValues>;
}

export function OrganizationForm({
  showCancel = false,
  defaultValues,
}: OrganizationFormProps) {
  const router = useRouter();
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const form = useForm<OrganizationFormValues>({
    resolver: zodResolver(organizationFormSchema),
    defaultValues: {
      name: defaultValues?.name ?? '',
      domain: defaultValues?.domain ?? '',
      shouldAttachUsersByDomain:
        defaultValues?.shouldAttachUsersByDomain ?? false,
      avatarUrl: defaultValues?.avatarUrl ?? undefined,
    },
  });

  const watchedName = useWatch({ control: form.control, name: 'name' });
  const watchedDomain = useWatch({ control: form.control, name: 'domain' });
  const watchedAvatarUrl = useWatch({
    control: form.control,
    name: 'avatarUrl',
  });

  const initials = React.useMemo(() => {
    const trimmed = (watchedName ?? '').trim();
    if (!trimmed) return null;
    return trimmed
      .split(/\s+/)
      .map((word) => word[0])
      .join('')
      .slice(0, 2)
      .toUpperCase();
  }, [watchedName]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!ALLOWED_AVATAR_TYPES.includes(file.type)) {
      form.setError('avatarUrl', {
        type: 'validate',
        message: 'File must be JPG, PNG, GIF or WEBP.',
      });
      return;
    }

    if (file.size > MAX_AVATAR_SIZE_BYTES) {
      form.setError('avatarUrl', {
        type: 'validate',
        message: 'File exceeds the 4MB size limit.',
      });
      return;
    }

    form.clearErrors('avatarUrl');
    if (watchedAvatarUrl?.startsWith('blob:')) {
      URL.revokeObjectURL(watchedAvatarUrl);
    }

    const previewUrl = URL.createObjectURL(file);
    form.setValue('avatarUrl', previewUrl, {
      shouldDirty: true,
      shouldValidate: true,
    });
  };

  const handleRemoveAvatar = () => {
    if (watchedAvatarUrl?.startsWith('blob:')) {
      URL.revokeObjectURL(watchedAvatarUrl);
    }
    form.setValue('avatarUrl', undefined, {
      shouldDirty: true,
      shouldValidate: true,
    });
    form.clearErrors('avatarUrl');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  React.useEffect(() => {
    return () => {
      if (watchedAvatarUrl?.startsWith('blob:')) {
        URL.revokeObjectURL(watchedAvatarUrl);
      }
    };
  }, [watchedAvatarUrl]);

  const onSubmit = (values: OrganizationFormValues) => {
    void values;
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-1 flex-col justify-between gap-6"
        noValidate
      >
        <div className="flex flex-col gap-5">
          {/* Avatar / Workspace Logo Card — Concentric radii: outer rounded-2xl (18px) - p-2 (8px) = inner rounded-lg (10px) */}
          <FormField
            control={form.control}
            name="avatarUrl"
            render={({ field }) => (
              <FormItem>
                <div className="flex items-center gap-3 rounded-2xl border border-transparent bg-muted/40 p-2 pe-3 shadow-(--shadow-border) dark:bg-sidebar-accent/40">
                  <Avatar className="size-11 shrink-0 rounded-lg after:hidden">
                    {field.value ? (
                      <AvatarImage
                        src={field.value}
                        alt="Organization logo"
                        className="rounded-lg outline-1 -outline-offset-1 outline-black/10 dark:outline-white/10"
                      />
                    ) : (
                      <AvatarFallback className="rounded-lg bg-indigo-600 text-xs font-semibold text-white shadow-xs outline-1 -outline-offset-1 outline-white/15">
                        {initials ? (
                          <span>{initials}</span>
                        ) : (
                          <HugeiconsIcon
                            icon={Building02Icon}
                            strokeWidth={2}
                            className="size-5 text-white"
                          />
                        )}
                      </AvatarFallback>
                    )}
                  </Avatar>

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-xs font-medium text-foreground">
                      Workspace logo
                    </p>
                    <p className="truncate text-[11px] text-muted-foreground">
                      PNG, JPG or GIF up to 4MB
                    </p>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <input
                      ref={fileInputRef}
                      id="org-avatar"
                      type="file"
                      accept="image/png,image/jpeg,image/gif,image/webp"
                      className="sr-only"
                      onChange={handleFileChange}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => fileInputRef.current?.click()}
                      className="h-7 rounded-lg bg-background ps-2 pe-2.5 text-xs font-medium shadow-2xs motion-safe:transition-[scale,background-color] motion-safe:duration-150 motion-safe:ease-out enabled:active:scale-[0.96]"
                    >
                      <HugeiconsIcon
                        icon={ImageUploadIcon}
                        strokeWidth={2}
                        className="size-3.5 text-muted-foreground"
                      />
                      <span>{field.value ? 'Change' : 'Upload'}</span>
                    </Button>

                    {field.value && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon-sm"
                        onClick={handleRemoveAvatar}
                        aria-label="Remove logo"
                        className="size-7 rounded-lg text-muted-foreground hover:text-destructive motion-safe:transition-[scale,background-color,color] motion-safe:duration-150 motion-safe:ease-out enabled:active:scale-[0.96]"
                      >
                        <HugeiconsIcon
                          icon={Delete02Icon}
                          strokeWidth={1.75}
                          className="size-3.5"
                        />
                      </Button>
                    )}
                  </div>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Organization Name */}
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Organization name</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="e.g. Acme Studio"
                    autoComplete="organization"
                    className="h-8 rounded-lg bg-background px-2.5 text-[13px] transition-[border-color,box-shadow] duration-150 ease-out"
                  />
                </FormControl>
                <FormDescription>
                  This is the visible name of your workspace across the
                  platform.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Organization Domain */}
          <FormField
            control={form.control}
            name="domain"
            render={({ field, fieldState }) => (
              <FormItem>
                <div className="flex items-center justify-between">
                  <FormLabel>Verified domain</FormLabel>
                  <span className="text-[11px] text-muted-foreground">
                    Optional
                  </span>
                </div>
                <div
                  data-invalid={!!fieldState.error || undefined}
                  className="group/domain flex h-8 items-center overflow-hidden rounded-lg border border-input bg-background transition-[border-color,box-shadow] duration-150 ease-out focus-within:border-ring focus-within:ring-2 focus-within:ring-ring/30 data-invalid:border-destructive data-invalid:ring-2 data-invalid:ring-destructive/20 dark:bg-input/30 dark:data-invalid:border-destructive/50 dark:data-invalid:ring-destructive/40"
                >
                  <span className="inline-flex h-full items-center gap-1.5 border-r border-border bg-muted/50 px-2.5 text-xs text-muted-foreground select-none dark:bg-muted/20">
                    <HugeiconsIcon
                      icon={Globe02Icon}
                      strokeWidth={1.5}
                      className="size-3.5 shrink-0 text-muted-foreground/80"
                    />
                    <span>https://</span>
                  </span>
                  <FormControl>
                    <input
                      {...field}
                      value={field.value ?? ''}
                      type="text"
                      inputMode="url"
                      placeholder="acme.studio"
                      className="h-full w-full min-w-0 bg-transparent px-2.5 text-[13px] text-foreground outline-none placeholder:text-muted-foreground"
                    />
                  </FormControl>
                </div>
                <FormDescription>
                  Used to identify and associate members from your company
                  domain.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Auto-join by domain toggle card */}
          <FormField
            control={form.control}
            name="shouldAttachUsersByDomain"
            render={({ field }) => (
              <FormItem>
                <FormLabel
                  className={cn(
                    'group/card flex cursor-pointer items-start gap-3 rounded-2xl border p-3 font-normal transition-[background-color,border-color,box-shadow] duration-150 ease-out select-none',
                    field.value
                      ? 'border-indigo-500/30 bg-indigo-500/[0.04] shadow-none dark:border-indigo-400/30 dark:bg-indigo-500/[0.08]'
                      : 'border-transparent bg-muted/40 shadow-(--shadow-border) hover:bg-muted/60 hover:shadow-(--shadow-border-hover) dark:bg-sidebar-accent/40 dark:hover:bg-sidebar-accent/60',
                  )}
                >
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={(checked) => {
                        field.onChange(checked);
                        if (form.formState.isSubmitted) {
                          void form.trigger('domain');
                        }
                      }}
                      className="mt-0.5 rounded-[5px] data-checked:border-indigo-600 data-checked:bg-indigo-600 dark:data-checked:border-indigo-500 dark:data-checked:bg-indigo-500"
                    />
                  </FormControl>
                  <div className="grid gap-1 leading-snug">
                    <span className="text-xs font-medium text-foreground">
                      Auto-join new members by domain
                    </span>
                    <FormDescription className="leading-relaxed">
                      Automatically add users who sign up with a matching{' '}
                      <span className="font-mono text-[10.5px] text-foreground/80">
                        @{(watchedDomain ?? '').trim() || 'domain.com'}
                      </span>{' '}
                      email address to this organization.
                    </FormDescription>
                  </div>
                </FormLabel>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Form Actions */}
        <div className="flex items-center justify-end gap-2 pt-2">
          {showCancel && (
            <Button
              type="button"
              variant="ghost"
              size="lg"
              onClick={() => router.back()}
              className="rounded-lg px-3 text-xs font-medium text-muted-foreground hover:text-foreground motion-safe:transition-[scale,background-color,color] motion-safe:duration-150 motion-safe:ease-out enabled:active:scale-[0.96]"
            >
              Cancel
            </Button>
          )}
          <Button
            type="submit"
            size="lg"
            disabled={form.formState.isSubmitting}
            className={cn(
              'rounded-lg bg-indigo-600 ps-3 pe-3.5 text-xs font-medium text-white shadow-xs hover:bg-indigo-500 motion-safe:transition-[scale,background-color,box-shadow] motion-safe:duration-150 motion-safe:ease-out enabled:active:scale-[0.96] dark:bg-indigo-600 dark:hover:bg-indigo-500',
              !showCancel && 'w-full ps-3.5 pe-3.5',
            )}
          >
            <HugeiconsIcon
              icon={PlusSignIcon}
              strokeWidth={2}
              className="size-3.5"
            />
            <span>Create organization</span>
          </Button>
        </div>
      </form>
    </Form>
  );
}
