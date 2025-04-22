import { api } from '@/http/api';

import { handleApiError } from '../error-handler';
import { APIResponse } from '../types';

interface UpdateOrganizationRequest {
  slug: string;
  name: string;
  domain: string | null;
  shouldAttachUsersByDomain: boolean;
  avatarUrl: string | null;
}

type UpdateOrganizationResponse = void;

export async function updateOrganization({
  slug,
  name,
  domain,
  shouldAttachUsersByDomain,
  avatarUrl,
}: UpdateOrganizationRequest): Promise<APIResponse<UpdateOrganizationResponse>> {
  try {
    const response = await api
      .put(`organizations/${slug}`, {
        json: {
          name,
          domain,
          shouldAttachUsersByDomain,
          avatarUrl,
        },
        next: {
          tags: ['organizations'],
        },
      })
      .json<UpdateOrganizationResponse>();

    return {
      success: true,
      data: response,
    };
  } catch (error) {
    return handleApiError(error);
  }
}
