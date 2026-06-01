'use client'

import type { ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import {
  BellIcon,
  Building2Icon,
  ChevronDownIcon,
  LogOutIcon,
  UserIcon,
} from 'lucide-react'

import { useAuth, type UserRole } from '@/lib/auth'
import { avatarSrc } from '@/lib/assets'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Separator } from '@/components/ui/separator'
import { SidebarTrigger } from '@/components/ui/sidebar'
import { ThemeToggle } from '@/components/theme-toggle'

const ROLES: UserRole[] = [
  'Super Administrator',
  'PIC Dapur (Admin Yayasan)',
  'Kepala SPPG (Lvl 1)',
  'Kepala SPPI (Lvl 2)',
  'Full Authorize (Lvl 3)',
  'BGN (Badan Gizi Nasional)',
  'Investor',
]

const CAN_SWITCH = ['Super Administrator', 'PIC Dapur (Admin Yayasan)'] as UserRole[]

type AppHeaderProps = {
  /** Content rendered between the sidebar trigger and the action area (e.g. breadcrumbs, page title). */
  children?: ReactNode
  /** Replace the default action area (role switcher + notifications + profile). */
  actions?: ReactNode
}

export function AppHeader({ children, actions }: AppHeaderProps) {
  const { currentUser, logout, switchRole } = useAuth()
  const router = useRouter()

  if (!currentUser) return null

  const initials = `${currentUser.firstName[0]}${currentUser.lastName[0]}`.toUpperCase()
  const canSwitchRole = CAN_SWITCH.includes(currentUser.role)

  return (
    <>
      {/* Left section */}
      <div className="flex min-w-0 items-center gap-3">
        <SidebarTrigger className="[&_svg]:size-5!" />
        <Separator
          orientation="vertical"
          className="hidden h-4! data-vertical:self-center sm:block"
        />
        <div className="min-w-0 flex-1">{children}</div>
      </div>

      {/* Right section */}
      <div className="flex items-center gap-1.5">
        {actions ?? (
          <>
            {/* Role switcher (only for Super Admin and PIC) */}
            {canSwitchRole && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="hidden gap-1.5 sm:inline-flex">
                    <Building2Icon className="size-3.5" />
                    <span className="max-w-[140px] truncate">{currentUser.role}</span>
                    <ChevronDownIcon className="size-3 text-muted-foreground" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-64">
                  <DropdownMenuLabel>Switch Role</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {ROLES.map((r) => (
                    <DropdownMenuItem
                      key={r}
                      onClick={() => {
                        switchRole(r)
                        const dest =
                          r === 'Super Administrator'
                            ? '/admin/dashboard'
                            : r === 'BGN (Badan Gizi Nasional)'
                            ? '/compliance-dashboard'
                            : r === 'Investor'
                            ? '/investor-dashboard'
                            : '/dashboard'
                        router.push(dest)
                      }}
                      disabled={r === currentUser.role}
                    >
                      <span className={r === currentUser.role ? 'font-semibold' : ''}>
                        {r}
                      </span>
                      {r === currentUser.role && (
                        <Badge variant="secondary" className="ml-auto text-[10px]">
                          Active
                        </Badge>
                      )}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            )}

            {/* Notification bell */}
            <Button variant="ghost" size="icon" className="relative">
              <BellIcon className="size-5" />
              <span className="absolute right-1.5 top-1.5 flex size-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75" />
                <span className="relative inline-flex size-2 rounded-full bg-red-500" />
              </span>
            </Button>

            {/* Theme Toggle */}
            <ThemeToggle />

            {/* User avatar + dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="gap-2 px-2">
                  <Avatar className="size-8 rounded-md">
                    <AvatarImage
                      src={avatarSrc(currentUser.avatar)}
                      className="rounded-md"
                    />
                    <AvatarFallback className="rounded-md text-xs">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="hidden flex-col items-start text-left text-sm sm:flex">
                    <span className="font-medium leading-tight">
                      {currentUser.firstName} {currentUser.lastName}
                    </span>
                    <span className="text-muted-foreground text-xs leading-tight">
                      {currentUser.role}
                    </span>
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                  <div className="flex flex-col gap-0.5">
                    <span>
                      {currentUser.firstName} {currentUser.lastName}
                    </span>
                    <span className="text-muted-foreground text-xs font-normal">
                      {currentUser.email}
                    </span>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => router.push('/pages/profile')}>
                  <UserIcon className="mr-2 size-4" />
                  Profile
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => {
                    logout()
                    router.push('/auth/login')
                  }}
                  className="text-destructive focus:text-destructive"
                >
                  <LogOutIcon className="mr-2 size-4" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </>
        )}
      </div>
    </>
  )
}
