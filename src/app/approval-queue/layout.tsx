'use client'

import { type ReactNode } from 'react'
import { SppgShell } from '@/components/sppg-shell'

export default function ApprovalQueueLayout({ children }: { children: ReactNode }) {
  return <SppgShell title="Antrean Persetujuan DO">{children}</SppgShell>
}
