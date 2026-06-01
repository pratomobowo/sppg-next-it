'use client'

import { useState, useMemo, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth'
import { formatRupiah } from '@/lib/utils'
import Link from 'next/link'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  BuildingIcon,
  UtensilsCrossedIcon,
  WalletIcon,
  UsersIcon,
} from 'lucide-react'

// ─── Mock Data ────────────────────────────────────────────────────────────────

const MOCK_DAPUR = [
  { id: 1, nama: 'Dapur Al-Falah 1', yayasan: 'Yayasan Al-Falah', lokasi: 'Jakarta Selatan', porsiHariIni: 234, status: 'Aktif' as const },
  { id: 2, nama: 'Dapur Al-Falah 2', yayasan: 'Yayasan Al-Falah', lokasi: 'Jakarta Timur', porsiHariIni: 180, status: 'Aktif' as const },
  { id: 3, nama: 'Dapur Al-Falah 3', yayasan: 'Yayasan Al-Falah', lokasi: 'Depok', porsiHariIni: 0, status: 'Nonaktif' as const },
  { id: 4, nama: 'Dapur Nurul Iman 1', yayasan: 'Yayasan Nurul Iman', lokasi: 'Bandung', porsiHariIni: 310, status: 'Aktif' as const },
  { id: 5, nama: 'Dapur Nurul Iman 2', yayasan: 'Yayasan Nurul Iman', lokasi: 'Cimahi', porsiHariIni: 145, status: 'Aktif' as const },
  { id: 6, nama: 'Dapur Baiturrahman 1', yayasan: 'Yayasan Baiturrahman', lokasi: 'Surabaya', porsiHariIni: 280, status: 'Aktif' as const },
  { id: 7, nama: 'Dapur Baiturrahman 2', yayasan: 'Yayasan Baiturrahman', lokasi: 'Sidoarjo', porsiHariIni: 0, status: 'Nonaktif' as const },
  { id: 8, nama: 'Dapur Al-Falah 4', yayasan: 'Yayasan Al-Falah', lokasi: 'Bekasi', porsiHariIni: 195, status: 'Aktif' as const },
  { id: 9, nama: 'Dapur Nurul Iman 3', yayasan: 'Yayasan Nurul Iman', lokasi: 'Cianjur', porsiHariIni: 160, status: 'Aktif' as const },
  { id: 10, nama: 'Dapur Baiturrahman 3', yayasan: 'Yayasan Baiturrahman', lokasi: 'Malang', porsiHariIni: 220, status: 'Aktif' as const },
  { id: 11, nama: 'Dapur Al-Falah 5', yayasan: 'Yayasan Al-Falah', lokasi: 'Tangerang', porsiHariIni: 175, status: 'Aktif' as const },
  { id: 12, nama: 'Dapur Baiturrahman 4', yayasan: 'Yayasan Baiturrahman', lokasi: 'Gresik', porsiHariIni: 90, status: 'Aktif' as const },
]

const YAYASAN_OPTIONS = [
  { value: 'all', label: 'Semua Yayasan' },
  { value: 'Yayasan Al-Falah', label: 'Yayasan Al-Falah' },
  { value: 'Yayasan Nurul Iman', label: 'Yayasan Nurul Iman' },
  { value: 'Yayasan Baiturrahman', label: 'Yayasan Baiturrahman' },
]

// ─── Loading Skeleton ─────────────────────────────────────────────────────────

function SuperAdminDashboardSkeleton() {
  return (
    <div className="space-y-6 p-6">
      <Skeleton className="h-8 w-48" />
      <Skeleton className="h-10 w-56" />
      <div className="grid gap-4 sm:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <Card key={i}>
            <CardHeader><Skeleton className="h-4 w-20" /></CardHeader>
            <CardContent><Skeleton className="h-8 w-16" /></CardContent>
          </Card>
        ))}
      </div>
      <Card>
        <CardHeader><Skeleton className="h-5 w-32" /></CardHeader>
        <CardContent>
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-8 w-full mb-2" />
          ))}
        </CardContent>
      </Card>
    </div>
  )
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function SuperAdminDashboardPage() {
  const { currentUser } = useAuth()
  const router = useRouter()
  const [selectedYayasan, setSelectedYayasan] = useState('all')

  useEffect(() => {
    if (currentUser && currentUser.role !== 'Super Administrator') {
      const r = currentUser.role
      const dest =
        r === 'BGN (Badan Gizi Nasional)'
          ? '/compliance-dashboard'
          : r === 'Investor'
          ? '/investor-dashboard'
          : r.startsWith('Kepala') || r.startsWith('Full')
          ? '/approval-queue'
          : '/dashboard'
      router.replace(dest)
    }
  }, [currentUser, router])

  // Loading state
  if (!currentUser) {
    return <SuperAdminDashboardSkeleton />
  }

  // Prevent flash of admin layout content before redirect triggers
  if (currentUser.role !== 'Super Administrator') {
    return <SuperAdminDashboardSkeleton />
  }

  // Filter dapur
  const filteredDapur = useMemo(() => {
    if (selectedYayasan === 'all') return MOCK_DAPUR
    return MOCK_DAPUR.filter((d) => d.yayasan === selectedYayasan)
  }, [selectedYayasan])

  // Agregat stats (recalculated on filter)
  const totalDapur = filteredDapur.length
  const totalPorsiBulanIni = filteredDapur.reduce((sum, d) => sum + d.porsiHariIni, 0) * 30
  const totalAnggaran = filteredDapur.reduce((sum, d) => sum + d.porsiHariIni, 0) * 15_000 * 30

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Super Admin Dashboard</h1>
        <p className="text-muted-foreground">Overview seluruh yayasan dan dapur MBG</p>
      </div>

      {/* ─── Yayasan Switcher ─── */}
      <div className="w-full max-w-xs">
        <Select value={selectedYayasan} onValueChange={setSelectedYayasan}>
          <SelectTrigger>
            <SelectValue placeholder="Pilih Yayasan" />
          </SelectTrigger>
          <SelectContent>
            {YAYASAN_OPTIONS.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* ─── Agregat Stat Cards ─── */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Dapur
            </CardTitle>
            <BuildingIcon className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalDapur}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Porsi/Bulan
            </CardTitle>
            <UtensilsCrossedIcon className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {totalPorsiBulanIni.toLocaleString('id-ID')}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Anggaran
            </CardTitle>
            <WalletIcon className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatRupiah(totalAnggaran)}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ─── Table: Status Dapur ─── */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Status Dapur</CardTitle>
        </CardHeader>
        <CardContent className="px-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nama Dapur</TableHead>
                <TableHead>Yayasan</TableHead>
                <TableHead className="hidden md:table-cell">Lokasi</TableHead>
                <TableHead className="text-right">Porsi Hari Ini</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredDapur.map((dapur) => (
                <TableRow key={dapur.id}>
                  <TableCell className="font-medium">{dapur.nama}</TableCell>
                  <TableCell className="text-muted-foreground">{dapur.yayasan}</TableCell>
                  <TableCell className="hidden md:table-cell text-muted-foreground">{dapur.lokasi}</TableCell>
                  <TableCell className="text-right">{dapur.porsiHariIni.toLocaleString('id-ID')}</TableCell>
                  <TableCell>
                    <Badge variant={dapur.status === 'Aktif' ? 'default' : 'destructive'}>
                      {dapur.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
              {filteredDapur.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                    Tidak ada dapur untuk yayasan ini.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* ─── Quick Links ─── */}
      <div className="flex flex-wrap gap-3">
        <Button variant="outline" asChild>
          <Link href="/admin/master-data">
            <BuildingIcon className="size-4" />
            Master Data
          </Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href="/admin/users">
            <UsersIcon className="size-4" />
            User Management
          </Link>
        </Button>
      </div>
    </div>
  )
}
