'use client'

import { ReactNode } from 'react'
import { motion } from 'framer-motion'
import { 
  MagnifyingGlassIcon, 
  BriefcaseIcon, 
  UserGroupIcon,
  DocumentTextIcon,
  ExclamationCircleIcon,
  PlusIcon
} from '@heroicons/react/24/outline'

interface EmptyStateProps {
  type: 'search' | 'jobs' | 'applications' | 'users' | 'companies' | 'error' | 'custom'
  title: string
  description: string
  icon?: ReactNode
  action?: {
    label: string
    onClick: () => void
    variant?: 'primary' | 'secondary'
  }
  className?: string
}

const iconMap = {
  search: MagnifyingGlassIcon,
  jobs: BriefcaseIcon,
  applications: DocumentTextIcon,
  users: UserGroupIcon,
  companies: UserGroupIcon,
  error: ExclamationCircleIcon,
  custom: BriefcaseIcon
}

export function EmptyState({ 
  type, 
  title, 
  description, 
  icon, 
  action, 
  className = '' 
}: EmptyStateProps) {
  const IconComponent = icon ? null : iconMap[type]

  return (
    <motion.div 
      className={`text-center py-12 px-4 ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <motion.div
        className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
      >
        {icon || (IconComponent && <IconComponent className="w-8 h-8 text-gray-400" />)}
      </motion.div>
      
      <motion.h3 
        className="text-lg font-medium text-gray-900 mb-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        {title}
      </motion.h3>
      
      <motion.p 
        className="text-gray-500 mb-6 max-w-sm mx-auto"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        {description}
      </motion.p>

      {action && (
        <motion.button
          onClick={action.onClick}
          className={`inline-flex items-center px-4 py-2 rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 ${
            action.variant === 'secondary'
              ? 'bg-gray-100 text-gray-700 hover:bg-gray-200 focus:ring-gray-500'
              : 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500'
          }`}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <PlusIcon className="w-4 h-4 mr-2" />
          {action.label}
        </motion.button>
      )}
    </motion.div>
  )
}