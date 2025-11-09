// Enhanced error handling utilities

export interface AppError extends Error {
  code?: string
  statusCode?: number
  details?: unknown
  timestamp?: string
  retryable?: boolean
}

export class NetworkError extends Error implements AppError {
  code = 'NETWORK_ERROR'
  statusCode = 0
  retryable = true
  timestamp = new Date().toISOString()

  constructor(message: string, public details?: unknown) {
    super(message)
    this.name = 'NetworkError'
  }
}

export class ValidationError extends Error implements AppError {
  code = 'VALIDATION_ERROR'
  statusCode = 400
  retryable = false
  timestamp = new Date().toISOString()

  constructor(message: string, public details?: unknown) {
    super(message)
    this.name = 'ValidationError'
  }
}

export class AuthenticationError extends Error implements AppError {
  code = 'AUTHENTICATION_ERROR'
  statusCode = 401
  retryable = false
  timestamp = new Date().toISOString()

  constructor(message: string = 'Authentication required', public details?: unknown) {
    super(message)
    this.name = 'AuthenticationError'
  }
}

export class AuthorizationError extends Error implements AppError {
  code = 'AUTHORIZATION_ERROR'
  statusCode = 403
  retryable = false
  timestamp = new Date().toISOString()

  constructor(message: string = 'Access denied', public details?: unknown) {
    super(message)
    this.name = 'AuthorizationError'
  }
}

export class NotFoundError extends Error implements AppError {
  code = 'NOT_FOUND_ERROR'
  statusCode = 404
  retryable = false
  timestamp = new Date().toISOString()

  constructor(message: string, public details?: unknown) {
    super(message)
    this.name = 'NotFoundError'
  }
}

export class ServerError extends Error implements AppError {
  code = 'SERVER_ERROR'
  statusCode = 500
  retryable = true
  timestamp = new Date().toISOString()

  constructor(message: string = 'Internal server error', public details?: unknown) {
    super(message)
    this.name = 'ServerError'
  }
}

// Error classification utility
export function classifyError(error: unknown): AppError {
  if (error && typeof error === 'object' && 'code' in error && 'timestamp' in error) {
    return error as AppError
  }

  if (error instanceof Error) {
    // Network errors
    if (error.message.includes('fetch') || error.message.includes('network')) {
      return new NetworkError(error.message, error)
    }

    // Timeout errors
    if (error.message.includes('timeout')) {
      return new NetworkError('Request timed out. Please try again.', error)
    }

    // Generic error
    return {
      ...error,
      code: 'UNKNOWN_ERROR',
      statusCode: 500,
      retryable: false,
      timestamp: new Date().toISOString()
    } as AppError
  }

  // Unknown error type
  return new ServerError('An unexpected error occurred', error) as AppError
}

// User-friendly error messages
export function getErrorMessage(error: AppError): string {
  switch (error.code) {
    case 'NETWORK_ERROR':
      return 'Unable to connect. Please check your internet connection and try again.'
    case 'VALIDATION_ERROR':
      return error.message || 'Please check your input and try again.'
    case 'AUTHENTICATION_ERROR':
      return 'Please sign in to continue.'
    case 'AUTHORIZATION_ERROR':
      return 'You don\'t have permission to perform this action.'
    case 'NOT_FOUND_ERROR':
      return error.message || 'The requested resource was not found.'
    case 'SERVER_ERROR':
      return 'Something went wrong on our end. Please try again later.'
    default:
      return error.message || 'An unexpected error occurred.'
  }
}

// Error logging utility (for production use)
export function logError(error: AppError, context?: Record<string, unknown>) {
  const errorLog = {
    message: error.message,
    code: error.code,
    statusCode: error.statusCode,
    timestamp: error.timestamp,
    stack: error.stack,
    details: error.details,
    context,
    userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : undefined,
    url: typeof window !== 'undefined' ? window.location.href : undefined
  }

  // In development, log to console
  if (process.env.NODE_ENV === 'development') {
    console.error('Error logged:', errorLog)
  }

  // In production, send to error reporting service
  // Example: Sentry.captureException(error, { extra: errorLog })
}

// Retry logic utility
export async function withRetry<T>(
  operation: () => Promise<T>,
  maxRetries: number = 3,
  delay: number = 1000
): Promise<T> {
  let lastError: AppError

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await operation()
    } catch (error) {
      lastError = classifyError(error)
      
      // Don't retry non-retryable errors
      if (!lastError.retryable || attempt === maxRetries) {
        throw lastError
      }

      // Wait before retrying
      await new Promise(resolve => setTimeout(resolve, delay * attempt))
    }
  }

  throw lastError!
}

// Safe async wrapper
export async function safeAsync<T>(
  operation: () => Promise<T>,
  fallback?: T
): Promise<{ data: T | null; error: AppError | null }> {
  try {
    const data = await operation()
    return { data, error: null }
  } catch (error) {
    const appError = classifyError(error)
    logError(appError)
    return { data: fallback || null, error: appError }
  }
}