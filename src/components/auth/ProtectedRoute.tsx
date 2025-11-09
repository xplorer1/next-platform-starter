'use client'

import { ReactNode } from 'react'
import { useRequireAuth } from '@/hooks/useAuth'
import { MockUser } from '@/types'

interface ProtectedRouteProps {
  children: ReactNode
  requiredRole?: MockUser['role']
  fallback?: ReactNode
}

export function ProtectedRoute({ 
  children, 
  requiredRole, 
  fallback 
}: ProtectedRouteProps) {
  const { user, isLoading } = useRequireAuth(requiredRole)

  if (isLoading) {
    return (
      fallback || (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading...</p>
          </div>
        </div>
      )
    )
  }

  if (!user) {
    return (
      fallback || (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <p className="text-gray-600">Redirecting to login...</p>
          </div>
        </div>
      )
    )
  }

  if (requiredRole && user.role !== requiredRole) {
    return (
      fallback || (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h2>
            <p className="text-gray-600 mb-4">
              You don&apos;t have permission to access this page.
            </p>
            <p className="text-sm text-gray-500">
              Current role: {user.role}
              {requiredRole && ` | Required role: ${requiredRole}`}
            </p>
          </div>
        </div>
      )
    )
  }

  return <>{children}</>
}