'use client'

import { useState, useRef, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { toast } from 'sonner'
import {
  ArrowLeftIcon,
  CameraIcon,
  PenLineIcon,
  CheckCircleIcon,
  RotateCcwIcon,
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
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [hasSigned, setHasSigned] = useState(false)

  useEffect(() => {
    const canvas = canvasRef.current
    if (canvas) {
      canvas.width = canvas.parentElement?.clientWidth || 300
      canvas.height = 150
    }
  }, [])

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    ctx.lineWidth = 3
    ctx.lineCap = 'round'
    ctx.strokeStyle = '#0F172A' // Slate 900

    const pos = getPos(e)
    ctx.beginPath()
    ctx.moveTo(pos.x, pos.y)
    setIsDrawing(true)
  }

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    e.preventDefault() // Prevent scrolling on touch
    const pos = getPos(e)
    ctx.lineTo(pos.x, pos.y)
    ctx.stroke()
    setHasSigned(true)
  }

  const stopDrawing = () => {
    setIsDrawing(false)
  }

  const getPos = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas) return { x: 0, y: 0 }
    const rect = canvas.getBoundingClientRect()
    
    if ('touches' in e) {
      if (e.touches.length === 0) return { x: 0, y: 0 }
      return {
        x: e.touches[0].clientX - rect.left,
        y: e.touches[0].clientY - rect.top
      }
    }
    
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    }
  }

  const clearCanvas = () => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    setHasSigned(false)
  }

  const handleKonfirmasi = () => {
    if (porsiDiterima <= 0) {
      toast.error('Isi jumlah porsi diterima')
      return
    }
    if (!hasSigned) {
      toast.error('Tanda tangan wajib diisi')
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

      {/* ─── TTD Canvas Interaktif ─── */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-base">Tanda Tangan</CardTitle>
          {hasSigned && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearCanvas}
              className="h-7 px-2 text-xs text-muted-foreground hover:text-red-500"
            >
              <RotateCcwIcon className="mr-1 size-3" />
              Reset
            </Button>
          )}
        </CardHeader>
        <CardContent>
          <div className="relative overflow-hidden rounded-lg border bg-muted/10">
            <canvas
              ref={canvasRef}
              onMouseDown={startDrawing}
              onMouseMove={draw}
              onMouseUp={stopDrawing}
              onMouseLeave={stopDrawing}
              onTouchStart={startDrawing}
              onTouchMove={draw}
              onTouchEnd={stopDrawing}
              className="cursor-crosshair bg-white block w-full touch-none"
            />
            {!hasSigned && (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 text-muted-foreground pointer-events-none opacity-40">
                <PenLineIcon className="size-5" />
                <span className="text-xs">Coret tanda tangan di sini</span>
              </div>
            )}
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
