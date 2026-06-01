import {
  LayoutDashboardIcon,
  DatabaseIcon,
  ClipboardListIcon,
  ShoppingCartIcon,
  PackageIcon,
  DollarSignIcon,
  MapPinIcon,
  ScrollTextIcon,
  UsersIcon,
  MessageCircleIcon,
  CheckSquareIcon,
  FileTextIcon,
  LandmarkIcon,
  FileCheckIcon,
  TruckIcon,
  ActivityIcon,
  MapIcon,
  VideoIcon,
  TrendingUpIcon,
  BarChart3Icon,
  SparklesIcon
} from 'lucide-react'

import type { NavConfig } from '@/components/app-shell'

/** ─── Super Administrator ─── */
const superAdminNav: NavConfig = {
  groups: [
    {
      label: 'Utama',
      items: [
        { title: 'Dashboard', url: '/dashboard', icon: LayoutDashboardIcon },
        {
          title: 'Master Data',
          url: '/admin/master-data',
          icon: DatabaseIcon,
          items: [
            { title: 'Data Dapur', url: '/admin/master-data?tab=data-dapur' },
            { title: 'Penjadwalan Menu', url: '/admin/master-data?tab=penjadwalan-menu' },
            { title: 'Katalog Supplier', url: '/admin/master-data?tab=katalog-supplier' },
            { title: 'Katalog Item & Gizi', url: '/admin/master-data?tab=katalog-item' },
            { title: 'Harga Acuan', url: '/admin/master-data?tab=harga-acuan' }
          ]
        },
        { title: 'Procurement', url: '/procurement/draft', icon: ShoppingCartIcon },
        { title: 'Accounting', url: '/accounting', icon: DollarSignIcon },
        { title: 'Inventory', url: '/inventory', icon: PackageIcon },
        { title: 'Maps/CCTV', url: '/maps', icon: MapPinIcon },
        { title: 'Audit Trail', url: '/admin/audit-trail', icon: ScrollTextIcon },
        { title: 'User Management', url: '/admin/users', icon: UsersIcon },
        { title: 'WA Gateway', url: '/admin/wa-gateway', icon: MessageCircleIcon },
        { title: 'AI Helper', url: '/ai-helper', icon: SparklesIcon }
      ]
    }
  ]
}

/** ─── PIC Dapur (Admin Yayasan) ─── */
const picDapurNav: NavConfig = {
  groups: [
    {
      label: 'Operasional',
      items: [
        { title: 'Dashboard', url: '/dashboard', icon: LayoutDashboardIcon },
        { title: 'Laporan Harian', url: '/laporan-harian', icon: ClipboardListIcon },
        {
          title: 'Procurement',
          url: '/procurement',
          icon: ShoppingCartIcon,
          items: [
            { title: 'Draft DO', url: '/procurement/draft' },
            { title: 'History DO', url: '/procurement/history' }
          ]
        },
        { title: 'Inventory', url: '/inventory', icon: PackageIcon },
        { title: 'Accounting', url: '/accounting', icon: DollarSignIcon },
        { title: 'Pengiriman', url: '/pengiriman', icon: TruckIcon },
        { title: 'AI Helper', url: '/ai-helper', icon: SparklesIcon }
      ]
    }
  ]
}

/** ─── Kepala SPPG (Lvl 1) ─── */
const kepalaSppgNav: NavConfig = {
  groups: [
    {
      label: 'Persetujuan',
      items: [
        { title: 'Dashboard', url: '/dashboard', icon: LayoutDashboardIcon },
        { title: 'Approval Queue', url: '/approval-queue', icon: CheckSquareIcon },
        { title: 'DO History', url: '/procurement/history', icon: FileTextIcon }
      ]
    }
  ]
}

/** ─── Kepala SPPI (Lvl 2) ─── */
const kepalaSppiNav: NavConfig = {
  groups: [
    {
      label: 'Persetujuan',
      items: [
        { title: 'Dashboard', url: '/dashboard', icon: LayoutDashboardIcon },
        { title: 'Approval Queue', url: '/approval-queue', icon: CheckSquareIcon },
        { title: 'DO History', url: '/procurement/history', icon: FileTextIcon }
      ]
    }
  ]
}

/** ─── Full Authorize (Lvl 3) ─── */
const fullAuthorizeNav: NavConfig = {
  groups: [
    {
      label: 'Otorisasi',
      items: [
        { title: 'Dashboard', url: '/dashboard', icon: LayoutDashboardIcon },
        { title: 'Approval Queue', url: '/approval-queue', icon: CheckSquareIcon },
        { title: 'DO History', url: '/procurement/history', icon: FileTextIcon },
        { title: 'Dana 12 Hari', url: '/accounting?tab=dana-12', icon: LandmarkIcon },
        { title: 'Approval Laporan', url: '/approval-laporan', icon: FileCheckIcon }
      ]
    }
  ]
}

/** ─── BGN (Badan Gizi Nasional) ─── */
const bgnNav: NavConfig = {
  groups: [
    {
      label: 'Monitoring',
      items: [
        { title: 'Dashboard Kepatuhan Gizi', url: '/compliance-dashboard', icon: ActivityIcon },
        { title: 'Peta Lokasi', url: '/maps', icon: MapIcon },
        { title: 'CCTV Viewer', url: '/maps', icon: VideoIcon }
      ]
    }
  ]
}

/** ─── Investor ─── */
const investorNav: NavConfig = {
  groups: [
    {
      label: 'Keuangan',
      items: [
        { title: 'Dashboard Keuangan', url: '/investor-dashboard', icon: TrendingUpIcon },
        { title: 'Laporan Operasional', url: '/investor-dashboard', icon: BarChart3Icon }
      ]
    }
  ]
}

/** Role → NavConfig map */
const roleNavMap: Record<string, NavConfig> = {
  'Super Administrator': superAdminNav,
  'PIC Dapur (Admin Yayasan)': picDapurNav,
  'Kepala SPPG (Lvl 1)': kepalaSppgNav,
  'Kepala SPPI (Lvl 2)': kepalaSppiNav,
  'Full Authorize (Lvl 3)': fullAuthorizeNav,
  'BGN (Badan Gizi Nasional)': bgnNav,
  'Investor': investorNav
}

/**
 * Get the sidebar navigation config for a given user role.
 * Falls back to the Super Administrator nav if the role is unknown.
 */
export function getNavConfig(role: string): NavConfig {
  return roleNavMap[role] ?? superAdminNav
}

/** Legacy export for files that haven't been updated to role-based nav yet. */
export const dashboardNav: NavConfig = superAdminNav
