'use client'

import { ReactNode } from 'react'
import { Navigation } from './Navigation'
import { Footer } from './Footer'
import { Sidebar } from './Sidebar'
import { PageTransition } from '@/components/animations/PageTransition'
import { SkipLinks } from '@/components/accessibility/SkipLink'
import { GlobalLiveRegion } from '@/components/accessibility/LiveRegion'
import { DemoModeProvider } from '@/components/demo/DemoModeProvider'

interface AppShellProps {
  children: ReactNode
  showSidebar?: boolean
  sidebarContent?: ReactNode
}

export function AppShell({ children, showSidebar = false, sidebarContent }: AppShellProps) {

  return (
    <DemoModeProvider>
      <div className="min-h-screen bg-gray-50 flex flex-col safe-area-padding">
        {/* Skip Links for Keyboard Navigation */}
        <SkipLinks />
        
        {/* Global Live Region for Screen Reader Announcements */}
        <GlobalLiveRegion />
        
        {/* Navigation */}
        <Navigation />
        
        {/* Main Content Area */}
        <div className="flex-1 flex">
          {/* Sidebar */}
          {showSidebar && (
            <Sidebar>
              {sidebarContent}
            </Sidebar>
          )}
          
          {/* Main Content */}
          <main 
            id="main-content"
            className={`flex-1 ${showSidebar ? 'lg:ml-64' : ''}`}
            role="main"
            aria-label="Main content"
            tabIndex={-1}
          >
            <PageTransition className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
              {children}
            </PageTransition>
          </main>
        </div>
        
        {/* Footer */}
        <Footer />
      </div>
    </DemoModeProvider>
  )
}