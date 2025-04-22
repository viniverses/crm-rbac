import { Role } from '@crm/auth';

import { api } from '@/http/api';

import { handleApiError } from '../error-handler';
import { APIResponse } from './../types';

interface GetOrganizationResponse {
  organization: {
    id: string;
    name: string;
    slug: string;
    avatarUrl: string | null;
    role: Role;
    domain: string | null;
    shouldAttachUsersByDomain: boolean;
  };
}

export async function getOrganization(slug: string): Promise<APIResponse<GetOrganizationResponse>> {
  try {
    const response = await api.get(`organizations/${slug}`).json<GetOrganizationResponse>();

    return {
      success: true,
      data: response,
    };
  } catch (error) {
    return handleApiError(error, {
      unauthorized: 'Você não possui permissão para acessar esta organização',
    });
  }
}
