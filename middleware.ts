import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// AI crawlers that aggressively scrape dynamic SSR routes and blow past the 10ms CPU limit
const AI_CRAWLER_REGEX = /GPTBot|ChatGPT-User|ClaudeBot|anthropic-ai|Bytespider|CCBot|Amazonbot/i;

export function middleware(request: NextRequest) {
  const userAgent = request.headers.get('user-agent') || '';

  // Instantly reject AI crawlers in < 0.2ms before expensive React SSR begins
  if (AI_CRAWLER_REGEX.test(userAgent)) {
    return new NextResponse('Access Denied for Automated AI Crawlers', {
      status: 403,
      headers: {
        'Content-Type': 'text/plain',
        'Cache-Control': 'public, max-age=86400',
      },
    });
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // Guard SSR routes from crawler denial-of-service
    '/movie/:path*',
    '/tv/:path*',
    '/watch/:path*',
    '/api/:path*',
  ],
};
