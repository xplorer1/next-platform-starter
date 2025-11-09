'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { MockAuthService, demoAccounts } from '@/lib/auth'
import { EyeIcon, EyeSlashIcon, UserIcon, LockClosedIcon } from '@heroicons/react/24/outline'
import { motion, AnimatePresence } from 'framer-motion'
import { AnimatedButton } from '@/components/animations/InteractiveElements'
import { FadeInUp, ScaleIn } from '@/components/animations/PageTransition'
import { FormError, FieldError, validateEmail, validateRequired } from '@/components/error/FormError'
import { useToast } from '@/components/error/Toast'
import { useAsyncOperation } from '@/hooks/useAsyncOperation'
import { classifyError, getErrorMessage } from '@/lib/errorHandling'

const loginSchema = z.object({
  email: z.string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
})

type LoginFormData = z.infer<typeof loginSchema>

interface LoginFormProps {
  onSuccess?: () => void
  redirectTo?: string
}

export function LoginForm({ onSuccess, redirectTo = '/jobs' }: LoginFormProps) {
  const [showPassword, setShowPassword] = useState(false)
  const router = useRouter()
  const { showSuccess, showError } = useToast()

  const {
    register,
    handleSubmit,
    formState: { errors, touchedFields },
    setValue,
    setError,
    clearErrors
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  })

  // Use async operation hook for login
  const {
    loading: isLoading,
    error: loginError,
    execute: performLogin
  } = useAsyncOperation(
    async (data: LoginFormData) => {
      // Find matching demo account by email
      const accountEntry = Object.entries(demoAccounts).find(
        ([, account]) => account.email.toLowerCase() === data.email.toLowerCase()
      )

      if (!accountEntry) {
        throw new Error('Invalid email or password')
      }

      const [accountKey] = accountEntry
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800))
      
      // Login with the found account
      MockAuthService.login(accountKey as keyof typeof demoAccounts)
      
      return { success: true, accountKey }
    },
    {
      maxRetries: 1,
      onSuccess: () => {
        showSuccess('Login successful', 'Welcome back!')
        if (onSuccess) {
          onSuccess()
        } else {
          router.push(redirectTo)
        }
      },
      onError: (error) => {
        const appError = classifyError(error)
        if (appError.message.includes('Invalid email')) {
          setError('email', { message: 'Invalid email or password' })
          setError('password', { message: 'Invalid email or password' })
        } else {
          showError('Login failed', getErrorMessage(appError))
        }
      }
    }
  )

  const onSubmit = async (data: LoginFormData) => {
    clearErrors()
    await performLogin(data)
  }

  const handleDemoLogin = (accountKey: keyof typeof demoAccounts) => {
    const account = demoAccounts[accountKey]
    if (account) {
      setValue('email', account.email)
      setValue('password', 'demo123')
      clearErrors()
    }
  }

  return (
    <div className="w-full max-w-md mx-auto px-4 sm:px-0">
      <ScaleIn className="bg-white shadow-lg rounded-lg p-6 sm:p-8">
        {/* Header */}
        <FadeInUp className="text-center mb-8">
          <motion.div 
            className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-4"
            whileHover={{ scale: 1.05, rotate: 5 }}
            transition={{ type: 'spring', stiffness: 400, damping: 17 }}
          >
            <UserIcon className="w-8 h-8 text-white" />
          </motion.div>
          <h2 className="text-2xl font-bold text-gray-900">Welcome Back</h2>
          <p className="text-gray-600 mt-2">Sign in to your JobPlat Job Board account</p>
        </FadeInUp>

        {/* Demo Account Buttons */}
        <FadeInUp delay={0.2} className="mb-6">
          <p className="text-sm text-gray-600 mb-3 text-center">Quick Demo Login:</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-4" role="group" aria-label="Demo account options">
            {[
              { key: 'student', label: 'Student', color: 'blue' },
              { key: 'alumni', label: 'Alumni', color: 'green' },
              { key: 'careerOfficer', label: 'Career Officer', color: 'purple' },
              { key: 'admin', label: 'Admin', color: 'gray' }
            ].map((demo, index) => (
              <motion.button
                key={demo.key}
                type="button"
                onClick={() => handleDemoLogin(demo.key as keyof typeof demoAccounts)}
                className={`px-3 py-3 text-sm bg-${demo.color}-50 text-${demo.color}-700 rounded-md hover:bg-${demo.color}-100 focus:outline-none focus:ring-2 focus:ring-${demo.color}-500 focus:ring-offset-2 transition-colors min-h-[44px] touch-target`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
                aria-label={`Login as demo ${demo.label.toLowerCase()}`}
              >
                {demo.label}
              </motion.button>
            ))}
          </div>
          <div className="border-t border-gray-200 pt-4">
            <p className="text-xs text-gray-500 text-center">Or enter credentials manually</p>
          </div>
        </FadeInUp>

        {/* Login Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Email Field */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Email Address <span className="text-red-500" aria-label="required">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <UserIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
              </div>
              <input
                {...register('email')}
                type="email"
                id="email"
                autoComplete="email"
                className={`block w-full pl-10 pr-3 py-3 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors text-base min-h-[44px] ${
                  errors.email ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Enter your email"
                aria-required="true"
                aria-invalid={errors.email ? 'true' : 'false'}
                aria-describedby={errors.email ? 'email-error' : undefined}
              />
            </div>
            <FieldError 
              error={errors.email?.message} 
              touched={touchedFields.email}
            />
          </div>

          {/* Password Field */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              Password <span className="text-red-500" aria-label="required">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <LockClosedIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
              </div>
              <input
                {...register('password')}
                type={showPassword ? 'text' : 'password'}
                id="password"
                autoComplete="current-password"
                className={`block w-full pl-10 pr-12 py-3 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors text-base min-h-[44px] ${
                  errors.password ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Enter your password"
                aria-required="true"
                aria-invalid={errors.password ? 'true' : 'false'}
                aria-describedby={errors.password ? 'password-error' : 'password-toggle-help'}
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 rounded-sm min-h-[44px] min-w-[44px]"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                aria-describedby="password-toggle-help"
              >
                {showPassword ? (
                  <EyeSlashIcon className="h-5 w-5 text-gray-400 hover:text-gray-600" aria-hidden="true" />
                ) : (
                  <EyeIcon className="h-5 w-5 text-gray-400 hover:text-gray-600" aria-hidden="true" />
                )}
              </button>
              <div id="password-toggle-help" className="sr-only">
                Click to {showPassword ? 'hide' : 'show'} password
              </div>
            </div>
            <FieldError 
              error={errors.password?.message} 
              touched={touchedFields.password}
            />
          </div>

          {/* Error Message */}
          <FormError 
            message={loginError?.message} 
            type="error" 
            show={!!loginError && !isLoading}
          />

          {/* Submit Button */}
          <AnimatedButton
            type="submit"
            variant="primary"
            size="lg"
            loading={isLoading}
            disabled={isLoading}
            className="w-full"
          >
            {isLoading ? 'Signing in...' : 'Sign In'}
          </AnimatedButton>
        </form>

        {/* Footer Links */}
        <div className="mt-6 text-center">
          <button
            type="button"
            onClick={() => router.push('/auth/forgot-password')}
            className="text-sm text-red-600 hover:text-red-500 transition-colors"
          >
            Forgot your password?
          </button>
        </div>
      </ScaleIn>
    </div>
  )
}