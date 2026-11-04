"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, User, UploadCloud, RefreshCw } from "lucide-react";

export function HomeTab() {
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [photoChanged, setPhotoChanged] = useState(false); // foto sudah diupload tapi belum disimpan

  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [valueProp, setValueProp] = useState("");
  const [photoUrl, setPhotoUrl] = useState("");
  const [email, setEmail] = useState("");

  const fetchHome = async () => {
    setLoading(true);
    setLoadError(null);
    try {
      const res = await fetch("/api/home", { cache: "no-store" });
      if (!res.ok) throw new Error("Gagal mengambil data profil");
      const data = await res.json();

      if (data?.id) {
        setName(data.name || "");
        setRole(data.role || "");
        setValueProp(data.value_proposition || "");
        setPhotoUrl(data.photo_url || "");
        setEmail(data.email || "");
      }
      setPhotoChanged(false);
    } catch (error) {
      console.error(error);
      setLoadError(error instanceof Error ? error.message : "Gagal mengambil data profil");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHome();
  }, []);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const input = e.target;
    const file = input.files![0];

    if (file.size > 4 * 1024 * 1024) {
      alert("⚠️ Ukuran file maksimal 4MB");
      input.value = "";
      return;
    }

    setUploading(true);
    try {
      const res = await fetch(`/api/upload?filename=${encodeURIComponent(file.name)}`, {
        method: "POST",
        body: file,
      });
      const data = await res.json();

      if (!res.ok || !data.url) {
        throw new Error(data?.error || "Gagal mendapatkan URL dari server.");
      }

      setPhotoUrl(data.url);
      setPhotoChanged(true);
      alert("✅ Foto berhasil di-upload! Klik 'Simpan Profil' agar foto tampil di website.");
    } catch (error) {
      console.error(error);
      alert(error instanceof Error ? `❌ ${error.message}` : "❌ Terjadi kesalahan saat mengunggah foto.");
    } finally {
      setUploading(false);
      input.value = "";
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const res = await fetch("/api/home", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          role,
          value_proposition: valueProp,
          photo_url: photoUrl,
          email,
        }),
      });

      const data = await res.json().catch(() => null);
      if (!res.ok) throw new Error(data?.error || "Gagal memperbarui profil.");

      await fetchHome(); // muat ulang supaya form = data yang benar-benar tersimpan
      alert("✅ Profil Home berhasil disimpan!");
    } catch (error) {
      console.error(error);
      alert(error instanceof Error ? `❌ ${error.message}` : "❌ Gagal memperbarui profil.");
    } finally {
      setSubmitting(false);
    }
  };

  const rolePreview = role.split(",").map((r) => r.trim()).filter(Boolean);

  if (loading) {
    return (
      <div className="flex items-center gap-2 text-sm text-slate-400">
        <Loader2 className="w-4 h-4 animate-spin" /> Loading data profil...
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="bg-white p-6 rounded-2xl border border-red-200 text-sm space-y-3 max-w-md">
        <p className="text-red-600 font-medium">❌ {loadError}</p>
        <Button type="button" variant="outline" size="sm" onClick={fetchHome}>
          <RefreshCw className="w-4 h-4 mr-2" /> Coba lagi
        </Button>
      </div>
    );
  }

  return (
    <div className="grid lg:grid-cols-2 gap-8 items-start animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="bg-white p-6 rounded-2xl border border-slate-200/60 shadow-sm space-y-6">
        <div>
          <h2 className="text-lg font-bold flex items-center gap-2">
            <User className="w-5 h-5 text-blue-600" /> Pengaturan Profil Home
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Atur tampilan awal yang muncul di hero section.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-600">Nama Lengkap</label>
            <Input
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Contoh: Budi Cahyono"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-600">
              Role / Profesi <span className="font-normal text-slate-400">(teks berganti-ganti)</span>
            </label>
            <Input
              value={role}
              onChange={(e) => setRole(e.target.value)}
              placeholder="Software Engineer, Full Stack Developer, AI Engineer"
            />
            <p className="text-[11px] text-slate-400">
              Pisahkan dengan koma. Kosongkan untuk memakai role default di website.
            </p>
            {rolePreview.length > 0 && (
              <div className="flex flex-wrap gap-1.5 pt-1">
                {rolePreview.map((r, i) => (
                  <span
                    key={`${r}-${i}`}
                    className="text-[11px] font-medium px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-100"
                  >
                    {r}
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-600">Email Utama</label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="email@domain.com"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-600">Value Proposition (Tagline)</label>
            <textarea
              value={valueProp}
              onChange={(e) => setValueProp(e.target.value)}
              placeholder="Deskripsi singkat yang menjual..."
              className="w-full h-24 text-sm p-3 rounded-md border border-input focus:ring-2 focus:ring-blue-600 outline-none resize-none"
            />
            <p className="text-[11px] text-slate-400">
              Kosongkan untuk memakai tagline default di website.
            </p>
          </div>

          {/* FOTO PROFIL */}
          <div className="space-y-2 p-4 bg-slate-50 border border-slate-200 rounded-xl">
            <label className="text-xs font-bold text-slate-600 flex items-center gap-2">
              <UploadCloud className="w-4 h-4" /> Foto Profil Utama
            </label>

            {photoUrl && (
              <div className="bg-white p-2 border rounded-lg mb-3 space-y-2">
                <div className="h-40 w-full rounded-md bg-slate-100 flex items-end justify-center overflow-hidden">
                  <img
                    src={photoUrl}
                    className="h-full object-contain object-bottom"
                    alt="Preview foto profil"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-slate-500 truncate">{photoUrl}</span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setPhotoUrl("");
                      setPhotoChanged(true);
                    }}
                    className="text-red-500 ml-auto h-7 text-xs"
                  >
                    Hapus
                  </Button>
                </div>
              </div>
            )}

            {photoChanged && (
              <p className="text-[11px] font-medium text-amber-600 bg-amber-50 border border-amber-200 rounded-md px-2.5 py-1.5">
                ⚠️ Perubahan foto belum disimpan. Klik "Simpan Profil".
              </p>
            )}

            <div className="relative">
              <Input
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                disabled={uploading}
                className="cursor-pointer file:text-blue-600 file:bg-blue-50 file:border-0 file:rounded-md file:px-3 file:py-1 file:mr-3 file:font-medium"
              />
              {uploading && (
                <div className="absolute inset-0 bg-white/80 flex items-center justify-center rounded-md text-sm font-bold text-blue-600">
                  <Loader2 className="w-4 h-4 animate-spin mr-2" /> Mengunggah... Mohon tunggu
                </div>
              )}
            </div>
          </div>

          <Button
            type="submit"
            disabled={submitting || uploading}
            className="w-full bg-blue-600 hover:bg-blue-700 mt-4"
          >
            {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Simpan Profil"}
          </Button>
        </form>
      </div>
    </div>
  );
}