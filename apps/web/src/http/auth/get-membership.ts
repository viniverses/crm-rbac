import { Role } from '@crm/auth';

import { api } from '../api';
import { handleApiError } from '../error-handler';
import { APIResponse } from '../types';

interface GetMembershipResponse {
  membership: {
    id: string;
    organizationId: string;
    userId: string;
    role: Role;
  };
}

export async function getMembership(slug: string): Promise<APIResponse<GetMembershipResponse>> {
  try {
    const response = await api.get(`organizations/${slug}/membership`).json<GetMembershipResponse>();

    return {
      success: true,
      data: response,
    };
  } catch (error) {
    return handleApiError(error);
  }
}
