import type { ReactNode } from "react"
import Link from "next/link"
import { Download, Mail, MapPin, Phone, ArrowUpRight } from "lucide-react"
import { ContactForm } from "@/components/public/contact-form"
import { PortfolioGrid } from "@/components/public/portfolio-grid"

export type PortfolioItem = {
  id: string
  full_name?: string | null
  professional_title?: string | null
  category?: string | null
  title?: string | null
  title_en?: string | null
  title_id?: string | null
  name?: string | null
  organization?: string | null
  institution?: string | null
  degree?: string | null
  position_en?: string | null
  position_id?: string | null
  role_en?: string | null
  role_id?: string | null
  period_start?: string | null
  period_end?: string | null
  year?: string | null
  location?: string | null
  issuer?: string | null
  field_of_study?: string | null
  gpa?: string | null
  academic_focus?: string | null
  academic_focus_en?: string | null
  academic_focus_id?: string | null
  description_en?: string | null
  description_id?: string | null
  summary_en?: string | null
  summary_id?: string | null
  responsibilities_en?: string | null
  responsibilities_id?: string | null
  contribution_en?: string | null
  contribution_id?: string | null
  technical_skills?: string[]
  verification_url?: string | null
  document_url?: string | null
  document_label?: string | null
  cover_image_url?: string | null
  logo_url?: string | null
  photo_url?: string | null
  cv_url?: string | null
  email?: string | null
  phone?: string | null
  whatsapp?: string | null
  linkedin_url?: string | null
  linkedin?: string | null
  status?: string
  is_featured?: boolean
  media?: { id: string; url: string; alt_text?: string | null }[]
  gallery?: { id: string; url: string; alt_text?: string | null }[]
  documents?: { id: string; url: string; label_en?: string | null; label_id?: string | null }[]
}

type Locale = "en" | "id"
type PageSection = "education" | "certification" | "experience" | "organization" | "contact"

const navigation: { id: PageSection | "home"; label: Record<Locale, string> }[] = [
  { id: "home", label: { en: "Home", id: "Beranda" } },
  { id: "education", label: { en: "Education", id: "Pendidikan" } },
  { id: "certification", label: { en: "Certification", id: "Sertifikasi" } },
  { id: "experience", label: { en: "Experience", id: "Pengalaman" } },
  { id: "organization", label: { en: "Organization", id: "Organisasi" } },
  { id: "contact", label: { en: "Contact", id: "Kontak" } },
]

const labels = {
  en: {
    tagline: "Chemical Engineering Graduate",
    sentence: "Research, laboratory analysis, and process engineering.",
    explore: "Explore experience",
    contact: "Contact me",
    cv: "Download CV",
    featuredExperience: "Selected experience",
    featuredResearch: "Research and credentials",
    competencies: "Competencies",
    education: "Education",
    educationIntro: "Academic background and selected engineering projects.",
    certification: "Certification",
    certificationIntro: "Professional credentials, training, publications, and patents.",
    experience: "Experience",
    experienceIntro: "Work, internship, and speaker experience.",
    organization: "Organization",
    organizationIntro: "Roles and contributions in organizations.",
    contactTitle: "Contact",
    contactIntro: "Get in touch about research, engineering, or professional opportunities.",
    projects: "Academic projects",
    work: "Work",
    internship: "Internship",
    speaker: "Speaker",
    all: "All",
    contactMethods: "Contact details",
    footer: "Chemical Engineering portfolio",
    noContent: "No published items yet.",
    send: "Send a message",
  },
  id: {
    tagline: "Lulusan Teknik Kimia",
    sentence: "Riset, analisis laboratorium, dan rekayasa proses.",
    explore: "Jelajahi pengalaman",
    contact: "Hubungi saya",
    cv: "Unduh CV",
    featuredExperience: "Pengalaman pilihan",
    featuredResearch: "Riset dan kredensial",
    competencies: "Kompetensi",
    education: "Pendidikan",
    educationIntro: "Latar belakang akademik dan proyek rekayasa pilihan.",
    certification: "Sertifikasi",
    certificationIntro: "Kredensial profesional, pelatihan, publikasi, dan paten.",
    experience: "Pengalaman",
    experienceIntro: "Pengalaman kerja, magang, dan pembicara.",
    organization: "Organisasi",
    organizationIntro: "Peran dan kontribusi dalam organisasi.",
    contactTitle: "Kontak",
    contactIntro: "Hubungi untuk topik riset, rekayasa, atau peluang profesional.",
    projects: "Proyek akademik",
    work: "Kerja",
    internship: "Magang",
    speaker: "Pembicara",
    all: "Semua",
    contactMethods: "Informasi kontak",
    footer: "Portofolio Teknik Kimia",
    noContent: "Belum ada konten yang dipublikasikan.",
    send: "Kirim pesan",
  },
} satisfies Record<Locale, Record<string, string>>

export function PublicShell({
  locale,
  active = "home",
  children,
}: {
  locale: Locale
  active?: PageSection | "home"
  children: ReactNode
}) {
  const text = labels[locale]
  const visibleNav = navigation.map((item) => ({
    ...item,
    href: `/${locale}${item.id === "home" ? "" : `/${item.id}`}`,
  }))

  return (
    <div className="min-h-screen bg-white text-neutral-950">
      <header className="sticky top-0 z-40 border-b border-neutral-200 bg-white">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-5 lg:h-[72px] lg:px-10">
          <Link className="shrink-0 text-lg font-bold text-primary-950" href={`/${locale}`}>Kusumawati</Link>
          <nav className="hidden items-center gap-1 lg:flex" aria-label="Main navigation">
            {visibleNav.map((item) => (
              <Link key={item.id} href={item.href} aria-current={active === item.id ? "page" : undefined}
                className={`min-h-11 rounded-md px-3 py-2 text-sm font-medium hover:text-primary-700 ${active === item.id ? "bg-primary-50 text-primary-800" : "text-neutral-700"}`}>
                {item.label[locale]}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            <div className="flex overflow-hidden rounded-md border border-neutral-300 text-xs font-semibold">
              {(["en", "id"] as const).map((lang) => (
                <Link key={lang} href={visibleNav.find((item) => item.id === active)?.href.replace(`/${locale}`, `/${lang}`) ?? `/${lang}`}
                  aria-current={locale === lang ? "true" : undefined}
                  className={`min-h-10 px-3 py-2 ${locale === lang ? "bg-primary-700 text-white" : "text-neutral-700 hover:bg-neutral-50"}`}>
                  {lang === "en" ? "EN" : "ID"}
                </Link>
              ))}
            </div>
            <a className="hidden min-h-10 items-center gap-2 rounded-md border border-primary-300 px-3 text-sm font-semibold text-primary-800 hover:bg-primary-50 sm:inline-flex" href="/CV%20Kusumawati.pdf" download>
              <Download size={15} aria-hidden="true" />CV
            </a>
            <details className="relative lg:hidden">
              <summary className="grid min-h-10 min-w-10 cursor-pointer list-none place-items-center rounded-md border border-neutral-300 text-sm" aria-label="Open navigation">Menu</summary>
              <nav className="absolute right-0 top-12 z-50 grid w-56 gap-1 rounded-lg border border-neutral-200 bg-white p-2 shadow-lg" aria-label="Mobile navigation">
                {visibleNav.map((item) => <Link key={item.id} href={item.href} className="min-h-11 rounded-md px-3 py-2 text-sm hover:bg-primary-50">{item.label[locale]}</Link>)}
                <a className="min-h-11 rounded-md px-3 py-2 text-sm text-primary-800 hover:bg-primary-50" href="/CV%20Kusumawati.pdf" download>{text.cv}</a>
              </nav>
            </details>
          </div>
        </div>
      </header>
      {children}
      <footer className="border-t border-neutral-200 bg-primary-950 text-white">
        <div className="mx-auto grid max-w-6xl gap-8 px-5 py-10 sm:grid-cols-2 lg:grid-cols-3 lg:px-10">
          <div><p className="font-semibold">Kusumawati</p><p className="mt-1 text-sm text-primary-200">{text.tagline}</p></div>
          <nav aria-label="Footer navigation" className="grid grid-cols-2 gap-2 text-sm text-primary-100">
            {visibleNav.map((item) => <Link key={item.id} href={item.href} className="hover:text-white">{item.label[locale]}</Link>)}
          </nav>
          <div className="text-sm text-primary-100">
            <a href="mailto:khusumawati232@gmail.com" className="inline-flex items-center gap-2 hover:text-white"><Mail size={15} />khusumawati232@gmail.com</a>
            <p className="mt-2">© {new Date().getFullYear()} Kusumawati</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export function HomePage({
  locale,
  profile,
  experiences,
  publications,
  competencies,
}: {
  locale: Locale
  profile?: PortfolioItem | null
  experiences: PortfolioItem[]
  publications: PortfolioItem[]
  competencies: string[]
}) {
  const text = labels[locale]
  const name = profile?.full_name || "Kusumawati"
  const title = profile?.professional_title || text.tagline
  const summary = locale === "id"
    ? profile?.summary_id || profile?.summary_en || text.sentence
    : profile?.summary_en || text.sentence
  const photo = profile?.photo_url || "/kusumawati.png"
  const cv = profile?.cv_url || "/CV Kusumawati.pdf"

  return (
    <PublicShell locale={locale} active="home">
      <main>
        <section className="mx-auto grid max-w-6xl items-center gap-10 px-5 py-10 sm:py-14 lg:min-h-[min(760px,calc(100vh-72px))] lg:grid-cols-[1.05fr_.95fr] lg:gap-16 lg:px-10 lg:py-16">
          <div className="min-w-0">
            <p className="mb-5 text-sm font-medium text-primary-700">{title}</p>
            <h1 className="max-w-[10ch] break-words text-5xl font-bold leading-[1.05] tracking-tight text-primary-950 sm:text-6xl lg:text-7xl">{name}</h1>
            <p className="mt-6 max-w-xl text-lg leading-8 text-neutral-700">{summary}</p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link className="inline-flex min-h-12 items-center rounded-md bg-primary-700 px-5 font-semibold text-white hover:bg-primary-800" href={`/${locale}/experience`}>{text.explore}</Link>
              <a className="inline-flex min-h-12 items-center gap-2 rounded-md border border-primary-300 px-5 font-semibold text-primary-800 hover:bg-primary-50" href={cv} download><Download size={17} />{text.cv}</a>
            </div>
            <Link href={`/${locale}/contact`} className="mt-5 inline-flex min-h-10 items-center gap-1 text-sm font-semibold text-primary-700 hover:text-primary-950">{text.contact}<ArrowUpRight size={16} aria-hidden="true" /></Link>
          </div>
          <div className="relative mx-auto w-full max-w-[440px] min-w-0">
            <div className="absolute -bottom-4 -left-4 -z-10 h-full w-full rounded-[28px] bg-primary-100" aria-hidden="true" />
            <img src={photo} alt={`Portrait of ${name}`} className="aspect-[4/5] w-full rounded-[24px] object-cover object-center" />
          </div>
        </section>
        {competencies.length > 0 && (
          <section className="border-t border-neutral-200 bg-primary-50 py-12 sm:py-16">
            <div className="mx-auto max-w-6xl px-5 lg:px-10">
              <h2 className="mb-6 text-2xl font-bold text-primary-950">{text.competencies}</h2>
              <ul className="flex flex-wrap gap-3" aria-label={text.competencies}>
                {competencies.map((skill) => (
                  <li key={skill} className="rounded-md border border-primary-200 bg-white px-4 py-2 text-sm text-neutral-800">
                    {skill}
                  </li>
                ))}
              </ul>
            </div>
          </section>
        )}
        {experiences.length > 0 && <HomeHighlights title={text.featuredExperience} locale={locale} items={experiences} />}
        {publications.length > 0 && <HomeHighlights title={text.featuredResearch} locale={locale} items={publications} />}
      </main>
    </PublicShell>
  )
}

function HomeHighlights({ title, locale, items }: { title: string; locale: Locale; items: PortfolioItem[] }) {
  return (
    <section className="border-t border-neutral-200 bg-primary-50 py-14 sm:py-20">
      <div className="mx-auto max-w-6xl px-5 lg:px-10">
        <h2 className="mb-8 text-3xl font-bold text-primary-950">{title}</h2>
        <PortfolioGrid locale={locale} items={items} empty={labels[locale].noContent} />
      </div>
    </section>
  )
}

export function ContentPage({
  locale,
  section,
  items,
  projects = [],
  profile,
}: {
  locale: Locale
  section: PageSection
  items: PortfolioItem[]
  projects?: PortfolioItem[]
  profile?: PortfolioItem | null
}) {
  const text = labels[locale]
  const sectionName = text[section]
  const intro = text[`${section}Intro`]
  return (
    <PublicShell locale={locale} active={section}>
      <main className="mx-auto min-h-[65vh] max-w-6xl px-5 py-12 sm:py-16 lg:px-10">
        <header className="mb-10 max-w-3xl border-b border-neutral-200 pb-7 sm:mb-12">
          <h1 className="break-words text-4xl font-bold text-primary-950 sm:text-5xl">{sectionName}</h1>
          <p className="mt-4 max-w-2xl text-lg leading-8 text-neutral-700">{intro}</p>
        </header>
        {section === "contact" ? (
          <div className="grid gap-12 lg:grid-cols-2">
            <section aria-labelledby="contact-methods">
              <h2 id="contact-methods" className="text-2xl font-semibold text-primary-950">{text.contactMethods}</h2>
              <div className="mt-6 space-y-4">
                {profile?.email && <ContactLine icon={<Mail size={19} />} label="Email" value={profile.email} href={`mailto:${profile.email}`} />}
                {profile?.whatsapp && <ContactLine icon={<Phone size={19} />} label="WhatsApp" value={profile.whatsapp} href={`https://wa.me/${profile.whatsapp.replace(/\D/g, "")}`} />}
                {(profile?.linkedin_url || profile?.linkedin) && <ContactLine icon={<ArrowUpRight size={19} />} label="LinkedIn" value="Kusumawati" href={profile.linkedin_url || profile.linkedin || ""} />}
                {profile?.location && <ContactLine icon={<MapPin size={19} />} label="Location" value={profile.location} />}
              </div>
            </section>
            <section aria-labelledby="send-message">
              <h2 id="send-message" className="mb-5 text-2xl font-semibold text-primary-950">{text.send}</h2>
              <ContactForm locale={locale} />
            </section>
          </div>
        ) : section === "education" ? (
          <div className="space-y-12">
              <PortfolioGrid locale={locale} items={items} empty={text.noContent} />
              {projects.length > 0 && <section><h2 className="mb-6 text-2xl font-semibold text-primary-950">{text.projects}</h2><PortfolioGrid locale={locale} items={projects} empty={text.noContent} /></section>}
          </div>
        ) : (
            <PortfolioGrid locale={locale} items={items} filter={section === "experience" ? "experience" : section === "certification" ? "certification" : undefined} empty={text.noContent} />
        )}
      </main>
    </PublicShell>
  )
}

function ContactLine({ icon, label, value, href }: { icon: ReactNode; label: string; value: string; href?: string }) {
  return <div className="flex items-start gap-4 border-b border-neutral-200 py-4"><span className="mt-1 text-primary-700">{icon}</span><div><p className="text-sm text-neutral-600">{label}</p>{href ? <a className="mt-1 inline-block font-medium text-primary-800 underline-offset-4 hover:underline" href={href} target={href.startsWith("http") ? "_blank" : undefined} rel={href.startsWith("http") ? "noreferrer" : undefined}>{value}</a> : <p className="mt-1 font-medium">{value}</p>}</div></div>
}
