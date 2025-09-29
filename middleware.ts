import { NextResponse, type NextRequest } from 'next/server'
import { log } from '@/lib/logger'

// Simple in-memory rate limiting store (in production, use Redis)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>()

// Rate limiting configuration
const RATE_LIMITS = {
  '/api/auth': { max: 5, window: 60 * 1000 }, // 5 requests per minute
  '/api/stripe': { max: 10, window: 60 * 1000 }, // 10 requests per minute
  default: { max: 100, window: 60 * 1000 }, // 100 requests per minute
}

function getRateLimit(pathname: string) {
  if (pathname.startsWith('/api/auth')) return RATE_LIMITS['/api/auth']
  if (pathname.startsWith('/api/stripe')) return RATE_LIMITS['/api/stripe']
  return RATE_LIMITS.default
}

function checkRateLimit(ip: string, pathname: string): boolean {
  const rateLimit = getRateLimit(pathname)
  const key = `${ip}:${pathname}`
  const now = Date.now()
  
  const current = rateLimitStore.get(key)
  
  if (!current || now > current.resetTime) {
    rateLimitStore.set(key, { count: 1, resetTime: now + rateLimit.window })
    return true
  }
  
  if (current.count >= rateLimit.max) {
    return false
  }
  
  current.count++
  return true
}

function getClientIP(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for')
  const realIP = request.headers.get('x-real-ip')
  return forwarded?.split(',')[0] || realIP || 'unknown'
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const requestId = `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  const ip = getClientIP(request)
  
  // Add request ID to headers for tracing
  const response = NextResponse.next()
  response.headers.set('x-request-id', requestId)
  
  // Rate limiting for sensitive endpoints
  if (pathname.startsWith('/api/auth') || pathname.startsWith('/api/stripe')) {
    if (!checkRateLimit(ip, pathname)) {
      log.warn('Rate limit exceeded', { requestId, ip, pathname })
      return NextResponse.json(
        { error: 'Rate limit exceeded', retryAfter: 60 },
        { status: 429 }
      )
    }
  }

  // Allow public routes
  if (
    pathname.startsWith('/auth') ||
    pathname.startsWith('/api') ||
    pathname === '/' ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/favicon') ||
    pathname.startsWith('/public')
  ) {
    return response
  }

  // Admin route protection
  if (pathname.startsWith('/admin')) {
    // TODO: Implement proper admin role checking
    // For now, allow through but log the access
    log.info('Admin route accessed', { requestId, pathname, ip })
  }

  // Workspace scoping for protected routes
  if (pathname.startsWith('/dashboard') || pathname.startsWith('/onboarding')) {
    // TODO: Implement workspace scoping
    // For now, allow through
    log.info('Protected route accessed', { requestId, pathname, ip })
  }

  return response
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
