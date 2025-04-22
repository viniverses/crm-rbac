import * as z from 'zod';

const baseOrganizationSchema = z.object({
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
  avatarUrl: z.string().optional(),
});

export const organizationFormSchemaClient = baseOrganizationSchema
  .extend({
    shouldAttachUsersByDomain: z.boolean().default(false).optional(),
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

export const organizationFormSchemaServer = baseOrganizationSchema
  .extend({
    shouldAttachUsersByDomain: z
      .union([z.literal('on'), z.literal('off'), z.boolean()])
      .transform((value) => value === true || value === 'on')
      .default(false),
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

export type OrganizationForm = z.infer<typeof organizationFormSchemaClient>;
