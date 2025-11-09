'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  PresentationChartBarIcon, 
  XMarkIcon, 
  PlayIcon, 
  PauseIcon,
  ForwardIcon,
  BackwardIcon
} from '@heroicons/react/24/outline'

interface DemoModeContextType {
  isDemoMode: boolean
  isPresenting: boolean
  currentScenario: string | null
  highlightedElements: Set<string>
  toggleDemoMode: () => void
  startPresentation: () => void
  stopPresentation: () => void
  setCurrentScenario: (scenario: string | null) => void
  highlightElement: (elementId: string) => void
  removeHighlight: (elementId: string) => void
  clearHighlights: () => void
}

const DemoModeContext = createContext<DemoModeContextType | undefined>(undefined)

export function useDemoMode() {
  const context = useContext(DemoModeContext)
  if (context === undefined) {
    throw new Error('useDemoMode must be used within a DemoModeProvider')
  }
  return context
}

interface DemoModeProviderProps {
  children: ReactNode
}

export function DemoModeProvider({ children }: DemoModeProviderProps) {
  const [isDemoMode, setIsDemoMode] = useState(false)
  const [isPresenting, setIsPresenting] = useState(false)
  const [currentScenario, setCurrentScenario] = useState<string | null>(null)
  const [highlightedElements, setHighlightedElements] = useState<Set<string>>(new Set())

  // Initialize demo mode from localStorage
  useEffect(() => {
    const stored = localStorage.getItem('cmu-job-board-demo-mode')
    if (stored === 'true') {
      setIsDemoMode(true)
    }
  }, [])

  // Persist demo mode state
  useEffect(() => {
    localStorage.setItem('cmu-job-board-demo-mode', isDemoMode.toString())
  }, [isDemoMode])

  const toggleDemoMode = () => {
    setIsDemoMode(!isDemoMode)
    if (!isDemoMode) {
      // Entering demo mode
      setCurrentScenario(null)
      clearHighlights()
    } else {
      // Exiting demo mode
      stopPresentation()
      setCurrentScenario(null)
      clearHighlights()
    }
  }

  const startPresentation = () => {
    setIsPresenting(true)
    setIsDemoMode(true)
  }

  const stopPresentation = () => {
    setIsPresenting(false)
    setCurrentScenario(null)
    clearHighlights()
  }

  const highlightElement = (elementId: string) => {
    setHighlightedElements(prev => new Set(prev).add(elementId))
  }

  const removeHighlight = (elementId: string) => {
    setHighlightedElements(prev => {
      const newSet = new Set(prev)
      newSet.delete(elementId)
      return newSet
    })
  }

  const clearHighlights = () => {
    setHighlightedElements(new Set())
  }

  const value: DemoModeContextType = {
    isDemoMode,
    isPresenting,
    currentScenario,
    highlightedElements,
    toggleDemoMode,
    startPresentation,
    stopPresentation,
    setCurrentScenario,
    highlightElement,
    removeHighlight,
    clearHighlights
  }

  return (
    <DemoModeContext.Provider value={value}>
      {children}
      <DemoModeControls />
    </DemoModeContext.Provider>
  )
}

function DemoModeControls() {
  const {
    isDemoMode,
    isPresenting,
    currentScenario,
    toggleDemoMode,
    startPresentation,
    stopPresentation
  } = useDemoMode()

  if (!isDemoMode && !isPresenting) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 100 }}
        className="fixed bottom-4 right-4 z-50"
      >
        <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-4 min-w-[280px]">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <PresentationChartBarIcon className="w-5 h-5 text-blue-600" />
              <span className="text-sm font-medium text-gray-900">
                {isPresenting ? 'Presentation Mode' : 'Demo Mode'}
              </span>
            </div>
            <button
              onClick={toggleDemoMode}
              className="text-gray-400 hover:text-gray-600 transition-colors"
              aria-label="Close demo mode"
            >
              <XMarkIcon className="w-4 h-4" />
            </button>
          </div>

          {currentScenario && (
            <div className="mb-3 p-2 bg-blue-50 rounded text-xs text-blue-800">
              Current: {currentScenario}
            </div>
          )}

          <div className="flex items-center space-x-2">
            {!isPresenting ? (
              <button
                onClick={startPresentation}
                className="flex items-center space-x-1 px-3 py-1.5 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 transition-colors"
              >
                <PlayIcon className="w-4 h-4" />
                <span>Start Presentation</span>
              </button>
            ) : (
              <>
                <button
                  onClick={stopPresentation}
                  className="flex items-center space-x-1 px-3 py-1.5 bg-red-600 text-white rounded text-sm hover:bg-red-700 transition-colors"
                >
                  <PauseIcon className="w-4 h-4" />
                  <span>Stop</span>
                </button>
                <div className="flex items-center space-x-1">
                  <button className="p-1.5 text-gray-600 hover:text-gray-800 transition-colors">
                    <BackwardIcon className="w-4 h-4" />
                  </button>
                  <button className="p-1.5 text-gray-600 hover:text-gray-800 transition-colors">
                    <ForwardIcon className="w-4 h-4" />
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}