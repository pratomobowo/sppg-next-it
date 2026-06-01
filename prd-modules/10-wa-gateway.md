# Modul 10: WhatsApp Notification Gateway

> **Sistem:** Monitoring & Procurement Dapur MBG | **Dokumen:** PRD Mockup Modul 10 | **Tanggal:** 30 Mei 2026

## Overview

Notifikasi otomatis via WhatsApp untuk mendorong action di setiap tahapan workflow. Template Manager, log pengiriman, status tracking (terkirim/dibaca). One-way push notification, bukan chat two-way.

## 1. Template Manager

`/admin/notification-templates`

**Table:** Nama Template, Trigger Event, Status (Aktif/Nonaktif), Aksi (Edit/Delete). "+ Template Baru" button.

**Form Template (Modal):**

| Field | Type | Notes |
|-------|------|-------|
| Nama Template | text | Internal |
| Trigger Event | dropdown | Pilih dari daftar event |
| Status | toggle | Aktif/Nonaktif |
| Penerima | multi-select | Role yang menerima |
| Pesan | textarea | Format WA dengan placeholder |

**Variable Placeholders:** {{do_number}}, {{dapur_name}}, {{pic_name}}, {{supplier_name}}, {{total_amount}}, {{date}}, {{approver_role}}, {{revision_note}}, {{school_name}}, {{porsi_count}}, {{delivery_status}}, {{dana_amount}}, {{periode}}, {{login_link}}.

**Preview Panel:** Simulasi pesan WA dengan placeholder terisi, validasi, peringatan nomor WA.

## 2. Event Trigger Mapping

| Event ID | Trigger | Penerima Default |
|----------|---------|-----------------|
| do.created.sppg | PIC submit DO | SPPG |
| do.approved.sppg | SPPG approve | SPPI |
| do.approved.sppi | SPPI approve | Full Authorize |
| do.approved.final | Full Auth approve | PIC |
| do.revised | Approver reject | PIC |
| dana.confirmed | Full Auth konfirmasi | PIC |
| delivery.completed | Sekolah konfirmasi | PIC |

**Flow:** PIC submit -> WA ke SPPG -> SPPG approve -> WA ke SPPI -> SPPI approve -> WA ke Full Auth -> approve -> WA ke PIC. Jika reject di level mana pun -> WA ke PIC dengan catatan revisi.

## 3. Log Pengiriman

`/admin/notification-log`

**Filter:** Rentang Tanggal, Event Type, Status (Terkirim/Gagal/Dibaca).

**Table:** Tanggal, Event, Penerima, Role, Status (ikon + badge), Pesan (hover tooltip).

**Status Ikon:** Terkirim (centang hijau), Dibaca (centang biru ganda), Gagal (silang merah + reason), Pending (jam abu-abu).

**Detail Log (expand):** Event, penerima, pesan lengkap, timeline (antrian -> kirim -> delivered -> read).

**Resend:** Untuk status Gagal, tombol "Kirim Ulang".

## 4. Konfigurasi WA Gateway

`/admin/notification-config`

| Field | Type | Notes |
|-------|------|-------|
| Provider | dropdown | Fonnte / WATI / WA Business API |
| API Key / Token | password | Toggle show |
| Sender Number | text | Nomor terdaftar provider |
| Retry on Fail | toggle | Auto-retry |
| Max Retry | number | Maks 3 |

"Test Kirim" button -> input nomor tujuan -> kirim pesan test -> feedback sukses/gagal.

## 5. Tanpa WA Gateway

Sistem tetap berfungsi normal: notifikasi in-app, user cek approval queue manual. WA adalah nice-to-have untuk responsivitas.

**Notif Badge di Top Bar:** Icon lonceng + counter, dropdown 5 notif terbaru, "Lihat Semua" link.

---

*Dokumen disusun oleh PT Niaga Expert Teknologi (Next IT)*
