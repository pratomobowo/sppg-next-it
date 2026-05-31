'use client'

import Link from 'next/link'
import { useAuth } from '@/lib/auth'
import { formatRupiah } from '@/lib/utils'

import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

import {
  ClipboardList,
  AlertTriangle,
  Eye,
  Inbox,
} from 'lucide-react'

// ─── Mock Data ───────────────────────────────────────────────

const mockApprovalQueue = [
  {
    id: 'DO-042',
    pic: 'Ahmad Fauzi',
    dapur: 'Dapur Al-Falah 01',
    supplier: 'PT Sumber Pangan Sejahtera',
    total: 2450000,
    tanggal: '30 Mei 2026',
    flagged: true,
  },
  {
    id: 'DO-040',
    pic: 'Rina Agustina',
    dapur: 'Dapur Al-Falah 02',
    supplier: 'CV Agro Makmur',
    total: 3200000,
    tanggal: '28 Mei 2026',
    flagged: true,
  },
  {
    id: 'DO-038',
    pic: 'Ahmad Fauzi',
    dapur: 'Dapur Al-Falah 01',
    supplier: 'PT Sumber Pangan Sejahtera',
    total: 2900000,
    tanggal: '26 Mei 2026',
    flagged: false,
  },
  {
    id: 'DO-035',
    pic: 'Dimas Pratama',
    dapur: 'Dapur Nurul Iman 01',
    supplier: 'PT Pangan Nusantara',
    total: 980000,
    tanggal: '23 Mei 2026',
    flagged: false,
  },
  {
    id: 'DO-032',
    pic: 'Ahmad Fauzi',
    dapur: 'Dapur Al-Falah 01',
    supplier: 'UD Berkah Tani',
    total: 1750000,
    tanggal: '20 Mei 2026',
    flagged: true,
  },
]

export default function ApprovalQueuePage() {
  const { currentUser } = useAuth()

  // For mock purposes, show the queue. In production, this would be role-filtered.
  const firstName = currentUser?.firstName ?? 'User'
  const role = currentUser?.role ?? 'Approver'

  return (
    <div className="space-y-6 py-6">
      {/* ── Greeting ── */}
      <div>
        <h1 className="text-2xl font-bold">
          Selamat datang, {firstName}
        </h1>
        <p className="text-sm text-muted-foreground">
          {role} — Antrian Persetujuan DO
        </p>
      </div>

      {/* ── Badge Counter ── */}
      <Card className="border-primary/30 bg-primary/5">
        <CardContent className="flex items-center gap-4 pt-6">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
            <ClipboardList className="h-7 w-7 text-primary" />
          </div>
          <div>
            <p className="text-3xl font-bold text-primary">{mockApprovalQueue.length}</p>
            <p className="text-sm text-muted-foreground">DO menunggu persetujuan Anda</p>
          </div>
        </CardContent>
      </Card>

      {/* ── Approval Table ── */}
      {mockApprovalQueue.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16 text-muted-foreground">
            <Inbox className="mb-3 h-12 w-12" />
            <p className="text-lg font-medium">Tidak ada DO yang menunggu persetujuan</p>
            <p className="text-sm">Semua DO telah diproses. Terima kasih!</p>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-0">
            {/* Header */}
            <div className="hidden border-b bg-muted/40 px-6 py-3 text-xs font-semibold uppercase text-muted-foreground sm:grid sm:grid-cols-7">
              <div>No DO</div>
              <div>PIC</div>
              <div>Dapur</div>
              <div>Supplier</div>
              <div>Total</div>
              <div>Tanggal</div>
              <div className="text-center">Aksi</div>
            </div>

            {/* Rows */}
            {mockApprovalQueue.map((d) => (
              <div
                key={d.id}
                className="flex flex-col gap-2 border-b px-6 py-4 last:border-b-0 sm:grid sm:grid-cols-7 sm:items-center"
              >
                <div className="flex items-center gap-1.5">
                  <span className="font-mono text-sm font-semibold">{d.id}</span>
                  {d.flagged && (
                    <AlertTriangle className="h-4 w-4 text-red-500" aria-label="Price warning" />
                  )}
                </div>
                <div className="text-sm">{d.pic}</div>
                <div className="text-sm text-muted-foreground">{d.dapur}</div>
                <div className="text-sm">{d.supplier}</div>
                <div className="text-sm font-medium">{formatRupiah(d.total)}</div>
                <div className="text-sm text-muted-foreground">{d.tanggal}</div>
                <div className="flex items-center justify-end sm:justify-center">
                  <Link href={`/approval-queue/${d.id}`}>
                    <Button variant="outline" size="sm">
                      <Eye className="mr-1 h-3.5 w-3.5" />
                      Review
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
