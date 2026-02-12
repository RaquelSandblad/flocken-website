// Next.js Middleware
// Handles A/B test variant assignment server-side to prevent flicker

import { NextRequest } from 'next/server';
import { handleABTestMiddleware } from './lib/ab-testing';

export function middleware(request: NextRequest) {
  // Only run on pages where we might have experiments
  // Add more paths here as needed
  const pathname = request.nextUrl.pathname;

  // Skip static files, API routes, and _next
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.includes('.') // Static files like .js, .css, .png
  ) {
    return;
  }

  // Handle A/B test assignments
  const { response } = handleABTestMiddleware(request);

  return response;
}

// Configure which paths the middleware runs on
export const config = {
  matcher: [
    // Match all paths except static files and API
    '/((?!_next/static|_next/image|favicon.ico|api).*)',
  ],
};
