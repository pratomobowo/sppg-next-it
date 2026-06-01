'use client'

import { useEffect, type ReactNode } from 'react'
import { useRouter } from 'next/navigation'

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'

import { AppFooter, AppHeader, AppShell, AppSidebar } from '@/components/app-shell'
import { useAuth } from '@/lib/auth'
import { getNavConfig } from '@/config/nav'

const ROLE_REDIRECTS: Record<string, string> = {
  'Super Administrator': '/admin/dashboard',
  'BGN (Badan Gizi Nasional)': '/compliance-dashboard',
  'Investor': '/investor-dashboard',
}

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const { currentUser } = useAuth()
  const router = useRouter()
  const navConfig = getNavConfig(currentUser?.role ?? '')

  // ─── Role-based redirect ───
  useEffect(() => {
    if (currentUser?.role && ROLE_REDIRECTS[currentUser.role]) {
      router.replace(ROLE_REDIRECTS[currentUser.role])
    }
  }, [currentUser, router])

  // Don't render shell for roles that should be redirected
  if (currentUser?.role && ROLE_REDIRECTS[currentUser.role]) {
    return null
  }

  return (
    <AppShell
      sidebar={
        <AppSidebar
          config={navConfig}
          header={
            <div className="flex items-center gap-2 px-2 py-1.5 border-b border-border/50">
              <div className="flex size-8 shrink-0 items-center justify-center rounded-md bg-white border shadow-sm">
                <img
                  src="/images/logo-bgn.png"
                  alt="Logo Badan Gizi Nasional"
                  className="size-6.5 object-contain"
                />
              </div>
              <div className="flex flex-col min-w-0 group-data-[collapsible=icon]:hidden">
                <span className="font-bold text-[11px] tracking-tight text-foreground truncate">
                  BADAN GIZI NASIONAL
                </span>
                <span className="text-[9px] text-muted-foreground leading-none mt-0.5 truncate">
                  Republik Indonesia
                </span>
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
                <BreadcrumbPage>Dashboard</BreadcrumbPage>
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
