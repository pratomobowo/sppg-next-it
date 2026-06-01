'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth'
import { toast } from 'sonner'
import {
  ArrowLeftIcon,
  CameraIcon,
  ClockIcon,
  FileCheckIcon,
  CheckIcon,
  XIcon
} from 'lucide-react'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'

// ─── Types ────────────────────────────────────────────────────────────────────

type LaporanStatus = 'Pending' | 'Disetujui' | 'Ditolak'

type LaporanHarian = {
  id: string
  tanggal: string
  dapur: string
  yayasan: string
  shift: 'Pagi' | 'Siang'
  porsiDimasak: number
  targetPorsi: number
  realisasiPorsi: number
  selisih: number
  pic: string
  catatan: string
  distribusi: { sekolah: string; porsi: number }[]
  fotos: string[]
  status: LaporanStatus
  timeline: { actor: string; role: string; action: string; time: string; note?: string }[]
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

const MOCK_LAPORAN: LaporanHarian[] = [
  {
    id: 'LAP-001',
    tanggal: '31 Mei 2026',
    dapur: 'Dapur Sejahtera 1',
    yayasan: 'Yayasan Sejahtera',
    shift: 'Pagi',
    porsiDimasak: 300,
    targetPorsi: 300,
    realisasiPorsi: 295,
    selisih: -5,
    pic: 'PIC Dapur (Sejahtera)',
    catatan: 'Listrik sempat padam selama 15 menit, namun proses memasak tetap berjalan lancar.',
    distribusi: [
      { sekolah: 'SDN Cipete 01', porsi: 150 },
      { sekolah: 'SDN Cipete 02', porsi: 145 }
    ],
    fotos: ['/assets/food1.jpg', '/assets/food2.jpg'],
    status: 'Pending',
    timeline: [
      { actor: 'PIC Dapur', role: 'PIC Dapur', action: 'mengirimkan laporan harian', time: '1 hari lalu' }
    ]
  },
  {
    id: 'LAP-002',
    tanggal: '30 Mei 2026',
    dapur: 'Dapur Mandiri 1',
    yayasan: 'Yayasan Mandiri',
    shift: 'Siang',
    porsiDimasak: 250,
    targetPorsi: 250,
    realisasiPorsi: 250,
    selisih: 0,
    pic: 'PIC Dapur (Mandiri)',
    catatan: 'Pengiriman tepat waktu, semua porsi habis tersalurkan.',
    distribusi: [
      { sekolah: 'SMPN 12 Jakarta', porsi: 150 },
      { sekolah: 'SDN Pondok Labu 04', porsi: 100 }
    ],
    fotos: ['/assets/food3.jpg'],
    status: 'Pending',
    timeline: [
      { actor: 'PIC Dapur', role: 'PIC Dapur', action: 'mengirimkan laporan harian', time: '2 hari lalu' }
    ]
  },
  {
    id: 'LAP-003',
    tanggal: '29 Mei 2026',
    dapur: 'Dapur Sejahtera 1',
    yayasan: 'Yayasan Sejahtera',
    shift: 'Siang',
    porsiDimasak: 300,
    targetPorsi: 300,
    realisasiPorsi: 280,
    selisih: -20,
    pic: 'PIC Dapur (Sejahtera)',
    catatan: '5 porsi tumpah saat distribusi karena guncangan di jalan.',
    distribusi: [
      { sekolah: 'SDN Cipete 01', porsi: 140 },
      { sekolah: 'SDN Cipete 02', porsi: 140 }
    ],
    fotos: ['/assets/food4.jpg'],
    status: 'Disetujui',
    timeline: [
      { actor: 'PIC Dapur', role: 'PIC Dapur', action: 'mengirimkan laporan harian', time: '3 hari lalu' },
      { actor: 'Authorizer Penuh', role: 'Full Authorize (Lvl 3)', action: 'menyetujui laporan harian', time: '3 hari lalu' }
    ]
  }
]

export default function ApprovalLaporanPage() {
  const router = useRouter()
  const { currentUser } = useAuth()

  const [laporans, setLaporans] = useState<LaporanHarian[]>(MOCK_LAPORAN)
  const [selectedId, setSelectedId] = useState<string | null>('LAP-001')
  
  // Dialog states
  const [showApproveDialog, setShowApproveDialog] = useState(false)
  const [showRejectDialog, setShowRejectDialog] = useState(false)
  const [rejectNote, setRejectNote] = useState('')

  const activeReport = laporans.find((l) => l.id === selectedId)

  // Handlers
  const handleApprove = () => {
    if (!selectedId) return
    setLaporans((prev) =>
      prev.map((l) => {
        if (l.id !== selectedId) return l
        return {
          ...l,
          status: 'Disetujui',
          timeline: [
            {
              actor: currentUser ? `${currentUser.firstName} ${currentUser.lastName || ''}` : 'Authorizer',
              role: currentUser?.role || 'Full Authorize (Lvl 3)',
              action: 'menyetujui laporan harian',
              time: 'baru saja'
            },
            ...l.timeline
          ]
        }
      })
    )
    toast.success('Laporan berhasil disetujui')
    setShowApproveDialog(false)
  }

  const handleReject = () => {
    if (!selectedId || rejectNote.trim().length < 10) {
      toast.error('Catatan penolakan minimal 10 karakter')
      return
    }
    setLaporans((prev) =>
      prev.map((l) => {
        if (l.id !== selectedId) return l
        return {
          ...l,
          status: 'Ditolak',
          timeline: [
            {
              actor: currentUser ? `${currentUser.firstName} ${currentUser.lastName || ''}` : 'Authorizer',
              role: currentUser?.role || 'Full Authorize (Lvl 3)',
              action: 'menolak laporan harian',
              time: 'baru saja',
              note: rejectNote
            },
            ...l.timeline
          ]
        }
      })
    )
    toast.success('Laporan berhasil ditolak untuk revisi')
    setShowRejectDialog(false)
    setRejectNote('')
  }

  const pendingReports = laporans.filter((l) => l.status === 'Pending')
  const historyReports = laporans.filter((l) => l.status !== 'Pending')

  return (
    <div className="space-y-6 p-4 sm:p-6">
      {/* ─── Back Button & Header ─── */}
      <div className="flex items-center gap-3">
        <Button variant="outline" size="icon" onClick={() => router.back()} type="button">
          <ArrowLeftIcon className="size-4" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Persetujuan Laporan Shift</h1>
          <p className="text-muted-foreground">Review dan verifikasi laporan harian dapur dari PIC Dapur</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_400px]">
        {/* ═══ Kiri: List Laporan & Detail ═══ */}
        <div className="space-y-6">
          {/* Laporan Menunggu Approval */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <ClockIcon className="size-4 text-amber-500" />
                Laporan Menunggu Persetujuan ({pendingReports.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tanggal</TableHead>
                    <TableHead>Dapur</TableHead>
                    <TableHead>Shift</TableHead>
                    <TableHead className="text-right">Realisasi/Target</TableHead>
                    <TableHead>PIC</TableHead>
                    <TableHead className="text-right">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pendingReports.map((row) => (
                    <TableRow
                      key={row.id}
                      className={`cursor-pointer hover:bg-muted/50 ${selectedId === row.id ? 'bg-muted' : ''}`}
                      onClick={() => setSelectedId(row.id)}
                    >
                      <TableCell className="font-medium">{row.tanggal}</TableCell>
                      <TableCell>{row.dapur}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{row.shift}</Badge>
                      </TableCell>
                      <TableCell className="text-right font-mono text-xs">
                        {row.realisasiPorsi} / {row.targetPorsi}
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">{row.pic}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm">
                          Review
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                  {pendingReports.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-6 text-muted-foreground text-sm">
                        Tidak ada laporan menunggu persetujuan.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Laporan Detail View */}
          {activeReport && (
            <Card className="border-primary/20">
              <CardHeader className="border-b bg-muted/20">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg">{activeReport.dapur}</CardTitle>
                    <p className="text-xs text-muted-foreground">
                      {activeReport.tanggal} · Shift {activeReport.shift} · PIC: {activeReport.pic}
                    </p>
                  </div>
                  <Badge
                    variant={activeReport.status === 'Disetujui' ? 'default' : activeReport.status === 'Ditolak' ? 'destructive' : 'secondary'}
                    className={
                      activeReport.status === 'Disetujui'
                        ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 border-emerald-200'
                        : activeReport.status === 'Ditolak'
                        ? 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300 border-red-200'
                        : 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300 border-amber-200'
                    }
                  >
                    {activeReport.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-6 pt-6">
                {/* Stat Grid (Produksi) */}
                <div className="grid gap-4 sm:grid-cols-3">
                  <div className="rounded-lg border p-3 bg-muted/10">
                    <span className="text-xs text-muted-foreground font-medium">Target Porsi</span>
                    <p className="text-xl font-bold mt-1">{activeReport.targetPorsi}</p>
                  </div>
                  <div className="rounded-lg border p-3 bg-muted/10">
                    <span className="text-xs text-muted-foreground font-medium">Porsi Dimasak</span>
                    <p className="text-xl font-bold mt-1">{activeReport.porsiDimasak}</p>
                  </div>
                  <div className="rounded-lg border p-3 bg-muted/10">
                    <span className="text-xs text-muted-foreground font-medium">Selisih Porsi</span>
                    <p className={`text-xl font-bold mt-1 ${activeReport.selisih >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                      {activeReport.selisih >= 0 ? `+${activeReport.selisih}` : activeReport.selisih}
                    </p>
                  </div>
                </div>

                {/* Distribusi */}
                <div className="space-y-3">
                  <h3 className="text-sm font-semibold">Distribusi Penerimaan Sekolah</h3>
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-muted/30">
                          <TableHead>Nama Sekolah</TableHead>
                          <TableHead className="text-right">Jumlah Porsi</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {activeReport.distribusi.map((d, i) => (
                          <TableRow key={i}>
                            <TableCell className="font-medium">{d.sekolah}</TableCell>
                            <TableCell className="text-right font-semibold">{d.porsi} porsi</TableCell>
                          </TableRow>
                        ))}
                        <TableRow className="bg-muted/10 font-semibold">
                          <TableCell>Total Terdistribusi</TableCell>
                          <TableCell className="text-right">
                            {activeReport.distribusi.reduce((s, x) => s + x.porsi, 0)} porsi
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </div>
                </div>

                {/* Kendala */}
                <div className="space-y-1.5">
                  <h3 className="text-sm font-semibold">Catatan Kendala & Lapangan</h3>
                  <div className="rounded-lg border p-3 bg-muted/5 text-sm">
                    {activeReport.catatan || <span className="text-muted-foreground italic">Tidak ada kendala dilaporkan.</span>}
                  </div>
                </div>

                {/* Foto */}
                <div className="space-y-3">
                  <h3 className="text-sm font-semibold">Dokumentasi Foto Masakan</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {activeReport.fotos.map((f, i) => (
                      <div
                        key={i}
                        className="aspect-square rounded-lg border-2 border-dashed border-muted-foreground/20 flex flex-col items-center justify-center bg-muted/10 hover:bg-muted/20 transition cursor-pointer"
                      >
                        <CameraIcon className="size-5 text-muted-foreground mb-1" />
                        <span className="text-[10px] text-muted-foreground font-medium">Foto #{i+1}</span>
                      </div>
                    ))}
                    {activeReport.fotos.length === 0 && (
                      <span className="text-xs text-muted-foreground italic col-span-4">Tidak ada dokumentasi foto.</span>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* ═══ Kanan: Approval Actions & Timeline ═══ */}
        <div className="space-y-6">
          {/* Action Card */}
          {activeReport && activeReport.status === 'Pending' && (
            <Card className="border-primary/30 shadow-md">
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Aksi Persetujuan</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white" size="lg" onClick={() => setShowApproveDialog(true)}>
                  <CheckIcon className="size-4 mr-2" />
                  Setujui Laporan
                </Button>
                <Button variant="outline" className="w-full border-red-300 text-red-600 hover:bg-red-50" size="lg" onClick={() => setShowRejectDialog(true)}>
                  <XIcon className="size-4 mr-2" />
                  Tolak &amp; Minta Revisi
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Timeline Laporan */}
          {activeReport && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <FileCheckIcon className="size-4 text-primary" />
                  Aktivitas &amp; Timeline
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="relative pl-6 space-y-4">
                  {/* Vertical Line */}
                  <div className="absolute left-[7px] top-2 bottom-2 w-0.5 bg-border" />
                  
                  {activeReport.timeline.map((entry, idx) => (
                    <div key={idx} className="relative text-sm">
                      {/* Bullet circle */}
                      <div className="absolute -left-[23px] top-1 size-3 rounded-full bg-primary border-2 border-background" />
                      <div>
                        <p className="font-semibold">{entry.actor} <span className="text-xs text-muted-foreground font-normal">({entry.role})</span></p>
                        <p className="text-muted-foreground text-xs mt-0.5">{entry.action}</p>
                        <p className="text-[10px] text-muted-foreground font-mono mt-0.5">{entry.time}</p>
                        {entry.note && (
                          <div className="mt-1.5 p-2 bg-red-50 text-red-700 border border-red-100 rounded text-xs">
                            <strong>Catatan Revisi:</strong> {entry.note}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Riwayat Laporan */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Riwayat Laporan Hari Ini</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Dapur</TableHead>
                    <TableHead>Shift</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {historyReports.map((row) => (
                    <TableRow
                      key={row.id}
                      className={`cursor-pointer hover:bg-muted/50 ${selectedId === row.id ? 'bg-muted' : ''}`}
                      onClick={() => setSelectedId(row.id)}
                    >
                      <TableCell className="font-medium text-xs">{row.dapur}</TableCell>
                      <TableCell className="text-xs">{row.shift}</TableCell>
                      <TableCell>
                        <Badge
                          variant={row.status === 'Disetujui' ? 'default' : 'destructive'}
                          className="text-[10px] px-1.5 py-0"
                        >
                          {row.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                  {historyReports.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={3} className="text-center py-4 text-xs text-muted-foreground">
                        Belum ada laporan diproses hari ini.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* ─── Dialog: Setujui Laporan ─── */}
      <Dialog open={showApproveDialog} onOpenChange={setShowApproveDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Setujui Laporan Harian</DialogTitle>
            <DialogDescription>
              Apakah Anda yakin ingin menyetujui laporan harian untuk <strong>{activeReport?.dapur}</strong> (Shift {activeReport?.shift})?
            </DialogDescription>
          </DialogHeader>
          <div className="text-sm text-muted-foreground">
            Laporan yang disetujui akan tercatat permanen di audit trail dan dapat diakses oleh BGN dan Investor.
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowApproveDialog(false)}>Batal</Button>
            <Button className="bg-emerald-600 hover:bg-emerald-700 text-white" onClick={handleApprove}>Setujui</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ─── Dialog: Tolak Laporan (Revisi) ─── */}
      <Dialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Tolak &amp; Minta Revisi Laporan</DialogTitle>
            <DialogDescription>
              Berikan catatan revisi yang jelas kepada PIC Dapur mengenai laporan harian ini.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <Label htmlFor="reject-note">Catatan Revisi *</Label>
            <Textarea
              id="reject-note"
              placeholder="Tulis alasan penolakan... (minimal 10 karakter)"
              value={rejectNote}
              onChange={(e) => setRejectNote(e.target.value)}
              rows={4}
            />
            <p className="text-[10px] text-muted-foreground text-right">
              {rejectNote.length} karakter (min 10)
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setShowRejectDialog(false); setRejectNote('') }}>Batal</Button>
            <Button
              variant="destructive"
              onClick={handleReject}
              disabled={rejectNote.trim().length < 10}
            >
              Tolak Laporan
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
