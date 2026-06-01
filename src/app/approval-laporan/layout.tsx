'use client'

import { type ReactNode } from 'react'
import { SppgShell } from '@/components/sppg-shell'

export default function ApprovalLaporanLayout({ children }: { children: ReactNode }) {
  return <SppgShell title="Persetujuan Laporan">{children}</SppgShell>
}
