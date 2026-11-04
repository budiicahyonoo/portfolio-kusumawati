# PRD Update Portfolio – Budi Cahyono

Oct 7, 2026 · @Budi Cahono

## 1. Ringkasan & Latar Belakang

Portfolio Budi Cahyono diperbarui agar memosisikannya jelas sebagai Software Engineer, Full Stack Developer, dan AI Engineer, dengan bukti kerja yang dalam dan terukur, bukan sekadar daftar proyek.

Kondisi saat ini, berdasarkan desain yang sudah live:

- Hero memakai satu judul statis "Full Stack Developer" dengan tombol Hire me dan Download CV.
- Featured Projects punya filter AI / Web / Apps. Default sudah di tab AI, tetapi baru ada 1 proyek AI; tab Web berisi 9 proyek.
- Kartu proyek hanya memuat thumbnail, judul, deskripsi satu baris, tag teknologi, dan tombol Demo/Code. Beberapa proyek tidak punya tombol Code.
- Experience punya tab Work / Intern / Freelance dengan 3 kartu yang belum memuat pencapaian.
- Blog baru berisi 1 artikel dan label kategorinya terpotong.
- Belum ada section About, Skills, Education, Testimonials, Contact, maupun footer.
- Teks deskripsi di kartu biru berkontras rendah, ada teks yang perlu dikoreksi, dan bahasa bercampur Inggris-Indonesia.

Dokumen ini mengubah temuan tersebut menjadi requirement yang bisa dikerjakan dan diuji.

## 2. Tujuan & Metrik Keberhasilan

Tujuan utamanya: pengunjung memahami siapa Budi, apa spesialisasinya, dan percaya pada kemampuannya dalam waktu kurang dari satu menit, lalu menghubunginya.

1. Memosisikan identitas yang tajam: Software Engineer, Full Stack Developer, AI Engineer.
2. Membuktikan kedalaman lewat case study, peran, dan metrik per proyek.
3. Mengisi kekosongan AI dengan minimal 3 proyek AI yang kuat.
4. Memudahkan dihubungi dan mengubah kunjungan menjadi kontak.
5. Menjadikan portfolio itu sendiri bukti kualitas teknis (cepat, aksesibel, SEO baik).

Target di bawah adalah titik awal dan bisa disesuaikan.

| Metrik | Cara ukur | Target |
| --- | --- | --- |
| Lighthouse Performance (mobile) | Lighthouse / PageSpeed | ≥ 90 |
| Lighthouse Accessibility | Lighthouse | ≥ 95 |
| Lighthouse SEO | Lighthouse | ≥ 95 |
| Kontras teks | Pemeriksaan WCAG | ≥ 4,5:1 untuk semua teks |
| Proyek featured dengan case study | Hitung manual | 6 dari 6 |
| Proyek AI | Hitung manual | ≥ 3 (saat ini 1) |
| Artikel blog | Hitung manual | ≥ 5 (saat ini 1); minimal 3 sebelum section ditampilkan |
| Klik Hire me, Download CV, dan kirim form kontak | Analytics (Plausible/Umami) | Ukur baseline 30 hari, lalu naikkan |
| Link dibagikan tampil dengan preview | Uji Open Graph | Lolos di WhatsApp, LinkedIn, X |

## 3. Target Audiens & Persona

Portfolio ini melayani empat jenis pengunjung; rekruter dan engineering lead adalah prioritas utama karena mereka menilai kedalaman teknis dengan cepat.

| Persona | Yang dicari | Section kunci |
| --- | --- | --- |
| Rekruter / HR tech | Posisi, stack, pengalaman, kontak, CV | Hero, Skills, Experience, Contact |
| Hiring manager / engineering lead | Kedalaman teknis, arsitektur, dampak, kualitas kode | Case study, AI, Blog, GitHub |
| Klien freelance / startup | Bukti hasil, kecepatan kerja, cara memulai | Projects, Testimonials, Contact |
| Dosen, komunitas, kolaborator | Rekam jejak akademik dan kontribusi | About, Education, Achievements, Blog |

## 4. Ruang Lingkup

Update ini mencakup konten, struktur halaman, desain, dan kualitas teknis situs yang sudah ada; bukan membangun ulang dari nol.

**Termasuk (in scope)**

- Judul hero berganti otomatis: Software Engineer, Full Stack Developer, AI Engineer.
- Section baru: About, Skills, Education & Certifications, Achievements, Testimonials, Contact, Footer.
- Halaman case study per proyek featured, termasuk template khusus proyek AI.
- Perbaikan Experience, Blog, navigasi, kontras, bahasa, dan thumbnail.
- SEO, performa, aksesibilitas, analytics, dan custom domain.

**Tidak termasuk (out of scope)**

- Membuat proyek AI itu sendiri (dikerjakan terpisah; PRD ini hanya mengatur cara menampilkannya).
- Penulisan artikel blog lengkap dan pengumpulan testimoni (kebutuhan konten, bukan fitur).
- CMS penuh dengan panel admin; konten cukup dikelola lewat file/MDX.
- Fitur akun pengguna, komentar, atau e-commerce.
- Dark mode dan toggle bahasa ID/EN masuk fase opsional (lihat Roadmap).

## 5. Struktur Informasi & Navigasi

Urutan section baru mengikuti cara rekruter membaca: siapa kamu, apa keahlianmu, buktinya, lalu cara menghubungi.

1. Hero: nama, judul bergantian, value statement, status ketersediaan, CTA.
2. About + Skills: bio singkat, statistik, tech stack per kategori.
3. Featured Projects: default tab AI, lalu Web dan Apps.
4. Experience: tab Work / Intern / Freelance dengan pencapaian.
5. Education & Certifications, serta Achievements.
6. Blog.
7. Testimonials.
8. Contact.
9. Footer.

Halaman turunan: `/projects/[slug]` untuk case study dan `/blog/[slug]` untuk artikel.

**Navigasi atas:** Home, About, Skills, Projects, Experience, Blog, Contact. Navigasi bersifat sticky, menyorot section yang sedang aktif saat scroll, dan berubah menjadi menu hamburger di mobile.

## 6. Requirement Fungsional

Setiap requirement diberi kode agar mudah dirujuk saat pengerjaan dan pengujian. Prioritas: **P1** wajib, **P2** penting, **P3** opsional.

### 6.1 Hero (FR-H)

- **FR-H1 (P1) Judul bergantian.** Teks di bawah nama berganti otomatis dengan efek mengetik: Software Engineer → Full Stack Developer → AI Engineer, lalu mengulang dari awal.
  - Kecepatan ketik 70 ms per karakter, hapus 40 ms per karakter, jeda 1,8 detik setelah kata selesai.
  - Kursor "|" berkedip, seperti desain saat ini.
  - Kata pertama dirender di HTML awal agar terbaca mesin pencari dan saat JavaScript belum jalan.
  - Tinggi dan lebar area dikunci agar layout tidak bergeser (CLS 0).
  - Jika pengguna mengaktifkan prefers-reduced-motion, animasi dimatikan dan ditampilkan statis "Software Engineer · Full Stack Developer · AI Engineer".
  - Pembaca layar membaca satu label statis, bukan tiap huruf (aria-label, tanpa aria-live).
- **FR-H2 (P1) Value statement** satu kalimat di bawah judul. Draf: "Membangun sistem web & AI yang scalable untuk bisnis dan kampus."
- **FR-H3 (P2) Badge ketersediaan** "Open to work / Available for freelance", bisa dimatikan lewat satu pengaturan.
- **FR-H4 (P1) CTA.** Hire me menggulir ke section Contact (atau membuka email/WhatsApp); Download CV mengunduh PDF terbaru. Klik keduanya dicatat di analytics.
- **FR-H5 (P1) Ikon sosial** (GitHub, LinkedIn, Email, X, Threads) memiliki tooltip dan aria-label.
- **FR-H6 (P2) Foto** di-crop ulang agar komposisi seimbang, memakai WebP/AVIF, dan dimuat dengan prioritas tinggi.

### 6.2 About & Skills (FR-A)

- **FR-A1 (P1)** Bio 3–4 kalimat: siapa kamu, fokus apa, sedang belajar apa.
- **FR-A2 (P2)** Statistik ringkas: tahun pengalaman, jumlah proyek, jumlah pengguna/klien (angka diisi Budi, hanya yang bisa dibuktikan).
- **FR-A3 (P1) Skills per kategori:** Frontend, Backend, Database, DevOps/Cloud, AI/ML, Tools. Ditampilkan sebagai ikon/badge, bukan bar persentase.
- **FR-A4 (P3)** Blok "Sedang dipelajari" untuk menunjukkan arah belajar.

## 7. Requirement Non-Fungsional

Karena Budi menargetkan peran software dan AI, kualitas teknis portfolio ini ikut dinilai sebagai bukti kemampuan.

| Aspek | Requirement | Target |
| --- | --- | --- |
| Performa | Gambar WebP/AVIF dengan ukuran responsif dan lazy loading, font di-subset, animasi ringan | Lighthouse mobile ≥ 90; LCP ≤ 2,5 detik; CLS ≤ 0,1; INP ≤ 200 ms |
| SEO | Title dan meta description per halaman, Open Graph dan Twitter card, sitemap.xml, robots.txt, canonical, structured data Person (JSON-LD), heading terstruktur | Lighthouse SEO ≥ 95; preview tampil benar di WhatsApp, LinkedIn, X |
| Aksesibilitas | Kontras teks, navigasi keyboard dan fokus terlihat, alt text, aria-label ikon, dukungan reduced-motion, hierarki heading | Kontras ≥ 4,5:1; Lighthouse Accessibility ≥ 95 |
| Responsif | Tata letak nyaman dari 360 px sampai 1920 px | Diuji di Chrome Android, Safari iOS, dan desktop |
| Keamanan | HTTPS, security headers (CSP, HSTS), perlindungan form, tidak ada secret di repositori | Tanpa temuan pada pemeriksaan header |
| Analytics & privasi | Analytics ringan (Plausible atau Umami) tanpa cookie pelacak | Tidak perlu banner cookie |
| Keandalan | Halaman 404 kustom, favicon, custom domain (misalnya budicahyono.dev) | Domain aktif dengan HTTPS |

## 8. Desain & UX

Desain saat ini sudah bersih dan modern; perubahan berfokus pada keterbacaan, hirarki, dan konsistensi, bukan mengganti identitas visual.

- **Kontras:** deskripsi proyek (abu-abu terang di atas kartu biru muda) diganti warna yang memenuhi rasio ≥ 4,5:1, termasuk teks pada tombol dan tab.
- **Variasi latar section:** kurangi blok biru solid yang berulang; selang-seling dengan latar terang, gradasi halus, atau netral.
- **Hirarki kartu:** 2–3 proyek unggulan berukuran besar, sisanya lebih kecil.
- **Hero:** komposisi foto diseimbangkan; area judul bergantian punya ruang tetap (lihat FR-H1).
- **Animasi mikro:** hover kartu dan scroll reveal dengan durasi ≤ 300 ms, dimatikan saat reduced-motion aktif.
- **Konsistensi:** logo Experience seragam, label tab tidak terpotong, satu bahasa utama, ikon dengan gaya sama.
- **Design tokens:** warna, tipografi, jarak, dan radius didefinisikan sekali agar section baru (About, Skills, Contact) selaras dengan yang ada.
- **Dark mode (P3):** opsional, nilai tambah di kalangan developer.
- **Mobile first:** filter dan tab proyek bisa digeser horizontal; tombol minimal 44 px.

## 9. Checklist Konten dari Budi

Konten adalah penghambat terbesar proyek ini; daftar berikut disiapkan lebih dulu agar pengembangan tidak menunggu.

- [ ] Value statement final untuk hero
- [ ] Bio 3–4 kalimat dan daftar "sedang dipelajari"
- [ ] CV PDF terbaru
- [ ] Foto hero baru dengan crop seimbang
- [ ] Daftar skills per kategori (Frontend, Backend, Database, DevOps/Cloud, AI/ML, Tools)
- [ ] 6 proyek featured terpilih, masing-masing: screenshot fitur utama, peran, 1 metrik dampak, link demo, link repo atau alasan private, tantangan teknis, diagram arsitektur
- [ ] 3 proyek AI, masing-masing: model, dataset, metrik evaluasi, deployment, demo atau video 30–60 detik
- [ ] 2–3 poin pencapaian untuk tiap pengalaman, logo versi seragam, tanggal terverifikasi
- [ ] Data pendidikan, sertifikasi, dan achievements
- [ ] 3–5 artikel blog
- [ ] 3 testimoni beserta izin tampil (bila ada)
- [ ] Email, nomor WhatsApp, dan tautan sosial yang akan ditampilkan
- [ ] Pilihan custom domain

## 10. Rencana Teknis

Stack situs saat ini belum diketahui dari tampilannya, jadi rekomendasi berikut mengikuti pilihan umum dan bisa disesuaikan dengan stack yang sudah dipakai.

| Area | Rekomendasi |
| --- | --- |
| Framework | Next.js (App Router) atau framework yang sudah dipakai saat ini |
| Styling | Tailwind CSS dengan design tokens |
| Konten | File MDX/JSON di repositori untuk proyek, artikel, dan pengalaman; tanpa CMS |
| Animasi judul | Komponen mengetik kecil (CSS atau JavaScript ringan); tanpa library besar |
| Form kontak | Route API dengan Resend atau Formspree, honeypot, dan pembatasan laju |
| Analytics | Plausible atau Umami |
| Hosting | Vercel atau Netlify dengan custom domain dan HTTPS |
| Kualitas | Lighthouse CI di setiap deploy; pemeriksaan aksesibilitas otomatis (axe) |

Data proyek disimpan terstruktur agar kartu dan halaman case study memakai sumber yang sama:

```ts
type Project = {
  slug: string;
  title: string;
  category: "ai" | "web" | "apps";
  summary: string;          // 1–2 kalimat
  role: "solo" | "lead" | "contributor";
  metric?: string;          // misalnya "dipakai 300+ mahasiswa"
  stack: string[];
  links: { demo?: string; code?: string; privateReason?: string };
  featured: boolean;
  ai?: { model: string; dataset: string; evaluation: string; deployment: string };
};
```

## 11. Roadmap & Prioritas

Rilis bertahap dalam sekitar 8 minggu, dengan asumsi Budi mengerjakan sendiri sambil menyiapkan konten. Tiap fase punya gerbang (gate) yang harus lolos sebelum lanjut.

1. **Fase 1: Quick wins (minggu 1–2).** Judul bergantian, perbaikan kontras, koreksi typo dan bahasa, label tab Blog, navigasi baru, footer, dan section Contact. *Gate:* kontras lolos 4,5:1 dan tidak ada teks terpotong.
2. **Fase 2: Konten inti (minggu 2–4).** About + Skills, template case study, dan 6 proyek featured lengkap dengan peran dan metrik. *Gate:* 6 dari 6 case study terbit.
3. **Fase 3: Section AI (minggu 3–6).** Template case study AI dan 3 proyek AI dengan demo. *Gate:* minimal 3 proyek AI tampil di tab default.
4. **Fase 4: Experience dan pelengkap (minggu 5–7).** Pencapaian, Education & Certifications, Achievements, Blog 3–5 artikel, dan Testimonials. *Gate:* tiap posisi memiliki pencapaian terukur; Blog hanya tampil bila ≥ 3 artikel.
5. **Fase 5: Kualitas teknis (minggu 7–8).** SEO, performa, aksesibilitas, analytics, custom domain, halaman 404. *Gate:* semua target Lighthouse tercapai.
6. **Fase 6: Opsional.** Dark mode, toggle bahasa ID/EN, RSS, dan penyempurnaan animasi.

| Prioritas | Item | Fase |
| --- | --- | --- |
| Tinggi | About & Skills; case study dan metrik; proyek AI; perbaikan kontras | 1–3 |
| Sedang | Pencapaian Experience; Contact dan footer; SEO dan performa | 1, 4, 5 |
| Rendah | Blog diperbanyak atau disembunyikan sementara; dark mode dan animasi | 4, 6 |

## 12. Risiko & Asumsi

Risiko terbesar adalah konten yang tidak siap tepat waktu, karena kode bisa selesai lebih cepat daripada case study dan proyek AI.

| Risiko | Dampak | Mitigasi |
| --- | --- | --- |
| Case study dan metrik memakan waktu | Rilis mundur | Kerjakan 2 proyek terbaik dulu; pakai template tetap |
| Repositori private atau terikat NDA | Tombol Code kosong | Label "Private repo" dengan alasan, atau versi yang disanitasi |
| Proyek AI belum cukup | Tab default terlihat kosong | Mulai dari 1 proyek kecil yang selesai tuntas; tampilkan hanya yang nyata |
| Metrik dampak tidak punya data | Klaim lemah | Gunakan angka yang dapat dibuktikan atau hasil kualitatif; jangan mengarang angka |
| Animasi dan gambar memperlambat situs | Skor performa turun | Animasi CSS ringan, gambar dioptimasi, Lighthouse CI |
| Blog hanya 1–2 artikel | Section terlihat kosong | Sembunyikan hingga ≥ 3 artikel |

Asumsi: Budi mengerjakan sendiri; situs memakai stack web modern yang bisa dikembangkan; seluruh data pengalaman dan proyek berasal dari Budi; dan perubahan diterapkan pada situs yang sudah ada.

## 13. Acceptance Criteria

Rilis dianggap selesai bila seluruh butir berikut terpenuhi.

- [ ] Judul hero berganti Software Engineer → Full Stack Developer → AI Engineer, berulang tanpa pergeseran layout, dan statis saat reduced-motion aktif.
- [ ] Tab AI menjadi default dan berisi minimal 3 proyek AI dengan demo dan metrik evaluasi.
- [ ] 6 proyek featured punya halaman case study lengkap dengan peran dan metrik.
- [ ] Tidak ada tombol Code kosong; repositori private diberi label dan alasan.
- [ ] Semua teks lolos kontras 4,5:1 dan tidak ada label terpotong atau typo.
- [ ] About, Skills, Experience dengan pencapaian, Education, Contact, dan Footer tampil.
- [ ] Blog tampil hanya bila ≥ 3 artikel, dengan tanggal dan tag.
- [ ] Lighthouse mobile: Performance ≥ 90, Accessibility ≥ 95, SEO ≥ 95.
- [ ] Preview link benar di WhatsApp, LinkedIn, dan X; sitemap dan robots aktif.
- [ ] Form kontak berhasil mengirim pesan dan terlindungi dari spam.
- [ ] Situs diuji di layar 360 px, tablet, dan desktop, serta di Chrome dan Safari.
- [ ] Custom domain aktif dengan HTTPS dan analytics berjalan.

## 14. Pertanyaan Terbuka

Jawaban atas butir berikut menentukan detail pengerjaan; sisanya sudah bisa dimulai.

- Bahasa utama situs: Inggris, Indonesia, atau dua-duanya dengan toggle?
- Stack situs saat ini (framework, hosting) agar rencana teknis disesuaikan?
- Tiga proyek AI mana yang akan dibuat atau ditampilkan?
- Posisi utama yang dituju: AI Engineer lebih dulu, atau Full Stack dan AI setara?
- Kontak utama yang ditampilkan: email, WhatsApp, atau keduanya?
- Apakah sudah punya domain sendiri, dan apa nama yang diinginkan?
- Apakah ada testimoni yang bisa dipakai, dan sudah ada izinnya?
- Ejaan nama "Poin of Sale" sudah sesuai, atau seharusnya "Point of Sale"?

### 6.3 Projects (FR-P)

- **FR-P1 (P1) Filter** AI / Web / Apps tetap ada, default tab AI. Kategori terpilih tersimpan di URL (misalnya `?cat=ai`) agar bisa dibagikan.
- **FR-P2 (P1) Isi kartu:** thumbnail fitur utama (dashboard atau tampilan inti, bukan halaman login), judul, deskripsi 1–2 kalimat, peran (solo / lead / kontributor), satu metrik dampak, tag teknologi, serta tombol Case Study, Demo, dan Code.
- **FR-P3 (P1) Tombol Code konsisten.** Jika repositori private, tampilkan label "Private repo" dengan alasan singkat (misalnya NDA klien), atau sediakan versi yang sudah disanitasi. Saat ini Sobat Bank Sampah, Kasbon Tracker, School Integrated Digital System, dan Poin of Sale hanya punya Demo.
- **FR-P4 (P1) Halaman case study** per proyek featured dengan urutan: masalah → solusi → arsitektur (diagram) → tantangan teknis → hasil dan metrik → peran dan tim → tech stack → tautan → hal yang dipelajari.
- **FR-P5 (P1) Pilih 6 proyek featured**, dengan 2–3 di antaranya tampil lebih besar. Sisanya masuk "Lihat semua proyek".
- **FR-P6 (P1) Koreksi teks.** Periksa "Laboratorium management schedule" dan "Poin of Sale" (pastikan ejaan nama yang dimaksud), serta seragamkan bahasa semua deskripsi.
- **FR-P7 (P2)** Proyek yang tampilannya mirip (HRIS dan School Integrated Digital System) digabung, atau dibedakan lewat screenshot fitur yang berbeda.
- **FR-P8 (P2)** Thumbnail berupa 1 gambar utama; galeri 3–4 screenshot ditampilkan di halaman case study.

### 6.4 Section AI (FR-AI)

Tab AI adalah tab default, tetapi baru berisi 1 proyek. Targetnya minimal 3 proyek AI dengan bukti teknis yang bisa diperiksa.

- **FR-AI1 (P1) Minimal 3 proyek AI** sebelum rilis akhir. Jika baru 1–2 yang siap, rilis bertahap dan beri label "Segera hadir" hanya bila memang sedang dikerjakan.
- **FR-AI2 (P1) Template case study AI** menambahkan field: model yang dipakai, dataset (sumber dan ukuran), metrik evaluasi (accuracy, F1, latency, biaya per permintaan), cara deployment, keterbatasan dan pertimbangan etika.
- **FR-AI3 (P1) Demo interaktif atau video** 30–60 detik per proyek AI.
- **FR-AI4 (P2)** Tautan ke Hugging Face, Kaggle, atau notebook bila ada.
- **FR-AI5 (P2)** Ringkasan di atas daftar proyek AI: stack AI yang dikuasai (misalnya LLM/RAG, computer vision, MLOps).

Usulan jenis proyek AI (Budi memilih yang paling sesuai):

| Jenis proyek | Menunjukkan kemampuan | Bukti yang ditampilkan |
| --- | --- | --- |
| RAG chatbot (misalnya FAQ kampus atau dokumen internal) | LLM, embedding, vector database, evaluasi jawaban | Demo chat, akurasi jawaban pada set uji |
| Computer vision atau klasifikasi | Training/fine-tuning, evaluasi model | Confusion matrix, demo unggah gambar |
| AI agent atau pipeline ML ujung ke ujung | Orkestrasi, tool use, MLOps, deployment | Diagram arsitektur, latency dan biaya |

### 6.5 Experience (FR-E)

- **FR-E1 (P1) Pencapaian.** Tiap posisi memuat 2–3 poin dengan format aksi + hasil terukur, misalnya "Membangun X yang meningkatkan Y sebesar Z%".
- **FR-E2 (P1) Tanggal akurat dan konsisten.** Urutkan dari terbaru, tulis "Present" bila posisi masih berjalan, dan beri catatan bila dua peran berjalan bersamaan (saat ini Dec 2025 – Aug 2026 beririsan dengan May 2026 – Jun 2026).
- **FR-E3 (P2)** Kartu bisa diklik untuk melihat tanggung jawab, stack, dan hasil secara lengkap.
- **FR-E4 (P2)** Logo perusahaan seragam: rasio sama dan latar netral (saat ini abu-abu, biru, dan hijau berbeda-beda).
- **FR-E5 (P2)** Peran Project Manager diberi penjelasan relevansi (kepemimpinan, delivery, koordinasi tim) agar menjadi nilai tambah di profil developer.
- Tab Work / Intern / Freelance dipertahankan.

### 6.6 Education, Certifications & Achievements (FR-ED)

- **FR-ED1 (P2)** Pendidikan: institusi, jurusan, periode.
- **FR-ED2 (P2)** Sertifikasi (cloud, AI, dan lainnya) dengan tautan verifikasi.
- **FR-ED3 (P3)** Achievements: hackathon, kompetisi, open source, publikasi.

### 6.7 Blog (FR-B)

- **FR-B1 (P1)** Section Blog hanya tampil bila ada minimal 3 artikel (pengaturan sederhana). Target awal 5 artikel.
- **FR-B2 (P1)** Label kategori ditulis lengkap dan tidak terpotong (saat ini "What You", "How You", "Lessons From").
- **FR-B3 (P1)** Kartu artikel menampilkan tanggal terbit, tag, dan waktu baca.
- **FR-B4 (P2)** Halaman artikel: syntax highlighting, daftar isi, tombol bagikan, dan artikel terkait.
- **FR-B5 (P3)** RSS feed.
- Topik yang disarankan: tutorial teknis, post-mortem proyek, perbandingan tools, catatan belajar AI.

### 6.8 Testimonials (FR-T)

- **FR-T1 (P2)** 3 testimoni dari klien, atasan, atau dosen (dengan izin): kutipan, nama, peran, foto opsional.
- **FR-T2 (P2)** Bila belum ada testimoni, section disembunyikan dan diganti angka dampak di About.

### 6.9 Contact & Footer (FR-C)

- **FR-C1 (P1) Form kontak:** nama, email, pesan. Validasi di sisi klien dan server, perlindungan spam (honeypot dan pembatasan laju), dan pesan konfirmasi setelah terkirim.
- **FR-C2 (P1)** Kontak langsung: email dan WhatsApp, plus tautan sosial.
- **FR-C3 (P1) Footer:** navigasi, tautan sosial, copyright, dan tech stack yang dipakai membangun portfolio.
- **FR-C4 (P2)** Halaman 404 kustom dan favicon.

### 6.10 Navigasi & Bahasa (FR-N)

- **FR-N1 (P1)** Navigasi sticky dengan penyorotan section aktif dan menu hamburger di mobile.
- **FR-N2 (P1)** Satu bahasa utama dipakai konsisten di seluruh situs (keputusan di Pertanyaan Terbuka).
- **FR-N3 (P3)** Toggle bahasa ID/EN, bila kedua bahasa dibutuhkan.
