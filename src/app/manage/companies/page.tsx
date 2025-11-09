'use client'

import { AppShell } from '@/components'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import { CompanyManagement } from '@/components/companies/CompanyManagement'
import dynamic from 'next/dynamic'

function ManageCompaniesPage() {
  return (
    <ProtectedRoute requiredRole="CAREER_OFFICER">
      <AppShell>
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Manage Companies</h1>
            <p className="text-lg text-gray-600">
              Add and manage partner companies on the job board
            </p>
          </div>

          <CompanyManagement />
        </div>
      </AppShell>
    </ProtectedRoute>
  )
}

export default dynamic(() => Promise.resolve(ManageCompaniesPage), {
  ssr: false
})