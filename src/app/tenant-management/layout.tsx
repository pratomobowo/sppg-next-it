'use client'
import type { ReactNode } from 'react'
import { SppgShell } from '@/components/sppg-shell'

export default function TenantManagementLayout({ children }: { children: ReactNode }) {
  return <SppgShell title="Tenant Management">{children}</SppgShell>
}
