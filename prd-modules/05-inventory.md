# Modul 5: Manajemen Stok & Inventaris Dapur

> **Sistem:** Monitoring & Procurement Dapur MBG | **Dokumen:** PRD Mockup Modul 5 | **Tanggal:** 30 Mei 2026

## Overview

Pencatatan stok digital di tingkat dapur. Terhubung langsung dengan Procurement (auto-increment saat realisasi belanja) dan Operasional (auto-deduct saat input porsi masak). Stock Opname untuk rekonsiliasi mingguan.

## 1. Inventory Ledger (Dashboard Stok)

`/inventory`

**Summary Cards (4):** Total Item, Normal (hijau), Stok Rendah (kuning), Stok Kritis (merah).

**Filter Bar:** Kategori Item (multi-select), Status Stok (chips: Semua/Normal/Rendah/Kritis), Search.

**Table:** Item, Stok Awal, Masuk (akumulasi realisasi), Keluar (akumulasi porsi), Stok Akhir (auto), Status (badge).

**Status Logic:** Normal: stok > 3 hari estimasi. Rendah: 1-3 hari. Kritis: < 1 hari (merah + icon).

**Row Highlight:** Kritis -> merah 5% opacity. Rendah -> kuning 5% opacity. Sort default: terburuk di atas.

Klik row -> detail item.

## 2. Detail Item (Drill-Down)

`/inventory/item/:id`

**Header:** Nama + Kategori + Status badge + Estimasi pemakaian harian + Sisa hari.

**Progress Bar:** Warna sesuai status, lebar sesuai persentase.

**Log Transaksi (table):** Tanggal, Tipe (Masuk/Keluar icon), Jumlah, Referensi (link ke laporan/DO), Stok Setelah. Pagination 20.

## 3. Stock Opname

`/inventory/opname`

**Info Periode:** 7 hari terakhir, status "Belum dilakukan" / "Selesai — [tanggal]".

**Editable Table:** Item (read-only), Stok Sistem (read-only, abu-abu), Stok Fisik (input number, auto-fokus), Selisih (auto: Fisik-Sistem), Status (auto). Enter -> pindah ke input berikutnya.

**Threshold Selisih:** < 2% wajar (hijau), 2-5% perhatian (kuning), > 5% investigasi (merah + wajib catatan).

**Konfirmasi:** Enable setelah semua row terisi. Modal: "Data akan tercatat permanen di audit trail."

**States:** Belum input -> button disabled. Selisih besar -> textarea catatan wajib. Success -> toast + redirect. Sudah selesai -> read-only + history.

---

*Dokumen disusun oleh PT Niaga Expert Teknologi (Next IT)*
