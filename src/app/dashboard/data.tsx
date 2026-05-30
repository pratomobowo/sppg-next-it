import { TruckIcon, TriangleAlertIcon, CalendarX2Icon } from 'lucide-react'
import type { ReactNode } from 'react'

import { avatarSrc, images } from '@/lib/assets'
import type { Item } from '@/components/shadcn-studio/blocks/datatable-transaction'

export type StatisticEntry = {
  icon: ReactNode
  value: string
  title: string
  changePercentage: string
}

export const statisticsCardData: StatisticEntry[] = [
  {
    icon: <TruckIcon className='size-4' />,
    value: '42',
    title: 'Shipped Orders',
    changePercentage: '+18.2%'
  },
  {
    icon: <TriangleAlertIcon className='size-4' />,
    value: '8',
    title: 'Damaged Returns',
    changePercentage: '-8.7%'
  },
  {
    icon: <CalendarX2Icon className='size-4' />,
    value: '27',
    title: 'Missed Delivery Slots',
    changePercentage: '+4.3%'
  }
]

export const earningData = [
  {
    img: images.zipcar,
    platform: 'Zipcar',
    technologies: 'Vuejs & HTML',
    earnings: '-$23,569.26',
    progressPercentage: 75
  },
  {
    img: images.bitbank,
    platform: 'Bitbank',
    technologies: 'Figma & React',
    earnings: '-$12,650.31',
    progressPercentage: 25
  }
]

export const transactionData: Item[] = [
  { id: '1', avatar: avatarSrc(1), avatarFallback: 'JA', name: 'Jack Alfredo', amount: 316.0, status: 'paid', email: 'jack@moccilabs.com', paidBy: 'mastercard' },
  { id: '2', avatar: avatarSrc(2), avatarFallback: 'MG', name: 'Maria Gonzalez', amount: 253.4, status: 'pending', email: 'maria.g@moccilabs.com', paidBy: 'visa' },
  { id: '3', avatar: avatarSrc(3), avatarFallback: 'JD', name: 'John Doe', amount: 852.0, status: 'paid', email: 'john.doe@moccilabs.com', paidBy: 'mastercard' },
  { id: '4', avatar: avatarSrc(4), avatarFallback: 'EC', name: 'Emily Carter', amount: 889.0, status: 'pending', email: 'emily.carter@moccilabs.com', paidBy: 'visa' },
  { id: '5', avatar: avatarSrc(5), avatarFallback: 'DL', name: 'David Lee', amount: 723.16, status: 'paid', email: 'david.lee@moccilabs.com', paidBy: 'mastercard' },
  { id: '6', avatar: avatarSrc(6), avatarFallback: 'SP', name: 'Sophia Patel', amount: 612.0, status: 'failed', email: 'sophia.patel@moccilabs.com', paidBy: 'mastercard' },
  { id: '7', avatar: avatarSrc(7), avatarFallback: 'RW', name: 'Robert Wilson', amount: 445.25, status: 'paid', email: 'robert.wilson@moccilabs.com', paidBy: 'visa' },
  { id: '8', avatar: avatarSrc(8), avatarFallback: 'LM', name: 'Lisa Martinez', amount: 297.8, status: 'processing', email: 'lisa.martinez@moccilabs.com', paidBy: 'mastercard' },
  { id: '9', avatar: avatarSrc(9), avatarFallback: 'MT', name: 'Michael Thompson', amount: 756.9, status: 'paid', email: 'michael.thompson@moccilabs.com', paidBy: 'visa' },
  { id: '10', avatar: avatarSrc(10), avatarFallback: 'AJ', name: 'Amanda Johnson', amount: 189.5, status: 'pending', email: 'amanda.johnson@moccilabs.com', paidBy: 'mastercard' },
  { id: '11', avatar: avatarSrc(11), avatarFallback: 'KB', name: 'Kevin Brown', amount: 1024.75, status: 'paid', email: 'kevin.brown@moccilabs.com', paidBy: 'visa' },
  { id: '12', avatar: avatarSrc(12), avatarFallback: 'SD', name: 'Sarah Davis', amount: 367.2, status: 'failed', email: 'sarah.davis@moccilabs.com', paidBy: 'mastercard' },
  { id: '13', avatar: avatarSrc(13), avatarFallback: 'CG', name: 'Christopher Garcia', amount: 598.45, status: 'processing', email: 'christopher.garcia@moccilabs.com', paidBy: 'visa' },
  { id: '14', avatar: avatarSrc(14), avatarFallback: 'JR', name: 'Jennifer Rodriguez', amount: 821.3, status: 'paid', email: 'jennifer.rodriguez@moccilabs.com', paidBy: 'mastercard' },
  { id: '15', avatar: avatarSrc(15), avatarFallback: 'DM', name: 'Daniel Miller', amount: 156.75, status: 'pending', email: 'daniel.miller@moccilabs.com', paidBy: 'visa' },
  { id: '16', avatar: avatarSrc(16), avatarFallback: 'NW', name: 'Nicole White', amount: 934.1, status: 'paid', email: 'nicole.white@moccilabs.com', paidBy: 'mastercard' },
  { id: '17', avatar: avatarSrc(17), avatarFallback: 'AL', name: 'Anthony Lopez', amount: 412.85, status: 'failed', email: 'anthony.lopez@moccilabs.com', paidBy: 'visa' },
  { id: '18', avatar: avatarSrc(18), avatarFallback: 'MH', name: 'Michelle Harris', amount: 675.5, status: 'processing', email: 'michelle.harris@moccilabs.com', paidBy: 'mastercard' },
  { id: '19', avatar: avatarSrc(19), avatarFallback: 'JC', name: 'James Clark', amount: 289.95, status: 'paid', email: 'james.clark@moccilabs.com', paidBy: 'visa' },
  { id: '20', avatar: avatarSrc(20), avatarFallback: 'RL', name: 'Rachel Lewis', amount: 1156.25, status: 'pending', email: 'rachel.lewis@moccilabs.com', paidBy: 'mastercard' },
  { id: '21', avatar: avatarSrc(21), avatarFallback: 'TY', name: 'Thomas Young', amount: 543.6, status: 'paid', email: 'thomas.young@moccilabs.com', paidBy: 'visa' },
  { id: '22', avatar: avatarSrc(22), avatarFallback: 'SB', name: 'Stephanie Brown', amount: 789.3, status: 'processing', email: 'stephanie.brown@moccilabs.com', paidBy: 'mastercard' },
  { id: '23', avatar: avatarSrc(23), avatarFallback: 'BM', name: 'Brandon Moore', amount: 425.75, status: 'failed', email: 'brandon.moore@moccilabs.com', paidBy: 'visa' },
  { id: '24', avatar: avatarSrc(24), avatarFallback: 'KT', name: 'Kelly Taylor', amount: 1203.5, status: 'paid', email: 'kelly.taylor@moccilabs.com', paidBy: 'mastercard' },
  { id: '25', avatar: avatarSrc(25), avatarFallback: 'MA', name: 'Mark Anderson', amount: 356.2, status: 'pending', email: 'mark.anderson@moccilabs.com', paidBy: 'visa' }
]
