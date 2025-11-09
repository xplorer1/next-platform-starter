'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { MockAuthService } from '@/lib/auth'
import { MockUser } from '@/types'

export function useAuth() {
  const [user, setUser] = useState<MockUser | null>(() => {
    // Initialize with current user if available
    return MockAuthService.getCurrentUser()
  })

  const login = (accountKey: keyof typeof import('@/lib/auth').demoAccounts) => {
    const loggedInUser = MockAuthService.login(accountKey)
    setUser(loggedInUser)
    return loggedInUser
  }

  const logout = () => {
    MockAuthService.logout()
    setUser(null)
  }

  const switchRole = (accountKey: keyof typeof import('@/lib/auth').demoAccounts) => {
    const newUser = MockAuthService.switchRole(accountKey)
    setUser(newUser)
    return newUser
  }

  return {
    user,
    isLoading: false,
    isAuthenticated: !!user,
    login,
    logout,
    switchRole,
    hasRole: (role: MockUser['role']) => user?.role === role,
  }
}

export function useRequireAuth(requiredRole?: MockUser['role']) {
  const { user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!user) {
      router.push('/auth/login')
      return
    }

    if (requiredRole && user.role !== requiredRole) {
      // Redirect to appropriate dashboard based on user role
      switch (user.role) {
        case 'USER':
          router.push('/jobs')
          break
        case 'CAREER_OFFICER':
          router.push('/manage/jobs')
          break
        case 'ADMIN':
          router.push('/admin/users')
          break
        default:
          router.push('/')
      }
    }
  }, [user, requiredRole, router])

  return { user, isLoading: false }
}