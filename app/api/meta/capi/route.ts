import { NextRequest, NextResponse } from 'next/server';
import crypto from 'node:crypto';
import { metaCAPIEventSchema, formatZodErrors } from '@/lib/validation/schemas';
import { rateLimit, getClientIP, rateLimitHeaders } from '@/lib/rate-limit';

const PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID!;
const ACCESS_TOKEN = process.env.META_CAPI_ACCESS_TOKEN!;
const GRAPH_API_VERSION = 'v21.0';

// Rate limit: 100 requests per minute per IP
const RATE_LIMIT_CONFIG = { limit: 100, windowSeconds: 60 };

/**
 * SHA-256 hash for PII (Personal Identifiable Information)
 * Meta requires email, phone, etc. to be hashed
 */
function sha256(value?: string): string | undefined {
  if (!value) return undefined;
  return crypto
    .createHash('sha256')
    .update(value.trim().toLowerCase())
    .digest('hex');
}

/**
 * POST /api/meta/capi
 * Send server-side event to Meta Conversions API
 *
 * This enables:
 * - Better data quality (bypasses ad blockers)
 * - Improved attribution (server-to-server)
 * - GDPR compliance (hashed PII)
 * - Event deduplication with client-side Pixel
 */
export async function POST(req: NextRequest) {
  try {
    // Rate limiting
    const clientIP = getClientIP(req.headers);
    const rateLimitResult = rateLimit(clientIP, RATE_LIMIT_CONFIG);

    if (!rateLimitResult.success) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        {
          status: 429,
          headers: rateLimitHeaders(rateLimitResult),
        }
      );
    }

    // Check if CAPI is configured
    if (!PIXEL_ID || !ACCESS_TOKEN) {
      console.warn('Meta CAPI not configured - PIXEL_ID or ACCESS_TOKEN missing');
      return NextResponse.json(
        { error: 'CAPI not configured' },
        { status: 503 }
      );
    }

    const rawBody = await req.json();

    // Validate input with Zod
    const parseResult = metaCAPIEventSchema.safeParse(rawBody);
    if (!parseResult.success) {
      return NextResponse.json(
        formatZodErrors(parseResult.error),
        { status: 400 }
      );
    }

    const body = parseResult.data;

    // Build event payload
    const eventTime = Math.floor(Date.now() / 1000);

    const userData: Record<string, unknown> = {
      client_ip_address: req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
                         req.headers.get('x-real-ip') ||
                         undefined,
      client_user_agent: req.headers.get('user-agent') || undefined,
    };

    // Add hashed PII (Meta requires these to be hashed)
    if (body.email) userData.em = [sha256(body.email)];
    if (body.phone) userData.ph = [sha256(body.phone)];
    if (body.first_name) userData.fn = [sha256(body.first_name)];
    if (body.last_name) userData.ln = [sha256(body.last_name)];
    if (body.city) userData.ct = [sha256(body.city)];
    if (body.country) userData.country = [sha256(body.country)];
    if (body.zip_code) userData.zp = [sha256(body.zip_code)];

    // Add Facebook cookies for better matching
    if (body.fbp) userData.fbp = body.fbp;
    if (body.fbc) userData.fbc = body.fbc;

    const payload = {
      data: [
        {
          event_name: body.event_name,
          event_time: eventTime,
          event_id: body.event_id, // For deduplication with client-side Pixel
          action_source: 'website',
          event_source_url: body.event_source_url || req.headers.get('referer') || undefined,
          user_data: userData,
          custom_data: body.custom_data,
        },
      ],
      partner_agent: 'flocken-capi/1.0',
    };

    // Send to Meta Conversions API
    const url = `https://graph.facebook.com/${GRAPH_API_VERSION}/${PIXEL_ID}/events?access_token=${ACCESS_TOKEN}`;

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const result = await response.json();

    if (!response.ok) {
      console.error('Meta CAPI error:', result);
      return NextResponse.json(
        { error: 'Failed to send event to Meta', details: result },
        { status: response.status }
      );
    }

    return NextResponse.json({
      success: true,
      events_received: result.events_received,
      fbtrace_id: result.fbtrace_id,
    });
  } catch (error) {
    console.error('Meta CAPI endpoint error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
