'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { MockAuthService, demoAccounts } from '@/lib/auth'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  UserIcon, 
  AcademicCapIcon, 
  BriefcaseIcon, 
  Cog6ToothIcon,
  ChevronDownIcon,
  CheckIcon
} from '@heroicons/react/24/outline'
import { useDemoMode } from './DemoModeProvider'

interface RoleOption {
  key: keyof typeof demoAccounts
  label: string
  description: string
  icon: React.ComponentType<{ className?: string }>
  color: string
  features: string[]
}

const roleOptions: RoleOption[] = [
  {
    key: 'student',
    label: 'Student',
    description: 'Current JobPlat student',
    icon: AcademicCapIcon,
    color: 'blue',
    features: ['Job search', 'Application tracking', 'Profile management']
  },
  {
    key: 'alumni',
    label: 'Alumni',
    description: 'JobPlat graduate',
    icon: UserIcon,
    color: 'green',
    features: ['Advanced job search', 'Career networking', 'Alumni resources']
  },
  {
    key: 'careerOfficer',
    label: 'Career Officer',
    description: 'Staff managing job postings',
    icon: BriefcaseIcon,
    color: 'purple',
    features: ['Job posting management', 'Company relations', 'Application review']
  },
  {
    key: 'admin',
    label: 'Admin',
    description: 'System administrator',
    icon: Cog6ToothIcon,
    color: 'gray',
    features: ['User management', 'System analytics', 'Platform administration']
  }
]

interface RoleSwitcherProps {
  variant?: 'compact' | 'expanded'
  showFeatures?: boolean
  onRoleChange?: (role: string) => void
}

export function RoleSwitcher({ 
  variant = 'compact', 
  showFeatures = false,
  onRoleChange 
}: RoleSwitcherProps) {
  const [isOpen, setIsOpen] = useState(false)
  const router = useRouter()
  const currentUser = MockAuthService.getCurrentUser()
  const { isDemoMode, setCurrentScenario } = useDemoMode()

  const getCurrentRole = () => {
    if (!currentUser) return null
    return roleOptions.find(role => {
      const account = demoAccounts[role.key]
      return account && account.id === currentUser.id
    })
  }

  const handleRoleSwitch = (roleKey: keyof typeof demoAccounts) => {
    try {
      MockAuthService.switchRole(roleKey)
      const role = roleOptions.find(r => r.key === roleKey)
      
      if (isDemoMode && role) {
        setCurrentScenario(`${role.label} Demo Scenario`)
      }
      
      setIsOpen(false)
      router.refresh()
      
      if (onRoleChange) {
        onRoleChange(role?.label || roleKey)
      }
    } catch (error) {
      console.error('Failed to switch role:', error)
    }
  }

  const currentRole = getCurrentRole()

  if (variant === 'compact') {
    return (
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center space-x-2 px-3 py-2 text-sm bg-gray-100 hover:bg-gray-200 border border-gray-300 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          aria-expanded={isOpen}
          aria-haspopup="true"
          aria-label="Switch demo role"
        >
          {currentRole && (
            <>
              <currentRole.icon className="w-4 h-4" />
              <span>{currentRole.label}</span>
            </>
          )}
          <ChevronDownIcon 
            className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          />
        </button>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -10 }}
              className="absolute top-full mt-2 right-0 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50"
            >
              {roleOptions.map((role) => {
                const Icon = role.icon
                const isActive = currentRole?.key === role.key
                
                return (
                  <button
                    key={role.key}
                    onClick={() => handleRoleSwitch(role.key)}
                    className={`w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors flex items-center space-x-3 ${
                      isActive ? 'bg-blue-50 text-blue-700' : 'text-gray-700'
                    }`}
                  >
                    <Icon className={`w-5 h-5 ${isActive ? 'text-blue-600' : 'text-gray-400'}`} />
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <span className="font-medium">{role.label}</span>
                        {isActive && <CheckIcon className="w-4 h-4 text-blue-600" />}
                      </div>
                      <p className="text-xs text-gray-500 mt-0.5">{role.description}</p>
                    </div>
                  </button>
                )
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    )
  }

  // Expanded variant
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900">Demo Roles</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {roleOptions.map((role) => {
          const Icon = role.icon
          const isActive = currentRole?.key === role.key
          
          return (
            <motion.button
              key={role.key}
              onClick={() => handleRoleSwitch(role.key)}
              className={`p-4 rounded-lg border-2 transition-all text-left ${
                isActive 
                  ? 'border-blue-500 bg-blue-50' 
                  : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex items-start space-x-3">
                <div className={`p-2 rounded-lg ${
                  isActive ? 'bg-blue-100' : 'bg-gray-100'
                }`}>
                  <Icon className={`w-6 h-6 ${
                    isActive ? 'text-blue-600' : 'text-gray-600'
                  }`} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <h4 className={`font-semibold ${
                      isActive ? 'text-blue-900' : 'text-gray-900'
                    }`}>
                      {role.label}
                    </h4>
                    {isActive && <CheckIcon className="w-5 h-5 text-blue-600" />}
                  </div>
                  <p className={`text-sm mt-1 ${
                    isActive ? 'text-blue-700' : 'text-gray-600'
                  }`}>
                    {role.description}
                  </p>
                  {showFeatures && (
                    <ul className={`text-xs mt-2 space-y-1 ${
                      isActive ? 'text-blue-600' : 'text-gray-500'
                    }`}>
                      {role.features.map((feature, index) => (
                        <li key={index} className="flex items-center space-x-1">
                          <span className="w-1 h-1 bg-current rounded-full"></span>
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </motion.button>
          )
        })}
      </div>
    </div>
  )
}