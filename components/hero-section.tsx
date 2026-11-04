"use client";

import { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Reveal } from "@/components/reveal";
import { Github, Linkedin, Mail, Twitter, AtSign, X, CheckCircle2, Code2, Sparkles } from "lucide-react";

interface HeroData {
  name: string;
  role: string;
  value_proposition: string;
  photo_url: string | null;
  email: string | null;
}

interface HeroSectionProps {
  data: HeroData;
}

const socials = [
  { href: "https://github.com/budiicahyonoo", icon: Github, label: "GitHub" },
  { href: "https://linkedin.com/in/budicahyono", icon: Linkedin, label: "LinkedIn" },
  { href: "mailto:budicahyono.dev@gmail.com", icon: Mail, label: "Email" },
  { href: "https://x.com/budigubernur15", icon: Twitter, label: "Twitter / X" },
  { href: "https://www.threads.com/@budii.cahyonoo", icon: AtSign, label: "Threads" },
];

// Dipakai kalau field Role di admin kosong
const DEFAULT_ROLES = ["Software Engineer", "Full Stack Developer", "AI Engineer"];

export function HeroSection({ data }: HeroSectionProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Role dari admin (pisahkan dengan koma), fallback ke default
  const roles = useMemo(() => {
    const custom = (data.role || "")
      .split(",")
      .map((r) => r.trim())
      .filter(Boolean);
    return custom.length > 0 ? custom : DEFAULT_ROLES;
  }, [data.role]);

  const [roleIndex, setRoleIndex] = useState(0);
  const [currentText, setCurrentText] = useState(roles[0]);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isReducedMotion, setIsReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mediaQuery.matches) {
      setIsReducedMotion(true);
      return;
    }

    const fullText = roles[roleIndex % roles.length];
    let timer: NodeJS.Timeout;

    if (!isDeleting && currentText === fullText) {
      timer = setTimeout(() => setIsDeleting(true), 1800);
    } else if (isDeleting && currentText === "") {
      setIsDeleting(false);
      setRoleIndex((prev) => (prev + 1) % roles.length);
    } else {
      const speed = isDeleting ? 40 : 70;
      timer = setTimeout(() => {
        setCurrentText((prev) =>
          isDeleting
            ? fullText.substring(0, prev.length - 1)
            : fullText.substring(0, prev.length + 1)
        );
      }, speed);
    }

    return () => clearTimeout(timer);
  }, [currentText, isDeleting, roleIndex, roles]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);
    formData.append("access_key", "8676cb06-6338-4dcf-b3ef-51026274f5dc");
    formData.append("subject", "🔥 New Hire Me Application from Portfolio");
    formData.append("redirect", "false");

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (result.success) {
        setIsSuccess(true);
        setTimeout(() => {
          setIsModalOpen(false);
          setIsSuccess(false);
        }, 3000);
      } else {
        alert("Failed to send message. Please try again.");
      }
    } catch (error) {
      alert("Network error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const defaultValProp = "Building scalable web & AI systems for businesses and campuses.";

  // Badge melayang di foto (maks 2 role pertama)
  const badgeA = roles[0];
  const badgeB = roles[1];

  return (
    <section id="home" className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 pt-24 pb-16 relative overflow-hidden bg-white text-slate-900">
      {/* Animasi badge melayang */}
      <style>{`
        @keyframes hero-float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
        .hero-float { animation: hero-float 4s ease-in-out infinite; }
        .hero-float-delay { animation: hero-float 4s ease-in-out 1.6s infinite; }
        @media (prefers-reduced-motion: reduce) {
          .hero-float, .hero-float-delay { animation: none; }
        }
      `}</style>

      <div className="max-w-7xl mx-auto w-full relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">

          <Reveal className="order-2 lg:order-1 relative z-10">
            <div className="space-y-6">

              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/80 shadow-sm">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span>Open to Work / Available for Freelance</span>
              </div>

              <div className="space-y-3">
                <h1 className="text-hero font-display text-slate-900 text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight">
                  I&apos;m <span className="text-blue-600">{data.name}</span>
                </h1>

                <div
                  className="h-10 sm:h-12 flex items-center text-2xl sm:text-3xl md:text-4xl font-semibold text-slate-600"
                  aria-label={roles.join(", ")}
                >
                  {isReducedMotion ? (
                    <span className="text-slate-600">{roles.join(" · ")}</span>
                  ) : (
                    <>
                      <span className="text-slate-700 font-bold">{currentText}</span>
                      <span className="text-blue-600 animate-pulse ml-1 font-mono font-bold">|</span>
                    </>
                  )}
                </div>
              </div>

              <p className="text-base sm:text-lg text-slate-600 max-w-lg leading-relaxed font-normal">
                {data.value_proposition || defaultValProp}
              </p>

              <div className="flex flex-wrap gap-3">
                {socials.map(({ href, icon: Icon, label }) => (
                  <Link
                    key={label}
                    href={href}
                    target={href.startsWith("mailto:") ? undefined : "_blank"}
                    aria-label={label}
                    title={label}
                    className="w-11 h-11 rounded-xl grid place-items-center text-blue-600 hover:text-blue-700 hover:scale-105 transition-all bg-slate-50 border border-slate-200 shadow-sm"
                  >
                    <Icon size={19} />
                  </Link>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row gap-4 pt-2">
                <Button
                  onClick={() => setIsModalOpen(true)}
                  size="lg"
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 rounded-xl shadow-lg shadow-blue-500/30 transition-all hover:scale-[1.02]"
                >
                  Hire me
                </Button>
                <Button asChild size="lg" variant="outline" className="text-blue-700 border-blue-200 font-semibold px-8 rounded-xl hover:bg-blue-50">
                  <Link href="/cv_budi cahyono_full stack developer.pdf" target="_blank" rel="noopener noreferrer">
                    Download CV
                  </Link>
                </Button>
              </div>
            </div>
          </Reveal>


          {/* ===== FOTO: POP-OUT CARD EFFECT ===== */}
          <Reveal className="order-1 lg:order-2" delay={120}>
            <div className="relative mx-auto lg:ml-auto lg:mr-0 w-full max-w-[300px] sm:max-w-[360px] lg:max-w-[420px] mt-4 lg:mt-0">

              {/* Glow lembut di belakang kartu */}
              <div className="absolute inset-x-6 bottom-0 h-[70%] rounded-[2rem] bg-blue-500/30 blur-3xl" aria-hidden="true" />

              {/* Kartu gradasi: tinggi = 72% dari tinggi foto */}
              <div
                className="absolute bottom-0 inset-x-0 h-[72%] rounded-[2rem] bg-gradient-to-br from-blue-600 via-blue-500 to-indigo-600 shadow-2xl shadow-blue-500/30 overflow-hidden ring-1 ring-white/20"
                aria-hidden="true"
              >
                <div className="absolute -top-16 -right-16 w-56 h-56 rounded-full bg-white/10" />
                <div className="absolute -bottom-20 -left-16 w-64 h-64 rounded-full bg-indigo-400/30" />
                <div className="absolute top-1/3 -left-8 w-24 h-24 rounded-full border-2 border-white/20" />
                <div
                  className="absolute inset-0 opacity-30"
                  style={{
                    backgroundImage: "radial-gradient(rgba(255,255,255,0.55) 1px, transparent 1px)",
                    backgroundSize: "18px 18px",
                    maskImage: "linear-gradient(to bottom right, black, transparent 70%)",
                    WebkitMaskImage: "linear-gradient(to bottom right, black, transparent 70%)",
                  }}
                />
              </div>

              {/* Foto: selebar kartu, tinggi mengikuti rasio asli (tidak gepeng).
                  Hanya sudut bawah yang dipotong mengikuti kartu, bagian atas bebas (pop-out). */}
              <div
                className="relative"
                style={{ clipPath: "inset(0 0 0 0 round 0 0 2rem 2rem)" }}
              >
                <Image
                  src={data.photo_url || "/portfoliostackplus.png"}
                  alt={`Photo of ${data.name}`}
                  width={0}
                  height={0}
                  sizes="(max-width: 640px) 300px, (max-width: 1024px) 360px, 420px"
                  style={{ width: "100%", height: "auto" }}
                  className="block drop-shadow-[0_20px_30px_rgba(15,23,42,0.35)]"
                  priority
                  unoptimized
                />
              </div>

              {/* Badge melayang */}
              {badgeA && (
                <div
                  className="hero-float absolute left-0 sm:-left-4 top-[34%] z-10 flex items-center gap-2 rounded-2xl bg-white/90 backdrop-blur-md border border-white shadow-xl shadow-slate-900/10 px-3 py-2 sm:px-3.5 sm:py-2.5"
                  aria-hidden="true"
                >
                  <span className="grid place-items-center w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-blue-50 text-blue-600">
                    <Code2 className="w-4 h-4" />
                  </span>
                  <span className="text-[11px] sm:text-xs font-bold text-slate-800 whitespace-nowrap">{badgeA}</span>
                </div>
              )}

              {badgeB && (
                <div
                  className="hero-float-delay absolute right-0 sm:-right-4 bottom-[16%] z-10 flex items-center gap-2 rounded-2xl bg-white/90 backdrop-blur-md border border-white shadow-xl shadow-slate-900/10 px-3 py-2 sm:px-3.5 sm:py-2.5"
                  aria-hidden="true"
                >
                  <span className="grid place-items-center w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-indigo-50 text-indigo-600">
                    <Sparkles className="w-4 h-4" />
                  </span>
                  <span className="text-[11px] sm:text-xs font-bold text-slate-800 whitespace-nowrap">{badgeB}</span>
                </div>
              )}
            </div>
          </Reveal>

        </div>
      </div>

      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md animate-in fade-in duration-200"
          role="dialog"
          aria-modal="true"
        >
          <div className="rounded-2xl w-full max-w-lg p-6 sm:p-8 relative bg-white border border-slate-200 shadow-2xl animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 w-8 h-8 grid place-items-center rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
              aria-label="Close"
            >
              <X size={20} />
            </button>

            {isSuccess ? (
              <div className="py-12 flex flex-col items-center justify-center text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-emerald-50 border border-emerald-100 grid place-items-center">
                  <CheckCircle2 className="w-8 h-8 text-emerald-500" />
                </div>
                <h3 className="font-display text-2xl font-bold text-slate-900">Message Sent!</h3>
                <p className="text-slate-500 text-sm">Thank you for reaching out. I will get back to you shortly via email.</p>
              </div>
            ) : (
              <>
                <h3 className="font-display text-2xl font-bold text-slate-900 mb-1">Let&apos;s Work Together</h3>
                <p className="text-sm text-slate-500 mb-6">Fill out the form below to discuss project opportunities or job roles.</p>

                <form onSubmit={handleSubmit} encType="multipart/form-data" className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700">Name / Company</label>
                    <input required type="text" name="name" className="w-full px-3.5 py-2 rounded-lg border border-slate-200 bg-slate-50 focus:ring-2 focus:ring-blue-500/40 focus:border-blue-400 outline-none text-sm transition-all" placeholder="e.g. John Doe from Tech Corp" />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700">Location</label>
                      <input required type="text" name="location" className="w-full px-3.5 py-2 rounded-lg border border-slate-200 bg-slate-50 focus:ring-2 focus:ring-blue-500/40 focus:border-blue-400 outline-none text-sm transition-all" placeholder="City, Country" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700">Position / Project</label>
                      <input required type="text" name="position" className="w-full px-3.5 py-2 rounded-lg border border-slate-200 bg-slate-50 focus:ring-2 focus:ring-blue-500/40 focus:border-blue-400 outline-none text-sm transition-all" placeholder="e.g. AI Engineer" />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700">Message / Details <span className="font-normal text-slate-400">(Optional)</span></label>
                    <textarea name="message" className="w-full px-3.5 py-2 rounded-lg border border-slate-200 bg-slate-50 focus:ring-2 focus:ring-blue-500/40 focus:border-blue-400 outline-none text-sm h-24 resize-none transition-all" placeholder="Share more details..." />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700">Relevant Link <span className="font-normal text-slate-400">(Optional)</span></label>
                    <input type="url" name="link" className="w-full px-3.5 py-2 rounded-lg border border-slate-200 bg-slate-50 focus:ring-2 focus:ring-blue-500/40 focus:border-blue-400 outline-none text-sm transition-all" placeholder="https://..." />
                  </div>

                  <div className="space-y-1 pb-2">
                    <label className="text-xs font-bold text-slate-700">Attachment <span className="font-normal text-slate-400">(Optional, Max 5MB)</span></label>
                    <input
                      type="file"
                      name="attachment"
                      accept=".pdf,.doc,.docx"
                      className="w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-600 hover:file:bg-blue-100 transition-all cursor-pointer"
                    />
                  </div>

                  <Button type="submit" disabled={isSubmitting} className="w-full bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-500/30 text-white rounded-xl py-6 font-semibold">
                    {isSubmitting ? "Sending..." : "Submit Application"}
                  </Button>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </section>
  );
}