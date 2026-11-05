import type { Metadata } from "next"
import { notFound } from "next/navigation"
import prisma from "@/lib/prisma"
import { ContentPage, type PortfolioItem } from "@/components/public/public-portfolio"

export const dynamic = "force-dynamic"

const sections = ["education", "certification", "experience", "organization", "contact"] as const
type Section = typeof sections[number]

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; section: string }>
}): Promise<Metadata> {
  const { locale, section } = await params
  const validSection = sections.includes(section as Section)
  const title = validSection
    ? section[0].toUpperCase() + section.slice(1)
    : "Portfolio"
  const settings = await prisma.websiteSettings.findFirst({
    include: { og_image_asset: true },
  }).catch(() => null)
  const image = settings?.og_image_url || settings?.og_image_asset?.url
  return {
    title: settings?.seo_title || `${title} | ${settings?.website_title || "Kusumawati"}`,
    description: settings?.seo_description || settings?.website_description || undefined,
    alternates: {
      languages: {
        en: `/en/${section}`,
        id: `/id/${section}`,
      },
    },
    openGraph: {
      ...(locale === "id" ? { locale: "id_ID" } : { locale: "en_US" }),
      ...(image ? { images: [{ url: image }] } : {}),
    },
  }
}

export default async function LocalizedSection({
  params,
}: {
  params: Promise<{ locale: string; section: string }>
}) {
  const { locale: value, section: sectionValue } = await params
  if ((value !== "en" && value !== "id") || !sections.includes(sectionValue as Section)) notFound()
  const locale = value
  const section = sectionValue as Section

  if (section === "education") {
    const educations = await prisma.education.findMany({
      where: { status: "published" },
      orderBy: { sort_order: "asc" },
      include: {
        media: { include: { asset: true }, orderBy: { sort_order: "asc" } },
        academic_projects: {
          where: { status: "published" },
          orderBy: { sort_order: "asc" },
          include: { media: { include: { asset: true }, orderBy: { sort_order: "asc" } } },
        },
      },
    }).catch(() => [])
    const projects = educations.flatMap((education) => education.academic_projects)
    return <ContentPage locale={locale} section={section} items={educations as unknown as PortfolioItem[]} projects={projects as unknown as PortfolioItem[]} />
  }

  if (section === "certification") {
    const certifications = await prisma.certification.findMany({
      where: { status: "published" },
      orderBy: [{ category: "asc" }, { sort_order: "asc" }],
      include: { document_asset: true },
    }).catch(() => [])
    return (
      <ContentPage
        locale={locale}
        section={section}
        items={certifications.map((item) => ({
          ...item,
          document_url: item.document_url || item.document_asset?.url || null,
        })) as PortfolioItem[]}
      />
    )
  }

  if (section === "experience") {
    const experiences = await prisma.experience.findMany({
      where: { status: "published" },
      orderBy: { sort_order: "asc" },
      include: {
        gallery: { include: { asset: true }, orderBy: { sort_order: "asc" } },
        documents: { include: { asset: true }, orderBy: { sort_order: "asc" } },
      },
    }).catch(() => [])
    return <ContentPage locale={locale} section={section} items={experiences as unknown as PortfolioItem[]} />
  }

  if (section === "organization") {
    const organizations = await prisma.organization.findMany({
      where: { status: "published" },
      orderBy: { sort_order: "asc" },
      include: { media: { include: { asset: true }, orderBy: { sort_order: "asc" } } },
    }).catch(() => [])
    return <ContentPage locale={locale} section={section} items={organizations as unknown as PortfolioItem[]} />
  }

  const [contactInfo, profile] = await Promise.all([
    prisma.contactInfo.findFirst().catch(() => null),
    prisma.profile.findFirst().catch(() => null),
  ])
  const contact: PortfolioItem = {
    id: "contact",
    email: contactInfo?.email || profile?.email || "khusumawati232@gmail.com",
    whatsapp: contactInfo?.whatsapp || profile?.whatsapp || "+6285770734703",
    linkedin: contactInfo?.linkedin || profile?.linkedin_url || "https://www.linkedin.com/in/kusumawati",
    location: contactInfo?.location || profile?.location || "Bandar Lampung, Lampung, Indonesia",
  }
  return <ContentPage locale={locale} section={section} items={[]} profile={contact} />
}
