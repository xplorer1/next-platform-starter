'use client'

import { motion } from 'framer-motion'

interface LoadingStateProps {
  type?: 'jobs' | 'profile' | 'form' | 'list' | 'card' | 'table'
  count?: number
  className?: string
}

// Skeleton animation variants
const shimmer = {
  initial: { backgroundPosition: '-200px 0' },
  animate: { 
    backgroundPosition: '200px 0',
    transition: {
      duration: 1.5,
      repeat: Infinity,
      ease: 'linear' as const
    }
  }
}

const SkeletonBox = ({ className = '', ...props }: { className?: string }) => (
  <motion.div
    className={`bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 bg-[length:400px_100%] rounded ${className}`}
    variants={shimmer}
    initial="initial"
    animate="animate"
    {...props}
  />
)

const JobCardSkeleton = () => (
  <div className="bg-white border border-gray-200 rounded-lg p-6 space-y-4">
    <div className="flex items-start justify-between">
      <div className="flex-1 space-y-2">
        <SkeletonBox className="h-5 w-3/4" />
        <SkeletonBox className="h-4 w-1/2" />
      </div>
      <SkeletonBox className="h-8 w-8 rounded-full" />
    </div>
    <SkeletonBox className="h-4 w-full" />
    <SkeletonBox className="h-4 w-5/6" />
    <div className="flex items-center justify-between pt-2">
      <SkeletonBox className="h-6 w-20 rounded-full" />
      <SkeletonBox className="h-8 w-24 rounded" />
    </div>
  </div>
)

const ProfileSkeleton = () => (
  <div className="bg-white rounded-lg shadow p-6 space-y-6">
    <div className="flex items-center space-x-4">
      <SkeletonBox className="h-16 w-16 rounded-full" />
      <div className="space-y-2 flex-1">
        <SkeletonBox className="h-6 w-1/3" />
        <SkeletonBox className="h-4 w-1/2" />
      </div>
    </div>
    <div className="space-y-4">
      <SkeletonBox className="h-4 w-1/4" />
      <SkeletonBox className="h-10 w-full rounded" />
      <SkeletonBox className="h-4 w-1/4" />
      <SkeletonBox className="h-10 w-full rounded" />
      <SkeletonBox className="h-4 w-1/4" />
      <SkeletonBox className="h-20 w-full rounded" />
    </div>
  </div>
)

const FormSkeleton = () => (
  <div className="space-y-6">
    {[1, 2, 3].map((i) => (
      <div key={i} className="space-y-2">
        <SkeletonBox className="h-4 w-1/4" />
        <SkeletonBox className="h-10 w-full rounded" />
      </div>
    ))}
    <div className="flex justify-end space-x-3">
      <SkeletonBox className="h-10 w-20 rounded" />
      <SkeletonBox className="h-10 w-24 rounded" />
    </div>
  </div>
)

const ListSkeleton = ({ count = 5 }: { count?: number }) => (
  <div className="space-y-3">
    {Array.from({ length: count }).map((_, i) => (
      <div key={i} className="flex items-center space-x-3 p-3 bg-white rounded border">
        <SkeletonBox className="h-10 w-10 rounded-full" />
        <div className="flex-1 space-y-2">
          <SkeletonBox className="h-4 w-3/4" />
          <SkeletonBox className="h-3 w-1/2" />
        </div>
        <SkeletonBox className="h-8 w-16 rounded" />
      </div>
    ))}
  </div>
)

const TableSkeleton = () => (
  <div className="bg-white rounded-lg shadow overflow-hidden">
    <div className="px-6 py-4 border-b border-gray-200">
      <SkeletonBox className="h-6 w-1/4" />
    </div>
    <div className="divide-y divide-gray-200">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="px-6 py-4 flex items-center space-x-4">
          <SkeletonBox className="h-8 w-8 rounded-full" />
          <SkeletonBox className="h-4 w-1/4" />
          <SkeletonBox className="h-4 w-1/6" />
          <SkeletonBox className="h-4 w-1/5" />
          <div className="flex-1" />
          <SkeletonBox className="h-6 w-16 rounded-full" />
        </div>
      ))}
    </div>
  </div>
)

export function LoadingState({ type = 'jobs', count = 3, className = '' }: LoadingStateProps) {
  const renderSkeleton = () => {
    switch (type) {
      case 'jobs':
        return (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: count }).map((_, i) => (
              <JobCardSkeleton key={i} />
            ))}
          </div>
        )
      case 'profile':
        return <ProfileSkeleton />
      case 'form':
        return <FormSkeleton />
      case 'list':
        return <ListSkeleton count={count} />
      case 'table':
        return <TableSkeleton />
      case 'card':
        return (
          <div className="space-y-4">
            {Array.from({ length: count }).map((_, i) => (
              <JobCardSkeleton key={i} />
            ))}
          </div>
        )
      default:
        return <JobCardSkeleton />
    }
  }

  return (
    <motion.div 
      className={`animate-pulse ${className}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {renderSkeleton()}
    </motion.div>
  )
}