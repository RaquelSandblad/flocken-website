'use client'

import { ErrorFallback } from '@/components/shared/ErrorBoundary'

/**
 * Global error boundary for the app
 *
 * This catches errors that bubble up from any route
 * and displays a user-friendly error message.
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return <ErrorFallback error={error} reset={reset} />
}
