'use client'

import { Job, Company } from '@/types'
import { MapPin, Clock, Building2, Calendar, DollarSign } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { AnimatedCard, AnimatedButton, AnimatedBadge } from '@/components/animations/InteractiveElements'
import { motion } from 'framer-motion'

interface JobCardProps {
  job: Job
  company?: Company
  onClick?: () => void
  'data-tour'?: string
}

export function JobCard({ job, company, onClick, 'data-tour': dataTour }: JobCardProps) {
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
    if (deadline < now) return 'Expired'
    return `Closes ${formatDistanceToNow(deadline, { addSuffix: true })}`
  }

  const isExpired = job.applicationDeadline && job.applicationDeadline < new Date()

  return (
    <AnimatedCard 
      className={`p-4 sm:p-6 cursor-pointer ${isExpired ? 'opacity-75' : ''} focus-within:ring-2 focus-within:ring-blue-500 focus-within:ring-offset-2`}
      onClick={onClick}
      hover={!isExpired}
      role="article"
      aria-label={`Job posting: ${job.title} at ${company?.name || 'Company'}`}
      data-tour={dataTour}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1 min-w-0">
          <motion.h3 
            className="text-lg font-semibold text-gray-900 mb-1 hover:text-blue-600 transition-colors break-words"
            whileHover={{ x: 2 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          >
            <button
              onClick={onClick}
              className="text-left w-full focus:outline-none focus:text-blue-600 focus:underline"
              aria-label={`View details for ${job.title}`}
            >
              {job.title}
            </button>
          </motion.h3>
          <motion.div 
            className="flex items-center text-gray-600 mb-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            <Building2 className="h-4 w-4 mr-1 flex-shrink-0" aria-hidden="true" />
            <span className="text-sm font-medium truncate">
              {company?.name || 'Company Name'}
            </span>
          </motion.div>
        </div>
        {isExpired && (
          <AnimatedBadge variant="error" className="ml-2 flex-shrink-0">
            <span className="sr-only">Job posting has </span>
            Expired
          </AnimatedBadge>
        )}
      </div>

      {/* Job Details */}
      <motion.div 
        className="space-y-2 mb-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <motion.div 
          className="flex items-center text-gray-600"
          whileHover={{ x: 2 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        >
          <MapPin className="h-4 w-4 mr-2 flex-shrink-0" aria-hidden="true" />
          <span className="text-sm truncate" title={job.location}>
            <span className="sr-only">Location: </span>
            {job.location}
          </span>
        </motion.div>
        
        <motion.div 
          className="flex items-center text-gray-600 flex-wrap"
          whileHover={{ x: 2 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        >
          <Clock className="h-4 w-4 mr-2 flex-shrink-0" aria-hidden="true" />
          <span className="text-sm">
            <span className="sr-only">Job type: </span>
            {formatJobType(job.type)}
          </span>
          <span className="mx-2 text-gray-400" aria-hidden="true">•</span>
          <span className="text-sm">
            <span className="sr-only">Category: </span>
            {job.category}
          </span>
        </motion.div>

        {job.salaryRange && (
          <motion.div 
            className="flex items-center text-gray-600"
            whileHover={{ x: 2 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          >
            <DollarSign className="h-4 w-4 mr-2 flex-shrink-0" aria-hidden="true" />
            <span className="text-sm">
              <span className="sr-only">Salary range: </span>
              {job.salaryRange}
            </span>
          </motion.div>
        )}

        {job.applicationDeadline && (
          <motion.div 
            className="flex items-center text-gray-600"
            whileHover={{ x: 2 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          >
            <Calendar className="h-4 w-4 mr-2 flex-shrink-0" aria-hidden="true" />
            <span className={`text-sm ${isExpired ? 'text-red-600 font-medium' : ''}`}>
              <span className="sr-only">Application deadline: </span>
              {formatDeadline(job.applicationDeadline)}
            </span>
          </motion.div>
        )}
      </motion.div>

      {/* Description Preview */}
      <p className="text-gray-700 text-sm line-clamp-2 mb-4 leading-relaxed">
        {job.description}
      </p>

      {/* Footer */}
      <motion.div 
        className="flex items-center justify-between pt-4 border-t border-gray-100 gap-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <span className="text-xs text-gray-500 flex-1 min-w-0">
          <span className="sr-only">Posted </span>
          <span className="truncate">
            Posted {formatDistanceToNow(job.createdAt, { addSuffix: true })}
          </span>
        </span>
        <AnimatedButton
          variant={isExpired ? 'ghost' : 'secondary'}
          size="sm"
          disabled={isExpired}
          onClick={onClick}
          className="flex-shrink-0 min-h-[36px] min-w-[36px]"
          aria-label={isExpired ? 'Job posting expired' : `View details for ${job.title}`}
        >
          {isExpired ? 'Expired' : 'View Details'}
        </AnimatedButton>
      </motion.div>
    </AnimatedCard>
  )
}