import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { requireAdmin } from '@/lib/auth'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const adminMode = searchParams.get('admin') === 'true'

  try {
    if (adminMode) {
      const { authenticated, response } = await requireAdmin()
      if (!authenticated) return response!
    }
    const where = adminMode ? {} : { status: 'published' }

    const educations = await prisma.education.findMany({
      where,
      orderBy: { sort_order: 'asc' },
      include: {
        media: { include: { asset: true }, orderBy: { sort_order: 'asc' } },
        academic_projects: {
          where: adminMode ? {} : { status: 'published' },
          orderBy: { sort_order: 'asc' },
          include: { media: true },
        },
      },
    })
    return NextResponse.json(educations)
  } catch (error) {
    console.error('[EDUCATION GET]', error)
    return NextResponse.json({ error: 'Failed to fetch education' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  const { authenticated, response } = await requireAdmin()
  if (!authenticated) return response!

  try {
    const body = await request.json()
    if (!body || typeof body !== 'object' || Array.isArray(body)) {
      return NextResponse.json({ error: 'Request body must be an object' }, { status: 400 })
    }
    const {
      institution, degree, field_of_study, gpa, location,
      period_start, period_end, academic_focus, academic_focus_en, academic_focus_id,
      description_en, description_id, logo_url, media_asset_ids = [],
      status = 'draft', sort_order = 0,
    } = body

    if (!institution || !degree || !period_start) {
      return NextResponse.json({ error: 'institution, degree, period_start are required' }, { status: 400 })
    }
    if (status !== 'draft' && status !== 'published') {
      return NextResponse.json({ error: 'status must be draft or published' }, { status: 400 })
    }
    if (!Number.isInteger(sort_order)) {
      return NextResponse.json({ error: 'sort_order must be an integer' }, { status: 400 })
    }
    if (!Array.isArray(media_asset_ids) || !media_asset_ids.every((id: unknown) => typeof id === 'string')) {
      return NextResponse.json({ error: 'media_asset_ids must be an array of strings' }, { status: 400 })
    }

    const assetIds = [...new Set(media_asset_ids)]
    const assets = await prisma.mediaAsset.findMany({ where: { id: { in: assetIds } } })
    if (assets.length !== assetIds.length) {
      return NextResponse.json({ error: 'One or more media assets do not exist' }, { status: 400 })
    }
    const assetMap = new Map(assets.map((asset) => [asset.id, asset]))

    const education = await prisma.education.create({
      data: {
        institution, degree, field_of_study, gpa, location,
        period_start, period_end, academic_focus, academic_focus_en, academic_focus_id,
        description_en, description_id, logo_url,
        status, sort_order,
        media: {
          create: assetIds.map((id, index) => {
            const asset = assetMap.get(id)!
            return { asset_id: id, url: asset.url, alt_text: asset.alt_text, sort_order: index }
          }),
        },
      },
      include: { media: { include: { asset: true } }, academic_projects: true },
    })
    return NextResponse.json(education, { status: 201 })
  } catch (error) {
    console.error('[EDUCATION POST]', error)
    return NextResponse.json({ error: 'Failed to create education' }, { status: 500 })
  }
}
