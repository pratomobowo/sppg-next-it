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
            <div className="flex items-center justify-start px-4 py-3 border-b border-border/50 w-full overflow-hidden group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-2">
              <img
                src="/images/logo-bgn.png"
                alt="Logo Badan Gizi Nasional"
                className="h-10 w-auto object-contain object-left max-w-full transition-transform hover:scale-102 group-data-[collapsible=icon]:size-8 group-data-[collapsible=icon]:object-cover group-data-[collapsible=icon]:object-left"
              />
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
