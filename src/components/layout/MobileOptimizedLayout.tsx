'use client'

import { ReactNode, useEffect } from 'react'
import { useResponsive, useTouchDevice, useReducedMotion } from '@/hooks/useResponsive'
import { a11y } from '@/lib/accessibility'

interface MobileOptimizedLayoutProps {
  children: ReactNode
  className?: string
}

/**
 * Layout component optimized for mobile devices and accessibility
 */
export function MobileOptimizedLayout({ children, className = '' }: MobileOptimizedLayoutProps) {
  const { isMobile, isTablet, currentBreakpoint } = useResponsive()
  const isTouchDevice = useTouchDevice()
  const prefersReducedMotion = useReducedMotion()

  // Add responsive classes to body for CSS targeting
  useEffect(() => {
    const body = document.body
    
    // Remove existing responsive classes
    body.classList.remove('is-mobile', 'is-tablet', 'is-desktop', 'is-touch', 'reduce-motion')
    
    // Add current responsive classes
    if (isMobile) body.classList.add('is-mobile')
    if (isTablet) body.classList.add('is-tablet')
    if (!isMobile && !isTablet) body.classList.add('is-desktop')
    if (isTouchDevice) body.classList.add('is-touch')
    if (prefersReducedMotion) body.classList.add('reduce-motion')
    
    // Add breakpoint class
    body.classList.add(`breakpoint-${currentBreakpoint}`)
    
    return () => {
      body.classList.remove('is-mobile', 'is-tablet', 'is-desktop', 'is-touch', 'reduce-motion')
      body.classList.remove(`breakpoint-${currentBreakpoint}`)
    }
  }, [isMobile, isTablet, isTouchDevice, prefersReducedMotion, currentBreakpoint])

  // Announce viewport changes to screen readers
  useEffect(() => {
    if (isMobile) {
      a11y.screenReader.announce('Mobile view activated', 'polite')
    } else if (isTablet) {
      a11y.screenReader.announce('Tablet view activated', 'polite')
    } else {
      a11y.screenReader.announce('Desktop view activated', 'polite')
    }
  }, [isMobile, isTablet])

  const containerClasses = [
    'min-h-screen',
    'flex',
    'flex-col',
    // Mobile-first responsive padding
    'px-4',
    'sm:px-6',
    'lg:px-8',
    // Safe area support for mobile devices with notches
    'pt-safe-top',
    'pb-safe-bottom',
    'pl-safe-left',
    'pr-safe-right',
    // Touch-optimized spacing
    isTouchDevice ? 'touch-spacing' : '',
    // Reduced motion support
    prefersReducedMotion ? 'motion-reduce' : '',
    className
  ].filter(Boolean).join(' ')

  return (
    <div 
      className={containerClasses}
      data-mobile={isMobile}
      data-tablet={isTablet}
      data-touch={isTouchDevice}
      data-breakpoint={currentBreakpoint}
    >
      {children}
    </div>
  )
}

/**
 * Mobile-optimized container component
 */
interface MobileContainerProps {
  children: ReactNode
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full'
  className?: string
}

export function MobileContainer({ 
  children, 
  maxWidth = 'lg', 
  className = '' 
}: MobileContainerProps) {
  const { isMobile } = useResponsive()

  const maxWidthClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-4xl',
    xl: 'max-w-6xl',
    '2xl': 'max-w-7xl',
    full: 'max-w-full'
  }

  const containerClasses = [
    'w-full',
    'mx-auto',
    maxWidthClasses[maxWidth],
    // Mobile-first responsive padding
    'px-4',
    'sm:px-6',
    'lg:px-8',
    // Ensure content doesn't touch edges on mobile
    isMobile ? 'min-h-0' : '',
    className
  ].filter(Boolean).join(' ')

  return (
    <div className={containerClasses}>
      {children}
    </div>
  )
}

/**
 * Mobile-optimized grid component
 */
interface MobileGridProps {
  children: ReactNode
  columns?: {
    mobile?: number
    tablet?: number
    desktop?: number
  }
  gap?: 'sm' | 'md' | 'lg'
  className?: string
}

export function MobileGrid({ 
  children, 
  columns = { mobile: 1, tablet: 2, desktop: 3 },
  gap = 'md',
  className = '' 
}: MobileGridProps) {
  const gapClasses = {
    sm: 'gap-4',
    md: 'gap-6',
    lg: 'gap-8'
  }

  const gridClasses = [
    'grid',
    `grid-cols-${columns.mobile || 1}`,
    `md:grid-cols-${columns.tablet || 2}`,
    `lg:grid-cols-${columns.desktop || 3}`,
    gapClasses[gap],
    className
  ].filter(Boolean).join(' ')

  return (
    <div className={gridClasses}>
      {children}
    </div>
  )
}

/**
 * Mobile-optimized stack component for vertical layouts
 */
interface MobileStackProps {
  children: ReactNode
  spacing?: 'sm' | 'md' | 'lg' | 'xl'
  className?: string
}

export function MobileStack({ 
  children, 
  spacing = 'md', 
  className = '' 
}: MobileStackProps) {
  const spacingClasses = {
    sm: 'space-y-2',
    md: 'space-y-4',
    lg: 'space-y-6',
    xl: 'space-y-8'
  }

  const stackClasses = [
    'flex',
    'flex-col',
    spacingClasses[spacing],
    className
  ].filter(Boolean).join(' ')

  return (
    <div className={stackClasses}>
      {children}
    </div>
  )
}

/**
 * Mobile-optimized card component
 */
interface MobileCardProps {
  children: ReactNode
  padding?: 'sm' | 'md' | 'lg'
  shadow?: boolean
  className?: string
}

export function MobileCard({ 
  children, 
  padding = 'md', 
  shadow = true,
  className = '' 
}: MobileCardProps) {
  const { isMobile } = useResponsive()

  const paddingClasses = {
    sm: isMobile ? 'p-3' : 'p-4',
    md: isMobile ? 'p-4' : 'p-6',
    lg: isMobile ? 'p-6' : 'p-8'
  }

  const cardClasses = [
    'bg-white',
    'rounded-lg',
    'border',
    'border-gray-200',
    shadow ? 'shadow-sm' : '',
    paddingClasses[padding],
    // Touch-friendly on mobile
    isMobile ? 'touch-target' : '',
    className
  ].filter(Boolean).join(' ')

  return (
    <div className={cardClasses}>
      {children}
    </div>
  )
}