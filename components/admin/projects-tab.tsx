"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Trash2, Edit3, ImageIcon, ImagePlus, Loader2 } from "lucide-react";

interface Project {
  id: string;
  title: string;
  description: string;
  category: string;
  thumbnail_url: string | null;
  image_url: string | null;
  demo_url: string | null;
  project_url: string | null;
  view_url: string | null;
  github_url: string | null;
  technologies: string[] | string;
  tags: string | null;
  achievements?: string[];
  work_photos?: string[];
  role: string | null;
  metric: string | null;
  sort_order: number;
}

export function ProjectsTab() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form state
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [category, setCategory] = useState("AI");
  const [techInput, setTechInput] = useState("");
  const [achievementsInput, setAchievementsInput] = useState("");
  const [demoUrl, setDemoUrl] = useState("");
  const [viewUrl, setViewUrl] = useState("");
  const [thumbnailUrl, setThumbnailUrl] = useState("");
  const [workPhotos, setWorkPhotos] = useState<string[]>([]);
  const [role, setRole] = useState("");
  const [metric, setMetric] = useState("");
  const [sortOrder, setSortOrder] = useState("0");

  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [isUploadingPhotos, setIsUploadingPhotos] = useState(false);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/projects", { cache: "no-store" });
      if (!res.ok) throw new Error("Gagal mengambil data proyek");
      const data = await res.json();
      setProjects(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Gagal mengambil daftar proyek:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setEditingId(null);
    setTitle("");
    setDesc("");
    setCategory("AI");
    setTechInput("");
    setAchievementsInput("");
    setDemoUrl("");
    setViewUrl("");
    setThumbnailUrl("");
    setWorkPhotos([]);
    setRole("");
    setMetric("");
    setSortOrder("0");
  };

  const handleEdit = (p: Project) => {
    setEditingId(p.id);
    setTitle(p.title || "");
    setDesc(p.description || "");
    setCategory(p.category || "AI");

    const techData = p.technologies || p.tags;
    setTechInput(
      Array.isArray(techData)
        ? techData.join(", ")
        : typeof techData === "string"
          ? techData
          : ""
    );

    setAchievementsInput(
      Array.isArray(p.achievements)
        ? p.achievements.join("\n")
        : typeof p.achievements === "string"
          ? (p.achievements as string)
          : ""
    );

    setDemoUrl(p.demo_url || p.project_url || "");
    setViewUrl(p.view_url || p.github_url || "");
    setThumbnailUrl(p.thumbnail_url || p.image_url || "");
    setWorkPhotos(Array.isArray(p.work_photos) ? p.work_photos : []);
    setRole(p.role || "");
    setMetric(p.metric || "");
    setSortOrder(String(p.sort_order ?? 0));

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Upload satu file, return URL-nya
  const uploadFile = async (file: File): Promise<string> => {
    const res = await fetch(
      `/api/upload?filename=${encodeURIComponent(file.name)}`,
      { method: "POST", body: file }
    );
    const data = await res.json();
    if (!res.ok || !data.url) {
      throw new Error(data?.error || "Gagal mengunggah gambar");
    }
    return data.url as string;
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];

    if (file.size > 4 * 1024 * 1024) {
      alert("⚠️ Maksimal 4MB");
      e.target.value = "";
      return;
    }

    setIsUploadingImage(true);
    try {
      const url = await uploadFile(file);
      setThumbnailUrl(url);
      alert("✅ Thumbnail berhasil di-upload!");
    } catch (error) {
      console.error(error);
      alert(error instanceof Error ? `❌ ${error.message}` : "❌ Gagal mengunggah gambar.");
    } finally {
      setIsUploadingImage(false);
      e.target.value = "";
    }
  };

  const handleWorkPhotosUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const files = Array.from(e.target.files);
    const input = e.target;

    setIsUploadingPhotos(true);
    try {
      const uploaded: string[] = [];
      for (const file of files) {
        if (file.size > 4 * 1024 * 1024) {
          alert(`⚠️ ${file.name} terlalu besar (Max 4MB)`);
          continue;
        }
        try {
          uploaded.push(await uploadFile(file));
        } catch {
          alert(`❌ Gagal mengunggah ${file.name}`);
        }
      }
      if (uploaded.length > 0) {
        setWorkPhotos((prev) => [...prev, ...uploaded]);
        alert(`✅ ${uploaded.length} foto berhasil di-upload!`);
      }
    } finally {
      setIsUploadingPhotos(false);
      input.value = "";
    }
  };

  const removeWorkPhoto = (index: number) => {
    setWorkPhotos((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isUploadingImage || isUploadingPhotos) {
      alert("⏳ Tunggu sampai gambar selesai di-upload.");
      return;
    }

    setIsSubmitting(true);

    const payload = {
      title: title.trim(),
      description: desc.trim(),
      category,
      technologies: techInput.split(",").map((t) => t.trim()).filter(Boolean),
      achievements: achievementsInput.split("\n").map((a) => a.trim()).filter(Boolean),
      demo_url: demoUrl.trim() || null,
      view_url: viewUrl.trim() || null,
      thumbnail_url: thumbnailUrl.trim() || null,
      work_photos: workPhotos,
      role: role.trim() || null,
      metric: metric.trim() || null,
      sort_order: Number(sortOrder) || 0,
    };

    const wasEditing = !!editingId;
    const endpoint = editingId ? `/api/projects/${editingId}` : "/api/projects";

    try {
      const res = await fetch(endpoint, {
        method: editingId ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json().catch(() => null);
      if (!res.ok) {
        throw new Error(data?.error || data?.message || "Gagal menyimpan proyek");
      }

      await fetchProjects();
      resetForm();
      alert(wasEditing ? "✅ Proyek berhasil diperbarui!" : "✅ Proyek berhasil ditambahkan!");
    } catch (error) {
      console.error("Gagal menyimpan proyek:", error);
      alert(error instanceof Error ? `❌ ${error.message}` : "❌ Gagal menyimpan proyek.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Apakah Anda yakin ingin menghapus proyek ini?")) return;

    try {
      const res = await fetch(`/api/projects/${id}`, { method: "DELETE" });
      const data = await res.json().catch(() => null);
      if (!res.ok) {
        throw new Error(data?.error || data?.message || "Gagal menghapus proyek");
      }

      await fetchProjects();
      if (editingId === id) resetForm();
      alert("🗑️ Proyek berhasil dihapus!");
    } catch (error) {
      console.error("Gagal menghapus proyek:", error);
      alert(error instanceof Error ? `❌ ${error.message}` : "❌ Gagal menghapus proyek.");
    }
  };

  return (
    <div className="grid lg:grid-cols-3 gap-8 items-start animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* FORM */}
      <div className="lg:col-span-1 bg-white p-6 rounded-2xl border border-slate-200/60 shadow-sm space-y-6">
        <div>
          <h2 className="text-lg font-bold flex items-center gap-2 text-slate-900">
            {editingId ? (
              <Edit3 className="w-5 h-5 text-blue-600" />
            ) : (
              <Plus className="w-5 h-5 text-blue-600" />
            )}
            {editingId ? "Edit Proyek" : "Tambah Proyek"}
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            {editingId
              ? "Edit data proyek yang sudah tersimpan."
              : "Tambahkan proyek baru ke portfolio."}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Judul Proyek"
          />

          <div className="grid grid-cols-2 gap-3">
            <select
              required
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring text-slate-900"
            >
              <option value="AI">AI</option>
              <option value="WEB">WEB</option>
              <option value="APPS">APPS</option>
            </select>
            <Input
              type="number"
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              placeholder="Urutan (0)"
            />
          </div>

          <textarea
            required
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
            placeholder="Deskripsi singkat..."
            className="w-full h-24 text-sm p-3 rounded-md border border-input focus:ring-2 focus:ring-blue-600 outline-none text-slate-900 bg-background resize-none"
          />

          <textarea
            value={achievementsInput}
            onChange={(e) => setAchievementsInput(e.target.value)}
            placeholder="Fitur utama / pencapaian (1 poin per baris)"
            className="w-full h-24 text-xs p-3 rounded-md border border-input focus:ring-2 focus:ring-blue-600 outline-none text-slate-900 bg-background resize-none"
          />

          <div className="grid grid-cols-2 gap-3">
            <Input
              value={role}
              onChange={(e) => setRole(e.target.value)}
              placeholder="Peran (misal: Solo Developer)"
            />
            <Input
              value={metric}
              onChange={(e) => setMetric(e.target.value)}
              placeholder="Metrik (misal: Akurasi 99%)"
            />
          </div>

          <Input
            value={techInput}
            onChange={(e) => setTechInput(e.target.value)}
            placeholder="Tech Stack (koma: React, PyTorch, RAG)"
          />

          <div className="grid grid-cols-2 gap-3">
            <Input
              value={demoUrl}
              onChange={(e) => setDemoUrl(e.target.value)}
              placeholder="Link Demo Live"
            />
            <Input
              value={viewUrl}
              onChange={(e) => setViewUrl(e.target.value)}
              placeholder="Link Code / GitHub"
            />
          </div>

          {/* THUMBNAIL */}
          <div className="space-y-2 p-3 bg-slate-50 border border-slate-200 rounded-xl">
            <label className="text-xs font-bold text-slate-600 flex items-center gap-2">
              <ImageIcon className="w-4 h-4" />
              Thumbnail Proyek
            </label>

            {thumbnailUrl && (
              <div className="flex items-center gap-3 bg-white p-2 border rounded-lg mb-2">
                <img src={thumbnailUrl} className="h-10 w-16 object-cover rounded" alt="Thumbnail" />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setThumbnailUrl("")}
                  className="text-red-500 ml-auto h-7 text-xs hover:bg-red-50"
                >
                  Hapus
                </Button>
              </div>
            )}

            <div className="relative">
              <Input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                disabled={isUploadingImage}
                className="cursor-pointer file:text-blue-600 file:bg-blue-50 file:border-0 file:rounded-md file:px-3 file:py-1 file:mr-3 file:font-medium text-xs text-slate-600"
              />
              {isUploadingImage && (
                <div className="absolute inset-0 bg-white/80 flex items-center justify-center rounded-md text-xs font-bold text-blue-600">
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  Mengunggah...
                </div>
              )}
            </div>
          </div>

          {/* GALERI FOTO */}
          <div className="space-y-2 p-3 bg-blue-50/50 border border-blue-100 rounded-xl">
            <div className="flex justify-between items-center">
              <label className="text-xs font-bold text-blue-800">Galeri Foto Proyek (Landscape)</label>
              <span className="text-[10px] text-blue-600 font-medium">{workPhotos.length} foto</span>
            </div>

            {workPhotos.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-2">
                {workPhotos.map((url, i) => (
                  <div key={`${url}-${i}`} className="relative w-14 h-14 rounded-md overflow-hidden border border-blue-200 group">
                    <img src={url} className="w-full h-full object-cover" alt={`Foto ${i + 1}`} />
                    <button
                      type="button"
                      onClick={() => removeWorkPhoto(i)}
                      className="absolute inset-0 bg-red-500/80 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div className="relative">
              <Input
                type="file"
                accept="image/*"
                multiple
                onChange={handleWorkPhotosUpload}
                disabled={isUploadingPhotos}
                className="cursor-pointer file:text-blue-600 file:bg-blue-100 file:border-0 file:rounded-md file:px-3 file:py-1 file:mr-3 text-xs"
              />
              {isUploadingPhotos && (
                <div className="absolute inset-0 bg-white/80 flex items-center justify-center rounded-md text-xs font-bold text-blue-600">
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  Mengunggah...
                </div>
              )}
            </div>
          </div>

          <div className="flex gap-2 pt-2">
            <Button
              type="submit"
              disabled={isSubmitting || isUploadingImage || isUploadingPhotos}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
            >
              {isSubmitting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : editingId ? (
                "Update Proyek"
              ) : (
                "Simpan Proyek"
              )}
            </Button>
            {editingId && (
              <Button type="button" variant="outline" onClick={resetForm} className="text-slate-700">
                Batal
              </Button>
            )}
          </div>
        </form>
      </div>

      {/* DAFTAR PROYEK */}
      <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200/60 shadow-sm space-y-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900">Daftar Proyek Terdaftar</h2>
          <p className="text-xs text-slate-500 mt-1">{projects.length} proyek terdaftar</p>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center min-h-[200px]">
            <div className="flex items-center gap-2 text-sm text-slate-500">
              <Loader2 className="w-4 h-4 animate-spin" />
              Loading data proyek...
            </div>
          </div>
        ) : projects.length === 0 ? (
          <div className="flex flex-col items-center justify-center min-h-[200px] rounded-xl border border-dashed border-slate-300 text-center">
            <ImageIcon className="w-8 h-8 text-slate-300 mb-3" />
            <p className="text-sm font-medium text-slate-600">Belum ada proyek</p>
            <p className="text-xs text-slate-400 mt-1">Tambahkan proyek menggunakan form di sebelah kiri.</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 gap-4">
            {projects.map((p) => {
              const displayImage = p.thumbnail_url || p.image_url;
              const techList = Array.isArray(p.technologies) ? p.technologies : [];

              return (
                <div key={p.id} className="border p-4 rounded-xl shadow-sm flex flex-col justify-between">
                  <div>
                    {displayImage ? (
                      <img
                        src={displayImage}
                        alt={p.title}
                        className="w-full aspect-video object-cover rounded-lg mb-3"
                      />
                    ) : (
                      <div className="w-full aspect-video bg-slate-100 flex items-center justify-center rounded-lg mb-3">
                        <ImageIcon className="w-6 h-6 text-slate-300" />
                      </div>
                    )}

                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full font-bold uppercase">
                        {p.category}
                      </span>
                      {p.role && (
                        <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">
                          {p.role}
                        </span>
                      )}
                    </div>

                    <h3 className="font-bold text-slate-900 leading-tight">{p.title}</h3>
                    <p className="text-xs text-slate-500 line-clamp-2 mt-1">{p.description}</p>

                    {techList.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-3">
                        {techList.slice(0, 4).map((tech, index) => (
                          <span
                            key={`${tech}-${index}`}
                            className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded"
                          >
                            {tech}
                          </span>
                        ))}
                        {techList.length > 4 && (
                          <span className="text-[10px] bg-slate-100 text-slate-400 px-2 py-0.5 rounded">
                            +{techList.length - 4}
                          </span>
                        )}
                      </div>
                    )}

                    {p.work_photos && p.work_photos.length > 0 && (
                      <div className="flex items-center gap-1 mt-2 text-[10px] text-slate-500 font-medium">
                        <ImagePlus className="w-3 h-3" /> {p.work_photos.length} foto galeri
                      </div>
                    )}
                  </div>

                  <div className="flex justify-end gap-1 mt-4 border-t pt-3">
                    <Button
                      type="button"
                      size="icon"
                      variant="ghost"
                      onClick={() => handleEdit(p)}
                      className="text-slate-600 hover:bg-slate-50"
                      title="Edit proyek"
                    >
                      <Edit3 className="w-4 h-4" />
                    </Button>
                    <Button
                      type="button"
                      size="icon"
                      variant="ghost"
                      onClick={() => handleDelete(p.id)}
                      className="text-red-500 hover:bg-red-50"
                      title="Hapus proyek"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}