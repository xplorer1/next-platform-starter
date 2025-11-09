'use client'

interface SkipLinkProps {
  href: string
  children: React.ReactNode
}

/**
 * Skip link component for keyboard navigation accessibility
 * Allows users to skip to main content or other important sections
 */
export function SkipLink({ href, children }: SkipLinkProps) {
  return (
    <a
      href={href}
      className="skip-link"
      onClick={(e) => {
        e.preventDefault()
        const target = document.querySelector(href)
        if (target) {
          target.scrollIntoView({ behavior: 'smooth' })
          // Focus the target element if it's focusable
          if (target instanceof HTMLElement) {
            target.focus()
          }
        }
      }}
    >
      {children}
    </a>
  )
}

/**
 * Skip links container component
 */
export function SkipLinks() {
  return (
    <>
      <SkipLink href="#main-content">
        Skip to main content
      </SkipLink>
    </>
  )
}