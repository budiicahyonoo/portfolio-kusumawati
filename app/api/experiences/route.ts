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

    const experiences = await prisma.experience.findMany({
      where,
      orderBy: { sort_order: 'asc' },
      include: {
        gallery: {
          orderBy: { sort_order: 'asc' },
          include: { asset: true },
        },
        documents: {
          orderBy: { sort_order: 'asc' },
          include: { asset: true },
        },
      },
    })
    return NextResponse.json(experiences)
  } catch (error) {
    console.error('[EXPERIENCE GET]', error)
    return NextResponse.json({ error: 'Failed to fetch experiences' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  const { authenticated, response } = await requireAdmin()
  if (!authenticated) return response!

  try {
    const body = await request.json()
    const {
      category, organization, position_en, position_id,
      period_start, period_end, location,
      summary_en, summary_id,
      responsibilities_en, responsibilities_id,
      technical_skills = [], logo_url,
      gallery_asset_ids = [], document_asset_ids = [],
      status = 'draft', is_featured = false, sort_order = 0,
    } = body

    if (!category || !organization || !position_en || !period_start) {
      return NextResponse.json({ error: 'category, organization, position_en, period_start are required' }, { status: 400 })
    }
    if (!['Work', 'Internship', 'Speaker'].includes(category)) {
      return NextResponse.json({ error: 'category must be Work, Internship, or Speaker' }, { status: 400 })
    }
    if (status !== 'draft' && status !== 'published') {
      return NextResponse.json({ error: 'status must be draft or published' }, { status: 400 })
    }
    if (
      !Array.isArray(technical_skills) ||
      !technical_skills.every((value: unknown) => typeof value === 'string') ||
      !Array.isArray(gallery_asset_ids) ||
      !gallery_asset_ids.every((id: unknown) => typeof id === 'string') ||
      !Array.isArray(document_asset_ids) ||
      !document_asset_ids.every((id: unknown) => typeof id === 'string')
    ) {
      return NextResponse.json({ error: 'Skills and media references must be arrays of strings' }, { status: 400 })
    }

    const assetIds = [...new Set([...gallery_asset_ids, ...document_asset_ids])]
    const assets = await prisma.mediaAsset.findMany({ where: { id: { in: assetIds } } })
    if (assets.length !== assetIds.length) {
      return NextResponse.json({ error: 'One or more media assets do not exist' }, { status: 400 })
    }
    const assetMap = new Map(assets.map((asset) => [asset.id, asset]))

    const experience = await prisma.experience.create({
      data: {
        category, organization, position_en, position_id,
        period_start, period_end, location,
        summary_en, summary_id,
        responsibilities_en, responsibilities_id,
        technical_skills, logo_url,
        status, is_featured, sort_order,
        gallery: {
          create: gallery_asset_ids.map((id: string, index: number) => {
            const asset = assetMap.get(id)!
            return { asset_id: id, url: asset.url, alt_text: asset.alt_text, sort_order: index }
          }),
        },
        documents: {
          create: document_asset_ids.map((id: string, index: number) => {
            const asset = assetMap.get(id)!
            return {
              asset_id: id,
              url: asset.url,
              label_en: asset.original_filename || asset.filename,
              file_type: asset.mime_type,
              sort_order: index,
            }
          }),
        },
      },
    })
    return NextResponse.json(experience, { status: 201 })
  } catch (error) {
    console.error('[EXPERIENCE POST]', error)
    return NextResponse.json({ error: 'Failed to create experience' }, { status: 500 })
  }
}
