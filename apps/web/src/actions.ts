'use server';

import { env } from '@crm/env';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export async function signInWithGithub() {
  const githubAuthUrl = new URL('login/oauth/authorize', 'https://github.com');

  githubAuthUrl.searchParams.set('client_id', env.GITHUB_CLIENT_ID);
  githubAuthUrl.searchParams.set('redirect_uri', env.GITHUB_OAUTH_CLIENT_REDIRECT_URI);
  githubAuthUrl.searchParams.set('scope', 'user');

  redirect(githubAuthUrl.toString());
}

export async function signOut() {
  const cookieStore = await cookies();

  cookieStore.delete('token');

  redirect('/sign-in');
}
