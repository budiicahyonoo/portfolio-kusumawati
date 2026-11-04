"use client"

import Link from "next/link"
import { Menu, X } from "lucide-react"
import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [activeSection, setActiveSection] = useState("HOME")
  const [scrolled, setScrolled] = useState(false)

  const navItems = [
    { name: "HOME", href: "#home" },
    { name: "SKILLS", href: "#skills" },
    { name: "PROJECTS", href: "#projects" },
    { name: "EXPERIENCE", href: "#experience" },
    { name: "BLOG", href: "#blog" },
    { name: "CONTACT", href: "#contact" },
  ]

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 24)

      const sections = navItems.map(item => item.name.toLowerCase())
      const scrollPosition = window.scrollY + 120

      for (const section of sections) {
        const element = document.getElementById(section)
        if (
          element && 
          element.offsetTop <= scrollPosition && 
          element.offsetTop + element.offsetHeight > scrollPosition
        ) {
          setActiveSection(section.toUpperCase())
        }
      }
    }

    handleScroll()
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <nav
      className={cn(
        "fixed top-0 w-full z-50 border-b transition-all duration-500",
        scrolled
          ? "border-slate-200/80 py-0 backdrop-blur-md bg-white/85 shadow-sm"
          : "border-transparent bg-transparent"
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 sm:h-18">

          <div className="hidden md:flex flex-1 justify-center">
            <div className="flex items-center rounded-full p-1.5 gap-1 bg-slate-100/90 border border-slate-200/80 shadow-inner">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setActiveSection(item.name)}
                  className={cn(
                    "px-4 py-1.5 rounded-full text-xs font-bold transition-all duration-300 tracking-wider",
                    activeSection === item.name
                      ? "text-white shadow-md bg-blue-600"
                      : "text-slate-600 hover:text-blue-600 hover:bg-white/80"
                  )}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>

          <button
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
            className="md:hidden ml-auto w-10 h-10 rounded-full grid place-items-center text-blue-700 bg-slate-100 border border-slate-200 active:scale-95 transition-transform"
          >
            {isOpen ? <X size={20} /> : <Menu size={20} />}
          </button>

        </div>

        {isOpen && (
          <div className="md:hidden pb-6 pt-2 animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="flex flex-col gap-1.5 rounded-2xl p-4 bg-white border border-slate-200 shadow-xl">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "text-xs font-bold px-4 py-3 rounded-xl transition-all tracking-wider",
                    activeSection === item.name
                      ? "bg-blue-600 text-white shadow-md"
                      : "text-slate-600 hover:bg-slate-100 hover:text-blue-600"
                  )}
                  onClick={() => {
                    setActiveSection(item.name)
                    setIsOpen(false)
                  }}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}