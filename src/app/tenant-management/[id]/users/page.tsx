'use client'

import { useState, useMemo } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import {
  ArrowLeftIcon,
  PlusIcon,
  MailIcon,
  SearchIcon,
  UserCheckIcon,
  UserXIcon,
  MoreVerticalIcon,
  ShieldIcon,
  ClockIcon,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { toast } from 'sonner'
import {
  getTenantById,
  getUsersByTenant,
  type UserRole,
  type UserStatus,
} from '@/lib/tenant-data'

const ROLE_OPTIONS: UserRole[] = [
  'Super Administrator',
  'PIC Dapur (Admin Yayasan)',
  'Kepala SPPG (Lvl 1)',
  'Kepala SPPI (Lvl 2)',
  'Full Authorize (Lvl 3)',
]

function roleBadge(role: UserRole) {
  const map: Record<UserRole, string> = {
    'Super Administrator': 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20',
    'PIC Dapur (Admin Yayasan)': 'bg-violet-500/10 text-violet-600 dark:text-violet-400 border-violet-500/20',
    'Kepala SPPG (Lvl 1)': 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20',
    'Kepala SPPI (Lvl 2)': 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20',
    'Full Authorize (Lvl 3)': 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
  }
  return (
    <Badge className={`text-[10px] border ${map[role]}`}>
      <ShieldIcon className="size-2.5 mr-1" />
      {role}
    </Badge>
  )
}

function statusBadge(status: UserStatus) {
  const map: Record<UserStatus, { label: string; className: string }> = {
    Aktif: { label: 'Aktif', className: 'bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20' },
    Nonaktif: { label: 'Nonaktif', className: 'bg-muted text-muted-foreground border-border' },
    'Pending Invite': { label: 'Pending Invite', className: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20' },
  }
  const s = map[status]
  return <Badge className={`text-[10px] border ${s.className}`}>{s.label}</Badge>
}

function getInitials(nama: string) {
  return nama.split(' ').slice(0, 2).map(n => n[0]).join('').toUpperCase()
}

// ─── Invite Dialog ─────────────────────────────────────────────────────────────

function InviteUserDialog() {
  const [email, setEmail] = useState('')
  const [role, setRole] = useState<UserRole | ''>('')
  const [open, setOpen] = useState(false)

  const handleInvite = () => {
    if (!email || !role) { toast.error('Lengkapi email dan role terlebih dahulu.'); return }
    if (!/\S+@\S+\.\S+/.test(email)) { toast.error('Format email tidak valid.'); return }
    toast.success(`Undangan dikirim ke ${email} sebagai ${role}`)
    setEmail(''); setRole(''); setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <MailIcon className="size-4" />
          Invite User
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Undang User Baru</DialogTitle>
          <DialogDescription>
            User akan menerima email undangan untuk bergabung ke tenant ini.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div className="space-y-1.5">
            <Label htmlFor="invite-email">Email</Label>
            <Input
              id="invite-email"
              type="email"
              placeholder="user@yayasan.org"
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="invite-role">Role</Label>
            <Select value={role} onValueChange={v => setRole(v as UserRole)}>
              <SelectTrigger id="invite-role">
                <SelectValue placeholder="Pilih role..." />
              </SelectTrigger>
              <SelectContent>
                {ROLE_OPTIONS.map(r => (
                  <SelectItem key={r} value={r}>{r}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>Batal</Button>
          <Button onClick={handleInvite} className="gap-2">
            <MailIcon className="size-4" />
            Kirim Undangan
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// ─── Main Page ─────────────────────────────────────────────────────────────────

export default function TenantUsersPage() {
  const params = useParams<{ id: string }>()
  const tenant = getTenantById(params.id)
  const allUsers = getUsersByTenant(params.id)
  const [search, setSearch] = useState('')

  const filtered = useMemo(() =>
    allUsers.filter(u =>
      u.nama.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      u.role.toLowerCase().includes(search.toLowerCase())
    ), [allUsers, search])

  const aktif = allUsers.filter(u => u.status === 'Aktif').length
  const pending = allUsers.filter(u => u.status === 'Pending Invite').length
  const nonaktif = allUsers.filter(u => u.status === 'Nonaktif').length

  if (!tenant) {
    return (
      <div className="p-6 text-center space-y-3">
        <p className="text-muted-foreground">Tenant tidak ditemukan.</p>
        <Button asChild variant="outline"><Link href="/tenant-management">← Kembali</Link></Button>
      </div>
    )
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild className="shrink-0">
          <Link href={`/tenant-management/${params.id}`}><ArrowLeftIcon className="size-4" /></Link>
        </Button>
        <div className="flex-1 min-w-0">
          <h1 className="text-xl font-bold text-foreground">User Management</h1>
          <p className="text-sm text-muted-foreground">{tenant.namaYayasan}</p>
        </div>
        <InviteUserDialog />
      </div>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'User Aktif', value: aktif, icon: UserCheckIcon, color: 'text-green-500' },
          { label: 'Pending Invite', value: pending, icon: MailIcon, color: 'text-blue-500' },
          { label: 'Nonaktif', value: nonaktif, icon: UserXIcon, color: 'text-muted-foreground' },
        ].map(s => {
          const Icon = s.icon
          return (
            <Card key={s.label} className="border-border/50">
              <CardContent className="pt-4 pb-4 flex items-center gap-3">
                <Icon className={`size-5 ${s.color}`} />
                <div>
                  <p className="text-xl font-bold">{s.value}</p>
                  <p className="text-[11px] text-muted-foreground">{s.label}</p>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Search + Table */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between gap-3">
            <div>
              <CardTitle className="text-base">Daftar User</CardTitle>
              <CardDescription className="text-xs mt-0.5">{allUsers.length} user terdaftar</CardDescription>
            </div>
            <div className="relative w-64">
              <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
              <Input
                placeholder="Cari user..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="pl-9 h-8 text-sm"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent className="px-0 pb-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/30">
                  <TableHead className="pl-6">User</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Dapur</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Terakhir Aktif</TableHead>
                  <TableHead>Bergabung</TableHead>
                  <TableHead className="w-10" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-10 text-muted-foreground text-sm">
                      Tidak ada user ditemukan.
                    </TableCell>
                  </TableRow>
                )}
                {filtered.map(user => (
                  <TableRow key={user.id} className="hover:bg-muted/20">
                    <TableCell className="pl-6">
                      <div className="flex items-center gap-3">
                        <Avatar className="size-8 shrink-0">
                          <AvatarFallback className="text-[11px] bg-primary/10 text-primary font-medium">
                            {getInitials(user.nama)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-medium">{user.nama}</p>
                          <p className="text-xs text-muted-foreground">{user.email}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{roleBadge(user.role)}</TableCell>
                    <TableCell>
                      <span className="text-xs text-muted-foreground">{user.dapurNama ?? '—'}</span>
                    </TableCell>
                    <TableCell>{statusBadge(user.status)}</TableCell>
                    <TableCell>
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        {user.lastActive ? (
                          <><ClockIcon className="size-3" />{user.lastActive}</>
                        ) : '—'}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="text-xs text-muted-foreground">
                        {new Date(user.joinedAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </span>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="size-7">
                            <MoreVerticalIcon className="size-3.5" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-44">
                          <DropdownMenuItem onClick={() => toast.info('Edit user: ' + user.nama)}>Edit User</DropdownMenuItem>
                          <DropdownMenuItem onClick={() => toast.info('Reset password: ' + user.email)}>Reset Password</DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className={user.status === 'Aktif' ? 'text-destructive focus:text-destructive' : 'text-green-600'}
                            onClick={() => toast.success(user.status === 'Aktif' ? `${user.nama} dinonaktifkan` : `${user.nama} diaktifkan`)}
                          >
                            {user.status === 'Aktif' ? 'Nonaktifkan' : 'Aktifkan'}
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
