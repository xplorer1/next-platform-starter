'use client'

import { useState, useEffect } from 'react'

export type Breakpoint = 'sm' | 'md' | 'lg' | 'xl' | '2xl'

interface ResponsiveState {
  isMobile: boolean
  isTablet: boolean
  isDesktop: boolean
  currentBreakpoint: Breakpoint
  width: number
  height: number
}

const breakpoints = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536
}

/**
 * Hook for responsive design utilities
 */
export function useResponsive(): ResponsiveState {
  const [state, setState] = useState<ResponsiveState>({
    isMobile: false,
    isTablet: false,
    isDesktop: true,
    currentBreakpoint: 'lg',
    width: 1024,
    height: 768
  })

  useEffect(() => {
    const updateState = () => {
      const width = window.innerWidth
      const height = window.innerHeight

      let currentBreakpoint: Breakpoint = 'sm'
      if (width >= breakpoints['2xl']) currentBreakpoint = '2xl'
      else if (width >= breakpoints.xl) currentBreakpoint = 'xl'
      else if (width >= breakpoints.lg) currentBreakpoint = 'lg'
      else if (width >= breakpoints.md) currentBreakpoint = 'md'
      else currentBreakpoint = 'sm'

      setState({
        isMobile: width < breakpoints.md,
        isTablet: width >= breakpoints.md && width < breakpoints.lg,
        isDesktop: width >= breakpoints.lg,
        currentBreakpoint,
        width,
        height
      })
    }

    // Initial state
    updateState()

    // Listen for resize events
    window.addEventListener('resize', updateState)
    
    // Listen for orientation changes on mobile
    window.addEventListener('orientationchange', () => {
      // Delay to allow for orientation change to complete
      setTimeout(updateState, 100)
    })

    return () => {
      window.removeEventListener('resize', updateState)
      window.removeEventListener('orientationchange', updateState)
    }
  }, [])

  return state
}

/**
 * Hook for media query matching
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') return

    const mediaQuery = window.matchMedia(query)
    setMatches(mediaQuery.matches)

    const handler = (event: MediaQueryListEvent) => {
      setMatches(event.matches)
    }

    mediaQuery.addEventListener('change', handler)
    return () => mediaQuery.removeEventListener('change', handler)
  }, [query])

  return matches
}

/**
 * Hook for detecting touch devices
 */
export function useTouchDevice(): boolean {
  const [isTouchDevice, setIsTouchDevice] = useState(false)

  useEffect(() => {
    const checkTouchDevice = () => {
      setIsTouchDevice(
        'ontouchstart' in window ||
        navigator.maxTouchPoints > 0 ||
        // @ts-ignore - for older browsers
        navigator.msMaxTouchPoints > 0
      )
    }

    checkTouchDevice()
    
    // Some devices might not report touch capability immediately
    setTimeout(checkTouchDevice, 100)
  }, [])

  return isTouchDevice
}

/**
 * Hook for detecting reduced motion preference
 */
export function useReducedMotion(): boolean {
  return useMediaQuery('(prefers-reduced-motion: reduce)')
}

/**
 * Hook for detecting high contrast preference
 */
export function useHighContrast(): boolean {
  return useMediaQuery('(prefers-contrast: high)')
}

/**
 * Hook for detecting dark mode preference
 */
export function useDarkMode(): boolean {
  return useMediaQuery('(prefers-color-scheme: dark)')
}

/**
 * Hook for viewport dimensions with debouncing
 */
export function useViewport(debounceMs: number = 100) {
  const [viewport, setViewport] = useState({
    width: 0,
    height: 0
  })

  useEffect(() => {
    let timeoutId: NodeJS.Timeout

    const updateViewport = () => {
      clearTimeout(timeoutId)
      timeoutId = setTimeout(() => {
        setViewport({
          width: window.innerWidth,
          height: window.innerHeight
        })
      }, debounceMs)
    }

    // Initial update
    updateViewport()

    window.addEventListener('resize', updateViewport)
    window.addEventListener('orientationchange', updateViewport)

    return () => {
      clearTimeout(timeoutId)
      window.removeEventListener('resize', updateViewport)
      window.removeEventListener('orientationchange', updateViewport)
    }
  }, [debounceMs])

  return viewport
}

/**
 * Hook for safe area insets (for mobile devices with notches)
 */
export function useSafeAreaInsets() {
  const [insets, setInsets] = useState({
    top: 0,
    right: 0,
    bottom: 0,
    left: 0
  })

  useEffect(() => {
    const updateInsets = () => {
      const computedStyle = getComputedStyle(document.documentElement)
      
      setInsets({
        top: parseInt(computedStyle.getPropertyValue('env(safe-area-inset-top)') || '0'),
        right: parseInt(computedStyle.getPropertyValue('env(safe-area-inset-right)') || '0'),
        bottom: parseInt(computedStyle.getPropertyValue('env(safe-area-inset-bottom)') || '0'),
        left: parseInt(computedStyle.getPropertyValue('env(safe-area-inset-left)') || '0')
      })
    }

    updateInsets()
    window.addEventListener('resize', updateInsets)
    window.addEventListener('orientationchange', updateInsets)

    return () => {
      window.removeEventListener('resize', updateInsets)
      window.removeEventListener('orientationchange', updateInsets)
    }
  }, [])

  return insets
}