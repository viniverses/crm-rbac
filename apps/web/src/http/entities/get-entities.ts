import type { Field, Relationship } from '@/@types/schema';
import { api } from '@/http/api';

import { handleApiError } from '../error-handler';
import { APIResponse } from '../types';

interface GetEntitiesRequest {
  org: string;
}

export interface GetEntitiesResponse {
  entities: Array<{
    id: string;
    name: string;
    slug: string;
    fields: Field[];
    relationships: Relationship[];
  }>;
}

export async function getEntities({ org }: GetEntitiesRequest): Promise<APIResponse<GetEntitiesResponse>> {
  try {
    const response = await api
      .get(`organizations/${org}/entities`, {
        next: {
          tags: ['entities'],
        },
      })
      .json<GetEntitiesResponse>();

    return {
      success: true,
      data: response,
    };
  } catch (error) {
    return handleApiError(error);
  }
}
