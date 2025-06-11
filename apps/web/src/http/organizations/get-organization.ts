import { Role } from '@crm/auth';

import { api } from '@/http/api';

import { handleApiError } from '../error-handler';
import { APIResponse } from './../types';

export interface GetOrganizationResponse {
  organization: {
    id: string;
    name: string;
    slug: string;
    avatarUrl: string | null;
    role: Role;
    domain: string | null;
    shouldAttachUsersByDomain: boolean;
    createdAt: Date;
    updatedAt: Date;
  };
}

export async function getOrganization(slug: string): Promise<APIResponse<GetOrganizationResponse>> {
  try {
    const response = await api
      .get(`organizations/${slug}`, {
        next: {
          tags: ['organization'],
        },
      })
      .json<GetOrganizationResponse>();

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
