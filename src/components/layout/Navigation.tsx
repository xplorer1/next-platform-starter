'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { MockAuthService } from '@/lib/auth'
import { 
  Bars3Icon, 
  XMarkIcon, 
  UserCircleIcon,
  BriefcaseIcon,
  BuildingOfficeIcon,
  Cog6ToothIcon,
  ArrowRightStartOnRectangleIcon,
  ChevronDownIcon
} from '@heroicons/react/24/outline'
import { motion, AnimatePresence } from 'framer-motion'
import { AnimatedButton } from '@/components/animations/InteractiveElements'
import { a11y } from '@/lib/accessibility'

export function Navigation() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const router = useRouter()
  const currentUser = MockAuthService.getCurrentUser()
  const mobileMenuRef = useRef<HTMLDivElement>(null)
  const userMenuRef = useRef<HTMLDivElement>(null)
  const mobileMenuButtonRef = useRef<HTMLButtonElement>(null)
  const userMenuButtonRef = useRef<HTMLButtonElement>(null)

  // Handle escape key and outside clicks for menus
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (mobileMenuOpen) {
          setMobileMenuOpen(false)
          mobileMenuButtonRef.current?.focus()
        }
        if (userMenuOpen) {
          setUserMenuOpen(false)
          userMenuButtonRef.current?.focus()
        }
      }
    }

    const handleClickOutside = (e: MouseEvent) => {
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(e.target as Node) && 
          !mobileMenuButtonRef.current?.contains(e.target as Node)) {
        setMobileMenuOpen(false)
      }
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node) && 
          !userMenuButtonRef.current?.contains(e.target as Node)) {
        setUserMenuOpen(false)
      }
    }

    document.addEventListener('keydown', handleEscape)
    document.addEventListener('mousedown', handleClickOutside)

    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [mobileMenuOpen, userMenuOpen])

  // Trap focus in mobile menu when open
  useEffect(() => {
    if (mobileMenuOpen && mobileMenuRef.current) {
      const cleanup = a11y.focus.trapFocus(mobileMenuRef.current)
      return cleanup
    }
    return undefined
  }, [mobileMenuOpen])

  // Announce menu state changes to screen readers
  useEffect(() => {
    if (mobileMenuOpen) {
      a11y.screenReader.announce('Mobile menu opened', 'polite')
    } else {
      a11y.screenReader.announce('Mobile menu closed', 'polite')
    }
  }, [mobileMenuOpen])

  const handleLogout = () => {
    MockAuthService.logout()
    router.push('/')
    setUserMenuOpen(false)
    a11y.screenReader.announce('Signed out successfully', 'polite')
  }



  const handleMobileMenuToggle = () => {
    setMobileMenuOpen(!mobileMenuOpen)
  }

  const handleUserMenuToggle = () => {
    setUserMenuOpen(!userMenuOpen)
  }

  const getNavigationItems = () => {
    if (!currentUser) {
      return [
        { name: 'Jobs', href: '/jobs', icon: BriefcaseIcon },
        { name: 'Companies', href: '/companies', icon: BuildingOfficeIcon },
      ]
    }

    const baseItems = [
      { name: 'Jobs', href: '/jobs', icon: BriefcaseIcon },
      { name: 'Companies', href: '/companies', icon: BuildingOfficeIcon },
    ]

    switch (currentUser.role) {
      case 'USER':
        return [
          ...baseItems,
          { name: 'My Applications', href: '/applications', icon: UserCircleIcon },
          { name: 'Profile', href: '/profile', icon: UserCircleIcon },
        ]
      case 'CAREER_OFFICER':
        return [
          ...baseItems,
          { name: 'Manage Jobs', href: '/manage/jobs', icon: BriefcaseIcon },
          { name: 'Manage Companies', href: '/manage/companies', icon: BuildingOfficeIcon },
        ]
      case 'ADMIN':
        return [
          ...baseItems,
          { name: 'User Management', href: '/admin/users', icon: UserCircleIcon },
          { name: 'System Settings', href: '/admin/settings', icon: Cog6ToothIcon },
        ]
      default:
        return baseItems
    }
  }

  const navigationItems = getNavigationItems()

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200" role="navigation" aria-label="Main navigation">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo and primary navigation */}
          <div className="flex">
            {/* Logo */}
            <div className="flex-shrink-0 flex items-center">
              <Link href="/" className="flex items-center space-x-2">
                <motion.div 
                  className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center"
                  whileHover={{ scale: 1.05, rotate: 5 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 17 }}
                >
                  <span className="text-white font-bold text-sm">CMU</span>
                </motion.div>
                <motion.div 
                  className="hidden sm:block"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <span className="text-xl font-bold text-gray-900">JobPlat</span>
                  <span className="text-sm text-gray-600 ml-2">Job Board</span>
                </motion.div>
              </Link>
            </div>

            {/* Desktop navigation */}
            <div className="hidden md:ml-8 md:flex md:space-x-8" role="menubar">
              {navigationItems.map((item, index) => {
                const Icon = item.icon
                return (
                  <motion.div
                    key={item.name}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Link
                      href={item.href}
                      className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 hover:text-red-600 border-b-2 border-transparent hover:border-red-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-inset rounded-sm h-16"
                      role="menuitem"
                      aria-label={`Navigate to ${item.name}`}
                    >
                      <motion.div
                        whileHover={a11y.animation.prefersReducedMotion() ? {} : { scale: 1.1 }}
                        transition={{ type: 'spring', stiffness: 400, damping: 17 }}
                      >
                        <Icon className="w-4 h-4 mr-2" aria-hidden="true" />
                      </motion.div>
                      {item.name}
                    </Link>
                  </motion.div>
                )
              })}
            </div>
          </div>

          {/* User menu and mobile menu button */}
          <div className="flex items-center space-x-4">
            {/* User menu */}
            {currentUser ? (
              <div className="relative">
                <button
                  ref={userMenuButtonRef}
                  onClick={handleUserMenuToggle}
                  className="flex items-center space-x-2 text-sm text-gray-700 hover:text-red-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 rounded-sm min-h-[44px] px-2"
                  aria-expanded={userMenuOpen}
                  aria-haspopup="true"
                  aria-label={`User menu for ${currentUser.name}`}
                >
                  <UserCircleIcon className="w-6 h-6" aria-hidden="true" />
                  <span className="hidden md:block">{currentUser.name}</span>
                  <ChevronDownIcon 
                    className={`w-4 h-4 transition-transform duration-200 ${userMenuOpen ? 'rotate-180' : ''}`}
                    aria-hidden="true"
                  />
                </button>

                <AnimatePresence>
                  {userMenuOpen && (
                    <motion.div 
                      ref={userMenuRef}
                      className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200"
                      initial={a11y.animation.getAccessibleAnimationProps({ opacity: 0, scale: 0.95, y: -10 }).initial}
                      animate={a11y.animation.getAccessibleAnimationProps({ opacity: 1, scale: 1, y: 0 }).animate}
                      exit={a11y.animation.getAccessibleAnimationProps({ opacity: 0, scale: 0.95, y: -10 }).exit}
                      transition={{ duration: a11y.animation.getAnimationDuration(0.15) }}
                      role="menu"
                      aria-labelledby="user-menu-button"
                    >
                      <div className="px-4 py-2 text-xs text-gray-500 border-b border-gray-100" role="presentation">
                        {currentUser.email}
                      </div>
                      <Link
                        href="/profile"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 focus:outline-none focus:bg-gray-50 min-h-[44px] flex items-center"
                        onClick={() => setUserMenuOpen(false)}
                        role="menuitem"
                      >
                        Profile Settings
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 flex items-center hover:bg-gray-50 focus:outline-none focus:bg-gray-50 min-h-[44px]"
                        role="menuitem"
                      >
                        <ArrowRightStartOnRectangleIcon className="w-4 h-4 mr-2" aria-hidden="true" />
                        Sign Out
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <AnimatedButton variant="primary" size="sm">
                <Link href="/auth/login">
                  Sign In
                </Link>
              </AnimatedButton>
            )}

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                ref={mobileMenuButtonRef}
                onClick={handleMobileMenuToggle}
                className="text-gray-700 hover:text-red-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 rounded-sm p-2 min-h-[44px] min-w-[44px] flex items-center justify-center"
                aria-expanded={mobileMenuOpen}
                aria-controls="mobile-menu"
                aria-label={mobileMenuOpen ? 'Close mobile menu' : 'Open mobile menu'}
              >
                {mobileMenuOpen ? (
                  <XMarkIcon className="w-6 h-6" aria-hidden="true" />
                ) : (
                  <Bars3Icon className="w-6 h-6" aria-hidden="true" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div 
              ref={mobileMenuRef}
              id="mobile-menu"
              className="md:hidden border-t border-gray-200 py-4"
              initial={a11y.animation.getAccessibleAnimationProps({ opacity: 0, height: 0 }).initial}
              animate={a11y.animation.getAccessibleAnimationProps({ opacity: 1, height: 'auto' }).animate}
              exit={a11y.animation.getAccessibleAnimationProps({ opacity: 0, height: 0 }).exit}
              transition={{ duration: a11y.animation.getAnimationDuration(0.2) }}
              role="menu"
              aria-labelledby="mobile-menu-button"
            >
              <div className="space-y-1" role="none">
                {navigationItems.map((item, index) => {
                  const Icon = item.icon
                  return (
                    <motion.div
                      key={item.name}
                      initial={a11y.animation.getAccessibleAnimationProps({ opacity: 0, x: -20 }).initial}
                      animate={a11y.animation.getAccessibleAnimationProps({ opacity: 1, x: 0 }).animate}
                      transition={{ delay: a11y.animation.getAnimationDuration(index * 0.1) }}
                    >
                      <Link
                        href={item.href}
                        className="flex items-center px-4 py-3 text-base font-medium text-gray-700 hover:text-red-600 hover:bg-gray-50 transition-colors duration-200 focus:outline-none focus:bg-gray-50 focus:text-red-600 min-h-[44px] touch-target"
                        onClick={() => setMobileMenuOpen(false)}
                        role="menuitem"
                        aria-label={`Navigate to ${item.name}`}
                      >
                        <Icon className="w-5 h-5 mr-3" aria-hidden="true" />
                        {item.name}
                      </Link>
                    </motion.div>
                  )
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  )
}