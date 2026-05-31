'use client'

import { useState } from 'react'
import {
  CameraIcon,
  DownloadIcon,
  TrendingDownIcon,
  TrendingUpIcon,
  WalletIcon,
} from 'lucide-react'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { formatRupiah } from '@/lib/utils'
import { toast } from 'sonner'

// ─── Mock Data ────────────────────────────────────────────────────────────────

type KasMasukEntry = {
  id: string
  tanggal: string
  sumber: string
  jumlah: number
  status: 'Terverifikasi' | 'Pending'
}

type KasKeluarEntry = {
  id: string
  tanggal: string
  kategori: string
  deskripsi: string
  jumlah: number
  nota?: string
}

type Dana12HariEntry = {
  id: string
  periode: string
  tanggalMulai: string
  tanggalAkhir: string
  total: number
  status: 'Diajukan' | 'Disetujui'
}

const MOCK_KAS_MASUK: KasMasukEntry[] = [
  { id: 'KM-001', tanggal: '2026-05-25', sumber: 'BOS Pusat', jumlah: 15_000_000, status: 'Terverifikasi' },
  { id: 'KM-002', tanggal: '2026-05-20', sumber: 'Donasi', jumlah: 5_000_000, status: 'Terverifikasi' },
  { id: 'KM-003', tanggal: '2026-05-18', sumber: 'Dana Desa', jumlah: 8_000_000, status: 'Pending' },
  { id: 'KM-004', tanggal: '2026-05-15', sumber: 'BOS Pusat', jumlah: 12_000_000, status: 'Terverifikasi' },
  { id: 'KM-005', tanggal: '2026-05-10', sumber: 'Donasi Korporat', jumlah: 10_000_000, status: 'Terverifikasi' },
  { id: 'KM-006', tanggal: '2026-05-05', sumber: 'Dana Yayasan', jumlah: 7_000_000, status: 'Pending' },
]

const MOCK_KAS_KELUAR: KasKeluarEntry[] = [
  { id: 'KK-001', tanggal: '2026-05-31', kategori: 'Bahan Baku', deskripsi: 'Pembelian beras 500kg', jumlah: 6_000_000 },
  { id: 'KK-002', tanggal: '2026-05-30', kategori: 'Transportasi', deskripsi: 'Bensin pengiriman', jumlah: 350_000 },
  { id: 'KK-003', tanggal: '2026-05-29', kategori: 'Bahan Baku', deskripsi: 'Pembelian ayam 200kg', jumlah: 7_000_000 },
  { id: 'KK-004', tanggal: '2026-05-28', kategori: 'Honor', deskripsi: 'Honor tenaga masak minggu 4', jumlah: 4_500_000 },
  { id: 'KK-005', tanggal: '2026-05-27', kategori: 'Bahan Baku', deskripsi: 'Pembelian sayur & bumbu', jumlah: 2_800_000 },
  { id: 'KK-006', tanggal: '2026-05-26', kategori: 'Transportasi', deskripsi: 'Sewa kendaraan distribusi', jumlah: 1_200_000 },
  { id: 'KK-007', tanggal: '2026-05-25', kategori: 'Lainnya', deskripsi: 'Peralatan dapur (alat masak)', jumlah: 850_000 },
  { id: 'KK-008', tanggal: '2026-05-24', kategori: 'Honor', deskripsi: 'Honor tenaga masak minggu 3', jumlah: 4_500_000 },
]

const MOCK_DANA_12_HARI: Dana12HariEntry[] = [
  { id: 'D12-001', periode: 'Minggu ke-1', tanggalMulai: '2026-06-01', tanggalAkhir: '2026-06-12', total: 14_400_000, status: 'Diajukan' },
  { id: 'D12-002', periode: 'Minggu ke-2', tanggalMulai: '2026-06-13', tanggalAkhir: '2026-06-24', total: 14_400_000, status: 'Diajukan' },
  { id: 'D12-003', periode: 'Minggu ke-3', tanggalMulai: '2026-05-18', tanggalAkhir: '2026-05-30', total: 14_400_000, status: 'Disetujui' },
  { id: 'D12-004', periode: 'Minggu ke-4', tanggalMulai: '2026-05-05', tanggalAkhir: '2026-05-17', total: 14_400_000, status: 'Disetujui' },
]

// ─── Summary Calculations ─────────────────────────────────────────────────────

const SISA_KAS = 12_450_000
const DANA_MASUK = 35_000_000
const DANA_KELUAR = 28_500_000

// ─── Main Component ───────────────────────────────────────────────────────────

export default function AccountingPage() {
  const [tab, setTab] = useState('kas-masuk')

  // Modal form state
  const [dialogOpen, setDialogOpen] = useState(false)
  const [formJenis, setFormJenis] = useState<'Kas Masuk' | 'Kas Keluar'>('Kas Masuk')
  const [formKategori, setFormKategori] = useState('')
  const [formJumlah, setFormJumlah] = useState('')
  const [formDeskripsi, setFormDeskripsi] = useState('')
  const [newEntries, setNewEntries] = useState<(KasMasukEntry | KasKeluarEntry)[]>([])

  // Dana 12 Hari action state
  const [danaEntries, setDanaEntries] = useState(MOCK_DANA_12_HARI)

  const handleSimpan = () => {
    if (!formKategori || !formJumlah) {
      toast.error('Mohon lengkapi semua field')
      return
    }

    const jumlahNum = Number(formJumlah.replace(/[^0-9]/g, ''))
    if (isNaN(jumlahNum) || jumlahNum <= 0) {
      toast.error('Jumlah tidak valid')
      return
    }

    const now = new Date().toISOString().split('T')[0]
    if (formJenis === 'Kas Masuk') {
      const entry: KasMasukEntry = {
        id: `KM-NEW-${Date.now()}`,
        tanggal: now,
        sumber: formKategori,
        jumlah: jumlahNum,
        status: 'Pending',
      }
      setNewEntries((prev) => [...prev, entry])
    } else {
      const entry: KasKeluarEntry = {
        id: `KK-NEW-${Date.now()}`,
        tanggal: now,
        kategori: formKategori,
        deskripsi: formDeskripsi || '-',
        jumlah: jumlahNum,
      }
      setNewEntries((prev) => [...prev, entry])
    }

    toast.success('Transaksi berhasil disimpan')
    setDialogOpen(false)
    // Reset form
    setFormJenis('Kas Masuk')
    setFormKategori('')
    setFormJumlah('')
    setFormDeskripsi('')
  }

  const handleKonfirmasi = (id: string) => {
    setDanaEntries((prev) =>
      prev.map((d) => (d.id === id ? { ...d, status: 'Disetujui' as const } : d))
    )
    toast.success('Penerimaan dana dikonfirmasi')
  }

  const handleAjukanDana = () => {
    toast.success('Pengajuan dana 12 hari berhasil dikirim')
  }

  const combinedMasuk = [...MOCK_KAS_MASUK, ...newEntries.filter((e) => 'sumber' in e) as KasMasukEntry[]]
  const combinedKeluar = [...MOCK_KAS_KELUAR, ...newEntries.filter((e) => 'deskripsi' in e && !('sumber' in e)) as KasKeluarEntry[]]

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Buku Kas</h1>
          <p className="text-sm text-muted-foreground">
            Pencatatan keuangan dapur
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button>Tambah Transaksi</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[480px]">
              <DialogHeader>
                <DialogTitle>Tambah Transaksi</DialogTitle>
                <DialogDescription>
                  Catat pemasukan atau pengeluaran dapur
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                {/* Jenis */}
                <div className="grid gap-2">
                  <Label htmlFor="form-jenis">Jenis</Label>
                  <select
                    id="form-jenis"
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    value={formJenis}
                    onChange={(e) => {
                      setFormJenis(e.target.value as 'Kas Masuk' | 'Kas Keluar')
                      setFormKategori('')
                    }}
                  >
                    <option>Kas Masuk</option>
                    <option>Kas Keluar</option>
                  </select>
                </div>

                {/* Kategori */}
                <div className="grid gap-2">
                  <Label htmlFor="form-kategori">Kategori</Label>
                  <select
                    id="form-kategori"
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    value={formKategori}
                    onChange={(e) => setFormKategori(e.target.value)}
                  >
                    <option value="">-- Pilih Kategori --</option>
                    {formJenis === 'Kas Masuk' ? (
                      <>
                        <option>BOS</option>
                        <option>Donasi</option>
                        <option>Dana Desa</option>
                        <option>Dana Yayasan</option>
                        <option>Lainnya</option>
                      </>
                    ) : (
                      <>
                        <option>Bahan Baku</option>
                        <option>Transportasi</option>
                        <option>Honor</option>
                        <option>Lainnya</option>
                      </>
                    )}
                  </select>
                </div>

                {/* Jumlah */}
                <div className="grid gap-2">
                  <Label htmlFor="form-jumlah">Jumlah (Rp)</Label>
                  <Input
                    id="form-jumlah"
                    type="number"
                    placeholder="0"
                    value={formJumlah}
                    onChange={(e) => setFormJumlah(e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">
                    {formJumlah ? formatRupiah(Number(formJumlah)) : 'Rp 0'}
                  </p>
                </div>

                {/* Deskripsi */}
                <div className="grid gap-2">
                  <Label htmlFor="form-deskripsi">Deskripsi</Label>
                  <Textarea
                    id="form-deskripsi"
                    placeholder="Isi deskripsi transaksi..."
                    rows={3}
                    value={formDeskripsi}
                    onChange={(e) => setFormDeskripsi(e.target.value)}
                  />
                </div>

                {/* Upload Nota */}
                <div className="grid gap-2">
                  <Label>Upload Nota</Label>
                  <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/30 p-6 text-sm text-muted-foreground">
                    <CameraIcon className="mb-2 size-8 opacity-40" />
                    <span>Ketuk untuk unggah atau foto nota</span>
                    <span className="text-xs">JPG, PNG, atau PDF (maks 5MB)</span>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setDialogOpen(false)}>
                  Batal
                </Button>
                <Button onClick={handleSimpan}>Simpan</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          <Button variant="outline">
            <DownloadIcon className="mr-2 size-4" />
            Export PDF
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="border-primary/30">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <WalletIcon className="size-4 text-primary" />
              Sisa Kas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{formatRupiah(SISA_KAS)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <TrendingUpIcon className="size-4 text-sppg-success" />
              Dana Masuk (Bulan Ini)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-sppg-success">{formatRupiah(DANA_MASUK)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <TrendingDownIcon className="size-4 text-sppg-danger" />
              Dana Keluar (Bulan Ini)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-sppg-danger">{formatRupiah(DANA_KELUAR)}</p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs value={tab} onValueChange={setTab}>
        <TabsList>
          <TabsTrigger value="kas-masuk">Kas Masuk</TabsTrigger>
          <TabsTrigger value="kas-keluar">Kas Keluar</TabsTrigger>
          <TabsTrigger value="dana-12-hari">Dana 12 Hari</TabsTrigger>
        </TabsList>

        {/* Tab: Kas Masuk */}
        <TabsContent value="kas-masuk" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Kas Masuk</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tanggal</TableHead>
                    <TableHead>Sumber</TableHead>
                    <TableHead>Jumlah</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {combinedMasuk.map((entry) => (
                    <TableRow key={entry.id}>
                      <TableCell>{entry.tanggal}</TableCell>
                      <TableCell className="font-medium">{entry.sumber}</TableCell>
                      <TableCell className="text-sppg-success">{formatRupiah(entry.jumlah)}</TableCell>
                      <TableCell>
                        <Badge
                          className={
                            entry.status === 'Terverifikasi'
                              ? 'bg-sppg-success/10 text-sppg-success border-sppg-success/20'
                              : 'bg-sppg-warning/10 text-sppg-warning border-sppg-warning/20'
                          }
                        >
                          {entry.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab: Kas Keluar */}
        <TabsContent value="kas-keluar" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Kas Keluar</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tanggal</TableHead>
                    <TableHead>Kategori</TableHead>
                    <TableHead>Deskripsi</TableHead>
                    <TableHead>Jumlah</TableHead>
                    <TableHead>Nota</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {combinedKeluar.map((entry) => (
                    <TableRow key={entry.id}>
                      <TableCell>{entry.tanggal}</TableCell>
                      <TableCell>{entry.kategori}</TableCell>
                      <TableCell className="max-w-[200px] truncate">{entry.deskripsi}</TableCell>
                      <TableCell className="text-sppg-danger">{formatRupiah(entry.jumlah)}</TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toast.info('Fitur lihat nota belum tersedia')}
                        >
                          Lihat
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab: Dana 12 Hari */}
        <TabsContent value="dana-12-hari" className="mt-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Dana 12 Hari</CardTitle>
              <Button onClick={handleAjukanDana}>Ajukan Dana</Button>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Periode</TableHead>
                    <TableHead>Tanggal Mulai</TableHead>
                    <TableHead>Tanggal Akhir</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {danaEntries.map((entry) => (
                    <TableRow key={entry.id}>
                      <TableCell className="font-medium">{entry.periode}</TableCell>
                      <TableCell>{entry.tanggalMulai}</TableCell>
                      <TableCell>{entry.tanggalAkhir}</TableCell>
                      <TableCell>{formatRupiah(entry.total)}</TableCell>
                      <TableCell>
                        <Badge
                          className={
                            entry.status === 'Disetujui'
                              ? 'bg-sppg-success/10 text-sppg-success border-sppg-success/20'
                              : 'bg-sppg-warning/10 text-sppg-warning border-sppg-warning/20'
                          }
                        >
                          {entry.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {entry.status === 'Disetujui' ? (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleKonfirmasi(entry.id)}
                          >
                            Konfirmasi Penerimaan
                          </Button>
                        ) : (
                          <span className="text-xs text-muted-foreground">Menunggu persetujuan</span>
                        )}
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
