'use client'

import { type ReactNode } from 'react'
import { SppgShell } from '@/components/sppg-shell'

export default function PengirimanLayout({ children }: { children: ReactNode }) {
  return <SppgShell title="Pengiriman &amp; Logistik">{children}</SppgShell>
}
