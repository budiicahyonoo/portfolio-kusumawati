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
    intro: "I'm",
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
    intro: "Saya",
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
    <div className="min-h-screen bg-paper text-ink">
      <header className="sticky top-0 z-40 border-b border-rule bg-paper/95 backdrop-blur-sm">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-5 lg:h-[72px] lg:px-10">
          <Link
            className="shrink-0 text-2xl font-medium tracking-tight text-ink transition-opacity hover:opacity-80"
            style={{
              fontFamily: "var(--font-serif-italic, Georgia), serif",
              fontStyle: "italic",
            }}
            href={`/${locale}`}
          >
            Kusumawati
          </Link>
          <nav className="hidden items-center gap-1.5 lg:flex" aria-label="Main navigation">
            {visibleNav.map((item) => {
              const isActive = active === item.id
              return (
                <Link
                  key={item.id}
                  href={item.href}
                  aria-current={isActive ? "page" : undefined}
                  className={`min-h-10 rounded-md px-3.5 py-2 text-sm font-semibold transition-all duration-150 ${
                    isActive
                      ? "bg-primary-700 text-white shadow-sm"
                      : "text-ink-2 hover:bg-primary-50 hover:text-primary-700"
                  }`}
                >
                  {item.label[locale]}
                </Link>
              )
            })}
          </nav>
          <div className="flex items-center gap-2">
            <div className="flex overflow-hidden rounded-md border border-rule-strong text-xs font-semibold">
              {(["en", "id"] as const).map((lang) => (
                <Link
                  key={lang}
                  href={visibleNav.find((item) => item.id === active)?.href.replace(`/${locale}`, `/${lang}`) ?? `/${lang}`}
                  aria-current={locale === lang ? "true" : undefined}
                  className={`min-h-10 px-3 py-2 transition-colors ${
                    locale === lang ? "bg-primary-700 text-white" : "text-ink-2 hover:bg-primary-50 hover:text-primary-700"
                  }`}
                >
                  {lang === "en" ? "EN" : "ID"}
                </Link>
              ))}
            </div>
            <a
              className="hidden min-h-10 items-center gap-2 rounded-md border border-primary-700 px-3.5 text-sm font-semibold text-primary-700 transition-colors hover:bg-primary-50 hover:text-primary-800 sm:inline-flex"
              href="/CV%20Kusumawati.pdf"
              download
            >
              <Download size={15} aria-hidden="true" />CV
            </a>
            <details className="relative lg:hidden">
              <summary className="grid min-h-10 min-w-10 cursor-pointer list-none place-items-center rounded-md border border-rule-strong text-sm" aria-label="Open navigation">Menu</summary>
              <nav className="absolute right-0 top-12 z-50 grid w-56 gap-1 rounded-lg border border-rule bg-paper p-2 shadow-lg" aria-label="Mobile navigation">
                {visibleNav.map((item) => {
                  const isActive = active === item.id
                  return (
                    <Link
                      key={item.id}
                      href={item.href}
                      className={`min-h-11 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                        isActive
                          ? "bg-primary-700 text-white font-semibold"
                          : "hover:bg-primary-50 hover:text-primary-700"
                      }`}
                    >
                      {item.label[locale]}
                    </Link>
                  )
                })}
                <a className="min-h-11 rounded-md px-3 py-2 text-sm text-primary-700 hover:bg-primary-50 hover:text-primary-800" href="/CV%20Kusumawati.pdf" download>{text.cv}</a>
              </nav>
            </details>
          </div>
        </div>
      </header>
      {children}
      <footer className="border-t border-rule bg-primary-950 text-paper">
        <div className="mx-auto grid max-w-6xl gap-8 px-5 py-10 sm:grid-cols-2 lg:grid-cols-3 lg:px-10">
          <div>
            <p
              className="text-2xl font-medium tracking-tight text-white"
              style={{
                fontFamily: "var(--font-serif-italic, Georgia), serif",
                fontStyle: "italic",
              }}
            >
              Kusumawati
            </p>
            <p className="mt-1 text-sm text-primary-200">{text.tagline}</p>
          </div>
          <nav aria-label="Footer navigation" className="grid grid-cols-2 gap-2 text-sm text-primary-100">
            {visibleNav.map((item) => <Link key={item.id} href={item.href} className="hover:text-paper">{item.label[locale]}</Link>)}
          </nav>
          <div className="text-sm text-primary-100">
            <a href="mailto:khusumawati232@gmail.com" className="inline-flex items-center gap-2 hover:text-paper"><Mail size={15} />khusumawati232@gmail.com</a>
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
        {/* ── Hero Stage ── headline di BELAKANG foto, foto center di bawah, info kecil di sisi ── */}
        <section className="relative isolate overflow-hidden bg-paper">
          <div className="relative mx-auto flex min-h-[580px] max-w-[1400px] flex-col px-5 sm:px-8 lg:h-[calc(100svh-72px)] lg:min-h-[620px] lg:px-12">

            {/* LAYER 1 (z-10): Headline — di belakang foto */}
            <div
              aria-hidden="true"
              className="pointer-events-none relative z-10 select-none pt-4 text-center sm:pt-8 lg:pt-10"
            >
              <p
                className="text-[clamp(2.5rem,7vw,6.5rem)] leading-[0.95] text-ink"
                style={{
                  fontFamily: "var(--font-serif-italic, Georgia), serif",
                  fontStyle: "italic",
                  fontWeight: 500,
                }}
              >
                I&apos;m Chemical
              </p>
              <span className="font-display -mt-1 block whitespace-nowrap text-[clamp(1.75rem,8.5vw,7.5rem)] font-black uppercase leading-[0.88] tracking-tight text-primary-700 sm:-mt-2 lg:-mt-3">
                ENGINEERING
              </span>
            </div>

            {/* LAYER 2 (z-20): Foto — nempel bawah, center, kepala menimpa headline */}
            <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 flex h-[68%] justify-center sm:h-[72%] lg:h-[75%]">
              <img
                src={photo}
                alt={`Portrait of ${name}`}
                fetchPriority="high"
                className="h-full w-auto max-w-none object-contain object-bottom"
              />
            </div>

            {/* LAYER 3 (z-30): Info kiri, CTA tengah, ringkasan kanan */}
            <div className="relative z-30 mt-auto grid items-end gap-6 pb-6 pt-6 sm:grid-cols-3 sm:pb-8">
              <div className="hidden max-w-[15rem] sm:block">
                <div className="mb-2.5 h-0.5 w-8 bg-ink" aria-hidden="true" />
                <p className="font-body text-xs font-bold uppercase leading-relaxed tracking-wider text-ink">
                  {locale === "id"
                    ? "Spesialisasi dalam riset kimia, analisis laboratorium, dan rekayasa proses."
                    : "Specialized in chemical research, laboratory analysis, and process engineering."}
                </p>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-3">
                {/* tanda ! (important) dipakai karena .btn-primary/.btn-secondary di globals.css
                    ada di luar @layer, jadi menang lawan utility Tailwind biasa */}
                <Link
                  href={`/${locale}/contact`}
                  className="btn-primary rounded-full! px-8! py-3 text-xs font-bold uppercase tracking-wider shadow-lg hover:shadow-xl sm:text-sm"
                >
                  {locale === "id" ? "Mari Bicara" : "Let's Chat"}
                </Link>
                <a
                  href={cv}
                  download
                  className="btn-secondary rounded-full! px-5! py-3 text-xs font-semibold uppercase tracking-wider shadow-sm sm:text-sm"
                >
                  <Download size={15} aria-hidden="true" />
                  CV
                </a>
              </div>

              <div className="hidden max-w-[17rem] justify-self-end sm:block sm:text-right">
                <p className="font-body text-xs leading-relaxed text-ink-2 sm:text-sm">{summary}</p>
                <Link
                  href={`/${locale}/experience`}
                  className="mt-2 inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-primary-700 hover:text-primary-900"
                >
                  {text.explore} <ArrowUpRight size={14} aria-hidden="true" />
                </Link>
              </div>
            </div>
          </div>

          {/* Mobile: teks info pindah ke bawah stage biar nggak ketutup foto */}
          <div className="mx-auto max-w-[1400px] space-y-4 px-5 pb-10 pt-6 sm:hidden">
            <p className="font-body text-xs font-bold uppercase leading-relaxed tracking-wider text-ink">
              {locale === "id"
                ? "Spesialisasi dalam riset kimia, analisis laboratorium, dan rekayasa proses."
                : "Specialized in chemical research, laboratory analysis, and process engineering."}
            </p>
            <p className="font-body text-sm leading-relaxed text-ink-2">{summary}</p>
            <Link
              href={`/${locale}/experience`}
              className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-primary-700"
            >
              {text.explore} <ArrowUpRight size={14} aria-hidden="true" />
            </Link>
          </div>

          {/* Visually-hidden h1 untuk aksesibilitas & SEO */}
          <h1 className="visually-hidden">Chemical Engineering — {name}</h1>
        </section>
        {competencies.length > 0 && (
          <section className="border-t border-rule bg-paper py-12 sm:py-16">
            <div className="mx-auto max-w-6xl px-5 lg:px-10">
              <h2
                className="mb-6 text-3xl font-medium tracking-tight text-ink sm:text-4xl"
                style={{
                  fontFamily: "var(--font-serif-italic, Georgia), serif",
                  fontStyle: "italic",
                }}
              >
                {text.competencies}
              </h2>
              <ul className="flex flex-wrap gap-2.5" aria-label={text.competencies}>
                {competencies.map((skill) => (
                  <li
                    key={skill}
                    className="rounded-full border border-neutral-200 bg-white px-4 py-2 text-xs font-semibold text-neutral-700 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-primary-300 hover:text-primary-700 hover:shadow-[0_4px_16px_rgba(0,83,255,0.08)] sm:text-sm"
                  >
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
    <section className="border-t border-rule bg-paper py-14 sm:py-20">
      <div className="mx-auto max-w-6xl px-5 lg:px-10">
        <h2
          className="mb-8 text-3xl font-medium tracking-tight text-ink sm:text-4xl"
          style={{
            fontFamily: "var(--font-serif-italic, Georgia), serif",
            fontStyle: "italic",
          }}
        >
          {title}
        </h2>
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
        <header className="mb-10 max-w-3xl border-b border-rule pb-7 sm:mb-14">
          <h1
            className="break-words text-4xl font-medium tracking-tight text-ink sm:text-5xl lg:text-6xl"
            style={{
              fontFamily: "var(--font-serif-italic, Georgia), serif",
              fontStyle: "italic",
            }}
          >
            {sectionName}
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-ink-2 sm:text-lg sm:leading-8">{intro}</p>
        </header>
        {section === "contact" ? (
          <div className="grid gap-12 lg:grid-cols-2">
            <section aria-labelledby="contact-methods" className="rounded-2xl border border-rule bg-white p-6 shadow-sm transition-all duration-300 hover:border-primary-300 hover:shadow-[0_12px_32px_rgba(0,83,255,0.12)] sm:p-8">
              <h2
                id="contact-methods"
                className="text-2xl font-medium tracking-tight text-ink sm:text-3xl"
                style={{
                  fontFamily: "var(--font-serif-italic, Georgia), serif",
                  fontStyle: "italic",
                }}
              >
                {text.contactMethods}
              </h2>
              <div className="mt-6 space-y-4">
                {profile?.email && <ContactLine icon={<Mail size={19} />} label="Email" value={profile.email} href={`mailto:${profile.email}`} />}
                {profile?.whatsapp && <ContactLine icon={<Phone size={19} />} label="WhatsApp" value={profile.whatsapp} href={`https://wa.me/${profile.whatsapp.replace(/\D/g, "")}`} />}
                {(profile?.linkedin_url || profile?.linkedin) && <ContactLine icon={<ArrowUpRight size={19} />} label="LinkedIn" value="Kusumawati" href={profile.linkedin_url || profile.linkedin || ""} />}
                {profile?.location && <ContactLine icon={<MapPin size={19} />} label="Location" value={profile.location} />}
              </div>
            </section>
            <section aria-labelledby="send-message" className="rounded-2xl border border-rule bg-white p-6 shadow-sm transition-all duration-300 hover:border-primary-300 hover:shadow-[0_12px_32px_rgba(0,83,255,0.12)] sm:p-8">
              <h2
                id="send-message"
                className="mb-6 text-2xl font-medium tracking-tight text-ink sm:text-3xl"
                style={{
                  fontFamily: "var(--font-serif-italic, Georgia), serif",
                  fontStyle: "italic",
                }}
              >
                {text.send}
              </h2>
              <ContactForm locale={locale} />
            </section>
          </div>
        ) : section === "education" ? (
          <div className="space-y-14">
            <PortfolioGrid locale={locale} items={items} empty={text.noContent} />
            {projects.length > 0 && (
              <section className="pt-6">
                <h2
                  className="mb-8 text-3xl font-medium tracking-tight text-ink sm:text-4xl"
                  style={{
                    fontFamily: "var(--font-serif-italic, Georgia), serif",
                    fontStyle: "italic",
                  }}
                >
                  {text.projects}
                </h2>
                <PortfolioGrid locale={locale} items={projects} empty={text.noContent} />
              </section>
            )}
          </div>
        ) : (
          <PortfolioGrid locale={locale} items={items} filter={section === "experience" ? "experience" : section === "certification" ? "certification" : undefined} empty={text.noContent} />
        )}
      </main>
    </PublicShell>
  )
}

function ContactLine({ icon, label, value, href }: { icon: ReactNode; label: string; value: string; href?: string }) {
  return <div className="flex items-start gap-4 border-b border-rule py-4"><span className="mt-1 text-primary-700">{icon}</span><div><p className="text-sm text-muted">{label}</p>{href ? <a className="mt-1 inline-block font-medium text-primary-800 underline-offset-4 hover:underline" href={href} target={href.startsWith("http") ? "_blank" : undefined} rel={href.startsWith("http") ? "noreferrer" : undefined}>{value}</a> : <p className="mt-1 font-medium">{value}</p>}</div></div>
}