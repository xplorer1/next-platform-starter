/**
 * Performance monitoring and Core Web Vitals tracking
 */

export interface PerformanceMetric {
  name: string
  value: number
  rating: 'good' | 'needs-improvement' | 'poor'
  timestamp: number
}

export interface CoreWebVitals {
  lcp?: PerformanceMetric // Largest Contentful Paint
  fid?: PerformanceMetric // First Input Delay
  cls?: PerformanceMetric // Cumulative Layout Shift
  fcp?: PerformanceMetric // First Contentful Paint
  ttfb?: PerformanceMetric // Time to First Byte
}

// Core Web Vitals thresholds
const THRESHOLDS = {
  lcp: { good: 2500, poor: 4000 },
  fid: { good: 100, poor: 300 },
  cls: { good: 0.1, poor: 0.25 },
  fcp: { good: 1800, poor: 3000 },
  ttfb: { good: 800, poor: 1800 },
}

function getRating(name: keyof typeof THRESHOLDS, value: number): 'good' | 'needs-improvement' | 'poor' {
  const threshold = THRESHOLDS[name]
  if (value <= threshold.good) return 'good'
  if (value <= threshold.poor) return 'needs-improvement'
  return 'poor'
}

export function reportWebVital(metric: any) {
  const { name, value, id } = metric
  
  const performanceMetric: PerformanceMetric = {
    name,
    value,
    rating: getRating(name.toLowerCase() as keyof typeof THRESHOLDS, value),
    timestamp: Date.now(),
  }

  // Log to console in development
  if (process.env.NODE_ENV === 'development') {
    console.log(`[Performance] ${name}: ${value}ms (${performanceMetric.rating})`, metric)
  }

  // In production, you would send this to your analytics service
  // Example: analytics.track('web-vital', performanceMetric)
}

export function measurePerformance<T>(name: string, fn: () => T): T {
  const start = performance.now()
  const result = fn()
  const end = performance.now()
  
  if (process.env.NODE_ENV === 'development') {
    console.log(`[Performance] ${name}: ${(end - start).toFixed(2)}ms`)
  }
  
  return result
}

export async function measureAsyncPerformance<T>(name: string, fn: () => Promise<T>): Promise<T> {
  const start = performance.now()
  const result = await fn()
  const end = performance.now()
  
  if (process.env.NODE_ENV === 'development') {
    console.log(`[Performance] ${name}: ${(end - start).toFixed(2)}ms`)
  }
  
  return result
}

// Resource loading performance
export function preloadResource(href: string, as: string, type?: string) {
  if (typeof window === 'undefined') return

  const link = document.createElement('link')
  link.rel = 'preload'
  link.href = href
  link.as = as
  if (type) link.type = type
  
  document.head.appendChild(link)
}

export function prefetchResource(href: string) {
  if (typeof window === 'undefined') return

  const link = document.createElement('link')
  link.rel = 'prefetch'
  link.href = href
  
  document.head.appendChild(link)
}

// Image optimization helpers
export function getOptimizedImageProps(src: string, alt: string, priority = false) {
  return {
    src,
    alt,
    priority,
    sizes: '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw',
    style: {
      width: '100%',
      height: 'auto',
    },
  }
}

// Lazy loading intersection observer
export function createLazyLoader(callback: (entries: IntersectionObserverEntry[]) => void) {
  if (typeof window === 'undefined') return null

  return new IntersectionObserver(callback, {
    rootMargin: '50px 0px',
    threshold: 0.01,
  })
}