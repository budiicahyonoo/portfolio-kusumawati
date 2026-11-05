# Kusumawati Personal Portfolio

Website portfolio profesional dan CMS admin untuk menampilkan serta mengelola profil Kusumawati di bidang Chemical Engineering, Research & Development, laboratory analysis, dan process engineering. Website publik tersedia dalam bahasa Inggris dan Indonesia; konten portfolio dikelola melalui dashboard admin.

> **Status penting:** aplikasi menggunakan PostgreSQL melalui Prisma. `DATABASE_URL` wajib disiapkan sebelum fitur yang membaca/menulis database dapat digunakan. Repository saat ini belum memiliki direktori `prisma/migrations`; jangan menganggap skema database otomatis diterapkan saat build atau deploy.

## Daftar isi

- [Fitur](#fitur)
- [Teknologi](#teknologi)
- [Struktur dan rute](#struktur-dan-rute)
- [Prasyarat](#prasyarat)
- [Menjalankan secara lokal](#menjalankan-secara-lokal)
- [Menyiapkan administrator](#menyiapkan-administrator)
- [Menyiapkan database](#menyiapkan-database)
- [Menjalankan pemeriksaan](#menjalankan-pemeriksaan)
- [Deploy ke Vercel](#deploy-ke-vercel)
- [Memperbarui website](#memperbarui-website)
- [Keamanan dan operasional](#keamanan-dan-operasional)
- [Batasan dan pekerjaan sebelum rilis](#batasan-dan-pekerjaan-sebelum-rilis)
- [Troubleshooting](#troubleshooting)

## Fitur

### Website publik

- Portfolio dalam bahasa Inggris (`/en`) dan Indonesia (`/id`).
- Home, Education, Certification, Experience, Organization, dan Contact.
- Menampilkan konten yang berstatus published; data portfolio dikelola dari CMS.
- Foto profil dan CV bawaan tersedia di folder `public`.
- Halaman detail, media, dokumen, serta formulir kontak sesuai konten yang tersedia.

Rute halaman publik:

| Halaman | English | Bahasa Indonesia |
|---|---|---|
| Home | `/en` | `/id` |
| Education | `/en/education` | `/id/education` |
| Certification | `/en/certification` | `/id/certification` |
| Experience | `/en/experience` | `/id/experience` |
| Organization | `/en/organization` | `/id/organization` |
| Contact | `/en/contact` | `/id/contact` |

`/` mengarahkan pengunjung ke `/en`.

### Admin dan API

- Login admin di `/login`, dashboard di `/admin`.
- Autentikasi menggunakan password admin yang di-hash, cookie session HTTP-only, dan secret penandatanganan session.
- API Route Handlers di `app/api/**`; endpoint admin memeriksa session.
- Model CMS mencakup profil, pendidikan, proyek akademik, pengalaman, sertifikasi/publikasi/paten, organisasi, pesan kontak, pengaturan website, dan media.
- Upload media menggunakan Vercel Blob; token penyimpanan hanya digunakan server-side.

Dashboard memerlukan database PostgreSQL yang memiliki skema sesuai `prisma/schema.prisma`, serta satu akun admin yang dibuat dengan langkah bootstrap di bawah.

## Teknologi

| Area | Teknologi |
|---|---|
| Framework dan routing | Next.js 16 App Router |
| Bahasa | TypeScript |
| UI | React 19, Tailwind CSS 4, komponen Radix UI, Lucide |
| Database | PostgreSQL |
| ORM | Prisma 7 dengan `pg` dan `@prisma/adapter-pg` |
| Autentikasi | `bcryptjs`, cookie session bertanda tangan HMAC |
| Penyimpanan media | Vercel Blob |
| Hosting yang dituju | Vercel |
| Package manager | npm (`package-lock.json`) |

Supabase dapat dipakai sebagai **provider PostgreSQL** bila diinginkan, tetapi aplikasi ini tidak menggunakan Supabase Auth atau kebijakan RLS sebagai sistem login. Autentikasi yang aktif adalah autentikasi admin di dalam aplikasi.

## Struktur dan rute

```text
app/
  [locale]/                 Halaman publik EN/ID
  admin/                    Halaman dashboard
  api/                      Route Handlers API
  login/                    Halaman login admin
  globals.css               Gaya global
components/
  admin/                    Modul dashboard/CMS
  public/                   Komponen portfolio publik
lib/
  auth.ts                   Guard endpoint admin
  prisma.ts                 Prisma Client dan koneksi PostgreSQL
  session.ts                Pembuatan/verifikasi session admin
prisma/
  schema.prisma             Model data aplikasi
public/
  kusumawati.png            Foto profil bawaan
  CV Kusumawati.pdf         CV bawaan
scripts/
  bootstrap-admin.cjs       Membuat atau mengganti password admin
```

### Perintah npm

| Perintah | Kegunaan |
|---|---|
| `npm run dev` | Development server Next.js |
| `npm run build` | Membuat Prisma Client lalu production build |
| `npm run start` | Menjalankan production build secara lokal |
| `npm run lint` | Memeriksa JavaScript/TypeScript dengan ESLint dan aturan Next.js |
| `npm run admin:bootstrap` | Membuat atau memperbarui akun admin dari environment variable bootstrap |
| `npx prisma validate` | Memvalidasi skema Prisma |
| `npx prisma generate` | Menghasilkan Prisma Client |
| `npx prisma db push` | Menyelaraskan skema ke database tanpa membuat migration history; gunakan hanya pada database kosong/yang sudah ditinjau |
| `npx tsc --noEmit` | Memeriksa tipe TypeScript |

## Prasyarat

- Node.js **20.9 atau lebih baru** (disarankan versi LTS yang masih didukung).
- npm.
- PostgreSQL yang dapat diakses dari komputer lokal.
- Git.
- Akun Vercel dan repository Git untuk deployment.
- Akun Vercel Blob jika fitur upload media hendak digunakan.

Pilih database lokal atau managed PostgreSQL untuk development. Untuk production/serverless, gunakan connection string yang direkomendasikan provider untuk aplikasi serverless/connection pooling. Simpan database development dan production secara terpisah.

## Menjalankan secara lokal

### 1. Dapatkan source code dan install dependency

Jika repository sudah terbuka di VS Code, jalankan perintah mulai dari langkah 2. Jika melakukan clone, gunakan URL repository yang benar dari pemilik project:

```bash
git clone <URL-REPOSITORY>
cd kusumawati-portfolio
npm install
```

Jangan gunakan URL repository contoh dari dokumentasi lama.

### 2. Siapkan environment

Salin template lalu edit file `.env` pada root project. File `.env` dan `.env.local` sudah dikecualikan dari Git:

```powershell
# Windows PowerShell
Copy-Item .env.example .env
```

macOS/Linux:

```bash
cp .env.example .env
```

Isi nilai yang sesuai. Contoh berikut hanya format—ganti semua placeholder dengan kredensial database milik Anda:

```dotenv
DATABASE_URL="postgresql://USER:PASSWORD@HOST:5432/DATABASE?schema=public"
SESSION_SECRET="ganti-dengan-random-secret-minimal-32-karakter"
BLOB_READ_WRITE_TOKEN="token-vercel-blob"

# Hanya dipakai saat menjalankan npm run admin:bootstrap.
ADMIN_USERNAME="admin"
ADMIN_BOOTSTRAP_PASSWORD="gunakan-password-kuat-minimal-12-karakter"
```

`DATABASE_URL` yang tersedia di `.env.example` adalah placeholder, bukan koneksi aktif. Minta connection string dari provider PostgreSQL Anda. Jika username/password mengandung karakter khusus (mis. `@`, `:`, `/`, `#`), encode karakter tersebut sesuai format URL.

Buat `SESSION_SECRET` acak dengan Node.js:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64url'))"
```

Salin hasilnya ke `SESSION_SECRET`. Secret harus sama untuk seluruh instance deployment dan sedikitnya 32 karakter. Jangan gunakan contoh placeholder untuk menjalankan aplikasi.

`BLOB_READ_WRITE_TOKEN` dapat dibiarkan kosong saat hanya menjalankan halaman dan belum menggunakan upload. Buat Vercel Blob store dan token untuk upload media; jangan menaruh token dengan prefix `NEXT_PUBLIC_`.

> Prisma CLI membaca `.env` melalui `prisma.config.ts`. Next.js juga membaca `.env`; bila memakai `.env.local` untuk override Next.js, pastikan `DATABASE_URL` tetap tersedia di `.env` atau di environment proses saat menjalankan perintah Prisma. Script bootstrap membaca `.env.local` terlebih dahulu, lalu `.env`.

### 3. Siapkan PostgreSQL dan skema awal

1. Buat database PostgreSQL development kosong.
2. Atur `DATABASE_URL` ke database tersebut.
3. Validasi dan terapkan skema awal:

```bash
npx prisma validate
npx prisma generate
npx prisma db push
```

Saat ini repository belum memiliki migration files. `db push` cocok untuk menyelaraskan skema awal pada database development kosong, tetapi **bukan** pengganti strategi migrasi versioned untuk production. Jika database tujuan sudah berisi data, berhenti dan tinjau perbedaan skema serta rencana backup/migrasi sebelum menjalankan `db push`; perintah tersebut dapat mengubah skema database.

### 4. Buat akun administrator

Pastikan `ADMIN_USERNAME` dan `ADMIN_BOOTSTRAP_PASSWORD` terisi pada `.env` atau `.env.local`. Password bootstrap minimal 12 karakter. Kemudian jalankan:

```bash
npm run admin:bootstrap
```

Script melakukan upsert akun admin dan menyimpan hash bcrypt ke database; script tidak menyimpan password plaintext ke tabel. Setelah berhasil, hapus atau kosongkan `ADMIN_BOOTSTRAP_PASSWORD` dari environment lokal. Password tersebut hanya diperlukan saat menjalankan bootstrap, bukan untuk runtime aplikasi. Untuk mengganti password admin, atur password bootstrap baru lalu jalankan perintah yang sama.

### 5. Jalankan aplikasi

```bash
npm run dev
```

Buka:

- Website publik: `http://localhost:3000` (redirect ke `/en`).
- Bahasa Inggris: `http://localhost:3000/en`.
- Bahasa Indonesia: `http://localhost:3000/id`.
- Login admin: `http://localhost:3000/login`.
- Dashboard admin: `http://localhost:3000/admin` (perlu login).

Tambahkan dan publikasikan konten melalui dashboard. Hanya konten yang berstatus published yang ditujukan untuk tampil di halaman publik. Jangan memasukkan informasi, dokumen, atau terjemahan yang belum disetujui pemilik portfolio.

Form menampilkan placeholder sebagai contoh format. Placeholder bukan nilai awal dan tidak disimpan; masukkan informasi yang benar-benar telah diverifikasi. Isian wajib ditandai `*` dan browser akan meminta nilainya sebelum submit.

## Menyiapkan administrator

Tidak ada registrasi admin publik. Akun awal dibuat langsung di database menggunakan `npm run admin:bootstrap`.

- `ADMIN_USERNAME`: nama akun bootstrap; default `admin`.
- `ADMIN_BOOTSTRAP_PASSWORD`: password sementara untuk bootstrap; minimal 12 karakter.
- Login aplikasi meminta password admin.
- Session ditandatangani dengan `SESSION_SECRET` dan memiliki masa berlaku 24 jam.
- Logout menghapus cookie session.

Jangan membagikan password admin, database URL, session secret, atau Blob token. Jika secret session hilang/berubah, session lama tidak lagi valid dan admin perlu login ulang.

## Menyiapkan database

Project menggunakan PostgreSQL, bukan Supabase Auth. Provider PostgreSQL boleh dipilih secara mandiri (misalnya layanan managed PostgreSQL atau PostgreSQL dari Supabase), tetapi connection string harus sesuai dengan kebutuhan runtime Vercel.

### Development

- Gunakan database terpisah dari production.
- Isi `DATABASE_URL` lokal.
- Pada database development baru, terapkan skema dengan `npx prisma db push`.
- Buat akun admin dengan `npm run admin:bootstrap`.
- Backup data development yang perlu dipertahankan sebelum mengubah skema.

### Production

Skema production belum mempunyai alur migration yang siap untuk otomatis dijalankan. Untuk database production baru, koordinasikan penerapan skema awal dan bootstrap admin sebagai langkah operasional terpisah sebelum mengandalkan CMS. Jangan menambahkan `prisma db push` ke build command Vercel atau menjalankannya otomatis pada setiap deploy.

Sebelum database production yang sudah berisi data diubah, backup database, tinjau migrasi dan mapping data lama, lalu verifikasi pada staging. Repository belum menyiapkan migration files atau data migration untuk mempertahankan data lama.

## Menjalankan pemeriksaan

Jalankan pemeriksaan dasar sebelum mengirim perubahan:

```bash
npm run lint
npm audit --omit=dev
npx prisma validate
npx prisma generate
npx tsc --noEmit
npm run build
```

Build yang berhasil tidak membuktikan koneksi database production, operasi CRUD, atau migrasi sudah berfungsi. Verifikasi akses database, login, halaman publik, endpoint admin yang harus menolak akses anonim, upload (jika dipakai), dan pengiriman kontak pada environment yang dituju.

## Deploy ke Vercel

### 1. Persiapan sebelum deploy

1. Push source code ke repository Git yang dapat diakses Vercel.
2. Siapkan PostgreSQL production dan tentukan connection string runtime yang sesuai untuk serverless.
3. Siapkan Vercel Blob jika CMS akan mengunggah media.
4. Tinjau status skema: repository ini belum mempunyai `prisma/migrations`. Jangan menganggap Vercel akan membuat tabel saat deploy.
5. Siapkan backup dan proses penerapan skema production. Jangan menjalankan `db push` ke database berisi data tanpa review.

### 2. Import project

1. Buka [Vercel Dashboard](https://vercel.com/dashboard) dan pilih **Add New → Project**.
2. Import repository Git.
3. Pilih root directory repository (folder yang berisi `package.json`).
4. Gunakan framework preset **Next.js**.
5. Gunakan konfigurasi build default atau:
   - Install command: `npm install`
   - Build command: `npm run build`
   - Output directory: default Next.js (`.next`); jangan override kecuali ada alasan khusus.
6. Jangan set build command ke `prisma db push`. Script `build` menjalankan `prisma generate` lalu `next build`; perintah tersebut tidak membuat tabel database.

### 3. Tambahkan environment variables Vercel

Di **Project → Settings → Environment Variables**, tambahkan variable berikut untuk environment yang memang akan digunakan (Production, Preview, Development):

| Variable | Wajib | Keterangan |
|---|---:|---|
| `DATABASE_URL` | Ya | Connection string PostgreSQL runtime. Untuk Vercel, gunakan pooled/serverless connection string yang direkomendasikan provider. |
| `SESSION_SECRET` | Ya | Secret acak minimal 32 karakter; gunakan secret kuat dan konsisten pada seluruh instance project. |
| `BLOB_READ_WRITE_TOKEN` | Jika upload digunakan | Token server-side dari Vercel Blob. |

`ADMIN_USERNAME` dan `ADMIN_BOOTSTRAP_PASSWORD` **bukan environment runtime yang dibutuhkan website**. Gunakan keduanya hanya pada environment lokal ketika menjalankan bootstrap admin. Jangan menyimpan `ADMIN_BOOTSTRAP_PASSWORD` sebagai permanent Vercel variable.

Jangan menambahkan credentials sebagai `NEXT_PUBLIC_*`, meng-commit `.env`, atau menyalin secrets ke log. Setelah mengubah environment variables di Vercel, lakukan redeploy agar deployment baru menerimanya.

### 4. Terapkan skema dan buat admin

Sebelum admin/API mengakses database production:

1. Pastikan database target benar dan telah di-backup (jika bukan database baru).
2. Terapkan skema dengan prosedur yang telah ditinjau. Untuk database production baru saja, `npx prisma db push` dapat digunakan sebagai bootstrap skema manual setelah review, dengan connection URL production yang sesuai; database berisi data memerlukan rencana migrasi khusus.
3. Dari komputer tepercaya, gunakan `DATABASE_URL` production secara sementara pada environment lokal, isi `ADMIN_BOOTSTRAP_PASSWORD`, lalu jalankan `npm run admin:bootstrap`. Pastikan bootstrap menunjuk ke database production yang sama dengan deployment. Jangan commit file env tersebut, dan segera hapus nilai/password sementara setelah berhasil.
4. Periksa deployment dan log server; verifikasi login, konten publik, dan API dengan akun/endpoint yang sesuai.

Untuk production jangka panjang, tambahkan migration files yang ditinjau dan jalankan deployment migrations secara terkontrol (mis. `prisma migrate deploy`) sebagai langkah release terpisah. Workflow tersebut belum disiapkan di repository saat ini.

### 5. Deploy dan verifikasi

Klik **Deploy** atau push ke branch yang dikonfigurasi. Setelah build selesai:

- Buka domain Vercel dan verifikasi `/en` serta `/id`.
- Verifikasi `/login` dan proses login admin.
- Verifikasi konten database tampil, dan halaman admin dapat membaca/menyimpan data.
- Uji upload hanya jika Blob token sudah dikonfigurasi.
- Periksa deployment logs dan runtime logs untuk error koneksi atau skema.
- Tambahkan custom domain melalui **Project → Settings → Domains** bila diperlukan, lalu ikuti instruksi DNS Vercel.

Preview deployments sebaiknya menggunakan database dan secret Preview terpisah; jangan menghubungkan preview tak tepercaya ke database production.

## Memperbarui website

### Perubahan kode

Commit dan push ke branch Git yang terhubung ke Vercel. Vercel akan membuat deployment baru. Jalankan pemeriksaan lokal terlebih dahulu dan jangan mengubah skema production tanpa prosedur migrasi/backup.

### Perubahan konten

Login ke `/login`, buka dashboard, ubah konten melalui modul terkait, lalu simpan/publikasikan sesuai statusnya. Konten yang belum dipublikasikan tidak seharusnya menjadi materi portfolio publik.

## Keamanan dan operasional

- Jangan commit `.env`, `.env.local`, database URL, password, `SESSION_SECRET`, atau `BLOB_READ_WRITE_TOKEN`.
- Jangan menggunakan database production untuk percobaan lokal atau preview.
- Backup database sebelum perubahan skema dan sebelum pekerjaan migrasi.
- Batasi akses ke dashboard dan rotasi password admin bila kredensial terekspos.
- Gunakan Blob untuk file yang diunggah; token Blob hanya berada di server.
- Pastikan semua environment Vercel yang aktif mempunyai variabel yang benar; env Production, Preview, dan Development dikelola terpisah.
- Jangan menaruh data pribadi atau dokumen yang belum mendapat persetujuan untuk dipublikasikan.

## Batasan dan pekerjaan sebelum rilis

- `DATABASE_URL` harus diisi dan database harus memiliki skema sebelum fitur berbasis database dapat dipakai.
- Belum ada `prisma/migrations`; proses migration production versioned masih perlu disiapkan.
- Bootstrap database tidak mengisi konten portfolio. Tambahkan hanya data dan dokumen yang telah diverifikasi/disetujui pemilik.
- Sebagian detail konten dan terjemahan masih perlu dilengkapi oleh pemilik.
- Pengujian CRUD terhadap database target, audit aksesibilitas/Lighthouse, dan acceptance end-to-end masih harus dilakukan sebelum menyatakan seluruh kriteria rilis terpenuhi.

## Troubleshooting

### `DATABASE_URL environment variable is not set`

Pastikan file `.env` berada di root project dan berisi connection string PostgreSQL yang valid. Pastikan juga variable tersedia pada environment Vercel dan redeploy setelah perubahan. Jangan menyelesaikan error ini dengan menaruh connection string langsung di source code.

### Koneksi PostgreSQL gagal

- Periksa host, port, nama database, username/password, SSL requirements, dan allowlist jaringan dari provider.
- Pastikan URL-encode karakter khusus pada kredensial.
- Untuk Vercel gunakan endpoint/pooler yang didukung provider untuk serverless runtime.
- Pastikan database production/preview tidak tertukar.
- Prisma CLI harus menerima `DATABASE_URL` ketika menjalankan perintah skema.
- Jika driver `pg` menampilkan peringatan SSL untuk `sslmode=require`, ikuti rekomendasi resmi provider. Untuk mempertahankan verifikasi sertifikat penuh pada perilaku driver saat ini, gunakan `sslmode=verify-full` hanya jika didukung provider; jangan mengaktifkan mode kompatibilitas libpq yang melemahkan verifikasi tanpa memahami konsekuensinya.

### Login admin gagal

- Pastikan skema sudah diterapkan ke database yang sedang digunakan aplikasi.
- Pastikan admin sudah dibuat atau password diperbarui melalui `npm run admin:bootstrap`.
- Pastikan bootstrap dan aplikasi mengarah ke database yang sama.
- Periksa `SESSION_SECRET` tersedia dan panjangnya minimal 32 karakter.
- Jika secret session dirotasi, login ulang untuk membuat session baru.

### Upload media gagal

- Pastikan Vercel Blob store tersedia dan `BLOB_READ_WRITE_TOKEN` sudah diset pada environment aktif.
- Pastikan file termasuk jenis yang diizinkan dan tidak melebihi 5 MB.
- Periksa server logs tanpa menyalin token atau informasi sensitif ke laporan.

### Build Vercel berhasil tetapi halaman/API gagal saat runtime

Build tidak membuktikan bahwa database dapat dijangkau atau skema sudah diterapkan. Pastikan `DATABASE_URL` dan skema production valid, lalu tinjau runtime logs. Jangan menganggap `prisma generate` sebagai pembuatan tabel.
