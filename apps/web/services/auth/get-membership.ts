import { Role } from '@crm/auth'

import { api } from '@/services/api'

export interface GetMembershipResponse {
  membership: {
    id: string
    organizationId: string
    userId: string
    role: Role
  }
}

export async function getMembership(
  slug: string
): Promise<GetMembershipResponse> {
  const { data } = await api.get<GetMembershipResponse>(
    `/organizations/${slug}/membership`
  )

  return data
}
