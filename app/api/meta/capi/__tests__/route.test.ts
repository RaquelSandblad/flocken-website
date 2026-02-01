import { describe, it, expect, vi, beforeEach, beforeAll } from 'vitest'
import { NextRequest } from 'next/server'

// Set environment variables BEFORE importing the route
beforeAll(() => {
  process.env.NEXT_PUBLIC_META_PIXEL_ID = 'test-pixel-id'
  process.env.META_CAPI_ACCESS_TOKEN = 'test-access-token'
})

// Mock fetch globally
const mockFetch = vi.fn()
global.fetch = mockFetch

function createMockRequest(body: object, headers: Record<string, string> = {}): NextRequest {
  const request = new NextRequest('http://localhost:3000/api/meta/capi', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'user-agent': 'test-agent',
      ...headers,
    },
    body: JSON.stringify(body),
  })
  return request
}

describe('Meta CAPI Route', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.resetModules()
    mockFetch.mockReset()
  })

  describe('POST /api/meta/capi', () => {
    it('should return 400 if event_name is missing', async () => {
      // Import dynamically to get fresh module with env vars set
      const { POST } = await import('../route')

      const request = createMockRequest({})
      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.error).toBeDefined()
      expect(data.details).toBeDefined()
    })

    it('should send event to Meta API successfully', async () => {
      const { POST } = await import('../route')

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          events_received: 1,
          fbtrace_id: 'test-trace-id',
        }),
      })

      const request = createMockRequest({
        event_name: 'TestEvent',
        event_id: 'test-123',
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(data.events_received).toBe(1)
      expect(mockFetch).toHaveBeenCalledOnce()
    })

    it('should hash email before sending to Meta', async () => {
      const { POST } = await import('../route')

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          events_received: 1,
          fbtrace_id: 'test-trace-id',
        }),
      })

      const request = createMockRequest({
        event_name: 'Subscribe',
        email: 'Test@Example.com',
      })

      await POST(request)

      // Verify fetch was called with hashed email (SHA-256 of lowercase, trimmed)
      const fetchCall = mockFetch.mock.calls[0]
      const sentBody = JSON.parse(fetchCall[1].body)

      // Email should be hashed, not plain text
      expect(sentBody.data[0].user_data.em).toBeDefined()
      expect(sentBody.data[0].user_data.em[0]).not.toBe('test@example.com')
      expect(sentBody.data[0].user_data.em[0]).toHaveLength(64) // SHA-256 hex length
    })

    it('should handle Meta API errors gracefully', async () => {
      const { POST } = await import('../route')

      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 400,
        json: async () => ({
          error: {
            message: 'Invalid pixel ID',
            code: 100,
          },
        }),
      })

      const request = createMockRequest({
        event_name: 'TestEvent',
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.error).toBe('Failed to send event to Meta')
    })

    it('should include user agent and IP from headers', async () => {
      const { POST } = await import('../route')

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          events_received: 1,
          fbtrace_id: 'test-trace-id',
        }),
      })

      const request = createMockRequest(
        { event_name: 'PageView' },
        {
          'user-agent': 'Mozilla/5.0 Test Browser',
          'x-forwarded-for': '192.168.1.1, 10.0.0.1',
        }
      )

      await POST(request)

      const fetchCall = mockFetch.mock.calls[0]
      const sentBody = JSON.parse(fetchCall[1].body)

      expect(sentBody.data[0].user_data.client_user_agent).toBe('Mozilla/5.0 Test Browser')
      expect(sentBody.data[0].user_data.client_ip_address).toBe('192.168.1.1')
    })
  })
})
