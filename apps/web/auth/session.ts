import { cookies } from 'next/headers';

const AUTH_COOKIE = 'token';
const SESSION_MAX_AGE = 60 * 60 * 24 * 7;

export async function getAuthToken() {
  return (await cookies()).get(AUTH_COOKIE)?.value;
}

export async function setAuthToken(token: string) {
  (await cookies()).set(AUTH_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: SESSION_MAX_AGE,
  });
}

export async function clearAuthToken() {
  (await cookies()).delete(AUTH_COOKIE);
}
