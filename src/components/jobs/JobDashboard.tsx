'use client'

import { useState, useEffect } from 'react'
import { Job, Company } from '@/types'
import { MockJobService, MockCompanyService } from '@/lib/services'
import { useAuth } from '@/hooks/useAuth'
import { 
  PlusIcon, 
  PencilIcon, 
  EyeIcon, 
  BriefcaseIcon,
  CalendarIcon,
  MapPinIcon,
  BuildingOfficeIcon,
  CheckCircleIcon,
  XCircleIcon
} from '@heroicons/react/24/outline'

interface JobDashboardProps {
  onCreateJob: () => void
  onEditJob: (job: Job) => void
}

export function JobDashboard({ onCreateJob, onEditJob }: JobDashboardProps) {
  const { user } = useAuth()
  const [jobs, setJobs] = useState<Job[]>([])
  const [companies, setCompanies] = useState<Company[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'active' | 'inactive'>('all')

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    setLoading(true)
    const [jobsResponse, companiesResponse] = await Promise.all([
      MockJobService.getJobs(),
      MockCompanyService.getCompanies()
    ])
    
    if (jobsResponse.success && jobsResponse.data) {
      setJobs(jobsResponse.data)
    }
    
    if (companiesResponse.success && companiesResponse.data) {
      setCompanies(companiesResponse.data)
    }
    
    setLoading(false)
  }

  const getCompanyName = (companyId: string) => {
    const company = companies.find(c => c.id === companyId)
    return company?.name || 'Unknown Company'
  }

  const toggleJobStatus = async (jobId: string, currentStatus: boolean) => {
    // In a real app, this would call an API
    console.log(`Toggling job ${jobId} status from ${currentStatus} to ${!currentStatus}`)
    
    // Update local state
    setJobs(prev => prev.map(job => 
      job.id === jobId ? { ...job, isActive: !currentStatus, updatedAt: new Date() } : job
    ))
  }

  const filteredJobs = jobs.filter(job => {
    if (filter === 'active') return job.isActive
    if (filter === 'inactive') return !job.isActive
    return true
  })

  const stats = {
    total: jobs.length,
    active: jobs.filter(j => j.isActive).length,
    inactive: jobs.filter(j => !j.isActive).length
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
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Job Postings</h2>
          <p className="text-gray-600 mt-1">
            Manage job opportunities for JobPlat students and alumni
          </p>
        </div>
        <button
          onClick={onCreateJob}
          className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500"
        >
          <PlusIcon className="h-4 w-4 mr-2" />
          Create Job
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <BriefcaseIcon className="h-8 w-8 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Jobs</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <CheckCircleIcon className="h-8 w-8 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Active Jobs</p>
              <p className="text-2xl font-bold text-gray-900">{stats.active}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <XCircleIcon className="h-8 w-8 text-gray-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Inactive Jobs</p>
              <p className="text-2xl font-bold text-gray-900">{stats.inactive}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6" aria-label="Tabs">
            {[
              { key: 'all', label: 'All Jobs', count: stats.total },
              { key: 'active', label: 'Active', count: stats.active },
              { key: 'inactive', label: 'Inactive', count: stats.inactive }
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setFilter(tab.key as typeof filter)}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  filter === tab.key
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.label} ({tab.count})
              </button>
            ))}
          </nav>
        </div>

        {/* Jobs List */}
        {filteredJobs.length === 0 ? (
          <div className="text-center py-12">
            <BriefcaseIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {filter === 'all' ? 'No jobs yet' : `No ${filter} jobs`}
            </h3>
            <p className="text-gray-600 mb-4">
              {filter === 'all' 
                ? 'Get started by creating your first job posting.' 
                : `There are no ${filter} job postings at the moment.`
              }
            </p>
            {filter === 'all' && (
              <button
                onClick={onCreateJob}
                className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700"
              >
                <PlusIcon className="h-4 w-4 mr-2" />
                Create Job
              </button>
            )}
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {filteredJobs.map((job) => (
              <div key={job.id} className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3">
                      <h4 className="text-lg font-medium text-gray-900">
                        {job.title}
                      </h4>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        job.isActive 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {job.isActive ? 'Active' : 'Inactive'}
                      </span>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {job.type.replace('_', ' ')}
                      </span>
                    </div>
                    
                    <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                      <div className="flex items-center">
                        <BuildingOfficeIcon className="h-4 w-4 mr-1" />
                        {getCompanyName(job.companyId)}
                      </div>
                      <div className="flex items-center">
                        <MapPinIcon className="h-4 w-4 mr-1" />
                        {job.location}
                      </div>
                      <div className="flex items-center">
                        <CalendarIcon className="h-4 w-4 mr-1" />
                        {job.createdAt.toLocaleDateString()}
                      </div>
                    </div>
                    
                    <p className="text-gray-600 mt-2 line-clamp-2">
                      {job.description}
                    </p>

                    {job.applicationDeadline && (
                      <div className="mt-2">
                        <span className={`text-sm ${
                          new Date(job.applicationDeadline) < new Date() 
                            ? 'text-red-600' 
                            : 'text-gray-600'
                        }`}>
                          Deadline: {job.applicationDeadline.toLocaleDateString()}
                          {new Date(job.applicationDeadline) < new Date() && ' (Expired)'}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center space-x-2 ml-4">
                    <button
                      onClick={() => toggleJobStatus(job.id, job.isActive)}
                      className={`px-3 py-1 text-xs font-medium rounded-full border ${
                        job.isActive
                          ? 'bg-red-50 text-red-700 border-red-200 hover:bg-red-100'
                          : 'bg-green-50 text-green-700 border-green-200 hover:bg-green-100'
                      }`}
                      title={job.isActive ? 'Deactivate job' : 'Activate job'}
                    >
                      {job.isActive ? 'Deactivate' : 'Activate'}
                    </button>
                    
                    <button
                      onClick={() => onEditJob(job)}
                      className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg"
                      title="Edit job"
                    >
                      <PencilIcon className="h-4 w-4" />
                    </button>
                    
                    <button
                      onClick={() => window.open(`/jobs/${job.id}`, '_blank')}
                      className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg"
                      title="View job"
                    >
                      <EyeIcon className="h-4 w-4" />
                    </button>
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