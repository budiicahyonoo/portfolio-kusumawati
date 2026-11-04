# Portfolio Budi Cahyono

Website portfolio full-stack untuk AI Engineer dengan tema elegan hitam dan kuning emas.

## 🚀 Fitur

- **Portfolio Website**: Tampilan modern dengan section Hero, Skills, Projects, Experience, Blog, dan Contact
- **Admin Dashboard**: Interface CRUD lengkap untuk mengelola semua konten
- **Authentication**: Sistem login aman dengan Supabase Auth
- **Database**: PostgreSQL dengan Row Level Security (RLS)
- **Responsive Design**: Tampilan optimal di semua device

## 📋 Prasyarat

Sebelum memulai, pastikan Anda sudah menginstall:

- **Node.js** versi 18.x atau lebih tinggi ([Download](https://nodejs.org/))
- **Git** ([Download](https://git-scm.com/))
- **VSCode** atau editor code lainnya ([Download](https://code.visualstudio.com/))
- **Akun Vercel** (untuk deployment) - [Daftar Gratis](https://vercel.com/signup)
- **Akun Supabase** (sudah terhubung di project ini)

## 💻 Cara Menjalankan di VSCode

### 1. Clone Repository

Buka terminal dan jalankan:

```bash
# Clone repository dari GitHub
git clone https://github.com/username/portfolio-budi-cahyono.git

# Masuk ke folder project
cd portfolio-budi-cahyono
```

### 2. Install Dependencies

```bash
# Install semua package yang dibutuhkan
npm install
```

Proses ini akan menginstall semua dependencies yang tercantum di `package.json` termasuk Next.js, React, Supabase, Tailwind CSS, dan lainnya.

### 3. Setup Environment Variables

Environment variables sudah tersedia di project v0 Anda. Saat menjalankan di local, Anda perlu membuat file `.env.local`:

```bash
# Copy contoh environment variables
cp .env.example .env.local
```

Edit file `.env.local` dan isi dengan credentials Supabase Anda:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

**Cara mendapatkan credentials:**
1. Buka [Supabase Dashboard](https://app.supabase.com/)
2. Pilih project Anda
3. Klik Settings → API
4. Copy `Project URL` dan `anon public` key

### 4. Setup Database

Jalankan SQL scripts untuk membuat tabel dan seed data:

#### Opsi A: Via v0 (Recommended)

Di v0 chat, SQL scripts akan otomatis dijalankan saat Anda menyimpan project.

#### Opsi B: Manual via Supabase Dashboard

1. Buka [Supabase Dashboard](https://app.supabase.com/)
2. Pilih project Anda
3. Klik **SQL Editor** di sidebar
4. Copy isi file `scripts/001_create_tables.sql`
5. Paste di SQL Editor dan klik **Run**
6. Ulangi untuk `scripts/002_seed_data.sql`

#### Opsi C: Via Command Line

```bash
# Install Supabase CLI
npm install -g supabase

# Login ke Supabase
supabase login

# Link project
supabase link --project-ref your_project_ref

# Run migrations
supabase db push
```

### 5. Buat Admin User

Untuk mengakses admin dashboard, Anda perlu membuat user dengan role admin:

1. Buka [Supabase Dashboard](https://app.supabase.com/)
2. Klik **Authentication** → **Users**
3. Klik **Add User**
4. Isi email dan password
5. Klik **Create User**
6. Setelah user dibuat, klik user tersebut
7. Scroll ke bagian **User Metadata** atau **Raw User Meta Data**
8. Tambahkan metadata:
   ```json
   {
     "is_admin": true
   }
   ```
9. Klik **Save**

### 6. Jalankan Development Server

```bash
# Start development server
npm run dev
```

Server akan berjalan di `http://localhost:3000`

### 7. Akses Website

Buka browser dan akses:

- **Portfolio Website**: `http://localhost:3000`
- **Admin Login**: `http://localhost:3000/auth/login`
- **Admin Dashboard**: `http://localhost:3000/admin` (setelah login)

## 🔐 Cara Masuk ke Admin Dashboard

### Login

1. Buka `http://localhost:3000/auth/login`
2. Masukkan **email** dan **password** yang Anda buat di Supabase
3. Klik **Sign In**
4. Anda akan diarahkan ke Admin Dashboard

### Mengelola Konten

Admin Dashboard memiliki menu untuk:

1. **Home**: Edit hero section (nama, role, foto, value proposition)
2. **Skills**: Tambah/edit/hapus skills dengan logo
3. **Projects**: Kelola project portfolio (AI, Data, Model)
4. **Experience**: Kelola pengalaman kerja
5. **Blog**: Kelola artikel blog
6. **Contact**: Update informasi kontak

Setiap section memiliki:
- **Add Button**: Tambah item baru
- **Edit Button**: Edit item yang sudah ada
- **Delete Button**: Hapus item
- **Form Dialog**: Interface yang user-friendly untuk input data

### Logout

Klik tombol **Logout** di navigation bar admin dashboard.

## 🌐 Cara Deploy ke Vercel (Online)

### Metode 1: Deploy via v0 (Paling Mudah)

1. Di v0 chat, klik tombol **Publish** di pojok kanan atas
2. Pilih atau buat Vercel project baru
3. v0 akan otomatis:
   - Push code ke GitHub
   - Deploy ke Vercel
   - Setup environment variables
4. Tunggu deployment selesai
5. Klik link yang diberikan untuk mengakses website online

### Metode 2: Deploy via Vercel Dashboard

#### A. Push ke GitHub

```bash
# Initialize git (jika belum)
git init

# Add semua file
git add .

# Commit
git commit -m "Initial commit: Portfolio Budi Cahyono"

# Add remote repository
git remote add origin https://github.com/username/portfolio-budi-cahyono.git

# Push ke GitHub
git push -u origin main
```

#### B. Deploy di Vercel

1. Login ke [Vercel Dashboard](https://vercel.com/dashboard)
2. Klik **Add New** → **Project**
3. Import repository GitHub Anda
4. Vercel akan auto-detect Next.js settings
5. **Configure Project**:
   - Framework Preset: **Next.js**
   - Build Command: `npm run build`
   - Output Directory: `.next`
6. **Environment Variables**:
   Tambahkan environment variables berikut:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
   NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your_supabase_anon_key
   ```
7. Klik **Deploy**
8. Tunggu build selesai (biasanya 2-5 menit)

#### C. Setup Domain Custom (Opsional)

1. Di Vercel Dashboard, buka project Anda
2. Klik **Settings** → **Domains**
3. Tambahkan domain custom Anda
4. Update DNS settings sesuai instruksi Vercel
5. Tunggu DNS propagation (bisa 24-48 jam)

### Metode 3: Deploy via Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel

# Follow prompts:
# - Link to existing project? No
# - Project name: portfolio-budi-cahyono
# - Directory: ./
# - Override settings? No

# Deploy to production
vercel --prod
```

## 📱 Mengupdate Website yang Sudah Online

### Update Konten via Admin Dashboard

Setelah website online, Anda bisa update konten kapan saja:

1. Buka `https://your-domain.vercel.app/auth/login`
2. Login dengan akun admin
3. Edit konten di Admin Dashboard
4. Perubahan akan langsung terlihat di website

### Update Code

```bash
# Buat perubahan di code
# ...

# Commit changes
git add .
git commit -m "Update: deskripsi perubahan"

# Push ke GitHub
git push origin main

# Vercel akan otomatis rebuild dan deploy
```

## 🔧 Troubleshooting

### Error: Environment Variables Not Found

**Solusi:**
- Pastikan file `.env.local` ada dan terisi dengan benar
- Restart development server: `npm run dev`
- Clear browser cache dan reload

### Error: Cannot Connect to Database

**Solusi:**
- Cek Supabase credentials di `.env.local`
- Pastikan Supabase project aktif
- Cek Row Level Security (RLS) policies sudah dibuat

### Error: Admin Cannot Login

**Solusi:**
- Pastikan user sudah dibuat di Supabase Authentication
- Pastikan user memiliki metadata `is_admin: true`
- Clear browser cookies dan coba login lagi

### Error: Build Failed on Vercel

**Solusi:**
- Cek build logs di Vercel Dashboard
- Pastikan semua dependencies ada di `package.json`
- Pastikan environment variables sudah diset di Vercel

### Website Lambat Loading

**Solusi:**
- Optimize gambar (gunakan WebP format)
- Enable caching di Supabase
- Gunakan Vercel's Edge Network
- Compress assets dengan Next.js Image Optimization

## 📂 Struktur Project

```
portfolio-budi-cahyono/
├── app/                      # Next.js App Router
│   ├── admin/               # Admin dashboard pages
│   ├── auth/                # Authentication pages
│   ├── globals.css          # Global styles & theme
│   ├── layout.tsx           # Root layout
│   └── page.tsx             # Homepage
├── components/              # React components
│   ├── ui/                  # Reusable UI components
│   ├── navbar.tsx
│   ├── hero-section.tsx
│   ├── skills-section.tsx
│   └── ...
├── lib/                     # Utilities
│   └── supabase/           # Supabase clients
│       ├── client.ts       # Browser client
│       ├── server.ts       # Server client
│       └── proxy.ts        # Middleware client
├── scripts/                 # SQL scripts
│   ├── 001_create_tables.sql
│   └── 002_seed_data.sql
├── public/                  # Static assets
├── proxy.ts                 # Middleware
├── package.json             # Dependencies
├── next.config.mjs          # Next.js config
├── tailwind.config.ts       # Tailwind config
├── tsconfig.json            # TypeScript config
├── .gitignore              # Git ignore rules
└── README.md               # This file
```

## 🎨 Customization

### Mengubah Warna Tema

Edit `app/globals.css`:

```css
@theme inline {
  --color-primary: oklch(0.75 0.19 75); /* Kuning emas */
  --color-background: oklch(0.12 0 0);  /* Hitam */
  /* ... colors lainnya */
}
```

### Mengganti Font

Edit `app/layout.tsx`:

```tsx
import { Cute_Font as YourFont } from 'next/font/google'

const yourFont = YourFont({ subsets: ['latin'] })
```

### Menambah Section Baru

1. Buat component di `components/`
2. Tambah tabel di database via SQL script
3. Import dan gunakan di `app/page.tsx`
4. Buat admin page di `app/admin/`

## 📞 Support

Jika mengalami masalah:

1. Cek dokumentasi di file README ini
2. Cek Vercel documentation: [vercel.com/docs](https://vercel.com/docs)
3. Cek Supabase documentation: [supabase.com/docs](https://supabase.com/docs)
4. Buka issue di GitHub repository

## 📝 License

MIT License - Free to use untuk personal dan commercial projects.

---

**Built with:**
- Next.js 15
- React 19
- Supabase (PostgreSQL + Auth)
- Tailwind CSS v4
- TypeScript
- shadcn/ui components

**Developed by:** Budi Cahyono - AI Engineer

**Contact:** 
- Email: budicahyono.dev@gmail.com
- LinkedIn: linkedin.com/budii-cahyonoo
- GitHub: github.com/budicayono
