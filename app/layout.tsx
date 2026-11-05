import type React from "react"
import type { Metadata } from "next"
import { headers } from "next/headers"
import { Plus_Jakarta_Sans, Sora } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { Toaster } from "sonner"
import "./globals.css"

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-plus-jakarta-sans",
  display: "swap",
})

const sora = Sora({
  subsets: ["latin"],
  variable: "--font-display-sora",
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
})

export const metadata: Metadata = {
  title: "Kusumawati | Chemical Engineering Graduate",
  description:
    "Personal portfolio of Kusumawati — Chemical Engineering Graduate from University of Lampung. Experience in research, laboratory analysis, process engineering, and R&D at BRIN.",
  keywords: [
    "Kusumawati",
    "Chemical Engineering",
    "Chemical Engineer",
    "Research Assistant",
    "Laboratory Analyst",
    "BRIN",
    "University of Lampung",
    "Teknik Kimia",
    "Bandar Lampung",
    "Indonesia",
  ],
  authors: [{ name: "Kusumawati" }],
  creator: "Kusumawati",
  openGraph: {
    type: "website",
    locale: "en_US",
    title: "Kusumawati | Chemical Engineering Graduate",
    description:
      "Chemical Engineering graduate with experience in research, laboratory analysis, and industrial process engineering.",
    siteName: "Kusumawati Portfolio",
    images: [
      {
        url: "/kusumawati.png",
        width: 1200,
        height: 630,
        alt: "Kusumawati — Chemical Engineering Graduate",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Kusumawati | Chemical Engineering Graduate",
    description:
      "Chemical Engineering graduate with experience in research, laboratory analysis, and industrial process engineering.",
    images: ["/kusumawati.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const requestHeaders = await headers()
  const locale = requestHeaders.get("x-locale") === "id" ? "id" : "en"
  return (
    <html lang={locale} className="scroll-smooth">
      <body
        className={`${plusJakarta.variable} ${sora.variable} font-sans antialiased`}
      >
        {children}
        <Toaster position="top-right" richColors />
        <Analytics />
      </body>
    </html>
  )
}
