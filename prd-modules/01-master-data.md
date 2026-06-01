# Modul 1: Master Data & Konfigurasi Sistem

> **Sistem:** Monitoring & Procurement Dapur MBG | **Dokumen:** PRD Mockup Modul 1 | **Tanggal:** 30 Mei 2026

## Overview

Modul Master Data adalah fondasi seluruh sistem. Semua data referensi dikelola terpusat per yayasan oleh Super Administrator. Terdiri dari 5 sub-modul.

## 1. Data Dapur

`/admin/master-data/dapur`

**Table View:** Kolom: Nama Dapur, Lokasi (kecamatan/kota), Kapasitas (porsi/hari), PIC, Status (Aktif/Nonaktif), Aksi. Filter: status dropdown, search by nama. Pagination 20/halaman. Sort default by nama ASC.

**Actions per Row:** Edit (modal), Toggle Status (switch), Delete (konfirmasi modal).

**Top Right:** "Tambah Dapur" button (primary).

**Form (Modal):**

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| Nama Dapur | text | Ya | Max 100 char |
| Alamat Lengkap | textarea | Ya | |
| Koordinat | lat/lng | Tidak | Map picker atau manual |
| Kapasitas Produksi | number | Ya | Porsi/hari, min 1 |
| Nama PIC | text | Ya | |
| Nomor HP PIC | tel | Ya | Format 08xx |
| Yayasan | dropdown | Ya | |
| Status | toggle | Default: Aktif | |

**Map Picker (Optional):** Leaflet mini-map 300x200px, klik set koordinat, marker bisa di-drag.

**States:**
- Empty: ilustrasi + "Belum ada dapur terdaftar."
- Loading: skeleton table 5 rows shimmer
- Error: retry button
- Validation: inline error
- Delete Confirm: "Data laporan harian dan stok akan tetap tersimpan."

## 2. Penjadwalan Menu

`/admin/master-data/menu`

**Dual View (toggle):** Calendar View (default) / List View

**Calendar View:** Month grid, tiap tanggal tampil menu (max 3 item, "+N"), warna card: sarapan kuning, makan siang hijau. Klik tanggal -> slide-in panel edit.

**List View:** Filter rentang tanggal & dapur. Table: Tanggal, Dapur, Menu Utama, Lauk, Sayur, Buah. 50 rows/halaman.

**Edit Menu Panel (slide-in kanan):**
- Dynamic list menu items (nama, kategori, porsi)
- "Tambah Menu" / "Hapus" per item
- Quick Actions: "Salin ke Minggu Depan", "Salin ke Semua Dapur" (Super Admin)
- "Simpan" button

**States:** Calendar kosong -> "Belum ada menu", Loading skeleton, Copy confirmation modal.

## 3. Katalog Supplier

`/admin/master-data/supplier`

**Table View:** Kolom: Nama, Kontak (nama+HP), Alamat, Yayasan, Jumlah DO, Aksi. Filter: yayasan, search nama.

**Form (Modal):** Nama Supplier (text, wajib), Nama Kontak, Nomor HP (08xx, wajib), Alamat, Yayasan (dropdown), Catatan.

**States:** Empty -> "Belum ada supplier", Delete confirm -> "Supplier [Nama] digunakan di [N] DO. Data DO tetap menyimpan referensi."

## 4. Katalog Item & Nilai Gizi

`/admin/master-data/items`

**Table View:** Kolom: Nama Item, Kategori, Kalori, Karbohidrat, Protein, Lemak, Serat, Harga Acuan Terbaru, Aksi. Highlight: selisih >5% -> background kuning.

**Form (Modal):** Nama Item (unique), Kategori (8 opsi), Satuan (kg/g/L/mL/butir/ikat/bungkus), Kalori/Karbohidrat/Protein/Lemak/Serat (number, per 100g/ml).

**Bulk Import (CSV):** Upload -> preview 10 baris -> validasi -> error report per baris -> konfirmasi import.

**States:** Empty, Import error table, Delete confirm.

## 5. Harga Acuan Mingguan

`/admin/master-data/harga-acuan`

**Week Selector:** Navigasi < minggu lalu | **tanggal** | minggu depan >. Info: "Diinput oleh: [nama], [tanggal]".

**Editable Table:** Kolom: Item, Kategori, Satuan, Harga Acuan (input), Harga Sebelumnya (read-only), Perubahan (auto %). "Simpan Semua" di bawah.

**History Section:** Accordion "Riwayat Harga Acuan", table per minggu, expand detail.

**States:** Minggu kosong -> "Salin dari minggu lalu?", Unsaved changes warning, perubahan >10% ditandai kuning.

## 6. Navigasi & Sidebar

Sub-menu Master Data expandable: Data Dapur, Penjadwalan Menu, Katalog Supplier, Katalog Item & Gizi, Harga Acuan. Aktif: highlighted + left border primary.

Breadcrumb: `Dashboard > Master Data > [Sub-Menu Aktif]`

## 7. Komponen Shared

**CRUD Table Pattern:** table-toolbar (filter + button), data-table, table-pagination.

**Modal Form Pattern:** modal-overlay > modal-card > header/body/footer. Tombol: Batal (secondary) + Simpan (primary).

**Toggle Status:** label.toggle-switch > input[checkbox] + span.toggle-slider.

---

*Dokumen disusun oleh PT Niaga Expert Teknologi (Next IT)*
