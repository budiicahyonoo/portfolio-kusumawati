import { NextResponse } from 'next/server'
import { del } from '@vercel/blob'
import prisma from '@/lib/prisma'
import { requireAdmin } from '@/lib/auth'

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { authenticated, response } = await requireAdmin()
  if (!authenticated) return response!

  const { id } = await params
  try {
    const asset = await prisma.mediaAsset.findUnique({
      where: { id },
      include: {
        project_media: true,
        education_media: true,
        experience_galleries: true,
        experience_documents: true,
        organization_media: true,
        profile_photo: true,
        profile_cv: true,
        certification_documents: true,
        website_og_images: true,
      },
    })

    if (!asset) {
      return NextResponse.json({ error: 'Asset not found' }, { status: 404 })
    }

    // Check references
    const refCount =
      asset.project_media.length +
      asset.education_media.length +
      asset.experience_galleries.length +
      asset.experience_documents.length +
      asset.organization_media.length +
      asset.profile_photo.length +
      asset.profile_cv.length +
      asset.certification_documents.length +
      asset.website_og_images.length

    if (refCount > 0) {
      return NextResponse.json(
        { error: `Asset is still used by ${refCount} content item(s). Remove references first.`, refCount },
        { status: 409 }
      )
    }

    await del(asset.url)
    await prisma.mediaAsset.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[MEDIA DELETE]', error)
    return NextResponse.json({ error: 'Failed to delete asset' }, { status: 500 })
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
    const { alt_text, description, filename } = body
    const asset = await prisma.mediaAsset.update({
      where: { id },
      data: { alt_text, description, filename },
    })
    return NextResponse.json(asset)
  } catch {
    return NextResponse.json({ error: 'Failed to update asset' }, { status: 500 })
  }
}
