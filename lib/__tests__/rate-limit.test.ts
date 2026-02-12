import { describe, it, expect, beforeEach } from 'vitest'
import { rateLimit, getClientIP, rateLimitHeaders } from '../rate-limit'

describe('Rate Limiter', () => {
  describe('rateLimit', () => {
    it('should allow requests under the limit', () => {
      const config = { limit: 5, windowSeconds: 60 }
      const identifier = 'test-ip-1-' + Date.now()

      const result = rateLimit(identifier, config)

      expect(result.success).toBe(true)
      expect(result.remaining).toBe(4)
      expect(result.limit).toBe(5)
    })

    it('should decrement remaining count on each request', () => {
      const config = { limit: 5, windowSeconds: 60 }
      const identifier = 'test-ip-2-' + Date.now()

      rateLimit(identifier, config) // 4 remaining
      rateLimit(identifier, config) // 3 remaining
      const result = rateLimit(identifier, config) // 2 remaining

      expect(result.success).toBe(true)
      expect(result.remaining).toBe(2)
    })

    it('should block requests over the limit', () => {
      const config = { limit: 3, windowSeconds: 60 }
      const identifier = 'test-ip-3-' + Date.now()

      rateLimit(identifier, config) // 1
      rateLimit(identifier, config) // 2
      rateLimit(identifier, config) // 3 - at limit
      const result = rateLimit(identifier, config) // 4 - over limit

      expect(result.success).toBe(false)
      expect(result.remaining).toBe(0)
    })

    it('should track different identifiers separately', () => {
      const config = { limit: 2, windowSeconds: 60 }
      const identifier1 = 'test-ip-4a-' + Date.now()
      const identifier2 = 'test-ip-4b-' + Date.now()

      rateLimit(identifier1, config)
      rateLimit(identifier1, config)
      const result1 = rateLimit(identifier1, config) // Over limit

      const result2 = rateLimit(identifier2, config) // First request, should succeed

      expect(result1.success).toBe(false)
      expect(result2.success).toBe(true)
      expect(result2.remaining).toBe(1)
    })

    it('should include reset time in result', () => {
      const config = { limit: 5, windowSeconds: 60 }
      const identifier = 'test-ip-5-' + Date.now()
      const before = Date.now()

      const result = rateLimit(identifier, config)

      expect(result.resetTime).toBeGreaterThan(before)
      expect(result.resetTime).toBeLessThanOrEqual(before + 60000 + 100) // 60 seconds + small buffer
    })
  })

  describe('getClientIP', () => {
    it('should extract IP from X-Forwarded-For header', () => {
      const headers = new Headers({
        'x-forwarded-for': '192.168.1.1, 10.0.0.1',
      })

      const ip = getClientIP(headers)

      expect(ip).toBe('192.168.1.1')
    })

    it('should extract IP from X-Real-IP header', () => {
      const headers = new Headers({
        'x-real-ip': '192.168.1.2',
      })

      const ip = getClientIP(headers)

      expect(ip).toBe('192.168.1.2')
    })

    it('should prefer X-Forwarded-For over X-Real-IP', () => {
      const headers = new Headers({
        'x-forwarded-for': '192.168.1.1',
        'x-real-ip': '192.168.1.2',
      })

      const ip = getClientIP(headers)

      expect(ip).toBe('192.168.1.1')
    })

    it('should return fallback IP when no headers present', () => {
      const headers = new Headers({})

      const ip = getClientIP(headers)

      expect(ip).toBe('127.0.0.1')
    })
  })

  describe('rateLimitHeaders', () => {
    it('should create correct headers', () => {
      const result = {
        success: true,
        limit: 100,
        remaining: 95,
        resetTime: 1234567890,
      }

      const headers = rateLimitHeaders(result)

      expect(headers['X-RateLimit-Limit']).toBe('100')
      expect(headers['X-RateLimit-Remaining']).toBe('95')
      expect(headers['X-RateLimit-Reset']).toBe('1234567890')
    })
  })
})
