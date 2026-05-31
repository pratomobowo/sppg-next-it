'use client'

import { useState } from 'react'
import { useAuth } from '@/lib/auth'
import { toast } from 'sonner'
import {
  CameraIcon,
  Trash2Icon,
  WifiOffIcon,
  RefreshCwIcon,
  PlusIcon,
} from 'lucide-react'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

// ─── Types ────────────────────────────────────────────────────────────────────

type Shift = 'Pagi' | 'Siang'

type DistribusiRow = {
  id: number
  sekolah: string
  porsi: number
}

type RiwayatRow = {
  id: number
  tanggal: string
  shift: Shift
  porsi: number
  status: 'Terkirim' | 'Pending'
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

const MOCK_TARGET_PORSI = 300

const MOCK_RIWAYAT: RiwayatRow[] = [
  { id: 1, tanggal: '31 Mei 2026', shift: 'Pagi', porsi: 287, status: 'Terkirim' },
  { id: 2, tanggal: '30 Mei 2026', shift: 'Siang', porsi: 295, status: 'Terkirim' },
  { id: 3, tanggal: '30 Mei 2026', shift: 'Pagi', porsi: 300, status: 'Terkirim' },
  { id: 4, tanggal: '29 Mei 2026', shift: 'Siang', porsi: 290, status: 'Terkirim' },
  { id: 5, tanggal: '29 Mei 2026', shift: 'Pagi', porsi: 298, status: 'Pending' },
]

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatTanggal(date: Date): string {
  return date.toLocaleDateString('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function LaporanHarianPage() {
  const { currentUser } = useAuth()

  const [selectedShift, setSelectedShift] = useState<Shift>('Pagi')
  const [porsiDimasak, setPorsiDimasak] = useState<number>(0)
  const [realisasiPorsi, setRealisasiPorsi] = useState<number>(0)
  const [selisih, setSelisih] = useState<number>(0)
  const [distribusi, setDistribusi] = useState<DistribusiRow[]>([
    { id: 1, sekolah: '', porsi: 0 },
  ])
  const [catatan, setCatatan] = useState('')
  const [offlineBanner, setOfflineBanner] = useState<'offline' | 'syncing' | null>(null)

  const dapurName = currentUser?.dapur ?? currentUser?.yayasan ?? 'Dapur SPPG'
  const tanggalStr = formatTanggal(new Date())

  // ─── Handlers ─────────────────────────────────────────────────────────────

  const handleRealisasiChange = (val: number) => {
    setRealisasiPorsi(val)
    setSelisih(MOCK_TARGET_PORSI - val)
  }

  const addDistribusiRow = () => {
    const newId = Math.max(0, ...distribusi.map((d) => d.id)) + 1
    setDistribusi([...distribusi, { id: newId, sekolah: '', porsi: 0 }])
  }

  const removeDistribusiRow = (id: number) => {
    if (distribusi.length <= 1) return
    setDistribusi(distribusi.filter((d) => d.id !== id))
  }

  const updateDistribusi = (
    id: number,
    field: 'sekolah' | 'porsi',
    value: string | number,
  ) => {
    setDistribusi(
      distribusi.map((d) =>
        d.id === id ? { ...d, [field]: value } : d,
      ),
    )
  }

  const handleSubmit = () => {
    if (porsiDimasak <= 0) {
      toast.error('Isi jumlah porsi dimasak')
      return
    }
    toast.success(`Laporan shift ${selectedShift} berhasil dikirim`, {
      description: `${porsiDimasak} porsi dimasak, ${realisasiPorsi} porsi terealisasi`,
    })
    // Reset form
    setPorsiDimasak(0)
    setRealisasiPorsi(0)
    setSelisih(0)
    setDistribusi([{ id: 1, sekolah: '', porsi: 0 }])
    setCatatan('')
  }

  // ─── Render ───────────────────────────────────────────────────────────────

  const selisihColor =
    selisih >= 0 ? 'text-emerald-600' : 'text-red-600'

  return (
    <div className="space-y-6 p-4 sm:p-6">
      {/* ─── Header ─── */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Laporan Shift</h1>
        <p className="text-muted-foreground">
          {tanggalStr} — {dapurName}
        </p>
      </div>

      {/* ─── PWA Offline / Sync Banners ─── */}
      {offlineBanner === 'offline' && (
        <div className="flex items-center gap-2 rounded-lg bg-amber-50 border border-amber-200 px-4 py-3 text-sm text-amber-800 dark:bg-amber-950 dark:border-amber-800 dark:text-amber-200">
          <WifiOffIcon className="size-4 shrink-0" />
          <span>
            Anda sedang offline. Laporan akan dikirim otomatis saat terhubung.
          </span>
        </div>
      )}
      {offlineBanner === 'syncing' && (
        <div className="flex items-center gap-2 rounded-lg bg-blue-50 border border-blue-200 px-4 py-3 text-sm text-blue-800 dark:bg-blue-950 dark:border-blue-800 dark:text-blue-200">
          <RefreshCwIcon className="size-4 shrink-0 animate-spin" />
          <span>Menyinkronkan data...</span>
        </div>
      )}

      {/* ─── Tabs: Form & Riwayat ─── */}
      <Tabs defaultValue="form" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="form">Form Laporan</TabsTrigger>
          <TabsTrigger value="riwayat">Riwayat Laporan</TabsTrigger>
        </TabsList>

        {/* ═══ TAB: Form Laporan ═══ */}
        <TabsContent value="form" className="space-y-6">
          {/* ─── Shift Selector ─── */}
          <div className="flex gap-2">
            {(['Pagi', 'Siang'] as Shift[]).map((shift) => (
              <Button
                key={shift}
                variant={selectedShift === shift ? 'default' : 'outline'}
                className="flex-1"
                onClick={() => setSelectedShift(shift)}
                type="button"
              >
                {shift}
              </Button>
            ))}
          </div>

          {/* ─── Produksi ─── */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Produksi</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Label htmlFor="porsi-dimasak">Jumlah Porsi Dimasak</Label>
                <Input
                  id="porsi-dimasak"
                  type="number"
                  min={0}
                  value={porsiDimasak || ''}
                  onChange={(e) => setPorsiDimasak(Number(e.target.value))}
                  placeholder="0"
                />
              </div>
            </CardContent>
          </Card>

          {/* ─── Target vs Realisasi ─── */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Target vs Realisasi</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between rounded-lg bg-muted/50 px-4 py-3">
                <span className="text-sm font-medium">Target Porsi</span>
                <span className="text-lg font-bold">{MOCK_TARGET_PORSI}</span>
              </div>
              <div className="space-y-2">
                <Label htmlFor="realisasi-porsi">Realisasi Porsi</Label>
                <Input
                  id="realisasi-porsi"
                  type="number"
                  min={0}
                  value={realisasiPorsi || ''}
                  onChange={(e) => handleRealisasiChange(Number(e.target.value))}
                  placeholder="0"
                />
              </div>
              <div className="flex items-center justify-between rounded-lg bg-muted/50 px-4 py-3">
                <span className="text-sm font-medium">Selisih</span>
                <span className={`text-lg font-bold ${selisihColor}`}>
                  {selisih >= 0 ? `+${selisih}` : selisih}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* ─── Distribusi ─── */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Distribusi per Sekolah</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {distribusi.map((row) => (
                <div
                  key={row.id}
                  className="flex items-end gap-3 rounded-lg border p-3"
                >
                  <div className="flex-1 space-y-1.5">
                    <Label className="text-xs">Sekolah</Label>
                    <Input
                      placeholder="Nama Sekolah"
                      value={row.sekolah}
                      onChange={(e) =>
                        updateDistribusi(row.id, 'sekolah', e.target.value)
                      }
                    />
                  </div>
                  <div className="w-24 space-y-1.5">
                    <Label className="text-xs">Porsi</Label>
                    <Input
                      type="number"
                      min={0}
                      value={row.porsi || ''}
                      onChange={(e) =>
                        updateDistribusi(row.id, 'porsi', Number(e.target.value))
                      }
                      placeholder="0"
                    />
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className={
                      distribusi.length <= 1
                        ? 'text-muted-foreground/40 shrink-0'
                        : 'text-red-500 hover:text-red-600 shrink-0'
                    }
                    onClick={() => removeDistribusiRow(row.id)}
                    disabled={distribusi.length <= 1}
                    type="button"
                  >
                    <Trash2Icon className="size-4" />
                  </Button>
                </div>
              ))}
              <Button
                variant="outline"
                className="w-full"
                onClick={addDistribusiRow}
                type="button"
              >
                <PlusIcon className="size-4" />
                Tambah Sekolah
              </Button>
            </CardContent>
          </Card>

          {/* ─── Catatan Kendala ─── */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Catatan Kendala</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Textarea
                placeholder="Catatan kendala atau masalah (opsional)"
                value={catatan}
                onChange={(e) => setCatatan(e.target.value)}
                maxLength={500}
                rows={4}
              />
              <p className="text-xs text-muted-foreground text-right">
                {catatan.length}/500
              </p>
            </CardContent>
          </Card>

          {/* ─── Upload Foto ─── */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Upload Foto</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div
                    key={i}
                    className="flex aspect-square flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-muted-foreground/30 text-muted-foreground transition-colors hover:border-muted-foreground/50 hover:bg-muted/30 cursor-pointer"
                  >
                    <CameraIcon className="size-6" />
                    <span className="text-xs">Tambah Foto</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* ─── CTA Sticky Bottom Bar (only for form tab) ─── */}
          <div className="sticky bottom-0 -mx-4 -mb-6 border-t bg-background px-4 py-4 sm:-mx-6 sm:px-6">
            <Button className="w-full" size="lg" onClick={handleSubmit}>
              Kirim Laporan
            </Button>
          </div>
        </TabsContent>

        {/* ═══ TAB: Riwayat Laporan ═══ */}
        <TabsContent value="riwayat">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Riwayat Laporan</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tanggal</TableHead>
                    <TableHead>Shift</TableHead>
                    <TableHead>Porsi</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {MOCK_RIWAYAT.map((row) => (
                    <TableRow key={row.id}>
                      <TableCell>{row.tanggal}</TableCell>
                      <TableCell>{row.shift}</TableCell>
                      <TableCell>{row.porsi}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            row.status === 'Terkirim' ? 'default' : 'secondary'
                          }
                          className={
                            row.status === 'Terkirim'
                              ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300'
                              : 'bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300'
                          }
                        >
                          {row.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
