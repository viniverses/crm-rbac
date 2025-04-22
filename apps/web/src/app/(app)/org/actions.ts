'use server';

import { HTTPError } from 'ky';

import { createOrganizationFormSchema } from '@/app/(app)/org/schema';
import { getCurrentOrganization } from '@/auth/auth';
import { FormState } from '@/hooks/use-hybrid-form';
import { createOrganization } from '@/http/organizations/create-organization';
import { updateOrganization } from '@/http/organizations/update-organization';

export async function createOrganizationAction(formData: FormData): Promise<FormState> {
  try {
    const parsedFormData = Object.fromEntries(formData);

    const formDataWithBoolean = {
      ...parsedFormData,
      shouldAttachUsersByDomain: parsedFormData.shouldAttachUsersByDomain === 'on',
    };

    const { success, data, error } = createOrganizationFormSchema.safeParse(formDataWithBoolean);

    if (!success) {
      const fields: Record<string, string> = {};
      for (const key of Object.keys(parsedFormData)) {
        fields[key] = parsedFormData[key].toString();
      }

      return {
        message: 'Invalid form data',
        success: false,
        errors: error.flatten().fieldErrors,
        fields,
      };
    }

    const { name, domain, shouldAttachUsersByDomain, avatarUrl } = data;

    await createOrganization({
      name,
      domain,
      shouldAttachUsersByDomain: shouldAttachUsersByDomain ?? false,
      avatarUrl: avatarUrl ?? null,
    });

    return {
      message: 'Organization created successfully',
      success: true,
    };
  } catch (error) {
    if (error instanceof HTTPError) {
      const { message } = await error.response.json<{ message: string }>();
      return {
        success: false,
        message,
      };
    }

    return {
      success: false,
      message: 'Unexpected error. Please try again later.',
    };
  }
}

export async function updateOrganizationAction(formData: FormData): Promise<FormState> {
  try {
    const slug = await getCurrentOrganization();
    const parsedFormData = Object.fromEntries(formData);

    const formDataWithBoolean = {
      ...parsedFormData,
      shouldAttachUsersByDomain: parsedFormData.shouldAttachUsersByDomain === 'on',
    };

    const { success, data, error } = createOrganizationFormSchema.safeParse(formDataWithBoolean);

    if (!success) {
      const fields: Record<string, string> = {};
      for (const key of Object.keys(parsedFormData)) {
        fields[key] = parsedFormData[key].toString();
      }

      return {
        message: 'Invalid form data',
        success: false,
        errors: error.flatten().fieldErrors,
        fields,
      };
    }

    const { name, domain, shouldAttachUsersByDomain, avatarUrl } = data;

    await updateOrganization({
      slug: slug!,
      name,
      domain,
      shouldAttachUsersByDomain: shouldAttachUsersByDomain ?? false,
      avatarUrl: avatarUrl ?? null,
    });

    return {
      message: 'Organization updated successfully',
      success: true,
    };
  } catch (error) {
    if (error instanceof HTTPError) {
      const { message } = await error.response.json<{ message: string }>();
      return {
        success: false,
        message,
      };
    }

    console.error(error);
    return {
      success: false,
      message: 'Unexpected error. Please try again later.',
    };
  }
}
