import { api } from '@/services/api';

export interface OrganizationListItem {
  id: string;
  name: string;
  slug: string;
  avatarUrl: string | null;
  role: string;
}

export async function getOrganizations(): Promise<OrganizationListItem[]> {
  const { data } = await api.get<{ organizations: OrganizationListItem[] }>('/organizations');
  return data.organizations;
}
