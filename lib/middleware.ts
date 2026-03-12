import { NextRequest, NextResponse } from 'next/server'
import { AuthService } from '@/lib/auth'

// Public paths that don't require authentication
const publicPaths = ['/login', '/register', '/forgot-password', '/reset-password']

// API routes that are public
const publicApiPaths = ['/api/auth/login', '/api/auth/register', '/api/auth/forgot-password', '/api/auth/reset-password']

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // Skip middleware for static files and public paths
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api/health') ||
    pathname.startsWith('/static') ||
    publicPaths.includes(pathname) ||
    publicApiPaths.some(apiPath => pathname.startsWith(apiPath))
  ) {
    return NextResponse.next()
  }

  // Get session token from cookies
  const sessionToken = request.cookies.get('session_token')?.value

  if (!sessionToken) {
    // Redirect to login for protected routes
    if (pathname.startsWith('/profile') || pathname.startsWith('/dashboard')) {
      const loginUrl = new URL('/login', request.url)
      loginUrl.searchParams.set('redirect', pathname)
      return NextResponse.redirect(loginUrl)
    }
    return NextResponse.next()
  }

  try {
    // Verify session token
    const user = await AuthService.getUserBySessionToken(sessionToken)
    
    if (!user) {
      // Clear invalid session token
      const response = NextResponse.redirect(new URL('/login', request.url))
      response.cookies.delete('session_token')
      return response
    }

    // Add user info to request headers for API routes
    if (pathname.startsWith('/api/')) {
      const requestHeaders = new Headers(request.headers)
      requestHeaders.set('x-user-id', user.id)
      requestHeaders.set('x-user-email', user.email)
      requestHeaders.set('x-user-role', user.role || 'user')
      
      return NextResponse.next({
        request: {
          headers: requestHeaders,
        },
      })
    }

    return NextResponse.next()
    
  } catch (error) {
    console.error('Middleware error:', error)
    
    // Clear session token on error
    const response = NextResponse.redirect(new URL('/login', request.url))
    response.cookies.delete('session_token')
    return response
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|public).*)',
  ],
}
