import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const guestOnlyRoutes = [
  '/logowanie',
  '/rejestracja',
  '/aktywacja-konta',
  '/odzyskiwanie-hasla',
  '/resetowanie-hasla',
];

const authRoutes = [
  '/dodaj-oferte',
  '/konto',
  '/klucz-dostepu',
];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const authToken = request.cookies.get('authToken')?.value;

  const isGuestOnlyRoute = guestOnlyRoutes.some(route => pathname.startsWith(route));
  const isAuthRoute = authRoutes.some(route => pathname.startsWith(route));

  if (isGuestOnlyRoute && authToken) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  if (isAuthRoute && !authToken) {
    const loginUrl = new URL('/logowanie', request.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
