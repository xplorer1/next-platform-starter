'use client'

import { useState } from 'react'
import { AppShell, ProtectedRoute, JobDashboard, JobForm, CompanyManagement, ApplicationReview } from '@/components'
import { useAuth } from '@/hooks/useAuth'
import { Job } from '@/types'

type ActiveTab = 'jobs' | 'companies' | 'applications' | 'create-job' | 'edit-job'

function ManageJobsContent() {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState<ActiveTab>('jobs')
  const [editingJob, setEditingJob] = useState<Job | null>(null)

  const handleCreateJob = () => {
    setEditingJob(null)
    setActiveTab('create-job')
  }

  const handleEditJob = (job: Job) => {
    setEditingJob(job)
    setActiveTab('edit-job')
  }

  const handleJobFormSubmit = (job: Job) => {
    // In a real app, this would save to the backend
    console.log('Job saved:', job)
    setActiveTab('jobs')
    setEditingJob(null)
  }

  const handleJobFormCancel = () => {
    setActiveTab('jobs')
    setEditingJob(null)
  }

  const tabs = [
    { id: 'jobs', label: 'Job Postings', description: 'Manage job opportunities' },
    { id: 'companies', label: 'Companies', description: 'Manage company profiles' },
    { id: 'applications', label: 'Applications', description: 'Review applications' }
  ]

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Career Officer Dashboard</h1>
        <p className="text-gray-600">
          Welcome, {user?.name}! Manage job opportunities and applications for JobPlat students and alumni.
        </p>
      </div>

      {/* Navigation Tabs */}
      {(activeTab === 'jobs' || activeTab === 'companies' || activeTab === 'applications') && (
        <div className="mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8" aria-label="Tabs">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as ActiveTab)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <div>
                    <div>{tab.label}</div>
                    <div className="text-xs text-gray-400 mt-1">{tab.description}</div>
                  </div>
                </button>
              ))}
            </nav>
          </div>
        </div>
      )}

      {/* Tab Content */}
      <div>
        {activeTab === 'jobs' && (
          <div data-tour="job-management">
            <JobDashboard 
              onCreateJob={handleCreateJob}
              onEditJob={handleEditJob}
            />
          </div>
        )}

        {activeTab === 'companies' && (
          <div data-tour="company-management">
            <CompanyManagement />
          </div>
        )}

        {activeTab === 'applications' && (
          <div data-tour="applications-review">
            <ApplicationReview />
          </div>
        )}

        {(activeTab === 'create-job' || activeTab === 'edit-job') && (
          <div>
            <div className="mb-6">
              <button
                onClick={handleJobFormCancel}
                className="text-blue-600 hover:text-blue-800 text-sm font-medium"
              >
                ← Back to Job Postings
              </button>
            </div>
            <JobForm
              job={editingJob || undefined}
              onSubmit={handleJobFormSubmit}
              onCancel={handleJobFormCancel}
            />
          </div>
        )}
      </div>
    </div>
  )
}

function ManageJobsPage() {
  return (
    <AppShell>
      <ProtectedRoute requiredRole="CAREER_OFFICER">
        <ManageJobsContent />
      </ProtectedRoute>
    </AppShell>
  )
}

// Export as dynamic component to prevent SSR issues
import dynamic from 'next/dynamic'
export default dynamic(() => Promise.resolve(ManageJobsPage), {
  ssr: false
})