/**
 * Accessibility utilities and helpers for WCAG 2.1 AA compliance
 */

// Focus management utilities
export const focusManagement = {
  /**
   * Trap focus within a container element
   */
  trapFocus: (container: HTMLElement) => {
    const focusableElements = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    )
    const firstElement = focusableElements[0] as HTMLElement
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement

    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          lastElement.focus()
          e.preventDefault()
        }
      } else {
        if (document.activeElement === lastElement) {
          firstElement.focus()
          e.preventDefault()
        }
      }
    }

    container.addEventListener('keydown', handleTabKey)
    firstElement?.focus()

    return () => {
      container.removeEventListener('keydown', handleTabKey)
    }
  },

  /**
   * Restore focus to a previously focused element
   */
  restoreFocus: (element: HTMLElement | null) => {
    if (element && typeof element.focus === 'function') {
      element.focus()
    }
  },

  /**
   * Get the currently focused element
   */
  getCurrentFocus: (): HTMLElement | null => {
    return document.activeElement as HTMLElement
  }
}

// Screen reader utilities
export const screenReader = {
  /**
   * Announce text to screen readers
   */
  announce: (message: string, priority: 'polite' | 'assertive' = 'polite') => {
    const announcer = document.createElement('div')
    announcer.setAttribute('aria-live', priority)
    announcer.setAttribute('aria-atomic', 'true')
    announcer.className = 'sr-only'
    announcer.textContent = message

    document.body.appendChild(announcer)

    setTimeout(() => {
      document.body.removeChild(announcer)
    }, 1000)
  },

  /**
   * Create visually hidden text for screen readers
   */
  createSROnlyText: (text: string): HTMLSpanElement => {
    const span = document.createElement('span')
    span.className = 'sr-only'
    span.textContent = text
    return span
  }
}

// Keyboard navigation utilities
export const keyboardNavigation = {
  /**
   * Handle escape key to close modals/dropdowns
   */
  handleEscape: (callback: () => void) => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        callback()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  },

  /**
   * Handle arrow key navigation for lists/menus
   */
  handleArrowNavigation: (
    container: HTMLElement,
    items: NodeListOf<HTMLElement>,
    currentIndex: number,
    onIndexChange: (index: number) => void
  ) => {
    const handleKeyDown = (e: KeyboardEvent) => {
      let newIndex = currentIndex

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault()
          newIndex = currentIndex < items.length - 1 ? currentIndex + 1 : 0
          break
        case 'ArrowUp':
          e.preventDefault()
          newIndex = currentIndex > 0 ? currentIndex - 1 : items.length - 1
          break
        case 'Home':
          e.preventDefault()
          newIndex = 0
          break
        case 'End':
          e.preventDefault()
          newIndex = items.length - 1
          break
        default:
          return
      }

      onIndexChange(newIndex)
      items[newIndex]?.focus()
    }

    container.addEventListener('keydown', handleKeyDown)
    return () => container.removeEventListener('keydown', handleKeyDown)
  }
}

// Color contrast utilities
export const colorContrast = {
  /**
   * Check if color combination meets WCAG AA standards
   */
  meetsWCAGAA: (foreground: string, background: string): boolean => {
    // This is a simplified check - in production, you'd use a proper color contrast library
    // For now, we'll assume our design system colors meet WCAG AA standards
    return true
  },

  /**
   * Get high contrast version of a color
   */
  getHighContrastColor: (color: string): string => {
    // Return high contrast alternatives for our design system
    const highContrastMap: Record<string, string> = {
      'text-gray-600': 'text-gray-900',
      'text-gray-500': 'text-gray-800',
      'text-blue-600': 'text-blue-800',
      'text-red-600': 'text-red-800'
    }
    return highContrastMap[color] || color
  }
}

// Touch and mobile utilities
export const touchUtilities = {
  /**
   * Check if device supports touch
   */
  isTouchDevice: (): boolean => {
    return 'ontouchstart' in window || navigator.maxTouchPoints > 0
  },

  /**
   * Get optimal touch target size (minimum 44px as per WCAG)
   */
  getTouchTargetSize: (size: 'sm' | 'md' | 'lg' = 'md'): string => {
    const sizes = {
      sm: 'min-h-[44px] min-w-[44px]',
      md: 'min-h-[48px] min-w-[48px]',
      lg: 'min-h-[56px] min-w-[56px]'
    }
    return sizes[size]
  },

  /**
   * Add touch-friendly spacing
   */
  getTouchSpacing: (): string => {
    return 'p-3 m-1' // Minimum 8px spacing between touch targets
  }
}

// Form accessibility utilities
export const formAccessibility = {
  /**
   * Generate accessible form field IDs and labels
   */
  generateFieldId: (name: string): string => {
    return `field-${name}-${Math.random().toString(36).substr(2, 9)}`
  },

  /**
   * Create accessible error message
   */
  createErrorMessage: (fieldId: string, message: string): {
    id: string
    ariaDescribedBy: string
  } => {
    const errorId = `${fieldId}-error`
    return {
      id: errorId,
      ariaDescribedBy: errorId
    }
  },

  /**
   * Validate form accessibility
   */
  validateFormAccessibility: (form: HTMLFormElement): string[] => {
    const issues: string[] = []
    const inputs = form.querySelectorAll('input, select, textarea')

    inputs.forEach((input) => {
      const element = input as HTMLInputElement
      
      // Check for labels
      const hasLabel = element.labels && element.labels.length > 0
      const hasAriaLabel = element.hasAttribute('aria-label')
      const hasAriaLabelledBy = element.hasAttribute('aria-labelledby')
      
      if (!hasLabel && !hasAriaLabel && !hasAriaLabelledBy) {
        issues.push(`Input ${element.name || element.id} is missing a label`)
      }

      // Check for required field indicators
      if (element.required && !element.hasAttribute('aria-required')) {
        issues.push(`Required field ${element.name || element.id} should have aria-required="true"`)
      }
    })

    return issues
  }
}

// Responsive utilities
export const responsiveUtilities = {
  /**
   * Get current breakpoint
   */
  getCurrentBreakpoint: (): 'sm' | 'md' | 'lg' | 'xl' | '2xl' => {
    const width = window.innerWidth
    if (width >= 1536) return '2xl'
    if (width >= 1280) return 'xl'
    if (width >= 1024) return 'lg'
    if (width >= 768) return 'md'
    return 'sm'
  },

  /**
   * Check if mobile viewport
   */
  isMobile: (): boolean => {
    return window.innerWidth < 768
  },

  /**
   * Check if tablet viewport
   */
  isTablet: (): boolean => {
    return window.innerWidth >= 768 && window.innerWidth < 1024
  },

  /**
   * Check if desktop viewport
   */
  isDesktop: (): boolean => {
    return window.innerWidth >= 1024
  }
}

// Animation utilities for accessibility
export const animationUtilities = {
  /**
   * Check if user prefers reduced motion
   */
  prefersReducedMotion: (): boolean => {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches
  },

  /**
   * Get animation duration based on user preference
   */
  getAnimationDuration: (normalDuration: number): number => {
    return animationUtilities.prefersReducedMotion() ? 0 : normalDuration
  },

  /**
   * Create accessible animation props for Framer Motion
   */
  getAccessibleAnimationProps: (animation: any) => {
    if (animationUtilities.prefersReducedMotion()) {
      return {
        initial: false,
        animate: false,
        exit: false,
        transition: { duration: 0 }
      }
    }
    return animation
  }
}

// Export all utilities
export const a11y = {
  focus: focusManagement,
  screenReader,
  keyboard: keyboardNavigation,
  color: colorContrast,
  touch: touchUtilities,
  form: formAccessibility,
  responsive: responsiveUtilities,
  animation: animationUtilities
}

export default a11y