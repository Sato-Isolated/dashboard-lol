import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip middleware for static files and API routes
  if (
    pathname.startsWith('/_next/') ||
    pathname.startsWith('/api/') ||
    pathname.startsWith('/static/') ||
    pathname.includes('.') // Any file with extension
  ) {
    return NextResponse.next();
  }

  // Check for specific patterns that indicate static/development files
  const staticFilePatterns = [
    /installHook\.js/i,
    /webpack/i,
    /chunk/i,
    /\.map$/i,
    /\.(js|css|json|ico|png|jpg|jpeg|gif|svg|woff|woff2|ttf|eot)$/i,
  ];

  for (const pattern of staticFilePatterns) {
    if (pattern.test(pathname)) {
      return new NextResponse(null, { status: 404 });
    }
  }

  // Check summoner route pattern specifically
  const summonerRouteMatch = pathname.match(
    /^\/([^\/]+)\/summoner\/([^\/]+)\/([^\/]+)$/
  );
  if (summonerRouteMatch) {
    const [, region, name, tagline] = summonerRouteMatch;

    // Validate region format (should be letters and numbers)
    if (!/^[a-z0-9]+$/i.test(region)) {
      return new NextResponse(null, { status: 404 });
    }

    // Validate that name and tagline don't contain file extensions
    if (name.includes('.') || tagline.includes('.')) {
      return new NextResponse(null, { status: 404 });
    }

    // Validate basic summoner name format
    if (name.length < 1 || name.length > 16) {
      return new NextResponse(null, { status: 404 });
    }

    // Validate tagline format (alphanumeric only, typical length)
    if (!/^[a-zA-Z0-9]{2,10}$/.test(tagline)) {
      return new NextResponse(null, { status: 404 });
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
     * - Static file extensions
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.).*)',
  ],
};
