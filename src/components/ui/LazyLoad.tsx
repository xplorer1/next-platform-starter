'use client'

import { ReactNode, useEffect, useRef, useState } from 'react'
import { createLazyLoader } from '@/lib/performance'

interface LazyLoadProps {
  children: ReactNode
  fallback?: ReactNode
  rootMargin?: string
  threshold?: number
  once?: boolean
  className?: string
}

export function LazyLoad({
  children,
  fallback = <div className="h-32 animate-pulse bg-gray-200 rounded" />,
  rootMargin = '50px 0px',
  threshold = 0.01,
  once = true,
  className,
}: LazyLoadProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [hasLoaded, setHasLoaded] = useState(false)
  const elementRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const element = elementRef.current
    if (!element) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true)
            if (once) {
              setHasLoaded(true)
              observer.unobserve(element)
            }
          } else if (!once) {
            setIsVisible(false)
          }
        })
      },
      {
        rootMargin,
        threshold,
      }
    )

    observer.observe(element)

    return () => {
      observer.unobserve(element)
    }
  }, [rootMargin, threshold, once])

  const shouldRender = isVisible || hasLoaded

  return (
    <div ref={elementRef} className={className}>
      {shouldRender ? children : fallback}
    </div>
  )
}

// Lazy load wrapper for heavy components
export function LazyComponent({
  component: Component,
  fallback,
  ...props
}: {
  component: React.ComponentType<any>
  fallback?: ReactNode
  [key: string]: any
}) {
  return (
    <LazyLoad fallback={fallback}>
      <Component {...props} />
    </LazyLoad>
  )
}

// Lazy load for images with intersection observer
export function LazyImage({
  src,
  alt,
  className,
  width,
  height,
  ...props
}: {
  src: string
  alt: string
  className?: string
  width?: number
  height?: number
  [key: string]: any
}) {
  const [isLoaded, setIsLoaded] = useState(false)
  const [isInView, setIsInView] = useState(false)
  const imgRef = useRef<HTMLImageElement>(null)

  useEffect(() => {
    const img = imgRef.current
    if (!img) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true)
            observer.unobserve(img)
          }
        })
      },
      {
        rootMargin: '50px 0px',
        threshold: 0.01,
      }
    )

    observer.observe(img)

    return () => {
      observer.unobserve(img)
    }
  }, [])

  return (
    <div
      ref={imgRef}
      className={className}
      style={{ width, height }}
    >
      {isInView && (
        <img
          src={src}
          alt={alt}
          width={width}
          height={height}
          onLoad={() => setIsLoaded(true)}
          className={`transition-opacity duration-300 ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          {...props}
        />
      )}
      {!isLoaded && isInView && (
        <div
          className="animate-pulse bg-gray-200"
          style={{ width, height }}
        />
      )}
    </div>
  )
}

// Lazy load for lists with virtualization concept
export function LazyList<T>({
  items,
  renderItem,
  itemHeight = 100,
  containerHeight = 400,
  overscan = 5,
}: {
  items: T[]
  renderItem: (item: T, index: number) => ReactNode
  itemHeight?: number
  containerHeight?: number
  overscan?: number
}) {
  const [scrollTop, setScrollTop] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)

  const visibleStart = Math.floor(scrollTop / itemHeight)
  const visibleEnd = Math.min(
    visibleStart + Math.ceil(containerHeight / itemHeight),
    items.length - 1
  )

  const startIndex = Math.max(0, visibleStart - overscan)
  const endIndex = Math.min(items.length - 1, visibleEnd + overscan)

  const visibleItems = items.slice(startIndex, endIndex + 1)

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(e.currentTarget.scrollTop)
  }

  return (
    <div
      ref={containerRef}
      className="overflow-auto"
      style={{ height: containerHeight }}
      onScroll={handleScroll}
    >
      <div style={{ height: items.length * itemHeight, position: 'relative' }}>
        <div
          style={{
            transform: `translateY(${startIndex * itemHeight}px)`,
          }}
        >
          {visibleItems.map((item, index) =>
            renderItem(item, startIndex + index)
          )}
        </div>
      </div>
    </div>
  )
}