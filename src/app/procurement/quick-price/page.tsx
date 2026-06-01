'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { formatRupiah } from '@/lib/utils'
import { toast } from 'sonner'
import {
  ArrowLeftIcon,
  SaveIcon,
  SearchIcon,
  TrendingUpIcon,
  CalendarIcon,
  Building2Icon,
  InfoIcon
} from 'lucide-react'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'

// ─── Types ────────────────────────────────────────────────────────────────────

type LocalPrice = {
  id: string
  item: string
  kategori: string
  supplier: string
  hargaTerakhir: number
  hargaBaru: number
  tanggalUpdate: string
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

const MOCK_LOCAL_PRICES: LocalPrice[] = [
  { id: 'LP-001', item: 'Beras Putih (kg)', kategori: 'Bahan Pokok', supplier: 'PT Sumber Pangan Sejahtera', hargaTerakhir: 12500, hargaBaru: 12500, tanggalUpdate: '2026-05-30' },
  { id: 'LP-002', item: 'Daging Ayam (kg)', kategori: 'Protein', supplier: 'CV Ayam Segar Nusantara', hargaTerakhir: 38000, hargaBaru: 38000, tanggalUpdate: '2026-05-28' },
  { id: 'LP-003', item: 'Telur Ayam (kg)', kategori: 'Protein', supplier: 'CV Ayam Segar Nusantara', hargaTerakhir: 28000, hargaBaru: 28000, tanggalUpdate: '2026-05-28' },
  { id: 'LP-004', item: 'Minyak Goreng (L)', kategori: 'Bahan Pokok', supplier: 'PT Sumber Pangan Sejahtera', hargaTerakhir: 17000, hargaBaru: 17000, tanggalUpdate: '2026-05-30' },
  { id: 'LP-005', item: 'Sayur Sop (ikat)', kategori: 'Sayuran', supplier: 'UD Buah Segar Bandung', hargaTerakhir: 3000, hargaBaru: 3000, tanggalUpdate: '2026-05-25' },
  { id: 'LP-006', item: 'Tempe Kedelai (pcs)', kategori: 'Protein', supplier: 'PT Tahu Tempe Jaya', hargaTerakhir: 4000, hargaBaru: 4000, tanggalUpdate: '2026-05-29' },
  { id: 'LP-007', item: 'Tahu Putih (pcs)', kategori: 'Protein', supplier: 'PT Tahu Tempe Jaya', hargaTerakhir: 1000, hargaBaru: 1000, tanggalUpdate: '2026-05-29' }
]

const SUPPLIER_OPTIONS = [
  'Semua Supplier',
  'PT Sumber Pangan Sejahtera',
  'CV Ayam Segar Nusantara',
  'UD Buah Segar Bandung',
  'PT Tahu Tempe Jaya'
]

export default function QuickPricePage() {
  const router = useRouter()
  const [prices, setPrices] = useState<LocalPrice[]>(MOCK_LOCAL_PRICES)
  const [search, setSearch] = useState('')
  const [selectedSupplier, setSelectedSupplier] = useState('Semua Supplier')
  const [loading, setLoading] = useState(false)

  // Filters
  const filteredPrices = prices.filter((p) => {
    const matchSearch = p.item.toLowerCase().includes(search.toLowerCase())
    const matchSupplier = selectedSupplier === 'Semua Supplier' || p.supplier === selectedSupplier
    return matchSearch && matchSupplier
  })

  // Handlers
  const handlePriceChange = (id: string, value: number) => {
    setPrices((prev) =>
      prev.map((p) => (p.id === id ? { ...p, hargaBaru: value } : p))
    )
  }

  const handleSaveAll = async () => {
    setLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 800))
    setLoading(false)

    const updated = prices.map((p) => {
      if (p.hargaBaru !== p.hargaTerakhir) {
        return {
          ...p,
          hargaTerakhir: p.hargaBaru,
          tanggalUpdate: new Date().toISOString().split('T')[0]
        }
      }
      return p
    })
    setPrices(updated)
    toast.success('Harga referensi lokal berhasil diperbarui')
  }

  return (
    <div className="mx-auto max-w-5xl space-y-6 p-4 sm:p-6">
      {/* ─── Back Button & Header ─── */}
      <div className="flex items-center gap-3">
        <Button variant="outline" size="icon" onClick={() => router.back()} type="button">
          <ArrowLeftIcon className="size-4" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Quick Price Update</h1>
          <p className="text-muted-foreground">Perbarui referensi harga barang supplier lokal dapur Anda</p>
        </div>
      </div>

      {/* Info Warning */}
      <div className="flex items-start gap-2 text-xs text-muted-foreground bg-blue-50 dark:bg-blue-950/30 rounded-lg p-3 border border-blue-100 dark:border-blue-900/50">
        <InfoIcon className="size-4 shrink-0 text-blue-500 mt-0.5" />
        <div>
          <p className="font-semibold text-blue-800 dark:text-blue-300">Catatan Referensi Dapur Pribadi:</p>
          <p className="text-blue-700 dark:text-blue-400">Harga di sini hanya berfungsi sebagai referensi pembantu saat Anda membuat draf Surat Pesanan (DO) agar perhitungan estimasi belanja akurat. Ini <strong>tidak mengubah</strong> harga acuan resmi yang dikelola oleh Admin Yayasan / Super Admin.</p>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="flex flex-wrap items-end gap-3 pt-6">
          <div className="relative min-w-[200px] flex-1">
            <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Cari nama item..."
              className="pl-8"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="w-64">
            <Select value={selectedSupplier} onValueChange={setSelectedSupplier}>
              <SelectTrigger>
                <Building2Icon className="mr-1.5 h-3.5 w-3.5 text-muted-foreground" />
                <SelectValue placeholder="Pilih Supplier" />
              </SelectTrigger>
              <SelectContent>
                {SUPPLIER_OPTIONS.map((s) => (
                  <SelectItem key={s} value={s}>
                    {s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Main Prices Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <TrendingUpIcon className="size-4 text-primary" />
            Harga Referensi Lokal
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/40">
                <TableHead>Nama Item</TableHead>
                <TableHead>Kategori</TableHead>
                <TableHead>Supplier</TableHead>
                <TableHead className="text-right">Harga Terakhir</TableHead>
                <TableHead className="text-center w-40">Harga Baru (Rp)</TableHead>
                <TableHead className="text-center">Terakhir Diupdate</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPrices.map((row) => (
                <TableRow key={row.id}>
                  <TableCell className="font-medium">{row.item}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="text-[10px]">
                      {row.kategori}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground text-xs">{row.supplier}</TableCell>
                  <TableCell className="text-right font-medium">
                    {formatRupiah(row.hargaTerakhir)}
                  </TableCell>
                  <TableCell className="text-center">
                    <Input
                      type="number"
                      min={0}
                      value={row.hargaBaru}
                      onChange={(e) => handlePriceChange(row.id, Number(e.target.value))}
                      className="h-8 text-right font-semibold"
                    />
                  </TableCell>
                  <TableCell className="text-center text-xs text-muted-foreground font-mono">
                    <span className="inline-flex items-center gap-1">
                      <CalendarIcon className="size-3" />
                      {row.tanggalUpdate}
                    </span>
                  </TableCell>
                </TableRow>
              ))}
              {filteredPrices.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-6 text-muted-foreground text-sm">
                    Tidak ada item ditemukan.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Action Footer */}
      <div className="flex justify-end gap-3 border-t pt-4">
        <Button variant="outline" size="lg" onClick={() => router.back()} disabled={loading}>
          Batal
        </Button>
        <Button
          size="lg"
          onClick={handleSaveAll}
          disabled={loading}
          className="bg-primary hover:bg-primary/90 text-primary-foreground"
        >
          <SaveIcon className="size-4 mr-2" />
          {loading ? 'Menyimpan...' : 'Simpan Semua Perubahan'}
        </Button>
      </div>
    </div>
  )
}
