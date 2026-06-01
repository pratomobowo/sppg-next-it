'use client'

import { type ReactNode, useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import {
  BellIcon,
  Building2Icon,
  ChevronDownIcon,
  LogOutIcon,
  UserIcon,
} from 'lucide-react'

import { useAuth, type UserRole } from '@/lib/auth'
import { avatarSrc } from '@/lib/assets'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Separator } from '@/components/ui/separator'
import { SidebarTrigger } from '@/components/ui/sidebar'
import { ThemeToggle } from '@/components/theme-toggle'

const ROLES: UserRole[] = [
  'Super Administrator',
  'PIC Dapur (Admin Yayasan)',
  'Kepala SPPG (Lvl 1)',
  'Kepala SPPI (Lvl 2)',
  'Full Authorize (Lvl 3)',
  'BGN (Badan Gizi Nasional)',
  'Investor',
]

const CAN_SWITCH = ROLES

type NotificationItem = {
  id: string
  message: string
  time: string
  url: string
  read: boolean
}

const DEFAULT_NOTIFICATIONS: Record<string, NotificationItem[]> = {
  'Super Administrator': [
    { id: 'sa-1', message: 'Keamanan: Percobaan login gagal terdeteksi dari IP 185.220.101.5', time: '10 mnt lalu', url: '/admin/audit-trail', read: false },
    { id: 'sa-2', message: 'User baru Ahmad Fauzi (PIC Dapur) berhasil didaftarkan', time: '1 jam lalu', url: '/admin/users', read: false },
    { id: 'sa-3', message: 'Konfigurasi WA Gateway: Koneksi API Fonnte berhasil diperbarui', time: '5 jam lalu', url: '/admin/wa-gateway', read: true },
  ],
  'PIC Dapur (Admin Yayasan)': [
    { id: 'pic-1', message: 'DO #042 disetujui oleh SPPG dan siap direalisasikan belanja', time: '15 mnt lalu', url: '/procurement/history', read: false },
    { id: 'pic-2', message: 'PERHATIAN: Stok beras di Dapur Sejahtera 1 di bawah threshold kritis!', time: '1 jam lalu', url: '/inventory', read: false },
    { id: 'pic-3', message: 'Dana 12 hari periode Minggu ke-1 telah ditransfer oleh Full Authorize', time: '2 jam lalu', url: '/accounting', read: false },
    { id: 'pic-4', message: 'DO #041 direvisi: "Harga ayam terlalu tinggi. Harap sesuaikan"', time: '5 jam lalu', url: '/procurement/draft', read: true },
  ],
  'Kepala SPPG (Lvl 1)': [
    { id: 'sppg-1', message: 'DO #045 (Dapur Sejahtera 1) menunggu persetujuan Anda', time: '5 mnt lalu', url: '/approval-queue', read: false },
    { id: 'sppg-2', message: 'DO #046 (Dapur Mandiri 1) menunggu persetujuan Anda', time: '30 mnt lalu', url: '/approval-queue', read: false },
  ],
  'Kepala SPPI (Lvl 2)': [
    { id: 'sppi-1', message: 'DO #044 (Dapur Sejahtera 2) menunggu persetujuan Anda', time: '10 mnt lalu', url: '/approval-queue', read: false },
    { id: 'sppi-2', message: 'DO #045 disetujui Kepala SPPG, kini menunggu review Anda', time: '1 jam lalu', url: '/approval-queue', read: false },
  ],
  'Full Authorize (Lvl 3)': [
    { id: 'fa-1', message: 'Laporan Shift Pagi Dapur Sejahtera 1 menunggu persetujuan harian', time: '8 mnt lalu', url: '/approval-laporan', read: false },
    { id: 'fa-2', message: 'Permintaan Dana 12 hari Periode 1 menunggu konfirmasi transfer', time: '1 jam lalu', url: '/accounting', read: false },
  ],
  'BGN (Badan Gizi Nasional)': [
    { id: 'bgn-1', message: 'Kepatuhan Gizi Dapur Depok Timur di bawah 70% (Kalori kurang)', time: '20 mnt lalu', url: '/compliance-dashboard', read: false },
    { id: 'bgn-2', message: 'Kepatuhan gizi Dapur Ciputat mencapai 94% hari ini', time: '2 jam lalu', url: '/compliance-dashboard', read: false },
  ],
  'Investor': [
    { id: 'inv-1', message: 'Laporan operasional & keuangan bulanan Mei telah diterbitkan', time: '1 jam lalu', url: '/investor-dashboard', read: false },
    { id: 'inv-2', message: 'Rasio pengeluaran kas dapur melampaui 80% alokasi anggaran', time: '1 hari lalu', url: '/investor-dashboard', read: true },
  ],
}

type AppHeaderProps = {
  /** Content rendered between the sidebar trigger and the action area (e.g. breadcrumbs, page title). */
  children?: ReactNode
  /** Replace the default action area (role switcher + notifications + profile). */
  actions?: ReactNode
}

export function AppHeader({ children, actions }: AppHeaderProps) {
  const { currentUser, logout, switchRole } = useAuth()
  const router = useRouter()
  const [notifications, setNotifications] = useState<NotificationItem[]>([])

  useEffect(() => {
    if (currentUser) {
      const storageKey = `sppg-notif-${currentUser.role}`
      const stored = localStorage.getItem(storageKey)
      if (stored) {
        setNotifications(JSON.parse(stored))
      } else {
        const defaults = DEFAULT_NOTIFICATIONS[currentUser.role] || []
        setNotifications(defaults)
        localStorage.setItem(storageKey, JSON.stringify(defaults))
      }
    }
  }, [currentUser])

  const unreadCount = notifications.filter((n) => !n.read).length

  const markAllAsRead = () => {
    if (currentUser) {
      const updated = notifications.map((n) => ({ ...n, read: true }))
      setNotifications(updated)
      localStorage.setItem(`sppg-notif-${currentUser.role}`, JSON.stringify(updated))
      toast.success('Semua notifikasi ditandai dibaca')
    }
  }

  const handleNotificationClick = (n: NotificationItem) => {
    if (currentUser) {
      const updated = notifications.map((item) => item.id === n.id ? { ...item, read: true } : item)
      setNotifications(updated)
      localStorage.setItem(`sppg-notif-${currentUser.role}`, JSON.stringify(updated))
      router.push(n.url)
    }
  }

  if (!currentUser) return null

  const initials = `${currentUser.firstName[0]}${currentUser.lastName[0]}`.toUpperCase()
  const canSwitchRole = CAN_SWITCH.includes(currentUser.role)

  return (
    <>
      {/* Left section */}
      <div className="flex min-w-0 items-center gap-3">
        <SidebarTrigger className="[&_svg]:size-5!" />
        <Separator
          orientation="vertical"
          className="hidden h-4! data-vertical:self-center sm:block"
        />
        <div className="min-w-0 flex-1">{children}</div>
      </div>

      {/* Right section */}
      <div className="flex items-center gap-1.5">
        {actions ?? (
          <>
            {/* Role switcher (only for Super Admin and PIC) */}
            {canSwitchRole && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="hidden gap-1.5 sm:inline-flex">
                    <Building2Icon className="size-3.5" />
                    <span className="max-w-[140px] truncate">{currentUser.role}</span>
                    <ChevronDownIcon className="size-3 text-muted-foreground" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-64">
                  <DropdownMenuLabel>Switch Role</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {ROLES.map((r) => (
                    <DropdownMenuItem
                      key={r}
                      onClick={() => {
                        switchRole(r)
                        const dest =
                          r === 'Super Administrator'
                            ? '/admin/dashboard'
                            : r === 'BGN (Badan Gizi Nasional)'
                            ? '/compliance-dashboard'
                            : r === 'Investor'
                            ? '/investor-dashboard'
                            : r.startsWith('Kepala') || r.startsWith('Full')
                            ? '/approval-queue'
                            : '/dashboard'
                        router.push(dest)
                      }}
                      disabled={r === currentUser.role}
                    >
                      <span className={r === currentUser.role ? 'font-semibold' : ''}>
                        {r}
                      </span>
                      {r === currentUser.role && (
                        <Badge variant="secondary" className="ml-auto text-[10px]">
                          Active
                        </Badge>
                      )}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            )}

            {/* Notification dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                  <BellIcon className="size-5" />
                  {unreadCount > 0 && (
                    <span className="absolute right-1.5 top-1.5 flex size-2">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75" />
                      <span className="relative inline-flex size-2 rounded-full bg-red-500" />
                    </span>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80">
                <DropdownMenuLabel className="flex items-center justify-between">
                  <span>Notifikasi</span>
                  {unreadCount > 0 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-auto p-0 text-xs text-primary hover:bg-transparent"
                      onClick={(e) => {
                        e.stopPropagation()
                        markAllAsRead()
                      }}
                    >
                      Tandai semua dibaca
                    </Button>
                  )}
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <div className="max-h-[300px] overflow-y-auto">
                  {notifications.length === 0 ? (
                    <div className="p-4 text-center text-xs text-muted-foreground">
                      Tidak ada notifikasi baru
                    </div>
                  ) : (
                    notifications.map((n) => (
                      <DropdownMenuItem
                        key={n.id}
                        onClick={() => handleNotificationClick(n)}
                        className={`flex flex-col items-start gap-1 p-3 focus:bg-muted ${
                          !n.read ? 'bg-primary/5 font-medium' : ''
                        }`}
                      >
                        <div className="flex w-full items-start justify-between gap-2">
                          <span className="text-xs text-foreground leading-snug">{n.message}</span>
                          {!n.read && (
                            <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-primary" />
                          )}
                        </div>
                        <span className="text-[10px] text-muted-foreground">{n.time}</span>
                      </DropdownMenuItem>
                    ))
                  )}
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => router.push('/pages/notifications')}
                  className="justify-center text-xs text-primary font-medium focus:text-primary"
                >
                  Lihat Semua Notifikasi
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Theme Toggle */}
            <ThemeToggle />

            {/* User avatar + dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="gap-2 px-2">
                  <Avatar className="size-8 rounded-md">
                    <AvatarImage
                      src={avatarSrc(currentUser.avatar)}
                      className="rounded-md"
                    />
                    <AvatarFallback className="rounded-md text-xs">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="hidden flex-col items-start text-left text-sm sm:flex">
                    <span className="font-medium leading-tight">
                      {currentUser.firstName} {currentUser.lastName}
                    </span>
                    <span className="text-muted-foreground text-xs leading-tight">
                      {currentUser.role}
                    </span>
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                  <div className="flex flex-col gap-0.5">
                    <span>
                      {currentUser.firstName} {currentUser.lastName}
                    </span>
                    <span className="text-muted-foreground text-xs font-normal">
                      {currentUser.email}
                    </span>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => router.push('/pages/profile')}>
                  <UserIcon className="mr-2 size-4" />
                  Profile
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => {
                    logout()
                    router.push('/auth/login')
                  }}
                  className="text-destructive focus:text-destructive"
                >
                  <LogOutIcon className="mr-2 size-4" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </>
        )}
      </div>
    </>
  )
}
