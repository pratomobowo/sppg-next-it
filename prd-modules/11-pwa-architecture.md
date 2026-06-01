# Modul 11: PWA Architecture & Mobile Strategy

> **Sistem:** Monitoring & Procurement Dapur MBG | **Dokumen:** PRD Mockup Modul 11 | **Tanggal:** 30 Mei 2026

## Overview

Arsitektur teknis PWA sebagai fondasi mobile. Fokus: offline capability, push notification, install prompt, background sync. Target: PIC Dapur mengisi laporan meskipun sinyal tidak stabil.

## 1. Why PWA

1 codebase web+mobile. Instalasi ringan 2-5 MB via browser. Update instan via deploy web. Offline via Service Worker + IndexedDB. Push via Web Push API. Kamera: Media Capture API. Tidak ada kebutuhan hardware eksklusif (Bluetooth/NFC).

## 2. Service Worker — Caching Strategy

| Tipe | Strategi | Deskripsi |
|------|----------|-----------|
| HTML (App Shell) | Cache First | Cache shell, network update background |
| CSS/JS/Fonts | Cache First | Content hash di filename |
| API GET | Network First | Fallback cache jika offline |
| Gambar/Ikon | Stale While Revalidate | Tampilkan cache, update diam-diam |
| POST/PUT | Background Sync | IndexedDB, sync saat online |

**App Shell Pre-cache:** index.html, CSS/JS hashed, fonts Plus Jakarta Sans, icons 192x192 & 512x512, offline.html.

**Lifecycle:** install (pre-cache + progress "Memasang...") -> activate (hapus cache lama, claim clients) -> fetch (strategi sesuai tabel).

## 3. Offline Data Layer — IndexedDB Schema

- `pending_reports`: {id, data (laporan + foto base64), created_at, synced, retry_count}
- `pending_deliveries`: {id, data, created_at, synced}
- `user_session`: {token, user, role, dapur_id, yayasan_id}
- `cached_data`: {key, data, fetched_at, ttl}

**Offline Flow:** Isi form -> cek online -> YES: kirim API, NO: IndexedDB + toast "Tersimpan offline".

**Background Sync:** Service Worker `sync` event -> kirim pending_reports satu per satu -> sukses: hapus + decrement badge -> gagal: retry_count++, tetap queue -> >5 fail: "Gagal Permanen" + notif.

**Periodic Sync:** Setiap 30 menit cek pending data, trigger sync jika online.

## 4. Push Notification

**Architecture:** Server -> Web Push API (VAPID keys) -> Browser Push Service (FCM/APNs) -> Service Worker -> showNotification().

**Permission Flow:** Setelah login 5 detik, prompt "Aktifkan Notifikasi?" (DO menunggu, laporan perlu review, dana masuk). "Nanti Saja" -> tunda 3 hari.

**Klik Notifikasi:** DO pending -> `/approval-queue`, DO approved -> `/procurement/history`, Dana masuk -> `/accounting`, Laporan -> `/approval-laporan`.

## 5. Install Prompt (A2HS)

**Custom UI:** Setelah 3x kunjungan / 5 menit login. "Pasang Aplikasi" — akses lebih cepat, offline. [Nanti Saja] [Pasang].

## 6. Web App Manifest

name: "Monitoring MBG", short_name: "MBG", display: standalone, theme_color: #1A73E8, orientation: portrait-primary. Icons 192+512px (maskable). Screenshots: dashboard, form laporan, approval queue. Categories: productivity, utilities. lang: id-ID.

## 7. Update Management

Detect service worker baru (byte-diff) -> prompt "Update Tersedia" [Nanti] [Update]. Auto-update untuk PIC setelah idle 5 menit. Cache versioning per deploy, hapus cache lama di activate.

## 8. Mobile Optimizations

Touch targets min 48x48px (WCAG), button 56px untuk submit. Viewport fit=cover + safe-area insets (iPhone notch). Keyboard handling: scroll into view, inputmode numeric/decimal/tel. Loading: skeleton screen, bukan spinner.

## 9. Performance Baseline

FCP < 1.5s (3G), TTI < 3s, Offline launch < 1s, Form submit < 2s, Foto upload < 5s, Lighthouse PWA > 90.

## 10. Device Support

Android Chrome/Firefox/Samsung: full PWA (Firefox: no push). iOS Safari/Chrome: PWA limited (no bg sync, fallback polling 5 menit). Desktop: full web app.

---

*Dokumen disusun oleh PT Niaga Expert Teknologi (Next IT)*
