'use client'

import { useState } from 'react'
import { AlertTriangleIcon, CheckIcon, ChevronDownIcon } from 'lucide-react'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { toast } from 'sonner'

// ─── Mock Data ────────────────────────────────────────────────────────────────

type InventoryItem = {
  id: string
  nama: string
  kategori: string
  stokAwal: number
  masuk: number
  keluar: number
  stokAkhir: number
  status: 'Normal' | 'Rendah' | 'Kritis'
  satuan: string
}

type TransactionLog = {
  tanggal: string
  tipe: 'Masuk' | 'Keluar'
  jumlah: number
  referensi: string
  stokSetelah: number
}

const MOCK_INVENTORY: InventoryItem[] = [
  { id: 'INV-001', nama: 'Beras', kategori: 'Bahan Pokok', stokAwal: 0, masuk: 500, keluar: 480, stokAkhir: 20, status: 'Kritis', satuan: 'kg' },
  { id: 'INV-002', nama: 'Minyak Goreng', kategori: 'Bahan Pokok', stokAwal: 0, masuk: 100, keluar: 85, stokAkhir: 15, status: 'Rendah', satuan: 'liter' },
  { id: 'INV-003', nama: 'Telur', kategori: 'Protein', stokAwal: 0, masuk: 600, keluar: 550, stokAkhir: 50, status: 'Normal', satuan: 'butir' },
  { id: 'INV-004', nama: 'Ayam', kategori: 'Protein', stokAwal: 0, masuk: 200, keluar: 190, stokAkhir: 10, status: 'Rendah', satuan: 'kg' },
  { id: 'INV-005', nama: 'Sayur', kategori: 'Sayuran', stokAwal: 0, masuk: 300, keluar: 280, stokAkhir: 20, status: 'Normal', satuan: 'kg' },
  { id: 'INV-006', nama: 'Tahu', kategori: 'Protein', stokAwal: 0, masuk: 400, keluar: 380, stokAkhir: 20, status: 'Normal', satuan: 'pcs' },
  { id: 'INV-007', nama: 'Tempe', kategori: 'Protein', stokAwal: 0, masuk: 350, keluar: 340, stokAkhir: 10, status: 'Rendah', satuan: 'pcs' },
  { id: 'INV-008', nama: 'Ikan', kategori: 'Protein', stokAwal: 0, masuk: 150, keluar: 145, stokAkhir: 5, status: 'Kritis', satuan: 'kg' },
  { id: 'INV-009', nama: 'Gula', kategori: 'Bahan Pokok', stokAwal: 0, masuk: 80, keluar: 70, stokAkhir: 10, status: 'Rendah', satuan: 'kg' },
  { id: 'INV-010', nama: 'Garam', kategori: 'Bumbu', stokAwal: 0, masuk: 50, keluar: 30, stokAkhir: 20, status: 'Normal', satuan: 'kg' },
]

const MOCK_TRANSACTION_LOGS: Record<string, TransactionLog[]> = {
  'INV-001': [
    { tanggal: '2026-05-31', tipe: 'Keluar', jumlah: 80, referensi: 'DO #042', stokSetelah: 20 },
    { tanggal: '2026-05-30', tipe: 'Keluar', jumlah: 100, referensi: 'DO #041', stokSetelah: 100 },
    { tanggal: '2026-05-29', tipe: 'Masuk', jumlah: 200, referensi: 'DO #040', stokSetelah: 200 },
    { tanggal: '2026-05-28', tipe: 'Keluar', jumlah: 150, referensi: 'DO #039', stokSetelah: 350 },
    { tanggal: '2026-05-27', tipe: 'Masuk', jumlah: 300, referensi: 'DO #038', stokSetelah: 500 },
  ],
  'INV-002': [
    { tanggal: '2026-05-30', tipe: 'Keluar', jumlah: 20, referensi: 'DO #041', stokSetelah: 15 },
    { tanggal: '2026-05-28', tipe: 'Masuk', jumlah: 50, referensi: 'DO #039', stokSetelah: 35 },
    { tanggal: '2026-05-27', tipe: 'Keluar', jumlah: 30, referensi: 'DO #038', stokSetelah: 5 },
    { tanggal: '2026-05-26', tipe: 'Masuk', jumlah: 50, referensi: 'DO #037', stokSetelah: 35 },
    { tanggal: '2026-05-25', tipe: 'Keluar', jumlah: 35, referensi: 'DO #036', stokSetelah: 10 },
  ],
}

function getDefaultLogs(item: InventoryItem): TransactionLog[] {
  return MOCK_TRANSACTION_LOGS[item.id] ?? [
    { tanggal: '2026-05-31', tipe: 'Keluar', jumlah: item.keluar, referensi: 'DO #042', stokSetelah: item.stokAkhir },
    { tanggal: '2026-05-30', tipe: 'Masuk', jumlah: item.masuk, referensi: 'DO #041', stokSetelah: item.stokAkhir + item.keluar },
    { tanggal: '2026-05-29', tipe: 'Keluar', jumlah: item.keluar, referensi: 'DO #040', stokSetelah: item.stokAkhir + item.keluar },
    { tanggal: '2026-05-28', tipe: 'Masuk', jumlah: item.masuk, referensi: 'DO #039', stokSetelah: item.stokAwal + item.masuk },
    { tanggal: '2026-05-27', tipe: 'Keluar', jumlah: item.keluar, referensi: 'DO #038', stokSetelah: item.stokAwal + item.masuk },
  ]
}

// ─── Status helpers ───────────────────────────────────────────────────────────

function statusBadge(status: InventoryItem['status']) {
  switch (status) {
    case 'Normal':
      return <Badge className="bg-sppg-success/10 text-sppg-success border-sppg-success/20">Normal</Badge>
    case 'Rendah':
      return <Badge className="bg-sppg-warning/10 text-sppg-warning border-sppg-warning/20">Rendah</Badge>
    case 'Kritis':
      return (
        <Badge className="bg-sppg-danger/10 text-sppg-danger border-sppg-danger/20">
          <AlertTriangleIcon className="mr-1 size-3" />
          Kritis
        </Badge>
      )
  }
}

function statusColor(status: InventoryItem['status']) {
  switch (status) {
    case 'Normal': return 'bg-sppg-success'
    case 'Rendah': return 'bg-sppg-warning'
    case 'Kritis': return 'bg-sppg-danger'
  }
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function InventoryPage() {
  const [kategoriFilter, setKategoriFilter] = useState('Semua')
  const [statusFilter, setStatusFilter] = useState('Semua')
  const [expanded, setExpanded] = useState<string | null>(null)

  // Stock Opname state
  const [opnameData, setOpnameData] = useState<Record<string, number>>({})
  const initialOpname = Object.fromEntries(
    MOCK_INVENTORY.map((item) => [item.id, item.stokAkhir])
  )
  const [fisikValues, setFisikValues] = useState<Record<string, number>>(initialOpname)

  const filtered = MOCK_INVENTORY.filter((item) => {
    if (kategoriFilter !== 'Semua' && item.kategori !== kategoriFilter) return false
    if (statusFilter !== 'Semua' && item.status !== statusFilter) return false
    return true
  })

  const handleSaveOpname = () => {
    toast.success('Stock opname berhasil disimpan')
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Inventory</h1>
        <p className="text-sm text-muted-foreground">
          Manajemen stok bahan baku dapur
        </p>
      </div>

      {/* Filter Bar */}
      <Card>
        <CardContent className="flex flex-wrap items-end gap-4 pt-6">
          <div className="min-w-[180px]">
            <label className="mb-1 block text-xs font-medium text-muted-foreground">
              Kategori
            </label>
            <select
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              value={kategoriFilter}
              onChange={(e) => setKategoriFilter(e.target.value)}
            >
              <option>Semua</option>
              <option>Bahan Pokok</option>
              <option>Protein</option>
              <option>Sayuran</option>
              <option>Bumbu</option>
            </select>
          </div>
          <div className="min-w-[180px]">
            <label className="mb-1 block text-xs font-medium text-muted-foreground">
              Status
            </label>
            <select
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option>Semua</option>
              <option>Normal</option>
              <option>Rendah</option>
              <option>Kritis</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Inventory Table */}
      <Card>
        <CardHeader>
          <CardTitle>Ledger Stok</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nama Item</TableHead>
                <TableHead>Kategori</TableHead>
                <TableHead>Stok Awal</TableHead>
                <TableHead>Masuk</TableHead>
                <TableHead>Keluar</TableHead>
                <TableHead>Stok Akhir</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((item) => {
                const isOpen = expanded === item.id
                const logs = getDefaultLogs(item)
                return (
                  <Collapsible
                    key={item.id}
                    open={isOpen}
                    onOpenChange={(open) => setExpanded(open ? item.id : null)}
                    asChild
                  >
                    <>
                      <TableRow
                        className="cursor-pointer hover:bg-muted/50"
                        onClick={() => setExpanded(isOpen ? null : item.id)}
                      >
                        <TableCell className="font-medium">{item.nama}</TableCell>
                        <TableCell>{item.kategori}</TableCell>
                        <TableCell>{item.stokAwal} {item.satuan}</TableCell>
                        <TableCell className="text-sppg-success">{item.masuk} {item.satuan}</TableCell>
                        <TableCell className="text-sppg-danger">{item.keluar} {item.satuan}</TableCell>
                        <TableCell className="font-semibold">
                          <span className="inline-flex items-center gap-1.5">
                            <span className={`inline-block size-2 rounded-full ${statusColor(item.status)}`} />
                            {item.stokAkhir} {item.satuan}
                          </span>
                        </TableCell>
                        <TableCell>{statusBadge(item.status)}</TableCell>
                        <TableCell>
                          <CollapsibleTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <ChevronDownIcon
                                className={`size-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                              />
                              <span className="sr-only">Toggle detail</span>
                            </Button>
                          </CollapsibleTrigger>
                        </TableCell>
                      </TableRow>
                      <CollapsibleContent asChild>
                        <TableRow key={`${item.id}-detail`} className="bg-muted/30">
                          <TableCell colSpan={8} className="p-0">
                            <div className="px-4 py-3">
                              <h4 className="mb-2 text-sm font-semibold">
                                Log Transaksi — {item.nama}
                              </h4>
                              <Table>
                                <TableHeader>
                                  <TableRow>
                                    <TableHead>Tanggal</TableHead>
                                    <TableHead>Tipe</TableHead>
                                    <TableHead>Jumlah</TableHead>
                                    <TableHead>Referensi</TableHead>
                                    <TableHead>Stok Setelah</TableHead>
                                  </TableRow>
                                </TableHeader>
                                <TableBody>
                                  {logs.map((log, i) => (
                                    <TableRow key={i}>
                                      <TableCell>{log.tanggal}</TableCell>
                                      <TableCell>
                                        <Badge
                                          variant="outline"
                                          className={
                                            log.tipe === 'Masuk'
                                              ? 'text-sppg-success border-sppg-success/30'
                                              : 'text-sppg-danger border-sppg-danger/30'
                                          }
                                        >
                                          {log.tipe}
                                        </Badge>
                                      </TableCell>
                                      <TableCell>{log.jumlah} {item.satuan}</TableCell>
                                      <TableCell className="text-muted-foreground">{log.referensi}</TableCell>
                                      <TableCell>{log.stokSetelah} {item.satuan}</TableCell>
                                    </TableRow>
                                  ))}
                                </TableBody>
                              </Table>
                            </div>
                          </TableCell>
                        </TableRow>
                      </CollapsibleContent>
                    </>
                  </Collapsible>
                )
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Stock Opname */}
      <Card>
        <CardHeader>
          <CardTitle>Stock Opname</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nama Item</TableHead>
                <TableHead>Stok Sistem</TableHead>
                <TableHead>Stok Fisik</TableHead>
                <TableHead>Selisih</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {MOCK_INVENTORY.map((item) => {
                const fisik = fisikValues[item.id] ?? item.stokAkhir
                const selisih = fisik - item.stokAkhir
                return (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.nama}</TableCell>
                    <TableCell>{item.stokAkhir} {item.satuan}</TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        className="w-24"
                        value={fisik}
                        onChange={(e) =>
                          setFisikValues((prev) => ({
                            ...prev,
                            [item.id]: Number(e.target.value),
                          }))
                        }
                      />
                    </TableCell>
                    <TableCell>
                      <span className={selisih === 0 ? 'text-sppg-success' : 'text-sppg-danger'}>
                        {selisih > 0 ? '+' : ''}{selisih} {item.satuan}
                      </span>
                    </TableCell>
                    <TableCell>
                      {selisih === 0 ? (
                        <Badge className="bg-sppg-success/10 text-sppg-success border-sppg-success/20">
                          <CheckIcon className="mr-1 size-3" />
                          Cocok
                        </Badge>
                      ) : (
                        <Badge className="bg-sppg-danger/10 text-sppg-danger border-sppg-danger/20">
                          <AlertTriangleIcon className="mr-1 size-3" />
                          Selisih
                        </Badge>
                      )}
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
          <div className="mt-4 flex justify-end">
            <Button onClick={handleSaveOpname}>Simpan Opname</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
