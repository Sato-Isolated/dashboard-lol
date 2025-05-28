import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip middleware for static files and API routes
  if (
    pathname.startsWith('/_next/') ||
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
    const [, region, rawName, rawTagline] = summonerRouteMatch;

    // Decode URL components to handle encoded characters
    let name: string, tagline: string;
    try {
      name = decodeURIComponent(rawName);
      tagline = decodeURIComponent(rawTagline);
    } catch {
      // Invalid URL encoding
      return new NextResponse(null, { status: 404 });
    }

    // Validate region format (should be letters and numbers)
    if (!/^[a-z0-9]+$/i.test(region)) {
      return new NextResponse(null, { status: 404 });
    }

    // Validate that raw name and tagline don't contain file extensions
    if (rawName.includes('.') || rawTagline.includes('.')) {
      return new NextResponse(null, { status: 404 });
    }

    // Validate decoded summoner name format (allow spaces and common characters)
    if (
      name.length < 1 ||
      name.length > 16 ||
      !/^[a-zA-Z0-9_\s]+$/.test(name)
    ) {
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
