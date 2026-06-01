'use client'

import { type ReactNode } from 'react'
import { SppgShell } from '@/components/sppg-shell'

export default function AiHelperLayout({ children }: { children: ReactNode }) {
  return <SppgShell title="AI Helper">{children}</SppgShell>
}
