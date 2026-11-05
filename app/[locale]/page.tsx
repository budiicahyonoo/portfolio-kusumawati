import type { Metadata } from "next"
import { notFound } from "next/navigation"
import prisma from "@/lib/prisma"
import { HomePage, type PortfolioItem } from "@/components/public/public-portfolio"

export const dynamic = "force-dynamic"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const settings = await prisma.websiteSettings.findFirst({
    include: { og_image_asset: true },
  }).catch(() => null)
  const image = settings?.og_image_url || settings?.og_image_asset?.url || "/kusumawati.png"
  return {
    title: settings?.seo_title || settings?.website_title || "Kusumawati | Chemical Engineering Graduate",
    description: settings?.seo_description || settings?.website_description || "Chemical Engineering portfolio of Kusumawati.",
    alternates: { languages: { en: "/en", id: "/id" } },
    openGraph: {
      locale: locale === "id" ? "id_ID" : "en_US",
      images: [{ url: image, alt: "Kusumawati professional portrait" }],
    },
  }
}

const defaultProfile: PortfolioItem = {
  id: "profile",
  full_name: "Kusumawati",
  professional_title: "Chemical Engineering Graduate",
  summary_en: "Explore Kusumawati’s published education, certifications, projects, and experience.",
  summary_id: "Jelajahi pendidikan, sertifikasi, proyek, dan pengalaman Kusumawati yang telah dipublikasikan.",
  photo_url: "/kusumawati.png",
  cv_url: "/CV Kusumawati.pdf",
  email: "khusumawati232@gmail.com",
  whatsapp: "+6285770734703",
  linkedin_url: "https://www.linkedin.com/in/kusumawati",
  location: "Bandar Lampung, Lampung, Indonesia",
}

export default async function LocalizedHome({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale: value } = await params
  if (value !== "en" && value !== "id") notFound()
  const locale = value
  const [profile, experiences, publications] = await Promise.all([
    prisma.profile.findFirst({ include: { photo_asset: true, cv_asset: true } }).catch(() => null),
    prisma.experience.findMany({
      where: { status: "published", is_featured: true },
      orderBy: { sort_order: "asc" },
      take: 3,
      include: { gallery: { include: { asset: true }, orderBy: { sort_order: "asc" } } },
    }).catch(() => []),
    prisma.certification.findMany({
      where: { status: "published", is_featured: true, category: { in: ["Journal", "Patent"] } },
      orderBy: { sort_order: "asc" },
      take: 3,
      include: { document_asset: true },
    }).catch(() => []),
  ])
  const resolvedProfile = profile
    ? {
        ...defaultProfile,
        ...profile,
        photo_url: profile.photo_url || profile.photo_asset?.url || defaultProfile.photo_url,
        cv_url: profile.cv_url || profile.cv_asset?.url || defaultProfile.cv_url,
      }
    : defaultProfile
  const competencies = [
    ...new Set(
      experiences.flatMap((experience) =>
        Array.isArray(experience.technical_skills)
          ? experience.technical_skills.filter((skill): skill is string => typeof skill === "string")
          : [],
      ),
    ),
  ]

  return (
    <HomePage
      locale={locale}
      profile={resolvedProfile}
      experiences={experiences as unknown as PortfolioItem[]}
      competencies={competencies}
      publications={publications.map((item) => ({
        ...item,
        document_url: item.document_url || item.document_asset?.url || null,
      })) as PortfolioItem[]}
    />
  )
}
