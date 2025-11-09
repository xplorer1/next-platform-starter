'use client'

import { useState, useEffect, useRef } from 'react'
import { JobFilter } from '@/types'
import { Search, X, Filter, ChevronDown, ChevronUp } from 'lucide-react'
import { jobCategories, jobTypes, jobLocations } from '@/data/jobs'
import { mockCompanies } from '@/data/companies'
import { a11y } from '@/lib/accessibility'

interface JobFiltersProps {
  filters: JobFilter
  onFiltersChange: (filters: JobFilter) => void
  jobCount: number
}

export function JobFilters({ filters, onFiltersChange, jobCount }: JobFiltersProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [localSearch, setLocalSearch] = useState(filters.search || '')
  const searchInputRef = useRef<HTMLInputElement>(null)
  const filtersRef = useRef<HTMLDivElement>(null)

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      onFiltersChange({ ...filters, search: localSearch || undefined })
    }, 300)

    return () => clearTimeout(timer)
  }, [localSearch])

  // Announce filter changes to screen readers
  useEffect(() => {
    const activeFilters = Object.values(filters).filter(value => value !== undefined && value !== '').length
    if (activeFilters > 0) {
      a11y.screenReader.announce(`${activeFilters} filter${activeFilters === 1 ? '' : 's'} applied. ${jobCount} job${jobCount === 1 ? '' : 's'} found.`, 'polite')
    }
  }, [filters, jobCount])

  // Handle keyboard navigation for mobile filter toggle
  const handleFilterToggleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      setIsExpanded(!isExpanded)
    }
  }

  const handleFilterChange = (key: keyof JobFilter, value: string | undefined) => {
    onFiltersChange({
      ...filters,
      [key]: value || undefined
    })
  }

  const clearAllFilters = () => {
    setLocalSearch('')
    onFiltersChange({})
    a11y.screenReader.announce('All filters cleared', 'polite')
    // Focus search input after clearing filters
    setTimeout(() => {
      searchInputRef.current?.focus()
    }, 100)
  }

  const hasActiveFilters = Object.values(filters).some(value => value !== undefined && value !== '')

  const companies = mockCompanies.map(company => company.name).sort()

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6" role="search" aria-label="Job filters">
      {/* Search Bar */}
      <div className="relative mb-6">
        <label htmlFor="job-search" className="sr-only">
          Search jobs by title, description, or requirements
        </label>
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5 pointer-events-none" aria-hidden="true" />
        <input
          ref={searchInputRef}
          id="job-search"
          type="text"
          placeholder="Search jobs by title, description, or requirements..."
          value={localSearch}
          onChange={(e) => setLocalSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base min-h-[44px]"
          aria-describedby="search-help"
        />
        <div id="search-help" className="sr-only">
          Search will automatically update results as you type
        </div>
      </div>

      {/* Filter Toggle for Mobile */}
      <div className="flex items-center justify-between mb-4 lg:hidden">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          onKeyDown={handleFilterToggleKeyDown}
          className="flex items-center text-gray-700 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-sm p-2 min-h-[44px] -ml-2"
          aria-expanded={isExpanded}
          aria-controls="mobile-filters"
          aria-label={`${isExpanded ? 'Hide' : 'Show'} filter options`}
        >
          <Filter className="h-4 w-4 mr-2" aria-hidden="true" />
          Filters
          {isExpanded ? (
            <ChevronUp className="h-4 w-4 ml-2" aria-hidden="true" />
          ) : (
            <ChevronDown className="h-4 w-4 ml-2" aria-hidden="true" />
          )}
          {hasActiveFilters && (
            <span className="ml-2 bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded-full" aria-label={`${Object.values(filters).filter(v => v).length} active filters`}>
              Active
            </span>
          )}
        </button>
        {hasActiveFilters && (
          <button
            onClick={clearAllFilters}
            className="text-sm text-blue-600 hover:text-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-sm p-1 min-h-[44px]"
            aria-label="Clear all active filters"
          >
            Clear all
          </button>
        )}
      </div>

      {/* Filters */}
      <div 
        ref={filtersRef}
        id="mobile-filters"
        className={`space-y-4 sm:space-y-6 ${isExpanded ? 'block' : 'hidden lg:block'}`}
        role="group"
        aria-label="Filter options"
      >
        {/* Job Category */}
        <div>
          <label htmlFor="category-filter" className="block text-sm font-medium text-gray-700 mb-2">
            Category
          </label>
          <select
            id="category-filter"
            value={filters.category || ''}
            onChange={(e) => handleFilterChange('category', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base min-h-[44px]"
            aria-describedby="category-help"
          >
            <option value="">All Categories</option>
            {jobCategories.map(category => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
          <div id="category-help" className="sr-only">
            Filter jobs by category
          </div>
        </div>

        {/* Job Type */}
        <div>
          <label htmlFor="type-filter" className="block text-sm font-medium text-gray-700 mb-2">
            Job Type
          </label>
          <select
            id="type-filter"
            value={filters.type || ''}
            onChange={(e) => handleFilterChange('type', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base min-h-[44px]"
            aria-describedby="type-help"
          >
            <option value="">All Types</option>
            {jobTypes.map(type => (
              <option key={type} value={type}>
                {type === 'FULL_TIME' ? 'Full Time' :
                 type === 'PART_TIME' ? 'Part Time' :
                 type === 'INTERNSHIP' ? 'Internship' :
                 type === 'CONTRACT' ? 'Contract' : type}
              </option>
            ))}
          </select>
          <div id="type-help" className="sr-only">
            Filter jobs by employment type
          </div>
        </div>

        {/* Location */}
        <div>
          <label htmlFor="location-filter" className="block text-sm font-medium text-gray-700 mb-2">
            Location
          </label>
          <select
            id="location-filter"
            value={filters.location || ''}
            onChange={(e) => handleFilterChange('location', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base min-h-[44px]"
            aria-describedby="location-help"
          >
            <option value="">All Locations</option>
            {jobLocations.map(location => (
              <option key={location} value={location}>
                {location}
              </option>
            ))}
          </select>
          <div id="location-help" className="sr-only">
            Filter jobs by location
          </div>
        </div>

        {/* Company */}
        <div>
          <label htmlFor="company-filter" className="block text-sm font-medium text-gray-700 mb-2">
            Company
          </label>
          <select
            id="company-filter"
            value={filters.company || ''}
            onChange={(e) => handleFilterChange('company', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base min-h-[44px]"
            aria-describedby="company-help"
          >
            <option value="">All Companies</option>
            {companies.map(company => (
              <option key={company} value={company}>
                {company}
              </option>
            ))}
          </select>
          <div id="company-help" className="sr-only">
            Filter jobs by company
          </div>
        </div>

        {/* Clear Filters Button */}
        {hasActiveFilters && (
          <button
            onClick={clearAllFilters}
            className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors min-h-[44px] touch-target"
            aria-label="Clear all active filters"
          >
            <X className="h-4 w-4 mr-2" aria-hidden="true" />
            Clear All Filters
          </button>
        )}
      </div>

      {/* Results Count */}
      <div className="mt-4 sm:mt-6 pt-4 border-t border-gray-200">
        <p className="text-sm text-gray-600" role="status" aria-live="polite">
          {jobCount === 0 ? 'No jobs found' : 
           jobCount === 1 ? '1 job found' : 
           `${jobCount} jobs found`}
          {hasActiveFilters && ' matching your criteria'}
        </p>
      </div>
    </div>
  )
}