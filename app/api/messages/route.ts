import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { requireAdmin } from '@/lib/auth'
import { allowRateLimitedRequest } from '@/lib/rate-limit'
import { z } from 'zod'

const messageSchema = z.object({
  name: z.string().trim().min(1).max(100),
  email: z.string().trim().email().max(254),
  subject: z.string().trim().min(1).max(200),
  message: z.string().trim().min(1).max(2000),
  website: z.string().optional(),
})

// Contact form submissions (public) + admin management
export async function GET(request: Request) {
  const { authenticated, response } = await requireAdmin()
  if (!authenticated) return response!

  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    if (status && !['unread', 'read', 'archived'].includes(status)) {
      return NextResponse.json({ error: 'status must be unread, read, or archived' }, { status: 400 })
    }
    const where = status ? { status } : {}
    const messages = await prisma.contactMessage.findMany({
      where,
      orderBy: { created_at: 'desc' },
    })
    return NextResponse.json(messages)
  } catch (error) {
    console.error('[MESSAGES GET]', error)
    return NextResponse.json({ error: 'Failed to fetch messages' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body: unknown = await request.json()
    const parsed = messageSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: 'Please check the message fields and try again.' }, { status: 400 })
    }

    const { name, email, subject, message, website } = parsed.data
    if (website) return NextResponse.json({ success: true }, { status: 201 })

    const forwarded = request.headers.get('x-real-ip') ||
      request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
      'unknown'
    const normalizedEmail = email.toLowerCase()
    if (
      !allowRateLimitedRequest(`contact-ip:${forwarded}`, 5, 60 * 60 * 1000) ||
      !allowRateLimitedRequest(`contact-email:${normalizedEmail}`, 3, 60 * 60 * 1000)
    ) {
      return NextResponse.json({ error: 'Too many messages. Please try again later.' }, { status: 429 })
    }

    const msg = await prisma.contactMessage.create({
      data: { name, email: normalizedEmail, subject, message },
    })
    return NextResponse.json({ success: true, id: msg.id }, { status: 201 })
  } catch (error) {
    console.error('[MESSAGES POST]', error)
    return NextResponse.json({ error: 'Failed to submit message' }, { status: 500 })
  }
}
