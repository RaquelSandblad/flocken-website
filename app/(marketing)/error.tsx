'use client'

import { ErrorFallback } from '@/components/shared/ErrorBoundary'

/**
 * Error boundary for marketing pages
 */
export default function MarketingError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return <ErrorFallback error={error} reset={reset} />
}
