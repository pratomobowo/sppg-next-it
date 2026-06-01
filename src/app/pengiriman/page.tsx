'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import {
  TruckIcon,
  CheckCircleIcon,
  ClockIcon,
  CopyIcon,
  Share2Icon,
} from 'lucide-react'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

// ─── Types ────────────────────────────────────────────────────────────────────

type PengirimanStatus = 'Dalam Perjalanan' | 'Tiba'

type PengirimanRow = {
  id: number
  sekolah: string
  driver: string
  waktuBerangkat: string
  waktuTiba: string | null
  status: PengirimanStatus
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

const MOCK_SEKOLAH = [
  'SDN Cipete 01',
  'SDN Cipete 02',
  'SDN Cilandak 03',
  'SMPN 12 Jakarta',
  'SMAN 28 Jakarta',
  'SDN Pondok Labu 04',
]

const MOCK_PENGIRIMAN: PengirimanRow[] = [
  {
    id: 1,
    sekolah: 'SDN Cipete 01',
    driver: 'Budi Santoso',
    waktuBerangkat: '06:30',
    waktuTiba: '06:55',
    status: 'Tiba',
  },
  {
    id: 2,
    sekolah: 'SDN Cipete 02',
    driver: 'Joko Widodo',
    waktuBerangkat: '06:35',
    waktuTiba: '07:02',
    status: 'Tiba',
  },
  {
    id: 3,
    sekolah: 'SMPN 12 Jakarta',
    driver: 'Slamet Riyadi',
    waktuBerangkat: '06:40',
    waktuTiba: null,
    status: 'Dalam Perjalanan',
  },
  {
    id: 4,
    sekolah: 'SDN Cilandak 03',
    driver: 'Ahmad Dahlan',
    waktuBerangkat: '06:45',
    waktuTiba: null,
    status: 'Dalam Perjalanan',
  },
  {
    id: 5,
    sekolah: 'SMAN 28 Jakarta',
    driver: '—',
    waktuBerangkat: '—',
    waktuTiba: null,
    status: 'Dalam Perjalanan',
  },
]

// ─── Main Component ───────────────────────────────────────────────────────────

export default function PengirimanPage() {
  // Form state
  const [selectedSekolah, setSelectedSekolah] = useState('')
  const [driverName, setDriverName] = useState('')
  const [waktuBerangkat, setWaktuBerangkat] = useState('')

  // Table state
  const [pengiriman, setPengiriman] = useState<PengirimanRow[]>(MOCK_PENGIRIMAN)

  // Konfirmasi Tiba modal
  const [konfirmasiOpen, setKonfirmasiOpen] = useState(false)
  const [konfirmasiTarget, setKonfirmasiTarget] = useState<PengirimanRow | null>(null)
  const [waktuTibaInput, setWaktuTibaInput] = useState('')
  const [catatanTiba, setCatatanTiba] = useState('')

  // ─── Handlers ─────────────────────────────────────────────────────────────

  const handleMulaiPengiriman = () => {
    if (!selectedSekolah) {
      toast.error('Pilih sekolah tujuan')
      return
    }
    if (!driverName.trim()) {
      toast.error('Isi nama driver')
      return
    }
    if (!waktuBerangkat) {
      toast.error('Isi waktu berangkat')
      return
    }

    const newId = Math.max(0, ...pengiriman.map((p) => p.id)) + 1
    const newRow: PengirimanRow = {
      id: newId,
      sekolah: selectedSekolah,
      driver: driverName.trim(),
      waktuBerangkat,
      waktuTiba: null,
      status: 'Dalam Perjalanan',
    }

    setPengiriman([newRow, ...pengiriman])
    setSelectedSekolah('')
    setDriverName('')
    setWaktuBerangkat('')
    toast.success('Pengiriman dimulai', {
      description: `Driver ${driverName} berangkat ke ${selectedSekolah}`,
    })
  }

  const openKonfirmasi = (row: PengirimanRow) => {
    setKonfirmasiTarget(row)
    setWaktuTibaInput(new Date().toTimeString().slice(0, 5))
    setCatatanTiba('')
    setKonfirmasiOpen(true)
  }

  const handleKonfirmasi = () => {
    if (!konfirmasiTarget) return
    if (!waktuTibaInput) {
      toast.error('Isi waktu tiba')
      return
    }

    setPengiriman(
      pengiriman.map((p) =>
        p.id === konfirmasiTarget.id
          ? { ...p, status: 'Tiba' as PengirimanStatus, waktuTiba: waktuTibaInput }
          : p,
      ),
    )

    toast.success(`Pengiriman ke ${konfirmasiTarget.sekolah} dikonfirmasi tiba`, {
      description: `Tiba pukul ${waktuTibaInput}`,
    })

    setKonfirmasiOpen(false)
    setKonfirmasiTarget(null)
    setWaktuTibaInput('')
    setCatatanTiba('')
  }

  // ─── Render ───────────────────────────────────────────────────────────────

  const statusBadge = (status: PengirimanStatus) => {
    if (status === 'Tiba') {
      return (
        <Badge className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300">
          <CheckCircleIcon className="mr-1 size-3" />
          Tiba
        </Badge>
      )
    }
    return (
      <Badge className="bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300">
        <ClockIcon className="mr-1 size-3" />
        Dalam Perjalanan
      </Badge>
    )
  }

  return (
    <div className="space-y-6 p-4 sm:p-6">
      {/* ─── Header ─── */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Tracking Pengiriman</h1>
        <p className="text-muted-foreground">
          Pantau status pengiriman makanan ke sekolah
        </p>
      </div>

      {/* ─── Input Section ─── */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <TruckIcon className="size-4" />
            Mulai Pengiriman Baru
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-3">
            {/* Pilih Sekolah */}
            <div className="space-y-2">
              <Label htmlFor="sekolah-select">Pilih Sekolah</Label>
              <Select value={selectedSekolah} onValueChange={setSelectedSekolah}>
                <SelectTrigger id="sekolah-select" className="w-full">
                  <SelectValue placeholder="Pilih sekolah..." />
                </SelectTrigger>
                <SelectContent>
                  {MOCK_SEKOLAH.map((s) => (
                    <SelectItem key={s} value={s}>
                      {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Nama Driver */}
            <div className="space-y-2">
              <Label htmlFor="driver-name">Nama Driver</Label>
              <Input
                id="driver-name"
                placeholder="Nama driver"
                value={driverName}
                onChange={(e) => setDriverName(e.target.value)}
              />
            </div>

            {/* Waktu Berangkat */}
            <div className="space-y-2">
              <Label htmlFor="waktu-berangkat">Waktu Berangkat</Label>
              <Input
                id="waktu-berangkat"
                type="time"
                value={waktuBerangkat}
                onChange={(e) => setWaktuBerangkat(e.target.value)}
              />
            </div>
          </div>

          <Button className="w-full sm:w-auto" onClick={handleMulaiPengiriman}>
            Mulai Pengiriman
          </Button>
        </CardContent>
      </Card>

      {/* ─── Tracking Table ─── */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Status Pengiriman</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Sekolah</TableHead>
                <TableHead>Driver</TableHead>
                <TableHead>Berangkat</TableHead>
                <TableHead>Tiba</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pengiriman.map((row) => (
                <TableRow key={row.id}>
                  <TableCell className="font-medium">{row.sekolah}</TableCell>
                  <TableCell>{row.driver}</TableCell>
                  <TableCell>{row.waktuBerangkat}</TableCell>
                  <TableCell>{row.waktuTiba ?? '—'}</TableCell>
                  <TableCell>{statusBadge(row.status)}</TableCell>
                  <TableCell className="text-right">
                    {row.status === 'Dalam Perjalanan' && (
                      <div className="flex items-center justify-end gap-1.5">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="size-8 text-muted-foreground hover:text-primary"
                          onClick={() => {
                            const url = `${window.location.origin}/pengiriman/konfirmasi/${row.id}`
                            navigator.clipboard.writeText(url)
                            toast.success('Link konfirmasi berhasil disalin', {
                              description: url
                            })
                          }}
                          title="Salin Link Konfirmasi"
                        >
                          <CopyIcon className="size-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="size-8 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50"
                          onClick={() => {
                            const url = `${window.location.origin}/pengiriman/konfirmasi/${row.id}`
                            const text = `Halo, mohon konfirmasi penerimaan porsi Makanan Bergizi Gratis di ${row.sekolah} melalui link berikut: ${url}`
                            window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank')
                          }}
                          title="Share via WhatsApp"
                        >
                          <Share2Icon className="size-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-emerald-300 text-emerald-700 hover:bg-emerald-50 dark:border-emerald-700 dark:text-emerald-400 dark:hover:bg-emerald-950 shrink-0"
                          onClick={() => openKonfirmasi(row)}
                        >
                          Konfirmasi Tiba
                        </Button>
                      </div>
                    )}
                    {row.status === 'Tiba' && (
                      <span className="text-xs text-muted-foreground">
                        Selesai
                      </span>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* ─── Konfirmasi Tiba Modal ─── */}
      <Dialog open={konfirmasiOpen} onOpenChange={setKonfirmasiOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Konfirmasi Kedatangan di {konfirmasiTarget?.sekolah}
            </DialogTitle>
            <DialogDescription>
              Isi waktu tiba dan catatan (opsional) untuk mengonfirmasi pengiriman.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="waktu-tiba">Waktu Tiba</Label>
              <Input
                id="waktu-tiba"
                type="time"
                value={waktuTibaInput}
                onChange={(e) => setWaktuTibaInput(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="catatan-tiba">Catatan</Label>
              <Textarea
                id="catatan-tiba"
                placeholder="Catatan opsional..."
                value={catatanTiba}
                onChange={(e) => setCatatanTiba(e.target.value)}
                rows={3}
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setKonfirmasiOpen(false)}
            >
              Batal
            </Button>
            <Button onClick={handleKonfirmasi}>Konfirmasi</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
