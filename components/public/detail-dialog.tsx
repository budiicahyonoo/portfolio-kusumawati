"use client"

import type { ReactNode } from "react"
import * as Dialog from "@radix-ui/react-dialog"
import { ExternalLink, FileDown } from "lucide-react"

export function DetailDialog({
  title,
  description,
  meta,
  image,
  documentUrl,
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
  documentUrl?: string | null
  verificationUrl?: string | null
  children?: ReactNode
  detailLabel?: string
  documentLabel?: string
  verificationLabel?: string
}) {
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
          {image && <img src={image} alt="" className="mb-5 max-h-[360px] w-full rounded-lg object-cover" />}
          {description && <Dialog.Description className="whitespace-pre-line text-base leading-7 text-neutral-800">{description}</Dialog.Description>}
          {children}
          <div className="mt-6 flex flex-wrap gap-3">
            {documentUrl && <a className="btn-primary min-h-11 px-4" href={documentUrl} target="_blank" rel="noreferrer"><FileDown size={17} />{documentLabel || "Open or download"}</a>}
            {verificationUrl && <a className="btn-secondary min-h-11 px-4" href={verificationUrl} target="_blank" rel="noreferrer"><ExternalLink size={17} />{verificationLabel || "Verification link"}</a>}
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
