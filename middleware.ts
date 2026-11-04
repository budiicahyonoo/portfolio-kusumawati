import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Cek apakah browser membawa "tanda pengenal" admin
  const isAuthenticated = request.cookies.get('admin_session')

  // Jika mencoba buka /admin tapi belum login -> lempar ke /login
  if (request.nextUrl.pathname.startsWith('/admin') && !isAuthenticated) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // Jika sudah login tapi iseng buka halaman /login -> lempar langsung ke /admin
  if (request.nextUrl.pathname.startsWith('/login') && isAuthenticated) {
    return NextResponse.redirect(new URL('/admin', request.url))
  }

  return NextResponse.next()
}

// Tentukan rute mana saja yang dijaga oleh middleware ini
export const config = {
  matcher: ['/admin/:path*', '/login'],
}