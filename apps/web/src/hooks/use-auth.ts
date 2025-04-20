import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

import { getProfile } from '@/http/get-profile';

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
