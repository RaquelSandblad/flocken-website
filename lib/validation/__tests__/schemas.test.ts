import { describe, it, expect } from 'vitest'
import { metaCAPIEventSchema, formatZodErrors } from '../schemas'
import { z } from 'zod'

describe('Validation Schemas', () => {
  describe('metaCAPIEventSchema', () => {
    it('should validate a minimal valid event', () => {
      const event = { event_name: 'PageView' }
      const result = metaCAPIEventSchema.safeParse(event)

      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.event_name).toBe('PageView')
      }
    })

    it('should validate a complete event', () => {
      const event = {
        event_name: 'Purchase',
        event_id: 'purchase-123',
        email: 'test@example.com',
        phone: '+46701234567',
        first_name: 'Test',
        last_name: 'User',
        city: 'Stockholm',
        country: 'SE',
        zip_code: '12345',
        fbp: 'fb.1.123456789.987654321',
        fbc: 'fb.1.123456789.AbCdEfGhIjK',
        custom_data: { value: 100, currency: 'SEK' },
        event_source_url: 'https://flocken.info/download',
      }
      const result = metaCAPIEventSchema.safeParse(event)

      expect(result.success).toBe(true)
    })

    it('should reject empty event_name', () => {
      const event = { event_name: '' }
      const result = metaCAPIEventSchema.safeParse(event)

      expect(result.success).toBe(false)
    })

    it('should reject missing event_name', () => {
      const event = {}
      const result = metaCAPIEventSchema.safeParse(event)

      expect(result.success).toBe(false)
    })

    it('should reject invalid email format', () => {
      const event = {
        event_name: 'Subscribe',
        email: 'not-an-email',
      }
      const result = metaCAPIEventSchema.safeParse(event)

      expect(result.success).toBe(false)
    })

    it('should reject invalid event_source_url format', () => {
      const event = {
        event_name: 'PageView',
        event_source_url: 'not-a-url',
      }
      const result = metaCAPIEventSchema.safeParse(event)

      expect(result.success).toBe(false)
    })

    it('should allow optional fields to be undefined', () => {
      const event = {
        event_name: 'PageView',
        email: undefined,
        phone: undefined,
      }
      const result = metaCAPIEventSchema.safeParse(event)

      expect(result.success).toBe(true)
    })
  })

  describe('formatZodErrors', () => {
    it('should format Zod errors for API response', () => {
      const schema = z.object({
        name: z.string().min(1, 'Name is required'),
        email: z.string().email('Invalid email'),
      })

      const result = schema.safeParse({ name: '', email: 'invalid' })

      if (!result.success) {
        const formatted = formatZodErrors(result.error)

        expect(formatted.error).toBeDefined()
        expect(formatted.details).toBeDefined()
      }
    })

    it('should return first error as main error message', () => {
      const schema = z.object({
        event_name: z.string().min(1, 'event_name is required'),
      })

      const result = schema.safeParse({ event_name: '' })

      if (!result.success) {
        const formatted = formatZodErrors(result.error)

        expect(formatted.error).toBe('event_name is required')
      }
    })
  })
})
