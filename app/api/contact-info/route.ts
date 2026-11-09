import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { requireAdmin } from '@/lib/auth'

export async function GET() {
  try {
    const info = await prisma.contactInfo.findFirst()
    return NextResponse.json(info || null)
  } catch {
    return NextResponse.json({ error: 'Failed to fetch contact info' }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  const { authenticated, response } = await requireAdmin()
  if (!authenticated) return response!

  try {
    const body = await request.json()
    const { name, email, whatsapp, linkedin, location } = body
    const existing = await prisma.contactInfo.findFirst()

    const data = { name: name || 'Kusumawati', email, whatsapp, linkedin, location }
    let info
    if (existing) {
      info = await prisma.contactInfo.update({ where: { id: existing.id }, data })
    } else {
      info = await prisma.contactInfo.create({ data })
    }
    return NextResponse.json(info)
  } catch {
    return NextResponse.json({ error: 'Failed to update contact info' }, { status: 500 })
  }
}

export const PATCH = PUT
