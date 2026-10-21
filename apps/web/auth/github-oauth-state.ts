import { randomBytes, timingSafeEqual } from 'node:crypto';

import { cookies } from 'next/headers';

const STATE_COOKIE = 'github_oauth_state';
const CALLBACK_PATH = '/api/auth/callback/github';

export async function createGithubOAuthState() {
  const state = randomBytes(32).toString('hex');

  (await cookies()).set(STATE_COOKIE, state, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: CALLBACK_PATH,
    maxAge: 60 * 10,
  });

  return state;
}

export async function consumeGithubOAuthState(receivedState: string | null) {
  const cookieStore = await cookies();
  const expectedState = cookieStore.get(STATE_COOKIE)?.value;

  cookieStore.set(STATE_COOKIE, '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: CALLBACK_PATH,
    maxAge: 0,
  });

  if (!expectedState || !receivedState || !/^[0-9a-f]{64}$/.test(receivedState)) {
    return false;
  }

  const expected = Buffer.from(expectedState, 'utf8');
  const received = Buffer.from(receivedState, 'utf8');

  return expected.length === received.length && timingSafeEqual(expected, received);
}
