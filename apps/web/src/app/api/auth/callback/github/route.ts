import { cookies } from 'next/headers';

import { signInWithGithub } from '@/http/auth/sign-in-with-github';

export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get('code');

  if (!code) {
    return new Response(JSON.stringify({ error: 'No code provided' }), { status: 400 });
  }

  const signInResponse = await signInWithGithub({ code });

  if (!signInResponse.success) {
    return new Response(JSON.stringify(signInResponse.error), { status: 400 });
  }

  const { token } = signInResponse.data;

  const cookieStore = await cookies();

  cookieStore.set('token', token, {
    path: '/',
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });

  return Response.redirect(url.origin);
}
