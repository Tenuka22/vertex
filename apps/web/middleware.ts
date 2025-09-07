import { getCookieCache } from 'better-auth/cookies';
import { type NextRequest, NextResponse } from 'next/server';

export const middleware = async (request: NextRequest) => {
  const session = await getCookieCache(request);
  if (!session && request.url.startsWith('/app')) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
  if (session && request.url === '/login') {
    return NextResponse.redirect(new URL('/app', request.url));
  }
  return NextResponse.next();
};
