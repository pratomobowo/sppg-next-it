'use client'

import { useState, useMemo, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth'
import { formatRupiah } from '@/lib/utils'
import Link from 'next/link'

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
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
  ActivityIcon,
  ShieldAlertIcon,
  ClockIcon,
  TrendingUpIcon,
  BarChart3Icon,
  InfoIcon
} from 'lucide-react'
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts'

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

const MOCK_TREND_DATA: Record<string, { name: string; porsi: number; target: number }[]> = {
  all: [
    { name: 'Senin', porsi: 1200, target: 1500 },
    { name: 'Selasa', porsi: 1350, target: 1500 },
    { name: 'Rabu', porsi: 1480, target: 1500 },
    { name: 'Kamis', porsi: 1400, target: 1500 },
    { name: 'Jumat', porsi: 1550, target: 1500 },
    { name: 'Sabtu', porsi: 1250, target: 1500 },
    { name: 'Minggu', porsi: 1100, target: 1500 },
  ],
  'Yayasan Al-Falah': [
    { name: 'Senin', porsi: 600, target: 700 },
    { name: 'Selasa', porsi: 650, target: 700 },
    { name: 'Rabu', porsi: 680, target: 700 },
    { name: 'Kamis', porsi: 620, target: 700 },
    { name: 'Jumat', porsi: 710, target: 700 },
    { name: 'Sabtu', porsi: 580, target: 700 },
    { name: 'Minggu', porsi: 500, target: 700 },
  ],
  'Yayasan Nurul Iman': [
    { name: 'Senin', porsi: 350, target: 450 },
    { name: 'Selasa', porsi: 400, target: 450 },
    { name: 'Rabu', porsi: 420, target: 450 },
    { name: 'Kamis', porsi: 390, target: 450 },
    { name: 'Jumat', porsi: 440, target: 450 },
    { name: 'Sabtu', porsi: 370, target: 450 },
    { name: 'Minggu', porsi: 350, target: 450 },
  ],
  'Yayasan Baiturrahman': [
    { name: 'Senin', porsi: 250, target: 350 },
    { name: 'Selasa', porsi: 300, target: 350 },
    { name: 'Rabu', porsi: 380, target: 350 },
    { name: 'Kamis', porsi: 390, target: 350 },
    { name: 'Jumat', porsi: 400, target: 350 },
    { name: 'Sabtu', porsi: 300, target: 350 },
    { name: 'Minggu', porsi: 250, target: 350 },
  ],
}

const MOCK_BAR_DATA: Record<string, { name: string; porsi: number; kapasitas: number }[]> = {
  all: [
    { name: 'Al-Falah', porsi: 784, kapasitas: 1000 },
    { name: 'Nurul Iman', porsi: 615, kapasitas: 800 },
    { name: 'Baiturrahman', porsi: 590, kapasitas: 750 },
  ],
  'Yayasan Al-Falah': [
    { name: 'Al-Falah 1', porsi: 234, kapasitas: 300 },
    { name: 'Al-Falah 2', porsi: 180, kapasitas: 250 },
    { name: 'Al-Falah 3', porsi: 0, kapasitas: 200 },
    { name: 'Al-Falah 4', porsi: 195, kapasitas: 250 },
    { name: 'Al-Falah 5', porsi: 175, kapasitas: 200 },
  ],
  'Yayasan Nurul Iman': [
    { name: 'Nurul Iman 1', porsi: 310, kapasitas: 350 },
    { name: 'Nurul Iman 2', porsi: 145, kapasitas: 200 },
    { name: 'Nurul Iman 3', porsi: 160, kapasitas: 200 },
  ],
  'Yayasan Baiturrahman': [
    { name: 'Baiturrahman 1', porsi: 280, kapasitas: 300 },
    { name: 'Baiturrahman 2', porsi: 0, kapasitas: 150 },
    { name: 'Baiturrahman 3', porsi: 220, kapasitas: 250 },
    { name: 'Baiturrahman 4', porsi: 90, kapasitas: 150 },
  ],
}

const MOCK_RECENT_AUDITS = [
  { id: 1, timestamp: '10 Mnt lalu', user: 'Andi (PIC)', action: 'CREATE DO #45', detail: 'Total Rp 2.450.000, PT Sumber Pangan', ip: '192.168.1.100', type: 'info' },
  { id: 2, timestamp: '1 Jam lalu', user: 'Siti (Approver)', action: 'APPROVE DO #44', detail: 'Disetujui oleh Kepala SPPG', ip: '192.168.1.105', type: 'success' },
  { id: 3, timestamp: '3 Jam lalu', user: 'System Alert', action: 'LOGIN_FAILED', detail: 'Brute force warning - 5 failed attempts from same IP', ip: '185.220.101.5', type: 'danger' },
  { id: 4, timestamp: '5 Jam lalu', user: 'Rina (PIC)', action: 'UPDATE STOK', detail: 'Beras: +500kg masuk dari DO #41', ip: '192.168.1.112', type: 'warning' },
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
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader><Skeleton className="h-5 w-32" /></CardHeader>
          <CardContent><Skeleton className="h-[250px] w-full" /></CardContent>
        </Card>
        <Card>
          <CardHeader><Skeleton className="h-5 w-32" /></CardHeader>
          <CardContent><Skeleton className="h-[250px] w-full" /></CardContent>
        </Card>
      </div>
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

  const [mounted, setMounted] = useState(false)
  useEffect(() => { setMounted(true) }, [])

  // Filter dapur
  const filteredDapur = useMemo(() => {
    if (selectedYayasan === 'all') return MOCK_DAPUR
    return MOCK_DAPUR.filter((d) => d.yayasan === selectedYayasan)
  }, [selectedYayasan])

  // Agregat stats (recalculated on filter)
  const totalDapur = filteredDapur.length
  const activeDapurCount = filteredDapur.filter((d) => d.status === 'Aktif').length
  const totalPorsiBulanIni = filteredDapur.reduce((sum, d) => sum + d.porsiHariIni, 0) * 30
  const totalAnggaran = filteredDapur.reduce((sum, d) => sum + d.porsiHariIni, 0) * 15_000 * 30

  // Chart trend data based on filter
  const trendChartData = MOCK_TREND_DATA[selectedYayasan] || MOCK_TREND_DATA.all
  const barChartData = MOCK_BAR_DATA[selectedYayasan] || MOCK_BAR_DATA.all

  // Donut chart status Dapur
  const statusPieData = useMemo(() => {
    const active = filteredDapur.filter((d) => d.status === 'Aktif').length
    const inactive = filteredDapur.filter((d) => d.status === 'Nonaktif').length
    return [
      { name: 'Aktif', value: active, color: 'var(--color-sppg-success)' },
      { name: 'Nonaktif', value: inactive, color: 'var(--color-sppg-danger)' },
    ]
  }, [filteredDapur])

  // Loading state & redirection fallback (placed after hooks to follow React rules)
  if (!currentUser) {
    return <SuperAdminDashboardSkeleton />
  }

  if (currentUser.role !== 'Super Administrator') {
    return <SuperAdminDashboardSkeleton />
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Super Admin Dashboard
          </h1>
          <p className="text-muted-foreground text-sm">
            Statistik agregat, performa dapur, kepatuhan BGN, dan log audit sistem terpusat.
          </p>
        </div>

        {/* ─── Yayasan Switcher ─── */}
        <div className="w-full max-w-xs sm:w-[220px]">
          <Select value={selectedYayasan} onValueChange={setSelectedYayasan}>
            <SelectTrigger className="w-full border-primary/20 focus:ring-primary">
              <BuildingIcon className="size-4 mr-2 text-muted-foreground" />
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
      </div>

      {/* ─── Agregat Stat Cards ─── */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="relative overflow-hidden transition-all hover:shadow-md hover:border-primary/30 group">
          <div className="absolute top-0 left-0 w-1 h-full bg-blue-500" />
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total &amp; Keaktifan Dapur
            </CardTitle>
            <BuildingIcon className="size-4 text-blue-500 transition-transform group-hover:scale-110" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold tracking-tight">
              {totalDapur}
              <span className="text-sm font-normal text-muted-foreground ml-2">
                Dapur ({activeDapurCount} Aktif)
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Rata-rata {Math.round((activeDapurCount / totalDapur) * 100)}% dapur beroperasi normal hari ini
            </p>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden transition-all hover:shadow-md hover:border-primary/30 group">
          <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500" />
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Estimasi Porsi Terdistribusi / Bulan
            </CardTitle>
            <UtensilsCrossedIcon className="size-4 text-emerald-500 transition-transform group-hover:scale-110" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold tracking-tight">
              {totalPorsiBulanIni.toLocaleString('id-ID')}
              <span className="text-sm font-normal text-muted-foreground ml-1">
                porsi
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Berdasarkan jadwal menu aktif di dapur terkait
            </p>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden transition-all hover:shadow-md hover:border-primary/30 group">
          <div className="absolute top-0 left-0 w-1 h-full bg-amber-500" />
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Proyeksi Anggaran Bulanan
            </CardTitle>
            <WalletIcon className="size-4 text-amber-500 transition-transform group-hover:scale-110" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold tracking-tight text-primary">
              {formatRupiah(totalAnggaran)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Estimasi Rp 15.000 / porsi standar BGN
            </p>
          </CardContent>
        </Card>
      </div>

      {/* ─── Interactive Charts Block ─── */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Trend Line Chart */}
        <Card className="border border-muted-foreground/10 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <TrendingUpIcon className="size-4 text-primary" />
              Tren Distribusi Porsi (7 Hari Terakhir)
            </CardTitle>
            <CardDescription>
              Realisasi porsi makanan harian dibanding target gizi yayasan
            </CardDescription>
          </CardHeader>
          <CardContent className="h-[280px] pt-4">
            {mounted ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={trendChartData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                  <XAxis dataKey="name" stroke="var(--muted-foreground)" fontSize={11} tickLine={false} axisLine={false} tick={{ fill: 'var(--muted-foreground)' }} />
                  <YAxis stroke="var(--muted-foreground)" fontSize={11} tickLine={false} axisLine={false} tick={{ fill: 'var(--muted-foreground)' }} />
                  <Tooltip
                    contentStyle={{ backgroundColor: 'var(--popover)', borderRadius: 'var(--radius)', border: '1px solid var(--border)', color: 'var(--popover-foreground)' }}
                    labelStyle={{ fontWeight: 'bold' }}
                  />
                  <Legend iconType="circle" wrapperStyle={{ fontSize: '11px', paddingTop: '10px', color: 'var(--foreground)' }} />
                  <Line type="monotone" dataKey="porsi" name="Realisasi Porsi" stroke="var(--primary)" strokeWidth={2.5} activeDot={{ r: 6 }} />
                  <Line type="monotone" dataKey="target" name="Target BGN" stroke="var(--muted-foreground)" strokeDasharray="5 5" strokeWidth={1.5} />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <Skeleton className="h-full w-full" />
            )}
          </CardContent>
        </Card>

        {/* Bar Chart: Portions per Dapur/Yayasan */}
        <Card className="border border-muted-foreground/10 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <BarChart3Icon className="size-4 text-emerald-500" />
              Kapasitas vs Realisasi Porsi Aktif
            </CardTitle>
            <CardDescription>
              Portian hari ini dibanding kapasitas terdaftar dapur
            </CardDescription>
          </CardHeader>
          <CardContent className="h-[280px] pt-4">
            {mounted ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barChartData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                  <XAxis dataKey="name" stroke="var(--muted-foreground)" fontSize={11} tickLine={false} axisLine={false} tick={{ fill: 'var(--muted-foreground)' }} />
                  <YAxis stroke="var(--muted-foreground)" fontSize={11} tickLine={false} axisLine={false} tick={{ fill: 'var(--muted-foreground)' }} />
                  <Tooltip
                    cursor={{ fill: 'var(--muted)', opacity: 0.15 }}
                    contentStyle={{ backgroundColor: 'var(--popover)', borderRadius: 'var(--radius)', border: '1px solid var(--border)', color: 'var(--popover-foreground)' }}
                  />
                  <Legend iconType="circle" wrapperStyle={{ fontSize: '11px', paddingTop: '10px', color: 'var(--foreground)' }} />
                  <Bar dataKey="porsi" name="Realisasi Hari Ini" fill="var(--primary)" radius={[4, 4, 0, 0]} maxBarSize={45} />
                  <Bar dataKey="kapasitas" name="Kapasitas Maks" fill="var(--muted-foreground)" opacity={0.3} radius={[4, 4, 0, 0]} maxBarSize={45} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <Skeleton className="h-full w-full" />
            )}
          </CardContent>
        </Card>
      </div>

      {/* ─── Bottom Layout: Split View ─── */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left: Dapur Status Table (2 Columns Span) */}
        <Card className="lg:col-span-2 border border-muted-foreground/10 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <div>
              <CardTitle className="text-base font-semibold">Daftar Status Dapur</CardTitle>
              <CardDescription>Operasional dapur terikat yayasan saat ini</CardDescription>
            </div>
            <Badge variant="outline" className="text-xs">
              {filteredDapur.length} Dapur Terdaftar
            </Badge>
          </CardHeader>
          <CardContent className="px-0 pb-0">
            <div className="overflow-x-auto max-h-[350px] overflow-y-auto">
              <Table>
                <TableHeader className="bg-muted/50 sticky top-0 z-10">
                  <TableRow>
                    <TableHead className="font-semibold text-xs py-2">Nama Dapur</TableHead>
                    <TableHead className="font-semibold text-xs py-2">Yayasan</TableHead>
                    <TableHead className="font-semibold text-xs py-2 text-right">Porsi Harian</TableHead>
                    <TableHead className="font-semibold text-xs py-2">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredDapur.map((dapur) => (
                    <TableRow key={dapur.id} className="hover:bg-muted/40 transition">
                      <TableCell className="font-medium text-sm py-2.5">{dapur.nama}</TableCell>
                      <TableCell className="text-muted-foreground text-xs py-2.5">{dapur.yayasan}</TableCell>
                      <TableCell className="text-right text-sm font-semibold py-2.5">
                        {dapur.porsiHariIni > 0 ? dapur.porsiHariIni.toLocaleString('id-ID') : '-'}
                      </TableCell>
                      <TableCell className="py-2.5">
                        <Badge
                          variant="secondary"
                          className={`text-[10px] font-medium leading-none px-2 py-0.5 rounded-full ${
                            dapur.status === 'Aktif'
                              ? 'bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20'
                              : 'bg-red-500/10 text-red-600 dark:bg-red-500/20'
                          }`}
                        >
                          {dapur.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                  {filteredDapur.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-8 text-muted-foreground text-sm">
                        Tidak ada dapur untuk yayasan ini.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Right: Pie Chart and Audit logs timeline */}
        <div className="flex flex-col gap-6 lg:col-span-1">
          {/* Status Donut Chart */}
          <Card className="border border-muted-foreground/10 shadow-sm flex flex-col justify-between">
            <CardHeader className="pb-1">
              <CardTitle className="text-base font-semibold">Rasio Keaktifan Dapur</CardTitle>
            </CardHeader>
            <CardContent className="flex items-center justify-between py-2">
              <div className="size-[120px] shrink-0">
                {mounted ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={statusPieData}
                        innerRadius={40}
                        outerRadius={55}
                        paddingAngle={4}
                        dataKey="value"
                      >
                        {statusPieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <Skeleton className="size-full rounded-full" />
                )}
              </div>

              {/* Legend details */}
              <div className="flex flex-col gap-2 flex-1 pl-4">
                {statusPieData.map((item) => (
                  <div key={item.name} className="flex items-center justify-between text-xs">
                    <span className="flex items-center gap-1.5 text-muted-foreground">
                      <span className="size-2 rounded-full" style={{ backgroundColor: item.color }} />
                      {item.name}
                    </span>
                    <span className="font-semibold">{item.value} Dapur</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Audit Timeline Peek */}
          <Card className="border border-muted-foreground/10 shadow-sm flex-1">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base font-semibold flex items-center gap-2">
                  <ActivityIcon className="size-4 text-indigo-500" />
                  Log Aktivitas Terbaru
                </CardTitle>
                <Button variant="link" size="sm" className="h-auto p-0" asChild>
                  <Link href="/admin/audit-trail">Lihat Semua</Link>
                </Button>
              </div>
              <CardDescription>Log audit keamanan &amp; operasional sistem</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="relative border-l border-muted pl-4 ml-2 space-y-4">
                {MOCK_RECENT_AUDITS.map((log) => {
                  let badgeClass = 'bg-blue-500'
                  if (log.type === 'success') badgeClass = 'bg-emerald-500'
                  if (log.type === 'danger') badgeClass = 'bg-red-500'
                  if (log.type === 'warning') badgeClass = 'bg-amber-500'

                  return (
                    <div key={log.id} className="relative">
                      {/* Left Dot */}
                      <span className={`absolute -left-[21px] top-1.5 size-2.5 rounded-full ${badgeClass}`} />
                      
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-foreground">{log.user}</span>
                        <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                          <ClockIcon className="size-2.5" />
                          {log.timestamp}
                        </span>
                      </div>
                      <p className="text-xs font-semibold text-primary mt-0.5">{log.action}</p>
                      <p className="text-[11px] text-muted-foreground leading-tight mt-0.5">{log.detail}</p>
                      <p className="text-[9px] text-muted-foreground mt-1">IP: {log.ip}</p>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* ─── Quick Actions ─── */}
      <div className="flex flex-wrap gap-3">
        <Button variant="outline" asChild>
          <Link href="/admin/master-data">
            <BuildingIcon className="size-4" />
            Master Data Dapur &amp; Menu
          </Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href="/admin/users">
            <UsersIcon className="size-4" />
            User Management (RBAC)
          </Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href="/admin/wa-gateway">
            <InfoIcon className="size-4" />
            WhatsApp Notification Gateway
          </Link>
        </Button>
      </div>
    </div>
  )
}
