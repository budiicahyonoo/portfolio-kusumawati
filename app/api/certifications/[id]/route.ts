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
    const cert = await prisma.certification.findUnique({ where: { id } })
    if (!cert) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    return NextResponse.json(cert)
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
    if (!body || typeof body !== 'object' || Array.isArray(body)) {
      return NextResponse.json({ error: 'Request body must be an object' }, { status: 400 })
    }
    const fields = [
      'category', 'title_en', 'title_id', 'issuer', 'year',
      'description_en', 'description_id', 'verification_url',
      'document_url', 'document_label', 'document_asset_id', 'status',
      'is_featured', 'sort_order',
    ] as const
    const data = Object.fromEntries(
      fields.filter((field) => Object.hasOwn(body, field)).map((field) => [field, body[field]]),
    )
    if (data.status !== undefined && data.status !== 'draft' && data.status !== 'published') {
      return NextResponse.json({ error: 'status must be draft or published' }, { status: 400 })
    }
    if (data.is_featured !== undefined && typeof data.is_featured !== 'boolean') {
      return NextResponse.json({ error: 'is_featured must be a boolean' }, { status: 400 })
    }
    if (data.sort_order !== undefined && !Number.isInteger(data.sort_order)) {
      return NextResponse.json({ error: 'sort_order must be an integer' }, { status: 400 })
    }
    const cert = await prisma.certification.update({ where: { id }, data })
    return NextResponse.json(cert)
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
    await prisma.certification.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Failed to delete' }, { status: 500 })
  }
}
