'use client'

import { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth'
import { formatRupiah } from '@/lib/utils'

import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

import {
  Check,
  X,
  AlertTriangle,
  ChevronLeft,
  Clock,
  User,
  Phone,
  ShoppingCart,
  Send,
  Ban,
  FileText,
} from 'lucide-react'

// ─── Mock Data ───────────────────────────────────────────────

type DOItem = {
  item: string
  qty: number
  harga: number
  flagged: boolean
  hargaAcuan?: number
}

type TimelineEntry = {
  actor: string
  role: string
  action: string
  timestamp: string
  catatan?: string
}

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

// Use the DO id to generate slightly different mock data
function getMockDO(doId: string) {
  const num = parseInt(doId.replace('DO-', '')) || 42

  return {
    id: doId,
    supplier: {
      nama: 'PT Sumber Pangan Sejahtera',
      kontak: '0812-3456-7890',
      alamat: 'Jl. Raya Bogor KM 30, Jakarta Timur',
    },
    items: [
      { item: 'Beras', qty: 50, harga: 12800, flagged: true, hargaAcuan: 12000 },
      { item: 'Minyak Goreng', qty: 20, harga: 16000, flagged: false },
      { item: 'Telur', qty: 30, harga: 28000, flagged: false },
      { item: 'Ayam', qty: 15, harga: 37500, flagged: true, hargaAcuan: 35000 },
      { item: 'Sayur', qty: 40, harga: 8000, flagged: false },
    ] as DOItem[],
    catatan: 'Mohon segera diproses untuk kebutuhan dapur minggu ini.',
    total: 2450000,
    pic: 'Ahmad Fauzi',
    dapur: 'Dapur Al-Falah 01',
    tanggal: '30 Mei 2026',
    currentStep: 'SPPG' as const, // PIC | SPPG | SPPI | Full Auth | Approved
    timeline: [
      {
        actor: 'Ahmad Fauzi',
        role: 'PIC Dapur (Admin Yayasan)',
        action: 'membuat DO',
        timestamp: '2 jam lalu',
      },
    ] as TimelineEntry[],
  }
}

// ─── Component ───────────────────────────────────────────────

const STEPS = [
  { key: 'PIC', label: 'PIC' },
  { key: 'SPPG', label: 'SPPG' },
  { key: 'SPPI', label: 'SPPI' },
  { key: 'Full Auth', label: 'Full Auth' },
  { key: 'Approved', label: 'Approved' },
]

export default function ApprovalDetailDOPage() {
  const params = useParams()
  const router = useRouter()
  const { currentUser } = useAuth()

  const doId = (params.doId as string) || 'DO-042'
  const [data] = useState(() => getMockDO(doId))
  const dataCurrentStep: string = data.currentStep

  const [showApproveDialog, setShowApproveDialog] = useState(false)
  const [showRejectDialog, setShowRejectDialog] = useState(false)
  const [rejectNote, setRejectNote] = useState('')
  const [localStep, setLocalStep] = useState<string>(data.currentStep)
  const [timeline, setTimeline] = useState(data.timeline)

  // Determine if user is the current approver
  const roleToStep: Record<string, string> = {
    'Kepala SPPG (Lvl 1)': 'SPPG',
    'Kepala SPPI (Lvl 2)': 'SPPI',
    'Full Authorize (Lvl 3)': 'Full Auth',
    'PIC Dapur (Admin Yayasan)': 'PIC',
  }
  const userStep = roleToStep[currentUser?.role ?? ''] ?? ''
  const isCurrentApprover = userStep === localStep

  // ── Handlers ──

  const handleApprove = () => {
    // Move step forward
    const currentIdx = STEPS.findIndex((s) => s.key === localStep)
    const next = STEPS[currentIdx + 1]?.key ?? 'Approved'
    setLocalStep(next)

    setTimeline((prev) => [
      {
        actor: currentUser?.firstName
          ? `${currentUser.firstName} ${currentUser.lastName ?? ''}`
          : 'Approver',
        role: currentUser?.role ?? 'Approver',
        action: 'menyetujui DO',
        timestamp: 'baru saja',
      },
      ...prev,
    ])

    setShowApproveDialog(false)
    // toast would fire here in production
  }

  const handleReject = () => {
    if (!rejectNote.trim()) return

    setLocalStep('PIC') // Back to PIC for revision

    setTimeline((prev) => [
      {
        actor: currentUser?.firstName
          ? `${currentUser.firstName} ${currentUser.lastName ?? ''}`
          : 'Approver',
        role: currentUser?.role ?? 'Approver',
        action: 'menolak DO',
        timestamp: 'baru saja',
        catatan: rejectNote,
      },
      ...prev,
    ])

    setShowRejectDialog(false)
    setRejectNote('')
  }

  const currentStepIdx = STEPS.findIndex((s) => s.key === localStep)
  const isApproved = localStep === 'Approved'
  const isRevised = localStep === 'PIC' && dataCurrentStep !== 'PIC'

  return (
    <div className="space-y-6 py-6">
      {/* ── Header ── */}
      <div className="flex items-center gap-3">
        <Button variant="outline" size="icon" onClick={() => router.back()}>
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold">{data.id}</h1>
          <p className="text-sm text-muted-foreground">
            Detail & Persetujuan Delivery Order
          </p>
        </div>
      </div>

      {/* ── Split Layout ── */}
      <div className="flex flex-col gap-6 lg:flex-row">
        {/* ── Left Panel: Detail DO ── */}
        <div className="flex-1 space-y-4">
          {/* Supplier Info */}
          <Card>
            <CardContent className="space-y-2 pt-6">
              <h3 className="font-semibold">Informasi Supplier</h3>
              <div className="flex items-center gap-2 text-sm">
                <User className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">{data.supplier.nama}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span>{data.supplier.kontak}</span>
              </div>
            </CardContent>
          </Card>

          {/* Item Table */}
          <Card>
            <CardContent className="space-y-4 pt-6">
              <h3 className="font-semibold">Item Belanja</h3>

              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b text-left text-xs font-semibold uppercase text-muted-foreground">
                      <th className="pb-2 pr-4">Item</th>
                      <th className="pb-2 px-2 text-center">Qty</th>
                      <th className="pb-2 px-2 text-right">Harga Satuan</th>
                      <th className="pb-2 pl-2 text-right">Subtotal</th>
                      <th className="pb-2 w-8" />
                    </tr>
                  </thead>
                  <tbody>
                    {data.items.map((it, i) => (
                      <tr key={i} className="border-b last:border-0">
                        <td className={`py-2.5 pr-4 ${it.flagged ? 'text-red-600' : ''}`}>
                          {it.item}
                        </td>
                        <td className="px-2 py-2.5 text-center">{it.qty}</td>
                        <td className="px-2 py-2.5 text-right">
                          <span className={it.flagged ? 'text-red-600' : ''}>
                            {formatRupiah(it.harga)}
                          </span>
                        </td>
                        <td className="py-2.5 pl-2 text-right font-medium">
                          {formatRupiah(it.qty * it.harga)}
                        </td>
                        <td className="py-2.5">
                          {it.flagged && (
                            <AlertTriangle className="h-4 w-4 text-red-500" />
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr>
                      <td colSpan={3} className="pt-3 text-right font-semibold">
                        Total
                      </td>
                      <td className="pt-3 pl-2 text-right text-lg font-bold text-primary">
                        {formatRupiah(data.items.reduce((s, it) => s + it.qty * it.harga, 0))}
                      </td>
                      <td />
                    </tr>
                  </tfoot>
                </table>
              </div>

              {/* Price Guard Legend */}
              {data.items.some((it) => it.flagged) && (
                <div className="flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                  <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
                  <div>
                    <p className="font-medium">Peringatan Harga</p>
                    <p>
                      Beberapa item memiliki harga di atas 5% dari harga acuan.
                      Mohon ditinjau sebelum menyetujui.
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Catatan PIC */}
          {data.catatan && (
            <Card>
              <CardContent className="space-y-1 pt-6">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  <h3 className="text-sm font-semibold">Catatan dari PIC</h3>
                </div>
                <p className="text-sm text-muted-foreground">{data.catatan}</p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* ── Right Panel: Approval Actions ── */}
        <div className="w-full space-y-4 lg:w-80 lg:shrink-0">
          {/* Progress Steps */}
          <Card>
            <CardContent className="pt-6">
              <h3 className="mb-4 text-sm font-semibold">Progress Persetujuan</h3>
              <div className="flex items-start justify-between">
                {STEPS.map((s, idx) => {
                  const isCompleted = idx < currentStepIdx || isApproved
                  const isCurrent = s.key === localStep && !isApproved
                  const isPending = idx > currentStepIdx && !isApproved

                  let circleClass = 'bg-muted text-muted-foreground border-muted' // pending
                  if (isCompleted) circleClass = 'bg-green-500 text-white border-green-500'
                  if (isCurrent) circleClass = 'bg-primary text-primary-foreground border-primary'

                  return (
                    <div key={s.key} className="flex flex-col items-center">
                      <div
                        className={`flex h-8 w-8 items-center justify-center rounded-full border-2 text-xs font-bold ${circleClass}`}
                      >
                        {isCompleted ? <Check className="h-3.5 w-3.5" /> : idx + 1}
                      </div>
                      <span
                        className={`mt-1 text-center text-[10px] leading-tight font-medium
                          ${isCurrent ? 'text-primary' : isCompleted ? 'text-green-600' : 'text-muted-foreground'}
                        `}
                      >
                        {s.label}
                      </span>
                    </div>
                  )
                })}
              </div>

              {/* Connecting lines */}
              <div className="relative mt-[-28px] px-4">
                <div className="absolute left-4 right-4 top-4 h-[2px] bg-muted">
                  {STEPS.map((_, idx) => {
                    if (idx >= STEPS.length - 1) return null
                    const isCompleted = idx < currentStepIdx || isApproved
                    return (
                      <div
                        key={idx}
                        className="absolute top-0 h-full bg-green-500"
                        style={{
                          left: `${(idx / (STEPS.length - 1)) * 100}%`,
                          width: isCompleted ? `${(1 / (STEPS.length - 1)) * 100}%` : '0%',
                        }}
                      />
                    )
                  })}
                </div>
              </div>

              {/* Status badge */}
              <div className="mt-4 text-center">
                {isApproved ? (
                  <Badge className="bg-green-100 text-green-700">Disetujui</Badge>
                ) : isRevised ? (
                  <Badge className="bg-red-100 text-red-700">Direvisi</Badge>
                ) : (
                  <Badge className="bg-blue-100 text-blue-700">Menunggu {localStep}</Badge>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Timeline Log */}
          <Card>
            <CardContent className="pt-6">
              <h3 className="mb-3 text-sm font-semibold">Log Aktivitas</h3>
              <div className="space-y-3">
                {timeline.map((entry, idx) => (
                  <div key={idx} className="flex gap-2.5 text-sm">
                    <div className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-muted">
                      <Clock className="h-3 w-3 text-muted-foreground" />
                    </div>
                    <div>
                      <p>
                        <span className="font-medium">{entry.actor}</span>{' '}
                        <span className="text-muted-foreground">({entry.role})</span>{' '}
                        {entry.action}
                      </p>
                      <p className="text-xs text-muted-foreground">{entry.timestamp}</p>
                      {entry.catatan && (
                        <div className="mt-1 rounded bg-red-50 px-2 py-1 text-xs text-red-700">
                          Catatan: {entry.catatan}
                        </div>
                      )}
                    </div>
                  </div>
                ))}

                {timeline.length === 0 && (
                  <p className="text-sm text-muted-foreground">Belum ada aktivitas.</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          {!isApproved && (
            <Card>
              <CardContent className="space-y-3 pt-6">
                {isCurrentApprover ? (
                  <>
                    <Button
                      className="w-full"
                      size="lg"
                      onClick={() => setShowApproveDialog(true)}
                    >
                      <Check className="mr-2 h-4 w-4" />
                      Setujui
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full border-red-300 text-red-600 hover:bg-red-50 hover:text-red-700"
                      size="lg"
                      onClick={() => setShowRejectDialog(true)}
                    >
                      <X className="mr-2 h-4 w-4" />
                      Tolak
                    </Button>
                  </>
                ) : (
                  <div className="flex flex-col items-center gap-2 py-2 text-center text-sm text-muted-foreground">
                    <Clock className="h-6 w-6" />
                    <p>
                      Menunggu persetujuan dari <strong>{localStep}</strong>
                    </p>
                    {isRevised && (
                      <p className="text-xs text-red-500">
                        DO ini perlu direvisi oleh PIC sebelum diajukan kembali.
                      </p>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* ── Dialog: Setujui ── */}
      <Dialog open={showApproveDialog} onOpenChange={setShowApproveDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Konfirmasi Persetujuan</DialogTitle>
            <DialogDescription>
              Anda yakin menyetujui DO <strong>{data.id}</strong>?
            </DialogDescription>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            Setelah disetujui, DO akan diteruskan ke tahap persetujuan berikutnya.
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowApproveDialog(false)}>
              Batal
            </Button>
            <Button onClick={handleApprove}>
              <Check className="mr-2 h-4 w-4" />
              Ya, Setujui
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── Dialog: Tolak ── */}
      <Dialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Tolak Delivery Order</DialogTitle>
            <DialogDescription>
              Berikan catatan revisi yang jelas agar PIC dapat memperbaiki DO ini.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2">
            <Label htmlFor="reject-note">
              Catatan Revisi <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="reject-note"
              placeholder="Tulis alasan penolakan dan revisi yang diperlukan..."
              rows={4}
              value={rejectNote}
              onChange={(e) => setRejectNote(e.target.value)}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setShowRejectDialog(false); setRejectNote('') }}>
              Batal
            </Button>
            <Button
              variant="destructive"
              onClick={handleReject}
              disabled={!rejectNote.trim()}
            >
              <Ban className="mr-2 h-4 w-4" />
              Tolak DO
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
