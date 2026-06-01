'use client'

import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import {
  ArrowLeftIcon,
  BuildingIcon,
  UsersIcon,
  HomeIcon,
  ActivityIcon,
  HeartPulseIcon,
  PencilIcon,
  ShieldAlertIcon,
  CheckCircle2Icon,
  ClockIcon,
  XCircleIcon,
  MapPinIcon,
  PhoneIcon,
  MailIcon,
  UserIcon,
  BadgeInfoIcon,
  ChevronRightIcon,
  HashIcon,
  CalendarIcon,
  StarIcon,
  Layers2Icon,
  ZapIcon,
  Settings2Icon,
  ExternalLinkIcon,
  UtensilsIcon,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  getTenantById,
  getUsersByTenant,
  getDapurByTenant,
  getHealthScore,
  PLAN_CONFIG,
  type Tenant,
  type TenantStatus,
  type TenantPlan,
  type DapurStatus,
  type UserStatus,
  type UserRole,
} from '@/lib/tenant-data'

// ─── Helpers ───────────────────────────────────────────────────────────────────

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

function StatusBadge({ status }: { status: TenantStatus }) {
  const map: Record<TenantStatus, { className: string; icon: React.ElementType; label: string }> = {
    Aktif:     { className: 'bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20',   icon: CheckCircle2Icon, label: 'Aktif'     },
    Trial:     { className: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20',       icon: ClockIcon,        label: 'Trial'     },
    Suspended: { className: 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20',           icon: ShieldAlertIcon,  label: 'Suspended' },
    Expired:   { className: 'bg-muted text-muted-foreground border-border',                             icon: XCircleIcon,      label: 'Expired'   },
  }
  const s = map[status]
  const Icon = s.icon
  return (
    <Badge className={`gap-1.5 border px-2.5 py-1 text-xs font-medium ${s.className}`}>
      <Icon className="size-3.5" />
      {s.label}
    </Badge>
  )
}

function PlanBadge({ plan }: { plan: TenantPlan }) {
  const cfg = PLAN_CONFIG[plan]
  return (
    <Badge className={`gap-1.5 border px-2.5 py-1 text-xs font-semibold ${cfg.bgColor} ${cfg.color}`}>
      <StarIcon className="size-3" />
      {cfg.label}
    </Badge>
  )
}

function DapurStatusBadge({ status }: { status: DapurStatus }) {
  const map: Record<DapurStatus, { className: string; label: string }> = {
    Aktif:    { className: 'bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20', label: 'Aktif'    },
    Nonaktif: { className: 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20',         label: 'Nonaktif' },
    Setup:    { className: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20',     label: 'Setup'    },
  }
  const s = map[status]
  return (
    <Badge className={`border text-[11px] px-2 py-0.5 ${s.className}`}>{s.label}</Badge>
  )
}

function UserStatusBadge({ status }: { status: UserStatus }) {
  const map: Record<UserStatus, { className: string; label: string }> = {
    Aktif:          { className: 'bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20', label: 'Aktif'          },
    Nonaktif:       { className: 'bg-muted text-muted-foreground border-border',                           label: 'Nonaktif'       },
    'Pending Invite': { className: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20', label: 'Pending Invite' },
  }
  const s = map[status]
  return (
    <Badge className={`border text-[11px] px-2 py-0.5 ${s.className}`}>{s.label}</Badge>
  )
}

function healthColor(score: number) {
  if (score >= 75) return 'bg-green-500'
  if (score >= 40) return 'bg-yellow-500'
  return 'bg-red-500'
}

function healthLabel(score: number) {
  if (score >= 75) return 'Sehat'
  if (score >= 40) return 'Perlu Perhatian'
  return 'Kritis'
}

function healthTextColor(score: number) {
  if (score >= 75) return 'text-green-600 dark:text-green-400'
  if (score >= 40) return 'text-yellow-600 dark:text-yellow-400'
  return 'text-red-600 dark:text-red-400'
}

function roleBadge(role: UserRole) {
  const map: Record<UserRole, string> = {
    'Super Administrator':        'bg-violet-500/10 text-violet-600 dark:text-violet-400 border-violet-500/20',
    'PIC Dapur (Admin Yayasan)': 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20',
    'Kepala SPPG (Lvl 1)':       'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
    'Kepala SPPI (Lvl 2)':       'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/20',
    'Full Authorize (Lvl 3)':    'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
  }
  return (
    <Badge className={`border text-[10px] px-1.5 py-0 ${map[role]}`}>{role}</Badge>
  )
}

function avatarInitials(name: string) {
  return name.split(' ').slice(0, 2).map(n => n[0]).join('').toUpperCase()
}

const AVATAR_COLORS = [
  'bg-violet-500', 'bg-blue-500', 'bg-emerald-500', 'bg-amber-500',
  'bg-rose-500',   'bg-cyan-500',  'bg-pink-500',    'bg-teal-500',
  'bg-indigo-500', 'bg-orange-500',
]

// ─── KPI Card ──────────────────────────────────────────────────────────────────

function KpiCard({
  label,
  value,
  sub,
  icon: Icon,
  iconColor,
  iconBg,
}: {
  label: string
  value: React.ReactNode
  sub?: string
  icon: React.ElementType
  iconColor: string
  iconBg: string
}) {
  return (
    <Card className="border-border/60 relative overflow-hidden">
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs text-muted-foreground font-medium mb-1">{label}</p>
            <p className="text-2xl font-bold text-foreground tracking-tight">{value}</p>
            {sub && <p className="text-[11px] text-muted-foreground mt-1">{sub}</p>}
          </div>
          <div className={`size-10 rounded-xl ${iconBg} flex items-center justify-center shrink-0`}>
            <Icon className={`size-5 ${iconColor}`} />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// ─── Info Row ──────────────────────────────────────────────────────────────────

function InfoRow({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType
  label: string
  value: React.ReactNode
}) {
  return (
    <div className="flex items-start gap-3 py-2.5 border-b border-border/40 last:border-0">
      <div className="size-7 rounded-lg bg-muted flex items-center justify-center shrink-0 mt-0.5">
        <Icon className="size-3.5 text-muted-foreground" />
      </div>
      <div className="min-w-0">
        <p className="text-[11px] text-muted-foreground">{label}</p>
        <p className="text-sm font-medium text-foreground break-words">{value || '—'}</p>
      </div>
    </div>
  )
}

// ─── Main Page ─────────────────────────────────────────────────────────────────

export default function TenantDetailPage() {
  const params = useParams()
  const router = useRouter()
  const id = typeof params.id === 'string' ? params.id : Array.isArray(params.id) ? params.id[0] : ''

  const tenant = getTenantById(id)

  // ── Not Found ───────────────────────────────────────────────────────────────
  if (!tenant) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6 p-8">
        <div className="size-20 rounded-2xl bg-muted/50 flex items-center justify-center">
          <BuildingIcon className="size-10 text-muted-foreground/40" />
        </div>
        <div className="text-center space-y-1">
          <h2 className="text-xl font-semibold text-foreground">Tenant tidak ditemukan</h2>
          <p className="text-sm text-muted-foreground">
            Tenant dengan ID <span className="font-mono text-xs bg-muted px-1.5 py-0.5 rounded">{id}</span> tidak ada dalam sistem.
          </p>
        </div>
        <Button onClick={() => router.push('/tenant-management')} className="gap-2">
          <ArrowLeftIcon className="size-4" />
          Kembali ke Daftar Tenant
        </Button>
      </div>
    )
  }

  // ── Data ────────────────────────────────────────────────────────────────────
  const users   = getUsersByTenant(id)
  const dapurs  = getDapurByTenant(id)
  const health  = getHealthScore(tenant)
  const plan    = PLAN_CONFIG[tenant.plan]
  const dapurUtil = Math.round((tenant.jumlahDapur / Math.max(plan.maksDapur, 1)) * 100)
  const userUtil  = Math.round((tenant.jumlahUser / Math.max(plan.maksUser, 1)) * 100)

  const isSuspended = tenant.status === 'Suspended'

  return (
    <div className="space-y-6 p-4 sm:p-6">

      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        {/* Left: back + title */}
        <div className="flex items-start gap-3 min-w-0">
          <Button
            variant="outline"
            size="icon"
            className="shrink-0 size-9 mt-0.5"
            onClick={() => router.push('/tenant-management')}
          >
            <ArrowLeftIcon className="size-4" />
          </Button>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground truncate">
                {tenant.namaYayasan}
              </h1>
              <StatusBadge status={tenant.status} />
              <PlanBadge plan={tenant.plan} />
            </div>
            <p className="text-sm text-muted-foreground">
              {tenant.namaPlatform} &middot; {tenant.kota}, {tenant.provinsi}
            </p>
          </div>
        </div>

        {/* Right: actions */}
        <div className="flex items-center gap-2 shrink-0 ml-12 sm:ml-0">
          <Button variant="outline" size="sm" className="gap-1.5">
            <PencilIcon className="size-3.5" />
            Edit
          </Button>
          <Button
            variant={isSuspended ? 'default' : 'destructive'}
            size="sm"
            className="gap-1.5"
          >
            <ShieldAlertIcon className="size-3.5" />
            {isSuspended ? 'Aktifkan' : 'Suspend'}
          </Button>
        </div>
      </div>

      {/* ── KPI Cards ──────────────────────────────────────────────────────── */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        <KpiCard
          label="Total Dapur"
          value={tenant.jumlahDapur}
          sub={`${tenant.jumlahDapurAktif} aktif`}
          icon={HomeIcon}
          iconColor="text-emerald-500"
          iconBg="bg-emerald-500/10"
        />
        <KpiCard
          label="Total User"
          value={tenant.jumlahUser}
          sub={`${users.filter(u => u.status === 'Aktif').length} aktif`}
          icon={UsersIcon}
          iconColor="text-violet-500"
          iconBg="bg-violet-500/10"
        />
        <KpiCard
          label="Porsi Hari Ini"
          value={tenant.totalPorsiHariIni.toLocaleString('id-ID')}
          sub="Total seluruh dapur"
          icon={ActivityIcon}
          iconColor="text-orange-500"
          iconBg="bg-orange-500/10"
        />
        <KpiCard
          label="Health Score"
          value={
            <span className={healthTextColor(health)}>{health}%</span>
          }
          sub={healthLabel(health)}
          icon={HeartPulseIcon}
          iconColor={health >= 75 ? 'text-green-500' : health >= 40 ? 'text-yellow-500' : 'text-red-500'}
          iconBg={health >= 75 ? 'bg-green-500/10' : health >= 40 ? 'bg-yellow-500/10' : 'bg-red-500/10'}
        />
      </div>

      {/* ── Tabs ───────────────────────────────────────────────────────────── */}
      <Tabs defaultValue="overview" className="space-y-5">
        <TabsList className="h-10 p-1 bg-muted/50 border border-border/60">
          <TabsTrigger value="overview"   className="text-xs gap-1.5 px-4"><BadgeInfoIcon  className="size-3.5" />Overview</TabsTrigger>
          <TabsTrigger value="dapur"      className="text-xs gap-1.5 px-4"><UtensilsIcon   className="size-3.5" />Dapur</TabsTrigger>
          <TabsTrigger value="users"      className="text-xs gap-1.5 px-4"><UsersIcon      className="size-3.5" />Users</TabsTrigger>
          <TabsTrigger value="settings"   className="text-xs gap-1.5 px-4"><Settings2Icon  className="size-3.5" />Settings</TabsTrigger>
        </TabsList>

        {/* ━━━━ TAB: OVERVIEW ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
        <TabsContent value="overview" className="mt-0">
          <div className="grid gap-5 lg:grid-cols-2">

            {/* Tenant Info Card */}
            <Card className="border-border/60">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-semibold flex items-center gap-2">
                  <BuildingIcon className="size-4 text-primary" />
                  Informasi Tenant
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <InfoRow icon={HashIcon}     label="NPWP"      value={tenant.npwp} />
                <InfoRow icon={MapPinIcon}   label="Alamat"    value={tenant.alamat} />
                <InfoRow icon={MapPinIcon}   label="Kota"      value={tenant.kota} />
                <InfoRow icon={MapPinIcon}   label="Provinsi"  value={tenant.provinsi} />
                <InfoRow icon={CalendarIcon} label="Tgl Daftar" value={fmtDate(tenant.tanggalDaftar)} />
                {tenant.trialHingga && (
                  <InfoRow
                    icon={ClockIcon}
                    label="Trial Hingga"
                    value={
                      <span className="text-blue-600 dark:text-blue-400">
                        {fmtDate(tenant.trialHingga)}
                      </span>
                    }
                  />
                )}

                <div className="mt-4 pt-3 border-t border-border/40">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">PIC Yayasan</p>
                  <div className="flex items-center gap-3">
                    <Avatar className="size-10 shrink-0">
                      <AvatarFallback className="bg-primary/10 text-primary text-sm font-semibold">
                        {avatarInitials(tenant.picNama)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-foreground truncate">{tenant.picNama}</p>
                      <div className="flex flex-col gap-0.5 mt-0.5">
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <MailIcon className="size-3 shrink-0" />
                          <span className="truncate">{tenant.picEmail}</span>
                        </span>
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <PhoneIcon className="size-3 shrink-0" />
                          {tenant.picTelp}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Plan Details Card */}
            <div className="space-y-4">
              <Card className="border-border/60">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-semibold flex items-center gap-2">
                    <StarIcon className="size-4 text-primary" />
                    Detail Paket
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0 space-y-4">
                  {/* Plan name */}
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Paket Aktif</span>
                    <PlanBadge plan={tenant.plan} />
                  </div>

                  {/* Dapur util */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">Utilisasi Dapur</span>
                      <span className="font-medium">{tenant.jumlahDapur} / {plan.maksDapur === 999 ? '∞' : plan.maksDapur}</span>
                    </div>
                    <Progress
                      value={plan.maksDapur === 999 ? 0 : dapurUtil}
                      className="h-1.5"
                    />
                  </div>

                  {/* User util */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">Utilisasi User</span>
                      <span className="font-medium">{tenant.jumlahUser} / {plan.maksUser === 999 ? '∞' : plan.maksUser}</span>
                    </div>
                    <Progress
                      value={plan.maksUser === 999 ? 0 : userUtil}
                      className="h-1.5"
                    />
                  </div>

                  {/* Health */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">Health Score</span>
                      <span className={`font-medium ${healthTextColor(health)}`}>{health}%</span>
                    </div>
                    <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${healthColor(health)}`}
                        style={{ width: `${health}%` }}
                      />
                    </div>
                  </div>

                  {/* Fitur aktif */}
                  <div>
                    <p className="text-xs font-medium text-muted-foreground mb-2">Fitur Aktif</p>
                    <div className="flex flex-wrap gap-1.5">
                      {tenant.fiturAktif.length > 0
                        ? tenant.fiturAktif.map(f => (
                            <span
                              key={f}
                              className="inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full bg-primary/8 text-primary border border-primary/15"
                            >
                              <ZapIcon className="size-2.5" />
                              {f}
                            </span>
                          ))
                        : <span className="text-xs text-muted-foreground italic">Tidak ada fitur aktif</span>
                      }
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card className="border-border/60">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-semibold flex items-center gap-2">
                    <Layers2Icon className="size-4 text-primary" />
                    Aksi Cepat
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0 grid grid-cols-2 gap-2">
                  <Button variant="outline" size="sm" asChild className="h-auto py-3 flex-col gap-1.5">
                    <Link href={`/tenant-management/${id}/users`}>
                      <UsersIcon className="size-5 text-violet-500" />
                      <span className="text-xs">Kelola User</span>
                    </Link>
                  </Button>
                  <Button variant="outline" size="sm" asChild className="h-auto py-3 flex-col gap-1.5">
                    <Link href={`/tenant-management/${id}/dapur`}>
                      <UtensilsIcon className="size-5 text-emerald-500" />
                      <span className="text-xs">Kelola Dapur</span>
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* ━━━━ TAB: DAPUR ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
        <TabsContent value="dapur" className="mt-0">
          <Card className="border-border/60">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-sm font-semibold flex items-center gap-2">
                    <UtensilsIcon className="size-4 text-primary" />
                    Daftar Dapur
                  </CardTitle>
                  <CardDescription className="text-xs mt-0.5">
                    {dapurs.length} dapur terdaftar untuk {tenant.namaYayasan}
                  </CardDescription>
                </div>
                <Button variant="outline" size="sm" asChild className="gap-1.5 text-xs">
                  <Link href={`/tenant-management/${id}/dapur`}>
                    <ExternalLinkIcon className="size-3.5" />
                    Kelola Semua
                  </Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              {dapurs.length === 0 ? (
                <div className="py-16 text-center">
                  <UtensilsIcon className="size-10 text-muted-foreground/30 mx-auto mb-3" />
                  <p className="text-sm text-muted-foreground">Belum ada dapur terdaftar.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border/60 bg-muted/30">
                        <th className="text-left text-[11px] font-semibold text-muted-foreground uppercase tracking-wide px-5 py-3">Nama Dapur</th>
                        <th className="text-left text-[11px] font-semibold text-muted-foreground uppercase tracking-wide px-3 py-3">Kota</th>
                        <th className="text-right text-[11px] font-semibold text-muted-foreground uppercase tracking-wide px-3 py-3">Kapasitas</th>
                        <th className="text-right text-[11px] font-semibold text-muted-foreground uppercase tracking-wide px-3 py-3">Porsi/Hari</th>
                        <th className="text-center text-[11px] font-semibold text-muted-foreground uppercase tracking-wide px-3 py-3">Status</th>
                        <th className="text-left text-[11px] font-semibold text-muted-foreground uppercase tracking-wide px-5 py-3">PIC</th>
                      </tr>
                    </thead>
                    <tbody>
                      {dapurs.map((dapur, i) => {
                        const utilisasi = Math.round((dapur.porsiHariIni / Math.max(dapur.kapasitas, 1)) * 100)
                        return (
                          <tr
                            key={dapur.id}
                            className="border-b border-border/40 hover:bg-muted/20 transition-colors last:border-0"
                          >
                            <td className="px-5 py-3.5">
                              <div className="flex items-center gap-3">
                                <div className="size-8 rounded-lg bg-gradient-to-br from-emerald-500/20 to-emerald-500/5 border border-emerald-500/15 flex items-center justify-center shrink-0">
                                  <UtensilsIcon className="size-3.5 text-emerald-600 dark:text-emerald-400" />
                                </div>
                                <div>
                                  <p className="font-medium text-foreground text-sm">{dapur.nama}</p>
                                  <p className="text-[11px] text-muted-foreground">{dapur.lokasi}</p>
                                </div>
                              </div>
                            </td>
                            <td className="px-3 py-3.5 text-sm text-muted-foreground">{dapur.kota}</td>
                            <td className="px-3 py-3.5 text-right">
                              <span className="font-medium text-foreground">{dapur.kapasitas.toLocaleString('id-ID')}</span>
                              <span className="text-xs text-muted-foreground ml-1">porsi</span>
                            </td>
                            <td className="px-3 py-3.5 text-right">
                              <div>
                                <span className="font-semibold text-foreground">{dapur.porsiHariIni.toLocaleString('id-ID')}</span>
                                <div className="flex items-center justify-end gap-1 mt-0.5">
                                  <div className="w-12 h-1 rounded-full bg-muted overflow-hidden">
                                    <div
                                      className={`h-full rounded-full ${utilisasi >= 70 ? 'bg-green-500' : utilisasi >= 40 ? 'bg-yellow-500' : 'bg-muted-foreground/30'}`}
                                      style={{ width: `${utilisasi}%` }}
                                    />
                                  </div>
                                  <span className="text-[10px] text-muted-foreground">{utilisasi}%</span>
                                </div>
                              </div>
                            </td>
                            <td className="px-3 py-3.5 text-center">
                              <DapurStatusBadge status={dapur.status} />
                            </td>
                            <td className="px-5 py-3.5">
                              <div className="flex items-center gap-2">
                                <Avatar className="size-6">
                                  <AvatarFallback className={`text-[9px] text-white ${AVATAR_COLORS[i % AVATAR_COLORS.length]}`}>
                                    {dapur.picNama !== '-' ? avatarInitials(dapur.picNama) : '—'}
                                  </AvatarFallback>
                                </Avatar>
                                <span className="text-xs text-foreground">{dapur.picNama}</span>
                              </div>
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* ━━━━ TAB: USERS ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
        <TabsContent value="users" className="mt-0">
          <Card className="border-border/60">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-sm font-semibold flex items-center gap-2">
                    <UsersIcon className="size-4 text-primary" />
                    Daftar User
                  </CardTitle>
                  <CardDescription className="text-xs mt-0.5">
                    {users.length} user terdaftar untuk {tenant.namaYayasan}
                  </CardDescription>
                </div>
                <Button variant="outline" size="sm" asChild className="gap-1.5 text-xs">
                  <Link href={`/tenant-management/${id}/users`}>
                    <ExternalLinkIcon className="size-3.5" />
                    Kelola Semua
                  </Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent className="pt-0 divide-y divide-border/40">
              {users.length === 0 ? (
                <div className="py-16 text-center">
                  <UsersIcon className="size-10 text-muted-foreground/30 mx-auto mb-3" />
                  <p className="text-sm text-muted-foreground">Belum ada user terdaftar.</p>
                </div>
              ) : (
                users.map((user, i) => (
                  <div
                    key={user.id}
                    className="flex items-center gap-4 py-3.5 hover:bg-muted/20 -mx-6 px-6 transition-colors"
                  >
                    {/* Avatar */}
                    <Avatar className="size-10 shrink-0">
                      <AvatarFallback
                        className={`text-sm font-semibold text-white ${AVATAR_COLORS[(user.avatar - 1) % AVATAR_COLORS.length]}`}
                      >
                        {avatarInitials(user.nama)}
                      </AvatarFallback>
                    </Avatar>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="text-sm font-semibold text-foreground">{user.nama}</p>
                        <UserStatusBadge status={user.status} />
                      </div>
                      <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                        <MailIcon className="size-3 shrink-0" />
                        <span className="truncate">{user.email}</span>
                      </p>
                      {user.dapurNama && (
                        <p className="text-[11px] text-muted-foreground flex items-center gap-1 mt-0.5">
                          <UtensilsIcon className="size-3 shrink-0" />
                          {user.dapurNama}
                        </p>
                      )}
                    </div>

                    {/* Role + last active */}
                    <div className="text-right shrink-0">
                      <div className="mb-1">{roleBadge(user.role)}</div>
                      <p className="text-[10px] text-muted-foreground">
                        {user.lastActive
                          ? <span className="flex items-center gap-1 justify-end"><ClockIcon className="size-2.5" />{user.lastActive}</span>
                          : <span className="italic">Belum login</span>
                        }
                      </p>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* ━━━━ TAB: SETTINGS ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
        <TabsContent value="settings" className="mt-0">
          <div className="grid gap-5 lg:grid-cols-2">
            {/* Basic Info */}
            <Card className="border-border/60">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-semibold flex items-center gap-2">
                  <Settings2Icon className="size-4 text-primary" />
                  Konfigurasi Dasar
                </CardTitle>
                <CardDescription className="text-xs">
                  Pengaturan tampilan dan identitas platform
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <InfoRow icon={BuildingIcon} label="Nama Yayasan"  value={tenant.namaYayasan} />
                <InfoRow icon={UserIcon}     label="Nama Platform" value={tenant.namaPlatform} />
                <InfoRow icon={StarIcon}     label="Paket"         value={<PlanBadge plan={tenant.plan} />} />

                <div className="mt-4 pt-3 border-t border-border/40">
                  <p className="text-xs font-medium text-muted-foreground mb-2">Fitur Aktif ({tenant.fiturAktif.length})</p>
                  <div className="flex flex-wrap gap-1.5">
                    {tenant.fiturAktif.length > 0
                      ? tenant.fiturAktif.map(f => (
                          <span
                            key={f}
                            className="inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full bg-primary/8 text-primary border border-primary/15"
                          >
                            <ZapIcon className="size-2.5" />
                            {f}
                          </span>
                        ))
                      : <span className="text-xs text-muted-foreground italic">Tidak ada fitur aktif (tenant suspended)</span>
                    }
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Link to full settings */}
            <Card className="border-dashed border-border/60 bg-muted/10">
              <CardContent className="flex flex-col items-center justify-center gap-4 py-12 text-center">
                <div className="size-14 rounded-2xl bg-primary/8 border border-primary/15 flex items-center justify-center">
                  <Settings2Icon className="size-7 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">Pengaturan Lengkap</p>
                  <p className="text-xs text-muted-foreground mt-1 max-w-[200px]">
                    Kelola branding, notifikasi, integrasi, dan konfigurasi lanjutan di halaman pengaturan penuh.
                  </p>
                </div>
                <Button variant="outline" asChild className="gap-2">
                  <Link href={`/tenant-management/${id}/settings`}>
                    Buka Pengaturan
                    <ChevronRightIcon className="size-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
