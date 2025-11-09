'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { ExclamationCircleIcon, CheckCircleIcon, InformationCircleIcon } from '@heroicons/react/24/outline'

interface FormErrorProps {
  message?: string
  type?: 'error' | 'success' | 'info'
  className?: string
  show?: boolean
}

interface FieldErrorProps {
  error?: string
  touched?: boolean
  className?: string
}

export function FormError({ message, type = 'error', className = '', show = true }: FormErrorProps) {
  if (!message || !show) return null

  const getIcon = () => {
    switch (type) {
      case 'success':
        return CheckCircleIcon
      case 'info':
        return InformationCircleIcon
      default:
        return ExclamationCircleIcon
    }
  }

  const getStyles = () => {
    switch (type) {
      case 'success':
        return 'bg-green-50 border-green-200 text-green-700'
      case 'info':
        return 'bg-blue-50 border-blue-200 text-blue-700'
      default:
        return 'bg-red-50 border-red-200 text-red-700'
    }
  }

  const Icon = getIcon()

  return (
    <AnimatePresence>
      <motion.div
        className={`flex items-center p-3 border rounded-lg ${getStyles()} ${className}`}
        initial={{ opacity: 0, scale: 0.95, y: -10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: -10 }}
        transition={{ duration: 0.2 }}
        role="alert"
        aria-live="polite"
      >
        <Icon className="w-5 h-5 mr-2 flex-shrink-0" />
        <span className="text-sm font-medium">{message}</span>
      </motion.div>
    </AnimatePresence>
  )
}

export function FieldError({ error, touched, className = '' }: FieldErrorProps) {
  if (!error || !touched) return null

  return (
    <AnimatePresence>
      <motion.p
        className={`mt-1 text-sm text-red-600 ${className}`}
        initial={{ opacity: 0, y: -5 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -5 }}
        transition={{ duration: 0.2 }}
        role="alert"
        aria-live="polite"
      >
        {error}
      </motion.p>
    </AnimatePresence>
  )
}

// Validation helper functions
export const validateEmail = (email: string): string | undefined => {
  if (!email) return 'Email is required'
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return 'Please enter a valid email address'
  }
  return undefined
}

export const validatePassword = (password: string): string | undefined => {
  if (!password) return 'Password is required'
  if (password.length < 8) return 'Password must be at least 8 characters'
  if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
    return 'Password must contain at least one uppercase letter, one lowercase letter, and one number'
  }
  return undefined
}

export const validateRequired = (value: string, fieldName: string): string | undefined => {
  if (!value || value.trim() === '') {
    return `${fieldName} is required`
  }
  return undefined
}

export const validatePhone = (phone: string): string | undefined => {
  if (!phone) return undefined // Phone is optional
  if (!/^\+?[\d\s\-\(\)]+$/.test(phone)) {
    return 'Please enter a valid phone number'
  }
  return undefined
}

export const validateUrl = (url: string): string | undefined => {
  if (!url) return undefined // URL is optional
  try {
    new URL(url)
    return undefined
  } catch {
    return 'Please enter a valid URL'
  }
}