'use client'

import { useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import {
  ArrowLeftIcon,
  PlusIcon,
  HomeIcon,
  MapPinIcon,
  UsersIcon,
  ActivityIcon,
  MoreVerticalIcon,
  CheckCircle2Icon,
  XCircleIcon,
  WrenchIcon,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { toast } from 'sonner'
import { getTenantById, getDapurByTenant, PLAN_CONFIG, type DapurStatus } from '@/lib/tenant-data'

function statusBadge(status: DapurStatus) {
  const map: Record<DapurStatus, { label: string; className: string; icon: React.ElementType }> = {
    Aktif: { label: 'Aktif', className: 'bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20', icon: CheckCircle2Icon },
    Nonaktif: { label: 'Nonaktif', className: 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20', icon: XCircleIcon },
    Setup: { label: 'Setup', className: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20', icon: WrenchIcon },
  }
  const s = map[status]
  const Icon = s.icon
  return (
    <Badge className={`text-[10px] border gap-1 ${s.className}`}>
      <Icon className="size-2.5" /> {s.label}
    </Badge>
  )
}

function AddDapurDialog({ tenantId }: { tenantId: string }) {
  const [open, setOpen] = useState(false)
  const [nama, setNama] = useState('')
  const [lokasi, setLokasi] = useState('')
  const [kota, setKota] = useState('')
  const [kapasitas, setKapasitas] = useState('')
  const [picNama, setPicNama] = useState('')
  const [picTelp, setPicTelp] = useState('')

  const handleSave = () => {
    if (!nama || !kota || !kapasitas) { toast.error('Lengkapi data dapur.'); return }
    toast.success(`Dapur "${nama}" berhasil ditambahkan!`)
    setNama(''); setLokasi(''); setKota(''); setKapasitas(''); setPicNama(''); setPicTelp('')
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <PlusIcon className="size-4" />
          Tambah Dapur
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Tambah Dapur Baru</DialogTitle>
          <DialogDescription>Data dapur yang akan bergabung dalam yayasan ini.</DialogDescription>
        </DialogHeader>
        <div className="space-y-3 py-2">
          <div className="space-y-1.5">
            <Label htmlFor="dapur-nama">Nama Dapur</Label>
            <Input id="dapur-nama" placeholder="Dapur Al-Falah 6" value={nama} onChange={e => setNama(e.target.value)} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="dapur-kota">Kota</Label>
              <Input id="dapur-kota" placeholder="Jakarta" value={kota} onChange={e => setKota(e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="dapur-kapasitas">Kapasitas (porsi)</Label>
              <Input id="dapur-kapasitas" type="number" placeholder="200" value={kapasitas} onChange={e => setKapasitas(e.target.value)} />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="dapur-lokasi">Alamat</Label>
            <Input id="dapur-lokasi" placeholder="Jl. Merdeka No. 1" value={lokasi} onChange={e => setLokasi(e.target.value)} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="pic-nama">PIC Nama</Label>
              <Input id="pic-nama" placeholder="Nama PIC" value={picNama} onChange={e => setPicNama(e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="pic-telp">PIC Telp</Label>
              <Input id="pic-telp" placeholder="08xxx" value={picTelp} onChange={e => setPicTelp(e.target.value)} />
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>Batal</Button>
          <Button onClick={handleSave}>Simpan Dapur</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default function TenantDapurPage() {
  const params = useParams<{ id: string }>()
  const tenant = getTenantById(params.id)
  const dapurList = getDapurByTenant(params.id)

  if (!tenant) {
    return (
      <div className="p-6 text-center space-y-3">
        <p className="text-muted-foreground">Tenant tidak ditemukan.</p>
        <Button asChild variant="outline"><Link href="/tenant-management">← Kembali</Link></Button>
      </div>
    )
  }

  const planConfig = PLAN_CONFIG[tenant.plan]
  const maksDapur = tenant.maksDapur >= 999 ? '∞' : tenant.maksDapur
  const utilisasiPct = tenant.maksDapur >= 999 ? 0 : Math.round((tenant.jumlahDapur / tenant.maksDapur) * 100)

  const aktif = dapurList.filter(d => d.status === 'Aktif').length
  const nonaktif = dapurList.filter(d => d.status === 'Nonaktif').length
  const setup = dapurList.filter(d => d.status === 'Setup').length
  const totalPorsi = dapurList.reduce((s, d) => s + d.porsiHariIni, 0)
  const totalKapasitas = dapurList.reduce((s, d) => s + d.kapasitas, 0)

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild className="shrink-0">
          <Link href={`/tenant-management/${params.id}`}><ArrowLeftIcon className="size-4" /></Link>
        </Button>
        <div className="flex-1">
          <h1 className="text-xl font-bold text-foreground">Manajemen Dapur</h1>
          <p className="text-sm text-muted-foreground">{tenant.namaYayasan}</p>
        </div>
        <AddDapurDialog tenantId={params.id} />
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Total Dapur', value: dapurList.length, icon: HomeIcon, color: 'text-primary' },
          { label: 'Dapur Aktif', value: aktif, icon: CheckCircle2Icon, color: 'text-green-500' },
          { label: 'Total Kapasitas', value: totalKapasitas.toLocaleString('id-ID') + ' porsi', icon: UsersIcon, color: 'text-violet-500' },
          { label: 'Porsi Hari Ini', value: totalPorsi.toLocaleString('id-ID'), icon: ActivityIcon, color: 'text-orange-500' },
        ].map(s => {
          const Icon = s.icon
          return (
            <Card key={s.label} className="border-border/50">
              <CardContent className="pt-4 pb-4 flex items-center gap-3">
                <Icon className={`size-5 ${s.color}`} />
                <div>
                  <p className="text-lg font-bold">{s.value}</p>
                  <p className="text-[11px] text-muted-foreground">{s.label}</p>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Kuota bar */}
      {tenant.maksDapur < 999 && (
        <Card className="border-border/50">
          <CardContent className="pt-4 pb-4">
            <div className="flex justify-between text-xs mb-2">
              <span className="text-muted-foreground">Kuota Dapur (Paket {planConfig.label})</span>
              <span className="font-medium">{tenant.jumlahDapur} / {maksDapur} dapur</span>
            </div>
            <Progress value={utilisasiPct} className="h-2" />
            {utilisasiPct >= 90 && (
              <p className="text-[11px] text-orange-500 mt-1.5">⚠️ Kuota hampir penuh. Pertimbangkan upgrade ke Pro.</p>
            )}
          </CardContent>
        </Card>
      )}

      {/* Dapur Cards */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {dapurList.map(dapur => {
          const utilisasi = Math.round((dapur.porsiHariIni / Math.max(dapur.kapasitas, 1)) * 100)
          return (
            <Card key={dapur.id} className="hover:shadow-md hover:border-primary/20 transition-all group">
              <CardContent className="p-5">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="size-9 rounded-lg bg-primary/10 flex items-center justify-center">
                      <HomeIcon className="size-4 text-primary" />
                    </div>
                    <div>
                      <p className="font-semibold text-sm text-foreground">{dapur.nama}</p>
                      <p className="text-[11px] text-muted-foreground flex items-center gap-1">
                        <MapPinIcon className="size-2.5" />{dapur.kota}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5">
                    {statusBadge(dapur.status)}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="size-6 opacity-0 group-hover:opacity-100 transition-opacity">
                          <MoreVerticalIcon className="size-3" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-40">
                        <DropdownMenuItem onClick={() => toast.info('Edit: ' + dapur.nama)}>Edit Dapur</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => toast.info('Assign PIC: ' + dapur.nama)}>Assign PIC</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className={dapur.status === 'Aktif' ? 'text-destructive focus:text-destructive' : 'text-green-600'}
                          onClick={() => toast.success(dapur.status === 'Aktif' ? dapur.nama + ' dinonaktifkan' : dapur.nama + ' diaktifkan')}
                        >
                          {dapur.status === 'Aktif' ? 'Nonaktifkan' : 'Aktifkan'}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 mb-3 text-center">
                  <div className="bg-muted/40 rounded-lg p-2">
                    <p className="text-base font-bold">{dapur.kapasitas}</p>
                    <p className="text-[10px] text-muted-foreground">Kapasitas</p>
                  </div>
                  <div className="bg-muted/40 rounded-lg p-2">
                    <p className="text-base font-bold">{dapur.porsiHariIni}</p>
                    <p className="text-[10px] text-muted-foreground">Porsi/Hari</p>
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-[10px] text-muted-foreground">
                    <span>Utilisasi</span>
                    <span>{utilisasi}%</span>
                  </div>
                  <Progress value={dapur.status === 'Aktif' ? utilisasi : 0} className="h-1" />
                </div>

                <div className="mt-3 pt-3 border-t border-border/40 text-[11px] text-muted-foreground">
                  PIC: <span className="text-foreground font-medium">{dapur.picNama || '—'}</span>
                  {dapur.picTelp !== '-' && <span className="ml-2">{dapur.picTelp}</span>}
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
