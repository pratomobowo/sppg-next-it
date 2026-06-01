# Modul 12: Audit Trail & Log Aktivitas Sistem

> **Sistem:** Monitoring & Procurement Dapur MBG | **Dokumen:** PRD Mockup Modul 12 | **Tanggal:** 30 Mei 2026

## Overview

Pencatatan seluruh aktivitas: create, update, delete, approve, reject, login, logout. Tercatat dengan timestamp, user, IP, dan detail perubahan JSON before/after. Akses eksklusif Super Administrator.

## 1. Dashboard Audit Trail

`/admin/audit-trail`

**Summary Cards:** Total Log, Hari Ini, Minggu Ini.

**Filter Bar:** Rentang Waktu (default 7 hari), Modul (multi-select), Aksi (multi-select: CREATE/UPDATE/DELETE/APPROVE/REJECT/LOGIN/LOGOUT/EXPORT), User (searchable), Search teks.

**Quick Filter Chips:** "Hari Ini" | "Minggu Ini" | "Bulan Ini" | "Login Gagal" | "Hapus Data".

**Activity Log (Timeline Cards):**

Tiap entry format:
```
30 Mei 2026, 14:22
Andi (PIC) . Cikarang 1
CREATE DO #42
Detail: Total Rp 2.010.000, Supplier PD Sumber Pangan
IP: 192.168.1.100 . Browser: Chrome 125 . Windows 10
Session: ab12****ef34
```

**Ikon Aksi:** CREATE (biru), UPDATE (kuning), DELETE (merah), APPROVE (hijau), REJECT (merah), LOGIN (abu-abu), LOGOUT (abu-abu), LOGIN_FAILED (merah), EXPORT (ungu), VIEW (abu-abu), CONFIG_CHANGE (oranye).

**Detail UPDATE:** "Beras: Harga 11.000 > 12.000 (+9.1%)", "Status: Pending > Approved".

**Detail DELETE:** Data sebelumnya dalam JSON.

Pagination. Export CSV/PDF.

## 2. Detail Log Modal

Klik entry -> expand:

info: ID Log, Timestamp, User + ID + Role, Yayasan, Dapur, Aksi, Modul, Entitas + ID.

**Data Sebelum/Sesudah:** CREATE: sebelum null, sesudah full JSON. UPDATE: diff highlight (merah dihapus, hijau ditambah). DELETE: sebelum full JSON, sesudah null.

Tech metadata: IP, User Agent, Session ID (di-mask).

## 3. Retention Policy

| Periode | Retensi |
|---------|---------|
| 0-6 bulan | Full detail + JSON payload |
| 6-12 bulan | Metadata saja, JSON dihapus |
| > 12 bulan | Archive CSV, hapus dari DB |

Konfigurasi: retensi bulan, auto-archive on/off, destination (Local/S3/GCS).

## 4. Security Events (Highlighted)

- LOGIN_FAILED: background merah (brute force detection)
- DELETE: border kiri merah (aksi destruktif)
- ROLE_CHANGE: background kuning (perubahan hak akses)
- CONFIG_CHANGE: background oranye

**Alert Rules (Future):** > 5 login gagal dalam 1 jam dari IP sama, > 10 penghapusan dalam 1 hari, perubahan role user -> notifikasi Super Admin.

## 5. Export

**CSV:** Kolom Timestamp, User, Role, Modul, Aksi, Entitas, Detail, IP. Di-filter sesuai filter aktif. Max 10.000 baris.

**PDF:** Format laporan resmi: cover, periode, total log, breakdown per modul, 50 log signifikan.

## 6. Backend Implementation

**Middleware:** Setiap API call mengubah data -> audit entry otomatis (non-blocking). Map HTTP method ke aksi: GET->VIEW, POST->CREATE, PUT->UPDATE, DELETE->DELETE.

**Queue:** Log di-push ke queue (in-memory/Redis), response langsung ke user, worker simpan batch setiap 5 detik atau 50 entry.

---

*Dokumen disusun oleh PT Niaga Expert Teknologi (Next IT)*
