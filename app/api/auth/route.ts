import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const { password } = await request.json()
  
  // Cocokkan dengan password di .env.local
  if (password === process.env.ADMIN_PASSWORD) {
    const response = NextResponse.json({ success: true })
    
    // Beri "tanda pengenal" (cookie) yang berlaku selama 1 hari
    response.cookies.set('admin_session', 'true', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: 60 * 60 * 24 
    })
    
    return response
  }
  
  return NextResponse.json({ error: 'Password salah!' }, { status: 401 })
}