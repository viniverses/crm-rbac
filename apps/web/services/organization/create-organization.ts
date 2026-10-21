import { api } from '@/services/api';

export interface CreateOrganizationRequest {
  name: string;
  domain: string | null;
  shouldAttachUsersByDomain: boolean;
  avatarUrl: string | null;
}

export interface CreateOrganizationResponse {
  organizationId: string;
  slug: string;
}

export async function createOrganization(input: CreateOrganizationRequest) {
  const { data } = await api.post<CreateOrganizationResponse>('/organizations', input);
  return data;
}
