'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth'
import { formatRupiah } from '@/lib/utils'
import Link from 'next/link'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Skeleton } from '@/components/ui/skeleton'
import {
  UtensilsCrossedIcon,
  AlertTriangleIcon,
  FileTextIcon,
  WalletIcon,
  ClipboardListIcon,
  FilePlusIcon,
  TrendingUpIcon,
  BellIcon,
  CircleIcon,
} from 'lucide-react'

// ─── Mock Data ────────────────────────────────────────────────────────────────

const MOCK_STATS = {
  porsiHariIni: { current: 234, target: 300 },
  stokKritis: 3,
  doPending: 5,
  sisaKas: 12_450_000,
}

const MOCK_NOTIFIKASI = [
  { id: 1, message: 'DO #042 disetujui oleh SPPG', timeAgo: '2 jam lalu', color: 'bg-emerald-500' },
  { id: 2, message: "DO #041 direvisi — catatan: 'Harga ayam terlalu tinggi'", timeAgo: '5 jam lalu', color: 'bg-amber-500' },
  { id: 3, message: 'Laporan Shift Pagi menunggu approval', timeAgo: '1 hari lalu', color: 'bg-blue-500' },
  { id: 4, message: 'Stok beras di bawah threshold', timeAgo: '1 hari lalu', color: 'bg-red-500' },
  { id: 5, message: 'Harga acuan minggu ini sudah tersedia', timeAgo: '2 hari lalu', color: 'bg-emerald-500' },
]

// ─── Loading Skeleton ─────────────────────────────────────────────────────────

function PICDashboardSkeleton() {
  return (
    <div className="space-y-6 p-6">
      {/* Stat card skeletons */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i}>
            <CardHeader className="pb-2">
              <Skeleton className="h-4 w-24" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-20 mb-2" />
              <Skeleton className="h-2 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
      {/* Quick action skeletons */}
      <div className="flex flex-wrap gap-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-10 w-44" />
        ))}
      </div>
      {/* Notifikasi skeleton */}
      <Card>
        <CardHeader>
          <Skeleton className="h-5 w-28" />
        </CardHeader>
        <CardContent>
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-6 w-full mb-3" />
          ))}
        </CardContent>
      </Card>
    </div>
  )
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function PICDashboard() {
  const { currentUser } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (currentUser) {
      const r = currentUser.role
      if (r === 'Super Administrator') {
        router.replace('/admin/dashboard')
      } else if (r === 'BGN (Badan Gizi Nasional)') {
        router.replace('/compliance-dashboard')
      } else if (r === 'Investor') {
        router.replace('/investor-dashboard')
      } else if (r.startsWith('Kepala') || r.startsWith('Full')) {
        router.replace('/approval-queue')
      }
    }
  }, [currentUser, router])

  // ═══ Loading State ═══
  if (!currentUser) {
    return <PICDashboardSkeleton />
  }

  // If the user's role is not PIC, we don't render the dashboard page since they will be redirected.
  if (currentUser.role !== 'PIC Dapur (Admin Yayasan)') {
    return <PICDashboardSkeleton />
  }

  const porsiPercent = Math.round((MOCK_STATS.porsiHariIni.current / MOCK_STATS.porsiHariIni.target) * 100)

  return (
    <div className="space-y-6 p-6">
      {/* Greeting */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          Selamat datang, {currentUser.firstName}!
        </h1>
        <p className="text-muted-foreground">
          {currentUser.dapur ?? currentUser.yayasan} — Dashboard PIC Dapur
        </p>
      </div>

      {/* ─── Stat Cards ─── */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Porsi Hari Ini */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Porsi Hari Ini
            </CardTitle>
            <UtensilsCrossedIcon className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {MOCK_STATS.porsiHariIni.current}
              <span className="text-base font-normal text-muted-foreground">
                {' '}/ {MOCK_STATS.porsiHariIni.target}
              </span>
            </div>
            <Progress value={porsiPercent} className="mt-2 h-2 [&>div]:bg-emerald-500" />
            <p className="mt-1 text-xs text-muted-foreground">
              {porsiPercent}% tercapai
            </p>
          </CardContent>
        </Card>

        {/* Stok Kritis */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Stok Kritis
            </CardTitle>
            <AlertTriangleIcon
              className={`size-4 ${MOCK_STATS.stokKritis > 0 ? 'text-amber-500' : 'text-muted-foreground'}`}
            />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {MOCK_STATS.stokKritis} <span className="text-base font-normal text-muted-foreground">item</span>
            </div>
            {MOCK_STATS.stokKritis > 0 && (
              <Badge variant="destructive" className="mt-2">
                Perlu perhatian
              </Badge>
            )}
          </CardContent>
        </Card>

        {/* DO Pending */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              DO Pending
            </CardTitle>
            <FileTextIcon className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {MOCK_STATS.doPending} <span className="text-base font-normal text-muted-foreground">DO</span>
            </div>
          </CardContent>
        </Card>

        {/* Sisa Kas */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Sisa Kas
            </CardTitle>
            <WalletIcon className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatRupiah(MOCK_STATS.sisaKas)}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ─── Quick Actions ─── */}
      <div className="flex flex-wrap gap-3">
        <Button asChild>
          <Link href="/laporan-harian">
            <ClipboardListIcon className="size-4" />
            Input Laporan Shift
          </Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href="/procurement/draft">
            <FilePlusIcon className="size-4" />
            Buat Surat Pesanan
          </Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href="/admin/master-data?tab=harga">
            <TrendingUpIcon className="size-4" />
            Quick Price Update
          </Link>
        </Button>
      </div>

      {/* ─── Notifikasi Section ─── */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-base">
            <BellIcon className="size-4" />
            Notifikasi
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-0">
            {MOCK_NOTIFIKASI.map((item) => (
              <div
                key={item.id}
                className="flex items-start gap-3 border-b py-3 last:border-b-0"
              >
                <CircleIcon
                  className={`mt-1.5 size-2.5 shrink-0 ${item.color} rounded-full fill-current text-transparent`}
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm">{item.message}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{item.timeAgo}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
        <div className="px-6 pb-6">
          <Button variant="link" className="h-auto p-0 text-sm" asChild>
            <Link href="/notifikasi">Lihat semua</Link>
          </Button>
        </div>
      </Card>
    </div>
  )
}
