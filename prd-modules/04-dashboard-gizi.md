# Modul 4: Dashboard Kepatuhan Gizi & Standar BGN

> **Sistem:** Monitoring & Procurement Dapur MBG | **Dokumen:** PRD Mockup Modul 4 | **Tanggal:** 30 Mei 2026

## Overview

Dashboard visual membuktikan bahwa makanan memenuhi standar gizi nasional (BGN). Kalkulator gizi otomatis di backend, visualisasi kepatuhan di frontend. Target: BGN, Super Admin, Investor.

## 1. Dashboard Kepatuhan Gizi

`/compliance-dashboard`

**Filter Bar:**
- Row 1: Yayasan, Dapur (cascade), Rentang Tanggal (default 30 hari)
- Row 2 (quick chips): "7 Hari" | "30 Hari" | "3 Bulan" | "Tahun Ini"

**Grafik Kepatuhan Harian (Line Chart):**
4 series nutrisi vs standar BGN (garis merah putus-putus). Area di bawah standar: background merah 10% opacity. Tabs: Kalori | Karbohidrat | Protein | Lemak. Interaksi: hover tooltip, zoom drag, double-click reset, legend toggle.

**Tabel Kepatuhan Per Dapur:**
Kolom: Dapur, Lokasi, Rata-rata Kepatuhan (%), Status (traffic light), Detail (expand).

**Traffic Light:** >= 90% hijau "Baik", 80-89% kuning "Perhatian", < 80% merah "Di Bawah Standar". Sort default: terburuk di atas.

**Drill-Down (expand):** Mini chart 7 hari + detail 4 nutrisi + "Lihat Detail Dapur" link.

**Export:** CSV (data mentah), PDF (laporan siap print).

**Empty State:** "Data kepatuhan akan muncul setelah dapur mulai menginput laporan harian."

## 2. Detail Dapur (Drill-Down)

`/compliance-dashboard/dapur/:id`

**Header:** Nama + Lokasi + Status badge + Angka rata-rata besar.

**Section 1 — Grafik Detail (full width):** Line chart 30 hari, 4 nutrisi + standar BGN.

**Section 2 — Breakdown Mingguan:** 4 card (grid 2x2) — Kalori, Karbohidrat, Protein, Lemak. Tiap card: progress bar + persentase + status warna.

**Section 3 — Tabel Detail Harian (collapsible):** Tanggal, Menu, Kalori (std/aktual), Karbohidrat, Protein, Lemak, Status.

**Section 4 — Flag/Warning:** Daftar hari di bawah standar: tanggal, nutrisi, selisih, rekomendasi.

## 3. Kalkulator Gizi Menu

(Tampil di panel samping saat menyusun jadwal menu di Modul 1)

Auto-update setiap item ditambahkan. Progress bar per nutrisi vs standar BGN. Keterangan jika ada yang kurang/lebih.

Estimasi per porsi: Kalori aktual/std, Karbohidrat, Protein, Lemak, Serat.

## Komponen Shared

**Nutrisi Summary Card:** 4 kolom desktop, 2x2 mobile. Label + nilai aktual vs standar + progress bar.

**Date Range Picker:** Preset 7H/30H/3B/1T, custom kalender popup, max range 1 tahun.

---

*Dokumen disusun oleh PT Niaga Expert Teknologi (Next IT)*
