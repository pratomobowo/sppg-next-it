# Modul 2: Autentikasi & Kontrol Akses (RBAC)

> **Sistem:** Monitoring & Procurement Dapur MBG | **Dokumen:** PRD Mockup Modul 2 | **Tanggal:** 30 Mei 2026

## Overview

Modul Autentikasi & RBAC mencakup: halaman Login/Reset Password, redirect otomatis berdasarkan role, dan User Management untuk Super Admin. 7 peran dengan tenant isolation per yayasan.

## 1. Login Page

`/login`

**Layout — Full-Centered Card (400px desktop, 90vw mobile):**

Logo Next IT/MBG + "Sistem Monitoring & Procurement" / "Dapur MBG". Form: Email (auto-focus), Password (show/hide toggle), "Lupa Password?" link, "MASUK" button full-width primary.

**Background:** Gradasi biru muda ke putih atau ilustrasi MBG.

**States:**
- Default: semua kosong
- Loading: spinner + "Memeriksa...", input disabled
- Invalid: "Email atau password salah." merah, password dikosongkan
- Inactive: "Akun Anda dinonaktifkan. Hubungi administrator."
- Network error: "Gagal terhubung." + "Coba Lagi" button
- Success: redirect sesuai role

## 2. Reset Password

`/forgot-password` | `/reset-password?token=xxx`

**Step 1 — Forgot Password:** Email input + "KIRIM LINK RESET" button + "< Kembali ke Login". States: Default, Loading, Success (icon check + "Cek inbox Anda"), Email not found.

**Step 2 — Reset Password (via link):** Password Baru + Konfirmasi Password + "RESET PASSWORD" button. Validation: min 8 char, 1 huruf besar, 1 angka, cocok. Token invalid -> "Link tidak valid atau kadaluarsa" + "Kirim Ulang". Success -> redirect ke login setelah 2 detik.

## 3. Role-Based Redirect

Setelah autentikasi sukses, JWT mengandung role + yayasan_id:

| Role | Redirect | Alasan |
|------|----------|--------|
| Super Administrator | `/admin/dashboard` | Overview semua yayasan |
| Admin Yayasan (PIC) | `/dashboard` | Operasional harian |
| Kepala SPPG (Lvl 1) | `/approval-queue` | DO menunggu |
| Kepala SPPI (Lvl 2) | `/approval-queue` | DO menunggu |
| Full Authorize (Lvl 3) | `/approval-queue` | Prioritas approval |
| BGN | `/compliance-dashboard` | Data gizi |
| Investor | `/investor-dashboard` | Data keuangan |

**Tenant Isolation:** API filter data berdasarkan yayasan_id dari token. User tidak bisa switch yayasan (kecuali Super Admin).

## 4. User Management (Super Admin)

`/admin/users`

**Table View:** Kolom: Nama, Email, Role, Yayasan, Status (Aktif/Nonaktif badge), Terakhir Login, Aksi. Filter: role, yayasan, status, search. Pagination 20/halaman.

**Actions:** Edit (modal), Toggle Status (switch), Reset Password (kirim link). "Tambah User" button.

**Form Tambah User (Modal):** Nama Lengkap (text), Email (unique), Password (wajib saat tambah), Role (dropdown: 7 opsi), Yayasan (dropdown, wajib kecuali Super Admin).

**Form Edit User:** Email read-only, Password field diganti "Reset Password" button.

**Toggle Status:** Nonaktifkan -> konfirmasi "User tidak bisa login." Aktifkan -> langsung (no confirm).

**States:** Empty -> "Belum ada user", Loading skeleton, Duplicate email -> "Email sudah terdaftar".

## 5. Matriks Akses (Opsional — LOW priority)

`/admin/access-matrix`

Tabel dokumentasi internal:

| Modul | Super Admin | PIC | SPPG | SPPI | Full Auth | BGN | Investor |
|-------|------------|-----|------|------|-----------|-----|----------|
| Master Data | CRUD | View | - | - | - | - | - |
| Laporan Harian | View All | CRUD | - | - | Approve | View | View |
| Dashboard Gizi | View All | - | - | - | - | View | - |
| Inventory | View All | CRUD | - | - | - | - | - |
| Accounting | View All | CRUD | - | - | Confirm | - | View |
| Procurement DO | View All | Draft | Approve | Approve | Approve | View | - |
| Tracking | View All | CRUD | - | - | - | - | View |
| Peta/CCTV | View All | View Own | - | - | - | View | - |
| Audit Trail | View All | - | - | - | - | - | - |
| User Mgmt | CRUD | - | - | - | - | - | - |

---

*Dokumen disusun oleh PT Niaga Expert Teknologi (Next IT)*
