'use client'

import { AppShell, JobSearch } from '@/components'
import { FadeInUp } from '@/components/animations/PageTransition'

function JobsPage() {
  return (
    <AppShell>
      <div className="container mx-auto px-4 py-8">
        <FadeInUp className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Job Opportunities</h1>
          <p className="text-gray-600">
            Discover exciting career opportunities for JobPlat students and alumni.
          </p>
        </FadeInUp>

        <JobSearch />
      </div>
    </AppShell>
  )
}

// Export as dynamic component to prevent SSR issues
import dynamic from 'next/dynamic'
export default dynamic(() => Promise.resolve(JobsPage), {
  ssr: false
})