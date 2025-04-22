'use client';

import { Loader2 } from 'lucide-react';
import { useRef, useState } from 'react';
import { toast } from 'sonner';

import { FormErrorAlert } from '@/components/form-error-alert';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { uploadFile } from '@/components/upload/actions';
import { AvatarUploaderField } from '@/components/upload/avatar-uploader-field';
import { useHybridForm } from '@/hooks/use-hybrid-form';

import { createOrganizationAction, updateOrganizationAction } from './actions';
import { type CreateOrganizationForm, createOrganizationFormSchema } from './schema';

type OrganizationFormProps = {
  defaultValues?: CreateOrganizationForm;
  mode?: 'create' | 'edit';
};

export function OrganizationForm({ defaultValues, mode = 'create' }: OrganizationFormProps) {
  const formRef = useRef<HTMLFormElement>(null);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const { form, formAction, state, isPending, handleSubmit } = useHybridForm<CreateOrganizationForm>({
    schema: createOrganizationFormSchema,
    formRef: formRef,
    serverAction: mode === 'create' ? createOrganizationAction : updateOrganizationAction,
    defaultValues: defaultValues ?? {
      name: '',
      domain: '',
      avatarUrl: undefined,
    },
    onSuccess: () => {
      // router.push('/organizations');
      toast.success(mode === 'create' ? 'Organização criada com sucesso' : 'Organização atualizada com sucesso');
    },
  });

  const handleUploadImage = async (file: File) => {
    setIsUploadingImage(true);
    const imageUrl = await uploadFile(file);

    if (!imageUrl) {
      toast.error('Falha ao fazer o upload da imagem. Por favor, tente novamente.');
      setIsUploadingImage(false);
      return;
    }

    setIsUploadingImage(false);
    return imageUrl;
  };

  const isSubmitting = isPending || isUploadingImage;

  return (
    <div className="flex flex-col gap-6">
      <Form {...form}>
        <form onSubmit={handleSubmit} ref={formRef} action={formAction} className="grid gap-6">
          <AvatarUploaderField name="avatarUrl" control={form.control} onUpload={handleUploadImage} maxSizeInMB={10} />

          <FormErrorAlert
            state={state}
            title={`Falha ao ${mode === 'create' ? 'criar' : 'atualizar'} organização`}
            description={state.message}
          />

          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nome</FormLabel>
                <FormControl>
                  <Input placeholder="Nome da organização" {...field} />
                </FormControl>
                <FormMessage>{state.errors?.name?.[0]}</FormMessage>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="domain"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Domínio</FormLabel>
                <FormControl>
                  <div className="flex rounded-md shadow-xs">
                    <span className="border-input bg-background text-muted-foreground -z-10 inline-flex items-center rounded-s-md border px-3 text-sm">
                      https://
                    </span>
                    <Input
                      {...field}
                      className="-ms-px rounded-s-none shadow-none"
                      placeholder="dominio.com"
                      type="text"
                      inputMode="url"
                      value={field.value ?? ''}
                    />
                  </div>
                </FormControl>
                <FormMessage>{state.errors?.domain?.[0]}</FormMessage>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="shouldAttachUsersByDomain"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-y-0 space-x-3 rounded-md border p-4 shadow">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    id="shouldAttachUsersByDomain"
                    name="shouldAttachUsersByDomain"
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel htmlFor="shouldAttachUsersByDomain">Anexar usuários por domínio</FormLabel>
                  <FormDescription>
                    Se marcado, todos os usuários com o domínio da organização serão automaticamente anexados à
                    organização ao criar a conta.
                  </FormDescription>
                </div>
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isPending ? (
              <Loader2 className="size-4 animate-spin" />
            ) : mode === 'create' ? (
              'Criar Organização'
            ) : (
              'Atualizar Organização'
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
}
