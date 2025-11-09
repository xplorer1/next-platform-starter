'use client'

import { useState } from 'react'
import { usePerformance, usePageLoadTime, useResourceTiming, useMemoryUsage } from '@/hooks/usePerformance'
import { memoryCache } from '@/lib/cache'

export function PerformanceDashboard() {
  const [isOpen, setIsOpen] = useState(false)
  const { metrics, isLoading } = usePerformance()
  const loadTime = usePageLoadTime()
  const { resources, slowResources, totalSize, resourceCount } = useResourceTiming()
  const memoryInfo = useMemoryUsage()

  // Only show in development
  if (process.env.NODE_ENV !== 'development') {
    return null
  }

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const formatTime = (ms: number) => {
    if (ms < 1000) return `${ms.toFixed(0)}ms`
    return `${(ms / 1000).toFixed(2)}s`
  }

  const getRatingColor = (rating: string) => {
    switch (rating) {
      case 'good': return 'text-green-600'
      case 'needs-improvement': return 'text-yellow-600'
      case 'poor': return 'text-red-600'
      default: return 'text-gray-600'
    }
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="rounded-full bg-blue-600 p-3 text-white shadow-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        title="Performance Dashboard"
      >
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute bottom-16 right-0 w-96 rounded-lg bg-white p-4 shadow-xl border">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Performance Dashboard</h3>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="space-y-4 max-h-96 overflow-y-auto">
            {/* Core Web Vitals */}
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Core Web Vitals</h4>
              <div className="space-y-2 text-sm">
                {Object.entries(metrics).map(([key, metric]) => (
                  <div key={key} className="flex justify-between">
                    <span className="text-gray-600">{key.toUpperCase()}:</span>
                    <span className={getRatingColor(metric.rating)}>
                      {formatTime(metric.value)}
                    </span>
                  </div>
                ))}
                {loadTime && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Load Time:</span>
                    <span className="text-blue-600">{formatTime(loadTime)}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Resource Loading */}
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Resources</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Resources:</span>
                  <span>{resourceCount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Size:</span>
                  <span>{formatBytes(totalSize)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Slow Resources:</span>
                  <span className={slowResources.length > 0 ? 'text-red-600' : 'text-green-600'}>
                    {slowResources.length}
                  </span>
                </div>
              </div>
            </div>

            {/* Memory Usage */}
            {memoryInfo && (
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Memory Usage</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Used Heap:</span>
                    <span>{formatBytes(memoryInfo.usedJSHeapSize)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Heap:</span>
                    <span>{formatBytes(memoryInfo.totalJSHeapSize)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Heap Limit:</span>
                    <span>{formatBytes(memoryInfo.jsHeapSizeLimit)}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Cache Status */}
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Cache Status</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Cache Size:</span>
                  <span>{memoryCache.size()}</span>
                </div>
                <button
                  onClick={() => {
                    memoryCache.clear()
                    window.location.reload()
                  }}
                  className="w-full px-3 py-1 text-xs bg-red-100 text-red-700 rounded hover:bg-red-200"
                >
                  Clear Cache & Reload
                </button>
              </div>
            </div>

            {/* Slow Resources Details */}
            {slowResources.length > 0 && (
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Slow Resources</h4>
                <div className="space-y-1 text-xs">
                  {slowResources.slice(0, 5).map((resource, index) => (
                    <div key={index} className="text-red-600">
                      <div className="truncate">{resource.name.split('/').pop()}</div>
                      <div className="text-gray-500">{formatTime(resource.duration)}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}