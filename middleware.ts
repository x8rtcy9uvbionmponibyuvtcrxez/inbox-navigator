import { NextResponse, type NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Allow public routes
  if (
    pathname.startsWith('/auth') ||
    pathname.startsWith('/api') ||
    pathname === '/' ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/favicon')
  ) {
    return NextResponse.next()
  }

  // For now, let all routes through
  // In a real app, you'd check for authentication tokens here
  return NextResponse.next()
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/customer/:path*',
    '/dashboard/:path*',
    '/onboarding/:path*',
    '/billing/:path*',
    '/settings/:path*',
  ],
}
