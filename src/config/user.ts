import { avatarSrc } from '@/lib/assets'

export type UserRole =
  | 'Super Administrator'
  | 'PIC Dapur (Admin Yayasan)'
  | 'Kepala SPPG (Lvl 1)'
  | 'Kepala SPPI (Lvl 2)'
  | 'Full Authorize (Lvl 3)'
  | 'BGN (Badan Gizi Nasional)'
  | 'Investor'

/**
 * Single source of truth for the signed-in user.
 * Wire this up to your auth/session layer; the UI (greeting, profile menu,
 * header, sidebar) reads from here.
 */
export type CurrentUser = {
  id: string
  name: string
  firstName: string
  lastName?: string
  email: string
  role: UserRole
  yayasan: string
  dapur: string
  avatar: string
  initials: string
}

export const currentUser: CurrentUser = {
  id: 'usr-001',
  name: 'Ahmad Fauzi',
  firstName: 'Ahmad',
  lastName: 'Fauzi',
  email: 'ahmad.fauzi@alfalah.sch.id',
  role: 'PIC Dapur (Admin Yayasan)',
  yayasan: 'Yayasan Al-Falah',
  dapur: 'Dapur Al-Falah 01',
  avatar: avatarSrc(1),
  initials: 'AF'
}

/** ─── All mock users (at least one per role) ─── */
export const mockUsers: CurrentUser[] = [
  currentUser,
  {
    id: 'usr-002',
    name: 'Hadi Santoso',
    firstName: 'Hadi',
    lastName: 'Santoso',
    email: 'hadi.santoso@nuruliman.sch.id',
    role: 'Super Administrator',
    yayasan: 'Yayasan Nurul Iman',
    dapur: 'Dapur Nurul Iman 01',
    avatar: avatarSrc(2),
    initials: 'HS'
  },
  {
    id: 'usr-003',
    name: 'Siti Nurhaliza',
    firstName: 'Siti',
    lastName: 'Nurhaliza',
    email: 'siti.nurhaliza@baiturrahman.sch.id',
    role: 'Kepala SPPG (Lvl 1)',
    yayasan: 'Yayasan Baiturrahman',
    dapur: 'Dapur Baiturrahman 01',
    avatar: avatarSrc(3),
    initials: 'SN'
  },
  {
    id: 'usr-004',
    name: 'Budi Prasetyo',
    firstName: 'Budi',
    lastName: 'Prasetyo',
    email: 'budi.prasetyo@alfalah.sch.id',
    role: 'Kepala SPPI (Lvl 2)',
    yayasan: 'Yayasan Al-Falah',
    dapur: 'Dapur Al-Falah 02',
    avatar: avatarSrc(4),
    initials: 'BP'
  },
  {
    id: 'usr-005',
    name: 'Dewi Lestari',
    firstName: 'Dewi',
    lastName: 'Lestari',
    email: 'dewi.lestari@alfalah.sch.id',
    role: 'Full Authorize (Lvl 3)',
    yayasan: 'Yayasan Al-Falah',
    dapur: 'Dapur Al-Falah 01',
    avatar: avatarSrc(5),
    initials: 'DL'
  },
  {
    id: 'usr-006',
    name: 'Rudi Hermawan',
    firstName: 'Rudi',
    lastName: 'Hermawan',
    email: 'rudi.hermawan@bgn.go.id',
    role: 'BGN (Badan Gizi Nasional)',
    yayasan: 'Badan Gizi Nasional',
    dapur: 'BGN Pusat',
    avatar: avatarSrc(6),
    initials: 'RH'
  },
  {
    id: 'usr-007',
    name: 'Linda Wijaya',
    firstName: 'Linda',
    lastName: 'Wijaya',
    email: 'linda.wijaya@investor.co.id',
    role: 'Investor',
    yayasan: 'Yayasan Al-Falah',
    dapur: 'Investor View',
    avatar: avatarSrc(7),
    initials: 'LW'
  }
]
