'use client'

import { type ReactNode } from 'react'
import { SppgShell } from '@/components/sppg-shell'

export default function InvestorDashboardLayout({ children }: { children: ReactNode }) {
  return <SppgShell title="Investor Dashboard">{children}</SppgShell>
}
