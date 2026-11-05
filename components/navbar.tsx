"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, X, Download } from "lucide-react"

const NAV_ITEMS = [
  { label: "Home", href: "/" },
  { label: "Education", href: "/education" },
  { label: "Certification", href: "/certification" },
  { label: "Experience", href: "/experience" },
  { label: "Organization", href: "/organization" },
  { label: "Contact", href: "/contact" },
]

type Locale = "en" | "id"
const LANG_LABELS: Record<Locale, string> = { en: "EN", id: "ID" }

interface NavbarProps {
  locale?: Locale
  onLocaleChange?: (locale: Locale) => void
}

export function Navbar({ locale = "en", onLocaleChange }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 10)
    window.addEventListener("scroll", handler, { passive: true })
    return () => window.removeEventListener("scroll", handler)
  }, [])

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href)

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-200 ${
        scrolled
          ? "bg-white/95 backdrop-blur-sm shadow-sm border-b border-neutral-200"
          : "bg-white border-b border-neutral-200/60"
      }`}
      style={{ height: "72px" }}
    >
      <div className="max-w-6xl mx-auto px-5 lg:px-10 h-full flex items-center justify-between">
        {/* Brand */}
        <Link
          href="/"
          onClick={() => setIsOpen(false)}
          className="font-bold text-neutral-950 text-lg tracking-tight hover:text-primary-700 transition-colors"
          style={{ fontFamily: "var(--font-display-sora)" }}
        >
          Kusumawati
        </Link>

        {/* Desktop nav */}
        <nav className="hidden lg:flex items-center gap-1" aria-label="Main navigation">
          {NAV_ITEMS.map(({ label, href }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setIsOpen(false)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                isActive(href)
                  ? "text-primary-700 bg-primary-50"
                  : "text-neutral-700 hover:text-primary-700 hover:bg-neutral-100"
              }`}
              aria-current={isActive(href) ? "page" : undefined}
            >
              {label}
              {isActive(href) && (
                <span className="block h-0.5 mt-0.5 bg-primary-600 rounded-full" />
              )}
            </Link>
          ))}
        </nav>

        {/* Right side: lang + CV + mobile menu */}
        <div className="flex items-center gap-2">
          {/* Language Switcher */}
          <div className="hidden sm:flex items-center rounded-lg border border-neutral-200 overflow-hidden text-xs font-semibold">
            {(["en", "id"] as Locale[]).map((lang) => (
              <button
                key={lang}
                onClick={() => {
                  onLocaleChange?.(lang)
                  setIsOpen(false)
                }}
                className={`px-2.5 py-1 transition-colors ${
                  locale === lang
                    ? "bg-primary-700 text-white"
                    : "text-neutral-600 hover:bg-neutral-100"
                }`}
                aria-pressed={locale === lang}
                aria-label={`Switch to ${lang === "en" ? "English" : "Bahasa Indonesia"}`}
              >
                {LANG_LABELS[lang]}
              </button>
            ))}
          </div>

          {/* Download CV */}
          <a
            href="/CV Kusumawati.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-semibold text-primary-700 border border-primary-300 rounded-lg hover:bg-primary-50 transition-colors"
            aria-label="Download CV"
          >
            <Download size={14} />
            CV
          </a>

          {/* Mobile menu toggle */}
          <button
            className="lg:hidden p-2 rounded-lg text-neutral-700 hover:bg-neutral-100 transition-colors"
            onClick={() => setIsOpen((v) => !v)}
            aria-label={isOpen ? "Close menu" : "Open menu"}
            aria-expanded={isOpen}
          >
            {isOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="lg:hidden border-t border-neutral-200 bg-white shadow-lg animate-in slide-in-from-top-2 duration-200">
          <nav className="max-w-6xl mx-auto px-5 py-4 flex flex-col gap-1" aria-label="Mobile navigation">
            {NAV_ITEMS.map(({ label, href }) => (
              <Link
                key={href}
                href={href}
                onClick={() => setIsOpen(false)}
                className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive(href)
                    ? "text-primary-700 bg-primary-50 font-semibold"
                    : "text-neutral-700 hover:text-primary-700 hover:bg-neutral-100"
                }`}
                aria-current={isActive(href) ? "page" : undefined}
              >
                {label}
              </Link>
            ))}
            <div className="flex items-center gap-2 mt-3 pt-3 border-t border-neutral-100">
              <div className="flex items-center rounded-lg border border-neutral-200 overflow-hidden text-xs font-semibold">
                {(["en", "id"] as Locale[]).map((lang) => (
                  <button
                    key={lang}
                    onClick={() => {
                      onLocaleChange?.(lang)
                      setIsOpen(false)
                    }}
                    className={`px-3 py-1.5 transition-colors ${
                      locale === lang ? "bg-primary-700 text-white" : "text-neutral-600 hover:bg-neutral-100"
                    }`}
                  >
                    {LANG_LABELS[lang]}
                  </button>
                ))}
              </div>
              <a
                href="/CV Kusumawati.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-semibold text-primary-700 border border-primary-300 rounded-lg hover:bg-primary-50 transition-colors"
              >
                <Download size={14} />
                Download CV
              </a>
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}
