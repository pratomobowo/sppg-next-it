'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

import { useAuth } from '@/lib/auth'

export default function Home() {
  const { isAuthenticated, currentUser } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace('/auth/login')
    } else if (currentUser) {
      const r = currentUser.role
      const dest =
        r === 'Super Administrator'
          ? '/admin/dashboard'
          : r === 'BGN (Badan Gizi Nasional)'
          ? '/compliance-dashboard'
          : r === 'Investor'
          ? '/investor-dashboard'
          : r.startsWith('Kepala') || r.startsWith('Full')
          ? '/approval-queue'
          : '/dashboard'
      router.replace(dest)
    }
  }, [isAuthenticated, currentUser, router])

  return null
}
