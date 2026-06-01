'use client'

import { type ReactNode } from 'react'
import { SppgShell } from '@/components/sppg-shell'

export default function MapsLayout({ children }: { children: ReactNode }) {
  return <SppgShell title="Peta Penyaluran &amp; Dapur">{children}</SppgShell>
}
