'use client'

import { useState } from 'react'
import { useAuth } from '@/lib/auth'
import dynamic from 'next/dynamic'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  TooltipProvider,
} from '@/components/ui/tooltip'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Skeleton } from '@/components/ui/skeleton'
import {
  SearchIcon,
  VideoIcon,
  CheckCircleIcon,
  CircleIcon,
  MapPinIcon,
} from 'lucide-react'

// ─── Dynamic Import of Leaflet Map to avoid SSR errors ───
const MapInner = dynamic(() => import('./MapInner'), { ssr: false })

// ─── Types ────────────────────────────────────────────────────────────────────

type DapurStatus = 'normal' | 'warning' | 'kritis'

type Dapur = {
  id: string
  nama: string
  alamat: string
  status: DapurStatus
  porsiHariIni: number
  coords: [number, number]
  hasCctv: boolean
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

const MOCK_DAPUR: Dapur[] = [
  {
    id: 'dpr-001',
    nama: 'Dapur Sejahtera 1',
    alamat: 'Jl. Raya Pasar Minggu No. 10, Jakarta Selatan',
    status: 'normal',
    porsiHariIni: 350,
    coords: [-6.2608, 106.8209],
    hasCctv: true,
  },
  {
    id: 'dpr-002',
    nama: 'Dapur Sejahtera 2',
    alamat: 'Jl. Raya Condet No. 25, Jakarta Timur',
    status: 'normal',
    porsiHariIni: 420,
    coords: [-6.2759, 106.8535],
    hasCctv: true,
  },
  {
    id: 'dpr-003',
    nama: 'Dapur Harapan',
    alamat: 'Jl. Tebet Barat No. 5, Jakarta Selatan',
    status: 'normal',
    porsiHariIni: 280,
    coords: [-6.2146, 106.8451],
    hasCctv: false,
  },
  {
    id: 'dpr-004',
    nama: 'Dapur Nusantara',
    alamat: 'Jl. Iskandarsyah No. 8, Jakarta Selatan',
    status: 'warning',
    porsiHariIni: 190,
    coords: [-6.2512, 106.7972],
    hasCctv: true,
  },
  {
    id: 'dpr-005',
    nama: 'Dapur Bersinar',
    alamat: 'Jl. Kebon Sirih No. 12, Jakarta Pusat',
    status: 'warning',
    porsiHariIni: 310,
    coords: [-6.2421, 106.8123],
    hasCctv: false,
  },
  {
    id: 'dpr-006',
    nama: 'Dapur Prima',
    alamat: 'Jl. CASABLANCA No. 3, Jakarta Selatan',
    status: 'kritis',
    porsiHariIni: 75,
    coords: [-6.2801, 106.8150],
    hasCctv: true,
  },
  {
    id: 'dpr-007',
    nama: 'Dapur Sentosa',
    alamat: 'Jl. Diponegoro No. 18, Jakarta Pusat',
    status: 'normal',
    porsiHariIni: 500,
    coords: [-6.2301, 106.8310],
    hasCctv: false,
  },
  {
    id: 'dpr-008',
    nama: 'Dapur Makmur',
    alamat: 'Jl. Pemuda No. 22, Jakarta Timur',
    status: 'normal',
    porsiHariIni: 265,
    coords: [-6.2912, 106.8322],
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
            CCTV Live Stream — {dapur.nama}
          </DialogTitle>
        </DialogHeader>
        {/* Render a simulated HTML5 video loop player to mimic real live CCTV stream */}
        <div className="relative aspect-video bg-black rounded-lg overflow-hidden border border-border">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover"
          >
            <source src="https://assets.mixkit.co/videos/preview/mixkit-kitchen-chef-preparing-a-meal-41584-large.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
          <div className="absolute top-3 left-3 bg-red-600 text-white text-[10px] uppercase font-bold px-2 py-0.5 rounded flex items-center gap-1.5 shadow z-10 animate-pulse">
            <span className="size-1.5 rounded-full bg-white block" />
            LIVE
          </div>
          <div className="absolute bottom-3 right-3 bg-black/60 text-white text-[10px] font-mono px-2 py-0.5 rounded shadow z-10">
            {dapur.nama} · CAM 01
          </div>
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
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Peta &amp; CCTV</h1>
            <p className="text-muted-foreground">Monitoring sebaran lokasi dapur program gizi dan CCTV secara real-time</p>
          </div>
        </div>

        <Tabs defaultValue="peta" className="space-y-6">
          <TabsList className="grid w-full max-w-[400px] grid-cols-2">
            <TabsTrigger value="peta" className="flex items-center gap-2">
              <MapPinIcon className="size-4" />
              Peta Lokasi
            </TabsTrigger>
            <TabsTrigger value="cctv" className="flex items-center gap-2">
              <VideoIcon className="size-4" />
              CCTV Viewer
            </TabsTrigger>
          </TabsList>

          <TabsContent value="peta" className="space-y-6 outline-none">
            {/* ── Map + Sidebar ───────────────────────── */}
            <div className="flex flex-col lg:flex-row gap-6">
              {/* Map Section */}
              <Card className="flex-1 overflow-hidden">
                <CardContent className="p-0 relative">
                  {/* Render Leaflet map inner component dynamically */}
                  <div className="relative h-[500px] lg:h-[600px] m-4 rounded-lg overflow-hidden border border-border">
                    <MapInner
                      dapurs={MOCK_DAPUR}
                      selectedDapurId={selectedDapur}
                      setSelectedDapurId={setSelectedDapur}
                      onViewCctv={(d) => setCctvDapur(d)}
                    />
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
                              isSelected ? 'ring-2 ring-primary border-primary bg-muted/20' : ''
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
          </TabsContent>

          <TabsContent value="cctv" className="space-y-6 outline-none">
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
                            <VideoIcon className="size-5 text-primary shrink-0" />
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
          </TabsContent>
        </Tabs>

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
