import type { Field, Relationship } from '@/@types/schema';
import { api } from '@/http/api';

import { handleApiError } from '../error-handler';
import { APIResponse } from '../types';

interface UpdateEntityRequest {
  org: string;
  name: string;
  id: string;
  tableName: string;
  fields: Field[];
  relationships: Relationship[];
}

export async function updateEntity({
  name,
  id,
  fields,
  relationships,
  org,
}: UpdateEntityRequest): Promise<APIResponse<void>> {
  try {
    await api.put(`organizations/${org}/entities/${id}`, {
      json: {
        name,
        fields,
        relationships,
      },
      next: {
        tags: ['entity'],
      },
    });

    return {
      success: true,
      data: undefined,
    };
  } catch (error) {
    return handleApiError(error);
  }
}
