import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { requireAdmin } from '@/lib/auth'

export async function GET() {
  const { authenticated, response } = await requireAdmin()
  if (!authenticated) return response!

  try {
    const [
      educationCount,
      academicProjectCount,
      experienceCount,
      certificationCount,
      journalCount,
      patentCount,
      organizationCount,
      mediaCount,
      unreadMessages,
      totalMessages,
      draftContent,
      publishedContent,
      recentMessages,
    ] = await Promise.all([
      prisma.education.count(),
      prisma.academicProject.count(),
      prisma.experience.count(),
      prisma.certification.count({ where: { category: { in: ['Certification', 'Training'] } } }),
      prisma.certification.count({ where: { category: 'Journal' } }),
      prisma.certification.count({ where: { category: 'Patent' } }),
      prisma.organization.count(),
      prisma.mediaAsset.count(),
      prisma.contactMessage.count({ where: { status: 'unread' } }),
      prisma.contactMessage.count(),
      Promise.all([
        prisma.education.count({ where: { status: 'draft' } }),
        prisma.academicProject.count({ where: { status: 'draft' } }),
        prisma.experience.count({ where: { status: 'draft' } }),
        prisma.certification.count({ where: { status: 'draft' } }),
        prisma.organization.count({ where: { status: 'draft' } }),
      ]).then((counts) => counts.reduce((a, b) => a + b, 0)),
      Promise.all([
        prisma.education.count({ where: { status: 'published' } }),
        prisma.academicProject.count({ where: { status: 'published' } }),
        prisma.experience.count({ where: { status: 'published' } }),
        prisma.certification.count({ where: { status: 'published' } }),
        prisma.organization.count({ where: { status: 'published' } }),
      ]).then((counts) => counts.reduce((a, b) => a + b, 0)),
      prisma.contactMessage.findMany({
        orderBy: { created_at: 'desc' },
        take: 5,
      }),
    ])

    return NextResponse.json({
      stats: {
        education: educationCount,
        academicProjects: academicProjectCount,
        experience: experienceCount,
        certifications: certificationCount,
        journals: journalCount,
        patents: patentCount,
        organizations: organizationCount,
        mediaAssets: mediaCount,
        unreadMessages,
        totalMessages,
        draftContent,
        publishedContent,
      },
      recentMessages,
    })
  } catch (error) {
    console.error('[DASHBOARD GET]', error)
    return NextResponse.json({ error: 'Failed to fetch dashboard data' }, { status: 500 })
  }
}
