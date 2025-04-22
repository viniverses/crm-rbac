'use server';

import { revalidateTag } from 'next/cache';

import { organizationFormSchemaServer } from '@/app/(app)/org/schema';
import { getCurrentOrganization } from '@/auth/auth';
import { FormState } from '@/hooks/use-hybrid-form';
import { handleApiError } from '@/http/error-handler';
import { createOrganization, CreateOrganizationResponse } from '@/http/organizations/create-organization';
import { updateOrganization } from '@/http/organizations/update-organization';
import { parseFormData } from '@/lib/zod-error-handler';

export async function createOrganizationAction(formData: FormData): Promise<FormState<CreateOrganizationResponse>> {
  try {
    const { name, domain, shouldAttachUsersByDomain, avatarUrl } = parseFormData(
      organizationFormSchemaServer,
      formData,
    );

    const response = await createOrganization({
      name,
      domain,
      shouldAttachUsersByDomain: shouldAttachUsersByDomain ?? false,
      avatarUrl: avatarUrl ?? null,
    });

    if (!response.success) {
      return {
        success: false,
        message: response.message,
      };
    }

    revalidateTag('organizations');

    return {
      message: 'Organização criada com sucesso.',
      success: true,
      data: response.data,
    };
  } catch (error) {
    return handleApiError(error);
  }
}

export async function updateOrganizationAction(formData: FormData): Promise<FormState> {
  try {
    const slug = await getCurrentOrganization();

    const { name, domain, avatarUrl, shouldAttachUsersByDomain } = parseFormData(
      organizationFormSchemaServer,
      formData,
    );

    const response = await updateOrganization({
      slug: slug!,
      name,
      domain,
      shouldAttachUsersByDomain,
      avatarUrl: avatarUrl ?? null,
    });

    if (!response.success) {
      return {
        success: false,
        message: response.message,
      };
    }

    revalidateTag('organizations');

    return {
      success: true,
      message: 'Organização atualizada com sucesso.',
    };
  } catch (error) {
    return handleApiError(error);
  }
}
