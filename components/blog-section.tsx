import Image from "next/image"
import Link from "next/link"
import { ArrowRight, Clock, BookOpen, EyeOff } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Reveal } from "@/components/reveal"

interface BlogPost {
  id: string
  title: string
  slug: string
  description: string
  category: string
  thumbnail_url: string
  is_published: boolean
  read_time: number | null
}

interface BlogSectionProps {
  posts: BlogPost[]
}

export function BlogSection({ posts }: BlogSectionProps) {
  const categories = ["What You Learned", "How You Built Something", "Lessons From Failure"]
  
  // HANYA tampilkan artikel yang sudah dipublish
  const publishedPosts = posts?.filter(p => p.is_published) || [];
  const isEnoughPosts = publishedPosts.length >= 3;

  return (
    <section id="blog" className="py-24 px-4 sm:px-6 lg:px-8 relative bg-white text-slate-900">
      <div className="max-w-7xl mx-auto">
        <Reveal className="text-center mb-16">
          <div>
            <h2 className="font-display text-4xl sm:text-5xl font-bold mt-4 mb-4 text-slate-900">
              Blog & <span className="text-blue-600">Insights</span>
            </h2>
            <p className="text-lg text-slate-500 max-w-2xl mx-auto">
              Sharing technical knowledge, project post-mortems, and AI learning notes.
            </p>
          </div>
        </Reveal>

        {!isEnoughPosts ? (
          <div className="text-center p-12 rounded-2xl bg-slate-50 border border-slate-200 max-w-md mx-auto">
            <BookOpen className="w-12 h-12 mx-auto text-blue-600 mb-4 opacity-80" />
            <h3 className="text-xl font-bold text-slate-900 mb-2">New Articles Coming Soon</h3>
            <p className="text-sm text-slate-600">
              Technical articles and project post-mortems are currently being prepared. Stay tuned!
            </p>
          </div>
        ) : (
          <Tabs defaultValue={categories[0]} className="w-full">
            <div className="flex justify-center mb-12">
              <TabsList className="inline-flex h-auto items-center rounded-full p-1.5 bg-slate-100 border border-slate-200">
                {categories.map((category) => (
                  <TabsTrigger 
                    key={category} 
                    value={category}
                    className="px-5 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all duration-300 data-[state=active]:!bg-blue-600 data-[state=active]:!text-white data-[state=active]:!shadow-md text-slate-600 hover:text-blue-600"
                  >
                    {category}
                  </TabsTrigger>
                ))}
              </TabsList>
            </div>

            {categories.map((category) => {
              const categoryPosts = publishedPosts.filter((p) => 
                p.category.toUpperCase() === category.toUpperCase()
              )

              return (
                <TabsContent key={category} value={category}>
                  {categoryPosts.length === 0 ? (
                    <div className="text-center py-12 text-slate-400 text-sm">
                      No articles available in this category yet.
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {categoryPosts.map((post, i) => (
                        <div key={post.id} className="stagger-item" style={{ animationDelay: `${i * 90}ms`, height: '100%' }}>
                          <article className="lift-hover group h-full flex flex-col rounded-2xl overflow-hidden bg-white text-slate-900 border border-slate-200/80 shadow-sm">
                            <div className="relative h-48 overflow-hidden bg-slate-100">
                              <Image
                                src={post.thumbnail_url || "/portfoliostackplus.png"}
                                alt={post.title}
                                fill
                                className="object-cover group-hover:scale-110 transition-transform duration-500"
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/30 to-transparent"></div>
                              {post.read_time && (
                                <div className="absolute top-4 right-4 flex items-center gap-1.5 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-xs font-semibold text-blue-700 shadow-sm">
                                  <Clock className="h-3 w-3" />
                                  <span>{post.read_time} min read</span>
                                </div>
                              )}
                            </div>
                            <div className="p-6 flex flex-col flex-1 gap-4">
                              <div>
                                <h3 className="font-display font-bold text-lg text-slate-900 line-clamp-2 hover:text-blue-600 transition-colors">
                                  {post.title}
                                </h3>
                                <p className="text-sm text-slate-600 line-clamp-3 mt-2 leading-relaxed">
                                  {post.description}
                                </p>
                              </div>
                              {/* PERUBAHAN DISINI: Arahkan ke /blog/slug */}
                              <Link
                                href={`/blog/${post.slug}`}
                                className="group/btn mt-auto w-full inline-flex items-center justify-center gap-2 text-sm font-semibold rounded-xl px-4 py-2.5 bg-blue-50 text-blue-700 hover:bg-blue-600 hover:text-white transition-all"
                              >
                                Read More
                                <ArrowRight className="h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                              </Link>
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
        )}
      </div>
    </section>
  )
}