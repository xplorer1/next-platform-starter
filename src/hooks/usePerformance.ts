'use client'

import { useEffect, useRef, useState } from 'react'
import { CoreWebVitals, PerformanceMetric } from '@/lib/performance'

export function usePerformance() {
  const [metrics, setMetrics] = useState<CoreWebVitals>({})
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Only run in browser
    if (typeof window === 'undefined') return

    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        const metric: PerformanceMetric = {
          name: entry.name,
          value: entry.startTime,
          rating: 'good', // Will be calculated properly in reportWebVital
          timestamp: Date.now(),
        }

        setMetrics(prev => ({
          ...prev,
          [entry.name.toLowerCase()]: metric,
        }))
      }
    })

    // Observe various performance metrics
    try {
      observer.observe({ entryTypes: ['navigation', 'paint', 'largest-contentful-paint'] })
    } catch (error) {
      console.warn('Performance observer not supported:', error)
    }

    // Mark as loaded after initial metrics
    setTimeout(() => setIsLoading(false), 1000)

    return () => {
      observer.disconnect()
    }
  }, [])

  return { metrics, isLoading }
}

export function usePageLoadTime() {
  const [loadTime, setLoadTime] = useState<number | null>(null)

  useEffect(() => {
    if (typeof window === 'undefined') return

    const measureLoadTime = () => {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming
      if (navigation) {
        const loadTime = navigation.loadEventEnd - navigation.fetchStart
        setLoadTime(loadTime)
      }
    }

    if (document.readyState === 'complete') {
      measureLoadTime()
      return
    } else {
      window.addEventListener('load', measureLoadTime)
      return () => window.removeEventListener('load', measureLoadTime)
    }
  }, [])

  return loadTime
}

export function useResourceTiming() {
  const [resources, setResources] = useState<PerformanceResourceTiming[]>([])

  useEffect(() => {
    if (typeof window === 'undefined') return

    const updateResources = () => {
      const resourceEntries = performance.getEntriesByType('resource') as PerformanceResourceTiming[]
      setResources(resourceEntries)
    }

    updateResources()

    // Update periodically
    const interval = setInterval(updateResources, 5000)
    return () => clearInterval(interval)
  }, [])

  const slowResources = resources.filter(resource => resource.duration > 1000)
  const totalSize = resources.reduce((sum, resource) => sum + (resource.transferSize || 0), 0)

  return {
    resources,
    slowResources,
    totalSize,
    resourceCount: resources.length,
  }
}

export function useMemoryUsage() {
  const [memoryInfo, setMemoryInfo] = useState<{
    usedJSHeapSize: number
    totalJSHeapSize: number
    jsHeapSizeLimit: number
  } | null>(null)

  useEffect(() => {
    if (typeof window === 'undefined') return

    const updateMemoryInfo = () => {
      // @ts-ignore - performance.memory is not in TypeScript types but exists in Chrome
      if (performance.memory) {
        // @ts-ignore
        setMemoryInfo({
          // @ts-ignore
          usedJSHeapSize: performance.memory.usedJSHeapSize,
          // @ts-ignore
          totalJSHeapSize: performance.memory.totalJSHeapSize,
          // @ts-ignore
          jsHeapSizeLimit: performance.memory.jsHeapSizeLimit,
        })
      }
    }

    updateMemoryInfo()

    // Update every 10 seconds
    const interval = setInterval(updateMemoryInfo, 10000)
    return () => clearInterval(interval)
  }, [])

  return memoryInfo
}

export function useIntersectionObserver(
  elementRef: React.RefObject<Element>,
  options: IntersectionObserverInit = {}
) {
  const [isIntersecting, setIsIntersecting] = useState(false)
  const [hasIntersected, setHasIntersected] = useState(false)

  useEffect(() => {
    const element = elementRef.current
    if (!element) return

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0]
        if (entry) {
          setIsIntersecting(entry.isIntersecting)
          if (entry.isIntersecting && !hasIntersected) {
            setHasIntersected(true)
          }
        }
      },
      {
        rootMargin: '50px 0px',
        threshold: 0.01,
        ...options,
      }
    )

    observer.observe(element)

    return () => {
      observer.unobserve(element)
    }
  }, [elementRef, hasIntersected, options])

  return { isIntersecting, hasIntersected }
}