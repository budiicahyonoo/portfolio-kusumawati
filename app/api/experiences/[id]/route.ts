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
    const experience = await prisma.experience.findUnique({
      where: { id },
      include: {
        gallery: { orderBy: { sort_order: 'asc' }, include: { asset: true } },
        documents: { orderBy: { sort_order: 'asc' }, include: { asset: true } },
      },
    })
    if (!experience) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    return NextResponse.json(experience)
  } catch (error) {
    console.error('[EXPERIENCE GET id]', error)
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
      'category', 'organization', 'position_en', 'position_id', 'period_start',
      'period_end', 'location', 'summary_en', 'summary_id', 'responsibilities_en',
      'responsibilities_id', 'technical_skills', 'logo_url', 'status',
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
    if (data.technical_skills !== undefined &&
      (!Array.isArray(data.technical_skills) || !data.technical_skills.every((value: unknown) => typeof value === 'string'))) {
      return NextResponse.json({ error: 'technical_skills must be an array of strings' }, { status: 400 })
    }
    if (data.category !== undefined && !['Work', 'Internship', 'Speaker'].includes(data.category)) {
      return NextResponse.json({ error: 'category must be Work, Internship, or Speaker' }, { status: 400 })
    }
    const hasGalleryUpdate = Object.hasOwn(body, 'gallery_asset_ids')
    const hasDocumentUpdate = Object.hasOwn(body, 'document_asset_ids')
    const galleryIds = body.gallery_asset_ids
    const documentIds = body.document_asset_ids
    if (
      (hasGalleryUpdate && (!Array.isArray(galleryIds) || !galleryIds.every((assetId: unknown) => typeof assetId === 'string'))) ||
      (hasDocumentUpdate && (!Array.isArray(documentIds) || !documentIds.every((assetId: unknown) => typeof assetId === 'string')))
    ) {
      return NextResponse.json({ error: 'Media references must be arrays of asset IDs' }, { status: 400 })
    }
    const allIds = [...new Set([...(hasGalleryUpdate ? galleryIds : []), ...(hasDocumentUpdate ? documentIds : [])])]
    const assets = allIds.length
      ? await prisma.mediaAsset.findMany({ where: { id: { in: allIds } } })
      : []
    if (assets.length !== allIds.length) {
      return NextResponse.json({ error: 'One or more media assets do not exist' }, { status: 400 })
    }
    const assetMap = new Map(assets.map((asset) => [asset.id, asset]))
    const experience = await prisma.$transaction(async (transaction) => {
      if (hasGalleryUpdate) {
        await transaction.experienceGallery.deleteMany({ where: { experience_id: id } })
        if (galleryIds.length) {
          await transaction.experienceGallery.createMany({
            data: galleryIds.map((assetId: string, index: number) => {
              const asset = assetMap.get(assetId)!
              return { experience_id: id, asset_id: assetId, url: asset.url, alt_text: asset.alt_text, sort_order: index }
            }),
          })
        }
      }
      if (hasDocumentUpdate) {
        await transaction.experienceDocument.deleteMany({ where: { experience_id: id } })
        if (documentIds.length) {
          await transaction.experienceDocument.createMany({
            data: documentIds.map((assetId: string, index: number) => {
              const asset = assetMap.get(assetId)!
              return {
                experience_id: id,
                asset_id: assetId,
                url: asset.url,
                label_en: asset.original_filename || asset.filename,
                file_type: asset.mime_type,
                sort_order: index,
              }
            }),
          })
        }
      }
      return transaction.experience.update({
        where: { id },
        data,
        include: {
          gallery: { include: { asset: true } },
          documents: { include: { asset: true } },
        },
      })
    })
    return NextResponse.json(experience)
  } catch (error) {
    console.error('[EXPERIENCE PUT]', error)
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
    await prisma.experience.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[EXPERIENCE DELETE]', error)
    return NextResponse.json({ error: 'Failed to delete' }, { status: 500 })
  }
}
