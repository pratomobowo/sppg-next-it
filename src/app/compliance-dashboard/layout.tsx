'use client'

import { type ReactNode } from 'react'
import { SppgShell } from '@/components/sppg-shell'

export default function ComplianceDashboardLayout({ children }: { children: ReactNode }) {
  return <SppgShell title="Monitoring Kepatuhan Gizi">{children}</SppgShell>
}
