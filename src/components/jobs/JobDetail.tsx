'use client'

import { useState, useEffect } from 'react'
import { Job, Company, Application } from '@/types'
import { MockJobService, MockCompanyService, MockApplicationService } from '@/lib/services'
import { MockAuthService } from '@/lib/auth'
import { 
  MapPin, 
  Clock, 
  Building2, 
  Calendar, 
  DollarSign, 
  Mail, 
  Phone, 
  ExternalLink,
  ArrowLeft,
  Loader2,
  AlertCircle,
  Share2,
  Bookmark,
  BookmarkCheck,
  CheckCircle,
  XCircle,
  Clock3,
  Eye,
  Send
} from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { useRouter } from 'next/navigation'

interface JobDetailProps {
  jobId: string
}

export function JobDetail({ jobId }: JobDetailProps) {
  const router = useRouter()
  const [job, setJob] = useState<Job | null>(null)
  const [company, setCompany] = useState<Company | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [userApplication, setUserApplication] = useState<Application | null>(null)
  const [isBookmarked, setIsBookmarked] = useState(false)
  const [showApplicationForm, setShowApplicationForm] = useState(false)
  const [applicationLoading, setApplicationLoading] = useState(false)
  const [applicationForm, setApplicationForm] = useState({
    coverLetter: '',
    resume: ''
  })
  const [showShareMenu, setShowShareMenu] = useState(false)
  
  const currentUser = MockAuthService.getCurrentUser()

  // Close share menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (showShareMenu) {
        setShowShareMenu(false)
      }
    }

    if (showShareMenu) {
      document.addEventListener('click', handleClickOutside)
      return () => document.removeEventListener('click', handleClickOutside)
    }
    
    return undefined
  }, [showShareMenu])

  useEffect(() => {
    const loadJobAndCompany = async () => {
      setLoading(true)
      setError(null)

      try {
        const jobResponse = await MockJobService.getJobById(jobId)
        if (jobResponse.success && jobResponse.data) {
          setJob(jobResponse.data)
          
          // Load company data
          const companyResponse = await MockCompanyService.getCompanyById(jobResponse.data.companyId)
          if (companyResponse.success && companyResponse.data) {
            setCompany(companyResponse.data)
          }

          // Check if current user has applied to this job
          if (currentUser) {
            const applicationsResponse = await MockApplicationService.getApplicationsByUser(currentUser.id)
            if (applicationsResponse.success && applicationsResponse.data) {
              const existingApplication = applicationsResponse.data.find(app => app.jobId === jobId)
              setUserApplication(existingApplication || null)
            }

            // Check bookmark status (mock implementation)
            const bookmarkedJobs = JSON.parse(localStorage.getItem(`bookmarks-${currentUser.id}`) || '[]')
            setIsBookmarked(bookmarkedJobs.includes(jobId))
          }
        } else {
          setError('Job not found')
        }
      } catch (err) {
        setError('Failed to load job details')
        console.error('Failed to load job:', err)
      } finally {
        setLoading(false)
      }
    }

    loadJobAndCompany()
  }, [jobId, currentUser])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        <span className="ml-3 text-gray-600">Loading job details...</span>
      </div>
    )
  }

  if (error || !job) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
        <AlertCircle className="h-8 w-8 text-red-600 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-red-900 mb-2">
          Job Not Found
        </h3>
        <p className="text-red-700 mb-4">{error}</p>
        <button
          onClick={() => router.push('/jobs')}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
        >
          Back to Jobs
        </button>
      </div>
    )
  }

  const formatJobType = (type: string) => {
    switch (type) {
      case 'FULL_TIME':
        return 'Full Time'
      case 'PART_TIME':
        return 'Part Time'
      case 'INTERNSHIP':
        return 'Internship'
      case 'CONTRACT':
        return 'Contract'
      default:
        return type
    }
  }

  const formatDeadline = (deadline?: Date) => {
    if (!deadline) return null
    const now = new Date()
    if (deadline < now) return 'Application deadline has passed'
    return `Application deadline: ${formatDistanceToNow(deadline, { addSuffix: true })}`
  }

  const isExpired = job.applicationDeadline && job.applicationDeadline < new Date()

  const handleBookmark = () => {
    if (!currentUser) return
    
    const bookmarkedJobs = JSON.parse(localStorage.getItem(`bookmarks-${currentUser.id}`) || '[]')
    let updatedBookmarks
    
    if (isBookmarked) {
      updatedBookmarks = bookmarkedJobs.filter((id: string) => id !== jobId)
    } else {
      updatedBookmarks = [...bookmarkedJobs, jobId]
    }
    
    localStorage.setItem(`bookmarks-${currentUser.id}`, JSON.stringify(updatedBookmarks))
    setIsBookmarked(!isBookmarked)
  }

  const handleShare = (method: string) => {
    const jobUrl = `${window.location.origin}/jobs/${jobId}`
    const shareText = `Check out this job opportunity: ${job?.title} at ${company?.name}`
    
    switch (method) {
      case 'copy':
        navigator.clipboard.writeText(jobUrl)
        alert('Job link copied to clipboard!')
        break
      case 'email':
        window.open(`mailto:?subject=${encodeURIComponent(shareText)}&body=${encodeURIComponent(`${shareText}\n\n${jobUrl}`)}`)
        break
      case 'linkedin':
        window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(jobUrl)}`)
        break
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(jobUrl)}`)
        break
    }
    setShowShareMenu(false)
  }

  const handleApplicationSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!currentUser || !job) return

    setApplicationLoading(true)
    try {
      const response = await MockApplicationService.applyToJob(jobId, currentUser.id, applicationForm)
      
      if (response.success && response.data) {
        setUserApplication(response.data)
        setShowApplicationForm(false)
        setApplicationForm({ coverLetter: '', resume: '' })
        alert('Application submitted successfully!')
      } else {
        alert(response.error?.message || 'Failed to submit application')
      }
    } catch (error) {
      console.error('Application error:', error)
      alert('Failed to submit application')
    } finally {
      setApplicationLoading(false)
    }
  }

  const getApplicationStatusIcon = (status: Application['status']) => {
    switch (status) {
      case 'PENDING':
        return <Clock3 className="h-4 w-4 text-yellow-600" />
      case 'REVIEWED':
        return <Eye className="h-4 w-4 text-blue-600" />
      case 'ACCEPTED':
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case 'REJECTED':
        return <XCircle className="h-4 w-4 text-red-600" />
      default:
        return <Clock3 className="h-4 w-4 text-gray-600" />
    }
  }

  const getApplicationStatusText = (status: Application['status']) => {
    switch (status) {
      case 'PENDING':
        return 'Application Pending Review'
      case 'REVIEWED':
        return 'Application Under Review'
      case 'ACCEPTED':
        return 'Application Accepted'
      case 'REJECTED':
        return 'Application Not Selected'
      default:
        return 'Application Status Unknown'
    }
  }

  const getApplicationStatusColor = (status: Application['status']) => {
    switch (status) {
      case 'PENDING':
        return 'bg-yellow-50 border-yellow-200 text-yellow-800'
      case 'REVIEWED':
        return 'bg-blue-50 border-blue-200 text-blue-800'
      case 'ACCEPTED':
        return 'bg-green-50 border-green-200 text-green-800'
      case 'REJECTED':
        return 'bg-red-50 border-red-200 text-red-800'
      default:
        return 'bg-gray-50 border-gray-200 text-gray-800'
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Back Button */}
      <button
        onClick={() => router.push('/jobs')}
        className="flex items-center text-gray-600 hover:text-gray-900 mb-6 transition-colors"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Jobs
      </button>

      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        {/* Header */}
        <div className="p-8 border-b border-gray-200">
          <div className="flex items-start justify-between mb-6">
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                {job.title}
              </h1>
              <div className="flex items-center text-gray-600 mb-4">
                <Building2 className="h-5 w-5 mr-2" />
                <span className="text-lg font-medium">
                  {company?.name || 'Company Name'}
                </span>
                {company?.website && (
                  <a
                    href={company.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ml-2 text-blue-600 hover:text-blue-800"
                  >
                    <ExternalLink className="h-4 w-4" />
                  </a>
                )}
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              {/* Bookmark Button */}
              {currentUser && (
                <button
                  onClick={handleBookmark}
                  className={`p-2 rounded-lg border transition-colors ${
                    isBookmarked 
                      ? 'bg-blue-50 border-blue-200 text-blue-600' 
                      : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                  }`}
                  title={isBookmarked ? 'Remove bookmark' : 'Bookmark job'}
                >
                  {isBookmarked ? (
                    <BookmarkCheck className="h-5 w-5" />
                  ) : (
                    <Bookmark className="h-5 w-5" />
                  )}
                </button>
              )}

              {/* Share Button */}
              <div className="relative">
                <button
                  onClick={() => setShowShareMenu(!showShareMenu)}
                  className="p-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors"
                  title="Share job"
                >
                  <Share2 className="h-5 w-5" />
                </button>

                {/* Share Menu */}
                {showShareMenu && (
                  <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                    <div className="py-2">
                      <button
                        onClick={() => handleShare('copy')}
                        className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50"
                      >
                        Copy Link
                      </button>
                      <button
                        onClick={() => handleShare('email')}
                        className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50"
                      >
                        Share via Email
                      </button>
                      <button
                        onClick={() => handleShare('linkedin')}
                        className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50"
                      >
                        Share on LinkedIn
                      </button>
                      <button
                        onClick={() => handleShare('twitter')}
                        className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50"
                      >
                        Share on Twitter
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Application Status or Expired Badge */}
              {isExpired ? (
                <span className="bg-red-100 text-red-800 text-sm font-medium px-3 py-1 rounded-full">
                  Application Closed
                </span>
              ) : userApplication && (
                <div className={`flex items-center space-x-2 px-3 py-1 rounded-full border text-sm font-medium ${getApplicationStatusColor(userApplication.status)}`}>
                  {getApplicationStatusIcon(userApplication.status)}
                  <span>{getApplicationStatusText(userApplication.status)}</span>
                </div>
              )}
            </div>
          </div>

          {/* Job Meta Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="flex items-center text-gray-600">
              <MapPin className="h-5 w-5 mr-2" />
              <span>{job.location}</span>
            </div>
            
            <div className="flex items-center text-gray-600">
              <Clock className="h-5 w-5 mr-2" />
              <span>{formatJobType(job.type)}</span>
            </div>

            {job.salaryRange && (
              <div className="flex items-center text-gray-600">
                <DollarSign className="h-5 w-5 mr-2" />
                <span>{job.salaryRange}</span>
              </div>
            )}

            <div className="flex items-center text-gray-600">
              <Calendar className="h-5 w-5 mr-2" />
              <span>Posted {formatDistanceToNow(job.createdAt, { addSuffix: true })}</span>
            </div>
          </div>

          {/* Application Deadline */}
          {job.applicationDeadline && (
            <div className={`p-4 rounded-lg ${isExpired ? 'bg-red-50 border border-red-200' : 'bg-blue-50 border border-blue-200'}`}>
              <p className={`text-sm font-medium ${isExpired ? 'text-red-800' : 'text-blue-800'}`}>
                {formatDeadline(job.applicationDeadline)}
              </p>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Job Description */}
              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Job Description
                </h2>
                <div className="prose prose-gray max-w-none">
                  <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                    {job.description}
                  </p>
                </div>
              </section>

              {/* Requirements */}
              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Requirements
                </h2>
                <div className="prose prose-gray max-w-none">
                  <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                    {job.requirements}
                  </p>
                </div>
              </section>

              {/* Application Instructions */}
              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  How to Apply
                </h2>
                <div className="prose prose-gray max-w-none">
                  <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                    {job.applicationInstructions}
                  </p>
                </div>
              </section>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-gray-50 rounded-lg p-6 space-y-6">
                {/* Contact Information */}
                <section>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Contact Information
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm font-medium text-gray-700 mb-1">
                        Contact Person
                      </p>
                      <p className="text-gray-900">{job.contactPersonName}</p>
                    </div>
                    
                    <div>
                      <p className="text-sm font-medium text-gray-700 mb-1">
                        Email
                      </p>
                      <a
                        href={`mailto:${job.contactPersonEmail}`}
                        className="flex items-center text-blue-600 hover:text-blue-800"
                      >
                        <Mail className="h-4 w-4 mr-2" />
                        {job.contactPersonEmail}
                      </a>
                    </div>

                    {job.contactPersonPhone && (
                      <div>
                        <p className="text-sm font-medium text-gray-700 mb-1">
                          Phone
                        </p>
                        <a
                          href={`tel:${job.contactPersonPhone}`}
                          className="flex items-center text-blue-600 hover:text-blue-800"
                        >
                          <Phone className="h-4 w-4 mr-2" />
                          {job.contactPersonPhone}
                        </a>
                      </div>
                    )}
                  </div>
                </section>

                {/* Company Information */}
                {company && (
                  <section>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      About {company.name}
                    </h3>
                    <div className="space-y-3">
                      <p className="text-gray-700 text-sm leading-relaxed">
                        {company.description}
                      </p>
                      
                      <div className="space-y-2 text-sm">
                        <div>
                          <span className="font-medium text-gray-700">Industry:</span>
                          <span className="ml-2 text-gray-600">{company.industry}</span>
                        </div>
                        <div>
                          <span className="font-medium text-gray-700">Size:</span>
                          <span className="ml-2 text-gray-600">{company.size}</span>
                        </div>
                        <div>
                          <span className="font-medium text-gray-700">Location:</span>
                          <span className="ml-2 text-gray-600">{company.location}</span>
                        </div>
                      </div>

                      {company.website && (
                        <a
                          href={company.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center text-blue-600 hover:text-blue-800 text-sm"
                        >
                          Visit Website
                          <ExternalLink className="h-3 w-3 ml-1" />
                        </a>
                      )}
                    </div>
                  </section>
                )}

                {/* Apply Button / Application Status */}
                <div className="pt-4 border-t border-gray-200">
                  {!currentUser ? (
                    <div className="text-center">
                      <p className="text-gray-600 font-medium mb-2">Sign in to apply</p>
                      <button
                        onClick={() => router.push('/auth/login')}
                        className="w-full bg-blue-600 text-white text-center py-3 px-4 rounded-md font-medium hover:bg-blue-700 transition-colors"
                      >
                        Sign In
                      </button>
                    </div>
                  ) : isExpired ? (
                    <div className="text-center">
                      <p className="text-red-600 font-medium mb-2">Application Closed</p>
                      <p className="text-gray-500 text-sm">
                        The deadline for this position has passed.
                      </p>
                    </div>
                  ) : userApplication ? (
                    <div className="space-y-4">
                      <div className={`p-4 rounded-lg border ${getApplicationStatusColor(userApplication.status)}`}>
                        <div className="flex items-center space-x-2 mb-2">
                          {getApplicationStatusIcon(userApplication.status)}
                          <span className="font-medium">{getApplicationStatusText(userApplication.status)}</span>
                        </div>
                        <p className="text-sm">
                          Applied {formatDistanceToNow(userApplication.appliedAt, { addSuffix: true })}
                        </p>
                        {userApplication.status === 'PENDING' && (
                          <p className="text-sm mt-2">
                            Your application is being reviewed by the hiring team.
                          </p>
                        )}
                        {userApplication.status === 'REVIEWED' && (
                          <p className="text-sm mt-2">
                            Your application is currently under detailed review.
                          </p>
                        )}
                        {userApplication.status === 'ACCEPTED' && (
                          <p className="text-sm mt-2">
                            Congratulations! Please check your email for next steps.
                          </p>
                        )}
                        {userApplication.status === 'REJECTED' && (
                          <p className="text-sm mt-2">
                            Thank you for your interest. We encourage you to apply for other positions.
                          </p>
                        )}
                      </div>
                      
                      {/* Contact for questions */}
                      <div className="text-center">
                        <p className="text-sm text-gray-600 mb-2">Questions about your application?</p>
                        <a
                          href={`mailto:${job.contactPersonEmail}?subject=Question about ${job.title} Application`}
                          className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                        >
                          Contact {job.contactPersonName}
                        </a>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {!showApplicationForm ? (
                        <button
                          onClick={() => setShowApplicationForm(true)}
                          className="w-full bg-blue-600 text-white text-center py-3 px-4 rounded-md font-medium hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
                          data-tour="apply-button"
                        >
                          <Send className="h-4 w-4" />
                          <span>Apply Now</span>
                        </button>
                      ) : (
                        <form onSubmit={handleApplicationSubmit} className="space-y-4">
                          <div>
                            <label htmlFor="coverLetter" className="block text-sm font-medium text-gray-700 mb-2">
                              Cover Letter
                            </label>
                            <textarea
                              id="coverLetter"
                              rows={4}
                              value={applicationForm.coverLetter}
                              onChange={(e) => setApplicationForm(prev => ({ ...prev, coverLetter: e.target.value }))}
                              placeholder="Tell us why you're interested in this position..."
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                          </div>
                          
                          <div>
                            <label htmlFor="resume" className="block text-sm font-medium text-gray-700 mb-2">
                              Resume/CV
                            </label>
                            <input
                              type="text"
                              id="resume"
                              value={applicationForm.resume}
                              onChange={(e) => setApplicationForm(prev => ({ ...prev, resume: e.target.value }))}
                              placeholder="Link to your resume or CV"
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                          </div>

                          <div className="flex space-x-3">
                            <button
                              type="submit"
                              disabled={applicationLoading}
                              className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                            >
                              {applicationLoading ? (
                                <>
                                  <Loader2 className="h-4 w-4 animate-spin" />
                                  <span>Submitting...</span>
                                </>
                              ) : (
                                <>
                                  <Send className="h-4 w-4" />
                                  <span>Submit Application</span>
                                </>
                              )}
                            </button>
                            <button
                              type="button"
                              onClick={() => setShowApplicationForm(false)}
                              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
                            >
                              Cancel
                            </button>
                          </div>
                        </form>
                      )}
                      
                      {/* Alternative contact method */}
                      <div className="text-center pt-2 border-t border-gray-200">
                        <p className="text-sm text-gray-600 mb-2">Or apply directly via email:</p>
                        <a
                          href={`mailto:${job.contactPersonEmail}?subject=Application for ${job.title}`}
                          className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                        >
                          {job.contactPersonEmail}
                        </a>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}