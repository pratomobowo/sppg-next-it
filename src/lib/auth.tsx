'use client'
import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'

export type UserRole =
  | 'Super Administrator'
  | 'PIC Dapur (Admin Yayasan)'
  | 'Kepala SPPG (Lvl 1)'
  | 'Kepala SPPI (Lvl 2)'
  | 'Full Authorize (Lvl 3)'
  | 'BGN (Badan Gizi Nasional)'
  | 'Investor'

export type UserAccount = {
  id: string
  firstName: string
  lastName: string
  email: string
  role: UserRole
  yayasan: string
  dapur?: string
  avatar: number
}

type AuthContextType = {
  currentUser: UserAccount | null
  isAuthenticated: boolean
  login: (user: UserAccount) => void
  logout: () => void
  switchRole: (role: UserRole) => void
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(null)

  useEffect(() => {
    const stored = localStorage.getItem('sppg-user')
    if (stored) {
      try {
        setCurrentUser(JSON.parse(stored))
      } catch {
        // corrupted data, ignore
      }
    }
  }, [])

  const login = (user: UserAccount) => {
    setCurrentUser(user)
    localStorage.setItem('sppg-user', JSON.stringify(user))
  }

  const logout = () => {
    setCurrentUser(null)
    localStorage.removeItem('sppg-user')
  }

  const switchRole = (role: UserRole) => {
    if (currentUser) {
      const updated = { ...currentUser, role }
      setCurrentUser(updated)
      localStorage.setItem('sppg-user', JSON.stringify(updated))
    }
  }

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isAuthenticated: !!currentUser,
        login,
        logout,
        switchRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
