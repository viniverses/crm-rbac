import * as z from 'zod';

export const createOrganizationFormSchema = z
  .object({
    name: z.string().min(4, { message: 'O nome deve conter pelo menos 4 caracteres' }),
    domain: z
      .string()
      .nullable()
      .refine(
        (value) => {
          if (value) {
            const domainRegex = /^[a-zA-Z0-9.-]+.[a-zA-Z]{2,}$/;
            return domainRegex.test(value);
          }
          return true;
        },
        {
          message: 'Domínio inválido',
        },
      ),
    shouldAttachUsersByDomain: z.boolean().default(false).optional(),
    avatarUrl: z.string().optional(),
  })
  .refine(
    (data) => {
      if (data.shouldAttachUsersByDomain === true && !data.domain) {
        return false;
      }

      return true;
    },
    {
      message: 'Domínio é obrigatório quando o auto-join está habilitado.',
      path: ['domain'],
    },
  );

export type CreateOrganizationForm = z.infer<typeof createOrganizationFormSchema>;
