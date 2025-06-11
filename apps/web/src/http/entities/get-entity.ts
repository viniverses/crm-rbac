import type { Field, Relationship } from '@/@types/schema';
import { api } from '@/http/api';

import { handleApiError } from '../error-handler';
import { APIResponse } from '../types';

interface GetEntityRequest {
  org: string;
  tableSlug: string;
}

export interface GetEntityResponse {
  entity: {
    id: string;
    name: string;
    slug: string;
    fields: Field[];
    relationships: Relationship[];
  };
}

export async function getEntity({ org, tableSlug }: GetEntityRequest): Promise<APIResponse<GetEntityResponse>> {
  try {
    const response = await api
      .get(`organizations/${org}/entities/${tableSlug}`, {
        next: {
          tags: ['entity'],
        },
      })
      .json<GetEntityResponse>();

    console.log(response);

    return {
      success: true,
      data: response,
    };
  } catch (error) {
    return handleApiError(error);
  }
}
