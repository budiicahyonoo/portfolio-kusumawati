import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Mail, Linkedin, Github, Calendar, MessageSquare } from "lucide-react"
import { Reveal } from "@/components/reveal"

interface Contact {
  id: string
  platform: string
  url: string
}

interface ContactSectionProps {
  contacts: Contact[]
}

export function ContactSection({ contacts }: ContactSectionProps) {
  const getIcon = (platform: string) => {
    switch (platform) {
      case "Email":
        return <Mail className="h-6 w-6" />
      case "LinkedIn":
        return <Linkedin className="h-6 w-6" />
      case "GitHub":
        return <Github className="h-6 w-6" />
      case "Calendly":
        return <Calendar className="h-6 w-6" />
      default:
        return <MessageSquare className="h-6 w-6" />
    }
  }

  const emailContact = contacts.find((c) => c.platform === "Email")?.url || "mailto:budicahyono.dev@gmail.com"

  return (
    <section id="contact" className="py-24 px-4 sm:px-6 lg:px-8 bg-blue-600 text-white relative">
      <div className="max-w-7xl mx-auto">
        <Reveal className="text-center mb-16">
          <div>
            <h2 className="font-display text-4xl sm:text-5xl font-bold mb-4 text-white">
              Let&apos;s <span className="text-blue-200">Connect</span>
            </h2>
            <p className="text-lg text-white/85 max-w-2xl mx-auto">
              Have a project in mind, a job opportunity, or want to collaborate? Feel free to reach out.
            </p>
          </div>
        </Reveal>

        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 max-w-5xl mx-auto">
          {contacts.map((contact) => (
            <Card key={contact.id} className="p-6 bg-white text-slate-900 hover:shadow-xl transition-all group rounded-2xl border-white/20">
              <Link href={contact.url} target="_blank" className="flex flex-col items-center gap-3 text-center">
                <div className="p-3.5 rounded-2xl bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                  {getIcon(contact.platform)}
                </div>
                <span className="font-bold text-sm text-slate-800 group-hover:text-blue-600 transition-colors">
                  {contact.platform}
                </span>
              </Link>
            </Card>
          ))}
        </div>

        <div className="mt-16 text-center">
          <Card className="max-w-2xl mx-auto p-8 sm:p-10 bg-white text-slate-900 rounded-3xl shadow-2xl border border-white/20">
            <h3 className="font-display text-2xl font-bold text-slate-900 mb-3">Ready to start a new project?</h3>
            <p className="text-slate-600 text-sm mb-6 max-w-md mx-auto leading-relaxed">
              I&apos;m always open to discussing new opportunities, scalable web systems, and modern AI solutions.
            </p>
            <Button asChild size="lg" className="bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl px-8 shadow-lg shadow-blue-500/30">
              <Link href={emailContact}>
                <Mail className="mr-2 h-4 w-4" />
                Send Direct Email
              </Link>
            </Button>
          </Card>
        </div>
      </div>
    </section>
  )
}