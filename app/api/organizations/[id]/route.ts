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
    const org = await prisma.organization.findUnique({
      where: { id },
      include: { media: { include: { asset: true } } },
    })
    if (!org) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    return NextResponse.json(org)
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
      'name', 'role_en', 'role_id', 'period_start', 'period_end', 'location',
      'description_en', 'description_id', 'contribution_en', 'contribution_id',
      'logo_url', 'status', 'is_featured', 'sort_order',
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
    const hasMediaUpdate = Object.hasOwn(body, 'media_asset_ids')
    const mediaIds = body.media_asset_ids as string[] | undefined
    if (hasMediaUpdate && (!Array.isArray(mediaIds) || !mediaIds.every((assetId: unknown) => typeof assetId === 'string'))) {
      return NextResponse.json({ error: 'media_asset_ids must be an array of asset IDs' }, { status: 400 })
    }
    const uniqueIds = hasMediaUpdate ? [...new Set(mediaIds ?? [])] : []
    const assets = hasMediaUpdate
      ? await prisma.mediaAsset.findMany({ where: { id: { in: uniqueIds } } })
      : []
    if (assets.length !== uniqueIds.length) {
      return NextResponse.json({ error: 'One or more media assets do not exist' }, { status: 400 })
    }
    const org = await prisma.$transaction(async (transaction) => {
      if (hasMediaUpdate) {
        await transaction.organizationMedia.deleteMany({ where: { organization_id: id } })
        if (assets.length) {
          await transaction.organizationMedia.createMany({
            data: assets.map((asset, index) => ({
              organization_id: id,
              asset_id: asset.id,
              url: asset.url,
              alt_text: asset.alt_text,
              sort_order: index,
            })),
          })
        }
      }
      return transaction.organization.update({
        where: { id },
        data,
        include: { media: { include: { asset: true }, orderBy: { sort_order: 'asc' } } },
      })
    })
    return NextResponse.json(org)
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
    await prisma.organization.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Failed to delete' }, { status: 500 })
  }
}
