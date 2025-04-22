'use client';

import { Camera, Loader2 } from 'lucide-react';
import type React from 'react';
import { useState } from 'react';
import { Control, FieldPath, FieldValues, useFormContext } from 'react-hook-form';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { FormControl, FormDescription, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { cn } from '@/lib/utils';

export type AvatarUploaderFieldProps<T extends FieldValues> = {
  control: Control<T>;
  name: FieldPath<T>;
  onUploadComplete?: (imageUrl: string) => void;
  onRemove?: () => void;
  defaultImage?: string;
  className?: string;
  label?: string;
  description?: string;
  fallback?: string;
  maxSizeInMB?: number;
  onUpload: (file: File) => Promise<string | undefined>;
};

export function AvatarUploaderField<T extends FieldValues>({
  control,
  name,
  onUploadComplete,
  onRemove,
  className,
  description = 'Adicione uma imagem para o avatar da organização. JPG, PNG ou GIF. Máximo de 4MB.',
  fallback = '?',
  maxSizeInMB = 4,
  onUpload,
}: AvatarUploaderFieldProps<T>) {
  const { setValue, register } = useFormContext();
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();

    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file size
    if (file.size > maxSizeInMB * 1024 * 1024) {
      setError(`O arquivo excede o limite de ${maxSizeInMB}MB`);
      return;
    }

    // Validate file type
    if (!['image/jpeg', 'image/png', 'image/gif', 'image/webp'].includes(file.type)) {
      setError('O arquivo deve ser JPG, PNG ou GIF');
      return;
    }

    setError(null);
    setIsUploading(true);

    try {
      const imageUrl = await onUpload(file);

      if (!imageUrl) {
        setError('Falha ao fazer o upload da imagem. Por favor, tente novamente.');
        return;
      }

      // Set the image url to the form field
      setValue(name, imageUrl as T[FieldPath<T>], { shouldValidate: true, shouldDirty: true });

      onUploadComplete?.(imageUrl);
    } catch (error) {
      console.error(error);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className={cn('space-y-3', className)}>
          <FormControl>
            <div className="flex flex-col items-center gap-4">
              <div className="relative">
                <Avatar className="size-32 cursor-pointer">
                  {field.value ? (
                    <AvatarImage src={field.value} alt="Avatar" />
                  ) : (
                    <AvatarFallback className="text-lg">{fallback}</AvatarFallback>
                  )}
                  {isUploading && (
                    <div className="bg-background/80 absolute inset-0 flex items-center justify-center rounded-full">
                      <Loader2 className="h-6 w-6 animate-spin" />
                    </div>
                  )}
                </Avatar>
                <label
                  htmlFor={`file_${name}`}
                  className="bg-primary text-primary-foreground ring-ring absolute -right-1 -bottom-1 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full shadow-sm ring-1"
                >
                  <Camera className="h-4 w-4" />
                  <span className="sr-only">Upload avatar</span>
                </label>
                <input
                  id={`file_${name}`}
                  name={`file_${name}`}
                  type="file"
                  accept="image/png, image/jpeg, image/gif, image/webp"
                  className="sr-only"
                  onChange={handleFileChange}
                  disabled={isUploading}
                />
              </div>

              <input id={name} className="hidden" {...register(name)} />

              {field.value && !isUploading && (
                <Button
                  variant="outline"
                  size="sm"
                  type="button"
                  onClick={() => {
                    setValue(name, '' as T[FieldPath<T>], { shouldValidate: true, shouldDirty: true });
                    onRemove?.();
                  }}
                >
                  Remover
                </Button>
              )}
            </div>
          </FormControl>
          {description && <FormDescription className="text-center">{description}</FormDescription>}
          {error ? <FormMessage>{error}</FormMessage> : <FormMessage />}
        </FormItem>
      )}
    />
  );
}
