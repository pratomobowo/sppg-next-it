'use client'

import { type ReactNode } from 'react'
import { SppgShell } from '@/components/sppg-shell'

export default function LaporanHarianLayout({ children }: { children: ReactNode }) {
  return <SppgShell title="Laporan Harian Dapur">{children}</SppgShell>
}
