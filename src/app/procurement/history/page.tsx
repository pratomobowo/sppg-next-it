'use client'

import { useState } from 'react'
import Link from 'next/link'
import { formatRupiah } from '@/lib/utils'

import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

import {
  Search,
  ChevronLeft,
  ChevronRight,
  Eye,
  Calendar,
  Filter,
} from 'lucide-react'

// ─── Mock Data ───────────────────────────────────────────────

const statusColors: Record<string, string> = {
  Draft: 'bg-gray-100 text-gray-700',
  'Pending SPPG': 'bg-yellow-100 text-yellow-700',
  'Pending SPPI': 'bg-orange-100 text-orange-700',
  'Pending Full Auth': 'bg-blue-100 text-blue-700',
  Approved: 'bg-green-100 text-green-700',
  Revised: 'bg-red-100 text-red-700',
}

const mockDO = [
  { id: 'DO-042', tanggal: '30 Mei 2026', supplier: 'PT Sumber Pangan Sejahtera', total: 2450000, status: 'Pending SPPG' },
  { id: 'DO-041', tanggal: '29 Mei 2026', supplier: 'UD Berkah Tani', total: 1875000, status: 'Draft' },
  { id: 'DO-040', tanggal: '28 Mei 2026', supplier: 'CV Agro Makmur', total: 3200000, status: 'Pending SPPI' },
  { id: 'DO-039', tanggal: '27 Mei 2026', supplier: 'PT Pangan Nusantara', total: 1560000, status: 'Approved' },
  { id: 'DO-038', tanggal: '26 Mei 2026', supplier: 'PT Sumber Pangan Sejahtera', total: 2900000, status: 'Pending Full Auth' },
  { id: 'DO-037', tanggal: '25 Mei 2026', supplier: 'UD Berkah Tani', total: 1125000, status: 'Revised' },
  { id: 'DO-036', tanggal: '24 Mei 2026', supplier: 'CV Agro Makmur', total: 4300000, status: 'Approved' },
  { id: 'DO-035', tanggal: '23 Mei 2026', supplier: 'PT Pangan Nusantara', total: 980000, status: 'Pending SPPG' },
]

const supplierList = [
  'Semua Supplier',
  'PT Sumber Pangan Sejahtera',
  'UD Berkah Tani',
  'CV Agro Makmur',
  'PT Pangan Nusantara',
]

const statusList = [
  'Draft',
  'Pending SPPG',
  'Pending SPPI',
  'Pending Full Auth',
  'Approved',
  'Revised',
]

// ─── Pagination constants ──

const PAGE_SIZE = 6

export default function HistoryDOPage() {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('Semua')
  const [supplierFilter, setSupplierFilter] = useState<string>('Semua Supplier')
  const [page, setPage] = useState(0)

  // Filter
  let filtered = mockDO

  if (search) {
    const q = search.toLowerCase()
    filtered = filtered.filter(
      (d) =>
        d.id.toLowerCase().includes(q) ||
        d.supplier.toLowerCase().includes(q)
    )
  }

  if (statusFilter !== 'Semua') {
    filtered = filtered.filter((d) => d.status === statusFilter)
  }

  if (supplierFilter !== 'Semua Supplier') {
    filtered = filtered.filter((d) => d.supplier === supplierFilter)
  }

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE)
  const paged = filtered.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE)

  return (
    <div className="space-y-6 py-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Riwayat DO</h1>
          <p className="text-sm text-muted-foreground">
            Daftar seluruh Surat Pesanan (Delivery Order)
          </p>
        </div>
      </div>

      {/* ── Filter Bar ── */}
      <Card>
        <CardContent className="flex flex-wrap items-end gap-3 pt-6">
          {/* Search */}
          <div className="relative min-w-[200px] flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Cari No DO atau Supplier..."
              className="pl-8"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value)
                setPage(0)
              }}
            />
          </div>

          {/* Status filter */}
          <div className="w-44">
            <Select value={statusFilter} onValueChange={(v) => { setStatusFilter(v); setPage(0) }}>
              <SelectTrigger>
                <Filter className="mr-1 h-3.5 w-3.5" />
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Semua">Semua Status</SelectItem>
                {statusList.map((s) => (
                  <SelectItem key={s} value={s}>
                    {s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Supplier filter */}
          <div className="w-56">
            <Select value={supplierFilter} onValueChange={(v) => { setSupplierFilter(v); setPage(0) }}>
              <SelectTrigger>
                <SelectValue placeholder="Supplier" />
              </SelectTrigger>
              <SelectContent>
                {supplierList.map((s) => (
                  <SelectItem key={s} value={s}>
                    {s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* ── Table ── */}
      <Card>
        <CardContent className="p-0">
          {/* Table header */}
          <div className="hidden border-b bg-muted/40 px-6 py-3 text-xs font-semibold uppercase text-muted-foreground sm:grid sm:grid-cols-6">
            <div>No DO</div>
            <div>Tanggal</div>
            <div className="col-span-2">Supplier</div>
            <div>Total</div>
            <div className="text-center">Status</div>
            {/* Aksi column implicit on mobile */}
          </div>

          {paged.length === 0 ? (
            <div className="flex flex-col items-center justify-center px-6 py-16 text-muted-foreground">
              <Calendar className="mb-2 h-10 w-10" />
              <p className="text-sm">Tidak ada DO yang ditemukan</p>
            </div>
          ) : (
            paged.map((d) => (
              <div
                key={d.id}
                className="flex flex-col gap-2 border-b px-6 py-4 last:border-b-0 sm:grid sm:grid-cols-6 sm:items-center"
              >
                <div className="font-mono text-sm font-semibold">{d.id}</div>
                <div className="text-sm text-muted-foreground">{d.tanggal}</div>
                <div className="col-span-2 text-sm">{d.supplier}</div>
                <div className="text-sm font-medium">{formatRupiah(d.total)}</div>
                <div className="flex items-center justify-between sm:justify-center">
                  <Badge className={statusColors[d.status] || ''}>{d.status}</Badge>
                  <Link href={`/approval-queue/${d.id}`} className="sm:hidden">
                    <Button variant="ghost" size="sm">
                      <Eye className="mr-1 h-3.5 w-3.5" />
                      Lihat
                    </Button>
                  </Link>
                </div>
                <div className="hidden text-center sm:block">
                  <Link href={`/approval-queue/${d.id}`}>
                    <Button variant="ghost" size="sm">
                      <Eye className="mr-1 h-3.5 w-3.5" />
                      Lihat
                    </Button>
                  </Link>
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      {/* ── Pagination ── */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-3">
          <Button
            variant="outline"
            size="sm"
            disabled={page === 0}
            onClick={() => setPage((p) => Math.max(0, p - 1))}
          >
            <ChevronLeft className="mr-1 h-4 w-4" />
            Sebelumnya
          </Button>
          <span className="text-sm text-muted-foreground">
            Halaman {page + 1} dari {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            disabled={page >= totalPages - 1}
            onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
          >
            Selanjutnya
            <ChevronRight className="ml-1 h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  )
}
