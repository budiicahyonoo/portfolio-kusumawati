"use client"

import { useMemo, useState } from "react"
import { DetailDialog } from "@/components/public/detail-dialog"
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
  const category = item.category || item.degree || item.field_of_study || ""
  const image = item.cover_image_url || item.logo_url || item.media?.[0]?.url
  const meta = [
    item.organization || item.issuer || item.degree,
    item.period_start && item.period_end ? `${item.period_start} – ${item.period_end}` : item.period_start || item.year,
    item.location,
  ].filter((value): value is string => Boolean(value))
  const details = locale === "id"
    ? item.responsibilities_id || item.responsibilities_en
    : item.responsibilities_en

  return (
    <article className="group min-w-0 rounded-2xl border border-neutral-200 bg-white p-5 transition-all duration-300 hover:-translate-y-1 hover:border-primary-300 hover:shadow-[0_12px_32px_rgba(0,83,255,0.12)] sm:p-6">
      {image && (
        <div className="mb-4 overflow-hidden rounded-xl border border-neutral-100 bg-neutral-50">
          <img
            src={image}
            alt=""
            className="aspect-[4/3] w-full object-contain p-4 transition-transform duration-300 group-hover:scale-105 sm:p-6"
          />
        </div>
      )}
      {category && (
        <span className="inline-block rounded-full bg-primary-50 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary-700">
          {categoryLabels[locale][category] || category}
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
      {description && <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-neutral-600">{description}</p>}
      <DetailDialog
        title={localizedTitle}
        description={[description, details].filter(Boolean).join("\n\n")}
        meta={meta}
        image={image}
        documentUrl={item.document_url || item.documents?.[0]?.url}
        verificationUrl={item.verification_url}
        detailLabel={actionLabels[locale].details}
        documentLabel={actionLabels[locale].document}
        verificationLabel={actionLabels[locale].verification}
      >
        {item.technical_skills && item.technical_skills.length > 0 && <p className="mt-4 text-sm text-neutral-700">{item.technical_skills.join(", ")}</p>}
        {item.media && item.media.length > 0 && <div className="mt-5 grid min-w-0 grid-cols-2 gap-3">{item.media.map((asset) => <img key={asset.id} src={asset.url} alt={asset.alt_text || ""} className="aspect-[4/3] w-full rounded-md object-cover" />)}</div>}
        {item.gallery?.map((asset) => <img key={asset.id} src={asset.url} alt={asset.alt_text || ""} className="mt-4 aspect-[4/3] w-full rounded-md object-cover" />)}
        {item.documents?.map((document) => <a key={document.id} className="mt-3 block min-h-11 py-2 text-sm font-medium text-primary-700 underline" href={document.url} target="_blank" rel="noreferrer">{locale === "id" ? document.label_id || document.label_en || "Buka dokumen" : document.label_en || "Open document"}</a>)}
      </DetailDialog>
    </article>
  )
}
