"use client"

import { useState } from "react"
import type { FormEvent } from "react"

export function ContactForm({ locale }: { locale: "en" | "id" }) {
  const [state, setState] = useState<"idle" | "sending" | "success" | "error">("idle")
  const [error, setError] = useState("")
  const english = locale === "en"

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setState("sending")
    setError("")
    const form = event.currentTarget
    const values = new FormData(form)
    try {
      const response = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(Object.fromEntries(values.entries())),
      })
      const result = await response.json()
      if (!response.ok) throw new Error(result.error || (english ? "Message could not be sent." : "Pesan tidak dapat dikirim."))
      form.reset()
      setState("success")
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : (english ? "Please try again." : "Silakan coba lagi."))
      setState("error")
    }
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      <label className="block text-sm font-medium">{english ? "Name" : "Nama"}
        <input required name="name" maxLength={100} autoComplete="name" className="mt-1.5 min-h-11 w-full rounded-md border border-neutral-300 px-3 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600" />
      </label>
      <label className="block text-sm font-medium">{english ? "Email" : "Email"}
        <input required type="email" name="email" maxLength={254} autoComplete="email" className="mt-1.5 min-h-11 w-full rounded-md border border-neutral-300 px-3 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600" />
      </label>
      <label className="block text-sm font-medium">{english ? "Subject" : "Subjek"}
        <input required name="subject" maxLength={200} className="mt-1.5 min-h-11 w-full rounded-md border border-neutral-300 px-3 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600" />
      </label>
      <label className="block text-sm font-medium">{english ? "Message" : "Pesan"}
        <textarea required name="message" maxLength={2000} rows={5} className="mt-1.5 w-full resize-y rounded-md border border-neutral-300 px-3 py-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600" />
      </label>
      <div className="sr-only" aria-hidden="true">
        <label>Leave this field empty<input tabIndex={-1} autoComplete="off" name="website" /></label>
      </div>
      <button disabled={state === "sending"} className="btn-primary min-h-12 w-full sm:w-auto">
        {state === "sending" ? (english ? "Sending…" : "Mengirim…") : (english ? "Send message" : "Kirim pesan")}
      </button>
      <p className="min-h-6 text-sm" role="status" aria-live="polite">
        {state === "success" ? (english ? "Thank you. Your message has been received." : "Terima kasih. Pesan Anda telah diterima.") : null}
        {state === "error" ? error : null}
      </p>
    </form>
  )
}
