# Analisis Project Kusumawati Portfolio

Dokumen ini merangkum implementasi yang ditemukan pada repository saat analisis dilakukan. Kode aplikasi dan struktur file menjadi sumber utama; dokumentasi lama yang berbeda dari implementasi aktif dicatat sebagai ketidaksesuaian, bukan dianggap sebagai perilaku yang berjalan.

## Status indexing dan batas analisis

Repository diindeks dengan Codebase Memory dalam mode `full` pada 4 November 2026. Hasilnya mencatat **977 node** dan **2.088 edge**, mencakup TypeScript dan CSS yang dapat diparse. Graph menemukan 14 route dan menandai `app/globals.css` sebagai parse-partial pada baris 4–9; file CSS tersebut diperiksa langsung sebagai fallback. Tiga gambar (`app/icon.png`, `public/budicahyono.png`, dan `public/portfoliostackplus.png`) serta `.git` dikecualikan oleh aturan indexing, bukan karena kegagalan parser. Coverage yang bersih untuk file lain adalah sinyal best-effort, bukan jaminan bahwa graph memuat seluruh detail sumber.

## Ringkasan arsitektur dan teknologi

Project ini adalah portfolio web dan CMS admin dalam satu aplikasi **Next.js App Router**. Halaman utama merupakan server component yang mengambil data dari PostgreSQL melalui Prisma, lalu mengirimkannya ke komponen section. Admin dan login menggunakan komponen client-side yang berkomunikasi dengan Next.js Route Handlers melalui HTTP.

| Area | Implementasi yang ditemukan | Bukti |
|---|---|---|
| Framework dan runtime UI | Next.js `16.0.10`, React dan React DOM `19.2.0` | [`package.json`](../package.json) |
| Bahasa | TypeScript `^5`; konfigurasi compiler mengaktifkan `strict` dan alias `@/*` | [`package.json`](../package.json), [`tsconfig.json`](../tsconfig.json) |
| Styling | Tailwind CSS `^4.1.9`, PostCSS, `tw-animate-css`, dan CSS variables/theme dalam global stylesheet | [`package.json`](../package.json), [`postcss.config.mjs`](../postcss.config.mjs), [`app/globals.css`](../app/globals.css) |
| Komponen UI | Komponen lokal bergaya shadcn/ui, Radix primitives, Lucide icons | [`components.json`](../components.json), [`components/ui/`](../components/ui) |
| Persistensi | PostgreSQL, Prisma Client `^7.9.1`, adapter `@prisma/adapter-pg`, dan `pg` | [`prisma/schema.prisma`](../prisma/schema.prisma), [`lib/prisma.ts`](../lib/prisma.ts), [`package.json`](../package.json) |
| File dan telemetry | Upload melalui Vercel Blob; analytics melalui `@vercel/analytics/next` | [`app/api/upload/route.ts`](../app/api/upload/route.ts), [`app/layout.tsx`](../app/layout.tsx) |

## Struktur direktori

| Path | Fungsi yang teramati |
|---|---|
| [`app/`](../app) | Routing App Router: halaman utama, login, admin, global layout/style, serta Route Handlers API. |
| [`app/api/`](../app/api) | API backend per domain. Route collection menangani pembacaan/pembuatan; route `[id]` menyediakan update/delete untuk domain yang mendukungnya. |
| [`components/`](../components) | Section portfolio, navigasi, dekorasi/background, reveal animation, dan provider tema. |
| [`components/admin/`](../components/admin) | Form/tab client-side untuk mengelola Home, Skills, Projects, Experience, Blog, dan Contact. |
| [`components/ui/`](../components/ui) | Library komponen presentasional yang mencakup tombol, form fields, dialog, menu, tabel, toast, dan primitive lain. Konfigurasi menunjukkan preset `new-york` dan alias shadcn/ui. |
| [`hooks/`](../hooks) | Hook bersama untuk perilaku responsif dan toast. |
| [`lib/`](../lib) | Singleton Prisma di `prisma.ts` dan utilitas kelas CSS di `utils.ts`. |
| [`prisma/`](../prisma) | Model data Prisma dalam `schema.prisma`; tidak ada direktori migrasi Prisma pada struktur yang terindeks. |
| [`public/`](../public) | Aset statis portfolio, termasuk gambar dan PDF CV. Gambar dikecualikan dari graph karena suffix binary, tetapi file tercatat dalam struktur repository. |

## Pola implementasi backend

- Backend berada dalam Next.js Route Handlers di `app/api/**/route.ts`, bukan service terpisah yang ditemukan pada struktur project.
- Route handlers mengimpor singleton dari [`lib/prisma.ts`](../lib/prisma.ts), menjalankan operasi Prisma, dan membentuk respons JSON dengan `NextResponse`. Contoh pola query, urut `sort_order`, transformasi field, serta create ada di [`app/api/projects/route.ts`](../app/api/projects/route.ts).
- Route dinamis menggunakan folder `[id]`; parameter route dideklarasikan sebagai `Promise<{ id: string }>` di contoh [`app/api/projects/[id]/route.ts`](../app/api/projects/%5Bid%5D/route.ts). Pertahankan bentuk ini saat menambah handler Next.js versi saat ini.
- Domain API yang tersedia: `auth`, `home`, `projects`, `skills`, `experience`, `blog`, `contact`, dan `upload`. Projects/Skills/Experience/Blog/Contact memiliki route collection dan `[id]`; Home menyediakan GET/PUT; Auth dan Upload menyediakan POST. Pemetaan ini terlihat pada file di [`app/api/`](../app/api).
- Route API umumnya menangani error dengan log server dan respons JSON. Beberapa resource menerima field lama maupun baru untuk kompatibilitas; misalnya Projects menerima `tags`, `project_url`, `github_url`, dan `image_url` sebagai alias dari field yang lebih baru di [`app/api/projects/route.ts`](../app/api/projects/route.ts) dan [`app/api/projects/[id]/route.ts`](../app/api/projects/%5Bid%5D/route.ts).

## Pola implementasi frontend

- [`app/page.tsx`](../app/page.tsx) adalah async server page. Ia membaca Home, Skill, Project, Experience, Blog, dan Contact melalui Prisma secara paralel, menyortir sebagian besar koleksi berdasarkan `sort_order`, lalu meneruskan hasil ke section components. Untuk data Home dan Contact tersedia fallback lokal.
- Section di [`components/`](../components) membagi tampilan publik per domain: Hero, Skills, Projects, Experience, Blog, dan Contact. Hero juga mengirim form kontak ke Web3Forms sebagaimana terlihat di [`components/hero-section.tsx`](../components/hero-section.tsx).
- Admin adalah halaman client-side di [`app/admin/page.tsx`](../app/admin/page.tsx). Ia memilih tab domain, sedangkan form masing-masing tab melakukan `fetch` ke endpoint internal; contoh Projects ada di [`components/admin/projects-tab.tsx`](../components/admin/projects-tab.tsx).
- [`app/layout.tsx`](../app/layout.tsx) menetapkan metadata halaman/Open Graph/Twitter, font Sora dan Plus Jakarta Sans, toaster, serta Vercel Analytics. Style global menggunakan Tailwind v4, theme variables, dan gaya glass/warna biru-putih di [`app/globals.css`](../app/globals.css).
- Komponen UI memakai alias `@/components`, `@/lib`, dan `@/hooks`; utilitas `cn` di [`lib/utils.ts`](../lib/utils.ts) merupakan helper bersama yang juga digunakan komponen UI.

## Database, ORM, autentikasi, dan file storage

### Database dan ORM

[`prisma/schema.prisma`](../prisma/schema.prisma) mendefinisikan datasource PostgreSQL dan tujuh model: `Home`, `Skill`, `Project`, `Experience`, `Blog`, `Comment`, dan `Contact`. Model memakai UUID sebagai ID; proyek/pengalaman menyimpan kumpulan teknologi dan foto sebagai array, sedangkan Blog memiliki slug unik opsional, status publikasi, views/likes, dan relasi `Comment` dengan cascade delete.

Prisma Client dibuat dengan `pg.Pool` dan `PrismaPg` pada [`lib/prisma.ts`](../lib/prisma.ts). Ada perbedaan konfigurasi yang perlu dipertahankan sebagai fakta saat menyusun prompt berikutnya: [`prisma.config.ts`](../prisma.config.ts) membaca `DATABASE_URL`, sedangkan konfigurasi client saat ini membuat pool dari connection string yang ditulis langsung di source. Nilai connection string tidak disalin ke dokumen ini. Jangan menganggap kedua jalur konfigurasi sudah selaras.

### Autentikasi dan batas akses

Implementasi aktif yang ditemukan adalah login password bersama melalui `POST /api/auth`; password dibandingkan dengan `ADMIN_PASSWORD`, lalu server menetapkan cookie `admin_session` HTTP-only satu hari di [`app/api/auth/route.ts`](../app/api/auth/route.ts). [`middleware.ts`](../middleware.ts) memeriksa keberadaan cookie untuk halaman `/admin` dan mengarahkan pengguna yang sudah memiliki cookie dari `/login`.

Matcher middleware hanya mencakup halaman `/admin/:path*` dan `/login`. Pada route API yang diperiksa, tidak tampak pemeriksaan session/admin bersama. Karena itu, jangan mengasumsikan endpoint CMS otomatis dilindungi middleware halaman.

### File storage

`POST /api/upload?filename=...` meneruskan request body ke Vercel Blob dengan `access: "public"` dan suffix acak, lalu mengembalikan hasil upload; implementasi ada di [`app/api/upload/route.ts`](../app/api/upload/route.ts). Form admin menggunakan endpoint ini, misalnya [`components/admin/projects-tab.tsx`](../components/admin/projects-tab.tsx). File statis yang disertakan langsung berada di [`public/`](../public).

## Fitur portfolio/CMS yang tersedia

- Halaman publik dengan section profil/hero, skills, projects, experience, blog, dan contact; sumber data utama berasal dari database melalui [`app/page.tsx`](../app/page.tsx).
- Dashboard admin dengan tab pengelolaan Home, Skills, Projects, Experience, Blog, dan Contact di [`app/admin/page.tsx`](../app/admin/page.tsx) serta [`components/admin/`](../components/admin).
- Operasi CRUD untuk resource koleksi tersebut melalui route handlers di [`app/api/`](../app/api); Home memiliki pola upsert melalui `PUT`.
- Upload thumbnail/gambar dan galeri dari form admin menggunakan Vercel Blob; form Projects membatasi ukuran file di sisi client pada [`components/admin/projects-tab.tsx`](../components/admin/projects-tab.tsx).
- Form kontak eksternal melalui Web3Forms pada [`components/hero-section.tsx`](../components/hero-section.tsx).
- Komponen reusable UI, navigasi responsif, reveal/background visual, toaster, serta metadata SEO dan social preview tersedia pada [`components/`](../components), [`components/ui/`](../components/ui), [`app/layout.tsx`](../app/layout.tsx), dan [`app/globals.css`](../app/globals.css).
- `Comment` tersedia sebagai model dan relasi database, tetapi pada daftar route dan komponen yang ditemukan tidak ada API atau tab UI khusus komentar. Jangan memperlakukan fitur komentar sebagai alur pengguna yang sudah lengkap tanpa implementasi tambahan.

## Konfigurasi dan dependensi penting

- Script package: `dev` menjalankan `next dev --turbopack`; `build` menjalankan `prisma generate && next build`; `postinstall` menjalankan `prisma generate`; `start` menjalankan `next start`. Script `lint` didefinisikan sebagai `next lint` di [`package.json`](../package.json).
- [`next.config.mjs`](../next.config.mjs) mengaktifkan `typescript.ignoreBuildErrors`, menonaktifkan optimasi gambar, dan mengizinkan host gambar `utfs.io` serta Vercel Blob. Build sukses dengan konfigurasi tersebut bukan bukti bahwa type-check telah lulus.
- [`tsconfig.json`](../tsconfig.json) memakai strict checking, `moduleResolution: "bundler"`, JSX `react-jsx`, dan alias root `@/*`.
- Dependensi penting yang tercantum di [`package.json`](../package.json): Next/React; Prisma, adapter PostgreSQL, dan `pg`; Tailwind/PostCSS; Radix UI; `react-hook-form` dan Zod; `lucide-react`; Vercel Blob dan Analytics.
- README dan panduan admin tidak sepenuhnya menggambarkan kode aktif: [`README.md`](../README.md) menyebut Supabase Auth/RLS, `.env.example`, serta SQL scripts, sedangkan [`admin_setup.md`](../admin_setup.md) menjelaskan metadata `is_admin` Supabase. File/script yang dirujuk tidak tampak pada struktur terindeks, dan alur autentikasi aktif yang diperiksa menggunakan `ADMIN_PASSWORD`/cookie. Gunakan source code serta manifest konfigurasi untuk menetapkan perilaku saat ini, bukan petunjuk lama tersebut.

## Batasan dan aturan arsitektur untuk pekerjaan berikutnya

1. Pertahankan Next.js App Router: halaman tetap di `app/`, endpoint tetap berupa Route Handlers, dan komponen server/client mengikuti kebutuhan data serta interaksi masing-masing.
2. Pertahankan alur baca publik server-side melalui Prisma dan alur admin melalui API internal; jangan memindahkan akses database ke browser.
3. Perlakukan model, nama field, array, relasi, urutan `sort_order`, serta alias kompatibilitas API sebagai kontrak yang sudah dipakai UI. Perubahan kontrak perlu mencakup backend dan form admin terkait.
4. Pertahankan provider PostgreSQL/Prisma dan pola adapter yang ada kecuali perubahan database/ORM dinyatakan sebagai tujuan tersendiri. Secara khusus, pertimbangkan ketidaksesuaian `DATABASE_URL` dengan connection string dalam client sebelum mengubah cara konfigurasi database.
5. Jangan mengganti mekanisme autentikasi atau mengasumsikan Supabase dari README: implementasi aktif yang ditemukan memakai `ADMIN_PASSWORD` dan cookie `admin_session`. Jangan menganggap middleware halaman sebagai proteksi route API.
6. Pertahankan penyimpanan upload sebagai URL publik Vercel Blob dan kesepakatan respons upload yang digunakan form admin; file lokal tetap di `public/`.
7. Reuse komponen, alias, dan konvensi UI yang ada. Hindari memperkenalkan framework styling atau component system kedua tanpa kebutuhan eksplisit.
8. Pertimbangkan konfigurasi build yang mengabaikan TypeScript errors; validasi tipe/build sebaiknya dilakukan secara eksplisit, tidak disimpulkan hanya dari keberhasilan `next build`.
