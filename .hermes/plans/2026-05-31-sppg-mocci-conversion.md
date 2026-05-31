# SPPG MBG Mockup — Mocci Template Conversion

> **Source:** mocci-admin-template (Next.js 16 + React 19 + Tailwind v4 + shadcn/ui)
> **Target:** sppg-next-it — full mockup dashboard for Sistem Monitoring & Procurement Dapur MBG
> **PRD Ref:** /home/bowo/next-it-docs/sppg-mbg/prd-mockup-frontend.md

---

## Phase 1: Branding + Foundation

All 3 workstreams are DISJOINT files — run in parallel.

### Workstream A1: Branding Overhaul
**Files:** index.html, src/app/layout.tsx, src/app/globals.css

- [ ] **index.html:** Title "SPPG MBG — Sistem Monitoring & Procurement Dapur", lang="id", theme-color #1A73E8, PWA meta, description about Next IT
- [ ] **globals.css:** Replace Geist font with Inter + Plus Jakarta Sans (PRD Section 5.2), add SPPG color tokens (primary #1A73E8, success #0D904F, warning #F9AB00, danger #D93025, neutral #5F6368, bg #F8F9FA)
- [ ] **layout.tsx:** Replace metadata title/description to "SPPG MBG", update icons ref, remove "Moccilabs" references

### Workstream A2: Navigation & Config
**Files:** src/config/nav.ts, src/config/workspaces.ts, src/config/user.ts, src/config/theme-presets.ts

- [ ] **nav.ts:** Replace Mocci nav with SPPG role-based nav. Each role gets its own NavConfig:
  - Super Admin: Dashboard, Master Data, Procurement, Accounting, Inventory, Maps/CCTV, Audit Trail, User Management
  - PIC Dapur: Dashboard, Laporan Harian, Procurement (Draft DO + History), Inventory, Accounting, Pengiriman
  - SPPG/SPPI/Full Authorize: Dashboard, Approval Queue, DO History (+ Dana 12 Hari + Approval Laporan for Full Auth)
  - BGN: Dashboard Kepatuhan Gizi, Peta Lokasi, CCTV Viewer
  - Investor: Dashboard Keuangan, Laporan Operasional
- [ ] **workspaces.ts:** Replace with mock yayasan list (Yayasan Al-Falah, Yayasan Nurul Iman, dsb)
- [ ] **user.ts:** Create mock user with role selector (7 roles) — currentUser with firstName, role, yayasan, avatar
- [ ] **theme-presets.ts:** Update default preset to "blue" (#1A73E8 matches SPPG primary), keep others as alternates

### Workstream A3: App Shell & Auth Mockup
**Files:** src/components/app-shell/*, src/app/auth/*, new src/lib/auth.tsx

- [ ] **auth.tsx:** Create AuthContext + useAuth hook
  - Mock login (no real backend): select role → set user session
  - Stores currentUser in React context + localStorage
  - Returns: currentUser, login(role), logout(), isAuthenticated
- [ ] **AppShell wrapper:** Update to include role-aware sidebar (pass nav config based on role)
- [ ] **Auth pages:** Replace mock login page with SPPG branding (logo MBG/Next IT, email+password+role selector mockup, "Masuk" button). Add forgot password + reset password pages with Indonesian text.

---

## Phase 2: Core Screens (P0 + P1)

Run parallel after Phase 1 finishes.

### Workstream B1: Dashboard Screens
**Files:** Create: src/app/(dashboard)/{pic,admin,bgn,investor}/page.tsx

- [ ] **Dashboard PIC** (`/dashboard`): 
  - 4 stat cards: Porsi Hari Ini (progress bar), Stok Kritis (warning icon), DO Pending, Sisa Kas (formatRupiah)
  - 3 quick actions: Input Laporan Shift, Buat Surat Pesanan, Quick Price Update
  - Notifikasi feed (timeline: DO direvisi, DO approved, laporan pending)
  - States: loading skeleton, empty (ilustrasi + "Mulai dengan input laporan shift pertama")
  - Use mocci StatCards skeleton + recharts for mini charts
- [ ] **Dashboard Super Admin** (`/admin/dashboard`):
  - Yayasan switcher dropdown, agregat stat cards (total dapur, total porsi/bulan, total anggaran)
  - Table: Status Dapur (nama, lokasi, porsi hari ini, status badge)
  - Quick links: Master Data, User Management
- [ ] **Dashboard BGN** (`/compliance-dashboard`): 
  - Filter: yayasan, dapur, date range
  - Line chart: actual vs standar BGN (4 nutrisi tabs)
  - Table: Kepatuhan Per Dapur with traffic light status
  - Drill-down: detail per dapur (header + chart + weekly breakdown + daily table + warning flags)
- [ ] **Dashboard Investor** (`/investor-dashboard`):
  - Stat cards: Total Dana Masuk, Pengeluaran, Sisa Kas, Total Porsi
  - Bar chart: keuangan bulanan (masuk vs keluar)
  - Line chart: porsi per minggu

### Workstream B2: Procurement + Approval Screens
**Files:** Create: src/app/(procurement)/{draft,history}/page.tsx, src/app/(approval)/{queue,[doId]}/page.tsx

- [ ] **Draft DO** (`/procurement/draft`): Multi-step wizard
  - Step 1: Pilih Supplier (searchable dropdown + info)
  - Step 2: Input Item Belanja (dynamic multi-row: item, qty, harga, subtotal auto, Price Guard >5% flag)
  - Step 3: Review & Kirim (ringkasan + catatan + submit)
  - States: empty, validation error, loading submit, success
  - Use mocci wizard-stepper pattern
- [ ] **History DO** (`/procurement/history`): 
  - Filter: status (multi-select), supplier, date range
  - DataTable: No DO, Tanggal, Supplier, Total, Status badge (color-coded)
  - Click row → detail DO read-only
- [ ] **Approval Queue** (`/approval-queue`):
  - Counter badge: "N DO menunggu persetujuan"
  - DataTable: No DO, PIC, Dapur, Supplier, Total, Flag (price warning), Aksi (Review)
  - Empty state
- [ ] **Detail & Approval DO** (`/approval-queue/:doId`):
  - Split view: left=detail DO (supplier info, item table with price flags, total), right=approval panel
  - Progress Steps (state machine visual): PIC→SPPG→SPPI→Full Auth→Approved
  - Timeline persetujuan (log kronologis)
  - Action buttons: Setujui (green) / Tolak (red, mandatory catatan)
  - Read-only for non-approver roles
- [ ] **Realisasi Belanja** (`/procurement/realisasi/:doId`):
  - Upload foto realisasi (nota + barang, 1-3 photos)
  - Harga Final input
  - Catatan optional

---

## Phase 3: Operational Screens (P1-P2)

### Workstream C1: Laporan Harian + Pengiriman
**Files:** Create: src/app/(operations)/{laporan-harian,pengiriman}/page.tsx

- [ ] **Form Laporan Shift** (`/laporan-harian`): Mobile-first
  - Header: tanggal auto, nama dapur auto
  - Shift selector: Pagi/Siang (segmented control)
  - Produksi: jumlah porsi dimasak
  - Target vs Realisasi: target (auto), realisasi (input), selisih (auto green/red)
  - Distribusi: dynamic list sekolah + porsi, add/hapus row
  - Catatan Kendala (textarea)
  - Upload Foto (multi-file, preview thumbnail grid, drag-drop desktop)
  - Submit sticky bottom CTA "Kirim Laporan"
  - PWA offline banner (kuning) + sync indicator (biru)
  - Riwayat Laporan tab: DataTable
- [ ] **Tracking Pengiriman — PIC** (`/pengiriman`):
  - Input: pilih sekolah, nama driver, waktu berangkat
  - Table: Sekolah, Driver, Berangkat, Tiba, Status
- [ ] **Konfirmasi Sekolah** (`/pengiriman/konfirmasi/:id`): Mobile-only
  - Info dapur + porsi
  - Upload foto serah terima (kamera/galeri)
  - TTD Canvas (touch-enabled, 150px height)
  - Jumlah porsi diterima input
  - Full-width "Konfirmasi Penerimaan"

### Workstream C2: Inventory + Accounting
**Files:** Create: src/app/(operations)/{inventory,accounting}/page.tsx

- [ ] **Inventory Ledger** (`/inventory`):
  - DataTable: Nama Item, Stok Awal, Masuk, Keluar, Stok Akhir, Status (normal/rendah/kritis colored)
  - Filter: kategori, status
  - Click row → detail: log transaksi (date, tipo, jumlah, referensi, stok setelah)
  - Stock Opname section: input stok fisik vs sistem, selisih highlight
- [ ] **Accounting Buku Kas** (`/accounting`):
  - Header: Sisa Kas (large), Dana Masuk, Dana Keluar bulan ini
  - Tabs: Kas Masuk / Kas Keluar
  - Kas Masuk table: Tanggal, Sumber, Jumlah, Status (Terverifikasi/Pending)
  - Kas Keluar table: Tanggal, Kategori, Deskripsi, Jumlah, Nota
  - Form Input (modal): Jenis, Kategori, Jumlah, Deskripsi, Upload Nota
  - Dana 12 Hari (Full Auth only): table + Konfirmasi button
  - Export PDF button

---

## Phase 4: Admin Screens (P2-P3)

### Workstream D1: Master Data + Users
**Files:** Create: src/app/(admin)/{master-data,users}/page.tsx

- [ ] **Master Data** (`/admin/master-data`): Tabbed sub-menus
  - Data Dapur: DataTable + CRUD modal (nama, alamat, koordinat, kapasitas, PIC, HP)
  - Penjadwalan Menu: Calendar view + list toggle, click date → pilih menu
  - Katalog Supplier: DataTable + CRUD modal
  - Katalog Item & Gizi: DataTable (nama, kalori, karbohidrat, protein, lemak per 100g) + CRUD + import CSV
  - Harga Acuan Mingguan: week picker + inline editable table + history
- [ ] **User Management** (`/admin/users`):
  - DataTable: Nama, Email, Role, Yayasan, Status
  - Form Tambah/Edit (modal): Nama, Email, Password, Role dropdown (7 roles), Yayasan
  - Toggle Aktif/Nonaktif
  - Reset Password button

### Workstream D2: Peta/CCTV + Audit Trail
**Files:** Create: src/app/(admin)/{maps,audit-trail}/page.tsx

- [ ] **Peta & CCTV** (`/maps`):
  - Placeholder Leaflet map with static pin markers (mock data)
  - Pin color: hijau (normal), kuning (warning), merah (kritis)
  - Sidebar right: searchable list dapur
  - CCTV viewer: list dapur with CCTV, click → modal (placeholder iframe)
- [ ] **Audit Trail** (`/admin/audit-trail`):
  - Filter: User, Modul, Aksi (CRUD/Approve/Reject), Rentang Waktu
  - DataTable: Timestamp, User, Role, Aksi, Target, Detail, IP
  - Timeline DO sub-tab: select DO → vertical timeline (colored nodes)
  - Export CSV button

---

## Anti-Conflict Guarantee

All workstreams across phases touch DISJOINT sets of files. Within each phase, workstreams touch different files. Zero merge conflicts guaranteed.

| Workstream | Files |
|---|---|
| A1 (Branding) | index.html, layout.tsx, globals.css |
| A2 (Config) | nav.ts, workspaces.ts, user.ts, theme-presets.ts |
| A3 (Auth+Shell) | app-shell/*, auth/*, new lib/auth.tsx |
| B1 (Dashboards) | New dirs under (dashboard)/ |
| B2 (Procurement) | New dirs under (procurement)/, (approval)/ |
| C1 (Laporan+Kirim) | New dirs under (operations)/laporan-harian, pengiriman |
| C2 (Inv+Acc) | New dirs under (operations)/inventory, accounting |
| D1 (Master+Users) | New dirs under (admin)/master-data, users |
| D2 (Maps+Audit) | New dirs under (admin)/maps, audit-trail |

## Verification

After each phase:
1. `cd /home/bowo/sppg-next-it && npx tsc --noEmit` — TypeScript check
2. `npm run build` — production build
3. Commit + push to pratomobowo/sppg-next-it

Final: semua 15 screen mockup ready, role-based sidebar berfungsi, auth mockup bisa switch role.
