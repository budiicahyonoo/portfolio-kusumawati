# PRD – Kusumawati Personal Portfolio & Admin Dashboard

**November 4, 2026 · Product Requirements Document · Versi 1.1 (revisi arahan teknis)**

## 1. Ringkasan & Latar Belakang

Kusumawati Personal Portfolio merupakan website profesional untuk membangun personal branding di bidang Chemical Engineering, Research & Development (R&D), Laboratory Analysis, dan Process Engineering.

Website dirancang sebagai platform portfolio dinamis yang terdiri dari dua bagian utama:

1. **Public Portfolio:** Website yang dapat diakses pengunjung untuk melihat profil, pendidikan, sertifikasi, pengalaman, organisasi, dan informasi kontak.
2. **Admin Dashboard:** Dashboard privat untuk mengelola seluruh konten portfolio melalui operasi Create, Read, Update, dan Delete (CRUD).

Pemilik portfolio dapat menambah, mengubah, menghapus, mengatur urutan, mengunggah dokumentasi, serta mengatur publikasi konten tanpa mengubah source code.

Website menyediakan bahasa English dan Indonesia dengan English sebagai bahasa default.

## 2. Tujuan & Metrik Keberhasilan

1. Membangun personal branding profesional di bidang Chemical Engineering.
2. Menampilkan pengalaman profesional dan penelitian secara terstruktur.
3. Mempermudah pengelolaan konten melalui admin dashboard.
4. Mendukung pengelolaan foto, sertifikat, publikasi, dan dokumen menggunakan Vercel Blob.
5. Menyediakan website bilingual.
6. Mempermudah recruiter, perusahaan, peneliti, dan institusi akademik mengakses informasi portfolio.

| Metrik | Target |
|---|---|
| Lighthouse Performance (mobile) | ≥ 90 |
| Lighthouse Accessibility | ≥ 95 |
| Lighthouse SEO | ≥ 95 |
| Responsive | 360px–1920px |
| Bahasa | English dan Indonesia |
| Default language | English |
| CRUD seluruh modul | Berfungsi |
| Upload dan pengelolaan file | Berfungsi |
| Admin authentication | Terproteksi |
| Broken links | 0 |

## 3. Target Audiens

| Persona | Kebutuhan | Section |
|---|---|---|
| Recruiter / HR | Profil, pendidikan, pengalaman, CV | Home, Education, Experience |
| Perusahaan manufaktur | Pengalaman proses industri dan laboratorium | Experience, Certification |
| Researcher / Akademisi | Penelitian, publikasi, proyek ilmiah | Education, Certification |
| Institusi dan komunitas | Organisasi dan pengalaman speaker | Organization, Experience |
| Portfolio Owner | Mengelola seluruh informasi website | Admin Dashboard |

## 4. Ruang Lingkup

### 4.1 Public Portfolio

- Home.
- Education.
- Certification.
- Experience.
- Organization.
- Contact.
- Popup detail.
- Language switcher.
- Download CV.
- Gallery dan document preview.

### 4.2 Admin Dashboard

- Admin authentication.
- Dashboard overview.
- Profile management.
- Education management.
- Academic project management.
- Certification management.
- Publication management.
- Patent management.
- Experience management.
- Organization management.
- Media library.
- CV management.
- Contact information management.
- Contact message management.
- Website settings.
- Bilingual content management.
- Draft dan publish management.

### 4.3 Out of Scope

- Public registration.
- Multiple admin roles atau permission hierarchy kompleks.
- CMS multi-tenant.
- Blog.
- Komentar pengunjung.
- E-commerce.
- Fitur yang tidak berhubungan dengan pengelolaan personal portfolio.

Catatan: repository awal memuat modul Blog dan Comment. Keduanya tidak termasuk portfolio ini. Modul tersebut tidak dikembangkan dan tidak tampil di navigasi publik maupun admin. Penonaktifan atau penghapusan UI dan data lama ditentukan terpisah (lihat Bagian 17).

## 5. Struktur Informasi & Navigasi

### 5.1 Public Website

Enam halaman utama:

1. Home.
2. Education.
3. Certification.
4. Experience.
5. Organization.
6. Contact.

Navbar menyediakan language switcher English / Indonesia.

### 5.2 Admin Dashboard

Admin menggunakan route terpisah, misalnya `/admin`.

Struktur navigasi:

1. Dashboard.
2. Profile.
3. Education.
4. Academic Projects.
5. Experience.
6. Certifications.
7. Publications.
8. Patents.
9. Organizations.
10. Media Library.
11. CV & Documents.
12. Contact Messages.
13. Website Settings.

Admin dashboard tidak ditampilkan pada navigasi public website.

## 6. Functional Requirements – Public Website

### 6.1 Home (FR-H)

- FR-H1 (P1): Hero menampilkan foto profesional, nama, professional title, dan deskripsi.
- FR-H2 (P1): CTA Download CV, Explore Experience, dan Contact Me.
- FR-H3 (P1): Menampilkan ringkasan kompetensi.
- FR-H4 (P1): Menampilkan featured experience.
- FR-H5 (P1): Menampilkan featured publications.
- FR-H6 (P1): Konten berasal dari data yang dikelola melalui admin.
- FR-H7 (P2): Mendukung featured content yang dapat diatur melalui dashboard.

Professional title awal: **Chemical Engineering Graduate**.

### 6.2 Education (FR-ED)

Menampilkan:

- Institution.
- Degree.
- Period.
- GPA.
- Location.
- Academic Focus.
- Academic Projects.

Setiap item dapat dibuka melalui popup untuk menampilkan informasi lengkap, foto, dan dokumen pendukung.

Data pendidikan dan proyek akademik harus dapat dikelola melalui admin.

### 6.3 Certification (FR-CERT)

Kategori:

- Professional Certification.
- Technical Training.
- Journal Publications.
- Patent Publications.

Setiap item menampilkan preview dan dapat membuka popup detail.

Popup mendukung:

- Title.
- Category.
- Year.
- Issuer / Publisher.
- Description.
- Document Preview.
- Verification Link.
- Download Document.

Konten dapat ditambahkan, diperbarui, dihapus, dan diatur urutannya melalui admin.

### 6.4 Experience (FR-E)

Tersedia tiga kategori:

- Work.
- Internship.
- Speaker.

Data pengalaman awal:

**Work**

1. BRIN – Research Assistant, Coal Processing and Utilization.
   - November 2024 – October 2025.
2. BRIN – Laboratory Analyst.
   - November 2024 – October 2025.

**Internship**

1. PT Tanjungenim Lestari Pulp and Paper – Production Intern.
   - January 2024 – March 2024.

**Speaker**

1. Chemical Engineering Subject Tutorial.
   - 2025.

Setiap experience memiliki preview card dan popup detail.

Informasi popup:

- Organization.
- Position.
- Period.
- Location.
- Summary.
- Responsibilities.
- Technical Skills.
- Gallery.
- Supporting Documents.

FR-E1 (P1): Admin dapat mengelola seluruh kategori experience.

FR-E2 (P1): Admin dapat mengubah kategori experience.

FR-E3 (P1): Admin dapat mengatur featured experience.

FR-E4 (P1): Admin dapat mengatur urutan pengalaman.

FR-E5 (P1): Public website hanya menampilkan konten berstatus published.

Catatan: Kedua posisi BRIN memiliki periode yang sama sesuai CV. Keduanya harus disimpan sebagai dua data terpisah.

### 6.5 Organization (FR-O)

Data organisasi awal:

1. Forum Komunikasi Bidikmisi/KIP Kuliah Universitas Lampung – Secretary General.
2. Himpunan Mahasiswa Teknik Kimia Universitas Lampung – Expert Staff, Research Department.
3. EXCESS – Secretary, Administration Division.

Setiap item menampilkan nama organisasi, jabatan, periode, deskripsi, kontribusi, dan dokumentasi.

Admin dapat melakukan CRUD, upload dokumentasi, dan mengatur urutan organisasi.

### 6.6 Contact (FR-CON)

Informasi awal:

- Name: Kusumawati.
- Email: khusumawati232@gmail.com.
- WhatsApp: +62 857-7073-4703.
- LinkedIn: www.linkedin.com/in/kusumawati.
- Location: Bandar Lampung, Lampung, Indonesia.

Fitur:

- Email CTA.
- WhatsApp CTA.
- LinkedIn CTA.
- Contact form.

Contact form memiliki field:

- Name.
- Email.
- Subject.
- Message.

FR-CON1 (P1): Validasi client dan server.

FR-CON2 (P1): Loading, success, dan error state.

FR-CON3 (P1): Proteksi spam.

FR-CON4 (P1): Informasi kontak dapat diubah melalui admin.

FR-CON5 (P1): Pesan yang dikirim pengunjung dapat dilihat dan dikelola melalui admin dashboard.

## 7. Functional Requirements – Admin Dashboard

### 7.1 Authentication (FR-AUTH)

- FR-AUTH1 (P1): Admin harus login sebelum mengakses dashboard.
- FR-AUTH2 (P1): Tidak tersedia public registration.
- FR-AUTH3 (P1): Halaman dan endpoint admin harus terlindungi.
- FR-AUTH4 (P1): Session dikelola secara aman di dalam arsitektur Next.js repository: cookie HTTP-only dan secure, memiliki expiry, dan divalidasi di server pada setiap request admin.
- FR-AUTH5 (P1): Admin dapat logout.
- FR-AUTH6 (P1): Endpoint pengelolaan data tidak boleh dapat diakses tanpa autentikasi.
- FR-AUTH7 (P1): Password tidak boleh disimpan dalam bentuk plaintext.
- FR-AUTH8 (P2): Mendukung perubahan password admin melalui mekanisme yang aman.
- FR-AUTH9 (P1): Autentikasi tidak boleh hanya berupa pemeriksaan keberadaan cookie. Nilai session harus diverifikasi di server.

Untuk fase awal cukup satu akun administrator, yaitu pemilik portfolio.

### 7.2 Dashboard Overview (FR-DB)

Dashboard menampilkan ringkasan:

- Total Education.
- Total Experience.
- Total Certifications.
- Total Publications.
- Total Patents.
- Total Organizations.
- Total Media Assets.
- Total Contact Messages.
- Draft Content.
- Published Content.

FR-DB1 (P1): Statistik berasal dari data aktual database.

FR-DB2 (P1): Dashboard menampilkan akses cepat ke modul pengelolaan.

FR-DB3 (P2): Menampilkan informasi pesan terbaru.

### 7.3 Content Management (FR-CRUD)

Seluruh modul konten wajib memiliki kemampuan CRUD.

| Modul | Create | Read | Update | Delete |
|---|---|---|---|---|
| Profile | ✓ | ✓ | ✓ | - |
| Education | ✓ | ✓ | ✓ | ✓ |
| Academic Projects | ✓ | ✓ | ✓ | ✓ |
| Experience | ✓ | ✓ | ✓ | ✓ |
| Certifications | ✓ | ✓ | ✓ | ✓ |
| Publications | ✓ | ✓ | ✓ | ✓ |
| Patents | ✓ | ✓ | ✓ | ✓ |
| Organizations | ✓ | ✓ | ✓ | ✓ |
| Media Assets | ✓ | ✓ | ✓ | ✓ |
| CV & Documents | ✓ | ✓ | ✓ | ✓ |
| Contact Settings | - | ✓ | ✓ | - |
| Website Settings | - | ✓ | ✓ | - |
| Contact Messages | - | ✓ | ✓ | ✓ |

Setiap modul harus menyediakan:

- Data listing.
- Search.
- Filter berdasarkan kategori jika relevan.
- Pagination jika jumlah data cukup banyak.
- Form create dan edit.
- Validasi input.
- Confirmation sebelum delete.
- Feedback success dan error.
- Empty state.
- Loading state.

### 7.4 Bilingual Content Management (FR-LANG)

Setiap konten yang ditampilkan kepada pengunjung harus dapat dikelola dalam dua bahasa.

Field bilingual:

- Title.
- Summary.
- Description.
- Responsibilities.
- Project Details.
- Alt Text.
- CTA Label jika dapat dikustomisasi.

Admin dapat mengisi konten English dan Indonesia dalam satu form menggunakan tab atau field grouping.

FR-LANG1 (P1): English dan Indonesia wajib didukung.

FR-LANG2 (P1): English menjadi default public language.

FR-LANG3 (P1): Admin dapat memperbarui kedua bahasa secara independen.

FR-LANG4 (P1): Konten yang belum diterjemahkan tidak boleh menyebabkan error atau menampilkan teks kosong tanpa penanganan.

FR-LANG5 (P2): Admin mendapatkan indikator jika terjemahan belum lengkap.

### 7.5 Media Library (FR-MEDIA)

Admin dapat mengelola seluruh gambar dan dokumen melalui satu modul Media Library.

Fitur:

- Upload gambar.
- Upload PDF.
- Preview asset.
- Search asset.
- Filter berdasarkan jenis file.
- Mengubah nama atau metadata asset.
- Menghapus asset.
- Melihat ukuran file dan informasi dasar.
- Memilih asset yang sudah diunggah untuk digunakan kembali pada konten.

Penyimpanan menggunakan Vercel Blob.

FR-MEDIA1 (P1): Upload dilakukan melalui backend yang terautentikasi.

FR-MEDIA2 (P1): Token Vercel Blob hanya tersedia di server.

FR-MEDIA3 (P1): Sistem memvalidasi MIME type dan ukuran file.

FR-MEDIA4 (P1): File yang tidak diizinkan ditolak.

FR-MEDIA5 (P1): Asset dapat dihubungkan ke lebih dari satu konten apabila dibutuhkan.

FR-MEDIA6 (P1): Menghapus asset yang masih digunakan harus dicegah atau memerlukan konfirmasi dan penanganan referensi terlebih dahulu.

FR-MEDIA7 (P1): Tidak boleh menghapus file Blob tanpa memastikan bahwa file tersebut tidak lagi digunakan oleh konten lain.

FR-MEDIA8 (P2): Mendukung penggantian file tanpa menyebabkan referensi konten menjadi rusak.

FR-MEDIA9 (P2): Mendukung alt text dan deskripsi asset untuk accessibility.

### 7.6 Draft & Publishing (FR-PUB)

Setiap konten yang dapat ditampilkan pada public website memiliki status:

- Draft.
- Published.

FR-PUB1 (P1): Konten baru secara default dibuat sebagai Draft.

FR-PUB2 (P1): Admin dapat mengubah status menjadi Published.

FR-PUB3 (P1): Konten Draft tidak boleh muncul di public website.

FR-PUB4 (P1): Konten Published dapat dikembalikan menjadi Draft.

FR-PUB5 (P1): Admin dapat mengatur featured content.

FR-PUB6 (P1): Admin dapat mengatur urutan konten.

FR-PUB7 (P2): Admin dapat melihat preview sebelum menerbitkan konten.

### 7.7 Profile Management (FR-PROFILE)

Admin dapat memperbarui:

- Full Name.
- Professional Title.
- Profile Summary English.
- Profile Summary Indonesia.
- Profile Photo.
- Hero Photo.
- CV Document.
- Email.
- Phone / WhatsApp.
- LinkedIn URL.
- Location.
- Social Links.

Data ini menjadi sumber informasi utama untuk Home dan Contact.

### 7.8 Website Settings (FR-SETTINGS)

Admin dapat mengatur:

- Website Title.
- Website Description.
- Default Language.
- Hero CTA.
- Social Links.
- Contact Information.
- SEO Title.
- SEO Description.
- Open Graph Image.
- Footer Information.

Pengaturan hanya boleh memengaruhi area yang memang disediakan untuk konfigurasi.

### 7.9 Contact Message Management (FR-MESSAGE)

Admin dapat:

- Melihat daftar pesan.
- Membuka detail pesan.
- Melihat nama, email, subject, isi, dan tanggal pesan.
- Mengubah status pesan jika fitur status diterapkan.
- Menghapus pesan.

Status pesan yang disarankan:

- Unread.
- Read.
- Archived.

## 8. Data Structure Requirements

Seluruh data dikelola secara terstruktur melalui backend.

Entitas konseptual:

| Entitas | Fungsi |
|---|---|
| Admin | Akun administrator |
| Profile | Identitas dan profil pemilik |
| Education | Riwayat pendidikan |
| Academic Project | Proyek akademik |
| Experience | Work, Internship, Speaker |
| Certification | Sertifikasi dan pelatihan |
| Publication | Publikasi jurnal |
| Patent | Publikasi paten |
| Organization | Pengalaman organisasi |
| Media Asset | Metadata file dan URL Blob |
| Contact Message | Pesan pengunjung |
| Website Settings | Pengaturan website |

Field umum untuk konten:

- id.
- createdAt.
- updatedAt.
- status.
- sortOrder.
- isFeatured jika relevan.

Field bilingual menggunakan struktur English dan Indonesia.

Contoh konseptual:

`title: { en: "...", id: "..." }`

`description: { en: "...", id: "..." }`

Struktur database final didefinisikan di `prisma/schema.prisma` dengan PostgreSQL dan mengikuti konvensi repository. Representasi field bilingual (kolom terpisah EN/ID atau JSON) diputuskan sebelum migrasi dan ditetapkan sekali untuk semua modul. Migrasi bersifat additive; data lama (Home, Project, Experience, Blog, Comment) tidak dihapus tanpa keputusan retensi tertulis.

## 9. UI/UX & Design Direction

### 9.1 Public Website

Tema:

**Chemical Engineering Professional Portfolio**

Karakter:

- Professional.
- Elegant.
- Modern.
- Scientific.
- Feminine tanpa berlebihan.
- Clean dan premium.

Warna utama:

- Blue.
- White.
- Soft Blue.
- Light Neutral.

Hero menggunakan foto profesional Kusumawati sebagai elemen visual utama.

Elemen visual pendukung:

- Molecular structure.
- Chemical bonds.
- Laboratory glassware.
- Scientific diagrams.
- Engineering process flow.
- Subtle technical grid.

Detail visual final mengikuti `ui.md`.

### 9.2 Admin Dashboard

Admin dashboard harus memiliki identitas visual yang konsisten dengan public portfolio, tetapi lebih mengutamakan usability dan efisiensi pengelolaan.

Ketentuan:

- Sidebar navigation pada desktop.
- Responsive navigation pada mobile.
- Header dengan profile dan logout.
- Data table atau list yang mudah dipahami.
- Form dengan grouping field yang jelas.
- Bilingual editor.
- Image upload dan preview.
- Document upload dan preview.
- Confirmation dialog.
- Toast feedback.
- Loading, empty, success, dan error state.

Admin dashboard tidak boleh terlihat seperti public landing page. Prioritaskan kemudahan pengelolaan data.

## 10. Technical Direction

Pengembangan dilakukan di atas repository Next.js yang sudah ada. Arsitektur dan teknologi bawaan repository dipertahankan.

| Area | Teknologi |
|---|---|
| Aplikasi | Next.js (App Router), satu aplikasi untuk public portfolio dan admin dashboard |
| Bahasa | TypeScript (strict) |
| Backend / API | Next.js Route Handlers (`app/api/**/route.ts`) |
| Database | PostgreSQL |
| ORM | Prisma |
| Asset Storage | Vercel Blob |
| Styling / UI | Tailwind CSS v4, komponen lokal bergaya shadcn/ui, Radix, Lucide |
| Deployment | Vercel |

Ketentuan:

1. Pertahankan arsitektur repository; jangan membuat monorepo (Turborepo) atau service backend terpisah (NestJS) tanpa keputusan arsitektur tertulis.
2. Jangan mengubah konfigurasi utama tanpa alasan teknis.
3. Gunakan pola kode yang sudah ada: Route Handlers, singleton Prisma di `lib/prisma.ts`, alias `@/*`, dan komponen di `components/` dan `components/ui/`.
4. Jangan overengineering.
5. Backend (Route Handlers) bertanggung jawab atas validasi dan keamanan operasi data.
6. Browser tidak boleh mengakses database secara langsung.
7. Semua operasi CRUD harus melalui API Route Handlers.
8. Setiap Route Handler admin harus memeriksa autentikasi sendiri. Middleware halaman bukan pengganti guard API.
9. Vercel Blob diintegrasikan lewat mekanisme server-side yang aman.
10. Public API/query hanya boleh mengekspos data berstatus Published.
11. Data Draft dan data privat tidak boleh bocor ke public endpoint.
12. Koneksi database harus dibaca dari environment variable (`DATABASE_URL`). Tidak boleh ada connection string atau kredensial lain di source code.
13. Validasi tipe dan build dilakukan eksplisit; keberhasilan `next build` saja bukan bukti type-check lulus (repo saat ini mengabaikan error TypeScript saat build).

## 11. Non-Functional Requirements

| Aspek | Requirement | Target |
|---|---|---|
| Performance | Optimasi asset dan rendering | Lighthouse ≥ 90 |
| Accessibility | Keyboard, alt text, contrast | Lighthouse ≥ 95 |
| SEO | Metadata, sitemap, OG | Lighthouse ≥ 95 |
| Responsive | Mobile, tablet, desktop | 360px–1920px |
| Security | Auth, validation, secrets | Tidak ada akses admin tanpa izin |
| Storage | Vercel Blob | Upload dan pengelolaan berjalan |
| Reliability | Error handling dan fallback | Tidak ada broken UI |
| Internationalization | English / Indonesia | Konsisten |
| Maintainability | Konvensi dan struktur repository Next.js yang ada | Konsisten |

## 12. Security Requirements

- Admin login wajib menggunakan mekanisme autentikasi yang aman.
- Tidak boleh ada public registration.
- Password harus di-hash.
- Endpoint admin wajib memiliki authentication guard.
- Validasi dilakukan pada backend.
- File upload harus divalidasi berdasarkan tipe dan ukuran.
- Endpoint upload (`/api/upload`) wajib terautentikasi dan memvalidasi MIME type serta ukuran file.
- Secret dan token Blob tidak boleh dikirim ke client.
- Contact form harus memiliki perlindungan spam.
- Public endpoint tidak boleh mengembalikan draft atau data privat.
- Operasi delete harus memiliki konfirmasi.
- Tidak boleh ada kredensial sensitif di repository.
- Connection string database dan kredensial lain hanya berasal dari environment variable. Kredensial yang pernah tertulis di source code dianggap bocor dan harus diganti (rotate) sebelum deployment.
- Session harus memiliki mekanisme expiry dan logout yang benar.
- Admin tidak boleh dapat mengakses resource yang tidak menjadi haknya.

## 13. Content Checklist

Konten awal bersumber dari CV Kusumawati.

- [x] Informasi profil.
- [x] Riwayat pendidikan.
- [x] Pengalaman BRIN.
- [x] Internship PT Tanjungenim Lestari Pulp and Paper.
- [x] Pengalaman organisasi.
- [x] Sertifikasi K3.
- [x] Publikasi jurnal.
- [x] Publikasi paten.
- [x] Informasi speaker.

Aset yang masih perlu disiapkan:

- [ ] Foto profesional.
- [ ] CV PDF.
- [ ] Foto kegiatan BRIN.
- [ ] Foto laboratorium.
- [ ] Foto internship.
- [ ] Foto speaker.
- [ ] Foto organisasi.
- [ ] Sertifikat K3.
- [ ] Dokumen publikasi jurnal.
- [ ] Dokumen paten.
- [ ] Dokumentasi proyek akademik.
- [ ] Informasi detail kegiatan speaker.
- [ ] Terjemahan English yang sudah diverifikasi.

Konten awal dapat dimasukkan melalui admin dashboard setelah implementasi CRUD selesai.

## 14. Roadmap & Prioritas

**Phase 1 – Foundation**

- Penetapan batas arsitektur dan konfigurasi (database via environment variable, strategi migrasi).
- Database dan data model.
- Admin authentication dan guard seluruh endpoint admin.
- Struktur admin dashboard.
- Public navigation.
- Bilingual foundation.

Gate: Admin dapat login dan public website dapat membaca data.

**Phase 2 – Admin CRUD**

- Profile management.
- Education dan Academic Projects.
- Experience.
- Certifications.
- Publications dan Patents.
- Organizations.
- Website Settings.

Gate: Seluruh modul dapat melakukan CRUD dan validasi.

**Phase 3 – Media Management**

- Integrasi Vercel Blob.
- Media Library.
- Upload foto dan PDF.
- Preview dan download.
- Relasi asset dengan konten.

Gate: File dapat dikelola tanpa broken references.

**Phase 4 – Public Portfolio**

- Home.
- Education.
- Certification.
- Experience.
- Organization.
- Contact.
- Popup detail.
- Bilingual UI.

Gate: Seluruh konten Published tampil sesuai data admin.

**Phase 5 – Publishing & Quality**

- Draft dan Published.
- Featured content.
- Sorting.
- Contact message management.
- SEO.
- Performance.
- Accessibility.
- Security testing.

Gate: Seluruh acceptance criteria terpenuhi.

## 15. Acceptance Criteria

### Public Website

- [ ] Enam halaman utama tersedia.
- [ ] English menjadi default.
- [ ] Bahasa dapat diubah ke Indonesia.
- [ ] Hero menampilkan foto, nama, deskripsi, dan CTA.
- [ ] Education menampilkan pendidikan dan academic projects.
- [ ] Certification menampilkan sertifikasi, training, jurnal, dan paten.
- [ ] Experience memiliki Work, Internship, dan Speaker.
- [ ] Organization menampilkan data organisasi.
- [ ] Contact menampilkan informasi kontak dan form.
- [ ] Kartu dapat membuka popup detail.
- [ ] Popup mendukung foto dan dokumen.
- [ ] CV dapat diunduh.
- [ ] Konten Draft tidak muncul di public website.

### Admin Dashboard

- [ ] Admin dapat login dan logout.
- [ ] Tidak tersedia public registration.
- [ ] Admin dashboard terlindungi.
- [ ] Dashboard menampilkan statistik aktual.
- [ ] Profile dapat dikelola.
- [ ] Education dapat CRUD.
- [ ] Academic Projects dapat CRUD.
- [ ] Experience dapat CRUD.
- [ ] Certifications dapat CRUD.
- [ ] Publications dapat CRUD.
- [ ] Patents dapat CRUD.
- [ ] Organizations dapat CRUD.
- [ ] Media Library dapat CRUD.
- [ ] CV dan dokumen dapat dikelola.
- [ ] Contact information dapat diubah.
- [ ] Contact messages dapat dilihat dan dikelola.
- [ ] Website settings dapat diperbarui.
- [ ] Konten English dan Indonesia dapat dikelola.
- [ ] Admin dapat mengatur Draft dan Published.
- [ ] Admin dapat mengatur featured content.
- [ ] Admin dapat mengatur urutan konten.
- [ ] Upload Vercel Blob berjalan aman.
- [ ] File yang masih digunakan tidak dapat terhapus secara tidak sengaja.

### Technical Quality

- [ ] Seluruh CRUD menggunakan API backend (Route Handlers).
- [ ] Validasi backend berjalan.
- [ ] Endpoint admin terproteksi.
- [ ] Tidak ada Route Handler admin yang dapat diakses tanpa autentikasi.
- [ ] Public endpoint hanya mengembalikan data Published.
- [ ] Tidak ada secret terekspos.
- [ ] Tidak ada kredensial atau connection string di source code.
- [ ] Responsive di desktop dan mobile.
- [ ] Tidak ada broken image atau broken link.
- [ ] Implementasi mengikuti arsitektur repository dan `ui.md`.

## 16. Risiko & Asumsi

| Risiko | Dampak | Mitigasi |
|---|---|---|
| Dokumen belum lengkap | Portfolio kurang memiliki bukti visual | Konten dapat ditambahkan kemudian |
| Terjemahan belum lengkap | Pengalaman bilingual tidak konsisten | Indikator kelengkapan terjemahan |
| Upload file gagal | Dokumentasi tidak tersedia | Error handling dan retry |
| File terhapus tetapi masih direferensikan | Broken asset | Reference validation sebelum delete |
| Akses admin tidak aman | Data portfolio dapat dimanipulasi | Authentication dan server-side authorization |
| Banyak konten | Dashboard sulit dikelola | Search, filter, dan pagination |
| Data draft terekspos | Informasi belum siap tampil | Public query hanya mengambil Published |
| Kredensial database tertulis di source | Akses database oleh pihak tidak berwenang | Pindahkan ke environment variable dan rotate password |

Asumsi:

- Portfolio dimiliki dan dikelola oleh satu administrator.
- Website dapat diakses publik.
- Admin dashboard hanya digunakan pemilik portfolio.
- Konten awal berasal dari CV yang diberikan.
- Semua foto dan dokumen yang diunggah memiliki izin penggunaan.
- Repository Next.js yang ada menjadi fondasi arsitektur. Jika kontrak Maincore yang konkret tersedia kemudian, integrasinya dinilai sebagai keputusan terpisah.

## 17. Pertanyaan Terbuka

1. Nama lengkap yang akan ditampilkan pada website.
2. Foto profesional untuk hero.
3. CV PDF terbaru.
4. Dokumen sertifikat, jurnal, dan paten.
5. Detail kegiatan speaker.
6. Domain portfolio.
7. Email administrator untuk akun awal.
8. Apakah Maincore memang tersedia di tempat lain, atau repository ini dipakai sebagai basis final.
9. Representasi penyimpanan field bilingual (kolom terpisah atau JSON).
10. Pola URL publik (halaman terpisah atau satu halaman dengan section) dan bagaimana locale tercermin di URL.
11. Metode proteksi spam untuk contact form.
12. Penanganan Blog/Comment lama: nonaktifkan UI saja atau hapus data.
13. Pemetaan data lama (Home, Project, Experience) ke Profile, AcademicProject, dan Experience target.

## 18. Keputusan atas Pertanyaan Terbuka

| No. | Pertanyaan | Keputusan / Jawaban | Status |
|---|---|---|---|
| 1 | Nama lengkap yang akan ditampilkan pada website. | Menggunakan nama lengkap resmi sesuai identitas dan dokumen profesional Kusumawati. Penulisan final menunggu konfirmasi pemilik. | Menunggu konfirmasi |
| 2 | Foto profesional untuk hero. | Menggunakan foto profesional Kusumawati dengan kualitas dan resolusi yang sesuai untuk kebutuhan hero website. Foto disediakan dan disetujui oleh pemilik. | Menunggu aset |
| 3 | CV PDF terbaru. | Menggunakan CV PDF versi terbaru yang telah diperiksa dan disetujui oleh Kusumawati. File akan digunakan sebagai dokumen unduhan pada halaman publik. | Menunggu aset |
| 4 | Dokumen sertifikat, jurnal, dan paten. | Menggunakan dokumen asli atau tautan publikasi/verifikasi yang valid. Setiap dokumen diunggah atau ditautkan melalui Admin dan dihubungkan dengan konten terkait. | Menunggu aset |
| 5 | Detail kegiatan speaker. | Setiap kegiatan speaker dicatat sebagai entri Experience dengan kategori `Speaker`, mencakup nama acara, penyelenggara, peran, tanggal/periode, deskripsi, dan dokumentasi jika tersedia. Detail final menunggu data dari pemilik. | Menunggu data |
| 6 | Domain portfolio. | Domain akan ditentukan dan dikonfirmasi oleh pemilik sebelum deployment production. Pengembangan lokal tidak bergantung pada keputusan domain. | Menunggu konfirmasi |
| 7 | Email administrator untuk akun awal. | Menggunakan email pribadi/profesional yang ditentukan oleh pemilik sebagai identitas akun administrator awal. Tidak tersedia registrasi publik. | Menunggu konfirmasi |
| 8 | Apakah Maincore memang tersedia di tempat lain, atau repository ini dipakai sebagai basis final. | Repository Kusumawati ini menjadi basis implementasi final. Maincore tidak menjadi dependency maupun requirement arsitektur proyek ini. Pengembangan mengikuti struktur monolithic Next.js App Router yang sudah tersedia pada repository. | Diputuskan |
| 9 | Representasi penyimpanan field bilingual (kolom terpisah atau JSON). | Menggunakan pendekatan separate columns. Setiap field yang membutuhkan terjemahan memiliki pasangan field Bahasa Inggris (`en`) dan Bahasa Indonesia (`id`). Field yang tidak membutuhkan terjemahan disimpan satu kali. Bahasa Inggris menjadi default dan digunakan sebagai fallback jika terjemahan Bahasa Indonesia belum tersedia. | Diputuskan |
| 10 | Pola URL publik (halaman terpisah atau satu halaman dengan section) dan bagaimana locale tercermin di URL. | Menggunakan multi-page routing dengan locale prefix. Bahasa Inggris menggunakan `/en`, sedangkan Bahasa Indonesia menggunakan `/id`. Setiap halaman memiliki route tersendiri, seperti `/en/education` dan `/id/education`. Root URL `/` diarahkan ke `/en`. Language switcher mempertahankan halaman yang sedang dibuka ketika bahasa diganti. | Diputuskan |
| 11 | Metode proteksi spam untuk contact form. | Menggunakan validasi server-side, rate limiting, dan honeypot sebagai perlindungan awal. Implementasi CAPTCHA dapat dipertimbangkan apabila spam masih terjadi. | Diputuskan |
| 12 | Penanganan Blog/Comment lama: nonaktifkan UI saja atau hapus data. | Fitur Blog dan Comment dinonaktifkan dari UI publik dan Admin karena tidak termasuk kebutuhan portfolio Kusumawati. Data lama tidak langsung dihapus dari database. Penghapusan atau migrasi data hanya dilakukan setelah pemeriksaan dan persetujuan pemilik. | Diputuskan |
| 13 | Pemetaan data lama (Home, Project, Experience) ke Profile, AcademicProject, dan Experience target. | Data Home dipetakan ke Profile dan Website Settings sesuai jenis informasinya. Data Project dipetakan ke AcademicProject apabila merupakan proyek akademik yang relevan. Data Experience dipertahankan dan disesuaikan dengan struktur Experience target. Migrasi dilakukan secara selektif tanpa menghilangkan data yang masih dibutuhkan. | Diputuskan |

### Catatan Implementasi

1. Keputusan yang berstatus `Menunggu konfirmasi`, `Menunggu aset`, atau `Menunggu data` harus diselesaikan bersama pemilik sebelum konten terkait dipublikasikan.
2. Keputusan teknis yang berstatus `Diputuskan` menjadi acuan implementasi dan tidak perlu dipertanyakan kembali kecuali ditemukan konflik teknis yang nyata.
3. Tidak boleh membuat atau mengisi informasi profesional, dokumen, foto, maupun identitas menggunakan asumsi.
4. Data lama harus diperiksa sebelum migrasi atau penghapusan. Migrasi tidak boleh menyebabkan kehilangan data secara tidak disengaja.

---

**Dokumen ini menjadi acuan utama pengembangan Kusumawati Personal Portfolio & Admin Dashboard.**

Seluruh konten portfolio harus dapat dikelola melalui admin dashboard. Public website hanya bertugas menyajikan konten yang telah dipublikasikan.

Implementasi harus mengikuti PRD, arsitektur repository, dan `ui.md`. Jangan menambahkan fitur di luar ruang lingkup tanpa persetujuan.
