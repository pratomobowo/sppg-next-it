'use client'

import { useState, useMemo } from 'react'
import { useAuth } from '@/lib/auth'
import { toast } from 'sonner'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
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
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Skeleton } from '@/components/ui/skeleton'
import {
  SearchIcon,
  FileDownIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  CircleIcon,
  ClockIcon,
} from 'lucide-react'

// ─── Types ────────────────────────────────────────────────────────────────────

type AksiType = 'CREATE' | 'UPDATE' | 'DELETE' | 'APPROVE' | 'REJECT' | 'LOGIN'

type AuditLog = {
  id: number
  timestamp: string
  userId: string
  userName: string
  role: string
  aksi: AksiType
  target: string
  detail: string
  ipAddress: string
}

type TimelineNode = {
  timestamp: string
  aksi: AksiType
  description: string
  user: string
  role: string
  catatan?: string
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

const MOCK_USERS = [
  'Ahmad Fauzi',
  'Siti Aminah',
  'Budi Santoso',
  'Rina Marlina',
  'Dewi Sartika',
  'Hendra Gunawan',
  'Mega Wati',
  'Anton Wijaya',
  'Sri Wahyuni',
  'Rudi Hermawan',
]

const MOCK_MODUL = [
  'Semua',
  'Dashboard',
  'Procurement',
  'Approval',
  'Master Data',
  'User Management',
  'Accounting',
  'Inventory',
]

const MOCK_AKSI: (AksiType | 'Semua')[] = [
  'Semua',
  'CREATE',
  'UPDATE',
  'DELETE',
  'APPROVE',
  'REJECT',
  'LOGIN',
]

const MOCK_LOGS: AuditLog[] = [
  { id: 1, timestamp: '2026-05-31 15:45:22', userId: 'usr-001', userName: 'Ahmad Fauzi', role: 'PIC Dapur', aksi: 'CREATE', target: 'DO #045', detail: 'Membuat Delivery Order baru untuk Dapur Sejahtera 1', ipAddress: '192.168.1.101' },
  { id: 2, timestamp: '2026-05-31 14:20:10', userId: 'usr-002', userName: 'Siti Aminah', role: 'Kepala SPPG', aksi: 'APPROVE', target: 'DO #044', detail: 'Menyetujui Delivery Order dari PIC', ipAddress: '192.168.1.55' },
  { id: 3, timestamp: '2026-05-31 13:10:05', userId: 'usr-003', userName: 'Budi Santoso', role: 'Kepala SPPI', aksi: 'APPROVE', target: 'DO #043', detail: 'Menyetujui DO setelah review harga', ipAddress: '192.168.1.200' },
  { id: 4, timestamp: '2026-05-31 11:30:00', userId: 'usr-004', userName: 'Rina Marlina', role: 'Full Auth', aksi: 'REJECT', target: 'DO #042', detail: 'Menolak DO — perlu revisi spesifikasi bahan', ipAddress: '192.168.1.88' },
  { id: 5, timestamp: '2026-05-31 09:15:33', userId: 'usr-005', userName: 'Dewi Sartika', role: 'BGN', aksi: 'LOGIN', target: 'Sistem', detail: 'Login ke sistem SPPG MBG', ipAddress: '192.168.1.33' },
  { id: 6, timestamp: '2026-05-30 16:50:00', userId: 'usr-001', userName: 'Ahmad Fauzi', role: 'PIC Dapur', aksi: 'UPDATE', target: 'DO #041', detail: 'Mengubah jumlah item beras dari 50 kg ke 75 kg', ipAddress: '192.168.1.101' },
  { id: 7, timestamp: '2026-05-30 14:00:00', userId: 'usr-006', userName: 'Hendra Gunawan', role: 'PIC Dapur', aksi: 'CREATE', target: 'DO #041', detail: 'Membuat Delivery Order untuk Dapur Harapan', ipAddress: '192.168.1.77' },
  { id: 8, timestamp: '2026-05-30 10:00:00', userId: 'usr-007', userName: 'Mega Wati', role: 'Super Administrator', aksi: 'DELETE', target: 'User: Ahmad Fauzi', detail: 'Menghapus user yang sudah tidak aktif', ipAddress: '192.168.1.10' },
  { id: 9, timestamp: '2026-05-29 15:30:00', userId: 'usr-002', userName: 'Siti Aminah', role: 'Kepala SPPG', aksi: 'APPROVE', target: 'DO #040', detail: 'Menyetujui DO pengiriman rutin', ipAddress: '192.168.1.55' },
  { id: 10, timestamp: '2026-05-29 11:00:00', userId: 'usr-008', userName: 'Anton Wijaya', role: 'PIC Dapur', aksi: 'LOGIN', target: 'Sistem', detail: 'Login ke sistem SPPG MBG', ipAddress: '192.168.1.201' },
  { id: 11, timestamp: '2026-05-28 16:20:00', userId: 'usr-003', userName: 'Budi Santoso', role: 'Kepala SPPI', aksi: 'REJECT', target: 'DO #039', detail: 'Menolak DO — harga ayam terlalu tinggi', ipAddress: '192.168.1.200' },
  { id: 12, timestamp: '2026-05-28 13:45:00', userId: 'usr-009', userName: 'Sri Wahyuni', role: 'PIC Dapur', aksi: 'UPDATE', target: 'Master Bahan', detail: 'Menambahkan supplier baru: PT Pangan Jaya', ipAddress: '192.168.1.156' },
  { id: 13, timestamp: '2026-05-27 10:30:00', userId: 'usr-004', userName: 'Rina Marlina', role: 'Full Auth', aksi: 'APPROVE', target: 'DO #038', detail: 'Menyetujui DO setelah review lengkap', ipAddress: '192.168.1.88' },
  { id: 14, timestamp: '2026-05-26 09:00:00', userId: 'usr-010', userName: 'Rudi Hermawan', role: 'Investor', aksi: 'LOGIN', target: 'Sistem', detail: 'Login ke investor dashboard', ipAddress: '192.168.1.45' },
  { id: 15, timestamp: '2026-05-25 14:15:00', userId: 'usr-007', userName: 'Mega Wati', role: 'Super Administrator', aksi: 'CREATE', target: 'User: Budi Santoso', detail: 'Membuat user baru Kepala SPPI', ipAddress: '192.168.1.10' },
]

// ─── DO Timeline mock data ───────────────────────────────────────────────────

const MOCK_DO_TIMELINES: Record<string, TimelineNode[]> = {
  'DO #038': [
    { timestamp: '25 Mei 2026, 08:30', aksi: 'CREATE', description: 'DO Dibuat', user: 'Ahmad Fauzi', role: 'PIC Dapur' },
    { timestamp: '25 Mei 2026, 14:00', aksi: 'APPROVE', description: 'DO Disetujui', user: 'Siti Aminah', role: 'Kepala SPPG' },
    { timestamp: '26 Mei 2026, 09:00', aksi: 'APPROVE', description: 'DO Disetujui', user: 'Budi Santoso', role: 'Kepala SPPI' },
    { timestamp: '27 Mei 2026, 10:30', aksi: 'APPROVE', description: 'DO Disetujui', user: 'Rina Marlina', role: 'Full Auth' },
  ],
  'DO #039': [
    { timestamp: '27 Mei 2026, 09:00', aksi: 'CREATE', description: 'DO Dibuat', user: 'Anton Wijaya', role: 'PIC Dapur' },
    { timestamp: '27 Mei 2026, 13:00', aksi: 'APPROVE', description: 'DO Disetujui', user: 'Siti Aminah', role: 'Kepala SPPG' },
    { timestamp: '28 Mei 2026, 16:20', aksi: 'REJECT', description: 'DO Ditolak', user: 'Budi Santoso', role: 'Kepala SPPI', catatan: 'Harga ayam terlalu tinggi' },
  ],
  'DO #040': [
    { timestamp: '28 Mei 2026, 08:00', aksi: 'CREATE', description: 'DO Dibuat', user: 'Hendra Gunawan', role: 'PIC Dapur' },
    { timestamp: '29 Mei 2026, 15:30', aksi: 'APPROVE', description: 'DO Disetujui', user: 'Siti Aminah', role: 'Kepala SPPG' },
  ],
  'DO #041': [
    { timestamp: '30 Mei 2026, 10:00', aksi: 'CREATE', description: 'DO Dibuat', user: 'Hendra Gunawan', role: 'PIC Dapur' },
    { timestamp: '30 Mei 2026, 14:00', aksi: 'UPDATE', description: 'DO Direvisi', user: 'Ahmad Fauzi', role: 'PIC Dapur', catatan: 'Mengubah jumlah item beras' },
  ],
  'DO #042': [
    { timestamp: '30 Mei 2026, 16:00', aksi: 'CREATE', description: 'DO Dibuat', user: 'Hendra Gunawan', role: 'PIC Dapur' },
    { timestamp: '31 Mei 2026, 11:30', aksi: 'REJECT', description: 'DO Ditolak', user: 'Rina Marlina', role: 'Full Auth', catatan: 'Perlu revisi spesifikasi bahan' },
  ],
  'DO #043': [
    { timestamp: '31 Mei 2026, 08:00', aksi: 'CREATE', description: 'DO Dibuat', user: 'Sri Wahyuni', role: 'PIC Dapur' },
    { timestamp: '31 Mei 2026, 13:10', aksi: 'APPROVE', description: 'DO Disetujui', user: 'Budi Santoso', role: 'Kepala SPPI' },
  ],
  'DO #044': [
    { timestamp: '31 Mei 2026, 10:00', aksi: 'CREATE', description: 'DO Dibuat', user: 'Ahmad Fauzi', role: 'PIC Dapur' },
    { timestamp: '31 Mei 2026, 14:20', aksi: 'APPROVE', description: 'DO Disetujui', user: 'Siti Aminah', role: 'Kepala SPPG' },
  ],
  'DO #045': [
    { timestamp: '31 Mei 2026, 15:45', aksi: 'CREATE', description: 'DO Dibuat', user: 'Ahmad Fauzi', role: 'PIC Dapur' },
  ],
}

const DO_OPTIONS = Object.keys(MOCK_DO_TIMELINES)

// ─── Helpers ──────────────────────────────────────────────────────────────────

const AKSI_COLORS: Record<AksiType, string> = {
  CREATE: 'bg-blue-100 text-blue-700 border-blue-200',
  UPDATE: 'bg-amber-100 text-amber-700 border-amber-200',
  DELETE: 'bg-red-100 text-red-700 border-red-200',
  APPROVE: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  REJECT: 'bg-transparent text-red-600 border-red-300',
  LOGIN: 'bg-gray-100 text-gray-600 border-gray-200',
}

const TIMELINE_NODE_COLORS: Record<AksiType, string> = {
  CREATE: 'bg-blue-500',
  UPDATE: 'bg-amber-500',
  DELETE: 'bg-red-500',
  APPROVE: 'bg-emerald-500',
  REJECT: 'bg-red-400',
  LOGIN: 'bg-gray-500',
}

// ─── Loading Skeleton ─────────────────────────────────────────────────────────

function AuditSkeleton() {
  return (
    <div className="space-y-6 p-6">
      <div>
        <Skeleton className="h-7 w-32 mb-2" />
        <Skeleton className="h-4 w-64" />
      </div>
      <Skeleton className="h-20 w-full rounded-xl" />
      <Skeleton className="h-10 w-72" />
      <Skeleton className="h-[400px] w-full rounded-xl" />
    </div>
  )
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function AuditTrailPage() {
  const { currentUser } = useAuth()

  // Filters
  const [filterUser, setFilterUser] = useState('Semua')
  const [filterModul, setFilterModul] = useState('Semua')
  const [filterAksi, setFilterAksi] = useState<AksiType | 'Semua'>('Semua')
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')

  // Table state
  const [searchQuery, setSearchQuery] = useState('')
  const [sortField, setSortField] = useState<'timestamp' | 'aksi' | 'userName'>('timestamp')
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc')
  const [page, setPage] = useState(1)
  const pageSize = 8

  // DO Timeline
  const [selectedDo, setSelectedDo] = useState(DO_OPTIONS[0])

  if (!currentUser) {
    return <AuditSkeleton />
  }

  // ── Filtering & sorting ──────────────────────

  const filtered = useMemo(() => {
    let logs = MOCK_LOGS

    if (filterUser !== 'Semua') {
      logs = logs.filter((l) => l.userName === filterUser)
    }
    if (filterAksi !== 'Semua') {
      logs = logs.filter((l) => l.aksi === filterAksi)
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      logs = logs.filter(
        (l) =>
          l.userName.toLowerCase().includes(q) ||
          l.target.toLowerCase().includes(q) ||
          l.detail.toLowerCase().includes(q) ||
          l.aksi.toLowerCase().includes(q)
      )
    }

    // Sort
    logs = [...logs].sort((a, b) => {
      let cmp = 0
      if (sortField === 'timestamp') {
        cmp = a.timestamp.localeCompare(b.timestamp)
      } else if (sortField === 'aksi') {
        cmp = a.aksi.localeCompare(b.aksi)
      } else if (sortField === 'userName') {
        cmp = a.userName.localeCompare(b.userName)
      }
      return sortDir === 'asc' ? cmp : -cmp
    })

    return logs
  }, [filterUser, filterAksi, searchQuery, sortField, sortDir])

  const totalPages = Math.ceil(filtered.length / pageSize)
  const paged = filtered.slice((page - 1) * pageSize, page * pageSize)

  const handleSort = (field: typeof sortField) => {
    if (sortField === field) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'))
    } else {
      setSortField(field)
      setSortDir('asc')
    }
  }

  const SortIcon = ({ field }: { field: typeof sortField }) => {
    if (sortField !== field) return null
    return sortDir === 'asc' ? (
      <ArrowUpIcon className="size-3 ml-1 inline" />
    ) : (
      <ArrowDownIcon className="size-3 ml-1 inline" />
    )
  }

  const handleExport = () => {
    toast('Mengekspor data audit trail...', {
      description: 'File CSV akan diunduh secara otomatis',
    })
  }

  const timeline = MOCK_DO_TIMELINES[selectedDo] ?? []

  return (
    <div className="space-y-6 p-6">
      {/* ── Header ──────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Audit Trail</h1>
          <p className="text-muted-foreground">Catatan aktivitas sistem</p>
        </div>
        <Button variant="outline" size="sm" onClick={handleExport}>
          <FileDownIcon className="size-4 mr-2" />
          Export CSV
        </Button>
      </div>

      {/* ── Tabs ────────────────────────────────── */}
      <Tabs defaultValue="log">
        <TabsList>
          <TabsTrigger value="log">Log Aktivitas</TabsTrigger>
          <TabsTrigger value="timeline">Timeline DO</TabsTrigger>
        </TabsList>

        {/* ═══ Log Aktivitas Tab ═══ */}
        <TabsContent value="log" className="space-y-4 mt-0 pt-4">
          {/* Filter Bar */}
          <Card>
            <CardContent className="p-4 space-y-4">
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
                {/* User filter */}
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-muted-foreground">Pilih User</label>
                  <Select value={filterUser} onValueChange={setFilterUser}>
                    <SelectTrigger className="w-full" size="sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Semua">Semua</SelectItem>
                      {MOCK_USERS.map((u) => (
                        <SelectItem key={u} value={u}>
                          {u}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Modul filter */}
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-muted-foreground">Pilih Modul</label>
                  <Select value={filterModul} onValueChange={setFilterModul}>
                    <SelectTrigger className="w-full" size="sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {MOCK_MODUL.map((m) => (
                        <SelectItem key={m} value={m}>
                          {m}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Aksi filter */}
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-muted-foreground">Pilih Aksi</label>
                  <Select value={filterAksi} onValueChange={(v) => setFilterAksi(v as AksiType | 'Semua')}>
                    <SelectTrigger className="w-full" size="sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {MOCK_AKSI.map((a) => (
                        <SelectItem key={a} value={a}>
                          {a}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Date From */}
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-muted-foreground">Dari Tanggal</label>
                  <Input
                    type="date"
                    value={dateFrom}
                    onChange={(e) => setDateFrom(e.target.value)}
                    className="h-8 text-sm"
                  />
                </div>

                {/* Date To */}
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-muted-foreground">Sampai Tanggal</label>
                  <Input
                    type="date"
                    value={dateTo}
                    onChange={(e) => setDateTo(e.target.value)}
                    className="h-8 text-sm"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Search */}
          <div className="relative max-w-sm">
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input
              placeholder="Cari aktivitas..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value)
                setPage(1)
              }}
              className="pl-9"
            />
          </div>

          {/* Table */}
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead
                      className="cursor-pointer select-none whitespace-nowrap"
                      onClick={() => handleSort('timestamp')}
                    >
                      Timestamp <SortIcon field="timestamp" />
                    </TableHead>
                    <TableHead
                      className="cursor-pointer select-none whitespace-nowrap"
                      onClick={() => handleSort('userName')}
                    >
                      User <SortIcon field="userName" />
                    </TableHead>
                    <TableHead className="whitespace-nowrap">Role</TableHead>
                    <TableHead
                      className="cursor-pointer select-none whitespace-nowrap"
                      onClick={() => handleSort('aksi')}
                    >
                      Aksi <SortIcon field="aksi" />
                    </TableHead>
                    <TableHead className="whitespace-nowrap">Target</TableHead>
                    <TableHead className="whitespace-nowrap">Detail</TableHead>
                    <TableHead className="whitespace-nowrap">IP Address</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paged.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                        Tidak ada data aktivitas ditemukan
                      </TableCell>
                    </TableRow>
                  ) : (
                    paged.map((log) => (
                      <TableRow key={log.id}>
                        <TableCell className="text-xs font-mono whitespace-nowrap text-muted-foreground">
                          {log.timestamp}
                        </TableCell>
                        <TableCell className="font-medium whitespace-nowrap">{log.userName}</TableCell>
                        <TableCell className="text-xs text-muted-foreground whitespace-nowrap">
                          {log.role}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className={`text-xs font-medium ${AKSI_COLORS[log.aksi]}`}>
                            {log.aksi}
                          </Badge>
                        </TableCell>
                        <TableCell className="whitespace-nowrap text-sm">{log.target}</TableCell>
                        <TableCell className="text-sm max-w-[250px] truncate">{log.detail}</TableCell>
                        <TableCell className="text-xs font-mono text-muted-foreground whitespace-nowrap">
                          {log.ipAddress}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                Menampilkan {(page - 1) * pageSize + 1}–{Math.min(page * pageSize, filtered.length)} dari{' '}
                {filtered.length} data
              </p>
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      className={page === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                    />
                  </PaginationItem>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                    <PaginationItem key={p}>
                      <PaginationLink
                        isActive={p === page}
                        onClick={() => setPage(p)}
                        className="cursor-pointer"
                      >
                        {p}
                      </PaginationLink>
                    </PaginationItem>
                  ))}
                  <PaginationItem>
                    <PaginationNext
                      onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                      className={page === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </TabsContent>

        {/* ═══ Timeline DO Tab ═══ */}
        <TabsContent value="timeline" className="space-y-4 mt-0 pt-4">
          {/* DO Selector */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                <label className="text-sm font-medium whitespace-nowrap">Pilih DO:</label>
                <Select value={selectedDo} onValueChange={setSelectedDo}>
                  <SelectTrigger className="w-[200px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {DO_OPTIONS.map((d) => (
                      <SelectItem key={d} value={d}>
                        {d}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Timeline visualization */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <ClockIcon className="size-5" />
                Timeline — {selectedDo}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {timeline.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">
                  Tidak ada data timeline untuk {selectedDo}
                </p>
              ) : (
                <div className="relative pl-8">
                  {/* Vertical line */}
                  <div className="absolute left-[11px] top-3 bottom-3 w-0.5 bg-border" />

                  <div className="space-y-6">
                    {timeline.map((node, i) => {
                      const nodeColor = TIMELINE_NODE_COLORS[node.aksi]
                      const isLast = i === timeline.length - 1

                      return (
                        <div key={i} className="relative">
                          {/* Node circle */}
                          <div
                            className={`absolute -left-[29px] top-1.5 size-[22px] rounded-full ${nodeColor} ring-4 ring-background z-10 flex items-center justify-center`}
                          >
                            <CircleIcon className="size-2 text-white fill-white" />
                          </div>

                          {/* Content */}
                          <div className="bg-muted/50 rounded-lg p-3 border border-border">
                            <div className="flex items-start gap-2">
                              <Badge variant="outline" className={`text-xs shrink-0 ${AKSI_COLORS[node.aksi]}`}>
                                {node.aksi}
                              </Badge>
                              <div className="min-w-0">
                                <p className="text-sm font-semibold">
                                  {node.timestamp} — {node.description}
                                </p>
                                <p className="text-xs text-muted-foreground mt-0.5">
                                  {node.user} — {node.role}
                                </p>
                              </div>
                            </div>

                            {/* Catatan (revision note) */}
                            {node.catatan && (
                              <div className="mt-2 ml-1 pl-3 border-l-2 border-amber-300">
                                <p className="text-xs text-amber-700 italic">
                                  Catatan: &ldquo;{node.catatan}&rdquo;
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Legend */}
          <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
            <span className="font-medium">Warna Node:</span>
            <div className="flex items-center gap-1.5">
              <div className="size-3 rounded-full bg-blue-500" />
              Create
            </div>
            <div className="flex items-center gap-1.5">
              <div className="size-3 rounded-full bg-emerald-500" />
              Approve
            </div>
            <div className="flex items-center gap-1.5">
              <div className="size-3 rounded-full bg-amber-500" />
              Revise
            </div>
            <div className="flex items-center gap-1.5">
              <div className="size-3 rounded-full bg-red-400" />
              Reject
            </div>
            <div className="flex items-center gap-1.5">
              <div className="size-3 rounded-full bg-red-500" />
              Delete
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
