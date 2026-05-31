'use client'

import { useState, useMemo } from 'react'
import { toast } from 'sonner'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
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
import { Switch } from '@/components/ui/switch'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import type { UserRole } from '@/lib/auth'
import {
  EditIcon,
  KeyIcon,
  PlusIcon,
  SearchIcon,
} from 'lucide-react'

// ─── Types ────────────────────────────────────────────────────────────────────

type AppUser = {
  id: string
  nama: string
  email: string
  role: UserRole
  yayasan: string
  status: 'Aktif' | 'Nonaktif'
}

// ─── Constants ────────────────────────────────────────────────────────────────

const ROLES: UserRole[] = [
  'Super Administrator',
  'PIC Dapur (Admin Yayasan)',
  'Kepala SPPG (Lvl 1)',
  'Kepala SPPI (Lvl 2)',
  'Full Authorize (Lvl 3)',
  'BGN (Badan Gizi Nasional)',
  'Investor',
]

const YAYASAN_OPTIONS = [
  'Yayasan Al-Falah',
  'Yayasan Nurul Iman',
  'Yayasan Baiturrahman',
  'Badan Gizi Nasional',
]

// ─── Mock Data ────────────────────────────────────────────────────────────────

const MOCK_USERS: AppUser[] = [
  { id: 'usr-001', nama: 'Ahmad Fauzi', email: 'ahmad.fauzi@alfalah.sch.id', role: 'PIC Dapur (Admin Yayasan)', yayasan: 'Yayasan Al-Falah', status: 'Aktif' },
  { id: 'usr-002', nama: 'Hadi Santoso', email: 'hadi.santoso@nuruliman.sch.id', role: 'Super Administrator', yayasan: 'Yayasan Nurul Iman', status: 'Aktif' },
  { id: 'usr-003', nama: 'Siti Nurhaliza', email: 'siti.nurhaliza@baiturrahman.sch.id', role: 'Kepala SPPG (Lvl 1)', yayasan: 'Yayasan Baiturrahman', status: 'Aktif' },
  { id: 'usr-004', nama: 'Budi Prasetyo', email: 'budi.prasetyo@alfalah.sch.id', role: 'Kepala SPPI (Lvl 2)', yayasan: 'Yayasan Al-Falah', status: 'Aktif' },
  { id: 'usr-005', nama: 'Dewi Lestari', email: 'dewi.lestari@alfalah.sch.id', role: 'Full Authorize (Lvl 3)', yayasan: 'Yayasan Al-Falah', status: 'Aktif' },
  { id: 'usr-006', nama: 'Rudi Hermawan', email: 'rudi.hermawan@bgn.go.id', role: 'BGN (Badan Gizi Nasional)', yayasan: 'Badan Gizi Nasional', status: 'Aktif' },
  { id: 'usr-007', nama: 'Linda Wijaya', email: 'linda.wijaya@investor.co.id', role: 'Investor', yayasan: 'Yayasan Al-Falah', status: 'Aktif' },
  { id: 'usr-008', nama: 'Dian Permata', email: 'dian.permata@alfalah.sch.id', role: 'Kepala SPPG (Lvl 1)', yayasan: 'Yayasan Al-Falah', status: 'Aktif' },
  { id: 'usr-009', nama: 'Rina Marlina', email: 'rina.marlina@nuruliman.sch.id', role: 'Kepala SPPI (Lvl 2)', yayasan: 'Yayasan Nurul Iman', status: 'Nonaktif' },
  { id: 'usr-010', nama: 'Agus Wijoyo', email: 'agus.wijoyo@bgn.go.id', role: 'BGN (Badan Gizi Nasional)', yayasan: 'Badan Gizi Nasional', status: 'Aktif' },
]

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

// ─── Main Component ───────────────────────────────────────────────────────────

export default function UserManagementPage() {
  const [users, setUsers] = useState<AppUser[]>(MOCK_USERS)
  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState('Semua')

  // Dialog states
  const [addOpen, setAddOpen] = useState(false)
  const [editOpen, setEditOpen] = useState(false)
  const [resetOpen, setResetOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState<AppUser | null>(null)

  // Form state
  const [form, setForm] = useState({ nama: '', email: '', password: '', role: '' as string, yayasan: '' })

  // ─── Filtered users ──────────────────────────────────────────────────────

  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      const matchSearch =
        !search ||
        u.nama.toLowerCase().includes(search.toLowerCase()) ||
        u.email.toLowerCase().includes(search.toLowerCase())
      const matchRole = roleFilter === 'Semua' || u.role === roleFilter
      return matchSearch && matchRole
    })
  }, [users, search, roleFilter])

  // ─── Reset form ──────────────────────────────────────────────────────────

  const resetForm = () => setForm({ nama: '', email: '', password: '', role: '', yayasan: '' })

  // ─── Validation ──────────────────────────────────────────────────────────

  const validateForm = (requirePassword = true): string | null => {
    if (!form.nama.trim()) return 'Nama wajib diisi'
    if (!form.email.trim()) return 'Email wajib diisi'
    if (!EMAIL_REGEX.test(form.email)) return 'Format email tidak valid'
    if (requirePassword && !form.password.trim()) return 'Password wajib diisi'
    if (!form.role) return 'Role wajib dipilih'
    if (!form.yayasan) return 'Yayasan wajib dipilih'
    return null
  }

  // ─── CRUD operations ─────────────────────────────────────────────────────

  const handleAdd = () => {
    const err = validateForm(true)
    if (err) { toast.error(err); return }

    const newUser: AppUser = {
      id: `usr-${Date.now()}`,
      nama: form.nama.trim(),
      email: form.email.trim(),
      role: form.role as UserRole,
      yayasan: form.yayasan,
      status: 'Aktif',
    }
    setUsers([...users, newUser])
    toast.success('User berhasil ditambahkan')
    resetForm()
    setAddOpen(false)
  }

  const openEdit = (user: AppUser) => {
    setSelectedUser(user)
    setForm({ nama: user.nama, email: user.email, password: '', role: user.role, yayasan: user.yayasan })
    setEditOpen(true)
  }

  const handleEdit = () => {
    if (!selectedUser) return
    const err = validateForm(false)
    if (err) { toast.error(err); return }

    setUsers((prev) =>
      prev.map((u) =>
        u.id === selectedUser.id
          ? {
              ...u,
              nama: form.nama.trim(),
              email: form.email.trim(),
              role: form.role as UserRole,
              yayasan: form.yayasan,
            }
          : u
      )
    )
    toast.success(`User "${form.nama.trim()}" berhasil diperbarui`)
    resetForm()
    setEditOpen(false)
    setSelectedUser(null)
  }

  const toggleStatus = (user: AppUser) => {
    const next = user.status === 'Aktif' ? 'Nonaktif' : 'Aktif'
    setUsers((prev) => prev.map((u) => (u.id === user.id ? { ...u, status: next } : u)))
    toast.info(`Status ${user.nama} diubah ke ${next}`)
  }

  const openResetConfirm = (user: AppUser) => {
    setSelectedUser(user)
    setResetOpen(true)
  }

  const handleResetPassword = () => {
    if (!selectedUser) return
    toast.success(`Password untuk "${selectedUser.nama}" berhasil direset`)
    setResetOpen(false)
    setSelectedUser(null)
  }

  // ─── Render ──────────────────────────────────────────────────────────────

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">User Management</h1>
          <p className="text-muted-foreground">Kelola akun pengguna SPPG MBG</p>
        </div>
        <Dialog open={addOpen} onOpenChange={(open) => { setAddOpen(open); if (!open) resetForm() }}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Tambah User Baru</DialogTitle>
              <DialogDescription>Daftarkan pengguna baru ke sistem SPPG MBG.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-3">
              <div>
                <Label htmlFor="u-nama">Nama *</Label>
                <Input id="u-nama" placeholder="Nama lengkap" value={form.nama} onChange={(e) => setForm({ ...form, nama: e.target.value })} />
              </div>
              <div>
                <Label htmlFor="u-email">Email *</Label>
                <Input id="u-email" type="email" placeholder="email@domain.com" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
              </div>
              <div>
                <Label htmlFor="u-password">Password *</Label>
                <Input id="u-password" type="password" placeholder="Minimal 6 karakter" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
              </div>
              <div>
                <Label htmlFor="u-role">Role *</Label>
                <Select value={form.role} onValueChange={(v) => setForm({ ...form, role: v })}>
                  <SelectTrigger id="u-role"><SelectValue placeholder="Pilih role" /></SelectTrigger>
                  <SelectContent>
                    {ROLES.map((r) => <SelectItem key={r} value={r}>{r}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="u-yayasan">Yayasan *</Label>
                <Select value={form.yayasan} onValueChange={(v) => setForm({ ...form, yayasan: v })}>
                  <SelectTrigger id="u-yayasan"><SelectValue placeholder="Pilih yayasan" /></SelectTrigger>
                  <SelectContent>
                    {YAYASAN_OPTIONS.map((y) => <SelectItem key={y} value={y}>{y}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => { setAddOpen(false); resetForm() }}>Batal</Button>
              <Button onClick={handleAdd}>Simpan</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Note: the add button needs its own dialog trigger since the outer dialog manages open state */}
      <div className="flex justify-end">
        <Button size="sm" onClick={() => { resetForm(); setAddOpen(true) }}>
          <PlusIcon className="size-4" />
          Tambah User
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1 max-w-sm">
          <SearchIcon className="absolute left-2.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            placeholder="Cari nama atau email..."
            className="pl-8"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Select value={roleFilter} onValueChange={setRoleFilter}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Filter role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Semua">Semua Role</SelectItem>
            {ROLES.map((r) => <SelectItem key={r} value={r}>{r}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">
            {filteredUsers.length} Pengguna
          </CardTitle>
        </CardHeader>
        <CardContent className="px-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nama</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead className="hidden md:table-cell">Yayasan</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.nama}</TableCell>
                  <TableCell className="text-muted-foreground">{user.email}</TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="text-xs">{user.role}</Badge>
                  </TableCell>
                  <TableCell className="hidden md:table-cell text-muted-foreground">{user.yayasan}</TableCell>
                  <TableCell>
                    <Badge variant={user.status === 'Aktif' ? 'default' : 'destructive'}>
                      {user.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Button variant="ghost" size="icon" className="size-8" title="Edit" onClick={() => openEdit(user)}>
                        <EditIcon className="size-3.5" />
                      </Button>
                      <Switch
                        checked={user.status === 'Aktif'}
                        onCheckedChange={() => toggleStatus(user)}
                        size="sm"
                        title={user.status === 'Aktif' ? 'Nonaktifkan' : 'Aktifkan'}
                      />
                      <Button variant="ghost" size="icon" className="size-8" title="Reset Password" onClick={() => openResetConfirm(user)}>
                        <KeyIcon className="size-3.5" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {filteredUsers.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                    Tidak ada pengguna ditemukan.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Edit User Dialog */}
      <Dialog open={editOpen} onOpenChange={(open) => { setEditOpen(open); if (!open) { resetForm(); setSelectedUser(null) } }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
            <DialogDescription>Perbarui data pengguna.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-3">
            <div>
              <Label htmlFor="eu-nama">Nama *</Label>
              <Input id="eu-nama" placeholder="Nama lengkap" value={form.nama} onChange={(e) => setForm({ ...form, nama: e.target.value })} />
            </div>
            <div>
              <Label htmlFor="eu-email">Email *</Label>
              <Input id="eu-email" type="email" placeholder="email@domain.com" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            </div>
            <div>
              <Label htmlFor="eu-password">Password</Label>
              <Input id="eu-password" type="password" placeholder="Biarkan kosong jika tidak ingin mengubah" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
            </div>
            <div>
              <Label htmlFor="eu-role">Role *</Label>
              <Select value={form.role} onValueChange={(v) => setForm({ ...form, role: v })}>
                <SelectTrigger id="eu-role"><SelectValue placeholder="Pilih role" /></SelectTrigger>
                <SelectContent>
                  {ROLES.map((r) => <SelectItem key={r} value={r}>{r}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="eu-yayasan">Yayasan *</Label>
              <Select value={form.yayasan} onValueChange={(v) => setForm({ ...form, yayasan: v })}>
                <SelectTrigger id="eu-yayasan"><SelectValue placeholder="Pilih yayasan" /></SelectTrigger>
                <SelectContent>
                  {YAYASAN_OPTIONS.map((y) => <SelectItem key={y} value={y}>{y}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setEditOpen(false); resetForm(); setSelectedUser(null) }}>Batal</Button>
            <Button onClick={handleEdit}>Simpan Perubahan</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reset Password Confirmation */}
      <AlertDialog open={resetOpen} onOpenChange={setResetOpen}>
        <AlertDialogContent size="sm">
          <AlertDialogHeader>
            <AlertDialogTitle>Reset Password</AlertDialogTitle>
            <AlertDialogDescription>
              Reset password untuk **{selectedUser?.nama}**?
              <br />
              Password baru akan dikirimkan ke email pengguna.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setSelectedUser(null)}>Batal</AlertDialogCancel>
            <AlertDialogAction onClick={handleResetPassword}>Reset Password</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
