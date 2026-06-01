'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  ArrowLeftIcon,
  BuildingIcon,
  UserIcon,
  ShieldIcon,
  CheckIcon,
  ChevronRightIcon,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { toast } from 'sonner'
import { PLAN_CONFIG, type TenantPlan, type UserRole } from '@/lib/tenant-data'
import { cn } from '@/lib/utils'

const STEPS = [
  { id: 1, label: 'Data Yayasan', icon: BuildingIcon },
  { id: 2, label: 'Paket & Akses', icon: ShieldIcon },
  { id: 3, label: 'Admin Pertama', icon: UserIcon },
  { id: 4, label: 'Konfirmasi', icon: CheckIcon },
]

const ROLE_OPTIONS: UserRole[] = [
  'Super Administrator',
  'PIC Dapur (Admin Yayasan)',
  'Full Authorize (Lvl 3)',
]

export default function NewTenantPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)

  // Step 1
  const [namaYayasan, setNamaYayasan] = useState('')
  const [npwp, setNpwp] = useState('')
  const [alamat, setAlamat] = useState('')
  const [kota, setKota] = useState('')
  const [provinsi, setProvinsi] = useState('')
  const [picNama, setPicNama] = useState('')
  const [picEmail, setPicEmail] = useState('')
  const [picTelp, setPicTelp] = useState('')

  // Step 2
  const [plan, setPlan] = useState<TenantPlan>('Starter')

  // Step 3
  const [adminNama, setAdminNama] = useState('')
  const [adminEmail, setAdminEmail] = useState('')
  const [adminRole, setAdminRole] = useState<UserRole>('Super Administrator')

  const [isSubmitting, setIsSubmitting] = useState(false)

  const validateStep = (s: number): boolean => {
    if (s === 1) {
      if (!namaYayasan || !kota || !picEmail) {
        toast.error('Lengkapi Nama Yayasan, Kota, dan Email PIC.')
        return false
      }
      if (!/\S+@\S+\.\S+/.test(picEmail)) {
        toast.error('Format email PIC tidak valid.')
        return false
      }
    }
    if (s === 3) {
      if (!adminEmail) {
        toast.error('Email admin pertama wajib diisi.')
        return false
      }
      if (!/\S+@\S+\.\S+/.test(adminEmail)) {
        toast.error('Format email admin tidak valid.')
        return false
      }
    }
    return true
  }

  const next = () => {
    if (!validateStep(step)) return
    setStep(s => Math.min(s + 1, 4))
  }

  const prev = () => setStep(s => Math.max(s - 1, 1))

  const handleSubmit = async () => {
    setIsSubmitting(true)
    await new Promise(r => setTimeout(r, 1200))
    toast.success(`Yayasan "${namaYayasan}" berhasil didaftarkan! Email undangan dikirim ke ${adminEmail}.`)
    setIsSubmitting(false)
    router.push('/tenant-management')
  }

  const planConfig = PLAN_CONFIG[plan]

  return (
    <div className="p-6 max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/tenant-management"><ArrowLeftIcon className="size-4" /></Link>
        </Button>
        <div>
          <h1 className="text-xl font-bold">Tambah Yayasan Baru</h1>
          <p className="text-sm text-muted-foreground">Daftarkan yayasan baru ke platform SPPG MBG.</p>
        </div>
      </div>

      {/* Stepper */}
      <div className="flex items-center justify-between">
        {STEPS.map((s, i) => {
          const Icon = s.icon
          const isActive = step === s.id
          const isDone = step > s.id
          return (
            <div key={s.id} className="flex items-center flex-1">
              <div className={cn(
                'flex items-center gap-2 text-xs font-medium transition-colors',
                isActive ? 'text-primary' : isDone ? 'text-emerald-600' : 'text-muted-foreground'
              )}>
                <div className={cn(
                  'size-8 rounded-full flex items-center justify-center border-2 transition-all',
                  isActive ? 'border-primary bg-primary text-primary-foreground' :
                    isDone ? 'border-emerald-500 bg-emerald-500 text-white' :
                      'border-border bg-background'
                )}>
                  {isDone ? <CheckIcon className="size-3.5" /> : <Icon className="size-3.5" />}
                </div>
                <span className="hidden sm:block">{s.label}</span>
              </div>
              {i < STEPS.length - 1 && (
                <div className={cn('flex-1 h-px mx-3 transition-colors', step > s.id ? 'bg-emerald-400' : 'bg-border')} />
              )}
            </div>
          )
        })}
      </div>

      {/* Step Cards */}
      <Card>
        {/* ── Step 1: Data Yayasan ── */}
        {step === 1 && (
          <>
            <CardHeader>
              <CardTitle className="text-base">Data Yayasan</CardTitle>
              <CardDescription className="text-xs">Informasi dasar organisasi / yayasan.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="nama-yayasan">Nama Yayasan <span className="text-destructive">*</span></Label>
                <Input id="nama-yayasan" placeholder="Yayasan Al-Falah" value={namaYayasan} onChange={e => setNamaYayasan(e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="npwp">NPWP</Label>
                <Input id="npwp" placeholder="01.234.567.8-901.000" value={npwp} onChange={e => setNpwp(e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="alamat">Alamat</Label>
                <Input id="alamat" placeholder="Jl. Merdeka No. 1" value={alamat} onChange={e => setAlamat(e.target.value)} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="kota">Kota <span className="text-destructive">*</span></Label>
                  <Input id="kota" placeholder="Jakarta" value={kota} onChange={e => setKota(e.target.value)} />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="provinsi">Provinsi</Label>
                  <Input id="provinsi" placeholder="DKI Jakarta" value={provinsi} onChange={e => setProvinsi(e.target.value)} />
                </div>
              </div>
              <Separator />
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Kontak PIC</p>
              <div className="space-y-1.5">
                <Label htmlFor="pic-nama">Nama PIC</Label>
                <Input id="pic-nama" placeholder="H. Ahmad Fauzi" value={picNama} onChange={e => setPicNama(e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="pic-email">Email PIC <span className="text-destructive">*</span></Label>
                <Input id="pic-email" type="email" placeholder="pic@yayasan.org" value={picEmail} onChange={e => setPicEmail(e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="pic-telp">Telepon PIC</Label>
                <Input id="pic-telp" placeholder="08xxxxxxxxx" value={picTelp} onChange={e => setPicTelp(e.target.value)} />
              </div>
            </CardContent>
          </>
        )}

        {/* ── Step 2: Paket ── */}
        {step === 2 && (
          <>
            <CardHeader>
              <CardTitle className="text-base">Pilih Paket</CardTitle>
              <CardDescription className="text-xs">Paket menentukan kuota dapur, user, dan fitur yang tersedia.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {(['Starter', 'Pro', 'Enterprise'] as TenantPlan[]).map(p => {
                const pc = PLAN_CONFIG[p]
                const isSelected = plan === p
                return (
                  <button
                    key={p}
                    onClick={() => setPlan(p)}
                    className={cn(
                      'w-full text-left p-4 rounded-xl border-2 transition-all',
                      isSelected ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/40 bg-background'
                    )}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Badge className={`border ${pc.bgColor} ${pc.color} text-xs`}>{pc.label}</Badge>
                        {isSelected && <CheckIcon className="size-4 text-primary" />}
                      </div>
                      <span className="text-xs text-muted-foreground">
                        Maks {pc.maksDapur >= 999 ? '∞' : pc.maksDapur} dapur · {pc.maksUser >= 999 ? '∞' : pc.maksUser} user
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {pc.fitur.map(f => (
                        <span key={f} className="text-[10px] bg-muted px-2 py-0.5 rounded-full text-muted-foreground">{f}</span>
                      ))}
                    </div>
                  </button>
                )
              })}
            </CardContent>
          </>
        )}

        {/* ── Step 3: Admin ── */}
        {step === 3 && (
          <>
            <CardHeader>
              <CardTitle className="text-base">Admin Pertama</CardTitle>
              <CardDescription className="text-xs">User ini akan menerima email undangan untuk mengelola tenant.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="admin-nama">Nama Admin</Label>
                <Input id="admin-nama" placeholder="Ahmad Fauzi" value={adminNama} onChange={e => setAdminNama(e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="admin-email">Email Admin <span className="text-destructive">*</span></Label>
                <Input id="admin-email" type="email" placeholder="admin@yayasan.org" value={adminEmail} onChange={e => setAdminEmail(e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="admin-role">Role</Label>
                <Select value={adminRole} onValueChange={v => setAdminRole(v as UserRole)}>
                  <SelectTrigger id="admin-role">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {ROLE_OPTIONS.map(r => <SelectItem key={r} value={r}>{r}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="rounded-xl border border-blue-500/20 bg-blue-500/5 p-3 text-xs text-blue-600 dark:text-blue-400">
                📧 Email undangan berisi link aktivasi akan dikirim ke <strong>{adminEmail || 'email admin'}</strong> setelah yayasan berhasil dibuat.
              </div>
            </CardContent>
          </>
        )}

        {/* ── Step 4: Konfirmasi ── */}
        {step === 4 && (
          <>
            <CardHeader>
              <CardTitle className="text-base">Konfirmasi Data</CardTitle>
              <CardDescription className="text-xs">Pastikan semua data sudah benar sebelum mendaftarkan yayasan.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Yayasan</p>
                {[
                  ['Nama', namaYayasan],
                  ['NPWP', npwp || '—'],
                  ['Kota', `${kota}${provinsi ? ', ' + provinsi : ''}`],
                  ['PIC', `${picNama || '—'} (${picEmail})`],
                ].map(([k, v]) => (
                  <div key={k} className="flex justify-between text-sm py-1 border-b border-border/40 last:border-0">
                    <span className="text-muted-foreground">{k}</span>
                    <span className="font-medium text-right">{v}</span>
                  </div>
                ))}
              </div>
              <div className="space-y-2">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Paket</p>
                <Badge className={`border ${planConfig.bgColor} ${planConfig.color}`}>{plan}</Badge>
                <p className="text-xs text-muted-foreground">
                  Maks {planConfig.maksDapur >= 999 ? 'unlimited' : planConfig.maksDapur} dapur · {planConfig.maksUser >= 999 ? 'unlimited' : planConfig.maksUser} user
                </p>
              </div>
              <div className="space-y-2">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Admin Pertama</p>
                {[
                  ['Nama', adminNama || '—'],
                  ['Email', adminEmail],
                  ['Role', adminRole],
                ].map(([k, v]) => (
                  <div key={k} className="flex justify-between text-sm py-1 border-b border-border/40 last:border-0">
                    <span className="text-muted-foreground">{k}</span>
                    <span className="font-medium text-right">{v}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </>
        )}
      </Card>

      {/* Navigation */}
      <div className="flex justify-between">
        <Button variant="outline" onClick={prev} disabled={step === 1}>
          ← Sebelumnya
        </Button>
        {step < 4 ? (
          <Button onClick={next} className="gap-2">
            Selanjutnya <ChevronRightIcon className="size-4" />
          </Button>
        ) : (
          <Button onClick={handleSubmit} disabled={isSubmitting} className="gap-2">
            {isSubmitting ? 'Mendaftarkan...' : '✓ Daftarkan Yayasan'}
          </Button>
        )}
      </div>
    </div>
  )
}
