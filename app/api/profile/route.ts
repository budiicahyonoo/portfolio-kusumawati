import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { requireAdmin } from '@/lib/auth'

export async function GET() {
  try {
    const profile = await prisma.profile.findFirst()
    return NextResponse.json(profile || null)
  } catch (error) {
    console.error('[PROFILE GET]', error)
    return NextResponse.json({ error: 'Failed to fetch profile' }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  const { authenticated, response } = await requireAdmin()
  if (!authenticated) return response!

  try {
    const body = await request.json()
    const {
      full_name, professional_title,
      summary_en, summary_id,
      photo_url, cv_url,
      email, phone, whatsapp,
      linkedin_url, location, social_links,
      photo_asset_id, cv_asset_id,
    } = body

    const existing = await prisma.profile.findFirst()

    const data = {
      full_name: full_name ?? existing?.full_name ?? 'Kusumawati',
      professional_title: professional_title ?? existing?.professional_title ?? 'Chemical Engineering Graduate',
      summary_en: summary_en ?? existing?.summary_en ?? '',
      summary_id: summary_id ?? existing?.summary_id ?? '',
      photo_url: photo_url === '' ? null : photo_url ?? existing?.photo_url ?? null,
      cv_url: cv_url === '' ? null : cv_url ?? existing?.cv_url ?? null,
      email: email ?? existing?.email ?? null,
      phone: phone ?? existing?.phone ?? null,
      whatsapp: whatsapp ?? existing?.whatsapp ?? null,
      linkedin_url: linkedin_url ?? existing?.linkedin_url ?? null,
      location: location ?? existing?.location ?? null,
      social_links: social_links ?? existing?.social_links ?? undefined,
      photo_asset_id: Object.hasOwn(body, 'photo_asset_id')
        ? photo_asset_id || null
        : existing?.photo_asset_id ?? null,
      cv_asset_id: Object.hasOwn(body, 'cv_asset_id')
        ? cv_asset_id || null
        : existing?.cv_asset_id ?? null,
    }

    let profile
    if (existing) {
      profile = await prisma.profile.update({ where: { id: existing.id }, data })
    } else {
      profile = await prisma.profile.create({ data })
    }

    return NextResponse.json(profile)
  } catch (error) {
    console.error('[PROFILE PUT]', error)
    return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 })
  }
}
