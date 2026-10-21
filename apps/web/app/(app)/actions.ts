'use server';

import { redirect } from 'next/navigation';

import { clearAuthToken } from '@/auth/session';

export async function signOut() {
  await clearAuthToken();

  redirect('/sign-in');
}
