/**
 * tenant-data.ts — Centralized mock data for Tenant Management module
 * Hierarchy: Platform Admin → Yayasan (Tenant) → Dapur → User
 */

export type TenantStatus = 'Aktif' | 'Trial' | 'Suspended' | 'Expired'
export type TenantPlan = 'Starter' | 'Pro' | 'Enterprise'
export type UserRole = 'Super Administrator' | 'PIC Dapur (Admin Yayasan)' | 'Kepala SPPG (Lvl 1)' | 'Kepala SPPI (Lvl 2)' | 'Full Authorize (Lvl 3)'
export type UserStatus = 'Aktif' | 'Nonaktif' | 'Pending Invite'
export type DapurStatus = 'Aktif' | 'Nonaktif' | 'Setup'

export type Tenant = {
  id: string
  namaYayasan: string
  namaPlatform: string // nama tampilan di sistem
  npwp: string
  alamat: string
  kota: string
  provinsi: string
  picNama: string
  picEmail: string
  picTelp: string
  plan: TenantPlan
  status: TenantStatus
  jumlahDapur: number
  jumlahDapurAktif: number
  jumlahUser: number
  maksDapur: number
  maksUser: number
  tanggalDaftar: string
  trialHingga?: string
  logoUrl?: string
  fiturAktif: string[]
  totalPorsiHariIni: number
  totalPorsiSebulan: number
}

export type TenantUser = {
  id: string
  tenantId: string
  nama: string
  email: string
  role: UserRole
  status: UserStatus
  dapurId?: string
  dapurNama?: string
  lastActive?: string
  joinedAt: string
  avatar: number
}

export type TenantDapur = {
  id: string
  tenantId: string
  nama: string
  lokasi: string
  kota: string
  kapasitas: number
  porsiHariIni: number
  status: DapurStatus
  picNama: string
  picTelp: string
  tanggalBerdiri: string
}

// ─── Plan Config ───────────────────────────────────────────────────────────────

export const PLAN_CONFIG: Record<TenantPlan, {
  label: string
  color: string
  bgColor: string
  maksDapur: number
  maksUser: number
  fitur: string[]
}> = {
  Starter: {
    label: 'Starter',
    color: 'text-blue-600 dark:text-blue-400',
    bgColor: 'bg-blue-500/10 border-blue-500/20',
    maksDapur: 3,
    maksUser: 10,
    fitur: ['Dashboard', 'Master Data', 'Procurement', 'Inventory', 'Laporan Harian'],
  },
  Pro: {
    label: 'Pro',
    color: 'text-violet-600 dark:text-violet-400',
    bgColor: 'bg-violet-500/10 border-violet-500/20',
    maksDapur: 10,
    maksUser: 50,
    fitur: ['Dashboard', 'Master Data', 'Procurement', 'Inventory', 'Laporan Harian', 'Maps & CCTV', 'WA Gateway', 'AI Helper', 'Accounting'],
  },
  Enterprise: {
    label: 'Enterprise',
    color: 'text-amber-600 dark:text-amber-400',
    bgColor: 'bg-amber-500/10 border-amber-500/20',
    maksDapur: 999,
    maksUser: 999,
    fitur: ['Dashboard', 'Master Data', 'Procurement', 'Inventory', 'Laporan Harian', 'Maps & CCTV', 'WA Gateway', 'AI Helper', 'Accounting', 'Custom Branding', 'Priority Support', 'Analytics Lanjutan'],
  },
}

// ─── Mock Tenants ──────────────────────────────────────────────────────────────

export const MOCK_TENANTS: Tenant[] = [
  {
    id: 'TEN-001',
    namaYayasan: 'Yayasan Al-Falah',
    namaPlatform: 'Al-Falah SPPG',
    npwp: '01.234.567.8-901.000',
    alamat: 'Jl. Raya Fatmawati No. 88',
    kota: 'Jakarta Selatan',
    provinsi: 'DKI Jakarta',
    picNama: 'H. Ahmad Fauzi',
    picEmail: 'ahmad.fauzi@alfalah.org',
    picTelp: '081234567890',
    plan: 'Enterprise',
    status: 'Aktif',
    jumlahDapur: 5,
    jumlahDapurAktif: 4,
    jumlahUser: 32,
    maksDapur: 999,
    maksUser: 999,
    tanggalDaftar: '2025-01-15',
    fiturAktif: PLAN_CONFIG.Enterprise.fitur,
    totalPorsiHariIni: 784,
    totalPorsiSebulan: 18200,
    logoUrl: undefined,
  },
  {
    id: 'TEN-002',
    namaYayasan: 'Yayasan Nurul Iman',
    namaPlatform: 'Nurul Iman MBG',
    npwp: '02.345.678.9-012.000',
    alamat: 'Jl. Soekarno Hatta No. 45',
    kota: 'Bandung',
    provinsi: 'Jawa Barat',
    picNama: 'Drs. Hendra Kusuma',
    picEmail: 'hendra@nuruliman.org',
    picTelp: '082345678901',
    plan: 'Pro',
    status: 'Aktif',
    jumlahDapur: 3,
    jumlahDapurAktif: 3,
    jumlahUser: 18,
    maksDapur: 10,
    maksUser: 50,
    tanggalDaftar: '2025-03-20',
    fiturAktif: PLAN_CONFIG.Pro.fitur,
    totalPorsiHariIni: 615,
    totalPorsiSebulan: 14300,
    logoUrl: undefined,
  },
  {
    id: 'TEN-003',
    namaYayasan: 'Yayasan Baiturrahman',
    namaPlatform: 'Baiturrahman SPPG',
    npwp: '03.456.789.0-123.000',
    alamat: 'Jl. Pemuda No. 12',
    kota: 'Surabaya',
    provinsi: 'Jawa Timur',
    picNama: 'Ir. Suharto Wibowo',
    picEmail: 'suharto@baiturrahman.org',
    picTelp: '083456789012',
    plan: 'Pro',
    status: 'Aktif',
    jumlahDapur: 4,
    jumlahDapurAktif: 3,
    jumlahUser: 24,
    maksDapur: 10,
    maksUser: 50,
    tanggalDaftar: '2025-02-10',
    fiturAktif: PLAN_CONFIG.Pro.fitur,
    totalPorsiHariIni: 590,
    totalPorsiSebulan: 13700,
    logoUrl: undefined,
  },
  {
    id: 'TEN-004',
    namaYayasan: 'Yayasan Ar-Rahmah',
    namaPlatform: 'Ar-Rahmah MBG',
    npwp: '04.567.890.1-234.000',
    alamat: 'Jl. Pahlawan No. 7',
    kota: 'Semarang',
    provinsi: 'Jawa Tengah',
    picNama: 'Dra. Siti Aminah',
    picEmail: 'siti.aminah@arrahmah.org',
    picTelp: '084567890123',
    plan: 'Starter',
    status: 'Trial',
    jumlahDapur: 1,
    jumlahDapurAktif: 1,
    jumlahUser: 5,
    maksDapur: 3,
    maksUser: 10,
    tanggalDaftar: '2026-05-20',
    trialHingga: '2026-06-19',
    fiturAktif: PLAN_CONFIG.Starter.fitur,
    totalPorsiHariIni: 120,
    totalPorsiSebulan: 1440,
    logoUrl: undefined,
  },
  {
    id: 'TEN-005',
    namaYayasan: 'Yayasan Darussalam',
    namaPlatform: 'Darussalam SPPG',
    npwp: '05.678.901.2-345.000',
    alamat: 'Jl. Merdeka No. 22',
    kota: 'Medan',
    provinsi: 'Sumatera Utara',
    picNama: 'H. Ridwan Nasution',
    picEmail: 'ridwan@darussalam.org',
    picTelp: '085678901234',
    plan: 'Starter',
    status: 'Aktif',
    jumlahDapur: 2,
    jumlahDapurAktif: 2,
    jumlahUser: 8,
    maksDapur: 3,
    maksUser: 10,
    tanggalDaftar: '2025-08-05',
    fiturAktif: PLAN_CONFIG.Starter.fitur,
    totalPorsiHariIni: 230,
    totalPorsiSebulan: 5300,
    logoUrl: undefined,
  },
  {
    id: 'TEN-006',
    namaYayasan: 'Yayasan Al-Ikhlas',
    namaPlatform: 'Al-Ikhlas MBG',
    npwp: '06.789.012.3-456.000',
    alamat: 'Jl. Ahmad Yani No. 5',
    kota: 'Makassar',
    provinsi: 'Sulawesi Selatan',
    picNama: 'Dr. Baharuddin Said',
    picEmail: 'baharuddin@alikhlas.org',
    picTelp: '086789012345',
    plan: 'Pro',
    status: 'Suspended',
    jumlahDapur: 3,
    jumlahDapurAktif: 0,
    jumlahUser: 14,
    maksDapur: 10,
    maksUser: 50,
    tanggalDaftar: '2025-04-15',
    fiturAktif: [],
    totalPorsiHariIni: 0,
    totalPorsiSebulan: 0,
    logoUrl: undefined,
  },
]

// ─── Mock Users per Tenant ─────────────────────────────────────────────────────

export const MOCK_TENANT_USERS: TenantUser[] = [
  // TEN-001 — Al-Falah
  { id: 'USR-001', tenantId: 'TEN-001', nama: 'Ahmad Fauzi', email: 'ahmad.fauzi@alfalah.org', role: 'Super Administrator', status: 'Aktif', lastActive: '2 menit lalu', joinedAt: '2025-01-15', avatar: 1 },
  { id: 'USR-002', tenantId: 'TEN-001', nama: 'Sari Dewi', email: 'sari.dewi@alfalah.org', role: 'PIC Dapur (Admin Yayasan)', status: 'Aktif', dapurNama: 'Dapur Al-Falah 1', lastActive: '1 jam lalu', joinedAt: '2025-01-20', avatar: 2 },
  { id: 'USR-003', tenantId: 'TEN-001', nama: 'Budi Santoso', email: 'budi@alfalah.org', role: 'Kepala SPPG (Lvl 1)', status: 'Aktif', dapurNama: 'Dapur Al-Falah 2', lastActive: '3 jam lalu', joinedAt: '2025-02-01', avatar: 3 },
  { id: 'USR-004', tenantId: 'TEN-001', nama: 'Rina Kusuma', email: 'rina@alfalah.org', role: 'Full Authorize (Lvl 3)', status: 'Aktif', lastActive: 'Kemarin', joinedAt: '2025-01-18', avatar: 4 },
  { id: 'USR-005', tenantId: 'TEN-001', nama: 'Doni Prasetyo', email: 'doni@alfalah.org', role: 'PIC Dapur (Admin Yayasan)', status: 'Pending Invite', dapurNama: 'Dapur Al-Falah 5', lastActive: undefined, joinedAt: '2026-05-30', avatar: 5 },
  // TEN-002 — Nurul Iman
  { id: 'USR-006', tenantId: 'TEN-002', nama: 'Hendra Kusuma', email: 'hendra@nuruliman.org', role: 'Super Administrator', status: 'Aktif', lastActive: '30 menit lalu', joinedAt: '2025-03-20', avatar: 6 },
  { id: 'USR-007', tenantId: 'TEN-002', nama: 'Yuni Astuti', email: 'yuni@nuruliman.org', role: 'PIC Dapur (Admin Yayasan)', status: 'Aktif', dapurNama: 'Dapur Nurul Iman 1', lastActive: '2 jam lalu', joinedAt: '2025-03-25', avatar: 7 },
  { id: 'USR-008', tenantId: 'TEN-002', nama: 'Agus Setiawan', email: 'agus@nuruliman.org', role: 'Kepala SPPI (Lvl 2)', status: 'Nonaktif', lastActive: '5 hari lalu', joinedAt: '2025-04-10', avatar: 8 },
  // TEN-003 — Baiturrahman
  { id: 'USR-009', tenantId: 'TEN-003', nama: 'Suharto Wibowo', email: 'suharto@baiturrahman.org', role: 'Super Administrator', status: 'Aktif', lastActive: '1 jam lalu', joinedAt: '2025-02-10', avatar: 9 },
  { id: 'USR-010', tenantId: 'TEN-003', nama: 'Maya Indah', email: 'maya@baiturrahman.org', role: 'PIC Dapur (Admin Yayasan)', status: 'Aktif', dapurNama: 'Dapur Baiturrahman 1', lastActive: '4 jam lalu', joinedAt: '2025-02-15', avatar: 10 },
]

// ─── Mock Dapur per Tenant ────────────────────────────────────────────────────

export const MOCK_TENANT_DAPUR: TenantDapur[] = [
  { id: 'DAP-001', tenantId: 'TEN-001', nama: 'Dapur Al-Falah 1', lokasi: 'Jl. Fatmawati No. 10', kota: 'Jakarta Selatan', kapasitas: 300, porsiHariIni: 234, status: 'Aktif', picNama: 'Sari Dewi', picTelp: '081111111111', tanggalBerdiri: '2025-01-20' },
  { id: 'DAP-002', tenantId: 'TEN-001', nama: 'Dapur Al-Falah 2', lokasi: 'Jl. MT Haryono No. 5', kota: 'Jakarta Timur', kapasitas: 250, porsiHariIni: 180, status: 'Aktif', picNama: 'Budi Santoso', picTelp: '082222222222', tanggalBerdiri: '2025-02-01' },
  { id: 'DAP-003', tenantId: 'TEN-001', nama: 'Dapur Al-Falah 3', lokasi: 'Jl. Margonda No. 30', kota: 'Depok', kapasitas: 200, porsiHariIni: 0, status: 'Nonaktif', picNama: '-', picTelp: '-', tanggalBerdiri: '2025-03-01' },
  { id: 'DAP-004', tenantId: 'TEN-001', nama: 'Dapur Al-Falah 4', lokasi: 'Jl. Sudirman No. 88', kota: 'Bekasi', kapasitas: 250, porsiHariIni: 195, status: 'Aktif', picNama: 'Doni Prasetyo', picTelp: '083333333333', tanggalBerdiri: '2025-04-01' },
  { id: 'DAP-005', tenantId: 'TEN-001', nama: 'Dapur Al-Falah 5', lokasi: 'Jl. Daan Mogot No. 12', kota: 'Tangerang', kapasitas: 220, porsiHariIni: 175, status: 'Setup', picNama: '-', picTelp: '-', tanggalBerdiri: '2026-05-01' },
  { id: 'DAP-006', tenantId: 'TEN-002', nama: 'Dapur Nurul Iman 1', lokasi: 'Jl. Soekarno Hatta No. 45', kota: 'Bandung', kapasitas: 400, porsiHariIni: 310, status: 'Aktif', picNama: 'Yuni Astuti', picTelp: '084444444444', tanggalBerdiri: '2025-03-25' },
  { id: 'DAP-007', tenantId: 'TEN-002', nama: 'Dapur Nurul Iman 2', lokasi: 'Jl. Moh. Toha No. 8', kota: 'Cimahi', kapasitas: 200, porsiHariIni: 145, status: 'Aktif', picNama: 'Rudi Hartono', picTelp: '085555555555', tanggalBerdiri: '2025-04-15' },
  { id: 'DAP-008', tenantId: 'TEN-002', nama: 'Dapur Nurul Iman 3', lokasi: 'Jl. Raya Cianjur No. 20', kota: 'Cianjur', kapasitas: 200, porsiHariIni: 160, status: 'Aktif', picNama: 'Erna Wahyuni', picTelp: '086666666666', tanggalBerdiri: '2025-06-01' },
  { id: 'DAP-009', tenantId: 'TEN-003', nama: 'Dapur Baiturrahman 1', lokasi: 'Jl. Pemuda No. 12', kota: 'Surabaya', kapasitas: 350, porsiHariIni: 280, status: 'Aktif', picNama: 'Maya Indah', picTelp: '087777777777', tanggalBerdiri: '2025-02-15' },
  { id: 'DAP-010', tenantId: 'TEN-003', nama: 'Dapur Baiturrahman 2', lokasi: 'Jl. Pahlawan No. 5', kota: 'Sidoarjo', kapasitas: 250, porsiHariIni: 0, status: 'Nonaktif', picNama: '-', picTelp: '-', tanggalBerdiri: '2025-03-01' },
  { id: 'DAP-011', tenantId: 'TEN-003', nama: 'Dapur Baiturrahman 3', lokasi: 'Jl. Kawi No. 8', kota: 'Malang', kapasitas: 300, porsiHariIni: 220, status: 'Aktif', picNama: 'Didi Susanto', picTelp: '088888888888', tanggalBerdiri: '2025-04-10' },
  { id: 'DAP-012', tenantId: 'TEN-003', nama: 'Dapur Baiturrahman 4', lokasi: 'Jl. Gubernur Suryo No. 3', kota: 'Gresik', kapasitas: 150, porsiHariIni: 90, status: 'Aktif', picNama: 'Fitri Lestari', picTelp: '089999999999', tanggalBerdiri: '2025-05-20' },
]

// ─── Helper functions ──────────────────────────────────────────────────────────

export function getTenantById(id: string): Tenant | undefined {
  return MOCK_TENANTS.find(t => t.id === id)
}

export function getUsersByTenant(tenantId: string): TenantUser[] {
  return MOCK_TENANT_USERS.filter(u => u.tenantId === tenantId)
}

export function getDapurByTenant(tenantId: string): TenantDapur[] {
  return MOCK_TENANT_DAPUR.filter(d => d.tenantId === tenantId)
}

export function getHealthScore(tenant: Tenant): number {
  const utilisasi = tenant.jumlahDapurAktif / Math.max(tenant.jumlahDapur, 1)
  const statusBonus = tenant.status === 'Aktif' ? 1 : tenant.status === 'Trial' ? 0.7 : 0
  return Math.round(utilisasi * statusBonus * 100)
}
