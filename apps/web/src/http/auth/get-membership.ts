import { Role } from '@crm/auth';

import { api } from '../api';

interface GetMembershipResponse {
  membership: {
    id: string;
    organizationId: string;
    userId: string;
    role: Role;
  };
}

export async function getMembership(slug: string): Promise<GetMembershipResponse> {
  const response = await api.get(`organizations/${slug}/membership`);

  return response.json<GetMembershipResponse>();
}
