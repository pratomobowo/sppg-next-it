# Modul 8: Tracking Pengiriman & Tanda Terima Sekolah

> **Sistem:** Monitoring & Procurement Dapur MBG | **Dokumen:** PRD Mockup Modul 8 | **Tanggal:** 30 Mei 2026

## Overview

Rantai bukti end-to-end: PIC mencatat pengiriman, kurir antar, penerima di sekolah konfirmasi dengan TTD digital + foto. Screen konfirmasi sekolah mobile-first, tanpa login (deep link).

## 1. Tracking Pengiriman (PIC View)

`/pengiriman`

**Section Hari Ini:** Table — Sekolah, Driver, Berangkat (waktu), Tiba, Status, Porsi Dikirim/Diterima.

**Status:** Dalam Perjalanan (biru), Diterima (hijau centang), Selisih (oranye), Tidak Diterima (merah).

**Klik Row:** Expand — foto serah terima, TTD penerima, catatan.

**Riwayat:** Filter: Rentang Tanggal, Status, Sekolah, Dapur (Super Admin).

**Export:** CSV pengiriman / PDF laporan harian. Batch view: group by tanggal + ringkasan total porsi.

## 2. Form Input Pengiriman

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| Dapur | auto | Ya | Dari session |
| Sekolah Tujuan | dropdown | Ya | List sekolah hari ini |
| Nama Driver | text | Ya | |
| Nomor HP Driver | tel | Tidak | |
| Waktu Berangkat | time | Ya | Default sekarang |
| Estimasi Tiba | time | Tidak | |

After submit: status "Menunggu Konfirmasi", link share ke sekolah.

## 3. Konfirmasi Penerimaan di Sekolah (Mobile, Tanpa Login)

`/pengiriman/konfirmasi/:token` (deep link, token unik)

**Ultra Simple Mobile Screen:**

Header: "KONFIRMASI PENERIMAAN MAKANAN BERGIZI", info dapur/sekolah/driver/porsi dikirim.

**Foto Serah Terima:** Tombol besar "Ambil Foto" (langsung kamera, capture=environment), preview + "Ambil Ulang". Wajib.

**Tanda Tangan Digital:** Canvas HTML5 100% x 150px, support touch & mouse. "Hapus" button. Export base64 PNG. Wajib.

**Jumlah Porsi Diterima:** Number input besar (56px), pre-filled dari dikirim. Bisa diubah jika kurang.

**Catatan:** Muncul jika porsi diterima < dikirim, auto-fokus.

**Submit Button:** Full width 56px, sticky bottom, "Konfirmasi Penerimaan".

**States:** Loading (spinner + overlay), Success (fullscreen: centang hijau + "Terima Kasih!" + auto-close 3s), Error (retry), Validation (foto/TTD wajib).

## 4. Link Share Component

Setelah PIC input pengiriman: "Link Konfirmasi" + URL + [Salin Link] [Share via WA] (wa.me pre-filled).

## 5. Notifikasi

Ke PIC: in-app + real-time status update setelah sekolah konfirmasi. Tanpa WA gateway, sistem tetap berfungsi normal.

---

*Dokumen disusun oleh PT Niaga Expert Teknologi (Next IT)*
