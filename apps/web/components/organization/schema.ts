import { z } from 'zod';

const DOMAIN_REGEX = /^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

export const organizationFormSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(4, { message: 'Organization name must be at least 4 characters.' }),
    domain: z
      .string()
      .trim()
      .optional()
      .refine(
        (value) => {
          if (!value) return true;
          return DOMAIN_REGEX.test(value);
        },
        {
          message: 'Invalid domain format (e.g. acme.studio).',
        },
      ),
    shouldAttachUsersByDomain: z.boolean(),
    avatarUrl: z.string().optional(),
  })
  .refine(
    (data) => {
      if (data.shouldAttachUsersByDomain && !data.domain) {
        return false;
      }
      return true;
    },
    {
      message: 'Domain is required when auto-join by domain is enabled.',
      path: ['domain'],
    },
  );

export type OrganizationFormValues = z.infer<typeof organizationFormSchema>;
