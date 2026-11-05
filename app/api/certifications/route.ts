import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { requireAdmin } from '@/lib/auth'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const adminMode = searchParams.get('admin') === 'true'
  const category = searchParams.get('category')

  try {
    if (adminMode) {
      const { authenticated, response } = await requireAdmin()
      if (!authenticated) return response!
    }
    const where: Record<string, unknown> = adminMode ? {} : { status: 'published' }
    if (category) where.category = category

    const certifications = await prisma.certification.findMany({
      where,
      orderBy: { sort_order: 'asc' },
    })
    return NextResponse.json(certifications)
  } catch (error) {
    console.error('[CERTIFICATIONS GET]', error)
    return NextResponse.json({ error: 'Failed to fetch certifications' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  const { authenticated, response } = await requireAdmin()
  if (!authenticated) return response!

  try {
    const body = await request.json()
    const {
      category, title_en, title_id, issuer, year,
      description_en, description_id,
      verification_url, document_url, document_label, document_asset_id,
      status = 'draft', is_featured = false, sort_order = 0,
    } = body

    if (!category || !title_en) {
      return NextResponse.json({ error: 'category and title_en are required' }, { status: 400 })
    }

    const cert = await prisma.certification.create({
      data: {
        category, title_en, title_id, issuer, year,
        description_en, description_id,
        verification_url, document_url, document_label, document_asset_id,
        status, is_featured, sort_order,
      },
    })
    return NextResponse.json(cert, { status: 201 })
  } catch (error) {
    console.error('[CERTIFICATIONS POST]', error)
    return NextResponse.json({ error: 'Failed to create certification' }, { status: 500 })
  }
}
