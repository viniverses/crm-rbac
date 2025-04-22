import { Role } from '@crm/auth';

import { api } from '@/http/api';

import { handleApiError } from '../error-handler';
import { APIResponse } from '../types';

interface GetUserOrganizationsResponse {
  organizations: Array<{
    id: string;
    name: string;
    slug: string;
    avatarUrl: string | null;
    role: Role;
    domain: string | null;
    shouldAttachUsersByDomain: boolean;
  }>;
}

export async function getUserOrganizations(): Promise<APIResponse<GetUserOrganizationsResponse>> {
  try {
    const response = await api.get('organizations').json<GetUserOrganizationsResponse>();

    return {
      success: true,
      data: response,
    };
  } catch (error) {
    return handleApiError(error);
  }
}
