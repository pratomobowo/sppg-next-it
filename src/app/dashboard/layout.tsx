'use client'

import type { ReactNode } from 'react'

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator
} from '@/components/ui/breadcrumb'

import { AppFooter, AppHeader, AppShell, AppSidebar, WorkspaceSwitcher } from '@/components/app-shell'
import { dashboardNav } from '@/config/nav'
import { workspaces } from '@/config/workspaces'

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <AppShell
      sidebar={<AppSidebar config={dashboardNav} header={<WorkspaceSwitcher workspaces={workspaces} />} />}
      header={
        <AppHeader>
          <Breadcrumb className='hidden sm:block'>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href='#'>Home</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href='#'>Dashboard</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Free</BreadcrumbPage>
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
