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
      sidebar={
        <AppSidebar
          config={navConfig}
          header={
            <div className="flex items-center justify-center px-2 py-2 border-b border-border/50 w-full">
              <div className="flex size-9 items-center justify-center rounded-md bg-white border shadow-sm transition-transform hover:scale-105">
                <img
                  src="/images/logo-bgn.png"
                  alt="Logo Badan Gizi Nasional"
                  className="size-7.5 object-contain"
                />
              </div>
            </div>
          }
        />
      }
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
