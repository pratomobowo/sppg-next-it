'use client'

import { type ReactNode } from 'react'
import { SppgShell } from '@/components/sppg-shell'

export default function AccountingLayout({ children }: { children: ReactNode }) {
  return <SppgShell title="Keuangan &amp; Anggaran">{children}</SppgShell>
}
