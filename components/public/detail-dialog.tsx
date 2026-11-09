"use client"

import { useEffect, useMemo, useState } from "react"
import type { ReactNode } from "react"
import * as Dialog from "@radix-ui/react-dialog"
import { ExternalLink, FileDown } from "lucide-react"

export function parseToPoints(text?: string | null): string[] {
  if (!text || typeof text !== "string") return []
  const raw = text.trim()
  if (!raw) return []

  // Check if text already has multiple lines
  const lines = raw.split(/\r?\n/).map((l) => l.trim()).filter(Boolean)
  if (lines.length > 1) {
    return lines.map((line) => line.replace(/^(\d+[\.\)]|[-•*–—])\s*/, "").trim()).filter(Boolean)
  }

  // If single line / paragraph, check for numbered patterns e.g. "1. xxx 2. yyy"
  if (/(?:^|\s)(?:[1-9]\.|\d+\))\s+/.test(raw)) {
    const parts = raw.split(/(?:^|\s)(?:[1-9]\.|\d+\))\s+/).map((p) => p.trim()).filter(Boolean)
    if (parts.length > 1) return parts
  }

  // Check for bullet symbols
  if (/[•*–—]/.test(raw)) {
    const parts = raw.split(/[•*–—]/).map((p) => p.trim()).filter(Boolean)
    if (parts.length > 1) return parts
  }

  // Split by full sentences (ending with . ! ?) that are followed by capital letter or number
  const sentences = raw
    .split(/(?<=[.!?])\s+(?=[A-Z0-9\u00C0-\u024F])/)
    .map((s) => s.trim())
    .filter((s) => s.length > 2)

  if (sentences.length > 1) {
    return sentences
  }

  return [raw.replace(/^(\d+[\.\)]|[-•*–—])\s*/, "").trim()]
}

export function LandscapeCarousel({
  images,
}: {
  images: Array<{ id?: string; url: string; alt_text?: string | null }>
}) {
  const [index, setIndex] = useState(0)
  const items = useMemo(() => images.slice(0, 3), [images])

  useEffect(() => {
    if (items.length <= 1) return
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % items.length)
    }, 1500)
    return () => clearInterval(interval)
  }, [items.length])

  if (items.length === 0) return null

  return (
    <div className="relative mb-6 overflow-hidden rounded-xl border border-neutral-200 bg-neutral-900 shadow-sm">
      <div className="relative aspect-[16/9] w-full overflow-hidden">
        {items.map((item, idx) => (
          <div
            key={item.id || item.url || idx}
            className={`absolute inset-0 transition-opacity duration-500 ease-in-out ${
              idx === index ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"
            }`}
          >
            <img
              src={item.url}
              alt={item.alt_text || `Slide ${idx + 1}`}
              className="h-full w-full object-cover"
            />
          </div>
        ))}
      </div>

      {items.length > 1 && (
        <div className="absolute bottom-3 left-0 right-0 z-20 flex justify-center gap-1.5">
          {items.map((_, idx) => (
            <button
              key={idx}
              type="button"
              aria-label={`Go to slide ${idx + 1}`}
              onClick={() => setIndex(idx)}
              className={`h-2 rounded-full transition-all duration-300 ${
                idx === index ? "w-6 bg-white shadow-sm" : "w-2 bg-white/60 hover:bg-white/90"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export function DetailDialog({
  title,
  description,
  meta,
  image,
  images = [],
  documentUrl,
  documents = [],
  verificationUrl,
  children,
  detailLabel,
  documentLabel,
  verificationLabel,
}: {
  title: string
  description?: string | null
  meta?: string[]
  image?: string | null
  images?: Array<{ id?: string; url: string; alt_text?: string | null }>
  documentUrl?: string | null
  documents?: Array<{ id?: string; url: string; alt_text?: string | null }>
  verificationUrl?: string | null
  children?: ReactNode
  detailLabel?: string
  documentLabel?: string
  verificationLabel?: string
}) {
  const points = useMemo(() => parseToPoints(description), [description])

  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <button type="button" className="mt-4 min-h-11 text-sm font-semibold text-primary-700 underline decoration-primary-300 underline-offset-4 hover:text-primary-900">
          {detailLabel || "View details"}
        </button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-primary-950/50 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=open]:fade-in data-[state=closed]:fade-out" />
        <Dialog.Content className="fixed left-1/2 top-1/2 z-50 max-h-[90dvh] w-[calc(100%-24px)] max-w-[760px] -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-xl border border-neutral-200 bg-white p-5 shadow-lg focus:outline-none sm:rounded-2xl sm:p-8">
          <div className="mb-6 flex items-start justify-between gap-5">
            <div className="min-w-0">
              <Dialog.Title className="break-words text-xl font-bold text-primary-950 sm:text-2xl">{title}</Dialog.Title>
              {meta && <div className="mt-2 space-y-1 text-sm text-neutral-700">{meta.filter(Boolean).map((value) => <p key={value}>{value}</p>)}</div>}
            </div>
            <Dialog.Close asChild>
              <button type="button" aria-label="Close details" className="grid min-h-11 min-w-11 shrink-0 place-items-center rounded-md border border-primary-700 text-xl leading-none text-primary-700 hover:bg-primary-50">×</button>
            </Dialog.Close>
          </div>

          {/* Logo container: properly sized like preview, not full-width giant image */}
          {image && (
            <div className="mb-6 flex items-center justify-center overflow-hidden rounded-xl border border-neutral-100 bg-neutral-50 p-4 sm:p-6">
              <img
                src={image}
                alt=""
                className="max-h-28 w-auto max-w-[200px] object-contain sm:max-h-36 sm:max-w-[240px]"
              />
            </div>
          )}

          {/* Landscape Carousel: max 3 images, 1.5s auto-slide */}
          {images.length > 0 && <LandscapeCarousel images={images} />}

          {/* Explanation / Description formatted per point (1, 2, 3...) */}
          {points.length > 0 && (
            <div className="mb-6 space-y-3">
              <ol className="space-y-3">
                {points.map((point, index) => (
                  <li key={index} className="flex items-start gap-3 text-sm leading-relaxed text-neutral-800 sm:text-base">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary-700 text-xs font-bold text-white shadow-xs">
                      {index + 1}
                    </span>
                    <span className="pt-0.5">{point}</span>
                  </li>
                ))}
              </ol>
            </div>
          )}

          {children}

          {/* Documents / PDFs rendered as buttons */}
          {(documentUrl || documents.length > 0 || verificationUrl) && (
            <div className="mt-6 flex flex-wrap gap-3">
              {documentUrl && (
                <a className="btn-primary min-h-11 px-4" href={documentUrl} target="_blank" rel="noreferrer">
                  <FileDown size={17} />{documentLabel || "Open or download"}
                </a>
              )}
              {documents.map((doc, idx) => (
                <a
                  key={doc.id || doc.url || idx}
                  className="btn-primary min-h-11 px-4"
                  href={doc.url}
                  target="_blank"
                  rel="noreferrer"
                >
                  <FileDown size={17} />
                  {doc.alt_text || documentLabel || "Open or download (PDF)"}
                </a>
              ))}
              {verificationUrl && (
                <a className="btn-secondary min-h-11 px-4" href={verificationUrl} target="_blank" rel="noreferrer">
                  <ExternalLink size={17} />{verificationLabel || "Verification link"}
                </a>
              )}
            </div>
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
