'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  WifiIcon, 
  ArrowPathIcon, 
  ExclamationTriangleIcon,
  SignalSlashIcon 
} from '@heroicons/react/24/outline'

interface NetworkErrorProps {
  onRetry: () => void
  error?: Error
  retryCount?: number
  maxRetries?: number
  className?: string
}

export function NetworkError({ 
  onRetry, 
  error, 
  retryCount = 0, 
  maxRetries = 3,
  className = '' 
}: NetworkErrorProps) {
  const [isRetrying, setIsRetrying] = useState(false)

  const handleRetry = async () => {
    setIsRetrying(true)
    try {
      await onRetry()
    } finally {
      setIsRetrying(false)
    }
  }

  const getErrorMessage = () => {
    if (error?.message.includes('fetch')) {
      return 'Unable to connect to the server. Please check your internet connection.'
    }
    if (error?.message.includes('timeout')) {
      return 'The request timed out. The server might be busy.'
    }
    return 'A network error occurred. Please try again.'
  }

  const getErrorIcon = () => {
    if (error?.message.includes('fetch') || error?.message.includes('network')) {
      return SignalSlashIcon
    }
    return ExclamationTriangleIcon
  }

  const ErrorIcon = getErrorIcon()

  return (
    <motion.div 
      className={`bg-red-50 border border-red-200 rounded-lg p-6 ${className}`}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-start">
        <motion.div
          className="flex-shrink-0"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
        >
          <ErrorIcon className="w-6 h-6 text-red-600" />
        </motion.div>
        
        <div className="ml-3 flex-1">
          <motion.h3 
            className="text-sm font-medium text-red-800"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            Connection Error
          </motion.h3>
          
          <motion.p 
            className="mt-1 text-sm text-red-700"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            {getErrorMessage()}
          </motion.p>

          {retryCount > 0 && (
            <motion.p 
              className="mt-1 text-xs text-red-600"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              Retry attempt {retryCount} of {maxRetries}
            </motion.p>
          )}

          <motion.div 
            className="mt-4 flex items-center space-x-3"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <button
              onClick={handleRetry}
              disabled={isRetrying || retryCount >= maxRetries}
              className="inline-flex items-center px-3 py-2 text-sm font-medium text-red-800 bg-red-100 rounded-md hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <AnimatePresence mode="wait">
                {isRetrying ? (
                  <motion.div
                    key="loading"
                    initial={{ opacity: 0, rotate: 0 }}
                    animate={{ opacity: 1, rotate: 360 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  >
                    <ArrowPathIcon className="w-4 h-4 mr-2" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="retry"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <ArrowPathIcon className="w-4 h-4 mr-2" />
                  </motion.div>
                )}
              </AnimatePresence>
              {isRetrying ? 'Retrying...' : 'Try Again'}
            </button>

            {retryCount >= maxRetries && (
              <motion.button
                onClick={() => window.location.reload()}
                className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <WifiIcon className="w-4 h-4 mr-2" />
                Refresh Page
              </motion.button>
            )}
          </motion.div>
        </div>
      </div>
    </motion.div>
  )
}