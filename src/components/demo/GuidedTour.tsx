'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  XMarkIcon, 
  ChevronLeftIcon, 
  ChevronRightIcon,
  PlayIcon,
  InformationCircleIcon,
  SparklesIcon,
  EyeIcon
} from '@heroicons/react/24/outline'
import { useDemoMode } from './DemoModeProvider'

interface TourStep {
  id: string
  title: string
  description: string
  target: string
  position: 'top' | 'bottom' | 'left' | 'right'
  action?: () => void
  highlight?: boolean
}

interface TourScenario {
  id: string
  name: string
  description: string
  steps: TourStep[]
}

const tourScenarios: TourScenario[] = [
  {
    id: 'student-journey',
    name: 'Student Experience',
    description: 'Discover how students search and apply for jobs',
    steps: [
      {
        id: 'welcome',
        title: 'Welcome to JobPlat Job Board',
        description: 'This guided tour will show you how students discover and apply for opportunities.',
        target: 'body',
        position: 'bottom'
      },
      {
        id: 'job-search',
        title: 'Job Search',
        description: 'Students can browse all available job opportunities with powerful filtering options.',
        target: '[data-tour="job-search"]',
        position: 'bottom',
        highlight: true
      },
      {
        id: 'filters',
        title: 'Smart Filtering',
        description: 'Filter jobs by category, location, company, and more to find the perfect match.',
        target: '[data-tour="job-filters"]',
        position: 'right',
        highlight: true
      },
      {
        id: 'job-details',
        title: 'Detailed Job Information',
        description: 'Each job listing provides comprehensive details including requirements and application instructions.',
        target: '[data-tour="job-card"]',
        position: 'top',
        highlight: true
      },
      {
        id: 'application',
        title: 'Easy Application Process',
        description: 'Students can apply directly through the platform with clear application instructions.',
        target: '[data-tour="apply-button"]',
        position: 'top',
        highlight: true
      }
    ]
  },
  {
    id: 'career-officer-journey',
    name: 'Career Officer Experience',
    description: 'Learn how career officers manage jobs and companies',
    steps: [
      {
        id: 'welcome-co',
        title: 'Career Officer Dashboard',
        description: 'Career officers have powerful tools to manage job postings and company relationships.',
        target: 'body',
        position: 'bottom'
      },
      {
        id: 'job-management',
        title: 'Job Management',
        description: 'Create, edit, and manage job postings with comprehensive details.',
        target: '[data-tour="job-management"]',
        position: 'bottom',
        highlight: true
      },
      {
        id: 'company-profiles',
        title: 'Company Profiles',
        description: 'Manage company information and maintain relationships with hiring partners.',
        target: '[data-tour="company-management"]',
        position: 'right',
        highlight: true
      },
      {
        id: 'applications-review',
        title: 'Application Review',
        description: 'Review and manage applications from students for posted positions.',
        target: '[data-tour="applications-review"]',
        position: 'top',
        highlight: true
      }
    ]
  },
  {
    id: 'admin-journey',
    name: 'Admin Experience',
    description: 'Explore administrative capabilities and user management',
    steps: [
      {
        id: 'welcome-admin',
        title: 'System Administration',
        description: 'Admins have comprehensive control over users, content, and platform operations.',
        target: 'body',
        position: 'bottom'
      },
      {
        id: 'user-management',
        title: 'User Management',
        description: 'Create and manage user accounts for students, alumni, and staff.',
        target: '[data-tour="user-management"]',
        position: 'bottom',
        highlight: true
      },
      {
        id: 'analytics',
        title: 'Platform Analytics',
        description: 'Monitor platform usage, job posting performance, and user engagement.',
        target: '[data-tour="analytics"]',
        position: 'right',
        highlight: true
      },
      {
        id: 'system-settings',
        title: 'System Configuration',
        description: 'Configure platform settings and manage system-wide preferences.',
        target: '[data-tour="system-settings"]',
        position: 'top',
        highlight: true
      }
    ]
  }
]

interface GuidedTourProps {
  isOpen: boolean
  onClose: () => void
  scenario?: string
}

export function GuidedTour({ isOpen, onClose, scenario }: GuidedTourProps) {
  const [currentScenario, setCurrentScenario] = useState<TourScenario | null>(null)
  const [currentStepIndex, setCurrentStepIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [highlightedElement, setHighlightedElement] = useState<Element | null>(null)
  const { highlightElement, removeHighlight, setCurrentScenario: setDemoScenario } = useDemoMode()
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  // Initialize scenario
  useEffect(() => {
    if (isOpen && scenario) {
      const foundScenario = tourScenarios.find(s => s.id === scenario)
      if (foundScenario) {
        setCurrentScenario(foundScenario)
        setCurrentStepIndex(0)
        setDemoScenario(foundScenario.name)
      }
    }
  }, [isOpen, scenario, setDemoScenario])

  // Handle step highlighting
  useEffect(() => {
    if (currentScenario && isOpen) {
      const currentStep = currentScenario.steps[currentStepIndex]
      if (currentStep?.highlight && currentStep.target !== 'body') {
        const element = document.querySelector(currentStep.target)
        if (element) {
          setHighlightedElement(element)
          highlightElement(currentStep.target)
          
          // Scroll element into view
          element.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'center',
            inline: 'center'
          })
        }
      }
    }

    return () => {
      if (highlightedElement) {
        removeHighlight(highlightedElement.getAttribute('data-tour') || '')
        setHighlightedElement(null)
      }
    }
  }, [currentStepIndex, currentScenario, isOpen, highlightElement, removeHighlight, highlightedElement])

  // Auto-play functionality
  useEffect(() => {
    if (isPlaying && currentScenario) {
      intervalRef.current = setInterval(() => {
        setCurrentStepIndex(prev => {
          if (prev < currentScenario.steps.length - 1) {
            return prev + 1
          } else {
            setIsPlaying(false)
            return prev
          }
        })
      }, 4000) // 4 seconds per step
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [isPlaying, currentScenario])

  const handleNext = () => {
    if (currentScenario && currentStepIndex < currentScenario.steps.length - 1) {
      setCurrentStepIndex(prev => prev + 1)
    }
  }

  const handlePrevious = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(prev => prev - 1)
    }
  }

  const handleClose = () => {
    setIsPlaying(false)
    setCurrentStepIndex(0)
    setCurrentScenario(null)
    if (highlightedElement) {
      removeHighlight(highlightedElement.getAttribute('data-tour') || '')
      setHighlightedElement(null)
    }
    onClose()
  }

  const toggleAutoPlay = () => {
    setIsPlaying(!isPlaying)
  }

  if (!isOpen || !currentScenario) return null

  const currentStep = currentScenario.steps[currentStepIndex]
  if (!currentStep) return null
  
  const progress = ((currentStepIndex + 1) / currentScenario.steps.length) * 100

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      >
        {/* Tour Overlay */}
        <div className="absolute inset-0" onClick={handleClose} />
        
        {/* Tour Panel */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="relative z-10 w-full max-w-md mx-4"
        >
          <div className="bg-white rounded-lg shadow-xl border border-gray-200">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <div className="flex items-center space-x-2">
                <SparklesIcon className="w-5 h-5 text-blue-600" />
                <h3 className="text-lg font-semibold text-gray-900">
                  {currentScenario.name}
                </h3>
              </div>
              <button
                onClick={handleClose}
                className="text-gray-400 hover:text-gray-600 transition-colors"
                aria-label="Close tour"
              >
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>

            {/* Progress Bar */}
            <div className="px-4 pt-4">
              <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                <span>Step {currentStepIndex + 1} of {currentScenario.steps.length}</span>
                <span>{Math.round(progress)}% complete</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <motion.div
                  className="bg-blue-600 h-2 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            </div>

            {/* Content */}
            <div className="p-4">
              <h4 className="text-xl font-semibold text-gray-900 mb-2">
                {currentStep.title}
              </h4>
              <p className="text-gray-600 mb-4">
                {currentStep.description}
              </p>

              {/* Controls */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <button
                    onClick={handlePrevious}
                    disabled={currentStepIndex === 0}
                    className="flex items-center space-x-1 px-3 py-1.5 text-sm text-gray-600 hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronLeftIcon className="w-4 h-4" />
                    <span>Previous</span>
                  </button>
                  
                  <button
                    onClick={toggleAutoPlay}
                    className={`flex items-center space-x-1 px-3 py-1.5 text-sm rounded transition-colors ${
                      isPlaying 
                        ? 'bg-red-100 text-red-700 hover:bg-red-200' 
                        : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                    }`}
                  >
                    <PlayIcon className="w-4 h-4" />
                    <span>{isPlaying ? 'Pause' : 'Auto Play'}</span>
                  </button>
                </div>

                <button
                  onClick={handleNext}
                  disabled={currentStepIndex === currentScenario.steps.length - 1}
                  className="flex items-center space-x-1 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <span>
                    {currentStepIndex === currentScenario.steps.length - 1 ? 'Finish' : 'Next'}
                  </span>
                  <ChevronRightIcon className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

// Tour Launcher Component
interface TourLauncherProps {
  className?: string
}

export function TourLauncher({ className = '' }: TourLauncherProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedScenario, setSelectedScenario] = useState<string>('')

  const handleLaunchTour = (scenarioId: string) => {
    setSelectedScenario(scenarioId)
    setIsOpen(true)
  }

  return (
    <>
      <div className={`space-y-4 ${className}`}>
        <h3 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
          <EyeIcon className="w-5 h-5" />
          <span>Guided Tours</span>
        </h3>
        
        <div className="grid gap-3">
          {tourScenarios.map((scenario) => (
            <button
              key={scenario.id}
              onClick={() => handleLaunchTour(scenario.id)}
              className="text-left p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors"
            >
              <h4 className="font-medium text-gray-900 mb-1">{scenario.name}</h4>
              <p className="text-sm text-gray-600">{scenario.description}</p>
              <div className="flex items-center justify-between mt-2">
                <span className="text-xs text-gray-500">
                  {scenario.steps.length} steps
                </span>
                <PlayIcon className="w-4 h-4 text-blue-600" />
              </div>
            </button>
          ))}
        </div>
      </div>

      <GuidedTour
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        scenario={selectedScenario}
      />
    </>
  )
}