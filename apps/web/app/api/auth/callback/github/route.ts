import { consumeGithubOAuthState } from '@/auth/github-oauth-state';
import { setAuthToken } from '@/auth/session';
import { signInWithGithub } from '@/services/auth/sign-in-with-github';

export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get('code');
  const state = url.searchParams.get('state');
  const signInUrl = new URL('/sign-in?error=github', url.origin);

  if (!(await consumeGithubOAuthState(state)) || !code) {
    return Response.redirect(signInUrl);
  }

  const { token } = await signInWithGithub({ code });

  await setAuthToken(token);

  return Response.redirect(url.origin);
}
