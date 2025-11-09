/**
 * Accessibility testing utilities for development and testing
 */

export interface AccessibilityIssue {
  type: 'error' | 'warning' | 'info'
  element: string
  issue: string
  suggestion: string
  wcagLevel: 'A' | 'AA' | 'AAA'
  wcagCriterion: string
}

export class AccessibilityTester {
  private issues: AccessibilityIssue[] = []

  /**
   * Run comprehensive accessibility tests on the current page
   */
  public runTests(): AccessibilityIssue[] {
    this.issues = []
    
    if (typeof window === 'undefined') {
      return this.issues
    }

    this.testImages()
    this.testForms()
    this.testHeadings()
    this.testLinks()
    this.testButtons()
    this.testColorContrast()
    this.testKeyboardNavigation()
    this.testAriaLabels()
    this.testLandmarks()
    this.testTouchTargets()

    return this.issues
  }

  /**
   * Test images for alt text
   */
  private testImages(): void {
    const images = document.querySelectorAll('img')
    images.forEach((img, index) => {
      if (!img.hasAttribute('alt')) {
        this.addIssue({
          type: 'error',
          element: `img[${index}]`,
          issue: 'Image missing alt attribute',
          suggestion: 'Add descriptive alt text or alt="" for decorative images',
          wcagLevel: 'A',
          wcagCriterion: '1.1.1 Non-text Content'
        })
      } else if (img.getAttribute('alt') === '' && !img.hasAttribute('role')) {
        // Check if this might be a content image incorrectly marked as decorative
        const hasTitle = img.hasAttribute('title')
        const hasAriaLabel = img.hasAttribute('aria-label')
        if (hasTitle || hasAriaLabel) {
          this.addIssue({
            type: 'warning',
            element: `img[${index}]`,
            issue: 'Image has empty alt but has title/aria-label',
            suggestion: 'Consider if this image conveys content and needs descriptive alt text',
            wcagLevel: 'A',
            wcagCriterion: '1.1.1 Non-text Content'
          })
        }
      }
    })
  }

  /**
   * Test form elements for proper labeling
   */
  private testForms(): void {
    const formElements = document.querySelectorAll('input, select, textarea')
    formElements.forEach((element, index) => {
      const input = element as HTMLInputElement
      const hasLabel = input.labels && input.labels.length > 0
      const hasAriaLabel = input.hasAttribute('aria-label')
      const hasAriaLabelledBy = input.hasAttribute('aria-labelledby')
      const hasTitle = input.hasAttribute('title')

      if (!hasLabel && !hasAriaLabel && !hasAriaLabelledBy && !hasTitle) {
        this.addIssue({
          type: 'error',
          element: `${input.tagName.toLowerCase()}[${index}]`,
          issue: 'Form element has no accessible label',
          suggestion: 'Add a <label>, aria-label, aria-labelledby, or title attribute',
          wcagLevel: 'A',
          wcagCriterion: '1.3.1 Info and Relationships'
        })
      }

      // Check for required field indicators
      if (input.required && !input.hasAttribute('aria-required')) {
        this.addIssue({
          type: 'warning',
          element: `${input.tagName.toLowerCase()}[${index}]`,
          issue: 'Required field missing aria-required attribute',
          suggestion: 'Add aria-required="true" to required form fields',
          wcagLevel: 'A',
          wcagCriterion: '3.3.2 Labels or Instructions'
        })
      }
    })
  }

  /**
   * Test heading structure
   */
  private testHeadings(): void {
    const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6')
    let previousLevel = 0

    headings.forEach((heading, index) => {
      const level = parseInt(heading.tagName.charAt(1))
      
      if (index === 0 && level !== 1) {
        this.addIssue({
          type: 'warning',
          element: `${heading.tagName.toLowerCase()}[${index}]`,
          issue: 'Page should start with h1',
          suggestion: 'Use h1 for the main page heading',
          wcagLevel: 'AA',
          wcagCriterion: '1.3.1 Info and Relationships'
        })
      }

      if (level > previousLevel + 1) {
        this.addIssue({
          type: 'warning',
          element: `${heading.tagName.toLowerCase()}[${index}]`,
          issue: 'Heading level skipped',
          suggestion: 'Use heading levels in sequential order (h1, h2, h3, etc.)',
          wcagLevel: 'AA',
          wcagCriterion: '1.3.1 Info and Relationships'
        })
      }

      previousLevel = level
    })
  }

  /**
   * Test links for accessibility
   */
  private testLinks(): void {
    const links = document.querySelectorAll('a')
    links.forEach((link, index) => {
      const hasHref = link.hasAttribute('href')
      const hasText = link.textContent?.trim()
      const hasAriaLabel = link.hasAttribute('aria-label')
      const hasTitle = link.hasAttribute('title')

      if (!hasHref) {
        this.addIssue({
          type: 'warning',
          element: `a[${index}]`,
          issue: 'Link missing href attribute',
          suggestion: 'Add href attribute or use button element for interactive elements',
          wcagLevel: 'A',
          wcagCriterion: '2.1.1 Keyboard'
        })
      }

      if (!hasText && !hasAriaLabel && !hasTitle) {
        this.addIssue({
          type: 'error',
          element: `a[${index}]`,
          issue: 'Link has no accessible text',
          suggestion: 'Add descriptive text, aria-label, or title attribute',
          wcagLevel: 'A',
          wcagCriterion: '2.4.4 Link Purpose'
        })
      }

      // Check for generic link text
      const genericTexts = ['click here', 'read more', 'more', 'here', 'link']
      if (hasText && genericTexts.includes(hasText.toLowerCase())) {
        this.addIssue({
          type: 'warning',
          element: `a[${index}]`,
          issue: 'Link has generic text',
          suggestion: 'Use descriptive link text that explains the link purpose',
          wcagLevel: 'AA',
          wcagCriterion: '2.4.4 Link Purpose'
        })
      }

      // Check external links
      if (link.hostname && link.hostname !== window.location.hostname) {
        const hasExternalIndicator = link.hasAttribute('aria-label') && 
          link.getAttribute('aria-label')?.includes('external')
        if (!hasExternalIndicator) {
          this.addIssue({
            type: 'info',
            element: `a[${index}]`,
            issue: 'External link not clearly indicated',
            suggestion: 'Consider adding "(opens in new tab)" or similar indicator',
            wcagLevel: 'AAA',
            wcagCriterion: '3.2.5 Change on Request'
          })
        }
      }
    })
  }

  /**
   * Test buttons for accessibility
   */
  private testButtons(): void {
    const buttons = document.querySelectorAll('button, [role="button"]')
    buttons.forEach((button, index) => {
      const hasText = button.textContent?.trim()
      const hasAriaLabel = button.hasAttribute('aria-label')
      const hasTitle = button.hasAttribute('title')

      if (!hasText && !hasAriaLabel && !hasTitle) {
        this.addIssue({
          type: 'error',
          element: `button[${index}]`,
          issue: 'Button has no accessible text',
          suggestion: 'Add descriptive text, aria-label, or title attribute',
          wcagLevel: 'A',
          wcagCriterion: '4.1.2 Name, Role, Value'
        })
      }
    })
  }

  /**
   * Test color contrast (simplified check)
   */
  private testColorContrast(): void {
    // This is a simplified implementation
    // In production, you'd use a proper color contrast library
    const textElements = document.querySelectorAll('p, span, div, h1, h2, h3, h4, h5, h6, a, button')
    
    textElements.forEach((element, index) => {
      const styles = window.getComputedStyle(element)
      const fontSize = parseFloat(styles.fontSize)
      const fontWeight = styles.fontWeight
      
      // Check for very small text
      if (fontSize < 12) {
        this.addIssue({
          type: 'warning',
          element: `${element.tagName.toLowerCase()}[${index}]`,
          issue: 'Text size may be too small',
          suggestion: 'Consider using at least 12px font size for better readability',
          wcagLevel: 'AA',
          wcagCriterion: '1.4.3 Contrast (Minimum)'
        })
      }

      // Check for very light text colors (simplified)
      const color = styles.color
      if (color.includes('rgb(') && color.includes('255, 255, 255')) {
        const backgroundColor = styles.backgroundColor
        if (backgroundColor.includes('rgb(') && backgroundColor.includes('255, 255, 255')) {
          this.addIssue({
            type: 'error',
            element: `${element.tagName.toLowerCase()}[${index}]`,
            issue: 'White text on white background',
            suggestion: 'Ensure sufficient color contrast between text and background',
            wcagLevel: 'AA',
            wcagCriterion: '1.4.3 Contrast (Minimum)'
          })
        }
      }
    })
  }

  /**
   * Test keyboard navigation
   */
  private testKeyboardNavigation(): void {
    const interactiveElements = document.querySelectorAll(
      'a, button, input, select, textarea, [tabindex], [role="button"], [role="link"]'
    )

    interactiveElements.forEach((element, index) => {
      const tabIndex = element.getAttribute('tabindex')
      
      // Check for positive tabindex values (anti-pattern)
      if (tabIndex && parseInt(tabIndex) > 0) {
        this.addIssue({
          type: 'warning',
          element: `${element.tagName.toLowerCase()}[${index}]`,
          issue: 'Positive tabindex value found',
          suggestion: 'Use tabindex="0" or remove tabindex to maintain natural tab order',
          wcagLevel: 'A',
          wcagCriterion: '2.4.3 Focus Order'
        })
      }

      // Check for elements that should be focusable but aren't
      const isButton = element.hasAttribute('role') && element.getAttribute('role') === 'button'
      const isLink = element.hasAttribute('role') && element.getAttribute('role') === 'link'
      
      if ((isButton || isLink) && tabIndex === '-1') {
        this.addIssue({
          type: 'warning',
          element: `${element.tagName.toLowerCase()}[${index}]`,
          issue: 'Interactive element not keyboard accessible',
          suggestion: 'Remove tabindex="-1" or ensure element can be reached via keyboard',
          wcagLevel: 'A',
          wcagCriterion: '2.1.1 Keyboard'
        })
      }
    })
  }

  /**
   * Test ARIA labels and roles
   */
  private testAriaLabels(): void {
    const elementsWithAriaLabelledBy = document.querySelectorAll('[aria-labelledby]')
    
    elementsWithAriaLabelledBy.forEach((element, index) => {
      const labelledBy = element.getAttribute('aria-labelledby')
      if (labelledBy) {
        const labelElement = document.getElementById(labelledBy)
        if (!labelElement) {
          this.addIssue({
            type: 'error',
            element: `${element.tagName.toLowerCase()}[${index}]`,
            issue: 'aria-labelledby references non-existent element',
            suggestion: `Ensure element with id="${labelledBy}" exists`,
            wcagLevel: 'A',
            wcagCriterion: '1.3.1 Info and Relationships'
          })
        }
      }
    })

    const elementsWithAriaDescribedBy = document.querySelectorAll('[aria-describedby]')
    
    elementsWithAriaDescribedBy.forEach((element, index) => {
      const describedBy = element.getAttribute('aria-describedby')
      if (describedBy) {
        const descriptionElement = document.getElementById(describedBy)
        if (!descriptionElement) {
          this.addIssue({
            type: 'error',
            element: `${element.tagName.toLowerCase()}[${index}]`,
            issue: 'aria-describedby references non-existent element',
            suggestion: `Ensure element with id="${describedBy}" exists`,
            wcagLevel: 'A',
            wcagCriterion: '1.3.1 Info and Relationships'
          })
        }
      }
    })
  }

  /**
   * Test landmark regions
   */
  private testLandmarks(): void {
    const hasMain = document.querySelector('main, [role="main"]')
    const hasNav = document.querySelector('nav, [role="navigation"]')
    const hasHeader = document.querySelector('header, [role="banner"]')
    const hasFooter = document.querySelector('footer, [role="contentinfo"]')

    if (!hasMain) {
      this.addIssue({
        type: 'warning',
        element: 'document',
        issue: 'Page missing main landmark',
        suggestion: 'Add <main> element or role="main" to identify main content area',
        wcagLevel: 'AA',
        wcagCriterion: '1.3.1 Info and Relationships'
      })
    }

    if (!hasNav) {
      this.addIssue({
        type: 'info',
        element: 'document',
        issue: 'Page missing navigation landmark',
        suggestion: 'Consider adding <nav> element or role="navigation" for main navigation',
        wcagLevel: 'AA',
        wcagCriterion: '1.3.1 Info and Relationships'
      })
    }
  }

  /**
   * Test touch target sizes for mobile
   */
  private testTouchTargets(): void {
    const interactiveElements = document.querySelectorAll(
      'button, a, input[type="button"], input[type="submit"], [role="button"]'
    )

    interactiveElements.forEach((element, index) => {
      const rect = element.getBoundingClientRect()
      const minSize = 44 // WCAG minimum touch target size

      if (rect.width < minSize || rect.height < minSize) {
        this.addIssue({
          type: 'warning',
          element: `${element.tagName.toLowerCase()}[${index}]`,
          issue: 'Touch target too small',
          suggestion: `Ensure touch targets are at least ${minSize}px × ${minSize}px`,
          wcagLevel: 'AA',
          wcagCriterion: '2.5.5 Target Size'
        })
      }
    })
  }

  /**
   * Add an accessibility issue to the list
   */
  private addIssue(issue: AccessibilityIssue): void {
    this.issues.push(issue)
  }

  /**
   * Get issues by severity
   */
  public getIssuesBySeverity(type: 'error' | 'warning' | 'info'): AccessibilityIssue[] {
    return this.issues.filter(issue => issue.type === type)
  }

  /**
   * Get issues by WCAG level
   */
  public getIssuesByWCAGLevel(level: 'A' | 'AA' | 'AAA'): AccessibilityIssue[] {
    return this.issues.filter(issue => issue.wcagLevel === level)
  }

  /**
   * Generate accessibility report
   */
  public generateReport(): string {
    const errors = this.getIssuesBySeverity('error')
    const warnings = this.getIssuesBySeverity('warning')
    const info = this.getIssuesBySeverity('info')

    let report = '# Accessibility Report\n\n'
    report += `**Summary:** ${errors.length} errors, ${warnings.length} warnings, ${info.length} info\n\n`

    if (errors.length > 0) {
      report += '## Errors (Must Fix)\n\n'
      errors.forEach(issue => {
        report += `- **${issue.element}**: ${issue.issue}\n`
        report += `  - Suggestion: ${issue.suggestion}\n`
        report += `  - WCAG ${issue.wcagLevel}: ${issue.wcagCriterion}\n\n`
      })
    }

    if (warnings.length > 0) {
      report += '## Warnings (Should Fix)\n\n'
      warnings.forEach(issue => {
        report += `- **${issue.element}**: ${issue.issue}\n`
        report += `  - Suggestion: ${issue.suggestion}\n`
        report += `  - WCAG ${issue.wcagLevel}: ${issue.wcagCriterion}\n\n`
      })
    }

    if (info.length > 0) {
      report += '## Info (Consider Fixing)\n\n'
      info.forEach(issue => {
        report += `- **${issue.element}**: ${issue.issue}\n`
        report += `  - Suggestion: ${issue.suggestion}\n`
        report += `  - WCAG ${issue.wcagLevel}: ${issue.wcagCriterion}\n\n`
      })
    }

    return report
  }
}

// Export singleton instance
export const accessibilityTester = new AccessibilityTester()

// Development helper function
export const runAccessibilityTest = (): void => {
  if (process.env.NODE_ENV === 'development') {
    const issues = accessibilityTester.runTests()
    const errors = issues.filter(i => i.type === 'error')
    const warnings = issues.filter(i => i.type === 'warning')
    
    if (errors.length > 0) {
      console.error('🚨 Accessibility Errors Found:', errors)
    }
    
    if (warnings.length > 0) {
      console.warn('⚠️ Accessibility Warnings Found:', warnings)
    }
    
    if (errors.length === 0 && warnings.length === 0) {
      console.log('✅ No critical accessibility issues found')
    }
    
    console.log('📊 Full Report:', accessibilityTester.generateReport())
  }
}