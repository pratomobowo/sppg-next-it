'use client'

import { type ReactNode } from 'react'
import { SppgShell } from '@/components/sppg-shell'

export default function ProcurementLayout({ children }: { children: ReactNode }) {
  return <SppgShell title="Procurement">{children}</SppgShell>
}
