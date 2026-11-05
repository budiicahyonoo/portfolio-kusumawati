# Implementation Plan — Kusumawati Personal Portfolio

**Tanggal:** 5 November 2026
**Sumber kebutuhan:** [PRD-KUSUMAWATI.md](./PRD-KUSUMAWATI.md)
**Panduan desain/interaksi:** [ui.md](./ui.md)
**Kondisi teknis:** [PROJECT-ANALYSIS.md](./PROJECT-ANALYSIS.md)

## Ringkasan keputusan

PRD dan UI menggambarkan portfolio Kusumawati dengan enam halaman publik, bilingual English/Indonesia, dan CMS admin yang lebih luas dari template saat ini. Repository yang diperiksa adalah aplikasi Next.js App Router tunggal dengan halaman portfolio satu halaman, Route Handlers, Prisma/PostgreSQL, admin sederhana, dan upload Vercel Blob. Tidak ditemukan aplikasi NestJS atau struktur Turborepo di repository ini.

Karena PRD melarang membuat ulang arsitektur, rencana ini **mempertahankan Next.js App Router, Route Handlers, Prisma, PostgreSQL, dan Vercel Blob yang sudah ada**. Fitur baru dipetakan ke pola tersebut. Integrasi Maincore/NestJS harus diklarifikasi sebelum implementasi: jangan membuat monorepo atau service NestJS baru hanya berdasarkan tabel arahan teknis PRD.

Codebase Memory berstatus `ready` untuk project `D-Kumpulan-Projek-Full-Stack-Development-kusumawati-portfolio`; status terakhir yang diperiksa pada 5 November 2026 mencatat **1.425 node dan 3.112 edge**. Graph menemukan `PortfolioDashboard` dan cakupan yang diperiksa tidak melaporkan gap tercatat pada file terkait. `app/globals.css` tercatat parse-partial dan file rahasia/aset binary memang dikecualikan. Graph adalah sinyal best-effort dan dapat tertinggal dari perubahan terbaru; verifikasi akhir tetap menggunakan source, build, lint, dan audit.

## Progress aktual — 5 November 2026

Implementasi repository sudah melampaui baseline awal, tetapi belum seluruh acceptance criteria siap dinyatakan selesai.

| Area | Status aktual | Bukti / batasan |
|---|---|---|
| Keputusan arsitektur | Selesai: tetap memakai Next.js App Router, Prisma, PostgreSQL, dan Vercel Blob; tidak menambah service/monorepo baru. | T001; keputusan Maincore tercatat pada bagian Potensi masalah. |
| Admin dan autentikasi | Session admin, endpoint terproteksi, dashboard CMS, dan modul CRUD utama sudah tersedia. Form menampilkan contoh placeholder, tanda wajib isi, serta default select untuk record baru. | `app/admin/page.tsx`, `components/admin/portfolio-dashboard.tsx`, `app/api/**`; perlu acceptance test tiap endpoint. |
| Public portfolio | Halaman bilingual dan model konten target tersedia; foto dan CV Kusumawati tersedia di `public/`. | `app/[locale]/`, Prisma schema, dan aset publik; kelengkapan data database/terjemahan tetap tanggung jawab pemilik. |
| Pembersihan dan kualitas kode | Komponen admin lama yang tidak dipakai, hook duplikat, dan komponen background yang tidak dirujuk sudah dibuang. ESLint/type checking kini aktif; unused imports/variables yang ditemukan juga dibersihkan. | Build dan lint dijalankan; lint masih memiliki warning optimasi `<img>` dan navigasi, bukan error. |
| Dependency security | Audit dependency production berhasil bersih setelah memperbarui Zod dan memaksa versi Zod transitive `@vercel/cli-config` ke versi patched yang masih satu major. | `npm audit --omit=dev`: 0 vulnerability. Audit seluruh dependency masih melaporkan 8 moderate yang berada di dependency set non-production; tinjau lagi sebelum perubahan dependency berikutnya. |
| README dan deployment | README menjelaskan stack, local setup, admin bootstrap, environment variables, database, serta langkah deploy Vercel dan batas migration. | `README.md`; build tidak menjalankan pembuatan schema database. |
| Database dan rilis | Belum siap otomatis untuk migration production; belum ada migration history versioned. Konten/CRUD pada target production, backup, dan rencana migration masih perlu dikerjakan sebelum rilis. | T002, T006, T009, T025, T038–T045 tetap terbuka sesuai kriteria masing-masing. |

Pemeriksaan terakhir: `npm run build` berhasil; `npm run lint` tidak menemukan error, tetapi masih melaporkan warning; `npm audit --omit=dev` menemukan 0 vulnerability. Build lokal tidak membuktikan schema, kredensial, Blob, maupun seluruh alur CRUD berfungsi di Vercel.

## Requirement Mapping

Daftar di bawah mencakup requirement bernomor dan kelompok requirement di PRD. Untuk seksi yang tidak mempunyai nomor FR tersendiri, nama seksi dipakai agar cakupannya tetap terlacak.

| Requirement PRD | Kebutuhan yang dipetakan | Plan items | Implementasi yang menjadi bukti |
|---|---|---|---|
| FR-H, FR-H1, FR-H2, FR-H3, FR-H4, FR-H5, FR-H6, FR-H7 | Group Home; hero foto/nama/title/summary; CTA; kompetensi; featured experience/publications; konten admin-managed; featured configuration (H7 P2) | P1.3, P2.1, P4.1, P5.1 | [`prisma/schema.prisma`](../prisma/schema.prisma), [`app/page.tsx`](../app/page.tsx), halaman Home target di App Router, API publik dan admin Profile/Home |
| FR-ED (6.2) | Pendidikan, academic focus/projects, detail popup dengan foto/dokumen, pengelolaan admin | P1.3, P2.2, P3.2, P4.1, P4.3 | Prisma Education/AcademicProject, Route Handlers, halaman Education, dialog detail |
| FR-CERT (6.3) | Certification/training/journal/patent categories, detail, dokumen/verification/download, CRUD dan sorting | P1.3, P2.2, P3.2, P4.1, P4.3, P5.1 | Prisma domain sertifikasi/publikasi/paten, admin forms, halaman Certification, dialog/dokumen |
| FR-E, FR-E1, FR-E2, FR-E3, FR-E4, FR-E5 | Group Experience; Work/Internship/Speaker, edit kategori, featured/order, public hanya Published | P1.3, P2.3, P4.1, P5.1 | Prisma Experience, [`app/api/experiences/`](../app/api/experiences/), [`components/admin/portfolio-dashboard.tsx`](../components/admin/portfolio-dashboard.tsx), halaman Experience |
| FR-O (6.5) | CRUD organisasi, dokumentasi, sorting | P1.3, P2.3, P3.2, P4.1, P5.1 | Prisma Organization, admin/API, halaman Organization |
| FR-CON, FR-CON1, FR-CON2, FR-CON3, FR-CON4, FR-CON5 | Group Contact; form tervalidasi client/server dengan states dan anti-spam; kontak dapat diedit; pesan dikelola admin | P1.3, P1.4, P2.4, P4.1, P5.2 | Prisma Contact/ContactMessage, API contact, UI Contact dan admin message |
| FR-AUTH, FR-AUTH1, FR-AUTH2, FR-AUTH3, FR-AUTH4, FR-AUTH5, FR-AUTH6, FR-AUTH7, FR-AUTH8 | Group Authentication; login tanpa registrasi publik, halaman dan API terlindungi, session aman, logout, password tidak plaintext; perubahan password P2 | P1.2, P1.5, P5.2 | [`app/api/auth/route.ts`](../app/api/auth/route.ts), [`middleware.ts`](../middleware.ts), halaman login/admin dan guard seluruh Route Handlers |
| FR-DB, FR-DB1, FR-DB2, FR-DB3 | Group Dashboard Overview; statistik dashboard dari database, akses cepat, pesan terbaru P2 | P2.5 | API overview dan [`app/admin/page.tsx`](../app/admin/page.tsx) |
| FR-CRUD (7.3) | CRUD Profile, Education, Academic Projects, Experience, Certifications, Publications, Patents, Organizations, Media, CV/Documents, Contact Settings, Website Settings, Contact Messages; listing/search/filter/pagination/states | P1.3, P1.4, P2.1–P2.5, P3.1, P3.2 | Domain Prisma, `app/api/**`, `components/admin/**` |
| FR-LANG, FR-LANG1, FR-LANG2, FR-LANG3, FR-LANG4, FR-LANG5 | Group bilingual content; English + Indonesia, English default, terjemahan dikelola independen, fallback yang ditangani, indikator kelengkapan P2 | P1.3, P1.4, P2.1–P2.4, P4.2 | Field bilingual dan validasi, editor admin, language switcher, UI lokal |
| FR-MEDIA, FR-MEDIA1, FR-MEDIA2, FR-MEDIA3, FR-MEDIA4, FR-MEDIA5, FR-MEDIA6, FR-MEDIA7, FR-MEDIA8, FR-MEDIA9 | Group Media Library; upload backend terlindungi, token server-only, MIME/ukuran, reuse, perlindungan referensi Blob, penggantian P2, alt text/deskripsi P2 | P1.2, P1.3, P3.1, P3.2, P5.2 | [`app/api/upload/route.ts`](../app/api/upload/route.ts), model MediaAsset/relasi, Media Library |
| FR-PUB, FR-PUB1, FR-PUB2, FR-PUB3, FR-PUB4, FR-PUB5, FR-PUB6, FR-PUB7 | Group Draft & Publishing; draft default, publish/unpublish, draft tidak publik, featured/order, preview P2 | P1.3, P2.1–P2.3, P4.1, P5.1 | Field publikasi pada model konten, query API publik, admin controls/preview |
| FR-PROFILE (7.7) | Nama/title/summary bilingual, foto, CV, email/telepon, LinkedIn, lokasi, social links | P1.3, P2.1, P3.2, P4.1, P4.2 | Profile model/API/form dan Home/Contact publik |
| FR-SETTINGS (7.8) | Website title/description, default language, CTA, social/contact, SEO/OG, footer settings | P1.3, P2.4, P4.1, P5.2 | WebsiteSettings model/API/form, metadata/layout/footer |
| FR-MESSAGE (7.9) | Daftar/detail pesan; status Read/Unread/Archived bila diterapkan; hapus | P1.3, P1.4, P2.4, P2.5 | ContactMessage model/API, dashboard messages |
| NFR (11), Security (12), Acceptance Criteria (15) | Lighthouse, WCAG, responsive, SEO, security, error handling, CRUD API-only, no secrets, public-only Published | P1.2, P1.4, P2.1–P2.5, P3.1, P4.1–P4.3, P5.1–P5.2 | Implementasi end-to-end dan validasi pada bagian strategi kualitas |
| UI (4–15) | Visual tokens, enam navigasi publik, pola card/dialog, admin shell/list/form, responsive, accessibility, localization, motion/states | P1.5, P2.1–P2.5, P3.1, P4.1–P4.3, P5.2 | `app/globals.css`, `components/**`, halaman App Router, validasi responsive/a11y |
| Content Checklist (13), Target Audiences (3), Scope/Out of Scope (4) | Muat informasi portfolio yang disediakan dan disetujui; layani kebutuhan persona lewat halaman dalam scope; jangan menambah blog, komentar, registrasi publik, multi-tenant, atau e-commerce | P2.1–P2.4, P3.2, P4.1, P4.4 | Form admin dan data portfolio terverifikasi; enam halaman publik; tidak ada modul di luar scope |

## Kondisi repository dan kesesuaian

| Area | Kondisi yang terbukti | Dampak terhadap rencana |
|---|---|---|
| Struktur aplikasi | Next.js `16.4.5`, React `19.2.0`; halaman `app/page.tsx`, `app/admin/page.tsx`, `app/login/page.tsx`; backend memakai `app/api/**/route.ts`. | Tambah halaman publik dan endpoint di dalam App Router yang sama; jangan menambah NestJS/Turborepo tanpa keputusan integrasi yang didukung. |
| UI saat ini | Homepage dan section saat ini adalah portfolio yang berbeda; admin hanya memiliki tab Home, Skills, Projects, Experience, Blog, Contact. | Ganti/arah ulang konten ke enam halaman target dan tambahkan modul CMS yang tercantum di PRD. Jangan menganggap tab lama memenuhi modul baru. |
| Data | Prisma memiliki `Home`, `Skill`, `Project`, `Experience`, `Blog`, `Comment`, `Contact`; belum ada Education, Organization, MediaAsset, ContactMessage, atau WebsiteSettings. | Perlu perluasan schema serta rencana migrasi data yang mempertahankan konten yang perlu dipertahankan. |
| Publikasi | `Blog` mempunyai `is_published`; model portfolio lain belum mempunyai status publikasi/featured secara konsisten. | Terapkan perilaku Draft/Published pada tipe konten yang tampil publik; seluruh query publik wajib memfilter Published. |
| Bilingual | Model saat ini tidak memuat pasangan field bilingual atau locale handling. | Tambahkan konten EN/ID dan fallback eksplisit; keputusan bentuk schema perlu dibuat sebelum migrasi. |
| Auth | `POST /api/auth` membandingkan `ADMIN_PASSWORD` dan memberi cookie `admin_session`; middleware hanya menjaga halaman `/admin` dan `/login`. | Implementasi sekarang tidak memenuhi proteksi endpoint API, password hashing, logout, dan pengelolaan session yang diminta PRD. |
| Database config | `prisma.config.ts` membaca `DATABASE_URL`, sedangkan `lib/prisma.ts` membuat pool dengan connection string di source. Belum ditemukan direktori migrasi Prisma. | Blokir migrasi sampai konfigurasi koneksi dan cara menerapkan migrasi disepakati; jangan menyalin connection string ke dokumen atau client. |
| Media | `POST /api/upload` memakai Vercel Blob public access, namun route yang diperiksa belum menunjukkan auth, validasi MIME/ukuran, katalog media, atau pemeriksaan referensi sebelum hapus. | Perlu pengamanan backend, Media Library/metadata, relasi reuse, dan lifecycle Blob yang aman. |
| Teknologi dalam PRD | PRD menyebut Turborepo, pnpm, Next.js, NestJS, dan Maincore; repository ini tidak berisi monorepo/Turborepo atau aplikasi NestJS. | Konflik arsitektur harus dicatat dan diklarifikasi. Rencana memilih jalur kompatibel dengan repository, bukan membuat ulang fondasi. |
| Dokumentasi/data awal | PROJECT-ANALYSIS mencatat README/admin lama mengacu Supabase, sedangkan kode aktif menggunakan Prisma/PostgreSQL dan password cookie. PRD menandai sejumlah aset/terjemahan masih perlu disiapkan dan pertanyaan terbuka. | Source dan schema aktif menjadi acuan teknis. Jangan memasukkan identitas/aset/terjemahan yang belum disetujui sebagai fakta. |
| Blog/komentar | Template mempunyai Blog CRUD dan model Comment, tetapi PRD secara eksplisit mengecualikan Blog dan komentar pengunjung. | Jangan membangun atau mempromosikan modul tersebut sebagai bagian portfolio Kusumawati. Jangan menghapus tabel/data lama tanpa keputusan migrasi/retensi tersendiri. |

## Model data dan kebutuhan Prisma

Perluasan dilakukan di [`prisma/schema.prisma`](../prisma/schema.prisma), menggunakan PostgreSQL dan Prisma yang sudah dipakai. Entitas konseptual PRD yang harus terwakili:

- **Profile**: identitas, professional title, dua summary, foto, CV, kontak, lokasi, social links. Tentukan apakah model `Home` dapat dimigrasikan menjadi Profile secara aman atau tetap dipakai sebagai record profil; jangan memutus koneksi data lama tanpa strategi migrasi.
- **Education** dan **AcademicProject**: institusi/gelar/periode/GPA/lokasi/focus, detail proyek, status, urutan, featured bila relevan.
- **Experience**: Work/Internship/Speaker dengan organization, position, period, location, summary bilingual, responsibilities, skills, status, featured, sort order. Periode sama untuk dua posisi BRIN tidak boleh digabung.
- **Certification**, **Publication**, dan **Patent**: jenis, judul, tahun, issuer/publisher, deskripsi bilingual, tautan verifikasi, status, urutan, serta file pendukung.
- **Organization**: nama resmi, role, periode, deskripsi/kontribusi bilingual, status, urutan, featured bila diperlukan.
- **MediaAsset**: URL Blob, nama/file type/MIME/ukuran dan metadata yang diminta; alt text/deskripsi untuk kebutuhan P2. Relasi konten harus memungkinkan satu asset dipakai ulang oleh beberapa konten.
- **ContactMessage**: nama/email/subject/message/tanggal dan status bila alur status dipilih; status yang disarankan PRD adalah Unread/Read/Archived.
- **WebsiteSettings**: hanya pengaturan yang tercantum pada FR-SETTINGS.
- **Admin/session**: gunakan model/layanan autentikasi yang sesuai keputusan arsitektur; satu pemilik/admin cukup untuk fase ini, tanpa public registration atau hierarki peran.

Semua entitas konten publik perlu field umum `createdAt`, `updatedAt`, `status`, `sortOrder`, dan `isFeatured` hanya bila relevan sebagaimana PRD. Field teks yang disebut bilingual harus dapat disunting terpisah EN/ID. PRD memberi bentuk objek konseptual `{en, id}` tetapi tidak menentukan representasi penyimpanan final. Sebelum migrasi, pilih struktur JSON atau field kolom terpisah sesuai pola repository dan validasi/query Prisma; UI tidak boleh mengasumsikan representasi database.

**Perlu keputusan sebelum migrasi:** cara merepresentasikan variasi dokumen/media yang terhubung lintas entitas; bagaimana `Home`, `Project`, dan `Experience` lama dipetakan ke entitas target; serta bagaimana data lama/Blog disimpan selama transisi. Semua migrasi harus additive/terencana sampai kebutuhan retensi diketahui.

## API dan backend logic

Semua endpoint baru mengikuti Route Handler di `app/api/<resource>/route.ts` dan `app/api/<resource>/[id]/route.ts`, Prisma singleton, JSON response, serta validasi server-side. Endpoint yang diusulkan di bawah adalah pemetaan ke konvensi repository, bukan tambahan fitur di luar PRD.

| Domain | Kebutuhan API/backend |
|---|---|
| Auth | Login/logout/session; proteksi halaman dan **setiap** operasi admin; tidak ada registrasi; hash password dan expiry session sesuai keputusan auth yang aman. Lindungi seluruh route admin, termasuk upload. |
| Profile/settings | Baca data publik yang diizinkan; CRUD/update terbatas sesuai tabel PRD; validasi field dan kontrol metadata SEO/OG. |
| Education/academic projects, experience, certification/publication/patent, organization | List/detail dan CRUD admin; search/filter/pagination sesuai kebutuhan jumlah data; sorting, featured, status, validasi, error yang konsisten. |
| Public portfolio | Endpoint/query hanya mengekspos konten Published. Data profil/settings yang memang public disaring secara eksplisit; jangan mengembalikan draft atau field privat. |
| Contact | Public POST memvalidasi Name/Email/Subject/Message di server serta client dan menerapkan proteksi spam; admin dapat mengubah kontak dan membaca/mengelola pesan. PRD tidak menyebut pengiriman email/notifikasi, jadi jangan menambahkannya sebagai requirement. |
| Media | Authenticated upload dan operasi library, token Blob hanya server-side, validasi MIME/ukuran/jenis, metadata, serta pemeriksaan referensi sebelum hapus/ganti. Public Blob URL tetap pola storage yang sudah ada, dengan URL hanya disajikan melalui konten yang dipublikasikan. |
| Dashboard | Ringkasan statistik aktual untuk Education, Experience, Certifications, Publications, Patents, Organizations, Media, Messages, Draft, Published; quick links. Pesan terbaru merupakan P2. |

Validasi harus dilakukan di backend walaupun form memakai validasi client. Terapkan status HTTP/error JSON yang mudah dipetakan ke feedback UI. Jangan mengandalkan `middleware.ts` halaman sebagai pengganti guard API.

## Halaman, komponen, dan interaksi frontend

Gunakan route App Router dan komponen bersama. Rute publik target mengikuti enam halaman PRD: Home, Education, Certification, Experience, Organization, Contact. Pola URL final (mis. segment atau halaman tunggal dengan section) tidak ditentukan PRD; tetapkan sebelum implementasi navigasi/link dan SEO, sambil memenuhi enam halaman utama dan tidak mengubah arsitektur framework.

- **Public shell**: navbar sticky desktop dan drawer mobile, language switcher, active/focus states, footer, theme token, metadata/SEO.
- **Home**: hero dua kolom desktop; foto pemilik yang disediakan, title/summary, CTA Explore Experience, Download CV, Contact Me; ringkasan kompetensi dan featured Experience/Publication. Jika data/aset belum tersedia, sembunyikan atau tampilkan fallback netral, jangan membuat klaim/foto.
- **Education**: timeline/panel pendidikan dan kartu academic projects; action membuka detail termasuk foto/dokumen bila tersedia.
- **Certification**: chips/tabs All, Certifications, Training, Journals, Patents; kartu dan dialog detail untuk metadata, preview, verification, open/download.
- **Experience**: Work/Internship/Speaker segmented tabs, cards, detail dialog dengan summary/responsibilities/skills/gallery/documents.
- **Organization**: timeline/cards dengan nama resmi, role, period, contribution, dan dokumentasi.
- **Contact**: informasi langsung dan form; state default/focus/invalid/loading/success/error dan retry guidance.
- **Detail & dokumen**: satu pola dialog accessible, Escape/backdrop/close, focus trap/restore, scroll internal, PDF preview dengan fallback open/download.
- **Admin shell**: navigasi Dashboard, Profile, Education, Academic Projects, Experience, Certifications, Publications, Patents, Organizations, Media Library, CV & Documents, Contact Messages, Website Settings; desktop sidebar dan mobile drawer; logout.
- **Admin listings/forms**: Add/Edit/Delete dengan search/filter/pagination bila relevan; bilingual editor EN/ID, field states, Save Draft/Publish, confirmation, media selection/upload; tidak menambah tab Blog/Comments ke CMS target.
- **Media Library**: grid/list, preview, search/filter, select reuse, file size/type, upload progress hanya jika progress aktual tersedia, serta konfirmasi ketika asset masih direferensikan.

Gunakan spesifikasi visual dan interaction di [ui.md](./ui.md): palet biru/putih dan token konsisten, Plus Jakarta Sans, layout 360–1920px tanpa horizontal overflow, touch target mobile, contrast WCAG, keyboard/focus, reduced motion, meaningful alt text, serta tidak memakai foto/organisasi/angka/dokumen rekaan. Repo sudah mempunyai komponen UI, Lucide, toast, Tailwind v4, dan Plus Jakarta Sans; gunakan kembali yang cocok dan sesuaikan token, jangan membuat design system kedua.

## Pembagian tanggung jawab

| Backend | Frontend |
|---|---|
| Model Prisma, migrasi, validasi input, kontrak JSON, CRUD, publikasi/visibility, sorting, featured, search/filter/pagination, dashboard aggregates. | Halaman publik, admin shell/list/form, navigasi, language switcher, editor bilingual, dialog/gallery/document preview, form states dan responsive UI. |
| Auth/session, guard setiap endpoint admin, logout, password handling, rate/spam protection yang disepakati, error responses. | Login/logout UX, protected-route handling di UI sebagai pelengkap (bukan pengganti guard backend), pesan error dan success yang mudah dipahami. |
| Upload Blob server-only, MIME/size validation, asset metadata/reuse, cek referensi sebelum delete/replace. | Upload/select/preview UI, accepted formats dan batas ukuran yang nyata, progress jika tersedia, confirm dan feedback. |
| Public API hanya Published dan hanya field yang boleh publik; SEO/settings source sesuai scope. | Public sections/pages hanya menampilkan data yang dipublikasikan, metadata/OG, EN default dan ID switch, fallback terjemahan dan empty state. |

Integrasi frontend-backend harus menyepakati response, status, field bilingual, publication state, dan error shape sebelum modul dikerjakan paralel.

## Urutan implementasi dan dependensi

Dependencies utama: **arsitektur/config/auth → model & migrasi → kontrak/validasi API → admin CRUD → relasi media → public page dan locale → publish/SEO/accessibility validation**. Publikasi dan filter server harus tersedia sebelum halaman publik mengonsumsi data target.

## Status implementasi

Kode kini mencakup session admin bertanda tangan, guard Route Handler, model Prisma baru, shell dan form admin, API konten/media/kontak, serta enam halaman publik bilingual yang memakai foto dan CV asli dari `public/`. Checkbox di bawah hanya menandai task implementasi yang sudah terwujud dalam kode; itu bukan klaim bahwa database target, deployment, atau seluruh acceptance criteria telah lulus.

Masih tersisa: pemetaan/migrasi PostgreSQL additive, CRUD yang perlu diuji pada database aktif, penggantian media, pemuatan konten yang disetujui pemilik, serta pengukuran accessibility/Lighthouse dan acceptance end-to-end. Rate limit kontak saat ini process-local dan perlu store terdistribusi sebelum deployment serverless berskala.

**Validasi yang sudah dijalankan:** `npx prisma validate`, `npx prisma generate`, `npx tsc --noEmit`, dan `npm run build` lulus. Smoke test halaman `/en`, `/id`, lima section, foto, dan CV merespons HTTP 200; akses tanpa session ke enam admin API contoh merespons HTTP 401. Hallmark `sloplint --render` menghasilkan 5 screenshot (1280×800, 1440×900, 1920×1080, serta full-page 1440/375) dengan 0 FAIL, 0 open REFLEX, 0 WARN; 12 Reflex finding di-waive karena token warna putih/netral wajib dari `ui.md`. `npm run lint` gagal karena script `next lint` tidak didukung Next 16; repository tidak memiliki ESLint package/config. Endpoint yang membutuhkan database mengembalikan HTTP 500 pada lingkungan lokal, sehingga operasi CRUD belum dapat diklaim teruji. Lighthouse dan migration belum dijalankan.

### Phase 1 — Foundation

#### P1.1 — Kunci batas arsitektur dan konfigurasi
- **Requirements:** Technical Direction, FR-AUTH4, seluruh persyaratan Maincore conventions.
- **Backend:** Konfirmasi apakah/how Maincore terpakai; inventarisasi dependency/hosting; selesaikan perbedaan `DATABASE_URL` dengan koneksi Prisma Client dan cara migrasi.
- **Frontend:** Pastikan route/page convention dan dependency UI tetap dalam Next.js App Router.
- **Gate:** Keputusan tertulis menggunakan arsitektur Next.js repo atau kontrak integrasi Maincore yang konkret. Tidak membuat NestJS/Turborepo sebagai asumsi.
- **Tasks:**
  - [x] T001 [Plan:1.1] Dokumentasikan boundary Maincore dan keputusan target deployment dari bukti repository/kontrak yang tersedia; pertahankan Next App Router sampai ada keputusan valid.
  - [ ] T002 [Plan:1.1] Selesaikan konfigurasi datasource Prisma (`prisma.config.ts`, `lib/prisma.ts`) dan strategi migrasi sebelum schema deployment.

#### P1.2 — Amankan autentikasi dan endpoint admin
- **Requirements:** FR-AUTH1–AUTH8, FR-MEDIA1–2, Security Requirements.
- **Backend:** Ganti/tingkatkan alur sederhana saat ini agar password tidak plaintext, session memiliki expiry/logout, dan setiap admin API memeriksa autentikasi/otorisasi.
- **Frontend:** Login/logout dan navigasi admin menampilkan state sesuai hasil session.
- **Tasks:**
  - [x] T003 [Plan:1.2] Implementasikan layanan login/session/logout yang aman di dalam boundary Next.js yang disepakati; jangan menambah public registration.
  - [x] T004 [Plan:1.2] Tambahkan pemeriksaan auth pada semua Route Handlers admin termasuk `/api/upload`; halaman middleware saja tidak cukup.
  - [x] T005 [Plan:1.2] Perbarui login/admin UI dan aksi logout supaya mengikuti lifecycle session dan menampilkan error/loading yang benar.

#### P1.3 — Perluas schema data dan field lintas modul
- **Requirements:** FR-PROFILE, FR-ED, FR-CERT, FR-E, FR-O, FR-CRUD, FR-LANG, FR-PUB, FR-MEDIA, FR-MESSAGE, FR-SETTINGS.
- **Backend:** Tambahkan entitas dan relasi konseptual yang dibutuhkan; bilingual, status, featured, ordering, timestamps, media relation; migrasi aman dari model/data lama.
- **Tasks:**
  - [ ] T006 [Plan:1.3] Rancang mapping `Home`/`Project`/`Experience` lama ke Profile, AcademicProject, dan Experience tanpa kehilangan data yang dipertahankan.
  - [x] T007 [Plan:1.3] Perluas Prisma schema untuk Education, AcademicProject, Experience target, Certification, Publication, Patent, Organization, ContactMessage, WebsiteSettings, dan MediaAsset sesuai kebutuhan PRD.
  - [x] T008 [Plan:1.3] Tambahkan field bilingual, status draft/published, sort order, featured bila relevan, timestamps, serta relasi reusable media; tentukan JSON vs kolom bilingual sebelum menetapkan migrasi.
  - [ ] T009 [Plan:1.3] Buat dan verifikasi strategi migrasi PostgreSQL yang additive; dokumentasikan retensi model Blog/Comment lama tanpa menghapus data secara implisit.

#### P1.4 — Tetapkan validasi dan kontrak API bersama
- **Requirements:** FR-CRUD, FR-CON1, FR-LANG4, FR-MEDIA3–4, Security Requirements.
- **Backend:** Bentuk kontrak konsisten untuk field EN/ID, status, sort, error, pagination, dan validation.
- **Frontend:** Gunakan kontrak tersebut pada seluruh form dan listing.
- **Tasks:**
  - [ ] T010 [Plan:1.4] Definisikan bentuk request/response dan server validation per resource sesuai pola Route Handler saat ini.
  - [x] T011 [Plan:1.4] Definisikan aturan fallback terjemahan: jangan menyalin bahasa lain diam-diam; field yang kosong ditangani secara eksplisit tanpa blank/error.

#### P1.5 — Bangun admin shell dan navigasi publik
- **Requirements:** FR-AUTH1, FR-DB2, PRD sections 5/7, UI sections 4.1/6.1/6.2.
- **Frontend:** Admin shell/sidebar/drawer, logout slot, menu publik enam halaman dan locale selector.
- **Tasks:**
  - [x] T012 [Plan:1.5] Susun ulang `app/admin/page.tsx` menjadi shell modular untuk semua modul target dan responsive sidebar/drawer.
  - [x] T013 [Plan:1.5] Implementasikan public navbar enam item, language switcher, active/focus states, dan navigasi mobile.

### Phase 2 — Admin CRUD

#### P2.1 — Profile, contact settings, dan website settings
- **Requirements:** FR-PROFILE, FR-SETTINGS, FR-H1/H2/H6.
- **Backend:** Read/update data profil/settings dengan validasi dan hanya mengekspos field publik.
- **Frontend:** Form group profile bilingual, kontak, social, CV reference, CTA/SEO settings.
- **Tasks:**
  - [x] T014 [Plan:2.1] Implementasikan API dan form Profile untuk seluruh field FR-PROFILE.
  - [x] T015 [Plan:2.1] Implementasikan API dan form Website Settings untuk title/description/language/CTA/social/contact/SEO/OG/footer.

#### P2.2 — Education, academic project, certification, publication, patent CRUD
- **Requirements:** FR-ED, FR-CERT, FR-CRUD, FR-LANG, FR-PUB.
- **Backend:** CRUD, list/search/filter, status, ordering, featured bila sesuai; admin API terlindungi.
- **Frontend:** Listing dan EN/ID create/edit forms dengan category/status, confirmation, empty/loading/success/error.
- **Tasks:**
  - [x] T016 [Plan:2.2] Implementasikan API dan tab admin Education serta Academic Projects.
  - [x] T017 [Plan:2.2] Implementasikan API dan tab admin Certifications/Training.
  - [x] T018 [Plan:2.2] Implementasikan API dan tab admin Publications dan Patents sesuai kategori serta field dokumen/verifikasi.

#### P2.3 — Experience dan Organization CRUD
- **Requirements:** FR-E1–E4, FR-O, FR-CRUD, FR-LANG.
- **Tasks:**
  - [x] T019 [Plan:2.3] Implementasikan API dan admin forms Work/Internship/Speaker, dengan tiap posisi BRIN menjadi record terpisah.
  - [x] T020 [Plan:2.3] Implementasikan API dan admin form Organizations dengan periode, role, bilingual contribution, ordering dan media references.

#### P2.4 — Contact form/messages dan CRUD
- **Requirements:** FR-CON1–CON5, FR-MESSAGE, FR-CRUD.
- **Backend:** Public contact POST dengan validasi/spam protection; API admin untuk list/detail/status/delete messages dan update contact.
- **Frontend:** Public contact form state lengkap; admin inbox dengan sender/subject/date/status/detail/actions.
- **Tasks:**
  - [x] T021 [Plan:2.4] Implementasikan public API contact submission dengan server validation dan proteksi spam yang diputuskan saat desain teknis.
  - [x] T022 [Plan:2.4] Implementasikan admin API/UI untuk Contact Settings dan Contact Messages.

#### P2.5 — Dashboard overview
- **Requirements:** FR-DB1–DB3, UI 6.3.
- **Tasks:**
  - [x] T023 [Plan:2.5] Implementasikan query/API statistik aktual serta overview cards, draft/published counts, quick actions, dan pesan terbaru sebagai P2.

### Phase 3 — Media Management

#### P3.1 — Media Library aman
- **Requirements:** FR-MEDIA1–4, FR-MEDIA8–9, FR-CRUD.
- **Backend:** Authenticated upload, server-only Blob token, MIME/size validation, reject invalid formats, metadata, replace flow.
- **Frontend:** Grid/list, upload selection, preview, search/filter, progress aktual, alt text/deskripsi P2.
- **Tasks:**
  - [x] T024 [Plan:3.1] Amankan dan perluas `app/api/upload/route.ts` dengan auth, server-side MIME/size/format validation dan response error terstruktur.
  - [ ] T025 [Plan:3.1] Implementasikan API/library untuk listing, search/filter, metadata, preview URL, replace, dan penghapusan aman.
  - [x] T026 [Plan:3.1] Implementasikan UI Media Library, accepted formats/size, preview, loading/error/retry, dan alt text/deskripsi P2.

#### P3.2 — Hubungkan media ke konten dan dokumen
- **Requirements:** FR-ED, FR-CERT, FR-O, FR-MEDIA5–7, FR-PROFILE.
- **Tasks:**
  - [x] T027 [Plan:3.2] Implementasikan pemilihan/reuse asset dan relasi konten-many-to-many sesuai model, tanpa membuat salinan Blob yang tidak perlu.
  - [x] T028 [Plan:3.2] Cegah/konfirmasi penghapusan asset terpakai dan validasi semua references sebelum delete/replace Blob.
  - [x] T029 [Plan:3.2] Hubungkan CV, foto, sertifikat, dokumen, gallery ke form target dan pastikan preview mempunyai open/download fallback.

### Phase 4 — Public Portfolio

#### P4.1 — Enam halaman publik dan data published
- **Requirements:** FR-H1–H6, FR-ED, FR-CERT, FR-E5, FR-O, FR-CON4, Acceptance Criteria Public.
- **Backend:** Public queries/API hanya mengembalikan Published dan field publik.
- **Frontend:** Home, Education, Certification, Experience, Organization, Contact menggunakan data admin.
- **Tasks:**
  - [x] T030 [Plan:4.1] Buat public data queries/endpoints yang menyaring Draft dan tidak mengembalikan field privat.
  - [x] T031 [Plan:4.1] Implementasikan Home hero, CTA, competence summary, featured experience/publications, profile dan social links tanpa konten/aset rekaan.
  - [x] T032 [Plan:4.1] Implementasikan Education, Certification, Experience, dan Organization pages/cards/filters sesuai UI guide.
  - [x] T033 [Plan:4.1] Implementasikan Contact page dengan kontak yang dikelola admin dan menghubungkan form ke API public.

#### P4.2 — Bilingual experience
- **Requirements:** FR-LANG1–4, FR-H1/H2, UI 4.1/13.
- **Tasks:**
  - [ ] T034 [Plan:4.2] Implementasikan English default, switcher ke Bahasa Indonesia, locale-aware labels/dates, dan fallback terjemahan yang eksplisit.
  - [x] T035 [Plan:4.2] Pastikan semua public text yang ditampilkan dari konten bilingual mempertahankan nama resmi/istilah teknis dan tidak memalsukan terjemahan.

#### P4.3 — Popup detail dan document preview
- **Requirements:** FR-ED, FR-CERT, FR-E, UI 4.4–4.6/5/12.
- **Tasks:**
  - [x] T036 [Plan:4.3] Implementasikan pola accessible dialog untuk detail education/project/certificate/experience/organization dengan gallery dan dokumen.
  - [ ] T037 [Plan:4.3] Tambahkan PDF preview fallback open/download serta download CV tanpa memuat dokumen besar secara otomatis.

#### P4.4 — Muat konten awal terverifikasi
- **Requirements:** Content Checklist (PRD 13), FR-PROFILE, FR-ED, FR-CERT, FR-E, FR-O.
- **Backend:** Sediakan alur input melalui admin/API; tidak mengarang konten atau data.
- **Frontend:** Tampilkan hanya materi yang diserahkan pemilik dan disetujui untuk publikasi.
- **Tasks:**
  - [ ] T038 [Plan:4.4] Masukkan informasi profil, pendidikan, BRIN (dua record terpisah), internship, organisasi, sertifikasi K3, jurnal, paten, dan speaker dari sumber terverifikasi melalui CMS setelah modul siap.
  - [ ] T039 [Plan:4.4] Minta/pastikan aset dan English translation yang belum tersedia sebelum publish; jangan mengganti dengan foto, klaim, dokumen, atau terjemahan rekaan.

### Phase 5 — Publishing, quality, dan acceptance

#### P5.1 — Publishing controls dan preview
- **Requirements:** FR-PUB1–7, FR-E3–5, FR-H4–7.
- **Tasks:**
  - [ ] T040 [Plan:5.1] Lengkapi Save Draft/Publish/unpublish, featured, sorting, preview-before-publish P2, dan default Draft pada seluruh tipe konten publik.
  - [ ] T041 [Plan:5.1] Verifikasi query publik tidak pernah menampilkan Draft dan dashboard dapat mengelola published/draft secara independen.

#### P5.2 — Accessibility, security, SEO, responsive, dan reliability
- **Requirements:** NFR 11, Security 12, Acceptance Criteria 15, UI 7–14.
- **Tasks:**
  - [ ] T042 [Plan:5.2] Verifikasi responsive 360–1920px, tidak ada overflow, contrast WCAG AA, keyboard/focus, dialog semantics, alt text, dan reduced motion.
  - [ ] T043 [Plan:5.2] Verifikasi SEO title/description/OG, metadata, broken links/images, public-only data, no secret exposure, auth guard seluruh admin API, upload constraints dan contact spam defenses.
  - [ ] T044 [Plan:5.2] Ukur acceptance target Lighthouse mobile Performance ≥90, Accessibility ≥95, SEO ≥95; catat hasil dan gap, jangan mengklaim target tercapai tanpa pengukuran.
  - [ ] T045 [Plan:5.2] Jalankan validasi schema/migrasi, API, CRUD setiap modul, bilingual fallback, media-reference safety, dan seluruh Acceptance Criteria PRD.

## Potensi masalah, konflik, dan keputusan yang diperlukan

1. **Maincore vs arsitektur repo — diputuskan:** PRD §14 menetapkan repository ini sebagai basis final dan Maincore bukan dependency. Implementasi mempertahankan Next.js App Router; target deployment tetap perlu diputuskan sebelum rilis.
2. **Authentication — implementasi tersedia:** password bootstrap disimpan dengan bcrypt, session HMAC memiliki expiry, logout menghapus cookie, dan write/admin handlers memeriksa session. Uji lengkap tiap endpoint masih bagian acceptance (T043/T045).
3. **Koneksi database dan migrasi — belum terverifikasi:** schema dapat divalidasi/digenerate, tetapi migrasi additive dan CRUD pada database target belum dijalankan. Jangan menerapkan schema ke database target sebelum mapping/retensi disetujui.
4. **Schema/semantik — implementasi, pemetaan tersisa:** tipe target sudah ditambah; Publication dan Patent memakai kategori pada model Certification. Mapping data lama `Home`/`Project`/`Experience` serta retensi data Blog/Comment perlu diputuskan sebelum migrasi.
5. **Kontrak bilingual — aturan kode tersedia:** field EN/ID independen dan fallback locale eksplisit diterapkan di halaman publik. Terjemahan pemilik yang belum tersedia tetap harus diserahkan/dikonfirmasi sebelum publikasi.
6. **Kepemilikan media — sebagian selesai:** MediaAsset, relasi reuse, dan penolakan penghapusan aset terpakai sudah tersedia. Alur replace Blob masih belum diimplementasikan; media yang sudah dimiliki tetap dipertahankan.
7. **Kelengkapan aset/konten:** PRD menyebut foto profesional, CV, foto kegiatan, sertifikat, dokumen publikasi/paten, detail speaker, terjemahan tervalidasi, domain, nama lengkap, dan email admin sebagai hal yang belum disediakan/dipastikan. Jangan mengisi dengan aset atau fakta rekaan; konten final bergantung pada pemilik.
8. **Blog dan komentar — diputuskan:** PRD §14 menetapkan modul tersebut tidak digunakan pada UI target; data lama tidak dihapus otomatis dan harus dipertahankan sampai retensi/migrasi disetujui.
9. **Warna/komponen UI:** UI guide menetapkan palet token spesifik dan membatasi glass/gradient; stylesheet saat ini memakai tema biru yang nilainya tidak identik serta glass styling. Reuse komponen, tetapi token/visual yang bertentangan harus diselaraskan dengan `ui.md`, bukan ditumpuk.
10. **Password change, indikator translation completeness, asset replace, admin recent messages, dan preview:** semuanya P2; jangan menghambat foundation P1 kecuali menjadi dependency implementasi yang tak terhindarkan.

## Acceptance dan validasi per fase

- **Foundation:** schema dapat digenerate/migrasi pada database target yang disetujui; session admin dapat login/logout; akses tak terautentikasi ke setiap endpoint admin ditolak.
- **CRUD:** setiap modul dalam tabel PRD dapat list/create/read/update/delete sesuai dukungan modul; input invalid ditolak backend; search/filter/pagination digunakan pada listing yang memerlukannya; UI menyediakan loading/empty/error/success/confirmation.
- **Media:** hanya file yang diizinkan dapat diunggah; token tetap server-side; asset reusable; file terpakai tidak bisa terhapus tanpa resolusi referensi; fallback preview/download tersedia.
- **Public:** enam halaman menampilkan data dari CMS, English default dan ID switch berfungsi; hanya Published tampil; tidak ada broken link/image dan tidak ada fakta yang dibuat-buat.
- **Quality:** ukur target Lighthouse yang dinyatakan PRD; uji responsive 360–1920px, keyboard, WCAG contrast, reduced motion, SEO metadata, security, dan contact form.

## Batas rencana

Dokumen ini adalah requirement mapping dan urutan kerja, bukan persetujuan untuk mengganti framework. Status implementasi di atas mencatat pekerjaan pada repository ini; migrasi database, konten yang belum disetujui, dan pengukuran acceptance tetap terpisah.
