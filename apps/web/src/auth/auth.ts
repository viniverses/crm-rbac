import { defineAbilityFor } from '@crm/auth';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

import { getMembership } from '@/http/auth/get-membership';
import { getProfile } from '@/http/auth/get-profile';

export async function isAuthenticated() {
  const cookieStore = await cookies();

  return !!cookieStore.get('token')?.value;
}

export async function getCurrentUser() {
  const cookieStore = await cookies();

  const token = cookieStore.get('token')?.value;

  if (!token) {
    redirect('/sign-in');
  }

  try {
    const user = await getProfile();

    return user;
  } catch (error) {}

  redirect('/api/auth/sign-out');
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

  const membership = await getMembership(currentOrganization);

  return membership;
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
