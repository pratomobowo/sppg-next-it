'use client'

import { useState } from 'react'
import { useAuth } from '@/lib/auth'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Skeleton } from '@/components/ui/skeleton'
import {
  MapPinIcon,
  SearchIcon,
  VideoIcon,
  CheckCircleIcon,
  CircleIcon,
} from 'lucide-react'

// ─── Types ────────────────────────────────────────────────────────────────────

type DapurStatus = 'normal' | 'warning' | 'kritis'

type Dapur = {
  id: string
  nama: string
  alamat: string
  status: DapurStatus
  porsiHariIni: number
  lat: number  // percentage 0-100 for positioning
  lng: number  // percentage 0-100 for positioning
  hasCctv: boolean
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

const MOCK_DAPUR: Dapur[] = [
  {
    id: 'dpr-001',
    nama: 'Dapur Sejahtera 1',
    alamat: 'Jl. Merdeka No. 10, Jakarta Pusat',
    status: 'normal',
    porsiHariIni: 350,
    lat: 20,
    lng: 30,
    hasCctv: true,
  },
  {
    id: 'dpr-002',
    nama: 'Dapur Sejahtera 2',
    alamat: 'Jl. Sudirman No. 25, Jakarta Selatan',
    status: 'normal',
    porsiHariIni: 420,
    lat: 35,
    lng: 60,
    hasCctv: true,
  },
  {
    id: 'dpr-003',
    nama: 'Dapur Harapan',
    alamat: 'Jl. Thamrin No. 5, Jakarta Pusat',
    status: 'normal',
    porsiHariIni: 280,
    lat: 55,
    lng: 25,
    hasCctv: false,
  },
  {
    id: 'dpr-004',
    nama: 'Dapur Nusantara',
    alamat: 'Jl. Gatot Subroto No. 8, Jakarta Timur',
    status: 'warning',
    porsiHariIni: 190,
    lat: 30,
    lng: 80,
    hasCctv: true,
  },
  {
    id: 'dpr-005',
    nama: 'Dapur Bersinar',
    alamat: 'Jl. Kebon Sirih No. 12, Jakarta Pusat',
    status: 'warning',
    porsiHariIni: 310,
    lat: 65,
    lng: 50,
    hasCctv: false,
  },
  {
    id: 'dpr-006',
    nama: 'Dapur Prima',
    alamat: 'Jl. Casablanca No. 3, Jakarta Selatan',
    status: 'kritis',
    porsiHariIni: 75,
    lat: 45,
    lng: 40,
    hasCctv: true,
  },
  {
    id: 'dpr-007',
    nama: 'Dapur Sentosa',
    alamat: 'Jl. Diponegoro No. 18, Jakarta Pusat',
    status: 'normal',
    porsiHariIni: 500,
    lat: 75,
    lng: 70,
    hasCctv: false,
  },
  {
    id: 'dpr-008',
    nama: 'Dapur Makmur',
    alamat: 'Jl. Pemuda No. 22, Jakarta Timur',
    status: 'normal',
    porsiHariIni: 265,
    lat: 15,
    lng: 55,
    hasCctv: true,
  },
]

const CCTV_DAPUR = MOCK_DAPUR.filter((d) => d.hasCctv)

const STATUS_COLORS: Record<DapurStatus, { dot: string; badge: string; label: string }> = {
  normal: { dot: 'bg-emerald-500', badge: 'bg-emerald-100 text-emerald-700 border-emerald-200', label: 'Normal' },
  warning: { dot: 'bg-amber-500', badge: 'bg-amber-100 text-amber-700 border-amber-200', label: 'Warning' },
  kritis: { dot: 'bg-red-500', badge: 'bg-red-100 text-red-700 border-red-200', label: 'Kritis' },
}

// ─── Loading Skeleton ─────────────────────────────────────────────────────────

function MapsSkeleton() {
  return (
    <div className="space-y-6 p-6">
      <div>
        <Skeleton className="h-7 w-40 mb-2" />
        <Skeleton className="h-4 w-72" />
      </div>
      <div className="flex flex-col lg:flex-row gap-6">
        <Skeleton className="h-[500px] lg:h-[600px] flex-1 rounded-xl" />
        <div className="w-full lg:w-[380px] space-y-4">
          <Skeleton className="h-10 w-full" />
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-24 w-full rounded-xl" />
          ))}
        </div>
      </div>
      <Skeleton className="h-48 w-full rounded-xl" />
    </div>
  )
}

// ─── Pin Marker Component ─────────────────────────────────────────────────────

function PinMarker({ dapur, onClick }: { dapur: Dapur; onClick: () => void }) {
  const color = STATUS_COLORS[dapur.status]

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          onClick={onClick}
          className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer group"
          style={{ left: `${dapur.lng}%`, top: `${dapur.lat}%` }}
        >
          {/* Pin body */}
          <div
            className={`size-4 rounded-full ${color.dot} shadow-md ring-2 ring-white transition-transform group-hover:scale-125`}
          />
          {/* Pulse ring */}
          <div
            className={`absolute inset-0 size-4 rounded-full ${color.dot} opacity-30 animate-ping`}
          />
        </button>
      </TooltipTrigger>
      <TooltipContent side="top">
        <p className="font-medium">{dapur.nama}</p>
        <p className="text-xs text-muted-foreground">{color.label} — {dapur.porsiHariIni} porsi</p>
      </TooltipContent>
    </Tooltip>
  )
}

// ─── CCTV Viewer Modal ────────────────────────────────────────────────────────

function CctvModal({
  open,
  onClose,
  dapur,
}: {
  open: boolean
  onClose: () => void
  dapur: Dapur | null
}) {
  if (!dapur) return null

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) onClose() }}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <VideoIcon className="size-5" />
            CCTV — {dapur.nama}
          </DialogTitle>
        </DialogHeader>
        <div className="flex flex-col items-center justify-center aspect-video bg-black/80 rounded-lg border border-border">
          <VideoIcon className="size-16 text-muted-foreground/40 mb-4" />
          <p className="text-muted-foreground font-medium">Stream CCTV akan tersedia</p>
          <p className="text-xs text-muted-foreground/60 mt-1">
            Integrasi kamera CCTV {dapur.nama} dalam pengembangan
          </p>
        </div>
      </DialogContent>
    </Dialog>
  )
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function MapsPage() {
  const { currentUser } = useAuth()
  const [search, setSearch] = useState('')
  const [selectedDapur, setSelectedDapur] = useState<string | null>(null)
  const [cctvDapur, setCctvDapur] = useState<Dapur | null>(null)

  if (!currentUser) {
    return <MapsSkeleton />
  }

  const filtered = MOCK_DAPUR.filter(
    (d) =>
      d.nama.toLowerCase().includes(search.toLowerCase()) ||
      d.alamat.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <TooltipProvider>
      <div className="space-y-6 p-6">
        {/* ── Header ──────────────────────────────── */}
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Peta &amp; CCTV</h1>
          <p className="text-muted-foreground">Monitoring lokasi dapur dan CCTV</p>
        </div>

        {/* ── Map + Sidebar ───────────────────────── */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Map Section */}
          <Card className="flex-1 overflow-hidden">
            <CardContent className="p-0 relative">
              {/* Map placeholder */}
              <div className="relative h-[500px] lg:h-[600px] bg-muted border border-dashed border-border rounded-lg m-4">
                {/* Center text */}
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <MapPinIcon className="size-10 text-muted-foreground/30 mb-2" />
                  <p className="text-lg font-medium text-muted-foreground/60">Peta Lokasi Dapur</p>
                  <p className="text-sm text-muted-foreground/40">Integrasi peta akan tersedia</p>
                </div>

                {/* Pin markers */}
                {MOCK_DAPUR.map((dapur) => (
                  <PinMarker
                    key={dapur.id}
                    dapur={dapur}
                    onClick={() => setSelectedDapur(dapur.id)}
                  />
                ))}
              </div>

              {/* Legend */}
              <div className="flex items-center gap-4 px-4 pb-4">
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <div className="size-2.5 rounded-full bg-emerald-500" />
                  Normal
                </div>
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <div className="size-2.5 rounded-full bg-amber-500" />
                  Warning
                </div>
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <div className="size-2.5 rounded-full bg-red-500" />
                  Kritis
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Sidebar */}
          <div className="w-full lg:w-[380px] shrink-0 space-y-4">
            {/* Search */}
            <div className="relative">
              <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <Input
                placeholder="Cari dapur..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>

            {/* Dapur list */}
            <ScrollArea className="h-[460px] lg:h-[548px]">
              <div className="space-y-3 pr-1">
                {filtered.length === 0 ? (
                  <p className="text-center text-sm text-muted-foreground py-8">
                    Tidak ada dapur ditemukan
                  </p>
                ) : (
                  filtered.map((dapur) => {
                    const color = STATUS_COLORS[dapur.status]
                    const isSelected = selectedDapur === dapur.id

                    return (
                      <Card
                        key={dapur.id}
                        className={`cursor-pointer transition-all hover:shadow-md ${
                          isSelected ? 'ring-2 ring-primary border-primary' : ''
                        }`}
                        onClick={() =>
                          setSelectedDapur(isSelected ? null : dapur.id)
                        }
                      >
                        <CardContent className="p-4 space-y-2">
                          <div className="flex items-start justify-between gap-2">
                            <div className="min-w-0">
                              <p className="font-semibold text-sm truncate">{dapur.nama}</p>
                              <p className="text-xs text-muted-foreground truncate">{dapur.alamat}</p>
                            </div>
                            <Badge variant="outline" className={`shrink-0 text-xs ${color.badge}`}>
                              <CircleIcon className={`size-2 fill-current ${color.dot.replace('bg-', 'text-')}`} />
                              <span className="ml-1">{color.label}</span>
                            </Badge>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">Porsi Hari Ini</span>
                            <span className="font-semibold">{dapur.porsiHariIni.toLocaleString('id-ID')}</span>
                          </div>
                        </CardContent>
                      </Card>
                    )
                  })
                )}
              </div>
            </ScrollArea>
          </div>
        </div>

        {/* ── CCTV Section ────────────────────────── */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <VideoIcon className="size-5" />
              CCTV Viewer
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {CCTV_DAPUR.map((dapur) => {
                const color = STATUS_COLORS[dapur.status]
                return (
                  <Card key={dapur.id} className="bg-muted/50">
                    <CardContent className="p-4 space-y-3">
                      <div className="flex items-center gap-2">
                        <CheckCircleIcon className="size-4 text-emerald-500 shrink-0" />
                        <div className="min-w-0">
                          <p className="text-sm font-medium truncate">{dapur.nama}</p>
                          <div className="flex items-center gap-1.5 mt-0.5">
                            <div className={`size-2 rounded-full ${color.dot}`} />
                            <span className="text-xs text-muted-foreground">{color.label}</span>
                          </div>
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full"
                        onClick={() => setCctvDapur(dapur)}
                      >
                        <VideoIcon className="size-3.5 mr-1.5" />
                        Lihat CCTV
                      </Button>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* ── CCTV Modal ──────────────────────────── */}
        <CctvModal
          open={!!cctvDapur}
          onClose={() => setCctvDapur(null)}
          dapur={cctvDapur}
        />
      </div>
    </TooltipProvider>
  )
}
