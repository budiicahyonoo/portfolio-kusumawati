"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import {
  ExternalLink,
  Github,
  Lock,
  X,
  BarChart3,
  Tag,
  Layers,
  ChevronLeft,
  ChevronRight,
  ImageIcon,
  CheckCircle2,
} from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Reveal } from "@/components/reveal"

interface Project {
  id: string
  title: string
  description: string
  category: string
  thumbnail_url?: string | null
  image_url?: string | null
  demo_url?: string | null
  project_url?: string | null
  view_url?: string | null
  github_url?: string | null
  technologies: string[] | string
  achievements?: string[]
  work_photos?: string[]
  role?: string | null
  metric?: string | null
}

interface ProjectsSectionProps {
  projects: Project[]
}

// Slider foto di dalam popup
const ImageSlider = ({ photos, alt }: { photos: string[]; alt: string }) => {
  const [currentIndex, setCurrentIndex] = useState(0)

  if (!photos || photos.length === 0) {
    return (
      <div className="w-full aspect-video bg-slate-50 flex items-center justify-center border-b border-slate-100">
        <ImageIcon className="w-12 h-12 text-slate-300" />
      </div>
    )
  }

  return (
    <div className="relative w-full aspect-video bg-slate-900 overflow-hidden group">
      <img
        src={photos[currentIndex]}
        alt={`${alt} - foto ${currentIndex + 1}`}
        className="w-full h-full object-cover transition-opacity duration-500"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 via-transparent to-transparent pointer-events-none" />

      {photos.length > 1 && (
        <>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              setCurrentIndex((prev) => (prev === 0 ? photos.length - 1 : prev - 1))
            }}
            className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/80 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-all backdrop-blur-sm"
            aria-label="Foto sebelumnya"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              setCurrentIndex((prev) => (prev === photos.length - 1 ? 0 : prev + 1))
            }}
            className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/80 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-all backdrop-blur-sm"
            aria-label="Foto berikutnya"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
            {photos.map((_, i) => (
              <button
                type="button"
                key={i}
                onClick={(e) => {
                  e.stopPropagation()
                  setCurrentIndex(i)
                }}
                aria-label={`Ke foto ${i + 1}`}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i === currentIndex ? "w-5 bg-white" : "w-1.5 bg-white/50"
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  )
}

export function ProjectsSection({ projects }: ProjectsSectionProps) {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const categories = ["AI", "WEB", "APPS"]

  // Kunci scroll halaman saat popup terbuka
  useEffect(() => {
    document.body.style.overflow = selectedProject ? "hidden" : "unset"
    return () => {
      document.body.style.overflow = "unset"
    }
  }, [selectedProject])

  // Tutup popup dengan tombol Escape
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelectedProject(null)
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [])

  const getTechArray = (tech: string[] | string | undefined | null): string[] => {
    if (Array.isArray(tech)) return tech
    if (typeof tech === "string" && tech) {
      return tech.split(",").map((t) => t.trim()).filter(Boolean)
    }
    return []
  }

  // Galeri = thumbnail di depan + foto tambahan (tanpa duplikat)
  const getGallery = (p: Project): string[] => {
    const list = [p.thumbnail_url || p.image_url, ...(p.work_photos ?? [])].filter(Boolean) as string[]
    return Array.from(new Set(list))
  }

  return (
    <section id="projects" className="py-24 px-4 sm:px-6 lg:px-8 relative bg-white text-slate-900">
      <div className="max-w-7xl mx-auto">
        <Reveal className="text-center mb-16">
          <div>
            <h2 className="font-display text-4xl sm:text-5xl font-bold mb-4 text-slate-900">
              Featured <span className="text-blue-600">Projects</span>
            </h2>
            <p className="text-lg text-slate-500 max-w-2xl mx-auto">
              Showcasing innovative AI, software engineering, and web development solutions
            </p>
          </div>
        </Reveal>

        <Tabs defaultValue="AI" className="w-full">
          <div className="flex justify-center mb-12">
            <TabsList className="inline-flex h-auto items-center rounded-full p-1.5 bg-slate-100 border border-slate-200">
              {categories.map((category) => (
                <TabsTrigger
                  key={category}
                  value={category}
                  className="px-6 py-2 rounded-full text-sm font-semibold transition-all duration-300 data-[state=active]:!bg-blue-600 data-[state=active]:!text-white data-[state=active]:!shadow-md text-slate-600 hover:text-blue-600"
                >
                  {category}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          {categories.map((category) => {
            const categoryProjects = projects.filter(
              (p) => p.category.toUpperCase() === category.toUpperCase()
            )

            return (
              <TabsContent key={category} value={category}>
                {categoryProjects.length === 0 ? (
                  <div className="text-center py-12 text-slate-400 text-sm">
                    No projects found in this category.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {categoryProjects.map((project, i) => {
                      const imageSrc = project.thumbnail_url || project.image_url || "/budiicahyonoo.png"
                      const demoLink = project.demo_url || project.project_url
                      const codeLink = project.view_url || project.github_url
                      const techList = getTechArray(project.technologies)
                      const galleryCount = getGallery(project).length

                      return (
                        <div
                          key={project.id}
                          className="stagger-item"
                          style={{ animationDelay: `${i * 90}ms`, height: "100%" }}
                        >
                          <article
                            onClick={() => setSelectedProject(project)}
                            className="lift-hover group h-full flex flex-col rounded-2xl overflow-hidden bg-white text-slate-900 border border-slate-200/80 shadow-sm hover:border-blue-400 hover:shadow-lg transition-all cursor-pointer"
                          >
                            {/* Image */}
                            <div className="relative h-48 overflow-hidden bg-slate-100">
                              <Image
                                src={imageSrc}
                                alt={project.title}
                                fill
                                className="object-cover group-hover:scale-105 transition-transform duration-500"
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent" />

                              {project.role && (
                                <div className="absolute top-3 left-3 bg-slate-900/80 backdrop-blur-md text-white text-[11px] font-semibold px-2.5 py-1 rounded-full border border-white/20">
                                  {project.role}
                                </div>
                              )}

                              {galleryCount > 1 && (
                                <div className="absolute top-3 right-3 inline-flex items-center gap-1 bg-black/50 backdrop-blur-md text-white text-[11px] font-semibold px-2 py-1 rounded-full">
                                  <Layers className="w-3 h-3" />
                                  {galleryCount}
                                </div>
                              )}
                            </div>

                            {/* Body */}
                            <div className="p-5 flex flex-col flex-1 gap-3">
                              <div>
                                <h3 className="font-display font-bold text-lg text-slate-900 group-hover:text-blue-600 transition-colors">
                                  {project.title}
                                </h3>
                                <p className="text-sm text-slate-600 line-clamp-2 mt-1 leading-relaxed">
                                  {project.description}
                                </p>
                              </div>

                              {project.metric && (
                                <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-700 bg-blue-50 border border-blue-100 px-3 py-1.5 rounded-lg truncate">
                                  <BarChart3 className="w-3.5 h-3.5 shrink-0 text-blue-600" />
                                  <span className="truncate">{project.metric}</span>
                                </div>
                              )}

                              <div className="flex flex-wrap gap-1.5 mt-auto pt-1">
                                {techList.slice(0, 4).map((tech) => (
                                  <span
                                    key={tech}
                                    className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 border border-slate-200"
                                  >
                                    {tech}
                                  </span>
                                ))}
                                {techList.length > 4 && (
                                  <span className="text-[11px] font-medium px-1.5 py-0.5 rounded-md bg-slate-100 text-slate-400">
                                    +{techList.length - 4}
                                  </span>
                                )}
                              </div>

                              <div
                                className="flex gap-2 pt-2 border-t border-slate-100"
                                onClick={(e) => e.stopPropagation()}
                              >
                                {demoLink && (
                                  <Link
                                    href={demoLink}
                                    target="_blank"
                                    className="flex-1 inline-flex items-center justify-center gap-1.5 text-xs font-semibold rounded-xl px-3 py-2 bg-blue-600 text-white hover:bg-blue-700 transition-all shadow-sm"
                                  >
                                    <ExternalLink className="h-3.5 w-3.5" />
                                    Demo
                                  </Link>
                                )}

                                {codeLink ? (
                                  <Link
                                    href={codeLink}
                                    target="_blank"
                                    className="flex-1 inline-flex items-center justify-center gap-1.5 text-xs font-semibold rounded-xl px-3 py-2 bg-slate-100 text-slate-700 hover:bg-slate-200 transition-all border border-slate-200"
                                  >
                                    <Github className="h-3.5 w-3.5" />
                                    Code
                                  </Link>
                                ) : (
                                  <div
                                    title="Private repository (Client / NDA Project)"
                                    className="flex-1 inline-flex items-center justify-center gap-1.5 text-xs font-semibold rounded-xl px-3 py-2 bg-slate-50 text-slate-400 border border-slate-200 cursor-not-allowed"
                                  >
                                    <Lock className="h-3.5 w-3.5 text-slate-400" />
                                    Private Repo
                                  </div>
                                )}
                              </div>
                            </div>
                          </article>
                        </div>
                      )
                    })}
                  </div>
                )}
              </TabsContent>
            )
          })}
        </Tabs>
      </div>

      {/* MODAL DETAIL */}
      {selectedProject && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={() => setSelectedProject(null)}
        >
          <div
            className="bg-white rounded-3xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Slider */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setSelectedProject(null)}
                className="absolute top-4 right-4 z-20 p-2 bg-black/20 hover:bg-black/40 backdrop-blur-md text-white rounded-full transition-colors"
                aria-label="Tutup"
              >
                <X className="w-5 h-5" />
              </button>

              <ImageSlider
                key={selectedProject.id}
                photos={getGallery(selectedProject)}
                alt={selectedProject.title}
              />
            </div>

            {/* Konten scrollable */}
            <div className="p-6 sm:p-8 overflow-y-auto">
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2 py-1 rounded-md">
                  {selectedProject.category}
                </span>
                {selectedProject.role && (
                  <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2 py-1 rounded-md">
                    {selectedProject.role}
                  </span>
                )}
              </div>

              <h3 className="font-display text-2xl sm:text-3xl font-bold text-slate-900 mb-3">
                {selectedProject.title}
              </h3>

              {selectedProject.metric && (
                <div className="mb-4 inline-flex items-center gap-2 text-xs font-semibold text-blue-700 bg-blue-50 border border-blue-200 px-3.5 py-1.5 rounded-xl">
                  <BarChart3 className="w-4 h-4 text-blue-600" />
                  <span>{selectedProject.metric}</span>
                </div>
              )}

              <p className="text-slate-600 leading-relaxed mb-6 whitespace-pre-line">
                {selectedProject.description}
              </p>

              {selectedProject.achievements && selectedProject.achievements.length > 0 && (
                <div className="mb-6">
                  <h4 className="text-sm font-bold text-slate-900 mb-3">Key Features & Achievements</h4>
                  <ul className="space-y-2.5 bg-slate-50 p-4 rounded-xl border border-slate-100">
                    {selectedProject.achievements.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2.5 text-sm text-slate-600 leading-relaxed">
                        <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="mb-8">
                <h4 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-1.5">
                  <Tag className="w-3.5 h-3.5 text-slate-400" />
                  Tech Stack & Tools
                </h4>
                <div className="flex flex-wrap gap-2">
                  {getTechArray(selectedProject.technologies).length === 0 ? (
                    <span className="text-xs text-slate-400 italic">Tidak ada teknologi yang dicantumkan</span>
                  ) : (
                    getTechArray(selectedProject.technologies).map((tech) => (
                      <span
                        key={tech}
                        className="text-xs font-medium px-3 py-1.5 rounded-lg bg-blue-50 text-blue-700 border border-blue-100"
                      >
                        {tech}
                      </span>
                    ))
                  )}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-slate-100">
                {(selectedProject.demo_url || selectedProject.project_url) && (
                  <Link
                    href={selectedProject.demo_url || selectedProject.project_url || "#"}
                    target="_blank"
                    className="inline-flex items-center justify-center gap-2 text-sm font-semibold rounded-xl px-5 py-2.5 bg-blue-600 text-white hover:bg-blue-700 transition-all"
                  >
                    <ExternalLink className="h-4 w-4" /> Live Demo
                  </Link>
                )}

                {selectedProject.view_url || selectedProject.github_url ? (
                  <Link
                    href={selectedProject.view_url || selectedProject.github_url || "#"}
                    target="_blank"
                    className="inline-flex items-center justify-center gap-2 text-sm font-semibold rounded-xl px-5 py-2.5 bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200 transition-all"
                  >
                    <Github className="h-4 w-4" /> View Source
                  </Link>
                ) : (
                  <div className="inline-flex items-center justify-center gap-2 text-sm font-semibold rounded-xl px-5 py-2.5 bg-slate-50 text-slate-400 border border-slate-200 cursor-not-allowed">
                    <Lock className="h-4 w-4" /> Private Repository
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}