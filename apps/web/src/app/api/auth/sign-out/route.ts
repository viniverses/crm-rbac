import { cookies } from 'next/headers';

export async function GET(request: Request) {
  const url = new URL(request.url);
  url.pathname = '/sign-in';

  const cookieStore = await cookies();

  cookieStore.delete('token');

  return Response.redirect(url);
}
