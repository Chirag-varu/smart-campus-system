import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl
  const token = req.cookies.get('session')?.value

  // Protected routes check - redirect to login if no token
  const isProtected = pathname.startsWith('/student') || pathname.startsWith('/admin')
  if (isProtected && !token) {
    const url = req.nextUrl.clone()
    url.pathname = '/'
    return NextResponse.redirect(url)
  }

  // Auth routes check - redirect to dashboard if already logged in
  const isAuthRoute = pathname === '/' || pathname === '/register' || pathname === '/login' || pathname.startsWith('/verify-otp')
  if (isAuthRoute && token) {
    // Get user type from a cookie if available, default to student
    const userType = req.cookies.get('userType')?.value || 'student'
    
    const url = req.nextUrl.clone()
    url.pathname = userType === 'admin' ? '/admin/dashboard' : '/student/dashboard'
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/', '/login', '/register', '/verify-otp', '/student/:path*', '/admin/:path*']
}


