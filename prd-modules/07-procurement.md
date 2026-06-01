# Modul 7: Advanced Procurement & Supply Chain

> **Sistem:** Monitoring & Procurement Dapur MBG | **Dokumen:** PRD Mockup Modul 7 | **Tanggal:** 30 Mei 2026

## Overview

Modul paling kompleks. Mencakup: manajemen DO, drafting 3-step wizard, Price Guard kontrol harga >5%, approval berjenjang 4 tingkat (State Machine), realisasi belanja dengan foto, dan generate PDF Surat Pemesanan + Hybrid Signature.

## 1. Role & Akses

| Role | Akses |
|------|-------|
| PIC Dapur | Draft DO, Quick Price Update, Realisasi, History |
| SPPG (Lvl 1) | Approval DO tahap 1 |
| SPPI (Lvl 2) | Approval DO tahap 2 |
| Full Authorize (Lvl 3) | Approval DO tahap akhir, Konfirmasi Dana 12 Hari |
| Super Admin | View all DO semua yayasan |
| BGN, Investor | View DO (read-only) |

## 2. Drafting Surat Pesanan (3-Step Wizard)

`/procurement/draft`

Progress indicator: **Pilih Supplier > Input Item > Review & Kirim**

**Step 1 — Pilih Supplier:** Searchable dropdown supplier (dari Katalog, terikat yayasan). Info card: nama, kontak, alamat, total DO sebelumnya. Empty: "Belum ada supplier. Hubungi administrator."

**Step 2 — Input Item (Dynamic Multi-Row):**

| # | Item (dropdown) | Qty | Satuan (auto) | Harga | Subtotal (auto) | Hapus |
|---|-----------------|-----|---------------|-------|-----------------|-------|

- "Tambah Item" button
- **Price Guard Real-Time:** saat input harga, sistem query Harga Acuan mingguan. Jika > 5%: row background merah tipis + icon + "X% di atas harga acuan (Rp Y)". Tidak memblokir, hanya peringatan.
- Total Belanja auto-sum, sticky bottom
- Validation: semua wajib, min 1 item, tidak duplikat

**Step 3 — Review & Kirim:** Ringkasan (supplier, item, total, price flag). Catatan opsional. Warning box jika ada item flagged. "KIRIM KE SPPG" button.

After submit: toast, redirect ke history, status "Pending SPPG", WA notifikasi ke SPPG.

## 3. History DO (PIC View)

`/procurement/history`

Filter: Status, Supplier, Rentang Tanggal. Table: No DO, Tanggal, Supplier, Total, Status (badge), Flag (jumlah item kena guard), Aksi.

**Status Badges:** Draft (abu-abu), Pending SPPG (kuning), Pending SPPI (oranye), Pending Full Auth (biru), Approved (hijau), Revised (merah), Locked (hijau tua + kunci).

**Aksi:** "Lihat" detail, "Revisi" (hanya Revised), "Realisasi" (hanya Approved).

## 4. Approval Queue

`/approval-queue`

Counter "N DO menunggu." Table: DO, PIC, Dapur, Supplier, Total, Tgl, Flag, "Review" button.

**Detail & Approval (Split View):** Kiri — detail DO + item + catatan PIC. Kanan — State Machine progress + Action.

**Progress Steps:** PIC(completed) > SPPG(current) > SPPI(pending) > Full Auth(pending) > Approved(pending). Current ditandai pulse animation.

**Timeline:** Vertikal kronologis — timestamp, user, aksi, catatan reject.

**Action Buttons:** "SETUJUI" (hijau, modal konfirmasi) / "TOLAK" (merah, modal textarea catatan revisi wajib min 10 char). Jika bukan approver yang tepat -> info box + buttons disabled.

**Setelah Approve Final:** DO status Approved, notifikasi WA ke PIC.

**Setelah Reject:** DO status Revised, PIC dapat notifikasi, muncul "Revisi DO" button.

## 5. Realisasi Belanja

`/procurement/realisasi/:doId`

**Foto Realisasi:** Min 1, max 3 foto. Panduan: "Nota Asli + Barang Fisik".

**Tabel Harga Final:** Item, Harga DO (read-only), Harga Final (input), Selisih (auto). Lebih mahal -> merah, lebih murah -> hijau.

**Setelah Simpan:** DO status Locked (tidak bisa diubah), Inventory auto-update, generate PDF Surat Pemesanan + Hybrid Signature, audit trail.

## 6. Quick Price Update (PIC)

`/procurement/quick-price`

Tabel: Item, Supplier, Harga Terbaru (input), Tanggal Update. Referensi pribadi PIC, tidak mengubah Harga Acuan admin.

## 7. PDF Surat Pemesanan + Hybrid Signature

Auto-generate setelah Locked. Layout: Logo yayasan, "SURAT PESANAN (DELIVERY ORDER)" + No DO, Supplier & tanggal, tabel item/qty/harga/subtotal, total. TTD Digital: Full Authorize (disetujui) + PIC Dapur (disiapkan). Realisasi: foto nota + barang, TTD PIC.

---

*Dokumen disusun oleh PT Niaga Expert Teknologi (Next IT)*
