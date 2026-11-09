"use client"

import { useMemo, useState } from "react"
import { FileDown } from "lucide-react"
import { DetailDialog, parseToPoints } from "@/components/public/detail-dialog"
import type { PortfolioItem } from "@/components/public/public-portfolio"

type Locale = "en" | "id"
type Filter = "experience" | "certification"

const categoryLabels: Record<Locale, Record<string, string>> = {
  en: { All: "All", Work: "Work", Internship: "Internship", Speaker: "Speaker", Certification: "Certifications", Training: "Training", Journal: "Journals", Patent: "Patents" },
  id: { All: "Semua", Work: "Kerja", Internship: "Magang", Speaker: "Pembicara", Certification: "Sertifikasi", Training: "Pelatihan", Journal: "Jurnal", Patent: "Paten" },
}
const actionLabels: Record<Locale, { details: string; document: string; verification: string }> = {
  en: { details: "View details", document: "Open or download", verification: "Verification link" },
  id: { details: "Lihat detail", document: "Buka atau unduh", verification: "Tautan verifikasi" },
}

export function PortfolioGrid({
  locale,
  items,
  filter,
  empty,
}: {
  locale: Locale
  items: PortfolioItem[]
  filter?: Filter
  empty: string
}) {
  const [selected, setSelected] = useState("All")
  const options = filter === "experience"
    ? ["All", "Work", "Internship", "Speaker"]
    : filter === "certification"
      ? ["All", "Certification", "Training", "Journal", "Patent"]
      : []
  const visible = useMemo(
    () => selected === "All" ? items : items.filter((item) => item.category === selected),
    [items, selected],
  )

  if (!items.length) return <p className="rounded-lg border border-dashed border-neutral-300 px-5 py-8 text-neutral-700">{empty}</p>
  return (
    <>
      {options.length > 0 && (
        <div className="mb-7 flex flex-wrap gap-2" role="group" aria-label={locale === "en" ? "Filter content" : "Saring konten"}>
          {options.map((option) => (
            <button
              key={option}
              type="button"
              aria-pressed={selected === option}
              onClick={() => setSelected(option)}
              className={`min-h-10 rounded-md px-4 text-xs font-semibold uppercase tracking-wider transition-all duration-150 ${
                selected === option
                  ? "bg-primary-700 text-white shadow-sm"
                  : "border border-neutral-200 bg-white text-neutral-700 hover:border-primary-300 hover:bg-primary-50 hover:text-primary-700"
              }`}
            >
              {categoryLabels[locale][option]}
            </button>
          ))}
        </div>
      )}
      {visible.length === 0 ? <p className="text-neutral-700">{empty}</p> : (
        <div className="grid min-w-0 gap-5 md:grid-cols-2 xl:grid-cols-3">
          {visible.map((item) => <PortfolioCard key={item.id} item={item} locale={locale} />)}
        </div>
      )}
    </>
  )
}

function PortfolioCard({ item, locale }: { item: PortfolioItem; locale: Locale }) {
  const title = item.title_en || item.position_en || item.institution || item.name || "Portfolio item"
  const localizedTitle = locale === "id" ? item.title_id || item.position_id || title : title
  const description = locale === "id"
    ? item.description_id || item.summary_id || item.contribution_id || item.description_en || item.summary_en || null
    : item.description_en || item.summary_en || item.contribution_en || null
  const category = item.category || ""
  const image = item.cover_image_url || item.logo_url || item.media?.[0]?.url

  const isPdf = (url?: string | null) => {
    if (!url) return false
    return url.toLowerCase().includes(".pdf") || url.toLowerCase().includes("mime_type=application/pdf")
  }

  const isEducation = Boolean(item.institution && item.degree)
  const academicFocus = locale === "id"
    ? item.academic_focus_id || item.academic_focus || item.academic_focus_en
    : item.academic_focus_en || item.academic_focus || item.academic_focus_id

  const meta: string[] = []
  if (isEducation) {
    if (item.degree || item.field_of_study) {
      meta.push([item.degree, item.field_of_study].filter(Boolean).join(" — "))
    }
    if (item.period_start) {
      meta.push(item.period_end ? `${item.period_start} – ${item.period_end}` : `${item.period_start} – ${locale === "id" ? "Sekarang" : "Present"}`)
    }
    if (item.location) meta.push(item.location)
    if (item.gpa) meta.push(locale === "id" ? `IPK: ${item.gpa}` : `GPA: ${item.gpa}`)
    if (academicFocus) meta.push(locale === "id" ? `Fokus: ${academicFocus}` : `Focus: ${academicFocus}`)
  } else {
    const orgOrIssuer = item.organization || item.issuer || item.degree
    if (orgOrIssuer) meta.push(orgOrIssuer)
    if (item.research_area) {
      meta.push(locale === "id" ? `Bidang: ${item.research_area}` : `Field: ${item.research_area}`)
    }
    const period = item.period_start && item.period_end
      ? `${item.period_start} – ${item.period_end}`
      : item.period_start || item.year
    if (period) meta.push(period)
    if (item.location) meta.push(item.location)
  }

  const details = locale === "id"
    ? item.responsibilities_id || item.responsibilities_en || item.contribution_id || item.contribution_en
    : item.responsibilities_en || item.contribution_en

  const allMedia = [...(item.gallery || []), ...(item.media || [])]
  const galleryImages = allMedia
    .filter((m) => m && m.url && !isPdf(m.url))
    .slice(0, 3)

  const pdfDocuments = [
    ...(item.documents || []),
    ...allMedia.filter((m) => m && m.url && isPdf(m.url)),
  ]

  const primaryDoc = item.document_url ||
    item.documents?.[0]?.url ||
    allMedia.find((m) => isPdf(m.url))?.url ||
    (isPdf(image) ? image : null)

  const displayImage = isPdf(image) ? null : image
  const categoryBadge = isEducation
    ? [item.degree, item.field_of_study].filter(Boolean).join(" • ")
    : (categoryLabels[locale][category] || category || item.field_of_study || "")

  const descriptionPoints = parseToPoints(description)

  return (
    <article className="group min-w-0 rounded-2xl border border-neutral-200 bg-white p-5 transition-all duration-300 hover:-translate-y-1 hover:border-primary-300 hover:shadow-[0_12px_32px_rgba(0,83,255,0.12)] sm:p-6">
      {displayImage && (
        <div className="mb-4 overflow-hidden rounded-xl border border-neutral-100 bg-neutral-50">
          <img
            src={displayImage}
            alt=""
            className="aspect-[4/3] w-full object-contain p-4 transition-transform duration-300 group-hover:scale-105 sm:p-6"
          />
        </div>
      )}
      {categoryBadge && (
        <span className="inline-block rounded-full bg-primary-50 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary-700">
          {categoryBadge}
        </span>
      )}
      <h2 className="mt-3 break-words text-xl font-bold leading-snug text-neutral-950 transition-colors group-hover:text-primary-700">
        {localizedTitle}
      </h2>
      {meta.length > 0 && (
        <div className="mt-2 space-y-0.5 text-xs font-medium text-neutral-500 sm:text-sm">
          {meta.map((value) => <p key={value}>{value}</p>)}
        </div>
      )}

      {/* Description rendered as points (1, 2, 3...) */}
      {descriptionPoints.length > 0 && (
        <ol className="mt-3 space-y-1.5 text-xs sm:text-sm text-neutral-600">
          {descriptionPoints.slice(0, 3).map((pt, i) => (
            <li key={i} className="line-clamp-2 flex items-start gap-2">
              <span className="font-bold text-primary-700 shrink-0">{i + 1}.</span>
              <span className="truncate">{pt}</span>
            </li>
          ))}
        </ol>
      )}

      <DetailDialog
        title={localizedTitle}
        description={[description, details].filter(Boolean).join("\n\n")}
        meta={meta}
        image={displayImage}
        images={galleryImages}
        documentUrl={primaryDoc && isPdf(primaryDoc) ? primaryDoc : undefined}
        documents={pdfDocuments}
        verificationUrl={item.verification_url}
        detailLabel={actionLabels[locale].details}
        documentLabel={actionLabels[locale].document}
        verificationLabel={actionLabels[locale].verification}
      >
        {item.technical_skills && item.technical_skills.length > 0 && (
          <div className="mt-4">
            <p className="text-xs font-bold uppercase tracking-wider text-neutral-500">
              {locale === "id" ? "Keahlian Teknis" : "Technical Skills"}
            </p>
            <p className="mt-1 text-sm text-neutral-800">{item.technical_skills.join(", ")}</p>
          </div>
        )}
      </DetailDialog>
    </article>
  )
}
