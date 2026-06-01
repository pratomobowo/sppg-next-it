'use client'

import { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { formatRupiah } from '@/lib/utils'
import { toast } from 'sonner'
import {
  ArrowLeftIcon,
  CameraIcon,
  AlertTriangleIcon,
  SaveIcon,
  PlusIcon,
  Trash2Icon
} from 'lucide-react'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'

// ─── Types ────────────────────────────────────────────────────────────────────

type RealisasiItem = {
  item: string
  qty: number
  hargaDO: number
  hargaFinal: number
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

const MOCK_DO_DETAILS: Record<string, { supplier: string; items: RealisasiItem[] }> = {
  'DO-039': {
    supplier: 'PT Pangan Nusantara',
    items: [
      { item: 'Beras', qty: 100, hargaDO: 12000, hargaFinal: 12000 },
      { item: 'Minyak Goreng', qty: 20, hargaDO: 16000, hargaFinal: 16000 },
      { item: 'Gula', qty: 30, hargaDO: 14000, hargaFinal: 14000 }
    ]
  },
  'DO-036': {
    supplier: 'CV Agro Makmur',
    items: [
      { item: 'Telur', qty: 50, hargaDO: 28000, hargaFinal: 28000 },
      { item: 'Ayam', qty: 80, hargaDO: 35000, hargaFinal: 35000 },
      { item: 'Sayur', qty: 100, hargaDO: 8000, hargaFinal: 8000 }
    ]
  }
}

export default function RealisasiDOPage() {
  const params = useParams()
  const router = useRouter()
  const doId = (params.doId as string) || 'DO-039'

  const details = MOCK_DO_DETAILS[doId] ?? {
    supplier: 'PT Sumber Pangan Sejahtera',
    items: [
      { item: 'Beras', qty: 50, hargaDO: 12800, hargaFinal: 12800 },
      { item: 'Telur', qty: 30, hargaDO: 28000, hargaFinal: 28000 },
      { item: 'Ayam', qty: 15, hargaDO: 37500, hargaFinal: 37500 }
    ]
  }

  const [items, setItems] = useState<RealisasiItem[]>(details.items)
  const [fotos, setFotos] = useState<string[]>([])
  const [loading, setLoading] = useState(false)

  // Discrepancy helpers
  const getSubtotalDO = (it: RealisasiItem) => it.qty * it.hargaDO
  const getSubtotalFinal = (it: RealisasiItem) => it.qty * it.hargaFinal
  const getSelisihRow = (it: RealisasiItem) => getSubtotalFinal(it) - getSubtotalDO(it)

  const totalDO = items.reduce((s, it) => s + getSubtotalDO(it), 0)
  const totalFinal = items.reduce((s, it) => s + getSubtotalFinal(it), 0)
  const totalSelisih = totalFinal - totalDO

  // Handlers
  const handleHargaChange = (index: number, val: number) => {
    setItems((prev) =>
      prev.map((it, idx) => (idx === index ? { ...it, hargaFinal: val } : it))
    )
  }

  const handleAddFoto = () => {
    if (fotos.length >= 3) {
      toast.error('Maksimal 3 foto dokumentasi')
      return
    }
    setFotos([...fotos, `/assets/nota_${fotos.length + 1}.jpg`])
    toast.success('Foto berhasil diunggah')
  }

  const handleRemoveFoto = (index: number) => {
    setFotos(fotos.filter((_, idx) => idx !== index))
  }

  const handleSimpanRealisasi = async () => {
    if (fotos.length < 1) {
      toast.error('Unggah minimal 1 foto dokumentasi nota / barang')
      return
    }

    setLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setLoading(false)

    toast.success('Realisasi belanja berhasil disimpan', {
      description: `Status ${doId} telah di-Lock, stok otomatis diupdate.`
    })
    router.push('/procurement/history')
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6 p-4 sm:p-6">
      {/* ─── Back Button & Header ─── */}
      <div className="flex items-center gap-3">
        <Button variant="outline" size="icon" onClick={() => router.back()} type="button">
          <ArrowLeftIcon className="size-4" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Realisasi Belanja</h1>
          <p className="text-muted-foreground">Input harga realisasi dan upload nota untuk {doId}</p>
        </div>
      </div>

      {/* Supplier & Info */}
      <Card>
        <CardContent className="grid gap-4 sm:grid-cols-2 pt-6">
          <div>
            <Label className="text-muted-foreground text-xs uppercase font-semibold">Supplier</Label>
            <p className="font-semibold text-lg">{details.supplier}</p>
          </div>
          <div>
            <Label className="text-muted-foreground text-xs uppercase font-semibold">ID Delivery Order</Label>
            <p className="font-mono font-bold text-lg text-primary">{doId}</p>
          </div>
        </CardContent>
      </Card>

      {/* Item Realization Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Tabel Harga Final</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/40">
                <TableHead>Nama Item</TableHead>
                <TableHead className="text-center">Qty</TableHead>
                <TableHead className="text-right">Harga DO</TableHead>
                <TableHead className="text-center w-36">Harga Final</TableHead>
                <TableHead className="text-right">Subtotal Final</TableHead>
                <TableHead className="text-right">Selisih</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((row, idx) => {
                const selisih = getSelisihRow(row)
                return (
                  <TableRow key={idx}>
                    <TableCell className="font-medium">{row.item}</TableCell>
                    <TableCell className="text-center">{row.qty}</TableCell>
                    <TableCell className="text-right text-muted-foreground">
                      {formatRupiah(row.hargaDO)}
                    </TableCell>
                    <TableCell className="text-center">
                      <Input
                        type="number"
                        min={0}
                        value={row.hargaFinal}
                        onChange={(e) => handleHargaChange(idx, Number(e.target.value))}
                        className="h-8 text-right font-semibold"
                      />
                    </TableCell>
                    <TableCell className="text-right font-semibold">
                      {formatRupiah(getSubtotalFinal(row))}
                    </TableCell>
                    <TableCell className={`text-right font-medium ${selisih > 0 ? 'text-red-600' : selisih < 0 ? 'text-emerald-600' : 'text-muted-foreground'}`}>
                      {selisih > 0 ? `+${formatRupiah(selisih)}` : formatRupiah(selisih)}
                    </TableCell>
                  </TableRow>
                )
              })}
              <TableRow className="bg-muted/10 font-bold border-t-2">
                <TableCell colSpan={2}>Total Belanja</TableCell>
                <TableCell className="text-right text-muted-foreground">{formatRupiah(totalDO)}</TableCell>
                <TableCell />
                <TableCell className="text-right text-primary">{formatRupiah(totalFinal)}</TableCell>
                <TableCell className={`text-right ${totalSelisih > 0 ? 'text-red-600' : totalSelisih < 0 ? 'text-emerald-600' : 'text-muted-foreground'}`}>
                  {totalSelisih > 0 ? `+${formatRupiah(totalSelisih)}` : formatRupiah(totalSelisih)}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Upload Nota & Barang */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center justify-between">
            <span>Foto Dokumentasi Belanja</span>
            <span className="text-xs text-muted-foreground font-normal">Minimal 1, Maksimal 3 foto (Nota + Barang)</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {/* Fotos preview */}
            {fotos.map((foto, idx) => (
              <div key={idx} className="relative aspect-square rounded-lg border bg-muted/20 flex flex-col items-center justify-center">
                <CameraIcon className="size-6 text-primary mb-1" />
                <span className="text-[10px] text-muted-foreground font-medium">Foto #{idx+1}</span>
                <Button
                  variant="destructive"
                  size="icon"
                  className="absolute -top-2 -right-2 size-6 rounded-full"
                  onClick={() => handleRemoveFoto(idx)}
                >
                  <Trash2Icon className="size-3" />
                </Button>
              </div>
            ))}

            {/* Add Foto trigger */}
            {fotos.length < 3 && (
              <div
                onClick={handleAddFoto}
                className="aspect-square rounded-lg border-2 border-dashed border-muted-foreground/30 text-muted-foreground hover:border-muted-foreground/50 hover:bg-muted/10 transition-colors cursor-pointer flex flex-col items-center justify-center gap-1.5"
              >
                <PlusIcon className="size-6 text-muted-foreground" />
                <span className="text-xs font-medium">Tambah Foto</span>
              </div>
            )}
          </div>

          <div className="flex items-start gap-2 text-xs text-muted-foreground bg-muted/20 rounded-lg p-3">
            <AlertTriangleIcon className="size-4 shrink-0 text-amber-500 mt-0.5" />
            <div>
              <p className="font-semibold text-muted-foreground">Panduan Unggah:</p>
              <p>Pastikan foto nota asli terlihat jelas beserta barang fisik yang diterima untuk diverifikasi oleh auditor.</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Footer */}
      <div className="flex justify-end gap-3 border-t pt-4">
        <Button variant="outline" size="lg" onClick={() => router.back()} disabled={loading}>
          Batal
        </Button>
        <Button
          size="lg"
          onClick={handleSimpanRealisasi}
          disabled={loading || fotos.length === 0}
          className="bg-primary hover:bg-primary/90 text-primary-foreground"
        >
          <SaveIcon className="size-4 mr-2" />
          {loading ? 'Menyimpan...' : 'Kunci & Selesaikan'}
        </Button>
      </div>
    </div>
  )
}
