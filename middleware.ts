import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl
  const isProtected = pathname.startsWith('/student') || pathname.startsWith('/admin')
  if (!isProtected) return NextResponse.next()

  const token = req.cookies.get('session')?.value
  if (!token) {
    const url = req.nextUrl.clone()
    url.pathname = '/'
    return NextResponse.redirect(url)
  }
  return NextResponse.next()
}

export const config = {
  matcher: ['/student/:path*', '/admin/:path*']
}


