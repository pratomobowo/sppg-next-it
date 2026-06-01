'use client'

import { type ReactNode } from 'react'
import { SppgShell } from '@/components/sppg-shell'

export default function AdminLayout({ children }: { children: ReactNode }) {
  return <SppgShell title="Admin Panel">{children}</SppgShell>
}
