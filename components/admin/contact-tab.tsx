"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Trash2, Edit3, Mail, Loader2 } from "lucide-react";

interface Contact {
  id: string;
  platform: string;
  url: string;
  sort_order: number;
}

export function ContactTab() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [platform, setPlatform] = useState("Email");
  const [url, setUrl] = useState("");
  const [sortOrder, setSortOrder] = useState("0");

  useEffect(() => { fetchContacts(); }, []);

  const fetchContacts = async () => {
    setIsLoading(true);
    const res = await fetch("/api/contact");
    if (res.ok) setContacts(await res.json());
    setIsLoading(false);
  };

  const resetForm = () => {
    setEditingId(null); setPlatform("Email"); setUrl(""); setSortOrder("0");
  };

  const handleEdit = (c: Contact) => {
    setEditingId(c.id); setPlatform(c.platform); setUrl(c.url); setSortOrder(String(c.sort_order));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const payload = { platform, url, sort_order: Number(sortOrder) };
    const endpoint = editingId ? `/api/contact/${editingId}` : "/api/contact";
    const res = await fetch(endpoint, {
      method: editingId ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (res.ok) { fetchContacts(); resetForm(); } else alert("Gagal menyimpan kontak!");
    setIsSubmitting(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Hapus kanal kontak ini?")) return;
    const res = await fetch(`/api/contact/${id}`, { method: "DELETE" });
    if (res.ok) fetchContacts();
  };

  return (
    <div className="grid lg:grid-cols-3 gap-8 items-start animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="lg:col-span-1 bg-white p-6 rounded-2xl border border-slate-200/60 shadow-sm space-y-6">
        <div>
          <h2 className="text-lg font-bold flex items-center gap-2">
            <Mail className="w-5 h-5 text-blue-600"/> {editingId ? "Edit Kontak" : "Tambah Kanal Kontak"}
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <select 
              required 
              value={platform} 
              onChange={(e) => setPlatform(e.target.value)}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <option value="Email">Email</option>
              <option value="LinkedIn">LinkedIn</option>
              <option value="GitHub">GitHub</option>
              <option value="Calendly">Calendly</option>
              <option value="WhatsApp">WhatsApp</option>
            </select>
            <Input type="number" value={sortOrder} onChange={(e) => setSortOrder(e.target.value)} placeholder="Urutan" />
          </div>

          <Input required value={url} onChange={(e) => setUrl(e.target.value)} placeholder="URL / mailto: link" />

          <div className="flex gap-2">
            <Button type="submit" disabled={isSubmitting} className="flex-1 bg-blue-600 hover:bg-blue-700">
              {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin"/> : "Simpan Kontak"}
            </Button>
            {editingId && <Button type="button" variant="outline" onClick={resetForm}>Batal</Button>}
          </div>
        </form>
      </div>

      <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200/60 shadow-sm space-y-4">
        <h2 className="text-lg font-bold">Kanal Kontak Aktif</h2>
        {isLoading ? <p className="text-sm text-slate-400">Loading...</p> : (
          <div className="flex flex-col gap-3">
            {contacts.map((c) => (
              <div key={c.id} className="border p-3.5 rounded-xl flex items-center justify-between shadow-sm bg-slate-50">
                <div>
                  <p className="text-xs font-bold text-slate-800">{c.platform}</p>
                  <p className="text-xs text-slate-500 truncate max-w-md">{c.url}</p>
                </div>
                <div className="flex items-center gap-1">
                  <Button size="icon" variant="ghost" onClick={() => handleEdit(c)}><Edit3 className="w-4 h-4" /></Button>
                  <Button size="icon" variant="ghost" onClick={() => handleDelete(c.id)} className="text-red-500"><Trash2 className="w-4 h-4" /></Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}