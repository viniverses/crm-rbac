import type { Field, Relationship } from '@/@types/schema';
import { api } from '@/http/api';

import { handleApiError } from '../error-handler';
import { APIResponse } from '../types';

interface CreateEntityRequest {
  org: string;
  name: string;
  tableName: string;
  fields: Field[];
  relationships: Relationship[];
}

export interface CreateEntityResponse {
  tableSlug: string;
}

export async function createEntity({
  name,
  tableName,
  fields,
  relationships,
  org,
}: CreateEntityRequest): Promise<APIResponse<CreateEntityResponse>> {
  try {
    const response = await api
      .post(`organizations/${org}/entities`, {
        json: {
          name,
          slug: tableName,
          fields,
          relationships,
        },
        next: {
          tags: ['entities'],
        },
      })
      .json<CreateEntityResponse>();

    return {
      success: true,
      data: response,
    };
  } catch (error) {
    return handleApiError(error);
  }
}
