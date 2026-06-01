'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import {
  ArrowLeftIcon,
  MessageSquareIcon,
  PlusIcon,
  Settings2Icon,
  HistoryIcon,
  CheckCircle2Icon,
  XCircleIcon,
  RefreshCwIcon,
  SendIcon,
  EyeIcon,
  EyeOffIcon,
  ClockIcon
} from 'lucide-react'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'

// ─── Types ────────────────────────────────────────────────────────────────────

type Template = {
  id: string
  name: string
  trigger: string
  status: 'Aktif' | 'Nonaktif'
  penerima: string
  message: string
}

type LogEntry = {
  id: string
  timestamp: string
  event: string
  penerima: string
  role: string
  status: 'Terkirim' | 'Dibaca' | 'Gagal' | 'Pending'
  pesan: string
  reason?: string
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

const MOCK_TEMPLATES: Template[] = [
  { id: 'T-001', name: 'DO Baru untuk SPPG', trigger: 'do.created.sppg', status: 'Aktif', penerima: 'Kepala SPPG (Lvl 1)', message: 'Halo Kepala SPPG, PIC Dapur {{pic_name}} baru saja membuat DO {{do_number}} untuk {{dapur_name}} senilai {{total_amount}} pada tanggal {{date}}. Silakan tinjau dan lakukan persetujuan di: {{login_link}}' },
  { id: 'T-002', name: 'DO Disetujui SPPG', trigger: 'do.approved.sppg', status: 'Aktif', penerima: 'Kepala SPPI (Lvl 2)', message: 'DO {{do_number}} untuk {{dapur_name}} telah disetujui oleh Kepala SPPG. Saat ini menunggu pemeriksaan harga & kualitas oleh Kepala SPPI. Link: {{login_link}}' },
  { id: 'T-003', name: 'DO Direvisi (Ditolak)', trigger: 'do.revised', status: 'Aktif', penerima: 'PIC Dapur', message: 'Perhatian PIC Dapur {{pic_name}}, DO {{do_number}} Anda dikembalikan dengan catatan revisi: "{{revision_note}}". Silakan perbaiki di: {{login_link}}' },
  { id: 'T-004', name: 'Konfirmasi Dana 12 Hari', trigger: 'dana.confirmed', status: 'Aktif', penerima: 'PIC Dapur', message: 'Halo PIC Dapur, dana 12 hari untuk periode {{periode}} senilai {{dana_amount}} telah dikonfirmasi dan ditransfer oleh Full Authorize. Silakan lakukan pencatatan kas masuk.' }
]

const MOCK_LOGS: LogEntry[] = [
  { id: 'L-001', timestamp: '2026-06-01 08:15:30', event: 'do.created.sppg', penerima: '0812-3456-7890', role: 'Kepala SPPG', status: 'Dibaca', pesan: 'Halo Kepala SPPG, PIC Dapur Ahmad Fauzi baru saja membuat DO DO-045 untuk Dapur Sejahtera 1 senilai Rp 2.450.000...' },
  { id: 'L-002', timestamp: '2026-06-01 08:10:12', event: 'dana.confirmed', penerima: '0813-4567-8901', role: 'PIC Dapur', status: 'Terkirim', pesan: 'Halo PIC Dapur, dana 12 hari untuk periode Minggu ke-1 senilai Rp 14.400.000 telah dikonfirmasi...' },
  { id: 'L-003', timestamp: '2026-05-31 16:30:45', event: 'do.revised', penerima: '0813-4567-8901', role: 'PIC Dapur', status: 'Gagal', pesan: 'Perhatian PIC Dapur Ahmad Fauzi, DO DO-042 Anda dikembalikan dengan catatan...', reason: 'Undelivered - Nomor tidak aktif' },
  { id: 'L-004', timestamp: '2026-05-31 14:00:22', event: 'do.approved.sppg', penerima: '0814-5678-9012', role: 'Kepala SPPI', status: 'Dibaca', pesan: 'DO DO-044 untuk Dapur Sejahtera 2 telah disetujui oleh Kepala SPPG...' }
]

const PLACEHOLDERS = [
  '{{do_number}}', '{{dapur_name}}', '{{pic_name}}', '{{total_amount}}',
  '{{date}}', '{{approver_role}}', '{{revision_note}}', '{{periode}}',
  '{{dana_amount}}', '{{login_link}}'
]

export default function WaGatewayPage() {
  const router = useRouter()

  const [templates, setTemplates] = useState<Template[]>(MOCK_TEMPLATES)
  const [logs, setLogs] = useState<LogEntry[]>(MOCK_LOGS)
  const [activeTab, setActiveTab] = useState('templates')

  // Config provider states
  const [provider, setProvider] = useState('Fonnte')
  const [apiKey, setApiKey] = useState('fonnte_api_key_hidden_token_xyz')
  const [showApiKey, setShowApiKey] = useState(false)
  const [senderNumber, setSenderNumber] = useState('081234567890')
  const [autoRetry, setAutoRetry] = useState(true)

  // Dialog Add template
  const [addOpen, setAddOpen] = useState(false)
  const [form, setForm] = useState({ name: '', trigger: '', penerima: '', message: '' })

  // Dialog Test Send
  const [testOpen, setTestOpen] = useState(false)
  const [testTarget, setTestTarget] = useState('')

  // Handlers
  const toggleTemplateStatus = (id: string) => {
    setTemplates((prev) =>
      prev.map((t) => {
        if (t.id !== id) return t
        const next = t.status === 'Aktif' ? 'Nonaktif' : 'Aktif'
        toast.info(`Template ${t.name} diubah ke ${next}`)
        return { ...t, status: next }
      })
    )
  }

  const handleAddTemplate = () => {
    if (!form.name || !form.trigger || !form.message) {
      toast.error('Lengkapi field wajib')
      return
    }
    const newTemplate: Template = {
      id: `T-00${templates.length + 1}`,
      name: form.name,
      trigger: form.trigger,
      status: 'Aktif',
      penerima: form.penerima || 'PIC Dapur',
      message: form.message
    }
    setTemplates([...templates, newTemplate])
    toast.success('Template WA baru berhasil ditambahkan')
    setForm({ name: '', trigger: '', penerima: '', message: '' })
    setAddOpen(false)
  }

  const handleResend = (logId: string) => {
    toast.promise(
      new Promise((resolve) => setTimeout(resolve, 800)),
      {
        loading: 'Mengirim ulang pesan...',
        success: () => {
          setLogs((prev) =>
            prev.map((l) => (l.id === logId ? { ...l, status: 'Terkirim' as const } : l))
          )
          return 'Pesan berhasil dikirim ulang'
        },
        error: 'Gagal mengirim ulang'
      }
    )
  }

  const handleTestSend = () => {
    if (!testTarget.trim()) {
      toast.error('Masukkan nomor WhatsApp tujuan')
      return
    }
    toast.promise(
      new Promise((resolve) => setTimeout(resolve, 1000)),
      {
        loading: 'Mengirim pesan uji coba...',
        success: 'Pesan tes berhasil dikirim ke provider WA Gateway',
        error: 'Pesan tes gagal dikirim'
      }
    )
    setTestOpen(false)
    setTestTarget('')
  }

  const getStatusIcon = (status: LogEntry['status']) => {
    switch (status) {
      case 'Dibaca':
        return <CheckCircle2Icon className="size-4 text-sky-500 fill-sky-500/10" />
      case 'Terkirim':
        return <CheckCircle2Icon className="size-4 text-emerald-500 fill-emerald-500/10" />
      case 'Gagal':
        return <XCircleIcon className="size-4 text-red-500 fill-red-500/10" />
      case 'Pending':
        return <ClockIcon className="size-4 text-gray-400" />
    }
  }

  return (
    <div className="space-y-6 p-4 sm:p-6">
      {/* ─── Back Button & Header ─── */}
      <div className="flex items-center gap-3">
        <Button variant="outline" size="icon" onClick={() => router.back()} type="button">
          <ArrowLeftIcon className="size-4" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">WA Notification Gateway</h1>
          <p className="text-muted-foreground">Kelola template notifikasi, log pengiriman, dan konfigurasi API gateway</p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="templates" className="flex items-center gap-2">
            <MessageSquareIcon className="size-4" />
            Template Manager
          </TabsTrigger>
          <TabsTrigger value="logs" className="flex items-center gap-2">
            <HistoryIcon className="size-4" />
            Notification Log
          </TabsTrigger>
          <TabsTrigger value="config" className="flex items-center gap-2">
            <Settings2Icon className="size-4" />
            Config Provider
          </TabsTrigger>
        </TabsList>

        {/* ═══ TAB 1: Template Manager ═══ */}
        <TabsContent value="templates" className="space-y-4 mt-4">
          <div className="flex justify-between items-center">
            <p className="text-sm text-muted-foreground">Daftar template notifikasi otomatis WhatsApp</p>
            <Button size="sm" onClick={() => setAddOpen(true)}>
              <PlusIcon className="size-4 mr-1.5" />
              Template Baru
            </Button>
          </div>

          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nama Template</TableHead>
                    <TableHead>Trigger Event</TableHead>
                    <TableHead>Penerima</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {templates.map((t) => (
                    <TableRow key={t.id}>
                      <TableCell className="font-semibold">{t.name}</TableCell>
                      <TableCell className="font-mono text-xs text-muted-foreground">{t.trigger}</TableCell>
                      <TableCell>{t.penerima}</TableCell>
                      <TableCell>
                        <Switch
                          checked={t.status === 'Aktif'}
                          onCheckedChange={() => toggleTemplateStatus(t.id)}
                          size="sm"
                        />
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm" onClick={() => toast.info('Fitur edit template segera hadir')}>
                          Edit
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ═══ TAB 2: Notification Log ═══ */}
        <TabsContent value="logs" className="space-y-4 mt-4">
          <p className="text-sm text-muted-foreground">Log riwayat pengiriman notifikasi otomatis WA Gateway</p>
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Timestamp</TableHead>
                    <TableHead>Event</TableHead>
                    <TableHead>Penerima</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Isi Pesan</TableHead>
                    <TableHead className="text-right">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {logs.map((log) => (
                    <TableRow key={log.id}>
                      <TableCell className="font-mono text-xs text-muted-foreground whitespace-nowrap">{log.timestamp}</TableCell>
                      <TableCell className="font-mono text-xs">{log.event}</TableCell>
                      <TableCell className="font-semibold">{log.penerima}</TableCell>
                      <TableCell>{log.role}</TableCell>
                      <TableCell>
                        <span className="flex items-center gap-1.5 text-xs font-semibold">
                          {getStatusIcon(log.status)}
                          {log.status}
                        </span>
                      </TableCell>
                      <TableCell className="max-w-[200px] truncate text-xs text-muted-foreground" title={log.pesan}>
                        {log.pesan}
                      </TableCell>
                      <TableCell className="text-right whitespace-nowrap">
                        {log.status === 'Gagal' ? (
                          <Button variant="outline" size="sm" onClick={() => handleResend(log.id)} className="h-7 px-2 border-red-200 text-red-600 hover:bg-red-50">
                            <RefreshCwIcon className="size-3 mr-1" />
                            Kirim Ulang
                          </Button>
                        ) : (
                          <span className="text-xs text-muted-foreground">Selesai</span>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ═══ TAB 3: Config Provider ═══ */}
        <TabsContent value="config" className="space-y-4 mt-4">
          <div className="grid gap-6 md:grid-cols-[1fr_320px]">
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Settings2Icon className="size-4 text-primary" />
                  Konfigurasi WA Gateway
                </CardTitle>
                <CardDescription>Atur koneksi API provider WhatsApp Anda</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="provider">WA Gateway Provider</Label>
                  <select
                    id="provider"
                    value={provider}
                    onChange={(e) => setProvider(e.target.value)}
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  >
                    <option>Fonnte</option>
                    <option>WATI</option>
                    <option>WA Business API</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="api-key">API Key / Token</Label>
                  <div className="relative">
                    <Input
                      id="api-key"
                      type={showApiKey ? 'text' : 'password'}
                      value={apiKey}
                      onChange={(e) => setApiKey(e.target.value)}
                      className="pr-10"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-0 top-0 h-full px-3 text-muted-foreground hover:text-foreground"
                      onClick={() => setShowApiKey(!showApiKey)}
                    >
                      {showApiKey ? <EyeOffIcon className="size-4" /> : <EyeIcon className="size-4" />}
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="sender-number">Sender Number (Nomor Terdaftar)</Label>
                  <Input
                    id="sender-number"
                    placeholder="08xxxxxxxxxx"
                    value={senderNumber}
                    onChange={(e) => setSenderNumber(e.target.value)}
                  />
                </div>

                <div className="flex items-center justify-between border-t pt-4">
                  <div className="space-y-0.5">
                    <Label>Auto-Retry on Fail</Label>
                    <p className="text-xs text-muted-foreground">Kirim ulang pesan secara otomatis jika status gagal</p>
                  </div>
                  <Switch checked={autoRetry} onCheckedChange={setAutoRetry} />
                </div>

                <div className="flex justify-end gap-2 border-t pt-4">
                  <Button variant="outline" onClick={() => setTestOpen(true)}>
                    <SendIcon className="size-4 mr-1.5" />
                    Test Kirim WA
                  </Button>
                  <Button onClick={() => toast.success('Konfigurasi WA Gateway disimpan')}>
                    Simpan Konfigurasi
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Provider info panel */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Status Integrasi</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Status Koneksi</span>
                  <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200">Connected</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Provider Aktif</span>
                  <span className="font-semibold">{provider}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Sender Number</span>
                  <span className="font-mono">{senderNumber}</span>
                </div>
                <div className="flex justify-between border-t pt-3">
                  <span className="text-muted-foreground">Sisa Quota Pesan</span>
                  <span className="font-bold text-primary">8.420 / 10.000</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* ─── Dialog: Add Template ─── */}
      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Tambah Template Baru</DialogTitle>
            <DialogDescription>Daftarkan template notifikasi WhatsApp dengan trigger event tertentu.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4 md:grid-cols-2">
            <div className="space-y-3">
              <div>
                <Label htmlFor="t-name">Nama Template *</Label>
                <Input id="t-name" placeholder="Contoh: DO Baru" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              </div>
              <div>
                <Label htmlFor="t-trigger">Trigger Event *</Label>
                <select
                  id="t-trigger"
                  value={form.trigger}
                  onChange={(e) => setForm({ ...form, trigger: e.target.value })}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                  <option value="">-- Pilih Trigger --</option>
                  <option value="do.created.sppg">do.created.sppg (PIC submit DO)</option>
                  <option value="do.approved.sppg">do.approved.sppg (SPPG approve)</option>
                  <option value="do.approved.sppi">do.approved.sppi (SPPI approve)</option>
                  <option value="do.approved.final">do.approved.final (Full Auth approve)</option>
                  <option value="do.revised">do.revised (Reject DO)</option>
                  <option value="dana.confirmed">dana.confirmed (Full Auth confirm dana)</option>
                  <option value="delivery.completed">delivery.completed (Konfirmasi penerimaan sekolah)</option>
                </select>
              </div>
              <div>
                <Label htmlFor="t-penerima">Penerima Default</Label>
                <Input id="t-penerima" placeholder="Contoh: Kepala SPPG" value={form.penerima} onChange={(e) => setForm({ ...form, penerima: e.target.value })} />
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <Label htmlFor="t-message">Isi Pesan Template *</Label>
                <Textarea
                  id="t-message"
                  placeholder="Tulis pesan template..."
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  rows={6}
                  className="text-xs"
                />
              </div>

              {/* Variable Helper */}
              <div className="rounded-lg border p-2.5 bg-muted/20">
                <span className="text-[10px] uppercase font-bold text-muted-foreground block mb-1">Placeholders Dinamis</span>
                <div className="flex flex-wrap gap-1">
                  {PLACEHOLDERS.map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setForm({ ...form, message: form.message + ' ' + p })}
                      className="text-[9px] font-mono bg-muted border border-border px-1.5 py-0.5 rounded hover:bg-muted/50 cursor-pointer"
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Real-time Message Live Preview */}
          <div className="border-t pt-3">
            <Label className="text-xs font-semibold block mb-1">Live Preview Notifikasi WhatsApp:</Label>
            <div className="rounded-lg border p-3 bg-emerald-50 dark:bg-emerald-950/20 text-xs text-foreground font-sans whitespace-pre-line border-emerald-100 dark:border-emerald-900/50">
              {form.message ? (
                form.message
                  .replace('{{pic_name}}', 'Ahmad Fauzi')
                  .replace('{{do_number}}', 'DO-045')
                  .replace('{{dapur_name}}', 'Dapur Sejahtera 1')
                  .replace('{{total_amount}}', 'Rp 2.450.000')
                  .replace('{{date}}', '01 Juni 2026')
                  .replace('{{login_link}}', 'https://sppg.net-it.id/auth/login')
              ) : (
                <span className="text-muted-foreground italic">Isi pesan template untuk melihat simulasi pratinjau pesan WhatsApp.</span>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setAddOpen(false)}>Batal</Button>
            <Button onClick={handleAddTemplate} disabled={!form.name || !form.trigger || !form.message}>
              Simpan Template
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ─── Dialog: Test Send ─── */}
      <Dialog open={testOpen} onOpenChange={setTestOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Kirim Pesan Uji Coba</DialogTitle>
            <DialogDescription>
              Kirim notifikasi WhatsApp dummy ke nomor tertentu untuk menguji koneksi gateway.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2">
            <Label htmlFor="test-target">Nomor WhatsApp Tujuan *</Label>
            <Input
              id="test-target"
              placeholder="Contoh: 081234567890"
              value={testTarget}
              onChange={(e) => setTestTarget(e.target.value)}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setTestOpen(false); setTestTarget('') }}>Batal</Button>
            <Button onClick={handleTestSend} disabled={!testTarget.trim()}>Kirim Uji Coba</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
