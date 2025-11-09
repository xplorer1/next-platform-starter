'use client'

import { useState, useEffect } from 'react'
import { Application, Job, Company } from '@/types'
import { MockApplicationService, MockJobService, MockCompanyService } from '@/lib/services'
import { MockAuthService } from '@/lib/auth'
import { 
  CheckCircle, 
  XCircle, 
  Clock3, 
  Eye, 
  Calendar,
  Building2,
  MapPin,
  ExternalLink,
  AlertCircle,
  Loader2
} from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { useRouter } from 'next/navigation'
import { EmptyState } from '@/components/error/EmptyState'
import { NetworkError } from '@/components/error/NetworkError'
import { LoadingState } from '@/components/error/LoadingState'
import { useAsyncOperation } from '@/hooks/useAsyncOperation'
import { useToast } from '@/components/error/Toast'
import { classifyError, getErrorMessage } from '@/lib/errorHandling'

interface ApplicationWithDetails extends Application {
  job?: Job
  company?: Company
}

export function ApplicationTracker() {
  const router = useRouter()
  const [applications, setApplications] = useState<ApplicationWithDetails[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filter, setFilter] = useState<'all' | Application['status']>('all')
  
  const currentUser = MockAuthService.getCurrentUser()

  useEffect(() => {
    const loadApplications = async () => {
      if (!currentUser) {
        setError('Please sign in to view your applications')
        setLoading(false)
        return
      }

      setLoading(true)
      setError(null)

      try {
        const response = await MockApplicationService.getApplicationsByUser(currentUser.id)
        
        if (response.success && response.data) {
          // Load job and company details for each application
          const applicationsWithDetails = await Promise.all(
            response.data.map(async (application) => {
              const jobResponse = await MockJobService.getJobById(application.jobId)
              let job: Job | undefined
              let company: Company | undefined

              if (jobResponse.success && jobResponse.data) {
                job = jobResponse.data
                const companyResponse = await MockCompanyService.getCompanyById(job.companyId)
                if (companyResponse.success && companyResponse.data) {
                  company = companyResponse.data
                }
              }

              return {
                ...application,
                job,
                company
              }
            })
          )

          setApplications(applicationsWithDetails)
        } else {
          setError(response.error?.message || 'Failed to load applications')
        }
      } catch (err) {
        setError('Failed to load applications')
        console.error('Failed to load applications:', err)
      } finally {
        setLoading(false)
      }
    }

    loadApplications()
  }, [currentUser])

  const getStatusIcon = (status: Application['status']) => {
    switch (status) {
      case 'PENDING':
        return <Clock3 className="h-5 w-5 text-yellow-600" />
      case 'REVIEWED':
        return <Eye className="h-5 w-5 text-blue-600" />
      case 'ACCEPTED':
        return <CheckCircle className="h-5 w-5 text-green-600" />
      case 'REJECTED':
        return <XCircle className="h-5 w-5 text-red-600" />
    }
  }

  const getStatusText = (status: Application['status']) => {
    switch (status) {
      case 'PENDING':
        return 'Pending Review'
      case 'REVIEWED':
        return 'Under Review'
      case 'ACCEPTED':
        return 'Accepted'
      case 'REJECTED':
        return 'Not Selected'
    }
  }

  const getStatusColor = (status: Application['status']) => {
    switch (status) {
      case 'PENDING':
        return 'bg-yellow-50 border-yellow-200 text-yellow-800'
      case 'REVIEWED':
        return 'bg-blue-50 border-blue-200 text-blue-800'
      case 'ACCEPTED':
        return 'bg-green-50 border-green-200 text-green-800'
      case 'REJECTED':
        return 'bg-red-50 border-red-200 text-red-800'
    }
  }

  const filteredApplications = applications.filter(app => 
    filter === 'all' || app.status === filter
  )

  const statusCounts = {
    all: applications.length,
    PENDING: applications.filter(app => app.status === 'PENDING').length,
    REVIEWED: applications.filter(app => app.status === 'REVIEWED').length,
    ACCEPTED: applications.filter(app => app.status === 'ACCEPTED').length,
    REJECTED: applications.filter(app => app.status === 'REJECTED').length
  }

  if (!currentUser) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
        <AlertCircle className="h-8 w-8 text-yellow-600 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-yellow-900 mb-2">
          Sign In Required
        </h3>
        <p className="text-yellow-700 mb-4">
          Please sign in to view your job applications.
        </p>
        <button
          onClick={() => router.push('/auth/login')}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
        >
          Sign In
        </button>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        <span className="ml-3 text-gray-600">Loading your applications...</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
        <AlertCircle className="h-8 w-8 text-red-600 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-red-900 mb-2">
          Error Loading Applications
        </h3>
        <p className="text-red-700">{error}</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">My Applications</h2>
        <p className="text-gray-600">
          Track the status of your job applications and stay updated on your progress.
        </p>
      </div>

      {/* Status Filter Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {[
            { key: 'all', label: 'All Applications', count: statusCounts.all },
            { key: 'PENDING', label: 'Pending', count: statusCounts.PENDING },
            { key: 'REVIEWED', label: 'Under Review', count: statusCounts.REVIEWED },
            { key: 'ACCEPTED', label: 'Accepted', count: statusCounts.ACCEPTED },
            { key: 'REJECTED', label: 'Not Selected', count: statusCounts.REJECTED }
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setFilter(tab.key as typeof filter)}
              className={`py-2 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                filter === tab.key
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.label}
              {tab.count > 0 && (
                <span className={`ml-2 py-0.5 px-2 rounded-full text-xs ${
                  filter === tab.key
                    ? 'bg-blue-100 text-blue-600'
                    : 'bg-gray-100 text-gray-600'
                }`}>
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </nav>
      </div>

      {/* Applications List */}
      {filteredApplications.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <Calendar className="h-12 w-12 mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {filter === 'all' ? 'No applications yet' : `No ${filter.toLowerCase()} applications`}
          </h3>
          <p className="text-gray-600 mb-6">
            {filter === 'all' 
              ? 'Start applying to jobs to track your progress here.'
              : `You don't have any ${filter.toLowerCase()} applications at the moment.`
            }
          </p>
          {filter === 'all' && (
            <button
              onClick={() => router.push('/jobs')}
              className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
            >
              Browse Jobs
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredApplications.map((application) => (
            <div
              key={application.id}
              className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {application.job?.title || 'Job Title Unavailable'}
                  </h3>
                  
                  <div className="flex items-center text-gray-600 mb-2">
                    <Building2 className="h-4 w-4 mr-2" />
                    <span className="font-medium">
                      {application.company?.name || 'Company Name Unavailable'}
                    </span>
                    {application.company?.website && (
                      <a
                        href={application.company.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="ml-2 text-blue-600 hover:text-blue-800"
                      >
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    )}
                  </div>

                  {application.job && (
                    <div className="flex items-center text-gray-500 text-sm mb-3">
                      <MapPin className="h-4 w-4 mr-1" />
                      <span>{application.job.location}</span>
                      <span className="mx-2">•</span>
                      <span>{application.job.type.replace('_', ' ')}</span>
                    </div>
                  )}

                  <div className="text-sm text-gray-500">
                    Applied {formatDistanceToNow(application.appliedAt, { addSuffix: true })}
                    {application.updatedAt.getTime() !== application.appliedAt.getTime() && (
                      <span className="ml-2">
                        • Updated {formatDistanceToNow(application.updatedAt, { addSuffix: true })}
                      </span>
                    )}
                  </div>
                </div>

                <div className={`flex items-center space-x-2 px-3 py-1 rounded-full border text-sm font-medium ${getStatusColor(application.status)}`}>
                  {getStatusIcon(application.status)}
                  <span>{getStatusText(application.status)}</span>
                </div>
              </div>

              {/* Application Details */}
              {application.coverLetter && (
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Cover Letter</h4>
                  <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-md">
                    {application.coverLetter.length > 200 
                      ? `${application.coverLetter.substring(0, 200)}...`
                      : application.coverLetter
                    }
                  </p>
                </div>
              )}

              {/* Actions */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <div className="flex space-x-4">
                  {application.job && (
                    <button
                      onClick={() => router.push(`/jobs/${application.jobId}`)}
                      className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                    >
                      View Job Details
                    </button>
                  )}
                  
                  {application.job && (
                    <a
                      href={`mailto:${application.job.contactPersonEmail}?subject=Question about ${application.job.title} Application`}
                      className="text-gray-600 hover:text-gray-800 text-sm font-medium"
                    >
                      Contact Employer
                    </a>
                  )}
                </div>

                {application.status === 'ACCEPTED' && (
                  <div className="text-sm text-green-600 font-medium">
                    🎉 Congratulations!
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}