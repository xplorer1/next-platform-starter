'use client'

import { AppShell, ProtectedRoute, ApplicationTracker } from '@/components'
import { UserProfile } from '@/components/profile/UserProfile'
import { useAuth } from '@/hooks/useAuth'
import { useState } from 'react'
import { User } from '@/types'

function ProfileContent() {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState<'profile' | 'applications'>('profile')

  const handleProfileUpdate = (updatedProfile: User) => {
    // In a real implementation, this would update the global auth state
    console.log('Profile updated:', updatedProfile)
  }

  if (!user) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">Please sign in to view your profile.</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">My Profile</h1>
        <p className="text-gray-600">
          Manage your account information and track your job applications.
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200 mb-8">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('profile')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'profile'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Profile Information
          </button>
          <button
            onClick={() => setActiveTab('applications')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'applications'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            My Applications
          </button>
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'profile' ? (
        <UserProfile onProfileUpdate={handleProfileUpdate} />
      ) : (
        <ApplicationTracker />
      )}
    </div>
  )
}

function ProfilePage() {
  return (
    <AppShell>
      <ProtectedRoute requiredRole="USER">
        <ProfileContent />
      </ProtectedRoute>
    </AppShell>
  )
}

// Export as dynamic component to prevent SSR issues
import dynamic from 'next/dynamic'
export default dynamic(() => Promise.resolve(ProfilePage), {
  ssr: false
})