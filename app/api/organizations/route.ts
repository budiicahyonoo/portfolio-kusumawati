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

    const organizations = await prisma.organization.findMany({
      where,
      orderBy: { sort_order: 'asc' },
      include: { media: { include: { asset: true }, orderBy: { sort_order: 'asc' } } },
    })
    return NextResponse.json(organizations)
  } catch (error) {
    console.error('[ORGANIZATIONS GET]', error)
    return NextResponse.json({ error: 'Failed to fetch organizations' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  const { authenticated, response } = await requireAdmin()
  if (!authenticated) return response!

  try {
    const body = await request.json()
    const {
      name, role_en, role_id, period_start, period_end, location,
      description_en, description_id, contribution_en, contribution_id,
      logo_url, media_asset_ids = [], status = 'draft', is_featured = false, sort_order = 0,
    } = body

    if (!name || !role_en || !period_start) {
      return NextResponse.json({ error: 'name, role_en, period_start are required' }, { status: 400 })
    }
    if (!Array.isArray(media_asset_ids) || !media_asset_ids.every((id: unknown) => typeof id === 'string')) {
      return NextResponse.json({ error: 'media_asset_ids must be an array of asset IDs' }, { status: 400 })
    }
    const assetIds = [...new Set(media_asset_ids)]
    const assets = await prisma.mediaAsset.findMany({ where: { id: { in: assetIds } } })
    if (assets.length !== assetIds.length) {
      return NextResponse.json({ error: 'One or more media assets do not exist' }, { status: 400 })
    }

    const org = await prisma.organization.create({
      data: {
        name, role_en, role_id, period_start, period_end, location,
        description_en, description_id, contribution_en, contribution_id,
        logo_url, status, is_featured, sort_order,
        media: {
          create: assets.map((asset, index) => ({
            asset_id: asset.id,
            url: asset.url,
            alt_text: asset.alt_text,
            sort_order: index,
          })),
        },
      },
    })
    return NextResponse.json(org, { status: 201 })
  } catch (error) {
    console.error('[ORGANIZATIONS POST]', error)
    return NextResponse.json({ error: 'Failed to create organization' }, { status: 500 })
  }
}
