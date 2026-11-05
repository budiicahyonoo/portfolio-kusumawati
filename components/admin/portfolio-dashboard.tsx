"use client"

import { FormEvent, useCallback, useEffect, useMemo, useState } from "react"
import {
  Archive,
  BriefcaseBusiness,
  Check,
  ChevronDown,
  ChevronRight,
  FileImage,
  FileText,
  GraduationCap,
  LayoutDashboard,
  LogOut,
  Mail,
  Menu,
  Plus,
  Search,
  Settings,
  ShieldCheck,
  Trash2,
  Upload,
  UserRound,
  UsersRound,
  X,
} from "lucide-react"
import Link from "next/link"
import { upload } from "@vercel/blob/client"

type Field = {
  name: string
  label: string
  kind?: "textarea" | "select" | "number" | "file" | "files"
  options?: string[]
  accept?: string
  placeholder?: string
  required?: boolean
  wide?: boolean
  hidden?: boolean
}

type Module = {
  id: string
  label: string
  endpoint: string
  icon: typeof LayoutDashboard
  fields?: Field[]
  singleton?: boolean
  category?: string
}

const publicationFields: Field[] = [
  { name: "category", label: "Category", kind: "select", options: ["Certification", "Training", "Journal", "Patent"], required: true },
  { name: "title_en", label: "Title in English", placeholder: "Enter the official title", required: true },
  { name: "title_id", label: "Title in Bahasa Indonesia", placeholder: "Enter the official title or approved translation" },
  { name: "issuer", label: "Issuer or publisher", placeholder: "Enter the issuing organization or publisher" },
  { name: "year", label: "Year", placeholder: "e.g. 2024" },
  { name: "description_en", label: "Description in English", kind: "textarea", placeholder: "Summarize the work, credential, or contribution", wide: true },
  { name: "description_id", label: "Description in Bahasa Indonesia", kind: "textarea", placeholder: "Write an approved Indonesian description", wide: true },
  { name: "verification_url", label: "Verification link", placeholder: "https://example.com/verify" },
  { name: "document_asset_id", label: "Dokumen pendukung", kind: "file", accept: "application/pdf" },
  { name: "document_label", label: "Document label", placeholder: "e.g. Certificate PDF" },
  { name: "status", label: "Publishing status", kind: "select", options: ["draft", "published"] },
  { name: "is_featured", label: "Featured", kind: "select", options: ["false", "true"] },
  { name: "sort_order", label: "Sort order", kind: "number", placeholder: "0" },
]

const modules: Module[] = [
  { id: "overview", label: "Ringkasan", endpoint: "/api/dashboard", icon: LayoutDashboard },
  {
    id: "profile", label: "Profil", endpoint: "/api/profile", icon: UserRound, singleton: true,
    fields: [
      { name: "full_name", label: "Full name", placeholder: "Enter the display name" },
      { name: "professional_title", label: "Professional title", placeholder: "e.g. Chemical Engineering Graduate" },
      { name: "summary_en", label: "Summary in English", kind: "textarea", placeholder: "Write a concise, factual professional summary", wide: true },
      { name: "summary_id", label: "Summary in Bahasa Indonesia", kind: "textarea", placeholder: "Tulis ringkasan profesional yang singkat dan faktual", wide: true },
      { name: "photo_asset_id", label: "Foto profil", kind: "file", accept: "image/jpeg,image/png,image/gif,image/webp" },
      { name: "cv_asset_id", label: "CV / resume", kind: "file", accept: "application/pdf" },
      { name: "email", label: "Email", placeholder: "name@example.com" },
      { name: "phone", label: "Phone", placeholder: "Include country code, e.g. +62…" },
      { name: "whatsapp", label: "WhatsApp", placeholder: "Include country code, e.g. +62…" },
      { name: "linkedin_url", label: "LinkedIn URL", placeholder: "https://www.linkedin.com/in/username" },
      { name: "location", label: "Location", placeholder: "City, region, country" },
    ],
  },
  {
    id: "education", label: "Pendidikan", endpoint: "/api/education", icon: GraduationCap,
    fields: [
      { name: "institution", label: "Institution", placeholder: "Enter the official institution name", required: true },
      { name: "degree", label: "Degree", placeholder: "e.g. Bachelor's degree", required: true },
      { name: "field_of_study", label: "Field of study", placeholder: "e.g. Chemical Engineering" },
      { name: "gpa", label: "GPA", placeholder: "Enter the GPA and scale, if applicable" },
      { name: "location", label: "Location", placeholder: "City, region, country" },
      { name: "period_start", label: "Period start", placeholder: "e.g. 2020", required: true },
      { name: "period_end", label: "Period end", placeholder: "e.g. 2024 or Present" },
      { name: "academic_focus_en", label: "Academic focus in English", placeholder: "Describe the area of study" },
      { name: "academic_focus_id", label: "Academic focus in Bahasa Indonesia", placeholder: "Jelaskan bidang studi" },
      { name: "description_en", label: "Description in English", kind: "textarea", placeholder: "Summarize this education record", wide: true },
      { name: "description_id", label: "Description in Bahasa Indonesia", kind: "textarea", placeholder: "Tulis ringkasan pendidikan yang telah diverifikasi", wide: true },
      { name: "logo_url", label: "Logo institusi", kind: "file", accept: "image/jpeg,image/png,image/gif,image/webp" },
      { name: "media_asset_ids", label: "Dokumen atau foto pendukung", kind: "files", accept: "image/jpeg,image/png,image/gif,image/webp,application/pdf" },
      { name: "status", label: "Publishing status", kind: "select", options: ["draft", "published"] },
      { name: "sort_order", label: "Sort order", kind: "number", placeholder: "0" },
    ],
  },
  {
    id: "academic-projects", label: "Proyek akademik", endpoint: "/api/academic-projects", icon: FileText,
    fields: [
      { name: "education_id", label: "Pendidikan terkait", kind: "select" },
      { name: "title_en", label: "Title in English", placeholder: "Enter the project title", required: true },
      { name: "title_id", label: "Title in Bahasa Indonesia", placeholder: "Enter the official title or approved translation" },
      { name: "summary_en", label: "Summary in English", kind: "textarea", placeholder: "Summarize the project and its purpose", wide: true },
      { name: "summary_id", label: "Summary in Bahasa Indonesia", kind: "textarea", placeholder: "Tulis ringkasan proyek yang telah diverifikasi", wide: true },
      { name: "description_en", label: "Details in English", kind: "textarea", placeholder: "Describe methods, scope, and outcomes", wide: true },
      { name: "description_id", label: "Details in Bahasa Indonesia", kind: "textarea", placeholder: "Jelaskan metode, ruang lingkup, dan hasil", wide: true },
      { name: "research_area", label: "Research area", placeholder: "e.g. Process engineering" },
      { name: "cover_image_url", label: "Gambar sampul", kind: "file", accept: "image/jpeg,image/png,image/gif,image/webp" },
      { name: "media_asset_ids", label: "Foto atau dokumen proyek", kind: "files", accept: "image/jpeg,image/png,image/gif,image/webp,application/pdf" },
      { name: "status", label: "Publishing status", kind: "select", options: ["draft", "published"] },
      { name: "is_featured", label: "Featured", kind: "select", options: ["false", "true"] },
      { name: "sort_order", label: "Sort order", kind: "number", placeholder: "0" },
    ],
  },
  {
    id: "experience", label: "Pengalaman", endpoint: "/api/experiences", icon: BriefcaseBusiness,
    fields: [
      { name: "category", label: "Category", kind: "select", options: ["Work", "Internship", "Speaker"], required: true },
      { name: "organization", label: "Organization", placeholder: "Enter the organization name", required: true },
      { name: "position_en", label: "Position in English", placeholder: "Enter the role or position", required: true },
      { name: "position_id", label: "Position in Bahasa Indonesia", placeholder: "Enter the role or approved translation" },
      { name: "period_start", label: "Period start", placeholder: "e.g. Jan 2024", required: true },
      { name: "period_end", label: "Period end", placeholder: "e.g. Dec 2024 or Present" },
      { name: "location", label: "Location", placeholder: "City, region, country" },
      { name: "summary_en", label: "Summary in English", kind: "textarea", placeholder: "Write a brief, factual role summary", wide: true },
      { name: "summary_id", label: "Summary in Bahasa Indonesia", kind: "textarea", placeholder: "Tulis ringkasan peran yang telah diverifikasi", wide: true },
      { name: "responsibilities_en", label: "Responsibilities in English", kind: "textarea", placeholder: "List responsibilities and contributions", wide: true },
      { name: "responsibilities_id", label: "Responsibilities in Bahasa Indonesia", kind: "textarea", placeholder: "Tuliskan tanggung jawab dan kontribusi", wide: true },
      { name: "technical_skills", label: "Technical skills, comma separated", placeholder: "e.g. HPLC, process analysis" },
      { name: "gallery_asset_ids", label: "Foto pengalaman", kind: "files", accept: "image/jpeg,image/png,image/gif,image/webp" },
      { name: "document_asset_ids", label: "Dokumen pengalaman", kind: "files", accept: "application/pdf" },
      { name: "logo_url", label: "Logo organisasi", kind: "file", accept: "image/jpeg,image/png,image/gif,image/webp" },
      { name: "status", label: "Publishing status", kind: "select", options: ["draft", "published"] },
      { name: "is_featured", label: "Featured", kind: "select", options: ["false", "true"] },
      { name: "sort_order", label: "Sort order", kind: "number", placeholder: "0" },
    ],
  },
  { id: "credentials", label: "Sertifikasi & riset", endpoint: "/api/certifications", icon: ShieldCheck, fields: publicationFields },
  {
    id: "organizations", label: "Organisasi", endpoint: "/api/organizations", icon: UsersRound,
    fields: [
      { name: "name", label: "Organization", placeholder: "Enter the official organization name", required: true },
      { name: "role_en", label: "Role in English", placeholder: "Enter your role", required: true },
      { name: "role_id", label: "Role in Bahasa Indonesia", placeholder: "Enter the role or approved translation" },
      { name: "period_start", label: "Period start", placeholder: "e.g. 2022", required: true },
      { name: "period_end", label: "Period end", placeholder: "e.g. 2024 or Present" },
      { name: "location", label: "Location", placeholder: "City, region, country" },
      { name: "description_en", label: "Description in English", kind: "textarea", placeholder: "Describe the organization briefly", wide: true },
      { name: "description_id", label: "Description in Bahasa Indonesia", kind: "textarea", placeholder: "Jelaskan organisasi secara singkat", wide: true },
      { name: "contribution_en", label: "Contribution in English", kind: "textarea", placeholder: "Describe your verified contribution", wide: true },
      { name: "contribution_id", label: "Contribution in Bahasa Indonesia", kind: "textarea", placeholder: "Jelaskan kontribusi yang telah diverifikasi", wide: true },
      { name: "logo_url", label: "Logo organisasi", kind: "file", accept: "image/jpeg,image/png,image/gif,image/webp" },
      { name: "status", label: "Publishing status", kind: "select", options: ["draft", "published"] },
      { name: "is_featured", label: "Featured", kind: "select", options: ["false", "true"] },
      { name: "sort_order", label: "Sort order", kind: "number", placeholder: "0" },
    ],
  },
  { id: "media", label: "Pustaka berkas", endpoint: "/api/upload", icon: FileImage },
  { id: "messages", label: "Pesan masuk", endpoint: "/api/messages", icon: Mail },
  {
    id: "contact", label: "Info kontak", endpoint: "/api/contact-info", icon: Mail, singleton: true,
    fields: [
      { name: "name", label: "Name", placeholder: "Enter the public contact name" },
      { name: "email", label: "Email", placeholder: "name@example.com" },
      { name: "whatsapp", label: "WhatsApp", placeholder: "Include country code, e.g. +62…" },
      { name: "linkedin", label: "LinkedIn URL", placeholder: "https://www.linkedin.com/in/username" },
      { name: "location", label: "Location", placeholder: "City, region, country" },
    ],
  },
  {
    id: "settings", label: "Pengaturan situs", endpoint: "/api/settings", icon: Settings, singleton: true,
    fields: [
      { name: "website_title", label: "Website title", placeholder: "Enter the public website title" },
      { name: "website_description", label: "Website description", kind: "textarea", placeholder: "Write a concise description for visitors and search results", wide: true },
      { name: "default_language", label: "Default language", kind: "select", options: ["en", "id"] },
      { name: "hero_cta_primary", label: "Primary hero action", placeholder: "e.g. View my experience" },
      { name: "hero_cta_secondary", label: "Secondary hero action", placeholder: "e.g. Contact me" },
      { name: "seo_title", label: "SEO title", placeholder: "Enter the title shown in search results" },
      { name: "seo_description", label: "SEO description", kind: "textarea", placeholder: "Summarize this portfolio for search results", wide: true },
      { name: "og_image_url", label: "Gambar pratinjau situs", kind: "file", accept: "image/jpeg,image/png,image/gif,image/webp" },
      { name: "footer_text", label: "Footer text", placeholder: "Enter a short footer note" },
    ],
  },
]

const initialContent: Record<string, string> = {
  overview: "Ringkasan konten portofolio yang sudah tayang dan pesan yang masuk.",
  profile: "Kelola profil. Foto dan CV diunggah langsung; tautan aset akan disimpan otomatis.",
  education: "Kelola pendidikan dan unggah foto atau dokumen pendukung.",
  "academic-projects": "Kelola proyek akademik dan pilih pendidikan terkait tanpa memasukkan ID.",
  experience: "Kelola pengalaman kerja, magang, dan pembicara beserta file pendukung.",
  credentials: "Kelola sertifikasi, pelatihan, publikasi, dan paten dalam satu daftar.",
  organizations: "Kelola peran organisasi dan unggah logo atau media pendukung.",
  media: "Simpan dan gunakan ulang foto serta dokumen. Maksimal 5 MB per file.",
  messages: "Tinjau pesan yang dikirim melalui formulir kontak di situs publik.",
  contact: "Atur informasi kontak yang ditampilkan di situs.",
  settings: "Atur judul situs, bahasa, SEO, dan teks tombol.",
}

const navigationGroups = [
  { label: "Ringkasan", moduleIds: ["overview"] },
  { label: "Portofolio", moduleIds: ["profile", "education", "academic-projects", "experience", "credentials", "organizations"] },
  { label: "Media & pesan", moduleIds: ["media", "messages"] },
  { label: "Pengaturan situs", moduleIds: ["contact", "settings"] },
]

const MAX_FILE_SIZE = 5 * 1024 * 1024

function getTitle(item: Record<string, unknown>, fields?: Field[]) {
  const keys = ["title_en", "position_en", "institution", "name", "full_name", "filename", "subject"]
  for (const key of keys) {
    if (typeof item[key] === "string" && item[key]) return item[key] as string
  }
  if (typeof item.category === "string") return item.category
  return String(fields?.[0]?.label ?? "Untitled")
}

function AdminInput({
  field,
  value,
  onChange,
  files = [],
  onFilesChange,
  relationOptions = [],
}: {
  field: Field
  value: unknown
  onChange: (value: string) => void
  files?: File[]
  onFilesChange?: (files: File[]) => boolean
  relationOptions?: { value: string; label: string }[]
}) {
  const inputClass = "min-h-11 w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-950 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600"
  return (
    <label className={field.wide ? "sm:col-span-2" : ""}>
      <span className="mb-1.5 block text-sm font-medium text-neutral-800">
        {field.label}{field.required ? <span aria-hidden="true"> *</span> : null}
      </span>
      {field.kind === "file" || field.kind === "files" ? (
        <div>
          <input
            className="block min-h-11 w-full text-sm file:mr-3 file:min-h-10 file:rounded-md file:border-0 file:bg-neutral-100 file:px-3 file:font-medium"
            type="file"
            accept={field.accept}
            multiple={field.kind === "files"}
            onChange={(event) => {
              const selected = Array.from(event.target.files ?? [])
              if (onFilesChange?.(selected) === false) event.currentTarget.value = ""
            }}
          />
          <p className="mt-1 text-xs text-neutral-600">
            {field.kind === "files" ? "File baru ditambahkan saat formulir disimpan." : "Pilih file baru untuk mengganti file tersimpan."}
            {" "}Maksimal 5 MB per file.
          </p>
          {files.length > 0 && <p className="mt-1 break-all text-xs text-primary-800">{files.map((file) => file.name).join(", ")}</p>}
        </div>
      ) : field.kind === "textarea" ? (
        <textarea
          className={`${inputClass} min-h-28 resize-y`}
          value={String(value ?? "")}
          onChange={(event) => onChange(event.target.value)}
          placeholder={field.placeholder}
          required={field.required}
        />
      ) : field.kind === "select" ? (
        <select
          className={inputClass}
          value={String(value ?? (field.name === "education_id" ? "" : field.options?.[0] ?? ""))}
          onChange={(event) => onChange(event.target.value)}
          required={field.required}
        >
          {field.name === "education_id" && <option value="">Tidak terkait dengan pendidikan tertentu</option>}
          {field.options?.map((option) => <option key={option} value={option}>{option}</option>)}
          {relationOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
        </select>
      ) : (
        <input
          className={inputClass}
          type={field.kind === "number" ? "number" : "text"}
          value={String(value ?? "")}
          onChange={(event) => onChange(event.target.value)}
          placeholder={field.placeholder}
          required={field.required}
        />
      )}
    </label>
  )
}

function createNewItem(module: Module): Record<string, unknown> {
  const values = Object.fromEntries(
    (module.fields ?? []).map((field) => [
      field.name,
      field.kind === "select" ? field.options?.[0] ?? "" : field.kind === "files" ? [] : "",
    ]),
  )

  return {
    ...values,
    ...(module.category ? { category: module.category } : {}),
    status: "draft",
    is_featured: false,
    sort_order: 0,
  }
}

export default function PortfolioDashboard() {
  const [activeId, setActiveId] = useState("overview")
  const [items, setItems] = useState<Record<string, unknown>[]>([])
  const [singleton, setSingleton] = useState<Record<string, unknown>>({})
  const [editing, setEditing] = useState<Record<string, unknown> | null>(null)
  const [pendingFiles, setPendingFiles] = useState<Record<string, File[]>>({})
  const [educationOptions, setEducationOptions] = useState<{ value: string; label: string }[]>([])
  const [openGroup, setOpenGroup] = useState("Ringkasan")
  const [search, setSearch] = useState("")
  const [mobileOpen, setMobileOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState("")
  const [overview, setOverview] = useState<{ stats?: Record<string, number>; recentMessages?: Record<string, unknown>[] }>({})
  const [file, setFile] = useState<File | null>(null)

  const active = modules.find((module) => module.id === activeId) ?? modules[0]
  const editableFields = useMemo(() => {
    const fields = active.fields ?? []
    return active.category
      ? fields.filter((field) => field.name !== "category")
      : fields
  }, [active])

  const request = useCallback(async (url: string, init?: RequestInit) => {
    const response = await fetch(url, {
      ...init,
      headers: { "Content-Type": "application/json", ...init?.headers },
    })
    const result = await response.json().catch(() => ({}))
    if (!response.ok) throw new Error(result.error || `Request failed (${response.status})`)
    return result
  }, [])

  const load = useCallback(async () => {
    if (!active) return
    setLoading(true)
    setMessage("")
    try {
      if (active.id === "overview") {
        setOverview(await request(active.endpoint))
      } else if (active.id === "messages") {
        setItems(await request(active.endpoint))
      } else if (active.id === "media") {
        setItems(await request(active.endpoint))
      } else if (active.singleton) {
        const value = await request(active.endpoint)
        setSingleton(value ?? {})
        setEditing(value ?? {})
      } else {
        if (active.id === "academic-projects") {
          const educations = await request("/api/education?admin=true") as Record<string, unknown>[]
          setEducationOptions(educations.map((education) => ({
            value: String(education.id),
            label: `${String(education.institution)} — ${String(education.degree)}`,
          })))
        }
        const query = active.category ? `?admin=true&category=${active.category}` : "?admin=true"
        setItems(await request(`${active.endpoint}${query}`))
      }
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Could not load content.")
      setItems([])
    } finally {
      setLoading(false)
    }
  }, [active, request])

  useEffect(() => {
    // Load the selected module's records from the API.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void load()
  }, [load])

  const updateField = (field: Field, value: string) => {
    setEditing((current) => ({ ...(current ?? {}), [field.name]: value }))
  }

  function beginEditing(item: Record<string, unknown>) {
    const values: Record<string, unknown> = { ...item }
    if (active.id === "education") {
      const media = Array.isArray(item.media) ? item.media as Record<string, unknown>[] : []
      values.media_asset_ids = media.map((entry) => entry.asset_id).filter((id): id is string => typeof id === "string")
    }
    if (active.id === "academic-projects") {
      const media = Array.isArray(item.media) ? item.media as Record<string, unknown>[] : []
      values.media_asset_ids = media.map((entry) => entry.asset_id).filter((id): id is string => typeof id === "string")
    }
    if (active.id === "experience") {
      const gallery = Array.isArray(item.gallery) ? item.gallery as Record<string, unknown>[] : []
      const documents = Array.isArray(item.documents) ? item.documents as Record<string, unknown>[] : []
      values.gallery_asset_ids = gallery.map((entry) => entry.asset_id).filter((id): id is string => typeof id === "string")
      values.document_asset_ids = documents.map((entry) => entry.asset_id).filter((id): id is string => typeof id === "string")
    }
    if (active.id === "organizations") {
      const media = Array.isArray(item.media) ? item.media as Record<string, unknown>[] : []
      values.media_asset_ids = media.map((entry) => entry.asset_id).filter((id): id is string => typeof id === "string")
    }
    setPendingFiles({})
    setEditing(values)
  }

  async function uploadMediaFile(file: File) {
    const safeName = file.name
      .replace(/[\\/]/g, "")
      .replace(/[^\p{L}\p{N}._ -]/gu, "")
      .trim()
      .slice(0, 180) || "upload"
    const blob = await upload(`portfolio/${Date.now()}-${safeName}`, file, {
      access: "public",
      handleUploadUrl: "/api/upload",
      contentType: file.type,
      clientPayload: JSON.stringify({ originalFilename: file.name, mimeType: file.type }),
    })
    return request(`/api/upload?url=${encodeURIComponent(blob.url)}`)
  }

  async function save(event: FormEvent) {
    event.preventDefault()
    if (!editing) return
    setSaving(true)
    setMessage("")
    const data: Record<string, unknown> = { ...editing }
    if (active.category) data.category = active.category
    for (const field of active.fields ?? []) {
      if (field.kind === "number" && data[field.name] !== undefined) data[field.name] = Number(data[field.name]) || 0
      if (field.name === "education_id" && data[field.name] === "") data[field.name] = null
      if (field.name === "is_featured") data[field.name] = data[field.name] === true || data[field.name] === "true"
      if (field.name === "technical_skills" && typeof data[field.name] === "string") {
        const skills = data[field.name]
        data[field.name] = typeof skills === "string" ? skills.split(",").map((value) => value.trim()).filter(Boolean) : []
      }
      if (field.name.endsWith("_asset_ids") && !Array.isArray(data[field.name])) {
        data[field.name] = []
      }
    }
    try {
      for (const field of active.fields ?? []) {
        const selected = pendingFiles[field.name] ?? []
        if (selected.length === 0) continue
        const assets = await Promise.all(selected.map(uploadMediaFile)) as Record<string, unknown>[]
        if (field.kind === "files") {
          const existingIds = Array.isArray(data[field.name]) ? data[field.name] as unknown[] : []
          data[field.name] = [
            ...existingIds.filter((id): id is string => typeof id === "string"),
            ...assets.map((asset) => String(asset.id)),
          ]
        } else if (field.name.endsWith("_asset_id")) {
          data[field.name] = assets[0]?.id
        } else {
          data[field.name] = assets[0]?.url
        }
      }
      if (active.id === "profile") {
        data.photo_url = null
        data.cv_url = null
      }
      if (active.id === "credentials") data.document_url = null

      if (active.singleton) {
        await request(active.endpoint, { method: "PUT", body: JSON.stringify(data) })
      } else if (editing.id) {
        await request(`${active.endpoint}/${editing.id}`, { method: "PUT", body: JSON.stringify(data) })
      } else {
        await request(active.endpoint, { method: "POST", body: JSON.stringify(data) })
      }
      setMessage("Saved successfully.")
      setEditing(active.singleton ? data : null)
      setPendingFiles({})
      await load()
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Could not save changes.")
    } finally {
      setSaving(false)
    }
  }

  async function remove(item: Record<string, unknown>) {
    if (!item.id || !window.confirm(`Delete “${getTitle(item, active.fields)}”?`)) return
    try {
      await request(`${active.endpoint}/${item.id}`, { method: "DELETE" })
      setMessage("Deleted successfully.")
      await load()
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Could not delete the item.")
    }
  }

  async function uploadFile(event: FormEvent) {
    event.preventDefault()
    if (!file) return
    setSaving(true)
    setMessage("")
    try {
      await uploadMediaFile(file)
      setFile(null)
      setMessage("Upload complete.")
      await load()
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Upload failed.")
    } finally {
      setSaving(false)
    }
  }

  async function updateMessage(item: Record<string, unknown>, status: string) {
    try {
      await request(`${active.endpoint}/${item.id}`, { method: "PUT", body: JSON.stringify({ status }) })
      await load()
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Could not update message.")
    }
  }

  async function updateAsset(item: Record<string, unknown>, fields: Record<string, string>) {
    try {
      await request(`/api/upload/${item.id}`, { method: "PUT", body: JSON.stringify(fields) })
      setMessage("Asset details saved.")
      await load()
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Could not update asset.")
    }
  }

  async function logout() {
    await fetch("/api/auth", { method: "DELETE" })
    window.location.assign("/login")
  }

  const filteredItems = items.filter((item) => {
    const query = search.toLowerCase()
    return !query || Object.values(item).some((value) =>
      typeof value === "string" && value.toLowerCase().includes(query),
    )
  })

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-950">
      <aside className={`fixed inset-y-0 left-0 z-40 w-64 border-r border-neutral-200 bg-white transition-transform duration-200 lg:translate-x-0 ${mobileOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="flex h-[68px] items-center justify-between border-b border-neutral-200 px-5">
          <Link href="/admin" className="font-semibold text-primary-950">Kusumawati administration</Link>
          <button type="button" className="rounded-md p-2 lg:hidden" aria-label="Close navigation" onClick={() => setMobileOpen(false)}><X size={18} /></button>
        </div>
        <nav className="flex h-[calc(100%-68px)] flex-col overflow-y-auto p-3" aria-label="Admin navigation">
          <div className="space-y-2">
            {navigationGroups.map((group) => {
              const expanded = openGroup === group.label
              const groupModules = group.moduleIds
                .map((id) => modules.find((module) => module.id === id))
                .filter((module): module is Module => Boolean(module))
              return (
                <section key={group.label}>
                  <button
                    type="button"
                    className="flex min-h-10 w-full items-center justify-between rounded-md px-3 text-left text-xs font-semibold uppercase tracking-wide text-neutral-500 hover:bg-neutral-100"
                    aria-expanded={expanded}
                    onClick={() => setOpenGroup(expanded ? "" : group.label)}
                  >
                    {group.label}
                    <ChevronDown size={16} aria-hidden="true" className={`transition-transform ${expanded ? "rotate-180" : ""}`} />
                  </button>
                  {expanded && <div className="space-y-1">
                    {groupModules.map((module) => {
                      const Icon = module.icon
                      return (
                        <button
                          key={module.id}
                          type="button"
                          onClick={() => {
                            setActiveId(module.id)
                            setEditing(null)
                            setPendingFiles({})
                            setSearch("")
                            setFile(null)
                            setMobileOpen(false)
                          }}
                          aria-current={activeId === module.id ? "page" : undefined}
                          className={`flex min-h-11 w-full items-center gap-3 rounded-md px-3 text-left text-sm ${activeId === module.id ? "bg-primary-100 font-semibold text-primary-800" : "text-neutral-700 hover:bg-neutral-100"}`}
                        >
                          <Icon size={18} aria-hidden="true" />{module.label}
                        </button>
                      )
                    })}
                  </div>}
                </section>
              )
            })}
          </div>
          <div className="mt-auto space-y-1 border-t border-neutral-200 pt-3">
            <Link href="/en" className="flex min-h-11 items-center gap-3 rounded-md px-3 text-sm text-neutral-700 hover:bg-neutral-100">
              <ChevronRight size={18} aria-hidden="true" />View public site
            </Link>
            <button type="button" onClick={logout} className="flex min-h-11 w-full items-center gap-3 rounded-md px-3 text-left text-sm text-neutral-700 hover:bg-neutral-100">
              <LogOut size={18} aria-hidden="true" />Log out
            </button>
          </div>
        </nav>
      </aside>
      {mobileOpen && <button aria-label="Close navigation" className="fixed inset-0 z-30 bg-primary-950/40 lg:hidden" onClick={() => setMobileOpen(false)} />}
      <div className="lg:pl-64">
        <header className="sticky top-0 z-20 flex h-[68px] items-center justify-between border-b border-neutral-200 bg-white px-4 sm:px-8">
          <div className="flex items-center gap-3">
            <button type="button" className="rounded-md p-2 lg:hidden" aria-label="Open navigation" aria-expanded={mobileOpen} onClick={() => setMobileOpen(true)}><Menu size={20} /></button>
            <h1 className="text-lg font-semibold">{active.label}</h1>
          </div>
          <span className="text-sm text-neutral-600">Portfolio workspace</span>
        </header>
        <main className="mx-auto max-w-[1440px] px-4 py-6 sm:px-8">
          <p className="mb-6 max-w-2xl text-sm text-neutral-700">{initialContent[active.id]}</p>
          {message && <p role="status" className={`mb-5 rounded-md border px-4 py-3 text-sm ${message.includes("failed") || message.includes("Could not") || message.includes("Unauthorized") ? "border-danger/30 bg-red-50 text-danger" : "border-primary-200 bg-primary-50 text-primary-900"}`}>{message}</p>}

          {activeId === "overview" && (
            <section aria-label="Portfolio statistics">
              {loading ? <p role="status">Loading dashboard…</p> : (
                <>
                  <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                    {Object.entries(overview.stats ?? {}).map(([label, count]) => (
                      <article key={label} className="rounded-lg border border-neutral-200 bg-white p-5">
                        <p className="text-sm capitalize text-neutral-700">{label.replace(/[A-Z]/g, (letter) => ` ${letter.toLowerCase()}`)}</p>
                        <p className="mt-2 text-3xl font-semibold tabular-nums">{count}</p>
                      </article>
                    ))}
                  </div>
                  <section className="mt-8 rounded-lg border border-neutral-200 bg-white p-5">
                    <h2 className="font-semibold">Recent contact messages</h2>
                    {(overview.recentMessages ?? []).length === 0 ? <p className="mt-3 text-sm text-neutral-600">No messages yet.</p> : (
                      <ul className="mt-3 divide-y divide-neutral-200">
                        {overview.recentMessages?.map((item) => <li key={String(item.id)} className="py-3"><strong>{String(item.name)}</strong><span className="ml-2 text-neutral-600">{String(item.subject)}</span></li>)}
                      </ul>
                    )}
                  </section>
                </>
              )}
            </section>
          )}

          {active.singleton && active.fields && (
            <form onSubmit={save} className="rounded-lg border border-neutral-200 bg-white p-5 sm:p-7">
              {loading ? <p role="status">Loading settings…</p> : (
                <>
                  <div className="grid gap-5 sm:grid-cols-2">
                    {active.fields.map((field) => (
                      <AdminInput
                        key={field.name}
                        field={field}
                        value={editing?.[field.name] ?? singleton[field.name]}
                        files={pendingFiles[field.name]}
                        relationOptions={field.name === "education_id" ? educationOptions : []}
                        onFilesChange={(files) => {
                          if (files.some((selected) => selected.size > MAX_FILE_SIZE)) {
                            setMessage("Ukuran file maksimal 5 MB.")
                            return false
                          }
                          setMessage("")
                          setPendingFiles((current) => ({ ...current, [field.name]: files }))
                          return true
                        }}
                        onChange={(value) => updateField(field, value)}
                      />
                    ))}
                  </div>
                  <button disabled={saving} className="mt-6 inline-flex min-h-11 items-center gap-2 rounded-md bg-primary-700 px-5 font-semibold text-white hover:bg-primary-800 disabled:opacity-60">
                    <Check size={17} />{saving ? "Saving…" : "Save changes"}
                  </button>
                </>
              )}
            </form>
          )}

          {active.id === "media" && (
            <section>
              <form onSubmit={uploadFile} className="mb-6 flex flex-col gap-3 rounded-lg border border-dashed border-primary-300 bg-white p-5 sm:flex-row sm:items-center">
                <label className="flex-1 text-sm font-medium">Pilih foto atau PDF (maksimal 5 MB)
                  <input className="mt-2 block w-full text-sm" type="file" accept="image/jpeg,image/png,image/gif,image/webp,application/pdf" onChange={(event) => {
                    const selected = event.target.files?.[0] ?? null
                    if (selected && selected.size > MAX_FILE_SIZE) {
                      setMessage("Ukuran file maksimal 5 MB.")
                      event.currentTarget.value = ""
                      setFile(null)
                      return
                    }
                    setMessage("")
                    setFile(selected)
                  }} />
                </label>
                <button disabled={!file || saving} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md bg-primary-700 px-5 font-semibold text-white disabled:opacity-50"><Upload size={17} />{saving ? "Uploading…" : "Upload asset"}</button>
              </form>
              <AssetList items={filteredItems} loading={loading} onDelete={remove} onSearch={setSearch} onUpdate={updateAsset} search={search} />
            </section>
          )}

          {active.id === "messages" && (
            <section>
              <div className="mb-4 flex max-w-md items-center gap-2 rounded-md border border-neutral-300 bg-white px-3">
                <Search size={17} aria-hidden="true" className="text-neutral-600" />
                <input aria-label="Search messages" className="min-h-11 w-full outline-none" placeholder="Search messages" value={search} onChange={(event) => setSearch(event.target.value)} />
              </div>
              {loading ? <p role="status">Loading messages…</p> : filteredItems.length === 0 ? <EmptyState /> : (
                <div className="space-y-3">
                  {filteredItems.map((item) => (
                    <article key={String(item.id)} className="rounded-lg border border-neutral-200 bg-white p-5">
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div><h2 className="font-semibold">{String(item.subject)}</h2><p className="mt-1 text-sm text-neutral-700">{String(item.name)}</p><a className="text-sm text-primary-700 underline" href={`mailto:${String(item.email)}`}>{String(item.email)}</a><p className="mt-3 whitespace-pre-wrap text-sm">{String(item.message)}</p></div>
                        <span className="rounded-full bg-primary-100 px-3 py-1 text-xs capitalize text-primary-900">{String(item.status)}</span>
                      </div>
                      <div className="mt-4 flex gap-2">
                        <button type="button" onClick={() => updateMessage(item, item.status === "unread" ? "read" : "unread")} className="min-h-10 rounded-md border border-neutral-300 px-3 text-sm hover:bg-neutral-50">{item.status === "unread" ? "Mark as read" : "Mark unread"}</button>
                        <button type="button" onClick={() => updateMessage(item, "archived")} className="inline-flex min-h-10 items-center gap-2 rounded-md border border-neutral-300 px-3 text-sm hover:bg-neutral-50"><Archive size={16} />Archive</button>
                        <button type="button" onClick={() => remove(item)} className="inline-flex min-h-10 items-center gap-2 rounded-md border border-red-200 px-3 text-sm text-danger hover:bg-red-50"><Trash2 size={16} />Delete</button>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </section>
          )}

          {!active.singleton && !["overview", "media", "messages"].includes(active.id) && (
            <section>
              {editing && (
                <form onSubmit={save} className="mb-6 rounded-lg border border-neutral-200 bg-white p-5 sm:p-7">
                  <div className="mb-5 flex items-center justify-between">
                    <h2 className="font-semibold">{editing.id ? "Edit item" : `Add ${active.label.toLowerCase()}`}</h2>
                    <button type="button" className="rounded-md p-2" aria-label="Close editor" onClick={() => { setEditing(null); setPendingFiles({}) }}><X size={18} /></button>
                  </div>
                  <div className="grid gap-5 sm:grid-cols-2">
                    {editableFields.filter((field) => !field.hidden).map((field) => (
                      <AdminInput
                        key={field.name}
                        field={field}
                        value={editing?.[field.name]}
                        files={pendingFiles[field.name]}
                        relationOptions={field.name === "education_id" ? educationOptions : []}
                        onFilesChange={(files) => {
                          if (files.some((selected) => selected.size > MAX_FILE_SIZE)) {
                            setMessage("Ukuran file maksimal 5 MB.")
                            return false
                          }
                          setMessage("")
                          setPendingFiles((current) => ({ ...current, [field.name]: files }))
                          return true
                        }}
                        onChange={(value) => updateField(field, value)}
                      />
                    ))}
                  </div>
                  <div className="mt-6 flex flex-wrap gap-3">
                    <button disabled={saving} className="inline-flex min-h-11 items-center gap-2 rounded-md bg-primary-700 px-5 font-semibold text-white hover:bg-primary-800 disabled:opacity-60"><Check size={17} />{saving ? "Saving…" : "Save"}</button>
                    <button type="button" onClick={() => { setEditing(null); setPendingFiles({}) }} className="min-h-11 rounded-md border border-neutral-300 px-5 font-medium hover:bg-neutral-50">Cancel</button>
                  </div>
                </form>
              )}
              <div className="mb-4 flex flex-col gap-3 sm:flex-row">
                <label className="flex min-h-11 flex-1 items-center gap-2 rounded-md border border-neutral-300 bg-white px-3">
                  <Search size={17} aria-hidden="true" className="text-neutral-600" />
                  <input aria-label={`Search ${active.label}`} className="w-full outline-none" placeholder={`Search ${active.label.toLowerCase()}`} value={search} onChange={(event) => setSearch(event.target.value)} />
                </label>
                <button type="button" onClick={() => { setPendingFiles({}); setEditing(createNewItem(active)) }} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md bg-primary-700 px-5 font-semibold text-white hover:bg-primary-800"><Plus size={18} />Add new</button>
              </div>
              {loading ? <p role="status">Loading {active.label.toLowerCase()}…</p> : filteredItems.length === 0 ? <EmptyState /> : (
                <div className="overflow-x-auto rounded-lg border border-neutral-200 bg-white">
                  <table className="w-full min-w-[640px] text-left text-sm">
                    <thead className="border-b border-neutral-200 bg-neutral-50 text-neutral-700"><tr><th className="px-4 py-3 font-medium">Title</th><th className="px-4 py-3 font-medium">Category</th><th className="px-4 py-3 font-medium">Status</th><th className="px-4 py-3 text-right font-medium">Actions</th></tr></thead>
                    <tbody className="divide-y divide-neutral-200">
                      {filteredItems.map((item) => (
                        <tr key={String(item.id)}>
                          <td className="max-w-[360px] px-4 py-3 font-medium">{getTitle(item, active.fields)}</td>
                          <td className="px-4 py-3 text-neutral-700">{String(item.category ?? "—")}</td>
                          <td className="px-4 py-3"><span className={`rounded-full px-2.5 py-1 text-xs capitalize ${item.status === "published" ? "bg-green-50 text-green-800" : "bg-neutral-100 text-neutral-700"}`}>{String(item.status ?? "—")}</span></td>
                          <td className="px-4 py-3"><div className="flex justify-end gap-2"><button type="button" className="min-h-9 rounded-md border border-neutral-300 px-3 hover:bg-neutral-50" onClick={() => beginEditing(item)}>Edit</button><button type="button" className="min-h-9 rounded-md border border-red-200 px-3 text-danger hover:bg-red-50" onClick={() => remove(item)}>Delete</button></div></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </section>
          )}
        </main>
      </div>
    </div>
  )
}

function EmptyState() {
  return <div className="rounded-lg border border-dashed border-neutral-300 bg-white px-6 py-12 text-center"><p className="font-medium">Nothing here yet</p><p className="mt-1 text-sm text-neutral-600">Add content when it is ready to manage.</p></div>
}

function AssetList({ items, loading, onDelete, onSearch, onUpdate, search }: {
  items: Record<string, unknown>[]
  loading: boolean
  onDelete: (item: Record<string, unknown>) => void
  onSearch: (value: string) => void
  onUpdate: (item: Record<string, unknown>, fields: Record<string, string>) => void
  search: string
}) {
  return (
    <>
      <label className="mb-4 flex max-w-md min-h-11 items-center gap-2 rounded-md border border-neutral-300 bg-white px-3">
        <Search size={17} aria-hidden="true" className="text-neutral-600" />
        <input aria-label="Search media" className="w-full outline-none" placeholder="Search media" value={search} onChange={(event) => onSearch(event.target.value)} />
      </label>
      {loading ? <p role="status">Loading assets…</p> : items.length === 0 ? <EmptyState /> : (
        <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {items.map((item) => (
            <li key={String(item.id)} className="overflow-hidden rounded-lg border border-neutral-200 bg-white">
              {String(item.file_type) === "image" ? <img src={String(item.url)} alt={String(item.alt_text || item.original_filename || "Uploaded portfolio image")} className="h-48 w-full object-cover" /> : <div className="grid h-48 place-items-center bg-neutral-100 text-neutral-600"><FileText size={40} aria-hidden="true" /></div>}
              <div className="p-4">
                <p className="break-all font-medium">{String(item.original_filename || item.filename)}</p>
                <p className="mt-1 text-xs text-neutral-600">Type: {String(item.mime_type)}</p>
                {typeof item.file_size === "number" && <p className="text-xs text-neutral-600">Size: {(item.file_size / 1024 / 1024).toFixed(2)} MB</p>}
                <form className="mt-3 space-y-3" onSubmit={(event) => {
                  event.preventDefault()
                  const formData = new FormData(event.currentTarget)
                  onUpdate(item, {
                    filename: String(formData.get("filename") || ""),
                    alt_text: String(formData.get("alt_text") || ""),
                    description: String(formData.get("description") || ""),
                  })
                }}>
                  <label className="block text-xs font-medium">Nama file<input name="filename" defaultValue={String(item.filename || "")} placeholder="Nama yang mudah dikenali" className="mt-1 min-h-10 w-full rounded-md border border-neutral-300 px-2 text-sm" /></label>
                  <label className="block text-xs font-medium">Teks alternatif<input name="alt_text" defaultValue={String(item.alt_text || "")} placeholder="Deskripsikan gambar untuk pembaca layar" className="mt-1 min-h-10 w-full rounded-md border border-neutral-300 px-2 text-sm" /></label>
                  <label className="block text-xs font-medium">Keterangan<textarea name="description" defaultValue={String(item.description || "")} placeholder="Catatan singkat untuk mengenali file" className="mt-1 min-h-20 w-full rounded-md border border-neutral-300 px-2 py-1 text-sm" /></label>
                  <button className="min-h-10 rounded-md border border-neutral-300 px-3 text-sm hover:bg-neutral-50">Simpan keterangan</button>
                </form>
                <div className="mt-3 flex gap-2">
                  <a className="min-h-10 rounded-md border border-neutral-300 px-3 py-2 text-sm hover:bg-neutral-50" href={String(item.url)} target="_blank" rel="noreferrer">{String(item.file_type) === "image" ? "Lihat foto" : "Buka dokumen"}</a>
                  <button type="button" className="inline-flex min-h-10 items-center gap-2 rounded-md border border-red-200 px-3 text-sm text-danger hover:bg-red-50" onClick={() => onDelete(item)}><Trash2 size={15} />Hapus</button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </>
  )
}
