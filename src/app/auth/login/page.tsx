'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Building2Icon, EyeIcon, EyeOffIcon, Loader2Icon } from 'lucide-react'
import { toast } from 'sonner'

import { useAuth, type UserRole, type UserAccount } from '@/lib/auth'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

const ROLES: UserRole[] = [
  'Super Administrator',
  'PIC Dapur (Admin Yayasan)',
  'Kepala SPPG (Lvl 1)',
  'Kepala SPPI (Lvl 2)',
  'Full Authorize (Lvl 3)',
  'BGN (Badan Gizi Nasional)',
  'Investor',
]

const MOCK_USERS: Record<UserRole, Pick<UserAccount, 'firstName' | 'lastName' | 'email' | 'yayasan' | 'dapur' | 'avatar'>> = {
  'Super Administrator': {
    firstName: 'Admin',
    lastName: 'Utama',
    email: 'admin@sppg.go.id',
    yayasan: 'SPPG Pusat',
    dapur: 'Dapur Pusat',
    avatar: 1,
  },
  'PIC Dapur (Admin Yayasan)': {
    firstName: 'PIC',
    lastName: 'Yayasan',
    email: 'pic@yayasan-sejahtera.id',
    yayasan: 'Yayasan Sejahtera',
    dapur: 'Dapur Sejahtera 1',
    avatar: 2,
  },
  'Kepala SPPG (Lvl 1)': {
    firstName: 'Kepala',
    lastName: 'SPPG',
    email: 'kepala@sppg-dapur.id',
    yayasan: 'Yayasan Sejahtera',
    dapur: 'Dapur Sejahtera 1',
    avatar: 3,
  },
  'Kepala SPPI (Lvl 2)': {
    firstName: 'Kepala',
    lastName: 'SPPI',
    email: 'kepala@sppi-dapur.id',
    yayasan: 'Yayasan Mandiri',
    dapur: 'Dapur Mandiri 1',
    avatar: 4,
  },
  'Full Authorize (Lvl 3)': {
    firstName: 'Authorizer',
    lastName: 'Penuh',
    email: 'authorizer@sppg.go.id',
    yayasan: 'SPPG Pusat',
    dapur: 'Dapur Pusat',
    avatar: 5,
  },
  'BGN (Badan Gizi Nasional)': {
    firstName: 'BGN',
    lastName: 'Officer',
    email: 'officer@bgn.go.id',
    yayasan: 'BGN Pusat',
    avatar: 6,
  },
  'Investor': {
    firstName: 'Investor',
    lastName: 'SPPG',
    email: 'investor@partner.id',
    yayasan: 'External',
    avatar: 7,
  },
}

export default function LoginPage() {
  const { login } = useAuth()
  const router = useRouter()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [role, setRole] = useState<UserRole>('Super Administrator')
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!email || !password) {
      toast.error('Lengkapi form', {
        description: 'Email dan password wajib diisi.',
      })
      return
    }

    setSubmitting(true)
    // Simulate network
    await new Promise((resolve) => setTimeout(resolve, 800))

    const mock = MOCK_USERS[role]
    const user: UserAccount = {
      id: `user-${Date.now()}`,
      firstName: mock.firstName,
      lastName: mock.lastName,
      email: mock.email,
      role,
      yayasan: mock.yayasan,
      dapur: mock.dapur,
      avatar: mock.avatar,
    }

    login(user)
    toast.success(`Selamat datang, ${user.firstName}!`, {
      description: `Login sebagai ${role}`,
    })
    router.push('/dashboard')
    setSubmitting(false)
  }

  return (
    <Card className="w-full">
      <CardHeader className="space-y-1 text-center">
        <div className="mx-auto mb-2 flex size-12 items-center justify-center rounded-xl bg-primary/10">
          <Building2Icon className="size-7 text-primary" />
        </div>
        <CardTitle className="text-xl">SPPG MBG</CardTitle>
        <CardDescription>
          Sistem Monitoring &amp; Procurement Dapur
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form className="space-y-4" onSubmit={handleSubmit}>
          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="nama@yayasan.id"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {/* Password */}
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pr-10"
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-0 top-0 h-full px-3 text-muted-foreground hover:text-foreground"
                onClick={() => setShowPassword(!showPassword)}
                tabIndex={-1}
              >
                {showPassword ? (
                  <EyeOffIcon className="size-4" />
                ) : (
                  <EyeIcon className="size-4" />
                )}
              </Button>
            </div>
          </div>

          {/* Role Selector */}
          <div className="space-y-2">
            <Label htmlFor="role">Role</Label>
            <Select value={role} onValueChange={(v) => setRole(v as UserRole)}>
              <SelectTrigger id="role">
                <SelectValue placeholder="Pilih role" />
              </SelectTrigger>
              <SelectContent>
                {ROLES.map((r) => (
                  <SelectItem key={r} value={r}>
                    {r}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Submit */}
          <Button type="submit" className="w-full" disabled={submitting}>
            {submitting ? (
              <Loader2Icon className="mr-2 size-4 animate-spin" />
            ) : null}
            Masuk
          </Button>

          {/* Forgot password */}
          <div className="text-center">
            <Link
              href="/auth/forgot-password"
              className="text-muted-foreground hover:text-foreground text-xs"
            >
              Lupa Password?
            </Link>
          </div>
        </form>

        <p className="text-muted-foreground mt-6 text-center text-xs">
          PT Niaga Expert Teknologi (Next IT)
        </p>
      </CardContent>
    </Card>
  )
}
