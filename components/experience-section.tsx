"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { ExternalLink, Github, Calendar, Briefcase, X, ChevronLeft, ChevronRight } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Reveal } from "@/components/reveal"

interface Experience {
  id: string
  title: string
  description: string
  category: string
  thumbnail_url: string | null
  demo_url: string | null
  view_url: string | null
  technologies: string[]
  achievements?: string[]
  work_photos?: string[] // Tambahan array untuk foto kerja
  date_start: Date | string | null
  date_end: Date | string | null
}

interface ExperienceSectionProps {
  experiences: Experience[]
}

// Komponen Slider Foto Internal
const ImageSlider = ({ photos }: { photos: string[] }) => {
  const [currentIndex, setCurrentIndex] = useState(0)

  if (!photos || photos.length === 0) {
    return (
      <div className="w-full aspect-video bg-slate-50 flex items-center justify-center border-b border-slate-100">
        <Briefcase className="w-12 h-12 text-slate-300" />
      </div>
    )
  }

  return (
    <div className="relative w-full aspect-video bg-slate-900 overflow-hidden group">
      <img 
        src={photos[currentIndex]} 
        alt={`Work photo ${currentIndex + 1}`} 
        className="w-full h-full object-cover transition-opacity duration-500"
      />
      
      {photos.length > 1 && (
        <>
          <button 
            onClick={(e) => { e.stopPropagation(); setCurrentIndex(prev => prev === 0 ? photos.length - 1 : prev - 1) }}
            className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/80 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-all backdrop-blur-sm"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button 
            onClick={(e) => { e.stopPropagation(); setCurrentIndex(prev => prev === photos.length - 1 ? 0 : prev + 1) }}
            className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/80 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-all backdrop-blur-sm"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
            {photos.map((_, i) => (
              <div 
                key={i} 
                className={`h-1.5 rounded-full transition-all duration-300 ${i === currentIndex ? 'w-5 bg-white' : 'w-1.5 bg-white/50'}`} 
              />
            ))}
          </div>
        </>
      )}
    </div>
  )
}

export function ExperienceSection({ experiences }: ExperienceSectionProps) {
  const categories = ["Work", "Intern", "Freelance"]
  const [selectedExp, setSelectedExp] = useState<Experience | null>(null)

  // Kunci scroll halaman saat pop-up terbuka
  useEffect(() => {
    if (selectedExp) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => { document.body.style.overflow = 'unset' }
  }, [selectedExp])

  const formatDate = (date: Date | string | null) => {
    if (!date) return "Present"
    const d = new Date(date)
    if (isNaN(d.getTime())) return "Present"
    return d.toLocaleDateString("en-US", { month: "short", year: "numeric" })
  }

  const sortedExperiences = [...experiences].sort((a, b) => {
    if (!a.date_start) return -1
    if (!b.date_start) return 1
    return new Date(b.date_start).getTime() - new Date(a.date_start).getTime()
  })

  return (
    <section id="experience" className="py-24 px-4 sm:px-6 lg:px-8 relative bg-blue-600 text-white">
      <div className="max-w-7xl mx-auto">
        <Reveal className="text-center mb-16">
          <div>
            <h2 className="font-display text-4xl sm:text-5xl font-bold mt-4 mb-4 text-white">
              Professional <span className="text-blue-200">Experience</span>
            </h2>
            <p className="text-lg text-white/85 max-w-2xl mx-auto">
              Building impactful software and AI solutions across various roles
            </p>
          </div>
        </Reveal>

        <Tabs defaultValue="Work" className="w-full">
          <div className="flex justify-center mb-12">
            <TabsList className="inline-flex h-auto items-center rounded-full p-1.5 bg-white/15 backdrop-blur-md border border-white/20">
              {categories.map((category) => (
                <TabsTrigger 
                  key={category} 
                  value={category}
                  className="px-6 py-2 rounded-full text-sm font-semibold transition-all duration-300 data-[state=active]:!bg-white data-[state=active]:!text-blue-700 data-[state=active]:!shadow-md text-white hover:text-white hover:bg-white/20"
                >
                  {category}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          {categories.map((category) => {
            const categoryExperiences = sortedExperiences.filter((e) => 
              e.category.toUpperCase() === category.toUpperCase()
            )

            return (
              <TabsContent key={category} value={category}>
                {categoryExperiences.length === 0 ? (
                  <div className="text-center py-12 text-white/70 text-sm">
                    No experience records found in this category.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {categoryExperiences.map((exp, i) => (
                      <div key={exp.id} className="stagger-item" style={{ animationDelay: `${i * 90}ms`, height: '100%' }}>
                        <article 
                          onClick={() => setSelectedExp(exp)}
                          className="lift-hover group h-full flex flex-col rounded-2xl overflow-hidden bg-white text-slate-900 border border-slate-100 shadow-xl cursor-pointer"
                        >
                          <div className="relative h-40 overflow-hidden bg-slate-50 p-4 flex items-center justify-center border-b border-slate-100">
                            {exp.thumbnail_url ? (
                              <Image src={exp.thumbnail_url} alt={exp.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                            ) : (
                              <div className="w-16 h-16 rounded-2xl bg-blue-50 border border-blue-100 grid place-items-center text-blue-600">
                                <Briefcase className="w-8 h-8" />
                              </div>
                            )}
                          </div>

                          <div className="p-6 flex flex-col flex-1 gap-4 pointer-events-none">
                            <div className="space-y-2">
                              <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-700 bg-blue-50 border border-blue-100 px-2.5 py-1 rounded-full">
                                <Calendar className="h-3 w-3" />
                                <span>{formatDate(exp.date_start)} - {formatDate(exp.date_end)}</span>
                              </div>
                              <h3 className="font-display font-bold text-lg text-slate-900">{exp.title}</h3>
                              <p className="text-sm text-slate-600 leading-relaxed line-clamp-3">{exp.description}</p>
                            </div>

                            {/* KODE BARU: Mengantisipasi jika properti bernama technologies atau tags */}
                            <div className="flex flex-wrap gap-1.5 mt-auto pt-2">
                              {(() => {
                                const techData = exp.technologies || (exp as any).tags || [];
                                const techArray = Array.isArray(techData) 
                                  ? techData 
                                  : typeof techData === 'string' ? (techData as string).split(',').map(t => t.trim()).filter(Boolean) : [];
                                  
                                return (
                                  <>
                                    {techArray.slice(0, 3).map((tech: string) => (
                                      <span key={tech} className="text-[11px] font-medium px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                                        {tech}
                                      </span>
                                    ))}
                                    {techArray.length > 3 && (
                                      <span className="text-[11px] font-medium px-2.5 py-1 rounded-full bg-slate-50 text-slate-500 border border-slate-200">
                                        +{techArray.length - 3}
                                      </span>
                                    )}
                                  </>
                                );
                              })()}
                            </div>

                            {(exp.demo_url || exp.view_url) && (
                              <div className="flex gap-2 pt-4 border-t border-slate-100 mt-2 pointer-events-auto">
                                {exp.demo_url && (
                                  <Link href={exp.demo_url} target="_blank" onClick={(e) => e.stopPropagation()} className="flex-1 inline-flex items-center justify-center gap-1.5 text-xs font-semibold rounded-xl px-3 py-2 bg-blue-600 text-white hover:bg-blue-700 transition-all">
                                    <ExternalLink className="h-3.5 w-3.5" /> Demo
                                  </Link>
                                )}
                                {exp.view_url && (
                                  <Link href={exp.view_url} target="_blank" onClick={(e) => e.stopPropagation()} className="flex-1 inline-flex items-center justify-center gap-1.5 text-xs font-semibold rounded-xl px-3 py-2 bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200 transition-all">
                                    <Github className="h-3.5 w-3.5" /> Code
                                  </Link>
                                )}
                              </div>
                            )}
                          </div>
                        </article>
                      </div>
                    ))}
                  </div>
                )}
              </TabsContent>
            )
          })}
        </Tabs>
      </div>

      {/* MODAL POP-UP */}
      {selectedExp && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={() => setSelectedExp(null)}
        >
          <div 
            className="bg-white rounded-3xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl animate-in zoom-in-95 duration-200"
            onClick={e => e.stopPropagation()}
          >
            {/* Header / Slider Area */}
            <div className="relative">
              <button 
                onClick={() => setSelectedExp(null)}
                className="absolute top-4 right-4 z-20 p-2 bg-black/20 hover:bg-black/40 backdrop-blur-md text-white rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
              
              {/* Gunakan work_photos jika ada, jika tidak gunakan logo thumbnail sebagai fallback */}
              <ImageSlider photos={selectedExp.work_photos?.length ? selectedExp.work_photos : (selectedExp.thumbnail_url ? [selectedExp.thumbnail_url] : [])} />
            </div>

            {/* Konten Scrollable */}
            <div className="p-6 sm:p-8 overflow-y-auto">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2 py-1 rounded-md">
                  {selectedExp.category}
                </span>
                <span className="text-xs font-medium text-slate-500">
                  {formatDate(selectedExp.date_start)} - {formatDate(selectedExp.date_end)}
                </span>
              </div>
              
              <h3 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-4">{selectedExp.title}</h3>
              <p className="text-slate-600 leading-relaxed mb-6">{selectedExp.description}</p>

              {selectedExp.achievements && selectedExp.achievements.length > 0 && (
                <div className="mb-6">
                  <h4 className="text-sm font-bold text-slate-900 mb-3">Key Achievements & Responsibilities</h4>
                  <ul className="space-y-2 text-sm text-slate-600 list-disc list-inside bg-slate-50 p-4 rounded-xl border border-slate-100">
                    {selectedExp.achievements.map((item, idx) => (
                      <li key={idx} className="leading-relaxed">{item}</li>
                    ))}
                  </ul>
                </div>
              )}


              {/* KODE BARU: fallback aman agar map tidak kosong/error */}
              <div className="mb-8">
                <h4 className="text-sm font-bold text-slate-900 mb-3">Technologies Used</h4>
                <div className="flex flex-wrap gap-2">
                  {(() => {
                    const techData = selectedExp.technologies || (selectedExp as any).tags || [];
                    const techArray = Array.isArray(techData) 
                      ? techData 
                      : typeof techData === 'string' ? (techData as string).split(',').map(t => t.trim()).filter(Boolean) : [];

                    if (techArray.length === 0) {
                      return <span className="text-xs text-slate-400 italic">Tidak ada teknologi yang dicantumkan</span>;
                    }

                    return techArray.map((tech: string) => (
                      <span key={tech} className="text-xs font-medium px-3 py-1.5 rounded-lg bg-blue-50 text-blue-700 border border-blue-100">
                        {tech}
                      </span>
                    ));
                  })()}
                </div>
              </div>


              {(selectedExp.demo_url || selectedExp.view_url) && (
                <div className="flex gap-3 pt-6 border-t border-slate-100">
                  {selectedExp.demo_url && (
                    <Link href={selectedExp.demo_url} target="_blank" className="inline-flex items-center justify-center gap-2 text-sm font-semibold rounded-xl px-5 py-2.5 bg-blue-600 text-white hover:bg-blue-700 transition-all">
                      <ExternalLink className="h-4 w-4" /> Live Demo
                    </Link>
                  )}
                  {selectedExp.view_url && (
                    <Link href={selectedExp.view_url} target="_blank" className="inline-flex items-center justify-center gap-2 text-sm font-semibold rounded-xl px-5 py-2.5 bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200 transition-all">
                      <Github className="h-4 w-4" /> View Source
                    </Link>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  )
}