# Modul 6: Accounting & Transparansi Keuangan

> **Sistem:** Monitoring & Procurement Dapur MBG | **Dokumen:** PRD Mockup Modul 6 | **Tanggal:** 30 Mei 2026

## Overview

Single-Entry Ledger untuk transparansi dana yayasan. Mencakup buku kas, dana masuk per 12 hari (konfirmasi Full Authorize), upload nota, dan ekspor laporan PDF dengan TTD.

## 1. Dashboard Accounting

`/accounting`

**Summary Cards (3):** Sisa Kas Saat Ini (hijau/merah), Dana Masuk Bulan Ini (tren vs bulan lalu), Dana Keluar Bulan Ini (% dari dana masuk).

**3 Tabs:** Kas Masuk, Kas Keluar, Dana 12 Hari (hanya Full Authorize).

## 2. Tab: Kas Masuk

**Table:** Tanggal, Sumber (Dana 12 Hari/Lainnya), Jumlah (Rp), Status (Terverifikasi hijau / Pending kuning), Nota (ikon PDF), Aksi.

**Form Input (Modal):** Tanggal (default hari ini), Sumber (dropdown), Jumlah (format Rupiah, inputmode numeric), Deskripsi, Upload Nota (PDF, 1 file).

**Detail Row (expand):** Deskripsi lengkap, link download nota, diinput oleh.

## 3. Tab: Kas Keluar

**Table:** Tanggal, Kategori (Bahan Masak badge biru / Operasional abu-abu), Deskripsi, Jumlah, Nota, Aksi.

**Form Input (Modal):** Tanggal, Kategori (dropdown), Jumlah, Deskripsi (wajib), Upload Nota (wajib PDF).

**States:** Nota belum upload -> "Menunggu Nota" (oranye). Pengeluaran >50% dana masuk -> warning bar.

## 4. Tab: Dana 12 Hari (Full Authorize Only)

**Menunggu Konfirmasi (table):** Periode, Jumlah, Status (Pending), "Konfirm" button.

**Riwayat (table):** Periode, Jumlah, Dikonfirmasi (tanggal), Oleh.

**Konfirmasi Modal:** "Periode: [tgl], Jumlah: Rp [X]. Dana akan tercatat permanen." Setelah dikonfirmasi -> auto masuk Kas Masuk + audit trail.

## 5. Ekspor Laporan PDF

Tombol "Export Laporan" -> modal: Periode (date range), Format (PDF/CSV), Checklist (Kas Masuk, Kas Keluar, Ringkasan, TTD).

**PDF Output:** Logo + "Laporan Keuangan Dapur [Nama]" + Periode. Ringkasan dana masuk/keluar/sisa. Tabel Kas Masuk & Keluar. Footer: tempat TTD + nama jabatan.

---

*Dokumen disusun oleh PT Niaga Expert Teknologi (Next IT)*
