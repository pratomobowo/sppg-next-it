'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'

// ---------------------------------------------------------------------------
// Mock data
// ---------------------------------------------------------------------------

const DAYS = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu']

const MOCK_CHART = DAYS.map((day, i) => ({
  day,
  kalori: 420 + i * 3 + Math.round(Math.random() * 20 - 10),
  kaloriStd: 450,
  karbohidrat: 55 + i + Math.round(Math.random() * 4 - 2),
  karbohidratStd: 60,
  protein: 18 + Math.round(i * 1.5 + Math.random() * 3 - 1.5),
  proteinStd: 22,
  lemak: 14 + Math.round(i * 0.5 + Math.random() * 2 - 1),
  lemakStd: 18,
}))

const MOCK_TABLE = [
  { id: 'dapur-1', name: 'Dapur Ciputat', lokasi: 'Tangerang Selatan', compliance: 94 },
  { id: 'dapur-2', name: 'Dapur Pasar Minggu', lokasi: 'Jakarta Selatan', compliance: 88 },
  { id: 'dapur-3', name: 'Dapur Bekasi Barat', lokasi: 'Bekasi', compliance: 76 },
  { id: 'dapur-4', name: 'Dapur Depok Timur', lokasi: 'Depok', compliance: 65 },
  { id: 'dapur-5', name: 'Dapur Bogor Utara', lokasi: 'Bogor', compliance: 91 },
  { id: 'dapur-6', name: 'Dapur Serpong', lokasi: 'Tangerang Selatan', compliance: 82 },
]

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

type NutrientKey = 'kalori' | 'karbohidrat' | 'protein' | 'lemak'

const NUTRIENT_CONFIG: Record<
  NutrientKey,
  { label: string; color: string; std: string }
> = {
  kalori: { label: 'Kalori', color: '#F9AB00', std: 'kaloriStd' },
  karbohidrat: { label: 'Karbohidrat', color: '#1A73E8', std: 'karbohidratStd' },
  protein: { label: 'Protein', color: '#0D904F', std: 'proteinStd' },
  lemak: { label: 'Lemak', color: '#D93025', std: 'lemakStd' },
}

function statusColor(pct: number) {
  if (pct >= 90) return 'bg-green-500'
  if (pct >= 70) return 'bg-yellow-500'
  return 'bg-red-500'
}

function statusLabel(pct: number) {
  if (pct >= 90) return 'Baik'
  if (pct >= 70) return 'Cukup'
  return 'Kurang'
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function ComplianceDashboardPage() {
  const [loading] = useState(false)
  const [yayasan, setYayasan] = useState('semua')
  const [dapur, setDapur] = useState('semua')
  const [dari, setDari] = useState('')
  const [sampai, setSampai] = useState('')
  const [selectedNutrient, setSelectedNutrient] = useState<NutrientKey | 'all'>(
    'all'
  )

  if (loading) {
    return (
      <div className="space-y-6 p-6">
        <Skeleton className="h-8 w-72" />
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-64 w-full" />
        <Skeleton className="h-48 w-full" />
      </div>
    )
  }

  const yayasans = ['semua', 'Yayasan Sejahtera', 'Yayasan Mandiri', 'Yayasan Harapan']
  const dapurs =
    yayasan === 'semua'
      ? ['semua']
      : ['semua', ...MOCK_TABLE.slice(0, 3).map((d) => d.name)]

  return (
    <div className="space-y-6 p-6">
      {/* ---- Header ---- */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          Dashboard Kepatuhan Gizi
        </h1>
        <p className="text-sm text-muted-foreground">
          Monitoring kepatuhan standar gizi BGN per dapur
        </p>
      </div>

      {/* ---- Filter Bar ---- */}
      <Card>
        <CardContent className="flex flex-wrap items-end gap-4 pt-6">
          {/* Yayasan */}
          <div className="flex-1 min-w-[180px]">
            <label className="mb-1 block text-xs font-medium text-muted-foreground">
              Pilih Yayasan
            </label>
            <select
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              value={yayasan}
              onChange={(e) => {
                setYayasan(e.target.value)
                setDapur('semua')
              }}
            >
              {yayasans.map((y) => (
                <option key={y} value={y}>
                  {y === 'semua' ? 'Semua' : y}
                </option>
              ))}
            </select>
          </div>

          {/* Dapur */}
          <div className="flex-1 min-w-[180px]">
            <label className="mb-1 block text-xs font-medium text-muted-foreground">
              Pilih Dapur
            </label>
            <select
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              value={dapur}
              onChange={(e) => setDapur(e.target.value)}
            >
              {dapurs.map((d) => (
                <option key={d} value={d}>
                  {d === 'semua' ? 'Semua' : d}
                </option>
              ))}
            </select>
          </div>

          {/* Dari */}
          <div className="flex-1 min-w-[150px]">
            <label className="mb-1 block text-xs font-medium text-muted-foreground">
              Dari
            </label>
            <input
              type="date"
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              value={dari}
              onChange={(e) => setDari(e.target.value)}
            />
          </div>

          {/* Sampai */}
          <div className="flex-1 min-w-[150px]">
            <label className="mb-1 block text-xs font-medium text-muted-foreground">
              Sampai
            </label>
            <input
              type="date"
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              value={sampai}
              onChange={(e) => setSampai(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* ---- Nutrisi Tabs ---- */}
      <Tabs
        value={selectedNutrient}
        onValueChange={(v) => setSelectedNutrient(v as NutrientKey | 'all')}
      >
        <TabsList>
          <TabsTrigger value="all">Semua</TabsTrigger>
          {(
            Object.entries(NUTRIENT_CONFIG) as [
              NutrientKey,
              (typeof NUTRIENT_CONFIG)[NutrientKey],
            ][]
          ).map(([key, cfg]) => (
            <TabsTrigger key={key} value={key}>
              <span
                className="mr-1.5 inline-block size-2 rounded-full"
                style={{ backgroundColor: cfg.color }}
              />
              {cfg.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      {/* ---- Chart Card ---- */}
      <Card>
        <CardHeader>
          <CardTitle>
            {selectedNutrient === 'all'
              ? 'Grafik Kepatuhan Harian'
              : `Grafik Kepatuhan ${NUTRIENT_CONFIG[selectedNutrient].label}`}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={MOCK_CHART}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />

                {selectedNutrient === 'all' ? (
                  <>
                    <Line
                      type="monotone"
                      dataKey="kalori"
                      stroke={NUTRIENT_CONFIG.kalori.color}
                      strokeWidth={2}
                      name="Kalori"
                      dot={{ r: 3 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="karbohidrat"
                      stroke={NUTRIENT_CONFIG.karbohidrat.color}
                      strokeWidth={2}
                      name="Karbohidrat"
                      dot={{ r: 3 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="protein"
                      stroke={NUTRIENT_CONFIG.protein.color}
                      strokeWidth={2}
                      name="Protein"
                      dot={{ r: 3 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="lemak"
                      stroke={NUTRIENT_CONFIG.lemak.color}
                      strokeWidth={2}
                      name="Lemak"
                      dot={{ r: 3 }}
                    />
                  </>
                ) : (
                  <>
                    <Line
                      type="monotone"
                      dataKey={selectedNutrient}
                      stroke={NUTRIENT_CONFIG[selectedNutrient].color}
                      strokeWidth={2}
                      name={NUTRIENT_CONFIG[selectedNutrient].label}
                      dot={{ r: 4 }}
                    />
                    <Line
                      type="monotone"
                      dataKey={NUTRIENT_CONFIG[selectedNutrient].std}
                      stroke="#D93025"
                      strokeWidth={2}
                      strokeDasharray="5 5"
                      name={`Standar BGN`}
                      dot={false}
                      opacity={0.5}
                    />
                  </>
                )}
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* ---- Kepatuhan Per Dapur Table ---- */}
      <Card>
        <CardHeader>
          <CardTitle>Kepatuhan Per Dapur</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Dapur</TableHead>
                <TableHead>Lokasi</TableHead>
                <TableHead>Rata-rata Kepatuhan</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {MOCK_TABLE.map((d) => (
                <TableRow key={d.id}>
                  <TableCell className="font-medium">{d.name}</TableCell>
                  <TableCell>{d.lokasi}</TableCell>
                  <TableCell>{d.compliance}%</TableCell>
                  <TableCell>
                    <span className="inline-flex items-center gap-2">
                      <span
                        className={`inline-block size-2.5 rounded-full ${statusColor(d.compliance)}`}
                      />
                      <Badge variant="outline">{statusLabel(d.compliance)}</Badge>
                    </span>
                  </TableCell>
                  <TableCell>
                    <Link
                      href={`/compliance-dashboard/${d.id}`}
                      className="text-sm font-medium text-primary hover:underline"
                    >
                      Detail
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
