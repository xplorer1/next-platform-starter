'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { MockAuthService } from '@/lib/auth'
import { useDemoMode } from './DemoModeProvider'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  PlayIcon, 
  PauseIcon, 
  StopIcon, 
  ForwardIcon,
  BackwardIcon,
  SparklesIcon
} from '@heroicons/react/24/outline'

interface DemoStep {
  id: string
  title: string
  description: string
  action: () => Promise<void> | void
  duration?: number
  waitForUser?: boolean
}

interface DemoScenario {
  id: string
  name: string
  description: string
  role: 'student' | 'careerOfficer' | 'admin'
  steps: DemoStep[]
}

const demoScenarios: DemoScenario[] = [
  {
    id: 'student-job-search',
    name: 'Student Job Search Journey',
    description: 'Complete walkthrough of how students discover and apply for jobs',
    role: 'student',
    steps: [
      {
        id: 'switch-role',
        title: 'Switch to Student Role',
        description: 'Switching to student perspective',
        action: () => MockAuthService.switchRole('student'),
        duration: 1000
      },
      {
        id: 'navigate-jobs',
        title: 'Navigate to Jobs Page',
        description: 'Going to the job listings page',
        action: async () => {
          const router = useRouter()
          router.push('/jobs')
        },
        duration: 2000
      },
      {
        id: 'demonstrate-filters',
        title: 'Demonstrate Job Filters',
        description: 'Showing how students can filter job opportunities',
        action: () => {
          // Simulate filter interactions
          const filterElements = document.querySelectorAll('[data-tour="job-filters"] input, [data-tour="job-filters"] select')
          filterElements.forEach((element, index) => {
            setTimeout(() => {
              element.classList.add('demo-highlight')
              setTimeout(() => element.classList.remove('demo-highlight'), 1000)
            }, index * 500)
          })
        },
        duration: 3000
      },
      {
        id: 'view-job-details',
        title: 'View Job Details',
        description: 'Opening a job posting to see detailed information',
        action: () => {
          const firstJobCard = document.querySelector('[data-tour="job-card"]') as HTMLElement
          if (firstJobCard) {
            firstJobCard.click()
          }
        },
        duration: 2000,
        waitForUser: true
      },
      {
        id: 'demonstrate-application',
        title: 'Show Application Process',
        description: 'Demonstrating how students apply for positions',
        action: () => {
          const applyButton = document.querySelector('[data-tour="apply-button"]') as HTMLElement
          if (applyButton) {
            applyButton.scrollIntoView({ behavior: 'smooth', block: 'center' })
            setTimeout(() => {
              applyButton.classList.add('demo-pulse')
              setTimeout(() => applyButton.classList.remove('demo-pulse'), 2000)
            }, 1000)
          }
        },
        duration: 4000
      }
    ]
  },
  {
    id: 'career-officer-management',
    name: 'Career Officer Job Management',
    description: 'How career officers create and manage job postings',
    role: 'careerOfficer',
    steps: [
      {
        id: 'switch-role',
        title: 'Switch to Career Officer Role',
        description: 'Switching to career officer perspective',
        action: () => MockAuthService.switchRole('careerOfficer'),
        duration: 1000
      },
      {
        id: 'navigate-management',
        title: 'Navigate to Job Management',
        description: 'Going to the job management dashboard',
        action: async () => {
          const router = useRouter()
          router.push('/manage/jobs')
        },
        duration: 2000
      },
      {
        id: 'show-job-dashboard',
        title: 'Job Management Dashboard',
        description: 'Overview of job posting management capabilities',
        action: () => {
          const dashboard = document.querySelector('[data-tour="job-management"]')
          if (dashboard) {
            dashboard.scrollIntoView({ behavior: 'smooth', block: 'center' })
          }
        },
        duration: 3000
      },
      {
        id: 'show-company-management',
        title: 'Company Management',
        description: 'How career officers manage company profiles',
        action: () => {
          const companyTab = document.querySelector('button[aria-label*="Companies"]') as HTMLElement
          if (companyTab) {
            companyTab.click()
          }
        },
        duration: 2000,
        waitForUser: true
      },
      {
        id: 'show-applications',
        title: 'Application Review',
        description: 'Reviewing and managing student applications',
        action: () => {
          const applicationsTab = document.querySelector('button[aria-label*="Applications"]') as HTMLElement
          if (applicationsTab) {
            applicationsTab.click()
          }
        },
        duration: 3000,
        waitForUser: true
      }
    ]
  },
  {
    id: 'admin-overview',
    name: 'Admin System Overview',
    description: 'Administrative capabilities and user management',
    role: 'admin',
    steps: [
      {
        id: 'switch-role',
        title: 'Switch to Admin Role',
        description: 'Switching to administrator perspective',
        action: () => MockAuthService.switchRole('admin'),
        duration: 1000
      },
      {
        id: 'navigate-admin',
        title: 'Navigate to Admin Dashboard',
        description: 'Going to the administrative dashboard',
        action: async () => {
          const router = useRouter()
          router.push('/admin/users')
        },
        duration: 2000
      },
      {
        id: 'show-user-management',
        title: 'User Management',
        description: 'Comprehensive user account management',
        action: () => {
          const userManagement = document.querySelector('[data-tour="user-management"]')
          if (userManagement) {
            userManagement.scrollIntoView({ behavior: 'smooth', block: 'center' })
          }
        },
        duration: 3000
      },
      {
        id: 'show-analytics',
        title: 'System Analytics',
        description: 'Platform metrics and insights',
        action: () => {
          const analytics = document.querySelector('[data-tour="analytics"]') as HTMLElement
          if (analytics) {
            analytics.click()
          }
        },
        duration: 3000,
        waitForUser: true
      },
      {
        id: 'show-settings',
        title: 'System Settings',
        description: 'Platform configuration and preferences',
        action: () => {
          const settings = document.querySelector('[data-tour="system-settings"]')
          if (settings) {
            settings.scrollIntoView({ behavior: 'smooth', block: 'center' })
          }
        },
        duration: 2000
      }
    ]
  }
]

interface DemoScenarioRunnerProps {
  isOpen: boolean
  onClose: () => void
}

export function DemoScenarioRunner({ isOpen, onClose }: DemoScenarioRunnerProps) {
  const [selectedScenario, setSelectedScenario] = useState<DemoScenario | null>(null)
  const [currentStepIndex, setCurrentStepIndex] = useState(0)
  const [isRunning, setIsRunning] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const router = useRouter()
  const { setCurrentScenario } = useDemoMode()

  const runScenario = async (scenario: DemoScenario) => {
    setSelectedScenario(scenario)
    setCurrentStepIndex(0)
    setIsRunning(true)
    setIsPaused(false)
    setCurrentScenario(scenario.name)

    for (let i = 0; i < scenario.steps.length; i++) {
      if (!isRunning) break
      
      setCurrentStepIndex(i)
      const step = scenario.steps[i]
      
      try {
        if (step) {
          await step.action()
        }
        
        if (step && step.waitForUser) {
          setIsPaused(true)
          // Wait for user to continue
          await new Promise(resolve => {
            const continueHandler = () => {
              setIsPaused(false)
              resolve(void 0)
            }
            // Add event listener for continue button
            document.addEventListener('demo-continue', continueHandler, { once: true })
          })
        } else if (step && step.duration) {
          await new Promise(resolve => setTimeout(resolve, step.duration))
        }
      } catch (error) {
        console.error('Demo step failed:', error)
      }
    }

    setIsRunning(false)
    setSelectedScenario(null)
    setCurrentScenario(null)
  }

  const stopScenario = () => {
    setIsRunning(false)
    setIsPaused(false)
    setSelectedScenario(null)
    setCurrentScenario(null)
  }

  const continueScenario = () => {
    document.dispatchEvent(new CustomEvent('demo-continue'))
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <SparklesIcon className="w-6 h-6 text-blue-600" />
              <h2 className="text-xl font-semibold text-gray-900">
                Demo Scenario Runner
              </h2>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <StopIcon className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6">
            {!selectedScenario ? (
              <div className="space-y-6">
                <p className="text-gray-600">
                  Choose a demo scenario to run an automated walkthrough of the platform features.
                </p>
                
                <div className="grid gap-4">
                  {demoScenarios.map((scenario) => (
                    <button
                      key={scenario.id}
                      onClick={() => runScenario(scenario)}
                      className="text-left p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors"
                    >
                      <h3 className="font-medium text-gray-900 mb-1">
                        {scenario.name}
                      </h3>
                      <p className="text-sm text-gray-600 mb-2">
                        {scenario.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500 capitalize">
                          {scenario.role} perspective • {scenario.steps.length} steps
                        </span>
                        <PlayIcon className="w-4 h-4 text-blue-600" />
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Scenario Info */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    {selectedScenario.name}
                  </h3>
                  <p className="text-gray-600">{selectedScenario.description}</p>
                </div>

                {/* Progress */}
                <div>
                  <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                    <span>Step {currentStepIndex + 1} of {selectedScenario.steps.length}</span>
                    <span>{Math.round(((currentStepIndex + 1) / selectedScenario.steps.length) * 100)}% complete</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <motion.div
                      className="bg-blue-600 h-2 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${((currentStepIndex + 1) / selectedScenario.steps.length) * 100}%` }}
                      transition={{ duration: 0.3 }}
                    />
                  </div>
                </div>

                {/* Current Step */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-1">
                    {selectedScenario.steps[currentStepIndex]?.title}
                  </h4>
                  <p className="text-sm text-gray-600">
                    {selectedScenario.steps[currentStepIndex]?.description}
                  </p>
                </div>

                {/* Controls */}
                <div className="flex items-center justify-between">
                  <button
                    onClick={stopScenario}
                    className="flex items-center space-x-2 px-4 py-2 text-red-600 hover:text-red-700 transition-colors"
                  >
                    <StopIcon className="w-4 h-4" />
                    <span>Stop Demo</span>
                  </button>

                  {isPaused && (
                    <button
                      onClick={continueScenario}
                      className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                    >
                      <PlayIcon className="w-4 h-4" />
                      <span>Continue</span>
                    </button>
                  )}

                  {isRunning && !isPaused && (
                    <div className="flex items-center space-x-2 text-blue-600">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                      <span className="text-sm">Running...</span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}