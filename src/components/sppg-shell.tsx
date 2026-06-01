'use client'

import { type ReactNode, useEffect, useState } from 'react'
import { AppFooter, AppHeader, AppShell, AppSidebar } from '@/components/app-shell'
import { useAuth } from '@/lib/auth'
import { getNavConfig } from '@/config/nav'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'

export function SppgShell({ children, title }: { children: ReactNode; title?: string }) {
  const { currentUser } = useAuth()
  const [mounted, setMounted] = useState(false)

  // Avoid hydration mismatch by waiting for mount
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted || !currentUser) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-background text-muted-foreground text-sm">
        Memuat antarmuka...
      </div>
    )
  }

  const navConfig = getNavConfig(currentUser.role)

  return (
    <AppShell
      sidebar={<AppSidebar config={navConfig} />}
      header={
        <AppHeader>
          <Breadcrumb className="hidden sm:block">
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/dashboard">Home</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>{title || 'Dashboard'}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </AppHeader>
      }
      footer={<AppFooter />}
    >
      {children}
    </AppShell>
  )
}
