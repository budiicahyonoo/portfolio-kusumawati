import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { requireAdmin } from '@/lib/auth'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { authenticated, response } = await requireAdmin()
  if (!authenticated) return response!

  const { id } = await params
  try {
    const msg = await prisma.contactMessage.findUnique({ where: { id } })
    if (!msg) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    // Auto-mark as read when opened
    if (msg.status === 'unread') {
      await prisma.contactMessage.update({ where: { id }, data: { status: 'read' } })
    }
    return NextResponse.json(msg)
  } catch {
    return NextResponse.json({ error: 'Failed to fetch' }, { status: 500 })
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { authenticated, response } = await requireAdmin()
  if (!authenticated) return response!

  const { id } = await params
  try {
    const body = await request.json()
    const { status } = body
    if (!['unread', 'read', 'archived'].includes(status)) {
      return NextResponse.json({ error: 'status must be unread, read, or archived' }, { status: 400 })
    }
    const msg = await prisma.contactMessage.update({ where: { id }, data: { status } })
    return NextResponse.json(msg)
  } catch {
    return NextResponse.json({ error: 'Failed to update' }, { status: 500 })
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { authenticated, response } = await requireAdmin()
  if (!authenticated) return response!

  const { id } = await params
  try {
    await prisma.contactMessage.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Failed to delete' }, { status: 500 })
  }
}
