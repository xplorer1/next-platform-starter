// Mock data services providing API-like interface for demo purposes

import { Job, Company, Application, User, JobFilter, ApiResponse } from '@/types'
import { mockJobs, jobsByCompany, activeJobs } from '@/data/jobs'
import { mockCompanies, featuredCompanies } from '@/data/companies'
import { mockApplications, applicationsByUser, applicationsByJob } from '@/data/applications'
import { demoUserProfiles } from '@/lib/auth'
import { getCachedData, CACHE_KEYS, CACHE_TTL, memoryCache } from '@/lib/cache'
import { measureAsyncPerformance } from '@/lib/performance'

// Simulate API delay for realistic demo experience
const simulateDelay = (ms: number = 300) => new Promise(resolve => setTimeout(resolve, ms))

// Mock Job Service
export class MockJobService {
  static async getJobs(filters?: JobFilter): Promise<ApiResponse<Job[]>> {
    const cacheKey = filters ? CACHE_KEYS.FILTERED_JOBS(JSON.stringify(filters)) : CACHE_KEYS.JOBS
    
    return measureAsyncPerformance('MockJobService.getJobs', async () => {
      return getCachedData(cacheKey, async () => {
        await simulateDelay()
        
        try {
          let filteredJobs = [...activeJobs]
          
          if (filters) {
            if (filters.category) {
              filteredJobs = filteredJobs.filter(job => 
                job.category.toLowerCase().includes(filters.category!.toLowerCase())
              )
            }
            
            if (filters.location) {
              filteredJobs = filteredJobs.filter(job => 
                job.location.toLowerCase().includes(filters.location!.toLowerCase())
              )
            }
            
            if (filters.company) {
              const company = mockCompanies.find(c => 
                c.name.toLowerCase().includes(filters.company!.toLowerCase())
              )
              if (company) {
                filteredJobs = filteredJobs.filter(job => job.companyId === company.id)
              }
            }
            
            if (filters.type) {
              filteredJobs = filteredJobs.filter(job => job.type === filters.type)
            }
            
            if (filters.search) {
              const searchTerm = filters.search.toLowerCase()
              filteredJobs = filteredJobs.filter(job => 
                job.title.toLowerCase().includes(searchTerm) ||
                job.description.toLowerCase().includes(searchTerm) ||
                job.requirements.toLowerCase().includes(searchTerm)
              )
            }
          }
          
          return {
            success: true,
            data: filteredJobs.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()),
            timestamp: new Date().toISOString()
          }
        } catch (error) {
          return {
            success: false,
            error: {
              code: 'FETCH_JOBS_ERROR',
              message: 'Failed to fetch jobs',
              details: error
            },
            timestamp: new Date().toISOString()
          }
        }
      }, CACHE_TTL.MEDIUM)
    })
  }

  static async getJobById(id: string): Promise<ApiResponse<Job | null>> {
    return measureAsyncPerformance('MockJobService.getJobById', async () => {
      return getCachedData(CACHE_KEYS.JOB_DETAIL(id), async () => {
        await simulateDelay()
        
        try {
          const job = mockJobs.find(j => j.id === id && j.isActive)
          return {
            success: true,
            data: job || null,
            timestamp: new Date().toISOString()
          }
        } catch (error) {
          return {
            success: false,
            error: {
              code: 'FETCH_JOB_ERROR',
              message: 'Failed to fetch job',
              details: error
            },
            timestamp: new Date().toISOString()
          }
        }
      }, CACHE_TTL.LONG)
    })
  }

  static async getJobsByCompany(companyId: string): Promise<ApiResponse<Job[]>> {
    await simulateDelay()
    
    try {
      const jobs = jobsByCompany[companyId] || []
      return {
        success: true,
        data: jobs.filter(job => job.isActive),
        timestamp: new Date().toISOString()
      }
    } catch (error) {
      return {
        success: false,
        error: {
          code: 'FETCH_COMPANY_JOBS_ERROR',
          message: 'Failed to fetch company jobs',
          details: error
        },
        timestamp: new Date().toISOString()
      }
    }
  }

  static async getFeaturedJobs(limit: number = 6): Promise<ApiResponse<Job[]>> {
    await simulateDelay()
    
    try {
      const featured = activeJobs
        .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
        .slice(0, limit)
      
      return {
        success: true,
        data: featured,
        timestamp: new Date().toISOString()
      }
    } catch (error) {
      return {
        success: false,
        error: {
          code: 'FETCH_FEATURED_JOBS_ERROR',
          message: 'Failed to fetch featured jobs',
          details: error
        },
        timestamp: new Date().toISOString()
      }
    }
  }
}

// Mock Company Service
export class MockCompanyService {
  static async getCompanies(): Promise<ApiResponse<Company[]>> {
    return measureAsyncPerformance('MockCompanyService.getCompanies', async () => {
      return getCachedData(CACHE_KEYS.COMPANIES, async () => {
        await simulateDelay()
        
        try {
          return {
            success: true,
            data: mockCompanies.filter(company => company.isActive),
            timestamp: new Date().toISOString()
          }
        } catch (error) {
          return {
            success: false,
            error: {
              code: 'FETCH_COMPANIES_ERROR',
              message: 'Failed to fetch companies',
              details: error
            },
            timestamp: new Date().toISOString()
          }
        }
      }, CACHE_TTL.LONG)
    })
  }

  static async getCompanyById(id: string): Promise<ApiResponse<Company | null>> {
    await simulateDelay()
    
    try {
      const company = mockCompanies.find(c => c.id === id && c.isActive)
      return {
        success: true,
        data: company || null,
        timestamp: new Date().toISOString()
      }
    } catch (error) {
      return {
        success: false,
        error: {
          code: 'FETCH_COMPANY_ERROR',
          message: 'Failed to fetch company',
          details: error
        },
        timestamp: new Date().toISOString()
      }
    }
  }

  static async getFeaturedCompanies(): Promise<ApiResponse<Company[]>> {
    await simulateDelay()
    
    try {
      return {
        success: true,
        data: featuredCompanies,
        timestamp: new Date().toISOString()
      }
    } catch (error) {
      return {
        success: false,
        error: {
          code: 'FETCH_FEATURED_COMPANIES_ERROR',
          message: 'Failed to fetch featured companies',
          details: error
        },
        timestamp: new Date().toISOString()
      }
    }
  }
}

// Mock Application Service
export class MockApplicationService {
  static async getApplicationsByUser(userId: string): Promise<ApiResponse<Application[]>> {
    await simulateDelay()
    
    try {
      const applications = applicationsByUser[userId] || []
      return {
        success: true,
        data: applications.sort((a, b) => b.appliedAt.getTime() - a.appliedAt.getTime()),
        timestamp: new Date().toISOString()
      }
    } catch (error) {
      return {
        success: false,
        error: {
          code: 'FETCH_USER_APPLICATIONS_ERROR',
          message: 'Failed to fetch user applications',
          details: error
        },
        timestamp: new Date().toISOString()
      }
    }
  }

  static async getApplicationsByJob(jobId: string): Promise<ApiResponse<Application[]>> {
    await simulateDelay()
    
    try {
      const applications = applicationsByJob[jobId] || []
      return {
        success: true,
        data: applications.sort((a, b) => b.appliedAt.getTime() - a.appliedAt.getTime()),
        timestamp: new Date().toISOString()
      }
    } catch (error) {
      return {
        success: false,
        error: {
          code: 'FETCH_JOB_APPLICATIONS_ERROR',
          message: 'Failed to fetch job applications',
          details: error
        },
        timestamp: new Date().toISOString()
      }
    }
  }

  static async applyToJob(jobId: string, userId: string, applicationData: {
    coverLetter?: string
    resume?: string
  }): Promise<ApiResponse<Application>> {
    await simulateDelay()
    
    try {
      // Check if user already applied to this job
      const existingApplication = mockApplications.find(
        app => app.jobId === jobId && app.userId === userId
      )
      
      if (existingApplication) {
        return {
          success: false,
          error: {
            code: 'DUPLICATE_APPLICATION',
            message: 'You have already applied to this job',
            details: { existingApplicationId: existingApplication.id }
          },
          timestamp: new Date().toISOString()
        }
      }
      
      // Create new application
      const newApplication: Application = {
        id: `app-${Date.now()}`,
        userId,
        jobId,
        status: 'PENDING',
        coverLetter: applicationData.coverLetter,
        resume: applicationData.resume,
        appliedAt: new Date(),
        updatedAt: new Date()
      }
      
      // Add to mock data (in real app, this would be saved to database)
      mockApplications.push(newApplication)
      
      // Update indexes
      if (!applicationsByUser[userId]) {
        applicationsByUser[userId] = []
      }
      applicationsByUser[userId].push(newApplication)
      
      if (!applicationsByJob[jobId]) {
        applicationsByJob[jobId] = []
      }
      applicationsByJob[jobId].push(newApplication)
      
      return {
        success: true,
        data: newApplication,
        timestamp: new Date().toISOString()
      }
    } catch (error) {
      return {
        success: false,
        error: {
          code: 'APPLICATION_ERROR',
          message: 'Failed to submit application',
          details: error
        },
        timestamp: new Date().toISOString()
      }
    }
  }

  static async updateApplicationStatus(
    applicationId: string, 
    status: Application['status']
  ): Promise<ApiResponse<Application>> {
    await simulateDelay()
    
    try {
      const application = mockApplications.find(app => app.id === applicationId)
      
      if (!application) {
        return {
          success: false,
          error: {
            code: 'APPLICATION_NOT_FOUND',
            message: 'Application not found',
            details: { applicationId }
          },
          timestamp: new Date().toISOString()
        }
      }
      
      application.status = status
      application.updatedAt = new Date()
      
      return {
        success: true,
        data: application,
        timestamp: new Date().toISOString()
      }
    } catch (error) {
      return {
        success: false,
        error: {
          code: 'UPDATE_APPLICATION_ERROR',
          message: 'Failed to update application status',
          details: error
        },
        timestamp: new Date().toISOString()
      }
    }
  }
}

// Mock User Service
export class MockUserService {
  static async getUserById(id: string): Promise<ApiResponse<User | null>> {
    await simulateDelay()
    
    try {
      const user = demoUserProfiles[id]
      return {
        success: true,
        data: user || null,
        timestamp: new Date().toISOString()
      }
    } catch (error) {
      return {
        success: false,
        error: {
          code: 'FETCH_USER_ERROR',
          message: 'Failed to fetch user',
          details: error
        },
        timestamp: new Date().toISOString()
      }
    }
  }

  static async getAllUsers(): Promise<ApiResponse<User[]>> {
    await simulateDelay()
    
    try {
      const users = Object.values(demoUserProfiles)
      return {
        success: true,
        data: users,
        timestamp: new Date().toISOString()
      }
    } catch (error) {
      return {
        success: false,
        error: {
          code: 'FETCH_USERS_ERROR',
          message: 'Failed to fetch users',
          details: error
        },
        timestamp: new Date().toISOString()
      }
    }
  }

  static async createUser(userData: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Promise<ApiResponse<User>> {
    await simulateDelay(800)
    
    try {
      // Check if email already exists
      const existingUser = Object.values(demoUserProfiles).find(
        user => user.primaryEmail === userData.primaryEmail || user.secondaryEmail === userData.secondaryEmail
      )
      
      if (existingUser) {
        return {
          success: false,
          error: {
            code: 'EMAIL_EXISTS',
            message: 'A user with this email address already exists',
            details: { existingUserId: existingUser.id }
          },
          timestamp: new Date().toISOString()
        }
      }

      const newUser: User = {
        ...userData,
        id: `user-${Date.now()}`,
        createdAt: new Date(),
        updatedAt: new Date()
      }

      // Add to mock data (in real app, this would be saved to database)
      demoUserProfiles[newUser.id] = newUser

      return {
        success: true,
        data: newUser,
        timestamp: new Date().toISOString()
      }
    } catch (error) {
      return {
        success: false,
        error: {
          code: 'CREATE_USER_ERROR',
          message: 'Failed to create user',
          details: error
        },
        timestamp: new Date().toISOString()
      }
    }
  }

  static async updateUserStatus(userId: string, isActive: boolean): Promise<ApiResponse<User>> {
    await simulateDelay()
    
    try {
      const user = demoUserProfiles[userId]
      
      if (!user) {
        return {
          success: false,
          error: {
            code: 'USER_NOT_FOUND',
            message: 'User not found',
            details: { userId }
          },
          timestamp: new Date().toISOString()
        }
      }

      user.isActive = isActive
      user.updatedAt = new Date()

      return {
        success: true,
        data: user,
        timestamp: new Date().toISOString()
      }
    } catch (error) {
      return {
        success: false,
        error: {
          code: 'UPDATE_USER_ERROR',
          message: 'Failed to update user status',
          details: error
        },
        timestamp: new Date().toISOString()
      }
    }
  }

  static async updateEmailVerification(userId: string, emailVerified: boolean): Promise<ApiResponse<User>> {
    await simulateDelay()
    
    try {
      const user = demoUserProfiles[userId]
      
      if (!user) {
        return {
          success: false,
          error: {
            code: 'USER_NOT_FOUND',
            message: 'User not found',
            details: { userId }
          },
          timestamp: new Date().toISOString()
        }
      }

      user.emailVerified = emailVerified
      user.updatedAt = new Date()

      return {
        success: true,
        data: user,
        timestamp: new Date().toISOString()
      }
    } catch (error) {
      return {
        success: false,
        error: {
          code: 'UPDATE_EMAIL_VERIFICATION_ERROR',
          message: 'Failed to update email verification status',
          details: error
        },
        timestamp: new Date().toISOString()
      }
    }
  }

  static async getSystemAnalytics(): Promise<ApiResponse<{
    totalUsers: number
    activeUsers: number
    inactiveUsers: number
    verifiedUsers: number
    unverifiedUsers: number
    usersByRole: Record<string, number>
    recentActivity: Array<{
      id: string
      type: 'user_created' | 'email_verified' | 'status_changed'
      userId: string
      userName: string
      timestamp: Date
      details?: any
    }>
    userGrowth: Array<{
      month: string
      count: number
    }>
  }>> {
    await simulateDelay()
    
    try {
      const users = Object.values(demoUserProfiles)
      const totalUsers = users.length
      const activeUsers = users.filter(u => u.isActive).length
      const verifiedUsers = users.filter(u => u.emailVerified).length
      
      const usersByRole = users.reduce((acc, user) => {
        acc[user.role] = (acc[user.role] || 0) + 1
        return acc
      }, {} as Record<string, number>)

      // Mock recent activity
      const recentActivity = [
        {
          id: 'activity-1',
          type: 'user_created' as const,
          userId: 'user-1',
          userName: 'Alice Uwimana',
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
          details: { role: 'USER' }
        },
        {
          id: 'activity-2',
          type: 'email_verified' as const,
          userId: 'user-2',
          userName: 'Jean Baptiste Nzeyimana',
          timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
          details: { emailType: 'secondary' }
        },
        {
          id: 'activity-3',
          type: 'status_changed' as const,
          userId: 'career-1',
          userName: 'Dr. Sarah Johnson',
          timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
          details: { status: 'activated' }
        }
      ]

      // Mock user growth data
      const userGrowth = [
        { month: 'Jan 2024', count: 15 },
        { month: 'Feb 2024', count: 23 },
        { month: 'Mar 2024', count: 31 },
        { month: 'Apr 2024', count: 28 },
        { month: 'May 2024', count: 35 },
        { month: 'Jun 2024', count: 42 }
      ]

      return {
        success: true,
        data: {
          totalUsers,
          activeUsers,
          inactiveUsers: totalUsers - activeUsers,
          verifiedUsers,
          unverifiedUsers: totalUsers - verifiedUsers,
          usersByRole,
          recentActivity,
          userGrowth
        },
        timestamp: new Date().toISOString()
      }
    } catch (error) {
      return {
        success: false,
        error: {
          code: 'FETCH_ANALYTICS_ERROR',
          message: 'Failed to fetch system analytics',
          details: error
        },
        timestamp: new Date().toISOString()
      }
    }
  }
}