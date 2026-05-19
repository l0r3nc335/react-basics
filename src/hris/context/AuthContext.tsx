import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react'
import { api, getAuthToken, setAuthToken } from '@/hris/api/client'
import { endpoints } from '@/hris/api/endpoints'
import type { User, UserRole } from '@/hris/types'

interface AuthContextValue {
  user: User | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  hasRole: (...roles: UserRole[]) => boolean
}

/* eslint-disable react-refresh/only-export-components */
const AuthContext = createContext<AuthContextValue | null>(null)

const SESSION_KEY = 'hris_user'

function loadStoredUser(): User | null {
  const stored = localStorage.getItem(SESSION_KEY)
  if (!stored) return null
  try {
    return JSON.parse(stored) as User
  } catch {
    localStorage.removeItem(SESSION_KEY)
    return null
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(loadStoredUser)
  const isLoading = false

  const login = useCallback(async (email: string, password: string) => {
    const res = await api<{ user: User; token: string }>(endpoints.auth.login, {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    })
    setAuthToken(res.token)
    setUser(res.user)
    localStorage.setItem(SESSION_KEY, JSON.stringify(res.user))
  }, [])

  const logout = useCallback(() => {
    setAuthToken(null)
    setUser(null)
    localStorage.removeItem(SESSION_KEY)
  }, [])

  const hasRole = useCallback(
    (...roles: UserRole[]) => (user ? roles.includes(user.role) : false),
    [user],
  )

  const value = useMemo(
    () => ({ user, isLoading, login, logout, hasRole }),
    [user, isLoading, login, logout, hasRole],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}

export function useAuthToken() {
  return getAuthToken()
}
