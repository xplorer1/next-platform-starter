'use client'

import { useState, useEffect } from 'react'
import { AppShell } from '@/components'
import { MockCompanyService } from '@/lib/services'
import { Company } from '@/types'
import { Building2, MapPin, Users, Globe, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { NetworkError } from '@/components/error/NetworkError'
import dynamic from 'next/dynamic'

function CompaniesPage() {
  const [companies, setCompanies] = useState<Company[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadCompanies()
  }, [])

  const loadCompanies = async () => {
    setLoading(true)
    setError(null)
    
    const response = await MockCompanyService.getCompanies()
    
    if (response.success && response.data) {
      setCompanies(response.data)
    } else {
      setError(response.error?.message || 'Failed to load companies')
    }
    
    setLoading(false)
  }

  if (loading) {
    return (
      <AppShell>
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading companies...</p>
            </div>
          </div>
        </div>
      </AppShell>
    )
  }

  if (error) {
    return (
      <AppShell>
        <div className="container mx-auto px-4 py-8">
          <NetworkError 
            error={new Error(error)}
            onRetry={loadCompanies}
          />
        </div>
      </AppShell>
    )
  }

  return (
    <AppShell>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Partner Companies</h1>
          <p className="text-lg text-gray-600">
            Explore leading organizations hiring JobPlat talent
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {companies.map((company) => (
            <div
              key={company.id}
              className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-shadow"
            >
              <div className="mb-4 flex items-start justify-between">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gray-100">
                  <Building2 className="h-6 w-6 text-gray-600" />
                </div>
                <span className="rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-700">
                  {company.industry}
                </span>
              </div>

              <h3 className="mb-2 text-xl font-semibold text-gray-900">
                {company.name}
              </h3>

              <p className="mb-4 text-gray-600 line-clamp-3">
                {company.description}
              </p>

              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <MapPin className="h-4 w-4" />
                  {company.location}
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Users className="h-4 w-4" />
                  {company.size}
                </div>
                {company.website && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Globe className="h-4 w-4" />
                    <a
                      href={company.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-red-600 hover:text-red-700 hover:underline"
                    >
                      Visit Website
                    </a>
                  </div>
                )}
              </div>

              <Link
                href={`/jobs?company=${encodeURIComponent(company.name)}`}
                className="inline-flex items-center gap-2 text-red-600 hover:text-red-700 font-medium"
              >
                View Open Positions
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          ))}
        </div>

        {companies.length === 0 && (
          <div className="text-center py-12">
            <Building2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No companies found</h3>
            <p className="text-gray-600">Check back later for new partner companies.</p>
          </div>
        )}
      </div>
    </AppShell>
  )
}

export default dynamic(() => Promise.resolve(CompaniesPage), {
  ssr: false
})