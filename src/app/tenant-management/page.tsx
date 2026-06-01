'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import {
  BuildingIcon,
  PlusIcon,
  SearchIcon,
  UsersIcon,
  HomeIcon,
  ChevronRightIcon,
  ShieldAlertIcon,
  ClockIcon,
  CheckCircle2Icon,
  XCircleIcon,
  MoreVerticalIcon,
  ActivityIcon,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Progress } from '@/components/ui/progress'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { MOCK_TENANTS, PLAN_CONFIG, getHealthScore, type Tenant, type TenantStatus, type TenantPlan } from '@/lib/tenant-data'

// ─── Helpers ───────────────────────────────────────────────────────────────────

function statusBadge(status: TenantStatus) {
  const map: Record<TenantStatus, { label: string; className: string; icon: React.ElementType }> = {
    Aktif: { label: 'Aktif', className: 'bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20', icon: CheckCircle2Icon },
    Trial: { label: 'Trial', className: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20', icon: ClockIcon },
    Suspended: { label: 'Suspended', className: 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20', icon: ShieldAlertIcon },
    Expired: { label: 'Expired', className: 'bg-muted text-muted-foreground border-border', icon: XCircleIcon },
  }
  const s = map[status]
  const Icon = s.icon
  return (
    <Badge className={`gap-1 border text-[11px] ${s.className}`}>
      <Icon className="size-3" />
      {s.label}
    </Badge>
  )
}

function healthColor(score: number) {
  if (score >= 75) return 'bg-green-500'
  if (score >= 40) return 'bg-yellow-500'
  return 'bg-red-500'
}

function TenantCard({ tenant }: { tenant: Tenant }) {
  const plan = PLAN_CONFIG[tenant.plan]
  const health = getHealthScore(tenant)
  const utilisasi = Math.round((tenant.jumlahDapurAktif / Math.max(tenant.jumlahDapur, 1)) * 100)

  return (
    <Card className="hover:shadow-md hover:border-primary/30 transition-all duration-200 group">
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex items-center gap-3 min-w-0">
            <div className="size-10 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/10 flex items-center justify-center shrink-0">
              <BuildingIcon className="size-5 text-primary" />
            </div>
            <div className="min-w-0">
              <p className="font-semibold text-sm text-foreground truncate">{tenant.namaYayasan}</p>
              <p className="text-xs text-muted-foreground truncate">{tenant.kota}, {tenant.provinsi}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            {statusBadge(tenant.status)}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="size-7 opacity-0 group-hover:opacity-100 transition-opacity">
                  <MoreVerticalIcon className="size-3.5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-44">
                <DropdownMenuItem asChild>
                  <Link href={`/tenant-management/${tenant.id}`}>Lihat Detail</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href={`/tenant-management/${tenant.id}/users`}>Kelola User</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href={`/tenant-management/${tenant.id}/settings`}>Pengaturan</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-destructive focus:text-destructive">
                  {tenant.status === 'Suspended' ? 'Aktifkan Kembali' : 'Suspend Tenant'}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Plan badge */}
        <Badge className={`mb-3 text-[10px] border ${plan.bgColor} ${plan.color}`}>
          {plan.label}
        </Badge>

        {/* Stats grid */}
        <div className="grid grid-cols-3 gap-2 mb-4">
          <div className="text-center p-2 rounded-lg bg-muted/40">
            <p className="text-base font-bold text-foreground">{tenant.jumlahDapur}</p>
            <p className="text-[10px] text-muted-foreground">Dapur</p>
          </div>
          <div className="text-center p-2 rounded-lg bg-muted/40">
            <p className="text-base font-bold text-foreground">{tenant.jumlahUser}</p>
            <p className="text-[10px] text-muted-foreground">User</p>
          </div>
          <div className="text-center p-2 rounded-lg bg-muted/40">
            <p className="text-base font-bold text-foreground">{tenant.totalPorsiHariIni.toLocaleString('id-ID')}</p>
            <p className="text-[10px] text-muted-foreground">Porsi/Hari</p>
          </div>
        </div>

        {/* Health score */}
        <div className="space-y-1.5 mb-4">
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground">Health Score</span>
            <span className="font-medium">{health}%</span>
          </div>
          <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
            <div
              className={`h-full rounded-full transition-all ${healthColor(health)}`}
              style={{ width: `${health}%` }}
            />
          </div>
        </div>

        {/* Utilisasi dapur */}
        <div className="space-y-1">
          <div className="flex justify-between text-[10px] text-muted-foreground">
            <span>Dapur Aktif</span>
            <span>{tenant.jumlahDapurAktif}/{tenant.jumlahDapur} ({utilisasi}%)</span>
          </div>
          <Progress value={utilisasi} className="h-1" />
        </div>

        {tenant.trialHingga && (
          <p className="text-[10px] text-blue-600 dark:text-blue-400 mt-2 flex items-center gap-1">
            <ClockIcon className="size-3" />
            Trial s/d {new Date(tenant.trialHingga).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
          </p>
        )}

        <div className="mt-4 pt-3 border-t border-border/50">
          <Link
            href={`/tenant-management/${tenant.id}`}
            className="text-xs text-primary font-medium flex items-center gap-1 hover:gap-2 transition-all"
          >
            Lihat Detail <ChevronRightIcon className="size-3" />
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}

// ─── Summary Stats ─────────────────────────────────────────────────────────────

function SummaryStats() {
  const total = MOCK_TENANTS.length
  const aktif = MOCK_TENANTS.filter(t => t.status === 'Aktif').length
  const trial = MOCK_TENANTS.filter(t => t.status === 'Trial').length
  const suspended = MOCK_TENANTS.filter(t => t.status === 'Suspended').length
  const totalPorsi = MOCK_TENANTS.reduce((s, t) => s + t.totalPorsiHariIni, 0)
  const totalUser = MOCK_TENANTS.reduce((s, t) => s + t.jumlahUser, 0)
  const totalDapur = MOCK_TENANTS.reduce((s, t) => s + t.jumlahDapur, 0)

  const cards = [
    { label: 'Total Tenant', value: total, sub: `${aktif} aktif`, icon: BuildingIcon, color: 'text-primary' },
    { label: 'Total Dapur', value: totalDapur, sub: 'Semua yayasan', icon: HomeIcon, color: 'text-emerald-500' },
    { label: 'Total User', value: totalUser, sub: 'Semua role', icon: UsersIcon, color: 'text-violet-500' },
    { label: 'Porsi Hari Ini', value: totalPorsi.toLocaleString('id-ID'), sub: 'Seluruh jaringan', icon: ActivityIcon, color: 'text-orange-500' },
  ]

  const statusSummary = [
    { label: 'Aktif', count: aktif, color: 'bg-green-500' },
    { label: 'Trial', count: trial, color: 'bg-blue-500' },
    { label: 'Suspended', count: suspended, color: 'bg-red-500' },
  ]

  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map(c => {
          const Icon = c.icon
          return (
            <Card key={c.label} className="border-border/50">
              <CardContent className="pt-5">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-xs text-muted-foreground">{c.label}</p>
                  <Icon className={`size-4 ${c.color}`} />
                </div>
                <p className="text-2xl font-bold text-foreground">{c.value}</p>
                <p className="text-[11px] text-muted-foreground mt-1">{c.sub}</p>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Status strip */}
      <div className="flex items-center gap-4 px-1">
        {statusSummary.map(s => (
          <div key={s.label} className="flex items-center gap-2 text-xs text-muted-foreground">
            <span className={`size-2 rounded-full ${s.color}`} />
            {s.count} {s.label}
          </div>
        ))}
      </div>
    </>
  )
}

// ─── Main Page ─────────────────────────────────────────────────────────────────

export default function TenantManagementPage() {
  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState<'all' | TenantStatus>('all')
  const [filterPlan, setFilterPlan] = useState<'all' | TenantPlan>('all')

  const filtered = useMemo(() => {
    return MOCK_TENANTS.filter(t => {
      const matchSearch = t.namaYayasan.toLowerCase().includes(search.toLowerCase()) ||
        t.kota.toLowerCase().includes(search.toLowerCase())
      const matchStatus = filterStatus === 'all' || t.status === filterStatus
      const matchPlan = filterPlan === 'all' || t.plan === filterPlan
      return matchSearch && matchStatus && matchPlan
    })
  }, [search, filterStatus, filterPlan])

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Tenant Management</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Kelola semua yayasan, dapur, dan user dalam satu platform.
          </p>
        </div>
        <Button asChild className="gap-2 shrink-0">
          <Link href="/tenant-management/new">
            <PlusIcon className="size-4" />
            Tambah Yayasan
          </Link>
        </Button>
      </div>

      {/* Summary */}
      <SummaryStats />

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            placeholder="Cari nama yayasan atau kota..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={filterStatus} onValueChange={v => setFilterStatus(v as typeof filterStatus)}>
          <SelectTrigger className="w-full sm:w-[160px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Semua Status</SelectItem>
            <SelectItem value="Aktif">Aktif</SelectItem>
            <SelectItem value="Trial">Trial</SelectItem>
            <SelectItem value="Suspended">Suspended</SelectItem>
            <SelectItem value="Expired">Expired</SelectItem>
          </SelectContent>
        </Select>
        <Select value={filterPlan} onValueChange={v => setFilterPlan(v as typeof filterPlan)}>
          <SelectTrigger className="w-full sm:w-[160px]">
            <SelectValue placeholder="Paket" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Semua Paket</SelectItem>
            <SelectItem value="Starter">Starter</SelectItem>
            <SelectItem value="Pro">Pro</SelectItem>
            <SelectItem value="Enterprise">Enterprise</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Tenant Cards Grid */}
      {filtered.length === 0 ? (
        <Card className="py-16">
          <CardContent className="text-center space-y-2">
            <BuildingIcon className="size-10 text-muted-foreground/40 mx-auto" />
            <p className="text-sm text-muted-foreground">Tidak ada tenant ditemukan.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {filtered.map(t => <TenantCard key={t.id} tenant={t} />)}
        </div>
      )}
    </div>
  )
}
