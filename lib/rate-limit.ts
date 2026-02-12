/**
 * Simple in-memory rate limiter
 *
 * Note: This is a basic implementation that works for single-server deployments.
 * For production with multiple instances, consider using Redis-based rate limiting
 * (e.g., @upstash/ratelimit).
 *
 * Limitations:
 * - Resets on server restart
 * - Doesn't work across multiple server instances
 * - Memory usage grows with unique IPs (cleaned up periodically)
 */

interface RateLimitEntry {
  count: number
  resetTime: number
}

const rateLimitStore = new Map<string, RateLimitEntry>()

// Clean up old entries every 5 minutes
const CLEANUP_INTERVAL = 5 * 60 * 1000

let cleanupTimer: ReturnType<typeof setInterval> | null = null

function startCleanup() {
  if (cleanupTimer) return

  cleanupTimer = setInterval(() => {
    const now = Date.now()
    for (const [key, entry] of rateLimitStore.entries()) {
      if (entry.resetTime < now) {
        rateLimitStore.delete(key)
      }
    }
  }, CLEANUP_INTERVAL)

  // Don't prevent Node from exiting
  if (cleanupTimer.unref) {
    cleanupTimer.unref()
  }
}

export interface RateLimitConfig {
  /** Maximum number of requests allowed in the time window */
  limit: number
  /** Time window in seconds */
  windowSeconds: number
}

export interface RateLimitResult {
  success: boolean
  limit: number
  remaining: number
  resetTime: number
}

/**
 * Check if a request should be rate limited
 *
 * @param identifier - Unique identifier for the client (usually IP address)
 * @param config - Rate limit configuration
 * @returns Rate limit result with remaining requests and reset time
 *
 * @example
 * ```ts
 * const result = rateLimit(clientIP, { limit: 10, windowSeconds: 60 })
 * if (!result.success) {
 *   return new Response('Too many requests', { status: 429 })
 * }
 * ```
 */
export function rateLimit(
  identifier: string,
  config: RateLimitConfig
): RateLimitResult {
  startCleanup()

  const now = Date.now()
  const windowMs = config.windowSeconds * 1000
  const key = identifier

  const existing = rateLimitStore.get(key)

  // If no existing entry or window has expired, create new entry
  if (!existing || existing.resetTime < now) {
    const resetTime = now + windowMs
    rateLimitStore.set(key, { count: 1, resetTime })

    return {
      success: true,
      limit: config.limit,
      remaining: config.limit - 1,
      resetTime,
    }
  }

  // Increment count
  existing.count++

  // Check if over limit
  if (existing.count > config.limit) {
    return {
      success: false,
      limit: config.limit,
      remaining: 0,
      resetTime: existing.resetTime,
    }
  }

  return {
    success: true,
    limit: config.limit,
    remaining: config.limit - existing.count,
    resetTime: existing.resetTime,
  }
}

/**
 * Get client IP from Next.js request headers
 *
 * Handles common proxy headers (X-Forwarded-For, X-Real-IP)
 * Falls back to a default value for local development
 */
export function getClientIP(headers: Headers): string {
  const forwardedFor = headers.get('x-forwarded-for')
  if (forwardedFor) {
    // X-Forwarded-For can contain multiple IPs, take the first one
    return forwardedFor.split(',')[0].trim()
  }

  const realIP = headers.get('x-real-ip')
  if (realIP) {
    return realIP
  }

  // Fallback for local development
  return '127.0.0.1'
}

/**
 * Create rate limit headers for the response
 */
export function rateLimitHeaders(result: RateLimitResult): Record<string, string> {
  return {
    'X-RateLimit-Limit': result.limit.toString(),
    'X-RateLimit-Remaining': result.remaining.toString(),
    'X-RateLimit-Reset': result.resetTime.toString(),
  }
}
