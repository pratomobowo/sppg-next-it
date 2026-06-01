'use client'
import type { ReactNode } from 'react'
import { SppgShell } from '@/components/sppg-shell'
export default function TenantDetailLayout({ children }: { children: ReactNode }) {
  return <SppgShell title="Detail Tenant">{children}</SppgShell>
}
