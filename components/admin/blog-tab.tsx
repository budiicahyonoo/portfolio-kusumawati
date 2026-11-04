"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Trash2, Edit3, ImageIcon, Loader2, Eye, EyeOff, Heart, MessageSquare } from "lucide-react";

interface Blog {
  id: string;
  title: string;
  slug: string;
  description: string;
  category: string;
  tags: string[];
  thumbnail_url: string | null;
  content: string | null;
  read_time: number;
  is_published: boolean;
  views: number;
  likes: number;
  comments: any[];
}

export function BlogTab() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form State
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [tagsInput, setTagsInput] = useState("");
  const [thumbnailUrl, setThumbnailUrl] = useState("");
  const [content, setContent] = useState("");
  const [readTime, setReadTime] = useState("5");
  const [isPublished, setIsPublished] = useState(false);

  // State Loading Vercel Blob
  const [isUploadingThumbnail, setIsUploadingThumbnail] = useState(false);
  const [isUploadingContentImage, setIsUploadingContentImage] = useState(false);

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    setIsLoading(true);
    const res = await fetch("/api/blog");
    if (res.ok) setBlogs(await res.json());
    setIsLoading(false);
  };

  const resetForm = () => {
    setEditingId(null);
    setTitle(""); setSlug(""); setDescription(""); setCategory(""); setTagsInput("");
    setThumbnailUrl(""); setContent(""); setReadTime("5"); setIsPublished(false);
  };

  // Auto Generate Slug
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value;
    setTitle(newTitle);
    if (!editingId) {
      setSlug(newTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''));
    }
  };

  const handleEdit = (b: Blog) => {
    setEditingId(b.id);
    setTitle(b.title); setSlug(b.slug); setDescription(b.description);
    setCategory(b.category); setTagsInput(b.tags ? b.tags.join(", ") : "");
    setThumbnailUrl(b.thumbnail_url || ""); setContent(b.content || "");
    setReadTime(String(b.read_time)); setIsPublished(b.is_published);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const insertImageToContent = (url: string) => {
    const imageTag = `\n<img src="${url}" alt="Blog Image" class="w-full rounded-xl my-4 object-cover" />\n`;
    setContent((prev) => prev + imageTag);
  };

  const handleThumbnailUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    setIsUploadingThumbnail(true);
    try {
      const res = await fetch(`/api/upload?filename=${encodeURIComponent(file.name)}`, { method: 'POST', body: file });
      const data = await res.json();
      if (data.url) setThumbnailUrl(data.url);
    } catch (err) { alert("❌ Gagal mengunggah gambar."); } 
    finally { setIsUploadingThumbnail(false); }
  };

  const handleContentImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    setIsUploadingContentImage(true);
    try {
      const res = await fetch(`/api/upload?filename=${encodeURIComponent(file.name)}`, { method: 'POST', body: file });
      const data = await res.json();
      if (data.url) insertImageToContent(data.url);
    } catch (err) { alert("❌ Gagal mengunggah gambar."); } 
    finally { setIsUploadingContentImage(false); }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const tagsArray = tagsInput.split(",").map((t) => t.trim()).filter(Boolean);
    const payload = {
      title, slug, description, category, tags: tagsArray,
      thumbnail_url: thumbnailUrl || null, content,
      read_time: Number(readTime), is_published: isPublished
    };

    // Jika ada editingId, panggil PUT (Update), jika tidak POST (Create)
    const endpoint = editingId ? `/api/blog/${editingId}` : "/api/blog";
    const method = editingId ? "PUT" : "POST";

    const res = await fetch(endpoint, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (res.ok) { fetchBlogs(); resetForm(); } 
    else alert("Gagal menyimpan blog!");
    setIsSubmitting(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Hapus artikel ini?")) return;
    const res = await fetch(`/api/blog/${id}`, { method: "DELETE" });
    if (res.ok) fetchBlogs();
  };

  return (
    <div className="grid lg:grid-cols-3 gap-8 items-start animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      <div className="lg:col-span-1 bg-white p-6 rounded-2xl border border-slate-200/60 shadow-sm space-y-6">
        <div>
          <h2 className="text-lg font-bold flex items-center gap-2">
            {editingId ? <Edit3 className="w-5 h-5 text-blue-600" /> : <Plus className="w-5 h-5 text-blue-600" />} 
            {editingId ? "Edit Artikel" : "Tulis Artikel Baru"}
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">Publikasikan wawasan dan ceritamu.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input required value={title} onChange={handleTitleChange} placeholder="Judul Artikel" />
          
          <div className="space-y-1">
            <label className="text-[11px] font-bold text-slate-500">URL Slug (Otomatis)</label>
            <Input required value={slug} onChange={(e) => setSlug(e.target.value)} placeholder="contoh-judul-artikel" className="bg-slate-50 font-mono text-xs" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <select required value={category} onChange={(e) => setCategory(e.target.value)} className="flex h-10 w-full rounded-md border border-input px-3 py-2 text-sm">
              <option value="" disabled>Pilih Kategori</option>
              <option value="What You Learned">What You Learned</option>
              <option value="How You Built Something">How You Built Something</option>
              <option value="Lessons From Failure">Lessons From Failure</option>
            </select>
            <Input type="number" value={readTime} onChange={(e) => setReadTime(e.target.value)} placeholder="Waktu (Menit)" />
          </div>

          <textarea required value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Ringkasan singkat..." className="w-full h-16 text-sm p-3 rounded-md border border-input outline-none" />

          <Input value={tagsInput} onChange={(e) => setTagsInput(e.target.value)} placeholder="Tags (koma: Web, AI, Next.js)" />

          <div className="space-y-2 p-3 bg-slate-50 border rounded-xl">
            <label className="text-xs font-bold text-slate-600">Cover Utama</label>
            {thumbnailUrl && (
              <img src={thumbnailUrl} className="w-full h-24 object-cover rounded-md mb-2 border" alt="Cover" />
            )}
            <Input type="file" accept="image/*" onChange={handleThumbnailUpload} disabled={isUploadingThumbnail} className="text-xs" />
          </div>

          <div className="space-y-2 p-3 bg-slate-50 border border-dashed rounded-xl">
            <p className="text-[11px] font-bold text-slate-500">Sisipkan Gambar di Paragraf:</p>
            <Input type="file" accept="image/*" onChange={handleContentImageUpload} disabled={isUploadingContentImage} className="text-xs" />
          </div>

          <textarea value={content} onChange={(e) => setContent(e.target.value)} placeholder="Tulis paragraf artikel di sini... (Mendukung HTML)" className="w-full h-40 text-sm p-3 rounded-md border border-input outline-none font-mono" />

          <div className="flex items-center gap-2 p-3 border rounded-xl bg-slate-50">
            <input type="checkbox" id="publish" checked={isPublished} onChange={(e) => setIsPublished(e.target.checked)} className="w-4 h-4 text-blue-600 rounded border-gray-300" />
            <label htmlFor="publish" className="text-sm font-bold cursor-pointer">{isPublished ? "🟢 Published (Publik)" : "🟡 Draft (Sembunyikan)"}</label>
          </div>

          <div className="flex gap-2">
            <Button type="submit" disabled={isSubmitting || isUploadingThumbnail || isUploadingContentImage} className="flex-1 bg-blue-600 hover:bg-blue-700">
              {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Simpan Artikel"}
            </Button>
            {editingId && <Button type="button" variant="outline" onClick={resetForm}>Batal</Button>}
          </div>
        </form>
      </div>

      <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200/60 shadow-sm space-y-4">
        <h2 className="text-lg font-bold">Daftar Artikel</h2>
        {isLoading ? <p className="text-sm text-slate-400">Loading...</p> : (
          <div className="flex flex-col gap-4">
            {blogs.map((blog) => (
              <div key={blog.id} className={`border p-4 rounded-xl flex flex-col sm:flex-row gap-4 shadow-sm items-start justify-between ${!blog.is_published ? 'bg-slate-50 border-dashed' : 'bg-white'}`}>
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full font-bold uppercase">{blog.category}</span>
                    {!blog.is_published && <span className="text-[10px] bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-bold flex items-center gap-1"><EyeOff className="w-3 h-3"/> Draft</span>}
                  </div>
                  <h3 className="font-bold text-lg">{blog.title}</h3>
                  <p className="text-xs text-slate-500 line-clamp-2">{blog.description}</p>
                  
                  <div className="flex items-center gap-4 pt-2 text-xs text-slate-400 font-medium">
                    <span className="flex items-center gap-1"><Eye className="w-3.5 h-3.5" /> {blog.views} Views</span>
                    <span className="flex items-center gap-1"><Heart className="w-3.5 h-3.5 text-red-500" /> {blog.likes} Likes</span>
                  </div>
                </div>

                <div className="flex flex-row sm:flex-col gap-2 border-t sm:border-t-0 sm:border-l pt-3 sm:pt-0 pl-0 sm:pl-3 w-full sm:w-auto">
                  <Button size="sm" variant="outline" onClick={() => handleEdit(blog)} className="flex-1"><Edit3 className="w-4 h-4 mr-1" /> Edit</Button>
                  <Button size="sm" variant="outline" onClick={() => handleDelete(blog.id)} className="text-red-500 hover:bg-red-50 flex-1"><Trash2 className="w-4 h-4 mr-1" /> Hapus</Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}