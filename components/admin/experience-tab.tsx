"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Trash2, Edit3, Briefcase, Loader2, ImagePlus } from "lucide-react";

interface Experience {
  id: string;
  title: string;
  description: string;
  category: string;
  thumbnail_url: string | null;
  demo_url: string | null;
  view_url: string | null;
  technologies: string[];
  achievements: string[];
  work_photos?: string[]; // Array foto kerja
  date_start: string | null;
  date_end: string | null;
  sort_order: number;
}

export function ExperienceTab() {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form State
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [category, setCategory] = useState("Work");
  const [techInput, setTechInput] = useState("");
  const [achievementsInput, setAchievementsInput] = useState("");
  const [thumbnailUrl, setThumbnailUrl] = useState("");
  const [workPhotos, setWorkPhotos] = useState<string[]>([]); // State untuk slider
  const [demoUrl, setDemoUrl] = useState("");
  const [viewUrl, setViewUrl] = useState("");
  const [dateStart, setDateStart] = useState("");
  const [dateEnd, setDateEnd] = useState("");
  const [sortOrder, setSortOrder] = useState("0");

  const [isUploadingLogo, setIsUploadingLogo] = useState(false);
  const [isUploadingPhotos, setIsUploadingPhotos] = useState(false);

  useEffect(() => { fetchExperiences(); }, []);

  const fetchExperiences = async () => {
    setIsLoading(true);
    const res = await fetch("/api/experience");
    if (res.ok) setExperiences(await res.json());
    setIsLoading(false);
  };

  const resetForm = () => {
    setEditingId(null); setTitle(""); setDesc(""); setCategory("Work");
    setTechInput(""); setAchievementsInput(""); setThumbnailUrl(""); 
    setWorkPhotos([]); setDemoUrl(""); setViewUrl("");
    setDateStart(""); setDateEnd(""); setSortOrder("0");
  };

  const handleEdit = (e: any) => {
    setEditingId(e.id); 
    setTitle(e.title || ""); 
    setDesc(e.description || ""); 
    setCategory(e.category || "Work");
    
    // Sinkronisasi data tech / tags (antisipasi perbedaan nama properti API)
    const techData = e.technologies || e.tags;
    setTechInput(
      Array.isArray(techData) 
        ? techData.join(", ") 
        : typeof techData === 'string' ? techData : ""
    );

    // FIX ERROR: Antisipasi achievements berbentuk String atau Array secara aman
    setAchievementsInput(
      Array.isArray(e.achievements)
        ? e.achievements.join("\n")
        : typeof e.achievements === 'string' ? e.achievements : ""
    );

    // Sinkronisasi data thumbnail / image_url
    setThumbnailUrl(e.thumbnail_url || e.image_url || "");
    
    // Pastikan work_photos dimasukkan dengan aman
    setWorkPhotos(Array.isArray(e.work_photos) ? e.work_photos : []);
    
    setDemoUrl(e.demo_url || ""); 
    setViewUrl(e.view_url || "");
    setSortOrder(String(e.sort_order ?? 0));
    
    setDateStart(e.date_start ? new Date(e.date_start).toISOString().split('T')[0] : "");
    setDateEnd(e.date_end ? new Date(e.date_end).toISOString().split('T')[0] : "");
    
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    if (file.size > 4 * 1024 * 1024) return alert("⚠️ Maksimal 4MB");

    setIsUploadingLogo(true);
    try {
      const res = await fetch(`/api/upload?filename=${encodeURIComponent(file.name)}`, { method: 'POST', body: file });
      const data = await res.json();
      if (data.url) setThumbnailUrl(data.url);
    } catch (err) { alert("❌ Gagal mengunggah gambar."); } 
    finally { setIsUploadingLogo(false); }
  };

  // Upload Multiple Foto Kerja
  const handleWorkPhotosUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const files = Array.from(e.target.files);
    
    setIsUploadingPhotos(true);
    try {
      const uploadedUrls: string[] = [];
      for (const file of files) {
        if (file.size > 4 * 1024 * 1024) { alert(`⚠️ ${file.name} terlalu besar (Max 4MB)`); continue; }
        const res = await fetch(`/api/upload?filename=${encodeURIComponent(file.name)}`, { method: 'POST', body: file });
        const data = await res.json();
        if (data.url) uploadedUrls.push(data.url);
      }
      setWorkPhotos(prev => [...prev, ...uploadedUrls]);
    } catch (err) { alert("❌ Gagal mengunggah beberapa foto."); } 
    finally { setIsUploadingPhotos(false); }
  };

  const removeWorkPhoto = (index: number) => {
    setWorkPhotos(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const techArray = techInput.split(",").map((t) => t.trim()).filter(Boolean);
    const achievementsArray = achievementsInput.split("\n").map((a) => a.trim()).filter(Boolean);

    const payload = {
      title,
      description: desc,
      category,
      technologies: techArray,
      achievements: achievementsArray,
      thumbnail_url: thumbnailUrl || null,
      work_photos: workPhotos, // Array foto yang akan disimpan
      demo_url: demoUrl || null,
      view_url: viewUrl || null,
      date_start: dateStart ? new Date(dateStart).toISOString() : null,
      date_end: dateEnd ? new Date(dateEnd).toISOString() : null,
      sort_order: Number(sortOrder),
    };

    const endpoint = editingId ? `/api/experience/${editingId}` : "/api/experience";
    const res = await fetch(endpoint, {
      method: editingId ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (res.ok) { fetchExperiences(); resetForm(); } else alert("Gagal menyimpan!");
    setIsSubmitting(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Hapus pengalaman ini?")) return;
    const res = await fetch(`/api/experience/${id}`, { method: "DELETE" });
    if (res.ok) fetchExperiences();
  };

  return (
    <div className="grid lg:grid-cols-3 gap-8 items-start animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="lg:col-span-1 bg-white p-6 rounded-2xl border border-slate-200/60 shadow-sm space-y-6">
        <div>
          <h2 className="text-lg font-bold flex items-center gap-2">
            {editingId ? <Edit3 className="w-5 h-5 text-blue-600"/> : <Plus className="w-5 h-5 text-blue-600"/>} 
            {editingId ? "Edit Pengalaman" : "Tambah Pengalaman"}
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input required value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Posisi / Peran" />
          
          <div className="grid grid-cols-2 gap-3">
            <select required value={category} onChange={(e) => setCategory(e.target.value)} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:border-blue-600">
              <option value="Work">Work</option>
              <option value="Intern">Intern</option>
              <option value="Freelance">Freelance</option>
            </select>
            <Input type="number" value={sortOrder} onChange={(e) => setSortOrder(e.target.value)} placeholder="Urutan (0)" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1"><label className="text-[11px] font-bold">Mulai</label><Input type="date" value={dateStart} onChange={(e) => setDateStart(e.target.value)} /></div>
            <div className="space-y-1"><label className="text-[11px] font-bold">Selesai</label><Input type="date" value={dateEnd} onChange={(e) => setDateEnd(e.target.value)} /></div>
          </div>

          <textarea required value={desc} onChange={(e) => setDesc(e.target.value)} placeholder="Ringkasan tanggung jawab..." className="w-full h-20 text-sm p-3 rounded-md border border-input outline-none focus:border-blue-600" />
          
          <textarea value={achievementsInput} onChange={(e) => setAchievementsInput(e.target.value)} placeholder="Pencapaian Terukur (1 poin per baris)" className="w-full h-24 text-xs p-3 rounded-md border border-input outline-none focus:border-blue-600" />

          <Input value={techInput} onChange={(e) => setTechInput(e.target.value)} placeholder="Tech Stack (koma: Next.js, Docker)" />

          <div className="grid grid-cols-2 gap-3">
            <Input type="url" value={demoUrl} onChange={(e) => setDemoUrl(e.target.value)} placeholder="Demo URL" />
            <Input type="url" value={viewUrl} onChange={(e) => setViewUrl(e.target.value)} placeholder="Github URL" />
          </div>
          
          <div className="space-y-2 p-3 bg-slate-50 border rounded-xl">
            <label className="text-xs font-bold text-slate-600">Logo Perusahaan (Thumbnail)</label>
            {thumbnailUrl && (
              <div className="flex items-center gap-3 bg-white p-2 border rounded-lg mb-2">
                <img src={thumbnailUrl} className="h-6 w-6 object-contain" alt="Logo" />
                <Button type="button" variant="ghost" size="sm" onClick={() => setThumbnailUrl("")} className="text-red-500 ml-auto h-7 text-xs">Hapus</Button>
              </div>
            )}
            <Input type="file" accept="image/*" onChange={handleLogoUpload} disabled={isUploadingLogo} className="text-xs" />
          </div>

          {/* UPLOAD GALLERY FOTO KERJA */}
          <div className="space-y-2 p-3 bg-blue-50/50 border border-blue-100 rounded-xl">
            <div className="flex justify-between items-center">
              <label className="text-xs font-bold text-blue-800">Galeri Foto Kerja (Landscape)</label>
              <span className="text-[10px] text-blue-600 font-medium">{workPhotos.length} foto</span>
            </div>
            
            {workPhotos.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-2">
                {workPhotos.map((url, i) => (
                  <div key={i} className="relative w-14 h-14 rounded-md overflow-hidden border border-blue-200 group">
                    <img src={url} className="w-full h-full object-cover" />
                    <button type="button" onClick={() => removeWorkPhoto(i)} className="absolute inset-0 bg-red-500/80 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <Trash2 className="w-4 h-4"/>
                    </button>
                  </div>
                ))}
              </div>
            )}
            
            <div className="relative">
              <Input 
                type="file" 
                accept="image/*" 
                multiple // MENGIZINKAN BANYAK FILE SEKALIGUS
                onChange={handleWorkPhotosUpload} 
                disabled={isUploadingPhotos} 
                className="cursor-pointer file:text-blue-600 file:bg-blue-100 file:border-0 file:rounded-md file:px-3 file:py-1 file:mr-3 text-xs" 
              />
              {isUploadingPhotos && (
                <div className="absolute inset-0 bg-white/80 flex items-center justify-center rounded-md text-xs font-bold text-blue-600">
                  <Loader2 className="w-4 h-4 animate-spin mr-2" /> Mengunggah...
                </div>
              )}
            </div>
          </div>
          
          <div className="flex gap-2">
            <Button type="submit" disabled={isSubmitting} className="flex-1 bg-blue-600 hover:bg-blue-700">
              {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin"/> : "Simpan"}
            </Button>
            {editingId && <Button type="button" variant="outline" onClick={resetForm}>Batal</Button>}
          </div>
        </form>
      </div>

      <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200/60 shadow-sm space-y-4">
        <h2 className="text-lg font-bold">Riwayat Pengalaman</h2>
        {isLoading ? <p className="text-sm text-slate-400">Loading...</p> : (
          <div className="flex flex-col gap-4">
            {experiences.map((exp) => (
              <div key={exp.id} className="border p-4 rounded-xl flex items-start gap-4 shadow-sm">
                <div className="h-12 w-12 bg-slate-50 border rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden">
                  {exp.thumbnail_url ? <img src={exp.thumbnail_url} className="h-full w-full object-contain p-1" /> : <Briefcase className="h-5 w-5 text-slate-300"/>}
                </div>
                <div className="flex-1 overflow-hidden">
                  <h3 className="font-bold leading-tight text-slate-900 truncate">
                    {exp.title} <span className="text-[10px] ml-2 bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full font-bold uppercase">{exp.category}</span>
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-2">{exp.description}</p>
                  {exp.work_photos && exp.work_photos.length > 0 && (
                    <div className="flex items-center gap-1 mt-2 text-[10px] text-slate-500 font-medium">
                      <ImagePlus className="w-3 h-3" /> {exp.work_photos.length} foto terlampir
                    </div>
                  )}
                </div>
                <div className="flex flex-col gap-1 border-l pl-3">
                  <Button size="icon" variant="ghost" onClick={() => handleEdit(exp)}><Edit3 className="w-4 h-4" /></Button>
                  <Button size="icon" variant="ghost" onClick={() => handleDelete(exp.id)} className="text-red-500"><Trash2 className="w-4 h-4" /></Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}