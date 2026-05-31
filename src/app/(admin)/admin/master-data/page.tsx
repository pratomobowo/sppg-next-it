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
import { Textarea } from '@/components/ui/textarea'
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
  DialogTrigger,
} from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  EditIcon,
  PlusIcon,
  PowerIcon,
  UploadIcon,
} from 'lucide-react'

// ─── Types ────────────────────────────────────────────────────────────────────

type Dapur = {
  id: number
  nama: string
  alamat: string
  koordinat: string
  kapasitas: number
  pic: string
  hp: string
  yayasan: string
  status: 'Aktif' | 'Maintenance' | 'Nonaktif'
}

type Jadwal = {
  id: number
  tanggal: string
  menuUtama: string
  lauk: string
  sayur: string
  buah: string
  jumlahPorsi: number
}

type Supplier = {
  id: number
  nama: string
  hp: string
  alamat: string
  jumlahItem: number
  status: 'Aktif' | 'Nonaktif'
  catatan: string
}

type ItemGizi = {
  id: number
  nama: string
  kalori: number
  karbohidrat: number
  protein: number
  lemak: number
  kategori: string
}

type HargaAcuan = {
  id: number
  namaItem: string
  hargaMingguLalu: number
  hargaMingguIni: number
}

type MenuAssignment = {
  date: Date
  items: string[]
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

const DAYS = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab']
const MONTHS = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember',
]

const AVAILABLE_MENU_ITEMS = [
  'Nasi Putih', 'Ayam Goreng', 'Ayam Bakar', 'Sayur Asem', 'Sayur Sop',
  'Tahu Goreng', 'Tempe Goreng', 'Pisang', 'Jeruk', 'Semangka',
  'Ikan Goreng', 'Telur Dadar', 'Cah Kangkung', 'Tumis Tauge',
  'Apel', 'Pepaya', 'Sambal Goreng Kentang', 'Perkedel',
]

const MOCK_DAPUR: Dapur[] = [
  { id: 1, nama: 'Dapur Al-Falah 01', alamat: 'Jl. Raya Pasar Minggu No. 10, Jakarta Selatan', koordinat: '-6.2608, 106.8209', kapasitas: 500, pic: 'Ahmad Fauzi', hp: '0812-3456-7890', yayasan: 'Yayasan Al-Falah', status: 'Aktif' },
  { id: 2, nama: 'Dapur Al-Falah 02', alamat: 'Jl. Raya Condet No. 25, Jakarta Timur', koordinat: '-6.2759, 106.8535', kapasitas: 350, pic: 'Budi Santoso', hp: '0813-4567-8901', yayasan: 'Yayasan Al-Falah', status: 'Aktif' },
  { id: 3, nama: 'Dapur Nurul Iman 01', alamat: 'Jl. Ahmad Yani No. 50, Bandung', koordinat: '-6.9175, 107.6191', kapasitas: 400, pic: 'Rahmat Hidayat', hp: '0814-5678-9012', yayasan: 'Yayasan Nurul Iman', status: 'Aktif' },
  { id: 4, nama: 'Dapur Baiturrahman 01', alamat: 'Jl. Darmo No. 75, Surabaya', koordinat: '-7.2575, 112.7521', kapasitas: 600, pic: 'Siti Aisyah', hp: '0815-6789-0123', yayasan: 'Yayasan Baiturrahman', status: 'Aktif' },
  { id: 5, nama: 'Dapur Nurul Iman 02', alamat: 'Jl. Raya Cimahi No. 12, Cimahi', koordinat: '-6.8721, 107.5423', kapasitas: 250, pic: 'Dedi Kurniawan', hp: '0816-7890-1234', yayasan: 'Yayasan Nurul Iman', status: 'Maintenance' },
  { id: 6, nama: 'Dapur Baiturrahman 02', alamat: 'Jl. Raya Sidoarjo No. 30, Sidoarjo', koordinat: '-7.4476, 112.7183', kapasitas: 300, pic: 'Fatimah Zahra', hp: '0817-8901-2345', yayasan: 'Yayasan Baiturrahman', status: 'Nonaktif' },
]

const MOCK_JADWAL: Jadwal[] = [
  { id: 1, tanggal: '2026-06-01', menuUtama: 'Nasi Putih', lauk: 'Ayam Goreng', sayur: 'Sayur Asem', buah: 'Pisang', jumlahPorsi: 500 },
  { id: 2, tanggal: '2026-06-02', menuUtama: 'Nasi Putih', lauk: 'Ikan Goreng', sayur: 'Sayur Sop', buah: 'Jeruk', jumlahPorsi: 500 },
  { id: 3, tanggal: '2026-06-03', menuUtama: 'Nasi Putih', lauk: 'Telur Dadar', sayur: 'Tumis Tauge', buah: 'Apel', jumlahPorsi: 500 },
  { id: 4, tanggal: '2026-06-04', menuUtama: 'Nasi Putih', lauk: 'Ayam Bakar', sayur: 'Cah Kangkung', buah: 'Semangka', jumlahPorsi: 500 },
  { id: 5, tanggal: '2026-06-08', menuUtama: 'Nasi Putih', lauk: 'Tahu Goreng', sayur: 'Sayur Asem', buah: 'Pisang', jumlahPorsi: 450 },
  { id: 6, tanggal: '2026-06-09', menuUtama: 'Nasi Putih', lauk: 'Ayam Goreng', sayur: 'Sayur Sop', buah: 'Pepaya', jumlahPorsi: 450 },
  { id: 7, tanggal: '2026-06-10', menuUtama: 'Nasi Putih', lauk: 'Telur Dadar', sayur: 'Cah Kangkung', buah: 'Jeruk', jumlahPorsi: 500 },
  { id: 8, tanggal: '2026-06-15', menuUtama: 'Nasi Putih', lauk: 'Ikan Goreng', sayur: 'Tumis Tauge', buah: 'Apel', jumlahPorsi: 480 },
]

const MOCK_SUPPLIER: Supplier[] = [
  { id: 1, nama: 'PT Berkah Pangan Utama', hp: '0811-2233-4455', alamat: 'Jl. Industri No. 10, Jakarta Utara', jumlahItem: 25, status: 'Aktif', catatan: 'Supplier utama beras dan sayur' },
  { id: 2, nama: 'CV Ayam Segar Nusantara', hp: '0812-3344-5566', alamat: 'Jl. Peternakan No. 20, Bogor', jumlahItem: 8, status: 'Aktif', catatan: 'Ayam potong dan telur' },
  { id: 3, nama: 'UD Buah Segar Bandung', hp: '0813-4455-6677', alamat: 'Jl. Pasar Induk No. 5, Bandung', jumlahItem: 12, status: 'Aktif', catatan: 'Buah-buahan musiman' },
  { id: 4, nama: 'PT Tahu Tempe Jaya', hp: '0814-5566-7788', alamat: 'Jl. Perkampungan Industri No. 3, Tangerang', jumlahItem: 6, status: 'Aktif', catatan: 'Tahu dan tempe produksi lokal' },
  { id: 5, nama: 'CV Bumbu Rempah Nusa', hp: '0815-6677-8899', alamat: 'Jl. Pasar Bumbu No. 15, Semarang', jumlahItem: 18, status: 'Aktif', catatan: 'Rempah dan bumbu dapur' },
  { id: 6, nama: 'UD Sembako Maju', hp: '0816-7788-9900', alamat: 'Jl. Raya Cianjur No. 45, Cianjur', jumlahItem: 0, status: 'Nonaktif', catatan: 'Tidak aktif sejak Maret 2026' },
]

const MOCK_ITEMS: ItemGizi[] = [
  { id: 1, nama: 'Beras Putih', kalori: 360, karbohidrat: 78.9, protein: 6.8, lemak: 0.7, kategori: 'Karbohidrat' },
  { id: 2, nama: 'Daging Ayam', kalori: 165, karbohidrat: 0, protein: 31, lemak: 3.6, kategori: 'Protein Hewani' },
  { id: 3, nama: 'Ikan Kembung', kalori: 134, karbohidrat: 0, protein: 26, lemak: 3.1, kategori: 'Protein Hewani' },
  { id: 4, nama: 'Telur Ayam', kalori: 155, karbohidrat: 1.1, protein: 12.6, lemak: 10.6, kategori: 'Protein Hewani' },
  { id: 5, nama: 'Tahu Putih', kalori: 76, karbohidrat: 1.9, protein: 8.1, lemak: 4.8, kategori: 'Protein Nabati' },
  { id: 6, nama: 'Tempe Kedelai', kalori: 193, karbohidrat: 9.4, protein: 18.5, lemak: 10.8, kategori: 'Protein Nabati' },
  { id: 7, nama: 'Kangkung', kalori: 19, karbohidrat: 3.1, protein: 2.6, lemak: 0.2, kategori: 'Sayuran' },
  { id: 8, nama: 'Wortel', kalori: 41, karbohidrat: 9.6, protein: 0.9, lemak: 0.2, kategori: 'Sayuran' },
  { id: 9, nama: 'Pisang Ambon', kalori: 89, karbohidrat: 22.8, protein: 1.1, lemak: 0.3, kategori: 'Buah' },
  { id: 10, nama: 'Jeruk Manis', kalori: 47, karbohidrat: 11.8, protein: 0.9, lemak: 0.1, kategori: 'Buah' },
]

const MOCK_HARGA: HargaAcuan[] = [
  { id: 1, namaItem: 'Beras Putih (per kg)', hargaMingguLalu: 12500, hargaMingguIni: 12800 },
  { id: 2, namaItem: 'Daging Ayam (per kg)', hargaMingguLalu: 38000, hargaMingguIni: 37500 },
  { id: 3, namaItem: 'Ikan Kembung (per kg)', hargaMingguLalu: 32000, hargaMingguIni: 33000 },
  { id: 4, namaItem: 'Telur Ayam (per kg)', hargaMingguLalu: 28000, hargaMingguIni: 29000 },
  { id: 5, namaItem: 'Tahu Putih (per pcs)', hargaMingguLalu: 1000, hargaMingguIni: 1000 },
  { id: 6, namaItem: 'Tempe Kedelai (per pcs)', hargaMingguLalu: 4000, hargaMingguIni: 4500 },
  { id: 7, namaItem: 'Minyak Goreng (per L)', hargaMingguLalu: 17000, hargaMingguIni: 16500 },
  { id: 8, namaItem: 'Gula Pasir (per kg)', hargaMingguLalu: 15000, hargaMingguIni: 15200 },
  { id: 9, namaItem: 'Garam (per kg)', hargaMingguLalu: 8000, hargaMingguIni: 8000 },
  { id: 10, namaItem: 'Bawang Merah (per kg)', hargaMingguLalu: 35000, hargaMingguIni: 37000 },
]

const HARGAR_HISTORY = [
  { minggu: '19-25 Mei 2026', items: [
    { namaItem: 'Beras Putih', harga: 12500 },
    { namaItem: 'Daging Ayam', harga: 38000 },
    { namaItem: 'Ikan Kembung', harga: 32000 },
    { namaItem: 'Telur Ayam', harga: 28000 },
    { namaItem: 'Minyak Goreng', harga: 17000 },
  ]},
  { minggu: '12-18 Mei 2026', items: [
    { namaItem: 'Beras Putih', harga: 12300 },
    { namaItem: 'Daging Ayam', harga: 37500 },
    { namaItem: 'Ikan Kembung', harga: 31500 },
    { namaItem: 'Telur Ayam', harga: 27500 },
    { namaItem: 'Minyak Goreng', harga: 17500 },
  ]},
  { minggu: '5-11 Mei 2026', items: [
    { namaItem: 'Beras Putih', harga: 12200 },
    { namaItem: 'Daging Ayam', harga: 37000 },
    { namaItem: 'Ikan Kembung', harga: 31000 },
    { namaItem: 'Telur Ayam', harga: 27000 },
    { namaItem: 'Minyak Goreng', harga: 17800 },
  ]},
]

const YAYASAN_OPTIONS = [
  'Yayasan Al-Falah',
  'Yayasan Nurul Iman',
  'Yayasan Baiturrahman',
]

const KATEGORI_OPTIONS = [
  'Karbohidrat',
  'Protein Hewani',
  'Protein Nabati',
  'Sayuran',
  'Buah',
  'Bumbu',
  'Lainnya',
]

// ─── Status Badge Helper ──────────────────────────────────────────────────────

function StatusBadge({ status }: { status: Dapur['status'] }) {
  const variant = status === 'Aktif' ? 'default' : status === 'Maintenance' ? 'secondary' : 'destructive'
  const label = status
  return <Badge variant={variant}>{label}</Badge>
}

function SupplierStatusBadge({ status }: { status: Supplier['status'] }) {
  return <Badge variant={status === 'Aktif' ? 'default' : 'destructive'}>{status}</Badge>
}

// ─── Tab: Data Dapur ──────────────────────────────────────────────────────────

function DataDapurTab() {
  const [dapurs, setDapurs] = useState<Dapur[]>(MOCK_DAPUR)
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState({ nama: '', alamat: '', koordinat: '', kapasitas: '', pic: '', hp: '', yayasan: '' })

  const handleAdd = () => {
    if (!form.nama || !form.alamat || !form.pic || !form.hp || !form.yayasan) {
      toast.error('Lengkapi field yang wajib diisi')
      return
    }
    const newDapur: Dapur = {
      id: dapurs.length + 1,
      nama: form.nama,
      alamat: form.alamat,
      koordinat: form.koordinat || '-',
      kapasitas: parseInt(form.kapasitas) || 0,
      pic: form.pic,
      hp: form.hp,
      yayasan: form.yayasan,
      status: 'Aktif',
    }
    setDapurs([...dapurs, newDapur])
    toast.success('Dapur berhasil ditambahkan')
    setForm({ nama: '', alamat: '', koordinat: '', kapasitas: '', pic: '', hp: '', yayasan: '' })
    setOpen(false)
  }

  const toggleStatus = (id: number) => {
    setDapurs((prev) =>
      prev.map((d) => {
        if (d.id !== id) return d
        const next = d.status === 'Aktif' ? 'Nonaktif' : 'Aktif'
        toast.info(`Status ${d.nama} diubah ke ${next}`)
        return { ...d, status: next as Dapur['status'] }
      })
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">Kelola data dapur dan kapasitas produksi</p>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button size="sm">
              <PlusIcon className="size-4" />
              Tambah Dapur
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Tambah Dapur Baru</DialogTitle>
              <DialogDescription>Isi data dapur untuk didaftarkan ke sistem SPPG MBG.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-3">
              <div>
                <Label htmlFor="d-nama">Nama Dapur *</Label>
                <Input id="d-nama" placeholder="Nama dapur" value={form.nama} onChange={(e) => setForm({ ...form, nama: e.target.value })} />
              </div>
              <div>
                <Label htmlFor="d-alamat">Alamat *</Label>
                <Input id="d-alamat" placeholder="Alamat lengkap" value={form.alamat} onChange={(e) => setForm({ ...form, alamat: e.target.value })} />
              </div>
              <div>
                <Label htmlFor="d-koordinat">Koordinat</Label>
                <Input id="d-koordinat" placeholder="lat, lng" value={form.koordinat} onChange={(e) => setForm({ ...form, koordinat: e.target.value })} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="d-kapasitas">Kapasitas (porsi)</Label>
                  <Input id="d-kapasitas" type="number" placeholder="500" value={form.kapasitas} onChange={(e) => setForm({ ...form, kapasitas: e.target.value })} />
                </div>
                <div>
                  <Label htmlFor="d-yayasan">Yayasan *</Label>
                  <Select value={form.yayasan} onValueChange={(v) => setForm({ ...form, yayasan: v })}>
                    <SelectTrigger id="d-yayasan"><SelectValue placeholder="Pilih yayasan" /></SelectTrigger>
                    <SelectContent>
                      {YAYASAN_OPTIONS.map((y) => <SelectItem key={y} value={y}>{y}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="d-pic">PIC *</Label>
                  <Input id="d-pic" placeholder="Nama PIC" value={form.pic} onChange={(e) => setForm({ ...form, pic: e.target.value })} />
                </div>
                <div>
                  <Label htmlFor="d-hp">No. HP *</Label>
                  <Input id="d-hp" placeholder="0812-xxxx-xxxx" value={form.hp} onChange={(e) => setForm({ ...form, hp: e.target.value })} />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setOpen(false)}>Batal</Button>
              <Button onClick={handleAdd}>Simpan</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nama</TableHead>
              <TableHead className="hidden md:table-cell">Alamat</TableHead>
              <TableHead className="hidden lg:table-cell">Koordinat</TableHead>
              <TableHead className="text-right">Kapasitas</TableHead>
              <TableHead>PIC</TableHead>
              <TableHead className="hidden md:table-cell">HP</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {dapurs.map((d) => (
              <TableRow key={d.id}>
                <TableCell className="font-medium">{d.nama}</TableCell>
                <TableCell className="hidden md:table-cell text-muted-foreground max-w-[180px] truncate" title={d.alamat}>{d.alamat}</TableCell>
                <TableCell className="hidden lg:table-cell text-muted-foreground text-xs">{d.koordinat}</TableCell>
                <TableCell className="text-right">{d.kapasitas.toLocaleString('id-ID')}</TableCell>
                <TableCell>{d.pic}</TableCell>
                <TableCell className="hidden md:table-cell text-muted-foreground">{d.hp}</TableCell>
                <TableCell><StatusBadge status={d.status} /></TableCell>
                <TableCell>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="icon" className="size-8" title="Edit">
                      <EditIcon className="size-3.5" />
                    </Button>
                    <Button variant="ghost" size="icon" className="size-8" title={d.status === 'Aktif' ? 'Nonaktifkan' : 'Aktifkan'} onClick={() => toggleStatus(d.id)}>
                      <PowerIcon className="size-3.5" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

// ─── Tab: Penjadwalan Menu ────────────────────────────────────────────────────

function PenjadwalanMenuTab() {
  const [viewMode, setViewMode] = useState<'kalender' | 'list'>('kalender')
  const [currentMonth, setCurrentMonth] = useState(new Date(2026, 5, 1)) // June 2026
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [menuAssignments, setMenuAssignments] = useState<MenuAssignment[]>(
    MOCK_JADWAL.map((j) => ({
      date: new Date(j.tanggal + 'T00:00:00'),
      items: [j.menuUtama, j.lauk, j.sayur, j.buah].filter(Boolean),
    }))
  )

  const assignedDates = useMemo(() => {
    const set = new Set<string>()
    menuAssignments.forEach((a) => set.add(a.date.toDateString()))
    return set
  }, [menuAssignments])

  const today = new Date(2026, 5, 1)
  const year = currentMonth.getFullYear()
  const month = currentMonth.getMonth()
  const firstDay = new Date(year, month, 1)
  const startDayOfWeek = firstDay.getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()

  const prevMonth = () => setCurrentMonth(new Date(year, month - 1, 1))
  const nextMonth = () => setCurrentMonth(new Date(year, month + 1, 1))

  const selectedAssignment = selectedDate
    ? menuAssignments.find((a) => a.date.toDateString() === selectedDate.toDateString())
    : null

  const addMenuItemToDate = (date: Date, item: string) => {
    setMenuAssignments((prev) => {
      const existing = prev.find((a) => a.date.toDateString() === date.toDateString())
      if (existing) {
        return prev.map((a) =>
          a.date.toDateString() === date.toDateString()
            ? { ...a, items: a.items.includes(item) ? a.items : [...a.items, item] }
            : a
        )
      }
      return [...prev, { date: new Date(date), items: [item] }]
    })
    toast.success(`"${item}" ditambahkan ke menu`)
  }

  const removeMenuItem = (date: Date, item: string) => {
    setMenuAssignments((prev) =>
      prev.map((a) =>
        a.date.toDateString() === date.toDateString()
          ? { ...a, items: a.items.filter((i) => i !== item) }
          : a
      ).filter((a) => a.items.length > 0)
    )
    toast.info(`"${item}" dihapus dari menu`)
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">Atur jadwal menu harian per dapur</p>

      {/* Segmented toggle */}
      <div className="inline-flex rounded-lg bg-muted p-1">
        <button
          className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${viewMode === 'kalender' ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
          onClick={() => setViewMode('kalender')}
        >
          Kalender
        </button>
        <button
          className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${viewMode === 'list' ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
          onClick={() => setViewMode('list')}
        >
          List
        </button>
      </div>

      {viewMode === 'kalender' ? (
        <div className="grid gap-4 lg:grid-cols-[1fr_300px]">
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">{MONTHS[month]} {year}</CardTitle>
                <div className="flex gap-1">
                  <Button variant="ghost" size="icon" className="size-8" onClick={prevMonth}>
                    <ChevronLeftIcon className="size-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="size-8" onClick={nextMonth}>
                    <ChevronRightIcon className="size-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-7 gap-1">
                {DAYS.map((d) => (
                  <div key={d} className="text-center text-xs font-medium text-muted-foreground py-1">
                    {d}
                  </div>
                ))}
                {Array.from({ length: startDayOfWeek }).map((_, i) => (
                  <div key={`empty-${i}`} />
                ))}
                {Array.from({ length: daysInMonth }, (_, i) => {
                  const day = i + 1
                  const date = new Date(year, month, day, 12)
                  const isAssigned = assignedDates.has(date.toDateString())
                  const isSelected = selectedDate?.toDateString() === date.toDateString()
                  const isPast = date < today && date.toDateString() !== today.toDateString()
                  return (
                    <button
                      key={day}
                      className={`relative flex flex-col items-center justify-center rounded-md py-1.5 text-sm transition-colors
                        ${isSelected ? 'bg-primary text-primary-foreground' : isPast ? 'text-muted-foreground/50' : 'hover:bg-muted'}
                      `}
                      onClick={() => setSelectedDate(date)}
                    >
                      {day}
                      {isAssigned && (
                        <span className={`mt-0.5 size-1.5 rounded-full ${isSelected ? 'bg-primary-foreground' : 'bg-primary'}`} />
                      )}
                    </button>
                  )
                })}
              </div>
            </CardContent>
          </Card>

          {/* Detail panel */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">
                {selectedDate
                  ? `Menu ${selectedDate.getDate()} ${MONTHS[selectedDate.getMonth()]} ${selectedDate.getFullYear()}`
                  : 'Pilih tanggal'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {selectedDate ? (
                <div className="space-y-3">
                  {selectedAssignment && selectedAssignment.items.length > 0 ? (
                    <ul className="space-y-1.5">
                      {selectedAssignment.items.map((item) => (
                        <li key={item} className="flex items-center justify-between text-sm">
                          <span className="capitalize">{item}</span>
                          <Button variant="ghost" size="icon" className="size-6 text-muted-foreground hover:text-destructive" onClick={() => removeMenuItem(selectedDate, item)}>
                            &times;
                          </Button>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-muted-foreground">Belum ada menu terjadwal.</p>
                  )}
                  <Select onValueChange={(v) => addMenuItemToDate(selectedDate, v)}>
                    <SelectTrigger className="w-full text-sm">
                      <SelectValue placeholder="+ Tambah item menu" />
                    </SelectTrigger>
                    <SelectContent>
                      {AVAILABLE_MENU_ITEMS.filter((item) => !selectedAssignment?.items.includes(item)).map((item) => (
                        <SelectItem key={item} value={item}>{item}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">Klik tanggal pada kalender untuk melihat dan mengatur menu.</p>
              )}
            </CardContent>
          </Card>
        </div>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tanggal</TableHead>
                <TableHead>Menu Utama</TableHead>
                <TableHead>Lauk</TableHead>
                <TableHead>Sayur</TableHead>
                <TableHead>Buah</TableHead>
                <TableHead className="text-right">Jumlah Porsi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {MOCK_JADWAL.map((j) => (
                <TableRow key={j.id}>
                  <TableCell className="font-medium">
                    {new Date(j.tanggal + 'T00:00:00').toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </TableCell>
                  <TableCell>{j.menuUtama}</TableCell>
                  <TableCell>{j.lauk}</TableCell>
                  <TableCell>{j.sayur}</TableCell>
                  <TableCell>{j.buah}</TableCell>
                  <TableCell className="text-right">{j.jumlahPorsi.toLocaleString('id-ID')}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  )
}

// ─── Tab: Katalog Supplier ────────────────────────────────────────────────────

function KatalogSupplierTab() {
  const [suppliers, setSuppliers] = useState<Supplier[]>(MOCK_SUPPLIER)
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState({ nama: '', hp: '', alamat: '', catatan: '' })

  const handleAdd = () => {
    if (!form.nama || !form.hp || !form.alamat) {
      toast.error('Nama, HP, dan Alamat wajib diisi')
      return
    }
    const newSupplier: Supplier = {
      id: suppliers.length + 1,
      nama: form.nama,
      hp: form.hp,
      alamat: form.alamat,
      jumlahItem: 0,
      status: 'Aktif',
      catatan: form.catatan,
    }
    setSuppliers([...suppliers, newSupplier])
    toast.success('Supplier berhasil ditambahkan')
    setForm({ nama: '', hp: '', alamat: '', catatan: '' })
    setOpen(false)
  }

  const toggleStatus = (id: number) => {
    setSuppliers((prev) =>
      prev.map((s) => {
        if (s.id !== id) return s
        const next = s.status === 'Aktif' ? 'Nonaktif' : 'Aktif'
        toast.info(`Status ${s.nama} diubah ke ${next}`)
        return { ...s, status: next as Supplier['status'] }
      })
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">Kelola katalog supplier bahan baku</p>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button size="sm">
              <PlusIcon className="size-4" />
              Tambah Supplier
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Tambah Supplier Baru</DialogTitle>
              <DialogDescription>Daftarkan supplier bahan baku ke sistem.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-3">
              <div>
                <Label htmlFor="s-nama">Nama Supplier *</Label>
                <Input id="s-nama" placeholder="Nama supplier" value={form.nama} onChange={(e) => setForm({ ...form, nama: e.target.value })} />
              </div>
              <div>
                <Label htmlFor="s-hp">Kontak HP *</Label>
                <Input id="s-hp" placeholder="0811-xxxx-xxxx" value={form.hp} onChange={(e) => setForm({ ...form, hp: e.target.value })} />
              </div>
              <div>
                <Label htmlFor="s-alamat">Alamat *</Label>
                <Input id="s-alamat" placeholder="Alamat lengkap" value={form.alamat} onChange={(e) => setForm({ ...form, alamat: e.target.value })} />
              </div>
              <div>
                <Label htmlFor="s-catatan">Catatan</Label>
                <Textarea id="s-catatan" placeholder="Catatan tambahan" rows={2} value={form.catatan} onChange={(e) => setForm({ ...form, catatan: e.target.value })} />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setOpen(false)}>Batal</Button>
              <Button onClick={handleAdd}>Simpan</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nama Supplier</TableHead>
              <TableHead>Kontak HP</TableHead>
              <TableHead className="hidden md:table-cell">Alamat</TableHead>
              <TableHead className="text-right">Jumlah Item</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {suppliers.map((s) => (
              <TableRow key={s.id}>
                <TableCell className="font-medium">{s.nama}</TableCell>
                <TableCell className="text-muted-foreground">{s.hp}</TableCell>
                <TableCell className="hidden md:table-cell text-muted-foreground max-w-[200px] truncate" title={s.alamat}>{s.alamat}</TableCell>
                <TableCell className="text-right">{s.jumlahItem}</TableCell>
                <TableCell><SupplierStatusBadge status={s.status} /></TableCell>
                <TableCell>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="icon" className="size-8" title="Edit">
                      <EditIcon className="size-3.5" />
                    </Button>
                    <Button variant="ghost" size="icon" className="size-8" title={s.status === 'Aktif' ? 'Nonaktifkan' : 'Aktifkan'} onClick={() => toggleStatus(s.id)}>
                      <PowerIcon className="size-3.5" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

// ─── Tab: Katalog Item & Gizi ─────────────────────────────────────────────────

function KatalogItemGiziTab() {
  const [items, setItems] = useState<ItemGizi[]>(MOCK_ITEMS)
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState({ nama: '', kalori: '', karbohidrat: '', protein: '', lemak: '', kategori: '' })

  const handleAdd = () => {
    if (!form.nama || !form.kategori) {
      toast.error('Nama dan Kategori wajib diisi')
      return
    }
    const newItem: ItemGizi = {
      id: items.length + 1,
      nama: form.nama,
      kalori: parseFloat(form.kalori) || 0,
      karbohidrat: parseFloat(form.karbohidrat) || 0,
      protein: parseFloat(form.protein) || 0,
      lemak: parseFloat(form.lemak) || 0,
      kategori: form.kategori,
    }
    setItems([...items, newItem])
    toast.success('Item berhasil ditambahkan')
    setForm({ nama: '', kalori: '', karbohidrat: '', protein: '', lemak: '', kategori: '' })
    setOpen(false)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">Katalog item bahan makanan dan nilai gizi per 100g</p>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => toast.info('Import CSV akan tersedia')}>
            <UploadIcon className="size-4" />
            Import CSV
          </Button>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button size="sm">
                <PlusIcon className="size-4" />
                Tambah Item
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Tambah Item Baru</DialogTitle>
                <DialogDescription>Tambahkan item bahan makanan beserta nilai gizinya.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-3">
                <div>
                  <Label htmlFor="i-nama">Nama Item *</Label>
                  <Input id="i-nama" placeholder="Nama bahan makanan" value={form.nama} onChange={(e) => setForm({ ...form, nama: e.target.value })} />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label htmlFor="i-kalori">Kalori (per 100g)</Label>
                    <Input id="i-kalori" type="number" placeholder="0" value={form.kalori} onChange={(e) => setForm({ ...form, kalori: e.target.value })} />
                  </div>
                  <div>
                    <Label htmlFor="i-karbohidrat">Karbohidrat (g)</Label>
                    <Input id="i-karbohidrat" type="number" placeholder="0" value={form.karbohidrat} onChange={(e) => setForm({ ...form, karbohidrat: e.target.value })} />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label htmlFor="i-protein">Protein (g)</Label>
                    <Input id="i-protein" type="number" placeholder="0" value={form.protein} onChange={(e) => setForm({ ...form, protein: e.target.value })} />
                  </div>
                  <div>
                    <Label htmlFor="i-lemak">Lemak (g)</Label>
                    <Input id="i-lemak" type="number" placeholder="0" value={form.lemak} onChange={(e) => setForm({ ...form, lemak: e.target.value })} />
                  </div>
                </div>
                <div>
                  <Label htmlFor="i-kategori">Kategori *</Label>
                  <Select value={form.kategori} onValueChange={(v) => setForm({ ...form, kategori: v })}>
                    <SelectTrigger id="i-kategori"><SelectValue placeholder="Pilih kategori" /></SelectTrigger>
                    <SelectContent>
                      {KATEGORI_OPTIONS.map((k) => <SelectItem key={k} value={k}>{k}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setOpen(false)}>Batal</Button>
                <Button onClick={handleAdd}>Simpan</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nama</TableHead>
              <TableHead className="text-right">Kalori</TableHead>
              <TableHead className="text-right">Karbohidrat (g)</TableHead>
              <TableHead className="text-right">Protein (g)</TableHead>
              <TableHead className="text-right">Lemak (g)</TableHead>
              <TableHead>Kategori</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="font-medium">{item.nama}</TableCell>
                <TableCell className="text-right">{item.kalori}</TableCell>
                <TableCell className="text-right">{item.karbohidrat}</TableCell>
                <TableCell className="text-right">{item.protein}</TableCell>
                <TableCell className="text-right">{item.lemak}</TableCell>
                <TableCell>
                  <Badge variant="secondary">{item.kategori}</Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

// ─── Tab: Harga Acuan ─────────────────────────────────────────────────────────

function HargaAcuanTab() {
  const [harga, setHarga] = useState<HargaAcuan[]>(MOCK_HARGA)
  const [currentWeekOffset, setCurrentWeekOffset] = useState(0)

  const weekLabel = useMemo(() => {
    const d = new Date(2026, 5, 1)
    d.setDate(d.getDate() + currentWeekOffset * 7)
    const start = new Date(d)
    const end = new Date(d)
    end.setDate(end.getDate() + 6)
    const fmt = (dt: Date) => dt.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })
    return `${fmt(start)} - ${fmt(end)}`
  }, [currentWeekOffset])

  const updateHarga = (id: number, value: string) => {
    const num = parseFloat(value) || 0
    setHarga((prev) => prev.map((h) => (h.id === id ? { ...h, hargaMingguIni: num } : h)))
  }

  const pctChange = (lalu: number, ini: number): string => {
    if (lalu === 0) return '0%'
    const pct = ((ini - lalu) / lalu) * 100
    return `${pct > 0 ? '+' : ''}${pct.toFixed(1)}%`
  }

  const handleSave = () => {
    toast.success('Harga acuan berhasil disimpan')
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">Atur harga acuan mingguan untuk procurement</p>
        <Button size="sm" onClick={handleSave}>Simpan Harga Acuan</Button>
      </div>

      {/* Week controls */}
      <div className="flex items-center gap-3">
        <Button variant="outline" size="icon" className="size-8" onClick={() => setCurrentWeekOffset((w) => w - 1)}>
          <ChevronLeftIcon className="size-4" />
        </Button>
        <span className="text-sm font-medium min-w-[200px] text-center">{weekLabel}</span>
        <Button variant="outline" size="icon" className="size-8" onClick={() => setCurrentWeekOffset((w) => w + 1)} disabled={currentWeekOffset >= 0}>
          <ChevronRightIcon className="size-4" />
        </Button>
        <Button variant="ghost" size="sm" onClick={() => setCurrentWeekOffset(0)} disabled={currentWeekOffset === 0}>
          Minggu Ini
        </Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nama Item</TableHead>
              <TableHead className="text-right">Harga Minggu Lalu</TableHead>
              <TableHead className="text-right">Harga Minggu Ini</TableHead>
              <TableHead className="text-right">% Perubahan</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {harga.map((h) => {
              const pct = pctChange(h.hargaMingguLalu, h.hargaMingguIni)
              const isUp = h.hargaMingguIni > h.hargaMingguLalu
              const isDown = h.hargaMingguIni < h.hargaMingguLalu
              return (
                <TableRow key={h.id}>
                  <TableCell className="font-medium">{h.namaItem}</TableCell>
                  <TableCell className="text-right text-muted-foreground">
                    Rp {h.hargaMingguLalu.toLocaleString('id-ID')}
                  </TableCell>
                  <TableCell className="text-right">
                    <Input
                      type="number"
                      className="w-32 inline-block text-right"
                      value={h.hargaMingguIni}
                      onChange={(e) => updateHarga(h.id, e.target.value)}
                    />
                  </TableCell>
                  <TableCell className={`text-right font-medium ${isUp ? 'text-red-500' : isDown ? 'text-green-500' : 'text-muted-foreground'}`}>
                    {isUp && '▲ '}{isDown && '▼ '}{pct}
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </div>

      {/* History */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Riwayat Harga Acuan</CardTitle>
        </CardHeader>
        <CardContent className="px-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Minggu</TableHead>
                <TableHead>Item</TableHead>
                <TableHead className="text-right">Harga</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {HARGAR_HISTORY.flatMap((week) =>
                week.items.map((item, idx) => (
                  <TableRow key={`${week.minggu}-${idx}`}>
                    {idx === 0 && (
                      <TableCell rowSpan={week.items.length} className="font-medium align-top">
                        {week.minggu}
                      </TableCell>
                    )}
                    <TableCell>{item.namaItem}</TableCell>
                    <TableCell className="text-right">Rp {item.harga.toLocaleString('id-ID')}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function MasterDataPage() {
  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Master Data</h1>
        <p className="text-muted-foreground">Pengelolaan data master SPPG Makan Bergizi Gratis</p>
      </div>

      <Tabs defaultValue="data-dapur">
        <TabsList className="w-full overflow-x-auto flex-nowrap">
          <TabsTrigger value="data-dapur">Data Dapur</TabsTrigger>
          <TabsTrigger value="penjadwalan-menu">Penjadwalan Menu</TabsTrigger>
          <TabsTrigger value="katalog-supplier">Katalog Supplier</TabsTrigger>
          <TabsTrigger value="katalog-item">Katalog Item & Gizi</TabsTrigger>
          <TabsTrigger value="harga-acuan">Harga Acuan</TabsTrigger>
        </TabsList>
        <TabsContent value="data-dapur" className="mt-4">
          <DataDapurTab />
        </TabsContent>
        <TabsContent value="penjadwalan-menu" className="mt-4">
          <PenjadwalanMenuTab />
        </TabsContent>
        <TabsContent value="katalog-supplier" className="mt-4">
          <KatalogSupplierTab />
        </TabsContent>
        <TabsContent value="katalog-item" className="mt-4">
          <KatalogItemGiziTab />
        </TabsContent>
        <TabsContent value="harga-acuan" className="mt-4">
          <HargaAcuanTab />
        </TabsContent>
      </Tabs>
    </div>
  )
}
