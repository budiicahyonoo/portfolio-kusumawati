import type React from "react"
import type { Metadata } from "next"
import { Sora, Plus_Jakarta_Sans } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { Toaster } from "sonner"
import "./globals.css"

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-plus-jakarta-sans",
})

const sora = Sora({
  subsets: ["latin"],
  variable: "--font-display-sora",
  weight: ["400", "500", "600", "700", "800"],
})

export const metadata: Metadata = {
  metadataBase: new URL("https://budicahyono.my.id"),
  title: "Budi Cahyono | Software Engineer, Full Stack Developer & AI Engineer",
  description:
    "Portfolio resmi Budi Cahyono — Software Engineer, Full Stack Developer, dan AI Engineer. Spesialisasi dalam pengembangan aplikasi web scalable, integrasi Generative AI, RAG pipeline, dan arsitektur Agentic AI.",
  keywords: [
    "Budi Cahyono",
    "Software Engineer",
    "Full Stack Developer",
    "AI Engineer",
    "React",
    "Next.js",
    "Python",
    "PyTorch",
    "RAG Pipeline",
    "Agentic AI",
    "Jakarta",
    "Indonesia"
  ],
  authors: [{ name: "Budi Cahyono", url: "https://budicahyono.my.id" }],
  creator: "Budi Cahyono",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://budicahyono.my.id",
    title: "Budi Cahyono | Software Engineer & AI Engineer",
    description: "Membangun sistem web & AI yang scalable untuk bisnis dan kampus.",
    siteName: "Budi Cahyono Portfolio",
    images: [
      {
        url: "/portfoliostackplus.png",
        width: 1200,
        height: 630,
        alt: "Budi Cahyono Portfolio Preview",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Budi Cahyono | Software Engineer & AI Engineer",
    description: "Membangun sistem web & AI yang scalable untuk bisnis dan kampus.",
    creator: "@budigubernur15",
    images: ["/portfoliostackplus.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`${plusJakarta.variable} ${sora.variable} font-sans antialiased flex flex-col min-h-screen bg-white text-slate-900`}
      >
        <main className="flex-grow">
          {children}
        </main>
        
        <Toaster position="top-center" richColors />
        <Analytics />
      </body>
    </html>
  )
}