import Image from "next/image"
import { Card } from "@/components/ui/card"
import { Reveal } from "@/components/reveal"

interface Skill {
  id: string
  name: string
  category: string
  logo_url: string
}

interface SkillsSectionProps {
  skills: Skill[]
}

export function SkillsSection({ skills }: SkillsSectionProps) {
  const categories = ["AI/ML", "Frontend", "Backend", "Database", "DevOps/Cloud", "Tools"]

  return (
    <section id="skills" className="py-24 px-4 sm:px-6 lg:px-8 bg-blue-600 text-white relative">
      <div className="max-w-7xl mx-auto">
        <Reveal className="text-center mb-16">
          <div>
            <h2 className="font-display text-4xl sm:text-5xl font-bold mb-4 text-white">
              Technical <span className="text-blue-200">Skills</span>
            </h2>
            <p className="text-lg text-white/85 max-w-2xl mx-auto">
              Comprehensive technical stack across AI engineering and modern web development
            </p>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => {
            const categorySkills = skills.filter((s) => 
              s.category.toLowerCase() === category.toLowerCase() ||
              (category === "AI/ML" && (s.category === "AI/Data" || s.category === "AI/ML"))
            )

            return (
              <Card key={category} className="p-6 bg-white text-slate-900 border border-white/20 shadow-xl rounded-2xl">
                <h3 className="text-lg font-bold text-blue-600 mb-5 flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-600"></span>
                  {category}
                </h3>
                {categorySkills.length === 0 ? (
                  <p className="text-xs text-slate-400 italic">No skills added yet.</p>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {categorySkills.map((skill) => (
                      <div
                        key={skill.id}
                        className="flex flex-col items-center justify-center p-3 rounded-xl bg-slate-50 border border-slate-100 hover:bg-blue-50 hover:border-blue-200 transition-all group"
                      >
                        <div className="relative w-8 h-8 mb-2">
                          <Image
                            src={skill.logo_url || "/placeholder.svg"}
                            alt={skill.name}
                            fill
                            className="object-contain group-hover:scale-110 transition-transform"
                          />
                        </div>
                        <span className="text-xs font-semibold text-slate-700 text-center line-clamp-1">{skill.name}</span>
                      </div>
                    ))}
                  </div>
                )}
              </Card>
            )
          })}
        </div>
      </div>
    </section>
  )
}