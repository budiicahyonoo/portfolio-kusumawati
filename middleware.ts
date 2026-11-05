import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { verifyAdminSession } from '@/lib/session'

export async function middleware(request: NextRequest) {
  const isAuthenticated = await verifyAdminSession(
    request.cookies.get('admin_session')?.value,
  )

  if (request.nextUrl.pathname.startsWith('/admin') && !isAuthenticated) {
    const login = new URL('/login', request.url)
    login.searchParams.set('next', request.nextUrl.pathname)
    return NextResponse.redirect(login)
  }

  if (request.nextUrl.pathname.startsWith('/login') && isAuthenticated) {
    return NextResponse.redirect(new URL('/admin', request.url))
  }

  const requestHeaders = new Headers(request.headers)
  requestHeaders.set('x-locale', request.nextUrl.pathname.startsWith('/id') ? 'id' : 'en')
  return NextResponse.next({ request: { headers: requestHeaders } })
}

export const config = {
  matcher: ['/admin/:path*', '/login', '/', '/en/:path*', '/id/:path*'],
}