'use client'

import { useState, useCallback } from 'react'

interface AsyncState<T> {
  data: T | null
  loading: boolean
  error: Error | null
  retryCount: number
}

interface UseAsyncOperationOptions {
  maxRetries?: number
  retryDelay?: number
  onError?: (error: Error) => void
  onSuccess?: (data: any) => void
}

export function useAsyncOperation<T>(
  asyncFunction: (...args: any[]) => Promise<T>,
  options: UseAsyncOperationOptions = {}
) {
  const { maxRetries = 3, retryDelay = 1000, onError, onSuccess } = options

  const [state, setState] = useState<AsyncState<T>>({
    data: null,
    loading: false,
    error: null,
    retryCount: 0
  })

  const execute = useCallback(async (...args: any[]) => {
    setState(prev => ({ ...prev, loading: true, error: null }))

    const attemptOperation = async (attempt: number): Promise<void> => {
      try {
        const result = await asyncFunction(...args)
        setState({
          data: result,
          loading: false,
          error: null,
          retryCount: 0
        })
        
        if (onSuccess) {
          onSuccess(result)
        }
      } catch (error) {
        const err = error instanceof Error ? error : new Error('Unknown error occurred')
        
        if (attempt < maxRetries) {
          setState(prev => ({ 
            ...prev, 
            retryCount: attempt,
            error: err
          }))
          
          // Wait before retrying
          await new Promise(resolve => setTimeout(resolve, retryDelay * attempt))
          return attemptOperation(attempt + 1)
        } else {
          setState({
            data: null,
            loading: false,
            error: err,
            retryCount: attempt
          })
          
          if (onError) {
            onError(err)
          }
        }
      }
    }

    await attemptOperation(1)
  }, [asyncFunction, maxRetries, retryDelay, onError, onSuccess])

  const retry = useCallback(() => {
    if (state.retryCount < maxRetries) {
      execute()
    }
  }, [execute, state.retryCount, maxRetries])

  const reset = useCallback(() => {
    setState({
      data: null,
      loading: false,
      error: null,
      retryCount: 0
    })
  }, [])

  return {
    ...state,
    execute,
    retry,
    reset,
    canRetry: state.retryCount < maxRetries
  }
}