'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useDemoMode } from './DemoModeProvider'

interface DemoHighlightProps {
  targetSelector: string
  isActive: boolean
  onComplete?: () => void
}

export function DemoHighlight({ targetSelector, isActive, onComplete }: DemoHighlightProps) {
  const [targetElement, setTargetElement] = useState<Element | null>(null)
  const [position, setPosition] = useState({ top: 0, left: 0, width: 0, height: 0 })

  useEffect(() => {
    if (isActive && targetSelector) {
      const element = document.querySelector(targetSelector)
      if (element) {
        setTargetElement(element)
        
        const updatePosition = () => {
          const rect = element.getBoundingClientRect()
          setPosition({
            top: rect.top + window.scrollY,
            left: rect.left + window.scrollX,
            width: rect.width,
            height: rect.height
          })
        }

        updatePosition()
        
        // Update position on scroll and resize
        const handleUpdate = () => updatePosition()
        window.addEventListener('scroll', handleUpdate)
        window.addEventListener('resize', handleUpdate)
        
        // Add highlight class to element
        element.classList.add('demo-highlight-target')
        
        return () => {
          window.removeEventListener('scroll', handleUpdate)
          window.removeEventListener('resize', handleUpdate)
          element.classList.remove('demo-highlight-target')
        }
      }
    }
    
    return undefined
  }, [isActive, targetSelector])

  if (!isActive || !targetElement) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-40 pointer-events-none"
        style={{ zIndex: 9999 }}
      >
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/50" />
        
        {/* Highlight Box */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          className="absolute border-4 border-blue-500 rounded-lg shadow-lg"
          style={{
            top: position.top - 8,
            left: position.left - 8,
            width: position.width + 16,
            height: position.height + 16,
          }}
        >
          {/* Pulsing effect */}
          <motion.div
            className="absolute inset-0 border-4 border-blue-400 rounded-lg"
            animate={{
              scale: [1, 1.1, 1],
              opacity: [0.5, 0.8, 0.5]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          
          {/* Spotlight effect */}
          <div 
            className="absolute bg-white/10 rounded-lg"
            style={{
              top: 8,
              left: 8,
              width: position.width,
              height: position.height,
            }}
          />
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

// Global CSS for highlighted elements
export const demoHighlightStyles = `
  .demo-highlight-target {
    position: relative;
    z-index: 10000 !important;
  }
`