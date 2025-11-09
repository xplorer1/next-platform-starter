'use client'

import { useState, useEffect } from 'react'
import { User } from '@/types'
import { MockAuthService } from '@/lib/auth'
import { useAuth } from '@/hooks/useAuth'
import { 
  User as UserIcon, 
  Mail, 
  GraduationCap, 
  Calendar,
  Edit3,
  Save,
  X,
  CheckCircle,
  AlertCircle,
  Loader2
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { AnimatedButton, AnimatedInput } from '@/components/animations/InteractiveElements'
import { FadeInUp, ScaleIn } from '@/components/animations/PageTransition'

interface UserProfileProps {
  onProfileUpdate?: (updatedProfile: User) => void
}

export function UserProfile({ onProfileUpdate }: UserProfileProps) {
  const { user } = useAuth()
  const [userProfile, setUserProfile] = useState<User | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  
  // Form state
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    primaryEmail: '',
    secondaryEmail: '',
    studentId: '',
    major: '',
    graduationYear: ''
  })

  useEffect(() => {
    if (user) {
      const profile = MockAuthService.getCurrentUserProfile()
      if (profile) {
        setUserProfile(profile)
        setFormData({
          firstName: profile.firstName,
          lastName: profile.lastName,
          primaryEmail: profile.primaryEmail,
          secondaryEmail: profile.secondaryEmail,
          studentId: profile.studentId || '',
          major: profile.major || '',
          graduationYear: profile.graduationYear?.toString() || ''
        })
      }
    }
  }, [user])

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
    // Clear messages when user starts typing
    if (error) setError(null)
    if (success) setSuccess(null)
  }

  const validateForm = () => {
    if (!formData.firstName.trim()) {
      setError('First name is required')
      return false
    }
    if (!formData.lastName.trim()) {
      setError('Last name is required')
      return false
    }
    if (!formData.primaryEmail.trim()) {
      setError('Primary email is required')
      return false
    }
    if (!formData.secondaryEmail.trim()) {
      setError('Secondary email is required')
      return false
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.primaryEmail)) {
      setError('Please enter a valid primary email address')
      return false
    }
    if (!emailRegex.test(formData.secondaryEmail)) {
      setError('Please enter a valid secondary email address')
      return false
    }
    
    // Check if emails are different
    if (formData.primaryEmail === formData.secondaryEmail) {
      setError('Primary and secondary email addresses must be different')
      return false
    }
    
    // Graduation year validation for students
    if (userProfile?.role === 'USER' && formData.graduationYear) {
      const year = parseInt(formData.graduationYear)
      const currentYear = new Date().getFullYear()
      if (isNaN(year) || year < 2000 || year > currentYear + 10) {
        setError('Please enter a valid graduation year')
        return false
      }
    }
    
    return true
  }

  const handleSave = async () => {
    if (!validateForm() || !userProfile) return
    
    setIsLoading(true)
    setError(null)
    setSuccess(null)
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // In a real implementation, this would make an API call
      // For demo purposes, we'll update the local profile
      const updatedProfile: User = {
        ...userProfile,
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        primaryEmail: formData.primaryEmail.trim(),
        secondaryEmail: formData.secondaryEmail.trim(),
        studentId: formData.studentId.trim() || undefined,
        major: formData.major.trim() || undefined,
        graduationYear: formData.graduationYear ? parseInt(formData.graduationYear) : undefined,
        updatedAt: new Date()
      }
      
      setUserProfile(updatedProfile)
      setIsEditing(false)
      setSuccess('Profile updated successfully!')
      
      // Call the callback if provided
      if (onProfileUpdate) {
        onProfileUpdate(updatedProfile)
      }
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(null), 3000)
      
    } catch (err) {
      setError('Failed to update profile. Please try again.')
      console.error('Profile update error:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancel = () => {
    if (!userProfile) return
    
    // Reset form data to original values
    setFormData({
      firstName: userProfile.firstName,
      lastName: userProfile.lastName,
      primaryEmail: userProfile.primaryEmail,
      secondaryEmail: userProfile.secondaryEmail,
      studentId: userProfile.studentId || '',
      major: userProfile.major || '',
      graduationYear: userProfile.graduationYear?.toString() || ''
    })
    
    setIsEditing(false)
    setError(null)
    setSuccess(null)
  }

  if (!user || !userProfile) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
        <AlertCircle className="h-8 w-8 text-yellow-600 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-yellow-900 mb-2">
          Profile Not Available
        </h3>
        <p className="text-yellow-700">
          Unable to load profile information. Please try refreshing the page.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Profile Information</h2>
          <p className="text-gray-600">
            Manage your personal information and account settings.
          </p>
        </div>
        
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
          >
            <Edit3 className="h-4 w-4" />
            <span>Edit Profile</span>
          </button>
        )}
      </div>

      {/* Success Message */}
      {success && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center space-x-3">
          <CheckCircle className="h-5 w-5 text-green-600" />
          <p className="text-green-700">{success}</p>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center space-x-3">
          <AlertCircle className="h-5 w-5 text-red-600" />
          <p className="text-red-700">{error}</p>
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Basic Information */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center space-x-3 mb-4">
            <UserIcon className="h-5 w-5 text-gray-600" />
            <h3 className="text-xl font-semibold text-gray-900">Basic Information</h3>
          </div>
          
          <div className="space-y-4">
            {/* First Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                First Name *
              </label>
              {isEditing ? (
                <input
                  type="text"
                  value={formData.firstName}
                  onChange={(e) => handleInputChange('firstName', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your first name"
                />
              ) : (
                <p className="text-gray-900">{userProfile.firstName}</p>
              )}
            </div>

            {/* Last Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Last Name *
              </label>
              {isEditing ? (
                <input
                  type="text"
                  value={formData.lastName}
                  onChange={(e) => handleInputChange('lastName', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your last name"
                />
              ) : (
                <p className="text-gray-900">{userProfile.lastName}</p>
              )}
            </div>

            {/* Role */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                {userProfile.role === 'USER' ? 'Student/Alumni' : userProfile.role.replace('_', ' ')}
              </span>
            </div>
          </div>
        </div>

        {/* Email Information */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center space-x-3 mb-4">
            <Mail className="h-5 w-5 text-gray-600" />
            <h3 className="text-xl font-semibold text-gray-900">Email Addresses</h3>
          </div>
          
          <div className="space-y-4">
            {/* Primary Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Primary Email *
              </label>
              {isEditing ? (
                <input
                  type="email"
                  value={formData.primaryEmail}
                  onChange={(e) => handleInputChange('primaryEmail', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your primary email"
                />
              ) : (
                <p className="text-gray-900">{userProfile.primaryEmail}</p>
              )}
              <p className="text-xs text-gray-500 mt-1">Used for account authentication</p>
            </div>

            {/* Secondary Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Secondary Email *
              </label>
              {isEditing ? (
                <input
                  type="email"
                  value={formData.secondaryEmail}
                  onChange={(e) => handleInputChange('secondaryEmail', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your secondary email"
                />
              ) : (
                <p className="text-gray-900">{userProfile.secondaryEmail}</p>
              )}
              <p className="text-xs text-gray-500 mt-1">Used for account recovery and notifications</p>
            </div>

            {/* Email Verification Status */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email Status</label>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                userProfile.emailVerified 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-yellow-100 text-yellow-800'
              }`}>
                {userProfile.emailVerified ? 'Verified' : 'Pending Verification'}
              </span>
            </div>
          </div>
        </div>

        {/* Academic Information (for students/alumni only) */}
        {userProfile.role === 'USER' && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center space-x-3 mb-4">
              <GraduationCap className="h-5 w-5 text-gray-600" />
              <h3 className="text-xl font-semibold text-gray-900">Academic Information</h3>
            </div>
            
            <div className="space-y-4">
              {/* Student ID */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Student ID
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={formData.studentId}
                    onChange={(e) => handleInputChange('studentId', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter your student ID"
                  />
                ) : (
                  <p className="text-gray-900">{userProfile.studentId || 'Not provided'}</p>
                )}
              </div>

              {/* Major */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Major
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={formData.major}
                    onChange={(e) => handleInputChange('major', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter your major"
                  />
                ) : (
                  <p className="text-gray-900">{userProfile.major || 'Not provided'}</p>
                )}
              </div>

              {/* Graduation Year */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Graduation Year
                </label>
                {isEditing ? (
                  <input
                    type="number"
                    min="2000"
                    max={new Date().getFullYear() + 10}
                    value={formData.graduationYear}
                    onChange={(e) => handleInputChange('graduationYear', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter graduation year"
                  />
                ) : (
                  <p className="text-gray-900">{userProfile.graduationYear || 'Not provided'}</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Account Status */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center space-x-3 mb-4">
            <Calendar className="h-5 w-5 text-gray-600" />
            <h3 className="text-xl font-semibold text-gray-900">Account Status</h3>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Account Status</label>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                userProfile.isActive 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-red-100 text-red-800'
              }`}>
                {userProfile.isActive ? 'Active' : 'Inactive'}
              </span>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Member Since</label>
              <p className="text-gray-900">
                {userProfile.createdAt.toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Last Updated</label>
              <p className="text-gray-900">
                {userProfile.updatedAt.toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Actions */}
      {isEditing && (
        <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200">
          <button
            onClick={handleCancel}
            disabled={isLoading}
            className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            <X className="h-4 w-4" />
            <span>Cancel</span>
          </button>
          
          <button
            onClick={handleSave}
            disabled={isLoading}
            className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Save className="h-4 w-4" />
            )}
            <span>{isLoading ? 'Saving...' : 'Save Changes'}</span>
          </button>
        </div>
      )}

      {/* Demo Notice */}
      {!isEditing && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h4 className="text-lg font-medium text-blue-900 mb-2">Demo Mode</h4>
          <p className="text-sm text-blue-700">
            This is a demonstration profile management system. In the full implementation, 
            profile changes would be saved to a secure database and email verification 
            would be handled through a proper authentication system.
          </p>
        </div>
      )}
    </div>
  )
}