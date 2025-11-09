'use client'

import { useState, useEffect } from 'react'
import { Application, Job, User } from '@/types'
import { MockApplicationService, MockJobService, MockUserService } from '@/lib/services'
import { useAuth } from '@/hooks/useAuth'
import { 
  UserIcon,
  EnvelopeIcon,
  CalendarIcon,
  DocumentTextIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  EyeIcon
} from '@heroicons/react/24/outline'

interface ApplicationWithDetails extends Application {
  job?: Job
  user?: User
}

export function ApplicationReview() {
  const { user: currentUser } = useAuth()
  const [applications, setApplications] = useState<ApplicationWithDetails[]>([])
  const [jobs, setJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedJob, setSelectedJob] = useState<string>('all')
  const [selectedStatus, setSelectedStatus] = useState<string>('all')

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    setLoading(true)
    
    // Get all jobs first
    const jobsResponse = await MockJobService.getJobs()
    if (jobsResponse.success && jobsResponse.data) {
      setJobs(jobsResponse.data)
      
      // Get applications for each job
      const allApplications: ApplicationWithDetails[] = []
      
      for (const job of jobsResponse.data) {
        const appResponse = await MockApplicationService.getApplicationsByJob(job.id)
        if (appResponse.success && appResponse.data) {
          for (const app of appResponse.data) {
            // Get user details
            const userResponse = await MockUserService.getUserById(app.userId)
            allApplications.push({
              ...app,
              job,
              user: userResponse.success ? userResponse.data || undefined : undefined
            })
          }
        }
      }
      
      setApplications(allApplications.sort((a, b) => 
        b.appliedAt.getTime() - a.appliedAt.getTime()
      ))
    }
    
    setLoading(false)
  }

  const updateApplicationStatus = async (applicationId: string, status: Application['status']) => {
    const response = await MockApplicationService.updateApplicationStatus(applicationId, status)
    if (response.success) {
      setApplications(prev => prev.map(app => 
        app.id === applicationId 
          ? { ...app, status, updatedAt: new Date() }
          : app
      ))
    }
  }

  const filteredApplications = applications.filter(app => {
    if (selectedJob !== 'all' && app.jobId !== selectedJob) return false
    if (selectedStatus !== 'all' && app.status !== selectedStatus) return false
    return true
  })

  const stats = {
    total: applications.length,
    pending: applications.filter(a => a.status === 'PENDING').length,
    reviewed: applications.filter(a => a.status === 'REVIEWED').length,
    accepted: applications.filter(a => a.status === 'ACCEPTED').length,
    rejected: applications.filter(a => a.status === 'REJECTED').length
  }

  const getStatusIcon = (status: Application['status']) => {
    switch (status) {
      case 'PENDING':
        return <ClockIcon className="h-4 w-4 text-yellow-500" />
      case 'REVIEWED':
        return <EyeIcon className="h-4 w-4 text-blue-500" />
      case 'ACCEPTED':
        return <CheckCircleIcon className="h-4 w-4 text-green-500" />
      case 'REJECTED':
        return <XCircleIcon className="h-4 w-4 text-red-500" />
    }
  }

  const getStatusColor = (status: Application['status']) => {
    switch (status) {
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800'
      case 'REVIEWED':
        return 'bg-blue-100 text-blue-800'
      case 'ACCEPTED':
        return 'bg-green-100 text-green-800'
      case 'REJECTED':
        return 'bg-red-100 text-red-800'
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Application Review</h2>
        <p className="text-gray-600 mt-1">
          Review and manage job applications from students and alumni
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-5">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center">
            <DocumentTextIcon className="h-6 w-6 text-gray-600 mr-2" />
            <div>
              <p className="text-sm font-medium text-gray-600">Total</p>
              <p className="text-xl font-bold text-gray-900">{stats.total}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center">
            <ClockIcon className="h-6 w-6 text-yellow-500 mr-2" />
            <div>
              <p className="text-sm font-medium text-gray-600">Pending</p>
              <p className="text-xl font-bold text-gray-900">{stats.pending}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center">
            <EyeIcon className="h-6 w-6 text-blue-500 mr-2" />
            <div>
              <p className="text-sm font-medium text-gray-600">Reviewed</p>
              <p className="text-xl font-bold text-gray-900">{stats.reviewed}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center">
            <CheckCircleIcon className="h-6 w-6 text-green-500 mr-2" />
            <div>
              <p className="text-sm font-medium text-gray-600">Accepted</p>
              <p className="text-xl font-bold text-gray-900">{stats.accepted}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center">
            <XCircleIcon className="h-6 w-6 text-red-500 mr-2" />
            <div>
              <p className="text-sm font-medium text-gray-600">Rejected</p>
              <p className="text-xl font-bold text-gray-900">{stats.rejected}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label htmlFor="jobFilter" className="block text-sm font-medium text-gray-700 mb-2">
              Filter by Job
            </label>
            <select
              id="jobFilter"
              value={selectedJob}
              onChange={(e) => setSelectedJob(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Jobs</option>
              {jobs.map(job => (
                <option key={job.id} value={job.id}>
                  {job.title}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="statusFilter" className="block text-sm font-medium text-gray-700 mb-2">
              Filter by Status
            </label>
            <select
              id="statusFilter"
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Statuses</option>
              <option value="PENDING">Pending</option>
              <option value="REVIEWED">Reviewed</option>
              <option value="ACCEPTED">Accepted</option>
              <option value="REJECTED">Rejected</option>
            </select>
          </div>
        </div>
      </div>

      {/* Applications List */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        {filteredApplications.length === 0 ? (
          <div className="text-center py-12">
            <DocumentTextIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No applications found</h3>
            <p className="text-gray-600">
              {selectedJob !== 'all' || selectedStatus !== 'all' 
                ? 'Try adjusting your filters to see more applications.'
                : 'Applications will appear here once students start applying to jobs.'
              }
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {filteredApplications.map((application) => (
              <div key={application.id} className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <div className="flex items-center">
                        <UserIcon className="h-4 w-4 text-gray-400 mr-2" />
                        <span className="font-medium text-gray-900">
                          {application.user ? 
                            `${application.user.firstName} ${application.user.lastName}` : 
                            'Unknown User'
                          }
                        </span>
                      </div>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(application.status)}`}>
                        {getStatusIcon(application.status)}
                        <span className="ml-1">{application.status}</span>
                      </span>
                    </div>

                    <h4 className="text-lg font-medium text-gray-900 mb-2">
                      {application.job?.title || 'Unknown Job'}
                    </h4>

                    <div className="flex items-center space-x-4 text-sm text-gray-500 mb-3">
                      <div className="flex items-center">
                        <EnvelopeIcon className="h-4 w-4 mr-1" />
                        {application.user?.primaryEmail || 'No email'}
                      </div>
                      <div className="flex items-center">
                        <CalendarIcon className="h-4 w-4 mr-1" />
                        Applied {application.appliedAt.toLocaleDateString()}
                      </div>
                    </div>

                    {application.coverLetter && (
                      <div className="mt-3">
                        <p className="text-sm font-medium text-gray-700 mb-1">Cover Letter:</p>
                        <p className="text-sm text-gray-600 line-clamp-3">
                          {application.coverLetter}
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col space-y-2 ml-4">
                    {application.status === 'PENDING' && (
                      <>
                        <button
                          onClick={() => updateApplicationStatus(application.id, 'REVIEWED')}
                          className="px-3 py-1 text-xs font-medium text-blue-700 bg-blue-50 border border-blue-200 rounded-full hover:bg-blue-100"
                        >
                          Mark Reviewed
                        </button>
                        <button
                          onClick={() => updateApplicationStatus(application.id, 'ACCEPTED')}
                          className="px-3 py-1 text-xs font-medium text-green-700 bg-green-50 border border-green-200 rounded-full hover:bg-green-100"
                        >
                          Accept
                        </button>
                        <button
                          onClick={() => updateApplicationStatus(application.id, 'REJECTED')}
                          className="px-3 py-1 text-xs font-medium text-red-700 bg-red-50 border border-red-200 rounded-full hover:bg-red-100"
                        >
                          Reject
                        </button>
                      </>
                    )}

                    {application.status === 'REVIEWED' && (
                      <>
                        <button
                          onClick={() => updateApplicationStatus(application.id, 'ACCEPTED')}
                          className="px-3 py-1 text-xs font-medium text-green-700 bg-green-50 border border-green-200 rounded-full hover:bg-green-100"
                        >
                          Accept
                        </button>
                        <button
                          onClick={() => updateApplicationStatus(application.id, 'REJECTED')}
                          className="px-3 py-1 text-xs font-medium text-red-700 bg-red-50 border border-red-200 rounded-full hover:bg-red-100"
                        >
                          Reject
                        </button>
                      </>
                    )}

                    {(application.status === 'ACCEPTED' || application.status === 'REJECTED') && (
                      <button
                        onClick={() => updateApplicationStatus(application.id, 'REVIEWED')}
                        className="px-3 py-1 text-xs font-medium text-blue-700 bg-blue-50 border border-blue-200 rounded-full hover:bg-blue-100"
                      >
                        Mark Reviewed
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}