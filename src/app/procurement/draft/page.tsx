'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { formatRupiah } from '@/lib/utils'

import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

import {
  Check,
  ChevronLeft,
  ChevronRight,
  Plus,
  Trash2,
  AlertTriangle,
  ShoppingCart,
  User,
  Phone,
  MapPin,
  Send,
} from 'lucide-react'

// ─── Mock Data ───────────────────────────────────────────────

const suppliers = [
  { id: 'sup-1', nama: 'PT Sumber Pangan Sejahtera', kontak: '0812-3456-7890', alamat: 'Jl. Raya Bogor KM 30, Jakarta Timur' },
  { id: 'sup-2', nama: 'UD Berkah Tani', kontak: '0856-7890-1234', alamat: 'Jl. Ciawi No. 45, Bogor' },
  { id: 'sup-3', nama: 'CV Agro Makmur', kontak: '0813-9876-5432', alamat: 'Jl. Padjajaran No. 12, Bogor' },
  { id: 'sup-4', nama: 'PT Pangan Nusantara', kontak: '0878-1111-2222', alamat: 'Jl. Raya Puncak KM 15, Cisarua' },
]

const items = [
  'Beras', 'Minyak Goreng', 'Telur', 'Ayam', 'Sayur',
  'Tahu', 'Tempe', 'Ikan', 'Gula', 'Garam',
]

const hargaAcuan: Record<string, number> = {
  Beras: 12000,
  'Minyak Goreng': 16000,
  Telur: 28000,
  Ayam: 35000,
  Sayur: 8000,
  Tahu: 5000,
  Tempe: 6000,
  Ikan: 30000,
  Gula: 14000,
  Garam: 4000,
}

type ItemRow = {
  id: number
  item: string
  qty: number
  harga: number
}

// ─── Component ───────────────────────────────────────────────

const STEPS = ['Pilih Supplier', 'Input Item', 'Review']

export default function DraftDOPage() {
  const [step, setStep] = useState(0)
  const [selectedSupplier, setSelectedSupplier] = useState<string>('')
  const [rows, setRows] = useState<ItemRow[]>([
    { id: 1, item: '', qty: 0, harga: 0 },
  ])
  const [catatan, setCatatan] = useState('')

  const supplier = suppliers.find((s) => s.nama === selectedSupplier)

  // ── Row helpers ──

  const updateRow = (id: number, field: keyof ItemRow, value: string | number) => {
    setRows((prev) =>
      prev.map((r) => (r.id === id ? { ...r, [field]: value } : r))
    )
  }

  const addRow = () => {
    const maxId = rows.reduce((m, r) => Math.max(m, r.id), 0)
    setRows((prev) => [...prev, { id: maxId + 1, item: '', qty: 0, harga: 0 }])
  }

  const removeRow = (id: number) => {
    if (rows.length <= 1) return
    setRows((prev) => prev.filter((r) => r.id !== id))
  }

  const subtotal = (r: ItemRow) => r.qty * r.harga
  const totalBelanja = rows.reduce((sum, r) => sum + subtotal(r), 0)

  const priceFlag = (itemName: string, harga: number): { flagged: boolean; diffPct: number; acuan: number } => {
    const acuan = hargaAcuan[itemName]
    if (!acuan || harga <= 0) return { flagged: false, diffPct: 0, acuan: 0 }
    const diffPct = ((harga - acuan) / acuan) * 100
    return { flagged: diffPct > 5, diffPct, acuan }
  }

  // ── Navigation ──

  const canNextStep1 = !!selectedSupplier
  const canNextStep2 = rows.length > 0 && rows.every((r) => r.item && r.qty > 0 && r.harga > 0)

  const handleSubmit = () => {
    toast.success('DO berhasil dikirim', {
      description: `DO ke ${selectedSupplier} telah dikirim ke SPPG untuk persetujuan.`,
    })
    // Reset
    setStep(0)
    setSelectedSupplier('')
    setRows([{ id: 1, item: '', qty: 0, harga: 0 }])
    setCatatan('')
  }

  return (
    <div className="space-y-6 p-6">
      {/* ── Step Indicator ── */}
      <div className="flex items-center justify-center gap-1">
        {STEPS.map((label, idx) => {
          const isCompleted = idx < step
          const isCurrent = idx === step
          return (
            <div key={label} className="flex items-center gap-1">
              <div
                className={`flex h-9 w-9 items-center justify-center rounded-full text-sm font-semibold transition
                  ${isCompleted ? 'bg-primary text-primary-foreground' : ''}
                  ${isCurrent ? 'bg-primary text-primary-foreground ring-2 ring-primary/30' : ''}
                  ${!isCompleted && !isCurrent ? 'bg-muted text-muted-foreground' : ''}
                `}
              >
                {isCompleted ? <Check className="h-4 w-4" /> : idx + 1}
              </div>
              <span
                className={`hidden text-sm font-medium sm:inline
                  ${isCurrent ? 'text-primary' : ''}
                  ${isCompleted ? 'text-foreground' : 'text-muted-foreground'}
                `}
              >
                {label}
              </span>
              {idx < STEPS.length - 1 && (
                <div
                  className={`mx-2 hidden h-0.5 w-8 rounded sm:block
                    ${idx < step ? 'bg-primary' : 'bg-muted'}
                  `}
                />
              )}
            </div>
          )
        })}
      </div>

      {/* ── Step 1: Pilih Supplier ── */}
      {step === 0 && (
        <Card>
          <CardContent className="space-y-4 pt-6">
            <h2 className="text-lg font-semibold">Pilih Supplier</h2>

            <Select value={selectedSupplier} onValueChange={setSelectedSupplier}>
              <SelectTrigger>
                <SelectValue placeholder="-- Pilih Supplier --" />
              </SelectTrigger>
              <SelectContent>
                {suppliers.map((s) => (
                  <SelectItem key={s.id} value={s.nama}>
                    {s.nama}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Supplier info card */}
            {supplier && (
              <Card className="border border-primary/30 bg-primary/5">
                <CardContent className="space-y-2 pt-4">
                  <div className="flex items-center gap-2 text-sm">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">{supplier.nama}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span>{supplier.kontak}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span>{supplier.alamat}</span>
                  </div>
                </CardContent>
              </Card>
            )}

            <div className="flex justify-end">
              <Button onClick={() => setStep(1)} disabled={!canNextStep1}>
                Lanjutkan
                <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* ── Step 2: Input Item Belanja ── */}
      {step === 1 && (
        <Card>
          <CardContent className="space-y-4 pt-6">
            <h2 className="text-lg font-semibold">Input Item Belanja</h2>

            <div className="space-y-3">
              {rows.map((row) => {
                const flag = priceFlag(row.item, row.harga)
                return (
                  <div
                    key={row.id}
                    className={`grid grid-cols-12 items-end gap-2 rounded-lg border p-3
                      ${flag.flagged ? 'border-red-300 bg-red-50' : 'border-border'}
                    `}
                  >
                    {/* Item */}
                    <div className="col-span-5 sm:col-span-4">
                      <Label className="text-xs">Item</Label>
                      <Select
                        value={row.item}
                        onValueChange={(v) => updateRow(row.id, 'item', v)}
                      >
                        <SelectTrigger className="h-9">
                          <SelectValue placeholder="Pilih item" />
                        </SelectTrigger>
                        <SelectContent>
                          {items.map((it) => (
                            <SelectItem key={it} value={it}>
                              {it}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Qty */}
                    <div className="col-span-2">
                      <Label className="text-xs">Qty</Label>
                      <Input
                        type="number"
                        min={0}
                        className="h-9"
                        value={row.qty || ''}
                        onChange={(e) =>
                          updateRow(row.id, 'qty', Number(e.target.value))
                        }
                      />
                    </div>

                    {/* Harga Satuan */}
                    <div className="col-span-3 sm:col-span-3">
                      <Label className="text-xs">Harga Satuan</Label>
                      <Input
                        type="number"
                        min={0}
                        className="h-9"
                        value={row.harga || ''}
                        onChange={(e) =>
                          updateRow(row.id, 'harga', Number(e.target.value))
                        }
                      />
                    </div>

                    {/* Subtotal + Flag */}
                    <div className="col-span-1 flex items-end justify-end gap-1 sm:col-span-2">
                      <div className="text-right">
                        <span className="text-xs text-muted-foreground">Subtotal</span>
                        <p className="text-sm font-semibold">
                          {formatRupiah(subtotal(row))}
                        </p>
                      </div>
                      {flag.flagged && (
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <AlertTriangle className="h-4 w-4 cursor-help text-red-500" />
                          </TooltipTrigger>
                          <TooltipContent>
                            Harga melebihi 5% dari harga acuan ({formatRupiah(flag.acuan)})
                          </TooltipContent>
                        </Tooltip>
                      )}
                    </div>

                    {/* Delete */}
                    <div className="col-span-1 flex justify-end">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:text-red-500"
                        onClick={() => removeRow(row.id)}
                        disabled={rows.length <= 1}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )
              })}
            </div>

            <Button variant="outline" size="sm" onClick={addRow}>
              <Plus className="mr-1 h-4 w-4" />
              Tambah Item
            </Button>

            {/* Total */}
            <div className="rounded-lg border bg-muted/30 p-3 text-right">
              <span className="text-sm text-muted-foreground">Total Belanja</span>
              <p className="text-xl font-bold text-primary">{formatRupiah(totalBelanja)}</p>
            </div>

            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setStep(0)}>
                <ChevronLeft className="mr-1 h-4 w-4" />
                Kembali
              </Button>
              <Button onClick={() => setStep(2)} disabled={!canNextStep2}>
                Lanjutkan
                <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* ── Step 3: Review & Kirim ── */}
      {step === 2 && (
        <Card>
          <CardContent className="space-y-4 pt-6">
            <h2 className="text-lg font-semibold">Review & Kirim</h2>

            {/* Summary */}
            <div className="space-y-3 rounded-lg border p-4">
              <div className="flex items-center gap-2">
                <ShoppingCart className="h-5 w-5 text-muted-foreground" />
                <span className="text-sm font-medium">Ringkasan Pesanan</span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-sm">
                <span className="text-muted-foreground">Supplier</span>
                <span className="font-medium">{supplier?.nama}</span>

                <span className="text-muted-foreground">Total Item</span>
                <span className="font-medium">{rows.length} jenis</span>

                <span className="text-muted-foreground">Total Harga</span>
                <span className="text-lg font-bold text-primary">{formatRupiah(totalBelanja)}</span>
              </div>

              {/* Item list */}
              <div className="space-y-1.5 border-t pt-3">
                <span className="text-xs font-medium text-muted-foreground">Daftar Item</span>
                {rows.map((row) => {
                  const flag = priceFlag(row.item, row.harga)
                  return (
                    <div key={row.id} className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-1.5">
                        <span>{row.item}</span>
                        <span className="text-muted-foreground">x{row.qty}</span>
                        {flag.flagged && (
                          <Badge variant="destructive" className="h-4 px-1 text-[10px]">
                            +{flag.diffPct.toFixed(0)}%
                          </Badge>
                        )}
                      </div>
                      <span className="font-medium">{formatRupiah(subtotal(row))}</span>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Catatan */}
            <div>
              <Label>Catatan (opsional)</Label>
              <Textarea
                placeholder="Tambahkan catatan untuk SPPG..."
                value={catatan}
                onChange={(e) => setCatatan(e.target.value)}
                rows={3}
              />
            </div>

            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setStep(1)}>
                <ChevronLeft className="mr-1 h-4 w-4" />
                Kembali
              </Button>
              <Button size="lg" onClick={handleSubmit}>
                <Send className="mr-2 h-4 w-4" />
                Kirim ke SPPG
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
