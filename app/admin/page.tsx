"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Menu,
  X,
  Briefcase,
  FolderGit2,
  FileText,
  Home as HomeIcon,
  Wrench,
  Mail,
  ExternalLink,
  LayoutDashboard,
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

import { HomeTab } from "@/components/admin/home-tab";
import { SkillsTab } from "@/components/admin/skills-tab";
import { ProjectsTab } from "@/components/admin/projects-tab";
import { ExperienceTab } from "@/components/admin/experience-tab";
import { BlogTab } from "@/components/admin/blog-tab";
import { ContactTab } from "@/components/admin/contact-tab";

type TabId = "home" | "skills" | "projects" | "experience" | "blog" | "contact";

const STORAGE_KEY = "admin-active-tab";

const tabs: { id: TabId; label: string; icon: React.ReactNode }[] = [
  { id: "home", label: "Home", icon: <HomeIcon className="w-4 h-4" /> },
  { id: "skills", label: "Skills", icon: <Wrench className="w-4 h-4" /> },
  { id: "projects", label: "Projects", icon: <FolderGit2 className="w-4 h-4" /> },
  { id: "experience", label: "Experience", icon: <Briefcase className="w-4 h-4" /> },
  { id: "blog", label: "Blog", icon: <FileText className="w-4 h-4" /> },
  { id: "contact", label: "Contact", icon: <Mail className="w-4 h-4" /> },
];

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<TabId>("home");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Ingat tab terakhir supaya setelah refresh tidak balik ke Home
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY) as TabId | null;
      if (saved && tabs.some((t) => t.id === saved)) setActiveTab(saved);
    } catch {
      /* abaikan jika storage tidak tersedia */
    }
  }, []);

  const changeTab = (id: TabId) => {
    setActiveTab(id);
    setIsMobileMenuOpen(false);
    try {
      localStorage.setItem(STORAGE_KEY, id);
    } catch {
      /* abaikan */
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const current = tabs.find((t) => t.id === activeTab)!;

  return (
    <div className="min-h-screen bg-slate-50/50">
      <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200/60 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 sm:h-20 gap-3">

            {/* KIRI - Nama panel */}
            <div className="flex-1 flex justify-start items-center gap-2.5 min-w-0">
              <Link href="/admin" className="flex items-center gap-2.5 min-w-0">
                <span className="grid place-items-center w-9 h-9 rounded-xl bg-blue-600 text-white shadow-md shadow-blue-500/30 shrink-0">
                  <LayoutDashboard className="w-4.5 h-4.5" />
                </span>
                <span className="font-bold text-slate-900 text-sm sm:text-base truncate">
                  Admin Panel
                </span>
              </Link>
              <span className="px-2 py-0.5 bg-blue-50 text-blue-600 text-[10px] font-bold rounded-full hidden sm:inline-block">
                CMS
              </span>
            </div>

            {/* TENGAH - Pill menu (desktop lebar) */}
            <div className="hidden lg:flex justify-center">
              <div className="flex items-center bg-slate-100 border border-slate-200/60 rounded-full p-1.5 shadow-sm">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => changeTab(tab.id)}
                    className={cn(
                      "flex items-center gap-2 px-4 xl:px-5 py-2 rounded-full text-xs font-semibold transition-all duration-300",
                      activeTab === tab.id
                        ? "bg-blue-600 text-white shadow-md"
                        : "text-slate-500 hover:text-slate-900"
                    )}
                  >
                    {tab.icon} {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* KANAN - Aksi */}
            <div className="flex-1 flex justify-end items-center gap-2 sm:gap-3">
              <Button
                asChild
                variant="outline"
                size="sm"
                className="hidden sm:inline-flex border-slate-200 hover:bg-slate-50 text-slate-700"
              >
                <Link href="/" target="_blank">
                  <ExternalLink className="w-3.5 h-3.5 mr-1.5" />
                  Lihat Live Web
                </Link>
              </Button>

              {/* Tombol menu (di bawah lg) menampilkan tab yang sedang aktif */}
              <button
                type="button"
                aria-label="Buka menu"
                aria-expanded={isMobileMenuOpen}
                onClick={() => setIsMobileMenuOpen((v) => !v)}
                className="lg:hidden inline-flex items-center gap-2 pl-3 pr-2.5 h-10 rounded-full bg-slate-100 border border-slate-200 text-slate-700 text-xs font-bold active:scale-95 transition-transform"
              >
                <span className="text-blue-600">{current.icon}</span>
                <span className="hidden xs:inline sm:inline">{current.label}</span>
                {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            </div>

          </div>
        </div>

        {/* Menu mobile / tablet */}
        {isMobileMenuOpen && (
          <div className="lg:hidden pb-4 px-4 sm:px-6 pt-1 animate-in slide-in-from-top-2 duration-200">
            <div className="flex flex-col gap-1.5 bg-slate-50 rounded-2xl p-3 border border-slate-200">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => changeTab(tab.id)}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all",
                    activeTab === tab.id
                      ? "bg-blue-600 text-white shadow-md"
                      : "text-slate-600 hover:bg-slate-100"
                  )}
                >
                  {tab.icon} {tab.label}
                </button>
              ))}

              <div className="h-px bg-slate-200 my-1 sm:hidden" />

              <Link
                href="/"
                target="_blank"
                onClick={() => setIsMobileMenuOpen(false)}
                className="sm:hidden flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-100 transition-all"
              >
                <ExternalLink className="w-4 h-4" /> Lihat Live Web
              </Link>
            </div>
          </div>
        )}
      </nav>

      <main className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        <header className="mb-6 flex items-center gap-2.5">
          <span className="grid place-items-center w-8 h-8 rounded-lg bg-blue-50 text-blue-600">
            {current.icon}
          </span>
          <div>
            <h1 className="text-lg sm:text-xl font-bold text-slate-900 leading-tight">
              {current.label}
            </h1>
            <p className="text-xs text-slate-400">Kelola konten bagian {current.label} di website.</p>
          </div>
        </header>

        {activeTab === "home" && <HomeTab />}
        {activeTab === "skills" && <SkillsTab />}
        {activeTab === "projects" && <ProjectsTab />}
        {activeTab === "experience" && <ExperienceTab />}
        {activeTab === "blog" && <BlogTab />}
        {activeTab === "contact" && <ContactTab />}
      </main>
    </div>
  );
}