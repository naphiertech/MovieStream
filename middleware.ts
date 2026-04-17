import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const url = request.nextUrl;

  // Protect the admin routes
  if (url.pathname.startsWith('/admin')) {
    
    // Developer Backdoor: If they visit /admin?auth=dev_mode, we set a temporary cookie to let them in
    if (url.searchParams.get('auth') === 'dev_mode') {
      const response = NextResponse.redirect(new URL('/admin', request.url));
      response.cookies.set('admin_session', 'authenticated', { 
        path: '/',
        maxAge: 60 * 60 * 24 // 24 hours
      });
      return response;
    }

    // Check if the user has the admin session cookie
    const hasAdminSession = request.cookies.has('admin_session');

    if (!hasAdminSession) {
      // Redirect unauthorized users to the restricted UI
      return NextResponse.redirect(new URL('/restricted', request.url));
    }
  }

  // Allow all other requests to proceed
  return NextResponse.next();
}

// Ensure the middleware only runs on matching paths to optimize performance
export const config = {
  matcher: ['/admin/:path*'],
};
