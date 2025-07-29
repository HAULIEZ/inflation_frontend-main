// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check for the presence of the 'inflation-user' cookie
  const isAuthenticated = request.cookies.has('inflation-user');

  // Define public and protected routes
  const publicRoutes = ['/sign-in', '/sign-up'];
  const protectedRoutes = ['/dashboard', '/profile', '/upload'];

  // 1. If user is authenticated and tries to access public auth routes, redirect to dashboard
  if (isAuthenticated && publicRoutes.includes(pathname)) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // 2. If user is NOT authenticated and tries to access protected routes, redirect to sign-in
  if (!isAuthenticated && protectedRoutes.some(route => pathname.startsWith(route))) {
    return NextResponse.redirect(new URL('/sign-in', request.url));
  }

  // 3. Otherwise, allow request to proceed
  return NextResponse.next();
}

// Define paths where middleware applies
export const config = {
  matcher: [
    // Apply middleware to all paths except those that match the following:
    '/((?!api|_next/static|_next/image|favicon.ico|robots.txt).*)',
  ],
};
