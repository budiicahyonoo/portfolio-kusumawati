import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { requireAdmin } from '@/lib/auth'

export async function GET() {
  try {
    const settings = await prisma.websiteSettings.findFirst()
    return NextResponse.json(settings || null)
  } catch (error) {
    console.error('[SETTINGS GET]', error)
    return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  const { authenticated, response } = await requireAdmin()
  if (!authenticated) return response!

  try {
    const body = await request.json()
    const existing = await prisma.websiteSettings.findFirst()
    const fields = [
      'website_title',
      'website_description',
      'default_language',
      'hero_cta_primary',
      'hero_cta_secondary',
      'seo_title',
      'seo_description',
      'og_image_url',
      'og_image_asset_id',
      'footer_text',
    ] as const
    const data = Object.fromEntries(
      fields.filter((field) => Object.hasOwn(body, field)).map((field) => [field, body[field]]),
    )
    if (data.default_language && !['en', 'id'].includes(data.default_language)) {
      return NextResponse.json({ error: 'default_language must be en or id' }, { status: 400 })
    }

    let settings
    if (existing) {
      settings = await prisma.websiteSettings.update({ where: { id: existing.id }, data })
    } else {
      settings = await prisma.websiteSettings.create({ data })
    }
    return NextResponse.json(settings)
  } catch (error) {
    console.error('[SETTINGS PUT]', error)
    return NextResponse.json({ error: 'Failed to update settings' }, { status: 500 })
  }
}
