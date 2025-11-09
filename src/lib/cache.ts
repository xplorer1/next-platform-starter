/**
 * Caching strategies for mock data and API responses
 */

interface CacheEntry<T> {
  data: T
  timestamp: number
  ttl: number
}

class MemoryCache {
  private cache = new Map<string, CacheEntry<any>>()
  private maxSize = 100

  set<T>(key: string, data: T, ttl = 5 * 60 * 1000): void { // 5 minutes default
    // Remove oldest entries if cache is full
    if (this.cache.size >= this.maxSize) {
      const firstKey = this.cache.keys().next().value
      if (firstKey) {
        this.cache.delete(firstKey)
      }
    }

    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl,
    })
  }

  get<T>(key: string): T | null {
    const entry = this.cache.get(key)
    
    if (!entry) return null
    
    // Check if expired
    if (Date.now() - entry.timestamp > entry.ttl) {
      this.cache.delete(key)
      return null
    }
    
    return entry.data
  }

  has(key: string): boolean {
    const entry = this.cache.get(key)
    if (!entry) return false
    
    // Check if expired
    if (Date.now() - entry.timestamp > entry.ttl) {
      this.cache.delete(key)
      return false
    }
    
    return true
  }

  delete(key: string): boolean {
    return this.cache.delete(key)
  }

  clear(): void {
    this.cache.clear()
  }

  size(): number {
    return this.cache.size
  }
}

// Global cache instance
export const memoryCache = new MemoryCache()

// Cache keys
export const CACHE_KEYS = {
  JOBS: 'jobs',
  COMPANIES: 'companies',
  APPLICATIONS: 'applications',
  USER_PROFILE: (userId: string) => `user_profile_${userId}`,
  JOB_DETAIL: (jobId: string) => `job_detail_${jobId}`,
  COMPANY_DETAIL: (companyId: string) => `company_detail_${companyId}`,
  FILTERED_JOBS: (filters: string) => `filtered_jobs_${filters}`,
} as const

// Cache TTL constants (in milliseconds)
export const CACHE_TTL = {
  SHORT: 2 * 60 * 1000,      // 2 minutes
  MEDIUM: 5 * 60 * 1000,     // 5 minutes
  LONG: 15 * 60 * 1000,      // 15 minutes
  VERY_LONG: 60 * 60 * 1000, // 1 hour
} as const

// Cached data fetcher
export async function getCachedData<T>(
  key: string,
  fetcher: () => Promise<T> | T,
  ttl = CACHE_TTL.MEDIUM
): Promise<T> {
  // Try to get from cache first
  const cached = memoryCache.get<T>(key)
  if (cached) {
    return cached
  }

  // Fetch fresh data
  const data = await fetcher()
  
  // Cache the result
  memoryCache.set(key, data, ttl)
  
  return data
}

// Browser storage cache for persistence
export class BrowserCache {
  private prefix = 'cmu_job_board_'

  set<T>(key: string, data: T, ttl = CACHE_TTL.MEDIUM): void {
    if (typeof window === 'undefined') return

    const item = {
      data,
      timestamp: Date.now(),
      ttl,
    }

    try {
      localStorage.setItem(this.prefix + key, JSON.stringify(item))
    } catch (error) {
      console.warn('Failed to save to localStorage:', error)
    }
  }

  get<T>(key: string): T | null {
    if (typeof window === 'undefined') return null

    try {
      const item = localStorage.getItem(this.prefix + key)
      if (!item) return null

      const parsed = JSON.parse(item)
      
      // Check if expired
      if (Date.now() - parsed.timestamp > parsed.ttl) {
        this.delete(key)
        return null
      }

      return parsed.data
    } catch (error) {
      console.warn('Failed to read from localStorage:', error)
      return null
    }
  }

  delete(key: string): void {
    if (typeof window === 'undefined') return
    localStorage.removeItem(this.prefix + key)
  }

  clear(): void {
    if (typeof window === 'undefined') return
    
    const keys = Object.keys(localStorage)
    keys.forEach(key => {
      if (key.startsWith(this.prefix)) {
        localStorage.removeItem(key)
      }
    })
  }
}

export const browserCache = new BrowserCache()

// Cache invalidation helpers
export function invalidateCache(pattern: string): void {
  const keys = Array.from(memoryCache['cache'].keys())
  keys.forEach(key => {
    if (key.includes(pattern)) {
      memoryCache.delete(key)
    }
  })
}

export function invalidateUserCache(userId: string): void {
  invalidateCache(userId)
  browserCache.delete(CACHE_KEYS.USER_PROFILE(userId))
}

// Preload critical data
export async function preloadCriticalData(): Promise<void> {
  // This would typically preload essential data like featured jobs, companies
  // For now, we'll just ensure the cache is warmed up
  if (typeof window !== 'undefined') {
    // Preload in the background after initial render
    setTimeout(() => {
      // Preload logic would go here
    }, 100)
  }
}