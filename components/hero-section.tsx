"use client"

import Image from "next/image"
import Link from "next/link"
import { Download, ArrowRight, Mail, Linkedin } from "lucide-react"

interface Profile {
  full_name: string
  professional_title: string
  summary_en: string
  summary_id?: string | null
  photo_url?: string | null
  cv_url?: string | null
  email?: string | null
  whatsapp?: string | null
  linkedin_url?: string | null
  location?: string | null
}

interface HeroSectionProps {
  profile: Profile
  locale?: "en" | "id"
}

// Subtle molecular SVG decoration
function MolecularDecoration() {
  return (
    <svg
      width="260"
      height="260"
      viewBox="0 0 260 260"
      fill="none"
      aria-hidden="true"
      className="molecular-bg absolute right-0 top-0 w-64 h-64 select-none"
    >
      {/* Hexagonal molecular structure */}
      <circle cx="130" cy="50" r="6" stroke="#25639B" strokeWidth="1.5" fill="none" />
      <circle cx="180" cy="80" r="6" stroke="#25639B" strokeWidth="1.5" fill="none" />
      <circle cx="180" cy="130" r="6" stroke="#25639B" strokeWidth="1.5" fill="none" />
      <circle cx="130" cy="160" r="6" stroke="#25639B" strokeWidth="1.5" fill="none" />
      <circle cx="80" cy="130" r="6" stroke="#25639B" strokeWidth="1.5" fill="none" />
      <circle cx="80" cy="80" r="6" stroke="#25639B" strokeWidth="1.5" fill="none" />
      <line x1="130" y1="56" x2="180" y2="74" stroke="#25639B" strokeWidth="1" />
      <line x1="186" y1="80" x2="186" y2="130" stroke="#25639B" strokeWidth="1" />
      <line x1="180" y1="136" x2="130" y2="154" stroke="#25639B" strokeWidth="1" />
      <line x1="124" y1="160" x2="74" y2="136" stroke="#25639B" strokeWidth="1" />
      <line x1="74" y1="130" x2="74" y2="80" stroke="#25639B" strokeWidth="1" />
      <line x1="80" y1="74" x2="130" y2="56" stroke="#25639B" strokeWidth="1" />
      {/* Small dots */}
      <circle cx="230" cy="180" r="3" fill="#A9CDE7" />
      <circle cx="210" cy="210" r="2" fill="#A9CDE7" />
      <circle cx="40" cy="200" r="3" fill="#A9CDE7" />
      <circle cx="20" cy="160" r="2" fill="#A9CDE7" />
    </svg>
  )
}

export function HeroSection({ profile, locale = "en" }: HeroSectionProps) {
  const summary = locale === "id" && profile.summary_id ? profile.summary_id : profile.summary_en

  const DEFAULT_SUMMARY =
    "Chemical Engineering graduate with hands-on experience in research and development, laboratory analysis, and industrial process engineering. Dedicated to advancing scientific knowledge and contributing to the R&D field."

  return (
    <section
      id="home"
      className="relative min-h-[620px] flex items-center overflow-hidden bg-white"
      style={{ paddingTop: "88px", paddingBottom: "88px" }}
    >
      <MolecularDecoration />

      <div className="max-w-6xl mx-auto px-5 lg:px-10 w-full relative z-10">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">

          {/* Text column ~52% */}
          <div className="order-2 lg:order-1 space-y-6">
            {/* Eyebrow */}
            <p className="section-eyebrow">Chemical Engineering</p>

            {/* Name */}
            <div className="space-y-2">
              <h1
                className="font-bold tracking-tight text-neutral-950"
                style={{ fontSize: "clamp(38px, 5vw, 56px)", lineHeight: "1.1", fontFamily: "var(--font-display-sora)" }}
              >
                {profile.full_name}
              </h1>
              <p
                className="font-semibold text-primary-700"
                style={{ fontSize: "clamp(18px, 2.5vw, 24px)" }}
              >
                {profile.professional_title}
              </p>
            </div>

            {/* Summary */}
            <p className="text-neutral-700 text-base leading-relaxed max-w-lg">
              {summary || DEFAULT_SUMMARY}
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <Link
                href="/experience"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-primary-700 text-white font-semibold text-sm hover:bg-primary-800 transition-all hover:-translate-y-0.5 shadow-md shadow-primary-700/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary-600"
              >
                Explore My Experience
                <ArrowRight size={16} />
              </Link>
              <a
                href={profile.cv_url || "/CV Kusumawati.pdf"}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl border border-primary-300 text-primary-700 font-semibold text-sm hover:bg-primary-50 transition-colors"
              >
                <Download size={16} />
                Download CV
              </a>
            </div>

            {/* Social links */}
            <div className="flex items-center gap-3 pt-1">
              {profile.linkedin_url && (
                <a
                  href={profile.linkedin_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="LinkedIn profile"
                  className="flex items-center gap-1.5 text-sm text-neutral-600 hover:text-primary-700 transition-colors"
                >
                  <Linkedin size={16} />
                  LinkedIn
                </a>
              )}
              {profile.email && (
                <a
                  href={`mailto:${profile.email}`}
                  aria-label="Send email"
                  className="flex items-center gap-1.5 text-sm text-neutral-600 hover:text-primary-700 transition-colors"
                >
                  <Mail size={16} />
                  {profile.email}
                </a>
              )}
            </div>
          </div>

          {/* Portrait column ~48% */}
          <div className="order-1 lg:order-2 flex justify-center lg:justify-end">
            <div
              className="relative"
              style={{ width: "min(100%, 380px)", maxWidth: "420px" }}
            >
              {/* Blue backdrop panel */}
              <div
                className="absolute bottom-0 inset-x-0 hero-gradient rounded-[var(--radius-2xl)]"
                style={{ height: "72%", opacity: 0.9 }}
                aria-hidden="true"
              />

              {/* Profile photo */}
              <div
                className="relative"
                style={{ clipPath: "inset(0 0 0 0 round 0 0 28px 28px)" }}
              >
                <Image
                  src={profile.photo_url || "/kusumawati.png"}
                  alt={`Professional photo of ${profile.full_name}`}
                  width={420}
                  height={525}
                  sizes="(max-width: 640px) 300px, (max-width: 1024px) 360px, 420px"
                  style={{ width: "100%", height: "auto", objectFit: "cover" }}
                  className="block drop-shadow-xl"
                  priority
                  unoptimized
                />
              </div>

              {/* Floating badge: location */}
              {profile.location && (
                <div
                  className="absolute left-0 sm:-left-4 bottom-[22%] z-10 flex items-center gap-2 bg-white/95 backdrop-blur-sm border border-neutral-100 shadow-lg rounded-xl px-3 py-2"
                  aria-hidden="true"
                  style={{ animation: "floatBadge 4s ease-in-out infinite" }}
                >
                  <span className="text-xs font-semibold text-neutral-700 whitespace-nowrap">
                    📍 {profile.location.split(",")[0]}
                  </span>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>

      <style>{`
        @keyframes floatBadge {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-6px); }
        }
        @media (prefers-reduced-motion: reduce) {
          [style*="floatBadge"] { animation: none !important; }
        }
      `}</style>
    </section>
  )
}
