# Setup Admin User

## Masalah
Jika Anda mendapat error "Failed to save changes" di admin dashboard, itu berarti user Anda belum memiliki permission admin.

## Solusi: Set Admin Metadata

Ada 2 cara untuk set user sebagai admin:

### Cara 1: Via SQL Script (Recommended)

1. Buka Supabase Dashboard → SQL Editor
2. Jalankan script `004_set_admin_user.sql`
3. Atau copy-paste query ini:

```sql
UPDATE auth.users
SET raw_user_meta_data = raw_user_meta_data || '{"is_admin": true}'::jsonb
WHERE email = 'budicahyono.dev@gmail.com';
```

4. Logout dan login kembali di `/auth/login`
5. Coba save data lagi

### Cara 2: Via Supabase Dashboard (Manual)

1. Buka Supabase Dashboard
2. Pergi ke **Authentication** → **Users**
3. Cari user dengan email Anda (`budicahyono.dev@gmail.com`)
4. Klik pada user tersebut
5. Scroll ke bagian **User Metadata**
6. Klik **Edit** pada `raw_user_meta_data`
7. Tambahkan field baru:
   ```json
   {
     "is_admin": true
   }
   ```
8. Klik **Save**
9. Logout dan login kembali
10. Coba save data lagi

### Cara 3: Saat Sign Up (Untuk user baru)

Jika Anda ingin membuat admin user baru:

1. Buka Supabase Dashboard → SQL Editor
2. Jalankan query ini SETELAH user melakukan sign up:

```sql
UPDATE auth.users
SET raw_user_meta_data = raw_user_meta_data || '{"is_admin": true}'::jsonb
WHERE email = 'email-admin-baru@example.com';
```

## Verifikasi Admin Status

Untuk memastikan user sudah jadi admin, jalankan query ini:

```sql
SELECT 
  id,
  email,
  raw_user_meta_data->>'is_admin' as is_admin,
  created_at
FROM auth.users
WHERE email = 'budicahyono.dev@gmail.com';
```

Kolom `is_admin` harus bernilai `true`.

## Troubleshooting

### Masih gagal save setelah set admin?

1. **Logout dan login kembali** - Token JWT perlu di-refresh
2. **Clear browser cache** - Hapus cookies dan local storage
3. **Cek RLS policies** - Pastikan policies sudah di-enable dengan menjalankan `001_create_tables.sql`
4. **Cek environment variables** - Pastikan `NEXT_PUBLIC_SUPABASE_URL` dan `NEXT_PUBLIC_SUPABASE_ANON_KEY` sudah benar

### Error: "auth.users is not accessible"

Jika Anda mendapat error ini saat menjalankan script, gunakan Cara 2 (via Dashboard) karena Anda tidak punya akses langsung ke table `auth.users` via SQL Editor.

## Keamanan

**PENTING:** Hanya set `is_admin: true` untuk user yang benar-benar Anda percaya. Admin memiliki akses penuh untuk Create, Read, Update, dan Delete semua data portfolio.
