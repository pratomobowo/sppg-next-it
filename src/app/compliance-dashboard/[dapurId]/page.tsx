'use client'

import { useParams, useRouter } from 'next/navigation'
import { useState } from 'react'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { ArrowLeft, ChevronDown, ChevronUp } from 'lucide-react'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
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

// ---------------------------------------------------------------------------
// Mock data
// ---------------------------------------------------------------------------

const MOCK_DAPUR: Record<
  string,
  { name: string; lokasi: string; compliance: number }
> = {
  'dapur-1': { name: 'Dapur Ciputat', lokasi: 'Tangerang Selatan', compliance: 94 },
  'dapur-2': { name: 'Dapur Pasar Minggu', lokasi: 'Jakarta Selatan', compliance: 88 },
  'dapur-3': { name: 'Dapur Bekasi Barat', lokasi: 'Bekasi', compliance: 76 },
  'dapur-4': { name: 'Dapur Depok Timur', lokasi: 'Depok', compliance: 65 },
  'dapur-5': { name: 'Dapur Bogor Utara', lokasi: 'Bogor', compliance: 91 },
  'dapur-6': { name: 'Dapur Serpong', lokasi: 'Tangerang Selatan', compliance: 82 },
}

// 14-day mock data
const MOCK_DETAIL_CHART = Array.from({ length: 14 }, (_, i) => ({
  day: `H${i + 1}`,
  kalori: 400 + Math.round(Math.random() * 80 + i * 3),
  kaloriStd: 450,
  karbohidrat: 50 + Math.round(Math.random() * 15 + i),
  karbohidratStd: 60,
  protein: 16 + Math.round(Math.random() * 10 + i * 0.5),
  proteinStd: 22,
  lemak: 12 + Math.round(Math.random() * 10 + i * 0.3),
  lemakStd: 18,
}))

const MOCK_DAILY = [
  {
    tanggal: '2026-05-18',
    menu: 'Nasi + Ayam Goreng + Sayur Sop + Pisang',
    kaloriAkt: 430,
    kaloriStd: 450,
    karbohidratAkt: 58,
    karbohidratStd: 60,
    proteinAkt: 20,
    proteinStd: 22,
    lemakAkt: 16,
    lemakStd: 18,
    status: 'ok',
  },
  {
    tanggal: '2026-05-19',
    menu: 'Nasi + Ikan Bakar + Tumis Kangkung + Jeruk',
    kaloriAkt: 445,
    kaloriStd: 450,
    karbohidratAkt: 55,
    karbohidratStd: 60,
    proteinAkt: 24,
    proteinStd: 22,
    lemakAkt: 15,
    lemakStd: 18,
    status: 'ok',
  },
  {
    tanggal: '2026-05-20',
    menu: 'Nasi + Telur Dadar + Capcay + Semangka',
    kaloriAkt: 390,
    kaloriStd: 450,
    karbohidratAkt: 52,
    karbohidratStd: 60,
    proteinAkt: 17,
    proteinStd: 22,
    lemakAkt: 13,
    lemakStd: 18,
    status: 'warning',
  },
  {
    tanggal: '2026-05-21',
    menu: 'Nasi + Daging Rendang + Sayur Asem + Pepaya',
    kaloriAkt: 460,
    kaloriStd: 450,
    karbohidratAkt: 60,
    karbohidratStd: 60,
    proteinAkt: 25,
    proteinStd: 22,
    lemakAkt: 19,
    lemakStd: 18,
    status: 'ok',
  },
  {
    tanggal: '2026-05-22',
    menu: 'Nasi + Tahu Tempe + Urap + Pisang',
    kaloriAkt: 380,
    kaloriStd: 450,
    karbohidratAkt: 54,
    karbohidratStd: 60,
    proteinAkt: 15,
    proteinStd: 22,
    lemakAkt: 12,
    lemakStd: 18,
    status: 'warning',
  },
]

const MOCK_FLAGS = [
  {
    tanggal: '2026-05-20',
    nutrient: 'Kalori',
    selisih: '-60 kkal',
    rekomendasi: 'Tambahkan porsi nasi atau sumber karbohidrat',
  },
  {
    tanggal: '2026-05-20',
    nutrient: 'Protein',
    selisih: '-5 g',
    rekomendasi: 'Tambahkan lauk hewani (ayam/ikan/telur)',
  },
  {
    tanggal: '2026-05-22',
    nutrient: 'Kalori',
    selisih: '-70 kkal',
    rekomendasi: 'Evaluasi porsi menu; pertimbangkan tambahan susu',
  },
  {
    tanggal: '2026-05-22',
    nutrient: 'Protein',
    selisih: '-7 g',
    rekomendasi: 'Tambahkan tahu/tempe atau lauk tambahan',
  },
]

const NUTRIENT_KEYS = ['kalori', 'karbohidrat', 'protein', 'lemak'] as const

type NK = (typeof NUTRIENT_KEYS)[number]

const NUTRIENT_META: Record<
  NK,
  { label: string; color: string; textColor: string; bgColor: string }
> = {
  kalori: {
    label: 'Kalori',
    color: '#F9AB00',
    textColor: 'text-orange-600',
    bgColor: 'bg-orange-100',
  },
  karbohidrat: {
    label: 'Karbohidrat',
    color: '#1A73E8',
    textColor: 'text-blue-600',
    bgColor: 'bg-blue-100',
  },
  protein: {
    label: 'Protein',
    color: '#0D904F',
    textColor: 'text-green-600',
    bgColor: 'bg-green-100',
  },
  lemak: {
    label: 'Lemak',
    color: '#D93025',
    textColor: 'text-red-600',
    bgColor: 'bg-red-100',
  },
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function statusDot(status: string) {
  if (status === 'warning') return 'bg-yellow-500'
  return 'bg-green-500'
}

function nutrientStatus(actual: number, std: number) {
  const pct = (actual / std) * 100
  if (pct >= 90) return 'text-green-600'
  if (pct >= 70) return 'text-yellow-600'
  return 'text-red-600'
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function DapurComplianceDetailPage() {
  const params = useParams()
  const router = useRouter()
  const dapurId = params.dapurId as string
  const dapur = MOCK_DAPUR[dapurId] ?? {
    name: 'Dapur Tidak Dikenal',
    lokasi: '-',
    compliance: 0,
  }

  const [openDetail, setOpenDetail] = useState(false)

  const computeAvg = (key: NK) => {
    const vals = MOCK_DETAIL_CHART.map((d) => d[key])
    const stds = MOCK_DETAIL_CHART.map((d) => d[`${key}Std` as keyof typeof d] as number)
    const actualAvg = vals.reduce((a, b) => a + b, 0) / vals.length
    const stdAvg = stds.reduce((a, b) => a + b, 0) / stds.length
    return { actualAvg: Math.round(actualAvg), stdAvg: Math.round(stdAvg) }
  }

  return (
    <div className="space-y-6 p-6">
      {/* ---- Header ---- */}
      <div className="flex flex-wrap items-center gap-4">
        <button
          onClick={() => router.push('/compliance-dashboard')}
          className="inline-flex items-center gap-1 rounded-md border border-input bg-background px-3 py-2 text-sm font-medium hover:bg-accent"
        >
          <ArrowLeft className="size-4" />
          Kembali
        </button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{dapur.name}</h1>
          <p className="text-sm text-muted-foreground">
            {dapur.lokasi} · Kepatuhan Rata-rata{' '}
            <Badge variant="outline">{dapur.compliance}%</Badge>
          </p>
        </div>
      </div>

      {/* ---- Section 1: Detail Chart (14 hari) ---- */}
      <Card>
        <CardHeader>
          <CardTitle>Grafik Detail — 14 Hari Terakhir</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={MOCK_DETAIL_CHART}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                {NUTRIENT_KEYS.map((key) => (
                  <Line
                    key={key}
                    type="monotone"
                    dataKey={key}
                    stroke={NUTRIENT_META[key].color}
                    strokeWidth={2}
                    name={NUTRIENT_META[key].label}
                    dot={{ r: 2 }}
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* ---- Section 2: Breakdown Mingguan (2x2) ---- */}
      <div>
        <h3 className="mb-3 text-lg font-semibold">Breakdown Mingguan</h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {NUTRIENT_KEYS.map((key) => {
            const { actualAvg, stdAvg } = computeAvg(key)
            const pct = Math.round((actualAvg / stdAvg) * 100)
            const meta = NUTRIENT_META[key]
            const unit = key === 'kalori' ? 'kkal' : 'g'
            return (
              <Card key={key} className="overflow-hidden">
                <CardHeader className={`${meta.bgColor} py-3`}>
                  <CardTitle className={`text-sm ${meta.textColor}`}>
                    {meta.label}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 pt-4">
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold">{pct}%</span>
                    <Badge variant={pct >= 90 ? 'default' : 'secondary'}>
                      {pct >= 90 ? 'Tercapai' : pct >= 70 ? 'Mendekati' : 'Di Bawah'}
                    </Badge>
                  </div>
                  {/* Progress bar */}
                  <div className="h-3 w-full overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{
                        width: `${Math.min(pct, 100)}%`,
                        backgroundColor: meta.color,
                      }}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Rata-rata: {actualAvg} {unit} / standar {stdAvg} {unit}
                  </p>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>

      {/* ---- Section 3: Tabel Detail Harian (collapsible) ---- */}
      <Card>
        <CardHeader>
          <Collapsible open={openDetail} onOpenChange={setOpenDetail}>
            <div className="flex items-center justify-between">
              <CardTitle>Tabel Detail Harian</CardTitle>
              <CollapsibleTrigger className="inline-flex items-center gap-1 text-sm text-primary hover:underline">
                {openDetail ? (
                  <>
                    Sembunyikan <ChevronUp className="size-4" />
                  </>
                ) : (
                  <>
                    Lihat Detail <ChevronDown className="size-4" />
                  </>
                )}
              </CollapsibleTrigger>
            </div>
          </Collapsible>
        </CardHeader>
        <Collapsible open={openDetail}>
          <CollapsibleContent>
            <CardContent className="pt-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tanggal</TableHead>
                    <TableHead>Menu</TableHead>
                    <TableHead>Kalori</TableHead>
                    <TableHead>Karbohidrat</TableHead>
                    <TableHead>Protein</TableHead>
                    <TableHead>Lemak</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {MOCK_DAILY.map((row) => (
                    <TableRow key={row.tanggal}>
                      <TableCell className="whitespace-nowrap">
                        {row.tanggal}
                      </TableCell>
                      <TableCell className="max-w-[220px] truncate">
                        {row.menu}
                      </TableCell>
                      <TableCell
                        className={`whitespace-nowrap ${nutrientStatus(row.kaloriAkt, row.kaloriStd)}`}
                      >
                        {row.kaloriAkt}/{row.kaloriStd} kkal
                      </TableCell>
                      <TableCell
                        className={`whitespace-nowrap ${nutrientStatus(row.karbohidratAkt, row.karbohidratStd)}`}
                      >
                        {row.karbohidratAkt}/{row.karbohidratStd} g
                      </TableCell>
                      <TableCell
                        className={`whitespace-nowrap ${nutrientStatus(row.proteinAkt, row.proteinStd)}`}
                      >
                        {row.proteinAkt}/{row.proteinStd} g
                      </TableCell>
                      <TableCell
                        className={`whitespace-nowrap ${nutrientStatus(row.lemakAkt, row.lemakStd)}`}
                      >
                        {row.lemakAkt}/{row.lemakStd} g
                      </TableCell>
                      <TableCell>
                        <span
                          className={`inline-block size-2.5 rounded-full ${statusDot(row.status)}`}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </CollapsibleContent>
        </Collapsible>
      </Card>

      {/* ---- Section 4: Flag / Warning ---- */}
      <Card className="border-red-200">
        <CardHeader>
          <CardTitle className="text-red-700">⚠️ Peringatan Kepatuhan</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3">
            {MOCK_FLAGS.map((flag, i) => (
              <li
                key={i}
                className="flex flex-col rounded-md border border-red-100 bg-red-50 p-3 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <p className="text-sm font-medium text-red-800">
                    {flag.tanggal} — {flag.nutrient} di bawah standar (
                    {flag.selisih})
                  </p>
                  <p className="text-xs text-red-600">{flag.rekomendasi}</p>
                </div>
                <Badge variant="destructive" className="mt-2 sm:mt-0">
                  Perlu Tindakan
                </Badge>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}
