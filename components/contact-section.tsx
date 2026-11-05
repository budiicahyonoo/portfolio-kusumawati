"use client"

import { useState } from "react"
import { Mail, MessageSquare, Linkedin, MapPin, Send, CheckCircle2, AlertCircle } from "lucide-react"

interface ContactInfo {
  name?: string
  email?: string | null
  whatsapp?: string | null
  linkedin?: string | null
  location?: string | null
}

interface ContactSectionProps {
  contactInfo: ContactInfo
  locale?: "en" | "id"
}

type FormStatus = "idle" | "loading" | "success" | "error"
type ContactCard = {
  icon: typeof Mail
  label: string
  value: string
  href?: string
}

const LABELS = {
  en: {
    eyebrow: "GET IN TOUCH",
    title: "Contact",
    subtitle: "Have a question or want to connect? I'd love to hear from you.",
    nameLabel: "Full Name",
    emailLabel: "Email Address",
    subjectLabel: "Subject",
    messageLabel: "Message",
    sendBtn: "Send Message",
    sendingBtn: "Sending...",
    successMsg: "Message sent! I'll get back to you soon.",
    errorMsg: "Failed to send. Please try again.",
    emailCard: "Email",
    whatsappCard: "WhatsApp",
    linkedinCard: "LinkedIn",
    locationCard: "Location",
    namePlaceholder: "Your full name",
    emailPlaceholder: "your@email.com",
    subjectPlaceholder: "What is this about?",
    messagePlaceholder: "Your message...",
  },
  id: {
    eyebrow: "HUBUNGI SAYA",
    title: "Kontak",
    subtitle: "Ada pertanyaan atau ingin terhubung? Saya senang mendengar dari Anda.",
    nameLabel: "Nama Lengkap",
    emailLabel: "Alamat Email",
    subjectLabel: "Subjek",
    messageLabel: "Pesan",
    sendBtn: "Kirim Pesan",
    sendingBtn: "Mengirim...",
    successMsg: "Pesan terkirim! Saya akan segera membalas.",
    errorMsg: "Gagal mengirim. Silakan coba lagi.",
    emailCard: "Email",
    whatsappCard: "WhatsApp",
    linkedinCard: "LinkedIn",
    locationCard: "Lokasi",
    namePlaceholder: "Nama lengkap Anda",
    emailPlaceholder: "email@anda.com",
    subjectPlaceholder: "Tentang apa?",
    messagePlaceholder: "Pesan Anda...",
  },
}

export function ContactSection({ contactInfo, locale = "en" }: ContactSectionProps) {
  const L = LABELS[locale]
  const [status, setStatus] = useState<FormStatus>("idle")
  const [errorMsg, setErrorMsg] = useState("")

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setStatus("loading")
    setErrorMsg("")

    const form = e.currentTarget
    const data = {
      name: (form.elements.namedItem("name") as HTMLInputElement).value,
      email: (form.elements.namedItem("email") as HTMLInputElement).value,
      subject: (form.elements.namedItem("subject") as HTMLInputElement).value,
      message: (form.elements.namedItem("message") as HTMLTextAreaElement).value,
    }

    try {
      const res = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })
      const json = await res.json()
      if (!res.ok) {
        setErrorMsg(json.error || L.errorMsg)
        setStatus("error")
      } else {
        setStatus("success")
        form.reset()
      }
    } catch {
      setErrorMsg(L.errorMsg)
      setStatus("error")
    }
  }

  const contacts: ContactCard[] = [
    ...(contactInfo.email ? [{
      icon: Mail,
      label: L.emailCard,
      value: contactInfo.email,
      href: `mailto:${contactInfo.email}`,
    }] : []),
    ...(contactInfo.whatsapp ? [{
      icon: MessageSquare,
      label: L.whatsappCard,
      value: contactInfo.whatsapp,
      href: `https://wa.me/${contactInfo.whatsapp.replace(/\D/g, "")}`,
    }] : []),
    ...(contactInfo.linkedin ? [{
      icon: Linkedin,
      label: L.linkedinCard,
      value: "LinkedIn Profile",
      href: contactInfo.linkedin,
    }] : []),
    ...(contactInfo.location ? [{
      icon: MapPin,
      label: L.locationCard,
      value: contactInfo.location,
    }] : []),
  ]

  return (
    <section id="contact" className="py-20 bg-neutral-50">
      <div className="max-w-6xl mx-auto px-5 lg:px-10">
        {/* Header */}
        <div className="text-center mb-12">
          <p className="section-eyebrow mb-2">{L.eyebrow}</p>
          <h2 className="text-4xl font-bold text-neutral-950 mb-3">{L.title}</h2>
          <p className="text-neutral-600 max-w-xl mx-auto">{L.subtitle}</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-10 items-start">
          {/* Contact info cards */}
          <div className="space-y-4">
            {contacts.map((c) => (
              <div
                key={c.label}
                className="flex items-center gap-4 p-4 bg-white rounded-xl border border-neutral-200 card-hover"
              >
                <div className="w-10 h-10 rounded-lg bg-primary-100 flex items-center justify-center shrink-0">
                  <c.icon size={18} className="text-primary-700" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wide">{c.label}</p>
                  {c.href ? (
                    <a
                      href={c.href}
                      target={c.href.startsWith("mailto") ? undefined : "_blank"}
                      rel="noopener noreferrer"
                      className="text-sm font-medium text-neutral-800 hover:text-primary-700 transition-colors"
                    >
                      {c.value}
                    </a>
                  ) : (
                    <p className="text-sm font-medium text-neutral-800">{c.value}</p>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Contact form */}
          <div className="bg-white rounded-2xl border border-neutral-200 p-6 shadow-sm">
            {status === "success" ? (
              <div className="py-12 flex flex-col items-center text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-success/10 flex items-center justify-center">
                  <CheckCircle2 size={32} className="text-success" />
                </div>
                <h3 className="font-bold text-xl text-neutral-900">Message Sent!</h3>
                <p className="text-neutral-500 text-sm">{L.successMsg}</p>
                <button
                  onClick={() => setStatus("idle")}
                  className="text-sm text-primary-700 hover:underline"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-semibold text-neutral-700 mb-1">
                    {L.nameLabel} <span className="text-danger">*</span>
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    maxLength={100}
                    placeholder={L.namePlaceholder}
                    className="w-full h-11 px-3 rounded-[10px] border border-neutral-300 text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:border-primary-600 focus:ring-2 focus:ring-primary-600/20 transition-all"
                    disabled={status === "loading"}
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-semibold text-neutral-700 mb-1">
                    {L.emailLabel} <span className="text-danger">*</span>
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    placeholder={L.emailPlaceholder}
                    className="w-full h-11 px-3 rounded-[10px] border border-neutral-300 text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:border-primary-600 focus:ring-2 focus:ring-primary-600/20 transition-all"
                    disabled={status === "loading"}
                  />
                </div>
                <div>
                  <label htmlFor="subject" className="block text-sm font-semibold text-neutral-700 mb-1">
                    {L.subjectLabel} <span className="text-danger">*</span>
                  </label>
                  <input
                    id="subject"
                    name="subject"
                    type="text"
                    required
                    maxLength={200}
                    placeholder={L.subjectPlaceholder}
                    className="w-full h-11 px-3 rounded-[10px] border border-neutral-300 text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:border-primary-600 focus:ring-2 focus:ring-primary-600/20 transition-all"
                    disabled={status === "loading"}
                  />
                </div>
                <div>
                  <label htmlFor="message" className="block text-sm font-semibold text-neutral-700 mb-1">
                    {L.messageLabel} <span className="text-danger">*</span>
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    maxLength={2000}
                    rows={5}
                    placeholder={L.messagePlaceholder}
                    className="w-full px-3 py-2.5 rounded-[10px] border border-neutral-300 text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:border-primary-600 focus:ring-2 focus:ring-primary-600/20 transition-all resize-none min-h-[120px]"
                    disabled={status === "loading"}
                  />
                </div>

                {status === "error" && (
                  <div className="flex items-center gap-2 p-3 rounded-lg bg-danger/10 text-danger text-sm">
                    <AlertCircle size={16} />
                    {errorMsg || L.errorMsg}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="w-full h-11 flex items-center justify-center gap-2 bg-primary-700 text-white font-semibold text-sm rounded-xl hover:bg-primary-800 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {status === "loading" ? (
                    <>
                      <span className="animate-spin h-4 w-4 border-2 border-white/40 border-t-white rounded-full" />
                      {L.sendingBtn}
                    </>
                  ) : (
                    <>
                      <Send size={15} />
                      {L.sendBtn}
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
