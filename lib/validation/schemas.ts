import { z } from 'zod'

/**
 * Meta CAPI Event Schema
 * Validates events sent to the Meta Conversions API
 */
export const metaCAPIEventSchema = z.object({
  event_name: z.string({ error: 'event_name is required' }).min(1, 'event_name is required'),
  event_id: z.string().optional(),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  first_name: z.string().optional(),
  last_name: z.string().optional(),
  city: z.string().optional(),
  country: z.string().optional(),
  zip_code: z.string().optional(),
  fbp: z.string().optional(),
  fbc: z.string().optional(),
  custom_data: z.record(z.string(), z.unknown()).optional(),
  event_source_url: z.string().url().optional(),
})

export type MetaCAPIEvent = z.infer<typeof metaCAPIEventSchema>

/**
 * Generic API response helper
 */
export interface APIErrorResponse {
  error: string
  details?: Record<string, string[]>
}

/**
 * Format Zod validation errors for API responses
 */
export function formatZodErrors(error: z.ZodError): APIErrorResponse {
  const flattened = error.flatten()
  const fieldErrors = flattened.fieldErrors as Record<string, string[]>
  const values = Object.values(fieldErrors)
  const firstError = values.length > 0 && values[0].length > 0 ? values[0][0] : undefined

  return {
    error: firstError || 'Validation failed',
    details: fieldErrors,
  }
}
