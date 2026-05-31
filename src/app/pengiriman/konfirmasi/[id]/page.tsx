'use client'

import { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { toast } from 'sonner'
import {
  ArrowLeftIcon,
  CameraIcon,
  PenLineIcon,
  CheckCircleIcon,
} from 'lucide-react'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

// ─── Mock Data ────────────────────────────────────────────────────────────────

const MOCK_DAPUR = {
  id: 'dpr-001',
  nama: 'Dapur SPPG Cipete',
  porsiDikirim: 300,
  sekolah: 'SDN Cipete 01',
  driver: 'Budi Santoso',
  waktuBerangkat: '06:30',
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function KonfirmasiSekolahPage() {
  const params = useParams()
  const router = useRouter()
  const pengirimanId = params.id as string

  const [porsiDiterima, setPorsiDiterima] = useState<number>(0)

  const handleKonfirmasi = () => {
    if (porsiDiterima <= 0) {
      toast.error('Isi jumlah porsi diterima')
      return
    }
    toast.success('Penerimaan berhasil dikonfirmasi', {
      description: `${porsiDiterima} porsi diterima dari ${MOCK_DAPUR.nama}`,
    })
  }

  return (
    <div className="mx-auto max-w-md space-y-6 p-4">
      {/* ─── Back Button ─── */}
      <Button
        variant="ghost"
        size="sm"
        className="-ml-3"
        onClick={() => router.back()}
        type="button"
      >
        <ArrowLeftIcon className="size-4" />
        Kembali
      </Button>

      {/* ─── Header ─── */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Konfirmasi Penerimaan</h1>
        <p className="text-muted-foreground">
          ID Pengiriman: #{pengirimanId}
        </p>
      </div>

      {/* ─── Info Dapur ─── */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Info Pengiriman</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">Dapur</span>
            <span className="text-sm font-medium">{MOCK_DAPUR.nama}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">Sekolah Tujuan</span>
            <span className="text-sm font-medium">{MOCK_DAPUR.sekolah}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">Driver</span>
            <span className="text-sm font-medium">{MOCK_DAPUR.driver}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">Waktu Berangkat</span>
            <span className="text-sm font-medium">{MOCK_DAPUR.waktuBerangkat}</span>
          </div>
          <div className="flex justify-between border-t pt-3">
            <span className="text-sm font-semibold">Porsi Dikirim</span>
            <span className="text-lg font-bold">{MOCK_DAPUR.porsiDikirim}</span>
          </div>
        </CardContent>
      </Card>

      {/* ─── Upload Foto Serah Terima ─── */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Foto Serah Terima</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-3">
            {Array.from({ length: 2 }).map((_, i) => (
              <div
                key={i}
                className="flex aspect-square flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-muted-foreground/30 text-muted-foreground transition-colors hover:border-muted-foreground/50 hover:bg-muted/30 cursor-pointer"
              >
                <CameraIcon className="size-6" />
                <span className="text-xs">Foto Serah Terima</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* ─── TTD Canvas Placeholder ─── */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Tanda Tangan</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex h-[150px] items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/30 bg-muted/20">
            <div className="flex flex-col items-center gap-1 text-muted-foreground">
              <PenLineIcon className="size-6" />
              <span className="text-sm">Tanda tangan di sini</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ─── Jumlah Porsi Diterima ─── */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Porsi Diterima</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <Label htmlFor="porsi-diterima">Jumlah Porsi Diterima</Label>
          <Input
            id="porsi-diterima"
            type="number"
            min={0}
            max={MOCK_DAPUR.porsiDikirim}
            value={porsiDiterima || ''}
            onChange={(e) => setPorsiDiterima(Number(e.target.value))}
            placeholder="0"
          />
          <p className="text-xs text-muted-foreground">
            Maksimal: {MOCK_DAPUR.porsiDikirim} porsi (sesuai pengiriman)
          </p>
        </CardContent>
      </Card>

      {/* ─── CTA ─── */}
      <Button
        className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
        size="lg"
        onClick={handleKonfirmasi}
      >
        <CheckCircleIcon className="size-4" />
        Konfirmasi Penerimaan
      </Button>
    </div>
  )
}
