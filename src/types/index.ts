// Core type definitions for JobPlat Job Board

export interface User {
  id: string
  primaryEmail: string
  secondaryEmail: string
  firstName: string
  lastName: string
  role: 'USER' | 'CAREER_OFFICER' | 'ADMIN'
  studentId?: string
  graduationYear?: number
  major?: string
  isActive: boolean
  emailVerified: boolean
  createdAt: Date
  updatedAt: Date
}

export interface Company {
  id: string
  name: string
  description: string
  website?: string
  logo?: string
  industry: string
  size: string
  location: string
  createdBy: string // Career Officer ID
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

export interface Job {
  id: string
  title: string
  description: string
  requirements: string
  location: string
  type: 'FULL_TIME' | 'PART_TIME' | 'INTERNSHIP' | 'CONTRACT'
  category: string
  salaryRange?: string
  contactPersonName: string
  contactPersonEmail: string
  contactPersonPhone?: string
  applicationInstructions: string
  applicationDeadline?: Date
  isActive: boolean
  companyId: string
  createdBy: string // Career Officer ID
  createdAt: Date
  updatedAt: Date
}

export interface Application {
  id: string
  userId: string
  jobId: string
  status: 'PENDING' | 'REVIEWED' | 'ACCEPTED' | 'REJECTED'
  coverLetter?: string
  resume?: string
  appliedAt: Date
  updatedAt: Date
}

export interface JobFilter {
  category?: string
  location?: string
  company?: string
  type?: string
  search?: string
}

export interface MockUser {
  id: string
  role: 'USER' | 'CAREER_OFFICER' | 'ADMIN'
  name: string
  email: string
}

export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: {
    code: string
    message: string
    details?: unknown
  }
  timestamp: string
}

export interface ErrorResponse {
  success: false
  error: {
    code: string
    message: string
    details?: unknown
  }
  timestamp: string
}
