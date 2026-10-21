'use server';

import { defineAbilityFor } from '@crm/auth';
import { isAxiosError } from 'axios';
import { cookies } from 'next/headers';

import { getMembership } from '@/services/auth/get-membership';
import { getProfile } from '@/services/auth/get-profile';
import { getAuthToken } from './session';

export async function isAuthenticated() {
  return !!(await getCurrentUser());
}

export async function getCurrentUser() {
  if (!(await getAuthToken())) return null;

  try {
    return await getProfile();
  } catch (error) {
    if (isAxiosError(error) && error.response?.status === 401) return null;
    throw error;
  }
}

export async function getCurrentOrganization() {
  const cookieStore = await cookies();

  return cookieStore.get('@crm-organization')?.value ?? null;
}

export async function getCurrentMembership() {
  const currentOrganization = await getCurrentOrganization();

  if (!currentOrganization) {
    return null;
  }

  try {
    return await getMembership(currentOrganization);
  } catch {
    return null;
  }
}

export async function ability() {
  const currentMembership = await getCurrentMembership();

  if (!currentMembership) {
    return null;
  }

  const ability = defineAbilityFor({
    id: currentMembership.membership.userId,
    role: currentMembership.membership.role,
  });

  return ability;
}
