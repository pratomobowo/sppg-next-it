'use client'

import { type ReactNode } from 'react'
import { SppgShell } from '@/components/sppg-shell'

export default function InventoryLayout({ children }: { children: ReactNode }) {
  return <SppgShell title="Inventori &amp; Stok">{children}</SppgShell>
}
