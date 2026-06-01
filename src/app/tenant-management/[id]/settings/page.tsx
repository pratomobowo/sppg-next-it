'use client'

import { useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import {
  ArrowLeftIcon,
  SaveIcon,
  BuildingIcon,
  ShieldIcon,
  BellIcon,
  ToggleLeftIcon,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { toast } from 'sonner'
import { getTenantById, PLAN_CONFIG, type TenantPlan } from '@/lib/tenant-data'

const ALL_FITUR = [
  { id: 'Dashboard', label: 'Dashboard', desc: 'Halaman ringkasan operasional dapur' },
  { id: 'Master Data', label: 'Master Data', desc: 'Data dapur, menu, supplier, dan item gizi' },
  { id: 'Procurement', label: 'Procurement / DO', desc: 'Pembuatan dan approval Delivery Order' },
  { id: 'Inventory', label: 'Inventory', desc: 'Stok bahan baku dan penerimaan barang' },
  { id: 'Laporan Harian', label: 'Laporan Harian', desc: 'Laporan produksi dan distribusi harian' },
  { id: 'Accounting', label: 'Accounting', desc: 'Kas masuk/keluar, anggaran, dana 12 hari' },
  { id: 'Maps & CCTV', label: 'Maps & CCTV', desc: 'Peta lokasi dapur dan monitoring CCTV' },
  { id: 'WA Gateway', label: 'WA Gateway', desc: 'Notifikasi WhatsApp otomatis' },
  { id: 'AI Helper', label: 'AI Helper', desc: 'Asisten AI analitik operasional SPPG' },
  { id: 'Custom Branding', label: 'Custom Branding', desc: 'Logo dan tampilan custom per yayasan' },
  { id: 'Analytics Lanjutan', label: 'Analytics Lanjutan', desc: 'Laporan analitik mendalam dan export' },
  { id: 'Priority Support', label: 'Priority Support', desc: 'Layanan dukungan prioritas 24/7' },
]

export default function TenantSettingsPage() {
  const params = useParams<{ id: string }>()
  const tenant = getTenantById(params.id)

  const [namaPlatform, setNamaPlatform] = useState(tenant?.namaPlatform ?? '')
  const [picNama, setPicNama] = useState(tenant?.picNama ?? '')
  const [picEmail, setPicEmail] = useState(tenant?.picEmail ?? '')
  const [picTelp, setPicTelp] = useState(tenant?.picTelp ?? '')
  const [plan, setPlan] = useState<TenantPlan>(tenant?.plan ?? 'Starter')
  const [fiturAktif, setFiturAktif] = useState<string[]>(tenant?.fiturAktif ?? [])
  const [notifTrialHabis, setNotifTrialHabis] = useState(true)
  const [notifInaktif, setNotifInaktif] = useState(true)
  const [notifStokKritis, setNotifStokKritis] = useState(false)

  if (!tenant) {
    return (
      <div className="p-6 text-center space-y-3">
        <p className="text-muted-foreground">Tenant tidak ditemukan.</p>
        <Button asChild variant="outline"><Link href="/tenant-management">← Kembali</Link></Button>
      </div>
    )
  }

  const toggleFitur = (fiturId: string) => {
    const planFitur = PLAN_CONFIG[plan].fitur
    if (!planFitur.includes(fiturId)) {
      toast.warning(`Fitur "${fiturId}" tidak tersedia di paket ${plan}. Upgrade paket terlebih dahulu.`)
      return
    }
    setFiturAktif(prev =>
      prev.includes(fiturId) ? prev.filter(f => f !== fiturId) : [...prev, fiturId]
    )
  }

  const handleSave = () => {
    toast.success('Pengaturan tenant berhasil disimpan!')
  }

  const planFitur = PLAN_CONFIG[plan].fitur

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href={`/tenant-management/${params.id}`}><ArrowLeftIcon className="size-4" /></Link>
        </Button>
        <div className="flex-1">
          <h1 className="text-xl font-bold">Pengaturan Tenant</h1>
          <p className="text-sm text-muted-foreground">{tenant.namaYayasan}</p>
        </div>
        <Button onClick={handleSave} className="gap-2">
          <SaveIcon className="size-4" />
          Simpan Perubahan
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* ── Informasi Umum ── */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <BuildingIcon className="size-4 text-primary" />
              Informasi Umum
            </CardTitle>
            <CardDescription className="text-xs">Data yayasan dan kontak PIC utama.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1.5">
              <Label>Nama Tampilan Platform</Label>
              <Input value={namaPlatform} onChange={e => setNamaPlatform(e.target.value)} />
              <p className="text-[11px] text-muted-foreground">Nama yang tampil di header dan sidebar sistem.</p>
            </div>
            <Separator />
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Kontak PIC</p>
            <div className="space-y-1.5">
              <Label>Nama PIC</Label>
              <Input value={picNama} onChange={e => setPicNama(e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label>Email PIC</Label>
              <Input type="email" value={picEmail} onChange={e => setPicEmail(e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label>Telepon PIC</Label>
              <Input value={picTelp} onChange={e => setPicTelp(e.target.value)} />
            </div>
          </CardContent>
        </Card>

        {/* ── Paket & Kuota ── */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <ShieldIcon className="size-4 text-violet-500" />
              Paket & Kuota
            </CardTitle>
            <CardDescription className="text-xs">Paket berlangganan menentukan fitur dan batas kuota.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1.5">
              <Label>Paket Berlangganan</Label>
              <Select value={plan} onValueChange={v => setPlan(v as TenantPlan)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {(['Starter', 'Pro', 'Enterprise'] as TenantPlan[]).map(p => (
                    <SelectItem key={p} value={p}>
                      <span className="flex items-center gap-2">
                        <span className={`size-2 rounded-full ${PLAN_CONFIG[p].bgColor.split(' ')[0]}`} />
                        {p} — Maks {PLAN_CONFIG[p].maksDapur >= 999 ? '∞' : PLAN_CONFIG[p].maksDapur} dapur, {PLAN_CONFIG[p].maksUser >= 999 ? '∞' : PLAN_CONFIG[p].maksUser} user
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-lg bg-muted/40 p-3 text-center">
                <p className="text-lg font-bold">{PLAN_CONFIG[plan].maksDapur >= 999 ? '∞' : PLAN_CONFIG[plan].maksDapur}</p>
                <p className="text-[11px] text-muted-foreground">Maks Dapur</p>
              </div>
              <div className="rounded-lg bg-muted/40 p-3 text-center">
                <p className="text-lg font-bold">{PLAN_CONFIG[plan].maksUser >= 999 ? '∞' : PLAN_CONFIG[plan].maksUser}</p>
                <p className="text-[11px] text-muted-foreground">Maks User</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* ── Fitur Toggle ── */}
        <Card className="lg:col-span-2">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <ToggleLeftIcon className="size-4 text-emerald-500" />
              Kontrol Fitur
            </CardTitle>
            <CardDescription className="text-xs">
              Aktifkan atau nonaktifkan modul per tenant. Fitur abu-abu = tidak tersedia di paket {plan}.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {ALL_FITUR.map(fitur => {
                const isAvailable = planFitur.includes(fitur.id)
                const isEnabled = fiturAktif.includes(fitur.id)
                return (
                  <div
                    key={fitur.id}
                    className={`flex items-start gap-3 p-3 rounded-xl border transition-colors ${
                      isAvailable
                        ? isEnabled ? 'border-primary/30 bg-primary/5' : 'border-border/50 bg-muted/20'
                        : 'border-border/30 bg-muted/10 opacity-50'
                    }`}
                  >
                    <Switch
                      id={`fitur-${fitur.id}`}
                      checked={isEnabled}
                      onCheckedChange={() => toggleFitur(fitur.id)}
                      disabled={!isAvailable}
                      className="mt-0.5 shrink-0"
                    />
                    <div className="min-w-0">
                      <label htmlFor={`fitur-${fitur.id}`} className="text-xs font-medium cursor-pointer">
                        {fitur.label}
                        {!isAvailable && (
                          <Badge className="ml-1.5 text-[9px] px-1 py-0 bg-muted text-muted-foreground border-border">
                            {plan === 'Starter' ? 'Pro+' : 'Enterprise'}
                          </Badge>
                        )}
                      </label>
                      <p className="text-[10px] text-muted-foreground leading-relaxed mt-0.5">{fitur.desc}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* ── Notifikasi ── */}
        <Card className="lg:col-span-2">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <BellIcon className="size-4 text-orange-500" />
              Notifikasi & Alert
            </CardTitle>
            <CardDescription className="text-xs">Konfigurasi notifikasi otomatis untuk tenant ini.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { id: 'trial', label: 'Notifikasi Trial Habis', desc: 'Kirim notifikasi saat trial tenant akan berakhir (H-7, H-3, H-1)', value: notifTrialHabis, onChange: setNotifTrialHabis },
              { id: 'inaktif', label: 'Alert Tenant Tidak Aktif', desc: 'Notifikasi jika tidak ada aktivitas selama lebih dari 7 hari', value: notifInaktif, onChange: setNotifInaktif },
              { id: 'stok', label: 'Alert Stok Kritis', desc: 'Kirim peringatan ke admin tenant jika ada bahan baku kritis', value: notifStokKritis, onChange: setNotifStokKritis },
            ].map(n => (
              <div key={n.id} className="flex items-start justify-between gap-4 pb-3 last:pb-0 border-b last:border-b-0 border-border/40">
                <div>
                  <p className="text-sm font-medium">{n.label}</p>
                  <p className="text-[11px] text-muted-foreground mt-0.5">{n.desc}</p>
                </div>
                <Switch id={`notif-${n.id}`} checked={n.value} onCheckedChange={n.onChange} className="shrink-0" />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
