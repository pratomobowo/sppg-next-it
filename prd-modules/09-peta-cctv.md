# Modul 9: Peta Interaktif & Monitoring CCTV

> **Sistem:** Monitoring & Procurement Dapur MBG | **Dokumen:** PRD Mockup Modul 9 | **Tanggal:** 30 Mei 2026

## Overview

Dashboard visual: peta interaktif (lokasi dapur, sekolah, rute distribusi) dan live CCTV monitoring dapur. Target: BGN, Super Admin, Investor, PIC Dapur (view sendiri).

## 1. Peta Interaktif

`/peta`

**Map Engine:** Leaflet.js + OpenStreetMap tiles.

**Markers:** Dapur Aktif (hijau, factory icon), Dapur Nonaktif (merah), Sekolah (biru, pin icon).

**Klik Dapur Popup:** Nama, kapasitas, PIC, status, [Lihat Detail] [Lihat CCTV].

**Klik Sekolah Popup:** Nama, porsi hari ini, status pengiriman, [Lihat Riwayat].

**Rute Distribusi:** Polyline putus-putus dapur -> sekolah, biru muda. Toggle via legend.

**Filter Panel (slide-in kiri):** Yayasan (Super Admin), checklist: Dapur Aktif/Nonaktif, Sekolah, Rute. Pengiriman: Sudah Diterima/Dalam Perjalanan/Belum Dikirim.

**Search:** Autocomplete dapur/sekolah, pilih -> zoom + pan + highlight.

**States:** Loading skeleton, Empty "Belum ada dapur", Error "Gagal memuat" + retry.

## 2. Monitoring CCTV

`/peta?tab=cctv`

**Dapur Selector:** Dropdown (Super Admin: semua, PIC: sendiri).

**Live View Grid:** 2x2 / 3x2 grid, 16:9 card. Status: Live (hijau), Offline (merah), Connecting (kuning). Stream: HLS.js / WebRTC. Fallback: snapshot terakhir + timestamp.

**Klik Kamera:** Fullscreen modal, controls: exit, snapshot.

**Offline State:** Icon kamera + "Snapshot Terakhir: [waktu]" + [Lihat Snapshot].

## 3. Konfigurasi CCTV (Super Admin)

**Form Kamera (Modal):** Nama, URL Stream (RTSP/HLS), Lokasi (Dapur/Cuci/Loading), Dapur (dropdown). "Test Connection" button -> validasi.

**Note Teknis:** RTSP access via IP camera. Dapur perlu jaringan yang accessible server (VPN/tunnel). Opsional: WebRTC bridge via MediaMTX untuk low latency.

## 4. Mobile

Peta: full screen, filter drawer swipe kiri, legend collapsible. CCTV: grid 1 kolom, klik fullscreen landscape, swipe carousel.

---

*Dokumen disusun oleh PT Niaga Expert Teknologi (Next IT)*
