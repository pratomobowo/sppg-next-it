# Modul 3: Monitoring Operasional Harian (Laporan Shift Dapur)

> **Sistem:** Monitoring & Procurement Dapur MBG | **Dokumen:** PRD Mockup Modul 3 | **Tanggal:** 30 Mei 2026

## Overview

PIC Dapur mengisi laporan harian per shift (Pagi/Siang) yang mencakup data produksi, distribusi ke sekolah, dokumentasi foto, dan catatan lapangan. Full Authorize menyetujui laporan. PWA-enabled untuk offline.

## 1. Form Laporan Shift (PIC View)

`/laporan-harian`

**Design: Mobile First.** PIC menggunakan dari handphone di dapur.

**Header:** Back arrow + "Laporan Shift", auto-fill tanggal & nama dapur (read-only).

**Shift Selector:** Segmented control Pagi/Siang. Default: sesuai waktu. 2 shift/hari terpisah.

**Section: Produksi**
- Jumlah Porsi Dimasak (number input)
- Target Porsi (auto dari jadwal, read-only, abu-abu)
- Realisasi (number input, max = dimasak)
- Selisih (auto-calculate): positif hijau, negatif merah + icon, nol abu-abu

**Section: Distribusi — Dynamic List Sekolah:**
- Tiap row: Nama Sekolah (text/pre-filled), Jumlah Porsi (number), Delete button
- "Tambah Sekolah" button
- Auto-validation: total distribusi <= total dimasak

**Section: Catatan Kendala:** Textarea 100px, optional.

**Section: Dokumentasi Foto:**
- Grid 3 kolom (mobile), 5 kolom (desktop)
- Slot 120x120px square. Kosong: dashed border + "+", Terisi: thumbnail + X delete
- Max 5 foto. Klik -> "Ambil Foto" (kamera) / "Pilih dari Galeri"
- Support multi-select. Auto-compress max 2MB/foto

**Bottom Bar (Sticky):** "KIRIM LAPORAN" button, full width 52px, primary.

**Validation:**
- Porsi dimasak wajib
- Min 1 sekolah
- Total distribusi <= dimasak
- Min 1 foto

**States:** Default kosong, Loading submit (spinner + disabled), Success toast + redirect ke Riwayat 1.5s, Network error (offline = IndexedDB, online = retry), Validation error (inline + scroll ke error pertama).

## 2. PWA Offline Mode

**Offline Banner:** Fixed top, kuning, "Anda sedang offline — data akan tersimpan otomatis".

**Offline Behavior:** Form tetap bisa diisi termasuk foto (base64 di IndexedDB). Submit offline -> IndexedDB + toast "Tersimpan offline". Entry muncul di Riwayat: badge "Offline" (oranye).

**Sync:** Service worker detect online -> sync banner biru "Menyinkronkan... (2/3)" -> complete: hijau "Semua berhasil" -> partial fail: kuning "1 gagal".

**PWA Install Prompt:** Setelah 3x kunjungan, bottom sheet "Pasang aplikasi di layar utama?" [Nanti Saja] [Pasang].

## 3. Riwayat Laporan (PIC View)

`/laporan-harian/riwayat`

**Filter:** Rentang tanggal, Status (Semua/Pending/Approved/Revised), Shift, Search.

**Table:** Tanggal, Shift, Porsi Dimasak, Tersalurkan, Status (badge: Pending kuning, Approved hijau, Revised merah, Offline oranye), Aksi.

**Aksi:** "Lihat Detail" (read-only + galeri foto lightbox + timeline approval), "Edit" (hanya Revised/Offline).

## 4. Approval Laporan (Full Authorize View)

`/approval-laporan`

**Counter:** "N laporan menunggu." Table: Tanggal, Dapur, Shift, Porsi, PIC, Status, "Review" button.

**Detail & Approval:** Desktop split — kiri detail laporan, kanan approval actions. Mobile stacked. "Setujui" (hijau) / "Tolak" (merah, wajib isi catatan revisi). Timeline approval.

**States:** Empty "Tidak ada laporan menunggu", Loading skeleton, Approve/Reject success toast.

## 5. View-Only Views

**BGN:** Filter yayasan & dapur, fokus data gizi & distribusi. **Investor:** Agregat, grafik porsi/minggu. **Super Admin:** Semua yayasan, filter, read-only.

---

*Dokumen disusun oleh PT Niaga Expert Teknologi (Next IT)*
