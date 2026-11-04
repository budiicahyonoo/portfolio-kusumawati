import prisma from "@/lib/prisma"
import { Navbar } from "@/components/navbar"
import { HeroSection } from "@/components/hero-section"
import { SkillsSection } from "@/components/skills-section"
import { ProjectsSection } from "@/components/projects-section"
import { ExperienceSection } from "@/components/experience-section"
import { BlogSection } from "@/components/blog-section"
import { ContactSection } from "@/components/contact-section"
import { AmbientBackground } from "@/components/ambient-background"

export const dynamic = "force-dynamic"
export const revalidate = 0

// Tahun website
const CURRENT_YEAR = 2026

// Data fallback untuk Kontak jika DB belum diisi
const defaultContacts = [
  {
    id: "1",
    platform: "Email",
    url: "mailto:budicahyono.dev@gmail.com",
  },
  {
    id: "2",
    platform: "LinkedIn",
    url: "https://linkedin.com/in/budicahyono",
  },
  {
    id: "3",
    platform: "GitHub",
    url: "https://github.com/budiicahyonoo",
  },
  {
    id: "4",
    platform: "Calendly",
    url: "https://calendly.com/budicahyono-dev/new-meeting",
  },
]

// Data fallback Home jika DB belum diisi
const defaultHome = {
  name: "Budi Cahyono",
  role: "Software Engineer",
  value_proposition:
    "Membangun sistem web & AI yang scalable untuk bisnis dan kampus.",
  photo_url: "/portfoliostackplus.png",
  email: "budicahyono.dev@gmail.com",
}

export default async function Home() {
  const [
    homeData,
    skillsData,
    projectsData,
    experienceData,
    blogData,
    contactsData,
  ] = await Promise.all([
    prisma.home.findFirst().catch(() => null),
    prisma.skill
      .findMany({
        orderBy: { sort_order: "asc" },
      })
      .catch(() => []),
    prisma.project
      .findMany({
        orderBy: { sort_order: "asc" },
      })
      .catch(() => []),
    prisma.experience
      .findMany({
        orderBy: { sort_order: "asc" },
      })
      .catch(() => []),
    prisma.blog
      .findMany({
        orderBy: { sort_order: "asc" },
      })
      .catch(() => []),
    prisma.contact
      .findMany({
        orderBy: { sort_order: "asc" },
      })
      .catch(() => []),
  ])

  const home = homeData || defaultHome
  const contacts =
    contactsData.length > 0 ? contactsData : defaultContacts

  return (
    <div className="min-h-screen flex flex-col justify-between relative bg-white text-slate-900">
      <AmbientBackground />

      <Navbar />

      <main className="flex-grow">
        <HeroSection data={home as any} />

        <SkillsSection skills={skillsData as any} />

        <ProjectsSection projects={projectsData as any} />

        <ExperienceSection experiences={experienceData as any} />

        <BlogSection posts={blogData as any} />

        <ContactSection contacts={contacts as any} />
      </main>

      <footer className="footer-glass py-8 border-t border-slate-200/80 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p>
            © {CURRENT_YEAR} Budi Cahyono. All rights reserved.
          </p>

          <p className="text-slate-400">
            Built with{" "}
            <span className="font-semibold text-slate-700">
              Next.js 15
            </span>
            ,{" "}
            <span className="font-semibold text-slate-700">
              Tailwind v4
            </span>{" "}
            &{" "}
            <span className="font-semibold text-slate-700">
              Prisma
            </span>
            .
          </p>
        </div>
      </footer>
    </div>
  )
}