# Infrastruktur - Testing, Validation & Security

**Senast uppdaterad:** 2026-02-01

Denna dokumentation beskriver den professionella infrastruktur som implementerats för att säkerställa kodkvalitet, säkerhet och stabilitet.

---

## Översikt

| Komponent | Status | Beskrivning |
|-----------|--------|-------------|
| Testing | Implementerad | Vitest med React Testing Library |
| Input Validation | Implementerad | Zod schemas för API endpoints |
| Rate Limiting | Implementerad | In-memory rate limiter |
| Error Boundaries | Implementerad | React Error Boundaries + Next.js error.tsx |
| Security Headers | Implementerad | X-Frame-Options, CSP, etc. |
| ESLint | Konfigurerad | Flat config med TypeScript-regler |

---

## Testing (Vitest)

### Kommandon

```bash
npm run test           # Kör alla tester en gång
npm run test:watch     # Kör tester i watch-läge (utveckling)
npm run test:coverage  # Kör tester med coverage-rapport
```

### Konfiguration

**Fil:** `vitest.config.ts`

```typescript
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'happy-dom',
    globals: true,
    setupFiles: ['./vitest.setup.ts'],
    include: ['**/*.test.{ts,tsx}', '**/*.spec.{ts,tsx}'],
    exclude: ['node_modules', '.next'],
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './'),
    },
  },
})
```

### Setup-fil

**Fil:** `vitest.setup.ts`

Innehåller:
- `@testing-library/jest-dom` matchers (toBeInTheDocument, etc.)
- Global test-miljö setup

### Testfiler

Tester placeras bredvid de filer de testar:

```
components/
├── shared/
│   ├── Button.tsx
│   └── Button.test.tsx    # Test för Button
lib/
├── validation/
│   ├── schemas.ts
│   └── schemas.test.ts    # Test för schemas
├── rate-limit.ts
└── rate-limit.test.ts     # Test för rate-limit
app/
└── api/
    └── meta/
        └── capi/
            ├── route.ts
            └── route.test.ts  # Test för API endpoint
```

### Skriva tester

**Komponent-test exempel:**

```typescript
import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { Button } from './Button'

describe('Button', () => {
  it('renders children correctly', () => {
    render(<Button>Click me</Button>)
    expect(screen.getByRole('button')).toHaveTextContent('Click me')
  })
})
```

**API-test exempel:**

```typescript
import { describe, it, expect, beforeAll, beforeEach, vi } from 'vitest'

describe('POST /api/meta/capi', () => {
  beforeAll(() => {
    process.env.META_ACCESS_TOKEN = 'test-token'
    process.env.META_PIXEL_ID = 'test-pixel'
  })

  beforeEach(() => {
    vi.resetModules()
  })

  it('returns 400 for invalid event data', async () => {
    const { POST } = await import('./route')
    const request = new Request('http://localhost/api/meta/capi', {
      method: 'POST',
      body: JSON.stringify({ invalid: 'data' }),
    })
    const response = await POST(request as any)
    expect(response.status).toBe(400)
  })
})
```

---

## Input Validation (Zod)

### Schema-definition

**Fil:** `lib/validation/schemas.ts`

```typescript
import { z } from 'zod'

// Schema för Meta CAPI events
export const metaCAPIEventSchema = z.object({
  event_name: z.string({ error: 'event_name is required' }).min(1, 'event_name is required'),
  event_id: z.string().optional(),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  fbc: z.string().optional(),
  fbp: z.string().optional(),
  client_ip_address: z.string().optional(),
  client_user_agent: z.string().optional(),
  event_source_url: z.string().url().optional(),
  custom_data: z.record(z.string(), z.unknown()).optional(),
})

// Typer exporteras automatiskt
export type MetaCAPIEvent = z.infer<typeof metaCAPIEventSchema>

// API response types
export interface APIErrorResponse {
  error: string
  details?: Record<string, string[]>
}

// Formatera Zod-fel till API response
export function formatZodErrors(error: z.ZodError): APIErrorResponse {
  const flattened = error.flatten()
  const fieldErrors = flattened.fieldErrors as Record<string, string[]>
  const values = Object.values(fieldErrors)
  const firstError = values.length > 0 && values[0].length > 0
    ? values[0][0]
    : undefined

  return {
    error: firstError || 'Validation failed',
    details: fieldErrors,
  }
}
```

### Användning i API routes

```typescript
import { metaCAPIEventSchema, formatZodErrors } from '@/lib/validation/schemas'

export async function POST(req: NextRequest) {
  const rawBody = await req.json()

  // Validera input
  const parseResult = metaCAPIEventSchema.safeParse(rawBody)
  if (!parseResult.success) {
    return NextResponse.json(
      formatZodErrors(parseResult.error),
      { status: 400 }
    )
  }

  // Använd validerad data (typad)
  const validatedData = parseResult.data
  // ...
}
```

### Fördelar

- **Typesäkerhet:** TypeScript-typer genereras automatiskt från schemas
- **Tydliga felmeddelanden:** Användare får specifika fel för varje fält
- **Runtime-validering:** Skyddar mot ogiltig data från externa källor

---

## Rate Limiting

### Konfiguration

**Fil:** `lib/rate-limit.ts`

**Standard-inställningar:**
- **Limit:** 100 requests per IP
- **Window:** 60 sekunder

### API

```typescript
import { rateLimit, getClientIP, rateLimitHeaders } from '@/lib/rate-limit'

const RATE_LIMIT_CONFIG = {
  limit: 100,        // Max requests
  windowSeconds: 60, // Per tidsperiod
}

export async function POST(req: NextRequest) {
  // Hämta klient-IP
  const clientIP = getClientIP(req.headers)

  // Kontrollera rate limit
  const rateLimitResult = rateLimit(clientIP, RATE_LIMIT_CONFIG)

  if (!rateLimitResult.success) {
    return NextResponse.json(
      { error: 'Too many requests. Please try again later.' },
      {
        status: 429,
        headers: rateLimitHeaders(rateLimitResult)
      }
    )
  }

  // Fortsätt med request...
}
```

### Response headers

Rate limit-information skickas i response headers:

```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 99
X-RateLimit-Reset: 1706789123
```

### Implementation

- **In-memory storage:** Enkel implementation utan externa beroenden
- **Automatisk cleanup:** Gamla entries rensas var 60:e sekund
- **IP-detection:** Stöd för X-Forwarded-For, X-Real-IP, CF-Connecting-IP

**OBS:** För produktion med flera servrar/pods bör Redis eller liknande användas istället.

---

## Error Boundaries

### React Error Boundary

**Fil:** `components/shared/ErrorBoundary.tsx`

Fångar JavaScript-fel i komponentträdet och visar en fallback UI.

```tsx
import { ErrorBoundary, ErrorFallback } from '@/components/shared/ErrorBoundary'

// Wrappa komponenter som kan kasta fel
<ErrorBoundary fallback={<ErrorFallback error={error} reset={reset} />}>
  <MyComponent />
</ErrorBoundary>
```

### Next.js Error Pages

**Fil:** `app/error.tsx` (global)
**Fil:** `app/(marketing)/error.tsx` (marketing routes)

Next.js App Router använder `error.tsx` för att fånga fel per route segment.

```tsx
'use client'

import { ErrorFallback } from '@/components/shared/ErrorBoundary'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return <ErrorFallback error={error} reset={reset} />
}
```

### Fördelar

- **Graceful degradation:** Användare ser ett vänligt felmeddelande istället för vit skärm
- **Felrapportering:** Error digest kan användas för debugging
- **Recovery:** "Försök igen"-knapp låter användare återhämta sig från temporära fel

---

## Security Headers

**Fil:** `next.config.ts`

### Implementerade headers

| Header | Värde | Skydd mot |
|--------|-------|-----------|
| X-Frame-Options | SAMEORIGIN | Clickjacking |
| X-Content-Type-Options | nosniff | MIME sniffing |
| X-XSS-Protection | 1; mode=block | XSS (äldre browsers) |
| Referrer-Policy | strict-origin-when-cross-origin | Information läckage |
| Permissions-Policy | camera=(), microphone=(), etc. | Feature abuse |

### Konfiguration

```typescript
const nextConfig: NextConfig = {
  // Ta bort X-Powered-By header
  poweredByHeader: false,

  // Aktivera gzip-kompression
  compress: true,

  // Security headers
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-XSS-Protection', value: '1; mode=block' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=(self), interest-cohort=()'
          },
        ],
      },
    ]
  },
}
```

---

## ESLint

**Fil:** `eslint.config.mjs`

### Kommandon

```bash
npm run lint         # Kör ESLint
```

### Konfiguration

ESLint använder "flat config" format (ESLint 9+):

```javascript
import { FlatCompat } from '@eslint/eslintrc'
import js from '@eslint/js'

const compat = new FlatCompat({
  baseDirectory: import.meta.dirname,
  recommendedConfig: js.configs.recommended,
})

const eslintConfig = [
  // Ignorera genererade filer
  {
    ignores: [
      '.next/**',
      'node_modules/**',
      '*.config.js',
      '*.config.mjs',
      '*.config.ts',
      'public/**',
      'scripts/**',
      'flocken_ads/**',
      'next-env.d.ts',
    ],
  },

  // Next.js recommended config
  ...compat.extends('next/core-web-vitals', 'next/typescript'),

  // Custom regler
  {
    files: ['**/*.ts', '**/*.tsx'],
    rules: {
      'prefer-const': 'error',
      '@typescript-eslint/no-unused-vars': ['warn', {
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_',
      }],
      '@typescript-eslint/no-explicit-any': 'warn',
      'react/no-unescaped-entities': 'warn',
      'react-hooks/exhaustive-deps': 'warn',
      'react-hooks/rules-of-hooks': 'error',
    },
  },
]

export default eslintConfig
```

### Regler

| Regel | Nivå | Beskrivning |
|-------|------|-------------|
| prefer-const | error | Kräv const för variabler som inte reassignas |
| no-unused-vars | warn | Varna för oanvända variabler (ignorera _prefix) |
| no-explicit-any | warn | Varna för explicit `any` typ |
| rules-of-hooks | error | Kräv korrekt hooks-användning |
| exhaustive-deps | warn | Varna för saknade dependencies |

---

## Dependencies

### Produktionsberoenden

```json
{
  "zod": "^4.3.6"
}
```

### Utvecklingsberoenden

```json
{
  "@testing-library/jest-dom": "^6.9.1",
  "@testing-library/react": "^16.3.2",
  "@vitejs/plugin-react": "^5.1.2",
  "happy-dom": "^20.4.0",
  "vitest": "^4.0.18"
}
```

---

## Framtida förbättringar

### Testing
- [ ] E2E-tester med Playwright
- [ ] Visual regression tests
- [ ] API integration tests

### Security
- [ ] Content Security Policy (CSP)
- [ ] Rate limiting med Redis (för multi-server deployment)
- [ ] HTTPS-only cookies

### Monitoring
- [ ] Error tracking (Sentry)
- [ ] Performance monitoring
- [ ] Uptime monitoring

---

## Relaterad dokumentation

- [Git Workflow](./GIT_WORKFLOW.md) - Deployment och git-kommandon
- [README.md](../../README.md) - Projektöversikt
- [CLAUDE.md](../../CLAUDE.md) - AI-assistentguide
