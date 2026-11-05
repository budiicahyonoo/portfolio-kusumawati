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

    const projects = await prisma.academicProject.findMany({
      where,
      orderBy: { sort_order: 'asc' },
      include: {
        education: { select: { institution: true, degree: true } },
        media: { include: { asset: true }, orderBy: { sort_order: 'asc' } },
      },
    })
    return NextResponse.json(projects)
  } catch (error) {
    console.error('[ACADEMIC PROJECTS GET]', error)
    return NextResponse.json({ error: 'Failed to fetch projects' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  const { authenticated, response } = await requireAdmin()
  if (!authenticated) return response!

  try {
    const body = await request.json()
    const {
      education_id, title_en, title_id,
      summary_en, summary_id, description_en, description_id,
      research_area, cover_image_url, media_asset_ids = [],
      status = 'draft', is_featured = false, sort_order = 0,
    } = body

    if (!title_en) {
      return NextResponse.json({ error: 'title_en is required' }, { status: 400 })
    }
    if (!Array.isArray(media_asset_ids) || !media_asset_ids.every((id: unknown) => typeof id === 'string')) {
      return NextResponse.json({ error: 'media_asset_ids must be an array of asset IDs' }, { status: 400 })
    }
    const assets = await prisma.mediaAsset.findMany({ where: { id: { in: [...new Set(media_asset_ids)] } } })
    if (assets.length !== new Set(media_asset_ids).size) {
      return NextResponse.json({ error: 'One or more media assets do not exist' }, { status: 400 })
    }

    const project = await prisma.academicProject.create({
      data: {
        education_id, title_en, title_id,
        summary_en, summary_id, description_en, description_id,
        research_area, cover_image_url,
        status, is_featured, sort_order,
        media: {
          create: assets.map((asset) => ({
            asset_id: asset.id,
            url: asset.url,
            alt_text: asset.alt_text,
          })),
        },
      },
    })
    return NextResponse.json(project, { status: 201 })
  } catch (error) {
    console.error('[ACADEMIC PROJECTS POST]', error)
    return NextResponse.json({ error: 'Failed to create project' }, { status: 500 })
  }
}
