'use client'

import { useState } from 'react'
import { User } from '@/types'
import { MockUserService } from '@/lib/services'
import { UserPlus, Mail, Check, AlertCircle, Building, GraduationCap } from 'lucide-react'
import { FormError, FieldError, validateEmail, validateRequired } from '@/components/error/FormError'
import { useToast } from '@/components/error/Toast'
import { useAsyncOperation } from '@/hooks/useAsyncOperation'
import { classifyError, getErrorMessage } from '@/lib/errorHandling'

interface UserOnboardingProps {
  onUserCreated?: (user: User) => void
  onCancel?: () => void
}

interface UserFormData {
  firstName: string
  lastName: string
  primaryEmail: string
  secondaryEmail: string
  role: 'USER' | 'CAREER_OFFICER'
  studentId?: string
  graduationYear?: number
  major?: string
}

export function UserOnboarding({ onUserCreated, onCancel }: UserOnboardingProps) {
  const [formData, setFormData] = useState<UserFormData>({
    firstName: '',
    lastName: '',
    primaryEmail: '',
    secondaryEmail: '',
    role: 'USER'
  })
  
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [showSuccess, setShowSuccess] = useState(false)

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required'
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required'
    }

    if (!formData.primaryEmail.trim()) {
      newErrors.primaryEmail = 'Primary email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.primaryEmail)) {
      newErrors.primaryEmail = 'Please enter a valid email address'
    }

    if (!formData.secondaryEmail.trim()) {
      newErrors.secondaryEmail = 'Secondary email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.secondaryEmail)) {
      newErrors.secondaryEmail = 'Please enter a valid email address'
    }

    if (formData.primaryEmail === formData.secondaryEmail) {
      newErrors.secondaryEmail = 'Secondary email must be different from primary email'
    }

    if (formData.role === 'USER') {
      if (formData.graduationYear && (formData.graduationYear < 2020 || formData.graduationYear > 2030)) {
        newErrors.graduationYear = 'Please enter a valid graduation year'
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)

    try {
      const userData = {
        primaryEmail: formData.primaryEmail,
        secondaryEmail: formData.secondaryEmail,
        firstName: formData.firstName,
        lastName: formData.lastName,
        role: formData.role,
        studentId: formData.studentId,
        graduationYear: formData.graduationYear,
        major: formData.major,
        isActive: true,
        emailVerified: false
      }

      const response = await MockUserService.createUser(userData)
      
      if (response.success && response.data) {
        setShowSuccess(true)
        
        setTimeout(() => {
          onUserCreated?.(response.data!)
        }, 2000)
      } else {
        setErrors({ submit: response.error?.message || 'Failed to create user. Please try again.' })
      }

    } catch (error) {
      setErrors({ submit: 'Failed to create user. Please try again.' })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleInputChange = (field: keyof UserFormData, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  if (showSuccess) {
    return (
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-sm border border-gray-200 p-8">
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
            <Check className="h-6 w-6 text-green-600" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">User Created Successfully!</h3>
          <p className="text-sm text-gray-600 mb-4">
            Verification emails have been sent to both email addresses.
          </p>
          <div className="space-y-2 text-sm text-gray-500">
            <div className="flex items-center justify-center">
              <Mail className="h-4 w-4 mr-2" />
              {formData.primaryEmail}
            </div>
            <div className="flex items-center justify-center">
              <Mail className="h-4 w-4 mr-2" />
              {formData.secondaryEmail}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-sm border border-gray-200 p-8">
      <div className="mb-6">
        <div className="flex items-center mb-4">
          <UserPlus className="h-6 w-6 text-red-600 mr-3" />
          <h2 className="text-xl font-semibold text-gray-900">Create New User Account</h2>
        </div>
        <p className="text-gray-600">
          Add a new student, alumni, or career officer to the JobPlat Job Board platform.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
              First Name *
            </label>
            <input
              type="text"
              id="firstName"
              value={formData.firstName}
              onChange={(e) => handleInputChange('firstName', e.target.value)}
              className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 ${
                errors.firstName ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="Enter first name"
            />
            {errors.firstName && (
              <p className="mt-1 text-sm text-red-600 flex items-center">
                <AlertCircle className="h-4 w-4 mr-1" />
                {errors.firstName}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
              Last Name *
            </label>
            <input
              type="text"
              id="lastName"
              value={formData.lastName}
              onChange={(e) => handleInputChange('lastName', e.target.value)}
              className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 ${
                errors.lastName ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="Enter last name"
            />
            {errors.lastName && (
              <p className="mt-1 text-sm text-red-600 flex items-center">
                <AlertCircle className="h-4 w-4 mr-1" />
                {errors.lastName}
              </p>
            )}
          </div>
        </div>

        {/* Email Addresses */}
        <div className="space-y-4">
          <div>
            <label htmlFor="primaryEmail" className="block text-sm font-medium text-gray-700 mb-1">
              Primary Email Address *
            </label>
            <input
              type="email"
              id="primaryEmail"
              value={formData.primaryEmail}
              onChange={(e) => handleInputChange('primaryEmail', e.target.value)}
              className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 ${
                errors.primaryEmail ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="user@andrew.cmu.edu"
            />
            {errors.primaryEmail && (
              <p className="mt-1 text-sm text-red-600 flex items-center">
                <AlertCircle className="h-4 w-4 mr-1" />
                {errors.primaryEmail}
              </p>
            )}
            <p className="mt-1 text-sm text-gray-500">Used for account authentication and primary communications</p>
          </div>

          <div>
            <label htmlFor="secondaryEmail" className="block text-sm font-medium text-gray-700 mb-1">
              Secondary Email Address *
            </label>
            <input
              type="email"
              id="secondaryEmail"
              value={formData.secondaryEmail}
              onChange={(e) => handleInputChange('secondaryEmail', e.target.value)}
              className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 ${
                errors.secondaryEmail ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="user@gmail.com"
            />
            {errors.secondaryEmail && (
              <p className="mt-1 text-sm text-red-600 flex items-center">
                <AlertCircle className="h-4 w-4 mr-1" />
                {errors.secondaryEmail}
              </p>
            )}
            <p className="mt-1 text-sm text-gray-500">Used for account recovery and backup notifications</p>
          </div>
        </div>

        {/* Role Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">Account Role *</label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div
              className={`relative rounded-lg border-2 cursor-pointer p-4 ${
                formData.role === 'USER'
                  ? 'border-red-500 bg-red-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => handleInputChange('role', 'USER')}
            >
              <div className="flex items-center">
                <input
                  type="radio"
                  name="role"
                  value="USER"
                  checked={formData.role === 'USER'}
                  onChange={() => handleInputChange('role', 'USER')}
                  className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300"
                />
                <div className="ml-3">
                  <div className="flex items-center">
                    <GraduationCap className="h-5 w-5 text-gray-600 mr-2" />
                    <span className="font-medium text-gray-900">Student/Alumni</span>
                  </div>
                  <p className="text-sm text-gray-600">Can search and apply for jobs</p>
                </div>
              </div>
            </div>

            <div
              className={`relative rounded-lg border-2 cursor-pointer p-4 ${
                formData.role === 'CAREER_OFFICER'
                  ? 'border-red-500 bg-red-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => handleInputChange('role', 'CAREER_OFFICER')}
            >
              <div className="flex items-center">
                <input
                  type="radio"
                  name="role"
                  value="CAREER_OFFICER"
                  checked={formData.role === 'CAREER_OFFICER'}
                  onChange={() => handleInputChange('role', 'CAREER_OFFICER')}
                  className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300"
                />
                <div className="ml-3">
                  <div className="flex items-center">
                    <Building className="h-5 w-5 text-gray-600 mr-2" />
                    <span className="font-medium text-gray-900">Career Officer</span>
                  </div>
                  <p className="text-sm text-gray-600">Can manage companies and jobs</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Student/Alumni Specific Fields */}
        {formData.role === 'USER' && (
          <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
            <h4 className="font-medium text-gray-900">Student/Alumni Information</h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="studentId" className="block text-sm font-medium text-gray-700 mb-1">
                  Student ID
                </label>
                <input
                  type="text"
                  id="studentId"
                  value={formData.studentId || ''}
                  onChange={(e) => handleInputChange('studentId', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  placeholder="CMU-2024-001"
                />
              </div>

              <div>
                <label htmlFor="graduationYear" className="block text-sm font-medium text-gray-700 mb-1">
                  Graduation Year
                </label>
                <input
                  type="number"
                  id="graduationYear"
                  value={formData.graduationYear || ''}
                  onChange={(e) => handleInputChange('graduationYear', parseInt(e.target.value) || '')}
                  className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 ${
                    errors.graduationYear ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="2024"
                  min="2020"
                  max="2030"
                />
                {errors.graduationYear && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <AlertCircle className="h-4 w-4 mr-1" />
                    {errors.graduationYear}
                  </p>
                )}
              </div>
            </div>

            <div>
              <label htmlFor="major" className="block text-sm font-medium text-gray-700 mb-1">
                Major/Program
              </label>
              <input
                type="text"
                id="major"
                value={formData.major || ''}
                onChange={(e) => handleInputChange('major', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                placeholder="Information Systems"
              />
            </div>
          </div>
        )}

        {/* Error Message */}
        {errors.submit && (
          <div className="bg-red-50 border border-red-200 rounded-md p-4">
            <div className="flex">
              <AlertCircle className="h-5 w-5 text-red-400 mr-2 mt-0.5" />
              <p className="text-sm text-red-700">{errors.submit}</p>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              Cancel
            </button>
          )}
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Creating User...
              </>
            ) : (
              <>
                <UserPlus className="h-4 w-4 mr-2" />
                Create User Account
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  )
}