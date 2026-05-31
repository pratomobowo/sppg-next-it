import {
  Building2Icon,
  ChartNoAxesCombinedIcon,
  ClipboardListIcon,
  CookingPotIcon,
  DollarSignIcon,
  EyeIcon,
  FileTextIcon,
  LayoutDashboardIcon,
  PackageIcon,
  ShoppingCartIcon,
  TruckIcon,
  UsersIcon,
  UtensilsCrossedIcon,
} from 'lucide-react'

import type { NavConfig } from '@/components/app-shell'
import type { UserRole } from '@/lib/auth'

/**
 * Role-based SPPG MBG sidebar navigation.
 *
 * Visibility rules:
 * - Super Administrator: all sections
 * - PIC Dapur (Admin Yayasan): yayasan-level management
 * - Kepala SPPG (Lvl 1): daily operations, procurement, reporting
 * - Kepala SPPI (Lvl 2): inspection and quality
 * - Full Authorize (Lvl 3): approval workflows
 * - BGN: national monitoring
 * - Investor: investor dashboard + reports
 */

// All available nav groups
const ALL_GROUPS: NavConfig['groups'] = [
  {
    label: 'Dashboard',
    items: [
      { title: 'Overview', url: '/dashboard', icon: LayoutDashboardIcon },
      { title: 'Analytics', url: '/analytics', icon: ChartNoAxesCombinedIcon },
    ],
  },
  {
    label: 'Operasional Dapur',
    items: [
      { title: 'Dapur Saya', url: '/dapur', icon: CookingPotIcon },
      { title: 'Menu Harian', url: '/menu-harian', icon: UtensilsCrossedIcon },
      { title: 'Produksi', url: '/produksi', icon: ClipboardListIcon },
      { title: 'Distribusi', url: '/distribusi', icon: TruckIcon },
    ],
  },
  {
    label: 'Procurement',
    items: [
      { title: 'Bahan Baku', url: '/bahan-baku', icon: PackageIcon },
      { title: 'Purchase Order', url: '/purchase-order', icon: ShoppingCartIcon },
      { title: 'Supplier', url: '/supplier', icon: Building2Icon },
    ],
  },
  {
    label: 'Manajemen',
    items: [
      { title: 'Yayasan', url: '/yayasan', icon: Building2Icon },
      { title: 'Pengguna', url: '/pengguna', icon: UsersIcon },
      { title: 'SPPG / SPPI', url: '/sppg-sppi', icon: CookingPotIcon },
    ],
  },
  {
    label: 'Inspeksi & Quality',
    items: [
      { title: 'Inspeksi', url: '/inspeksi', icon: EyeIcon },
      { title: 'Laporan QC', url: '/laporan-qc', icon: FileTextIcon },
    ],
  },
  {
    label: 'Monitoring',
    items: [
      { title: 'Monitoring Nasional', url: '/monitoring', icon: EyeIcon },
      { title: 'Laporan', url: '/laporan', icon: FileTextIcon },
      { title: 'KPI', url: '/kpi', icon: ChartNoAxesCombinedIcon },
    ],
  },
  {
    label: 'Investor',
    items: [
      { title: 'Portofolio', url: '/portofolio', icon: DollarSignIcon },
      { title: 'Laporan Keuangan', url: '/laporan-keuangan', icon: FileTextIcon },
      { title: 'ROI & Impact', url: '/roi-impact', icon: ChartNoAxesCombinedIcon },
    ],
  },
]

// Map each role to the groups it can see
const ROLE_NAV: Record<UserRole, string[]> = {
  'Super Administrator': [
    'Dashboard',
    'Operasional Dapur',
    'Procurement',
    'Manajemen',
    'Inspeksi & Quality',
    'Monitoring',
    'Investor',
  ],
  'PIC Dapur (Admin Yayasan)': [
    'Dashboard',
    'Operasional Dapur',
    'Procurement',
    'Manajemen',
    'Monitoring',
  ],
  'Kepala SPPG (Lvl 1)': [
    'Dashboard',
    'Operasional Dapur',
    'Procurement',
    'Monitoring',
  ],
  'Kepala SPPI (Lvl 2)': [
    'Dashboard',
    'Inspeksi & Quality',
    'Monitoring',
  ],
  'Full Authorize (Lvl 3)': [
    'Dashboard',
    'Operasional Dapur',
    'Procurement',
    'Inspeksi & Quality',
    'Monitoring',
  ],
  'BGN (Badan Gizi Nasional)': [
    'Dashboard',
    'Monitoring',
  ],
  'Investor': [
    'Dashboard',
    'Investor',
    'Monitoring',
  ],
}

export function getNavForRole(role: UserRole | null): NavConfig {
  if (!role) return { groups: [] }

  const allowedLabels = ROLE_NAV[role] ?? []
  const groups = ALL_GROUPS.filter((g) =>
    g.label ? allowedLabels.includes(g.label) : true,
  )

  return { groups }
}
