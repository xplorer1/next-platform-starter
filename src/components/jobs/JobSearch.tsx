'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Job, Company, JobFilter } from '@/types'
import { MockJobService, MockCompanyService } from '@/lib/services'
import { JobCard } from './JobCard'
import { JobFilters } from './JobFilters'
import { motion, AnimatePresence } from 'framer-motion'
import { StaggerContainer, StaggerItem, FadeInUp } from '@/components/animations/PageTransition'
import { JobCardSkeleton, LoadingSpinner } from '@/components/animations/SkeletonLoader'
import { AnimatedButton } from '@/components/animations/InteractiveElements'
import { EmptyState } from '@/components/error/EmptyState'
import { NetworkError } from '@/components/error/NetworkError'
import { LoadingState } from '@/components/error/LoadingState'
import { useAsyncOperation } from '@/hooks/useAsyncOperation'
import { useToast } from '@/components/error/Toast'
import { classifyError, getErrorMessage } from '@/lib/errorHandling'

export function JobSearch() {
  const router = useRouter()
  const [jobs, setJobs] = useState<Job[]>([])
  const [companies, setCompanies] = useState<Company[]>([])
  const [filters, setFilters] = useState<JobFilter>({})
  const { showError } = useToast()

  // Use async operation hook for job loading
  const {
    loading: jobsLoading,
    error: jobsError,
    execute: loadJobs,
    retry: retryJobs,
    retryCount: jobsRetryCount
  } = useAsyncOperation(
    async (filters: JobFilter) => {
      const response = await MockJobService.getJobs(filters)
      if (response.success && response.data) {
        setJobs(response.data)
        return response.data
      } else {
        throw new Error(response.error?.message || 'Failed to load jobs')
      }
    },
    {
      maxRetries: 3,
      onError: (error) => {
        const appError = classifyError(error)
        showError('Failed to load jobs', getErrorMessage(appError))
      }
    }
  )

  // Use async operation hook for company loading
  const {
    loading: companiesLoading,
    error: companiesError,
    execute: loadCompanies
  } = useAsyncOperation(
    async () => {
      const response = await MockCompanyService.getCompanies()
      if (response.success && response.data) {
        setCompanies(response.data)
        return response.data
      } else {
        throw new Error(response.error?.message || 'Failed to load companies')
      }
    },
    {
      maxRetries: 2,
      onError: (error) => {
        console.error('Failed to load companies:', error)
        // Don't show toast for company loading errors as it's not critical
      }
    }
  )

  // Load companies on mount
  useEffect(() => {
    loadCompanies()
  }, [loadCompanies])

  // Load jobs when filters change
  useEffect(() => {
    loadJobs(filters)
  }, [filters, loadJobs])

  // Save filters to localStorage for persistence
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const hasFilters = Object.values(filters).some(value => value !== undefined && value !== '')
      if (hasFilters) {
        localStorage.setItem('jobFilters', JSON.stringify(filters))
      } else {
        localStorage.removeItem('jobFilters')
      }
    }
  }, [filters])

  // Load saved filters on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedFilters = localStorage.getItem('jobFilters')
      if (savedFilters) {
        try {
          const parsedFilters = JSON.parse(savedFilters)
          setFilters(parsedFilters)
        } catch (err) {
          console.error('Failed to parse saved filters:', err)
        }
      }
    }
  }, [])

  const handleJobClick = (jobId: string) => {
    router.push(`/jobs/${jobId}`)
  }

  const getCompanyForJob = (companyId: string) => {
    return companies.find(company => company.id === companyId)
  }

  // Show network error if jobs failed to load
  if (jobsError && !jobsLoading) {
    return (
      <FadeInUp>
        <NetworkError
          onRetry={retryJobs}
          error={jobsError}
          retryCount={jobsRetryCount}
          className="max-w-2xl mx-auto"
        />
      </FadeInUp>
    )
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 lg:gap-8" data-tour="job-search">
      {/* Filters Sidebar */}
      <div className="lg:col-span-1 order-2 lg:order-1" data-tour="job-filters">
        <div className="sticky top-4">
          <JobFilters
            filters={filters}
            onFiltersChange={setFilters}
            jobCount={jobs.length}
          />
        </div>
      </div>

      {/* Job Listings */}
      <div className="lg:col-span-3 order-1 lg:order-2">
        <AnimatePresence mode="wait">
          {jobsLoading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <LoadingState type="jobs" count={6} />
            </motion.div>
          ) : jobs.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
            >
              <EmptyState
                type="search"
                title="No Jobs Found"
                description="Try adjusting your filters or search terms to find more opportunities."
                action={{
                  label: "Clear All Filters",
                  onClick: () => setFilters({}),
                  variant: "secondary"
                }}
              />
            </motion.div>
          ) : (
            <motion.div
              key="results"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-6"
            >
              {/* Results Header */}
              <FadeInUp>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-4">
                  <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
                    {jobs.length === 1 ? '1 Job Found' : `${jobs.length} Jobs Found`}
                  </h2>
                  <div className="text-sm text-gray-500">
                    Sorted by most recent
                  </div>
                </div>
              </FadeInUp>

              {/* Job Cards */}
              <StaggerContainer className="grid gap-6">
                {jobs.map((job, index) => (
                  <StaggerItem key={job.id}>
                    <JobCard
                      job={job}
                      company={getCompanyForJob(job.companyId)}
                      onClick={() => handleJobClick(job.id)}
                      data-tour={index === 0 ? "job-card" : undefined}
                    />
                  </StaggerItem>
                ))}
              </StaggerContainer>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}