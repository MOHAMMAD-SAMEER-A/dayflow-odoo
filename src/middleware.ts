import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyToken } from './lib/auth';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Skip checks for static assets, public assets, or metadata files
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.includes('.') ||
    pathname === '/unauthorized'
  ) {
    return NextResponse.next();
  }

  // Get token from cookies
  const token = request.cookies.get('dayflow_token')?.value;

  // 2. Redirect logged-in users away from auth pages
  if (pathname === '/signin' || pathname === '/signup') {
    if (token) {
      const payload = await verifyToken(token);
      if (payload) {
        return NextResponse.redirect(new URL('/', request.url));
      }
    }
    return NextResponse.next();
  }

  // 3. Force signin if no token is found for all other routes
  if (!token) {
    return NextResponse.redirect(new URL('/signin', request.url));
  }

  const payload = await verifyToken(token);

  if (!payload) {
    const response = NextResponse.redirect(new URL('/signin', request.url));
    response.cookies.delete('dayflow_token');
    return response;
  }

  const userRole = payload.role;

  // 4. Role Guards
  // - Admin specific directories / pages
  if (pathname.startsWith('/admin')) {
    if (userRole !== 'ADMIN') {
      return NextResponse.redirect(new URL('/unauthorized', request.url));
    }
  }

  // - Admin and HR Officer directories / pages
  if (pathname.startsWith('/management')) {
    if (userRole !== 'ADMIN' && userRole !== 'HR_OFFICER') {
      return NextResponse.redirect(new URL('/unauthorized', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
