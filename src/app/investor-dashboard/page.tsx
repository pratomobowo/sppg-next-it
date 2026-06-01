'use client'

import { useState, useEffect } from 'react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from 'recharts'
import {
  TrendingUp,
  TrendingDown,
  Wallet,
  UtensilsCrossed,
} from 'lucide-react'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

// ---------------------------------------------------------------------------
// Inline formatRupiah (no existing shared util found)
// ---------------------------------------------------------------------------

function formatRupiah(n: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(n)
}

// ---------------------------------------------------------------------------
// Mock data (Static values without Math.random to prevent hydration mismatch)
// ---------------------------------------------------------------------------

const MOCK_KAS = [
  { bulan: 'Jan', masuk: 195000000, keluar: 135000000 },
  { bulan: 'Feb', masuk: 210000000, keluar: 145000000 },
  { bulan: 'Mar', masuk: 185000000, keluar: 140000000 },
  { bulan: 'Apr', masuk: 230000000, keluar: 160000000 },
  { bulan: 'Mei', masuk: 205000000, keluar: 150000000 },
  { bulan: 'Jun', masuk: 240000000, keluar: 165000000 },
]

const MOCK_PORSI = [
  { bulan: 'Jan', porsi: 7800 },
  { bulan: 'Feb', porsi: 8200 },
  { bulan: 'Mar', porsi: 8000 },
  { bulan: 'Apr', porsi: 8500 },
  { bulan: 'Mei', porsi: 8300 },
  { bulan: 'Jun', porsi: 8900 },
]

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function InvestorDashboardPage() {
  const [yayasan, setYayasan] = useState('semua')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <div className="space-y-6 p-6">
      {/* ---- Header ---- */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Dashboard Keuangan
          </h1>
          <p className="text-sm text-muted-foreground">
            Ringkasan keuangan program MBG
          </p>
        </div>

        {/* Filter */}
        <div className="flex flex-wrap items-center gap-3">
          <div>
            <select
              className="rounded-md border border-input bg-background px-3 py-2 text-sm"
              value={yayasan}
              onChange={(e) => setYayasan(e.target.value)}
            >
              <option value="semua">Semua Yayasan</option>
              <option value="Yayasan Sejahtera">Yayasan Sejahtera</option>
              <option value="Yayasan Mandiri">Yayasan Mandiri</option>
              <option value="Yayasan Harapan">Yayasan Harapan</option>
            </select>
          </div>
        </div>
      </div>

      {/* ---- Stat Cards ---- */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Total Dana Masuk */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Dana Masuk
            </CardTitle>
            <TrendingUp className="size-5 text-green-600" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{formatRupiah(1200000000)}</p>
            <p className="mt-1 text-xs text-green-600">
              ↑ 12% dari bulan lalu
            </p>
          </CardContent>
        </Card>

        {/* Total Pengeluaran */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Pengeluaran
            </CardTitle>
            <TrendingDown className="size-5 text-orange-600" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{formatRupiah(890000000)}</p>
            <p className="mt-1 text-xs text-orange-600">
              ↓ 3% dari bulan lalu
            </p>
          </CardContent>
        </Card>

        {/* Sisa Kas */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Sisa Kas
            </CardTitle>
            <Wallet className="size-5 text-blue-600" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{formatRupiah(310000000)}</p>
            <p className="mt-1 text-xs text-muted-foreground">
              Saldo tersedia
            </p>
          </CardContent>
        </Card>

        {/* Total Porsi Tersalurkan */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Porsi Tersalurkan
            </CardTitle>
            <UtensilsCrossed className="size-5 text-indigo-600" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">48,500</p>
            <p className="mt-1 text-xs text-muted-foreground">
              Jan–Jun 2026
            </p>
          </CardContent>
        </Card>
      </div>

      {/* ---- Charts ---- */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Grafik Keuangan — BarChart */}
        <Card>
          <CardHeader>
            <CardTitle>Grafik Keuangan (Dana Masuk vs Keluar)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              {mounted && (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={MOCK_KAS}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="bulan" />
                    <YAxis tickFormatter={(v) => typeof v === 'number' ? `${(v / 1_000_000).toFixed(0)}M` : v} />
                    <Tooltip
                      formatter={(value) => formatRupiah(Number(value))}
                    />
                    <Bar
                      dataKey="masuk"
                      fill="#0D904F"
                      name="Dana Masuk"
                      radius={[4, 4, 0, 0]}
                    />
                    <Bar
                      dataKey="keluar"
                      fill="#D93025"
                      name="Dana Keluar"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Porsi Tersalurkan — LineChart */}
        <Card>
          <CardHeader>
            <CardTitle>Porsi Tersalurkan per Bulan</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              {mounted && (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={MOCK_PORSI}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="bulan" />
                    <YAxis />
                    <Tooltip
                      formatter={(value) => Number(value).toLocaleString('id-ID')}
                    />
                    <Line
                      type="monotone"
                      dataKey="porsi"
                      stroke="#1A73E8"
                      strokeWidth={3}
                      name="Porsi Tersalurkan"
                      dot={{ r: 5 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
