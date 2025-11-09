// Mock Authentication System for Demo Purposes

import { MockUser, User } from '@/types'

// Demo accounts for presentation
export const demoAccounts: Record<string, MockUser> = {
  student: {
    id: 'user-1',
    role: 'USER',
    name: 'Alice Uwimana',
    email: 'auwimana@andrew.cmu.edu'
  },
  alumni: {
    id: 'user-2', 
    role: 'USER',
    name: 'Jean Baptiste Nzeyimana',
    email: 'jnzeyimana@andrew.cmu.edu'
  },
  careerOfficer: {
    id: 'career-1',
    role: 'CAREER_OFFICER',
    name: 'Dr. Sarah Johnson',
    email: 'sjohnson@cmu.edu'
  },
  admin: {
    id: 'admin-1',
    role: 'ADMIN',
    name: 'System Admin',
    email: 'admin@cmu.edu'
  }
}

// Full user profiles for demo accounts
export const demoUserProfiles: Record<string, User> = {
  'user-1': {
    id: 'user-1',
    primaryEmail: 'auwimana@andrew.cmu.edu',
    secondaryEmail: 'alice.uwimana@gmail.com',
    firstName: 'Alice',
    lastName: 'Uwimana',
    role: 'USER',
    studentId: 'CMU-2024-001',
    graduationYear: 2024,
    major: 'Information Systems',
    isActive: true,
    emailVerified: true,
    createdAt: new Date('2023-09-01'),
    updatedAt: new Date('2024-01-15')
  },
  'user-2': {
    id: 'user-2',
    primaryEmail: 'jnzeyimana@andrew.cmu.edu',
    secondaryEmail: 'jean.nzeyimana@gmail.com',
    firstName: 'Jean Baptiste',
    lastName: 'Nzeyimana',
    role: 'USER',
    studentId: 'CMU-2023-045',
    graduationYear: 2023,
    major: 'Electrical and Computer Engineering',
    isActive: true,
    emailVerified: true,
    createdAt: new Date('2022-09-01'),
    updatedAt: new Date('2024-01-10')
  },
  'career-1': {
    id: 'career-1',
    primaryEmail: 'sjohnson@cmu.edu',
    secondaryEmail: 'sarah.johnson@cmu.edu',
    firstName: 'Sarah',
    lastName: 'Johnson',
    role: 'CAREER_OFFICER',
    isActive: true,
    emailVerified: true,
    createdAt: new Date('2020-08-15'),
    updatedAt: new Date('2024-01-20')
  },
  'admin-1': {
    id: 'admin-1',
    primaryEmail: 'admin@cmu.edu',
    secondaryEmail: 'admin.backup@cmu.edu',
    firstName: 'System',
    lastName: 'Admin',
    role: 'ADMIN',
    isActive: true,
    emailVerified: true,
    createdAt: new Date('2020-01-01'),
    updatedAt: new Date('2024-01-25')
  }
}

// Mock authentication service
export class MockAuthService {
  private static currentUser: MockUser | null = null
  private static readonly STORAGE_KEY = 'cmu-job-board-demo-user'

  static getCurrentUser(): MockUser | null {
    if (this.currentUser) return this.currentUser
    
    // Try to restore from localStorage
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(this.STORAGE_KEY)
      if (stored) {
        try {
          this.currentUser = JSON.parse(stored)
          return this.currentUser
        } catch {
          // Invalid stored data, ignore
        }
      }
    }
    
    return null
  }

  static login(accountKey: keyof typeof demoAccounts): MockUser {
    const user = demoAccounts[accountKey]
    if (!user) {
      throw new Error('Invalid demo account')
    }
    
    this.currentUser = user
    
    // Store in localStorage for persistence
    if (typeof window !== 'undefined') {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(user))
    }
    
    return user
  }

  static logout(): void {
    this.currentUser = null
    
    if (typeof window !== 'undefined') {
      localStorage.removeItem(this.STORAGE_KEY)
    }
  }

  static switchRole(accountKey: keyof typeof demoAccounts): MockUser {
    return this.login(accountKey)
  }

  static isAuthenticated(): boolean {
    return this.getCurrentUser() !== null
  }

  static hasRole(role: MockUser['role']): boolean {
    const user = this.getCurrentUser()
    return user?.role === role
  }

  static getUserProfile(userId: string): User | null {
    return demoUserProfiles[userId] || null
  }

  static getCurrentUserProfile(): User | null {
    const currentUser = this.getCurrentUser()
    if (!currentUser) return null
    return this.getUserProfile(currentUser.id)
  }
}