import { api } from '@/http/api';

import { handleApiError } from '../error-handler';
import { APIResponse } from '../types';

interface CreateOrganizationRequest {
  name: string;
  domain: string | null;
  shouldAttachUsersByDomain: boolean;
  avatarUrl: string | null;
}

interface CreateOrganizationResponse {
  organizationId: string;
}

export async function createOrganization({
  name,
  domain,
  shouldAttachUsersByDomain,
  avatarUrl,
}: CreateOrganizationRequest): Promise<APIResponse<CreateOrganizationResponse>> {
  try {
    const response = await api
      .post('organizations', {
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
      .json<CreateOrganizationResponse>();

    return {
      success: true,
      data: response,
    };
  } catch (error) {
    return handleApiError(error);
  }
}
