"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Trash2, Edit3, Wrench, Loader2 } from "lucide-react";

interface Skill {
  id: string;
  name: string;
  category: string;
  logo_url: string;
  sort_order: number;
}

export function SkillsTab() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [name, setName] = useState("");
  const [category, setCategory] = useState("AI/ML");
  const [logoUrl, setLogoUrl] = useState("");
  const [sortOrder, setSortOrder] = useState("0");
  const [isUploadingLogo, setIsUploadingLogo] = useState(false);

  useEffect(() => { fetchSkills(); }, []);

  const fetchSkills = async () => {
    setIsLoading(true);
    const res = await fetch("/api/skills");
    if (res.ok) setSkills(await res.json());
    setIsLoading(false);
  };

  const resetForm = () => {
    setEditingId(null); setName(""); setCategory("AI/ML"); setLogoUrl(""); setSortOrder("0");
  };

  const handleEdit = (s: Skill) => {
    setEditingId(s.id); setName(s.name); setCategory(s.category);
    setLogoUrl(s.logo_url); setSortOrder(String(s.sort_order));
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    if (file.size > 4 * 1024 * 1024) return alert("⚠️ Maksimal 4MB");

    setIsUploadingLogo(true);
    try {
      const res = await fetch(`/api/upload?filename=${encodeURIComponent(file.name)}`, { method: 'POST', body: file });
      const data = await res.json();
      if (data.url) {
        setLogoUrl(data.url);
        alert("✅ Logo skill berhasil di-upload!");
      }
    } catch (err) {
      alert("❌ Gagal mengunggah gambar.");
    } finally {
      setIsUploadingLogo(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const payload = { name, category, logo_url: logoUrl, sort_order: Number(sortOrder) };
    const endpoint = editingId ? `/api/skills/${editingId}` : "/api/skills";
    const res = await fetch(endpoint, {
      method: editingId ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (res.ok) { fetchSkills(); resetForm(); } else alert("Gagal menyimpan skill!");
    setIsSubmitting(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Hapus skill ini?")) return;
    const res = await fetch(`/api/skills/${id}`, { method: "DELETE" });
    if (res.ok) fetchSkills();
  };

  return (
    <div className="grid lg:grid-cols-3 gap-8 items-start animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="lg:col-span-1 bg-white p-6 rounded-2xl border border-slate-200/60 shadow-sm space-y-6">
        <div>
          <h2 className="text-lg font-bold flex items-center gap-2">
            <Wrench className="w-5 h-5 text-blue-600"/> {editingId ? "Edit Skill" : "Tambah Skill"}
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input required value={name} onChange={(e) => setName(e.target.value)} placeholder="Nama Skill (misal: PyTorch)" />
          
          <div className="grid grid-cols-2 gap-3">
            <select 
              required 
              value={category} 
              onChange={(e) => setCategory(e.target.value)}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <option value="AI/ML">AI/ML</option>
              <option value="Frontend">Frontend</option>
              <option value="Backend">Backend</option>
              <option value="Database">Database</option>
              <option value="DevOps/Cloud">DevOps/Cloud</option>
              <option value="Tools">Tools</option>
            </select>
            <Input type="number" value={sortOrder} onChange={(e) => setSortOrder(e.target.value)} placeholder="Urutan" />
          </div>

          <div className="space-y-2 p-3 bg-slate-50 border border-slate-200 rounded-xl">
            <label className="text-xs font-bold text-slate-600">Logo Skill</label>
            {logoUrl && (
              <div className="flex items-center gap-3 bg-white p-2 border rounded-lg mb-2">
                <img src={logoUrl} className="h-6 w-6 object-contain" alt="Logo" />
                <Button type="button" variant="ghost" size="sm" onClick={() => setLogoUrl("")} className="text-red-500 ml-auto h-7 text-xs">Hapus</Button>
              </div>
            )}
            <Input type="file" accept="image/*" onChange={handleLogoUpload} disabled={isUploadingLogo} className="cursor-pointer text-xs" />
          </div>

          <div className="flex gap-2">
            <Button type="submit" disabled={isSubmitting || isUploadingLogo} className="flex-1 bg-blue-600 hover:bg-blue-700">
              {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin"/> : "Simpan Skill"}
            </Button>
            {editingId && <Button type="button" variant="outline" onClick={resetForm}>Batal</Button>}
          </div>
        </form>
      </div>

      <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200/60 shadow-sm space-y-4">
        <h2 className="text-lg font-bold">Daftar Skill Terdaftar</h2>
        {isLoading ? <p className="text-sm text-slate-400">Loading...</p> : (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {skills.map((s) => (
              <div key={s.id} className="border p-3 rounded-xl flex items-center justify-between shadow-sm bg-slate-50">
                <div className="flex items-center gap-2">
                  <img src={s.logo_url} className="w-6 h-6 object-contain" />
                  <div>
                    <p className="text-xs font-bold text-slate-800 leading-none">{s.name}</p>
                    <span className="text-[9px] text-slate-400">{s.category}</span>
                  </div>
                </div>
                <div className="flex items-center">
                  <Button size="icon" variant="ghost" onClick={() => handleEdit(s)} className="h-7 w-7"><Edit3 className="w-3.5 h-3.5" /></Button>
                  <Button size="icon" variant="ghost" onClick={() => handleDelete(s.id)} className="h-7 w-7 text-red-500"><Trash2 className="w-3.5 h-3.5" /></Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}