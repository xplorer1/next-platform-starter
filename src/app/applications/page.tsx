'use client'

import { AppShell } from '@/components'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import { ApplicationTracker } from '@/components/applications/ApplicationTracker'
import dynamic from 'next/dynamic'

function ApplicationsPage() {
  return (
    <ProtectedRoute requiredRole="USER">
      <AppShell>
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">My Applications</h1>
            <p className="text-lg text-gray-600">
              Track the status of your job applications
            </p>
          </div>

          <ApplicationTracker />
        </div>
      </AppShell>
    </ProtectedRoute>
  )
}

export default dynamic(() => Promise.resolve(ApplicationsPage), {
  ssr: false
})