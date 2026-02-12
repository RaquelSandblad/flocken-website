'use client'

import { Component, ReactNode } from 'react'

interface ErrorBoundaryProps {
  children: ReactNode
  fallback?: ReactNode
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void
}

interface ErrorBoundaryState {
  hasError: boolean
  error: Error | null
}

/**
 * Error Boundary component that catches JavaScript errors in child components
 *
 * Usage:
 * ```tsx
 * <ErrorBoundary fallback={<ErrorFallback />}>
 *   <MyComponent />
 * </ErrorBoundary>
 * ```
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    // Log to console in development
    console.error('ErrorBoundary caught an error:', error, errorInfo)

    // Call optional error handler (e.g., for Sentry logging)
    this.props.onError?.(error, errorInfo)
  }

  render(): ReactNode {
    if (this.state.hasError) {
      // Render fallback UI
      if (this.props.fallback) {
        return this.props.fallback
      }

      // Default fallback
      return <DefaultErrorFallback error={this.state.error} />
    }

    return this.props.children
  }
}

interface ErrorFallbackProps {
  error?: Error | null
  resetError?: () => void
}

/**
 * Default error fallback component
 */
function DefaultErrorFallback({ error, resetError }: ErrorFallbackProps) {
  return (
    <div className="flex min-h-[400px] flex-col items-center justify-center p-8 text-center">
      <div className="rounded-2xl bg-flocken-sand p-8 shadow-soft">
        <h2 className="mb-4 text-2xl font-bold text-flocken-brown">
          Något gick fel
        </h2>
        <p className="mb-6 text-flocken-gray">
          Ett oväntat fel inträffade. Försök att ladda om sidan.
        </p>
        {process.env.NODE_ENV === 'development' && error && (
          <pre className="mb-6 max-w-md overflow-auto rounded bg-white p-4 text-left text-sm text-red-600">
            {error.message}
          </pre>
        )}
        {resetError && (
          <button
            onClick={resetError}
            className="rounded-xl bg-flocken-olive px-6 py-3 font-semibold text-white transition-all hover:bg-flocken-accent hover:scale-105"
          >
            Försök igen
          </button>
        )}
      </div>
    </div>
  )
}

/**
 * Standalone error fallback for use with Next.js error.tsx
 */
export function ErrorFallback({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-8 text-center">
      <div className="rounded-2xl bg-flocken-sand p-8 shadow-soft max-w-md">
        <h2 className="mb-4 text-2xl font-bold text-flocken-brown">
          Något gick fel
        </h2>
        <p className="mb-6 text-flocken-gray">
          Ett oväntat fel inträffade. Försök att ladda om sidan.
        </p>
        {process.env.NODE_ENV === 'development' && (
          <pre className="mb-6 overflow-auto rounded bg-white p-4 text-left text-sm text-red-600">
            {error.message}
          </pre>
        )}
        <button
          onClick={reset}
          className="rounded-xl bg-flocken-olive px-6 py-3 font-semibold text-white transition-all hover:bg-flocken-accent hover:scale-105"
        >
          Försök igen
        </button>
      </div>
    </div>
  )
}
