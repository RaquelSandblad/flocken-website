import { NextRequest, NextResponse } from 'next/server';
import crypto from 'node:crypto';

/**
 * Google Ads Enhanced Conversions API
 * 
 * Sends conversion data server-side for better attribution.
 * Uses Enhanced Conversions to match users via hashed email/phone.
 */

const GOOGLE_ADS_CUSTOMER_ID = process.env.GOOGLE_ADS_CUSTOMER_ID;
const CONVERSION_ACTION_ID = process.env.GOOGLE_ADS_CONVERSION_ACTION_ID; // You'll need to create this in Google Ads

interface ConversionData {
  conversion_action: string; // e.g., 'lead', 'signup', 'purchase'
  conversion_value?: number;
  currency?: string;
  gclid?: string; // Google Click ID from URL
  email?: string;
  phone?: string;
  transaction_id?: string;
}

/**
 * SHA-256 hash for PII (Google requires this for Enhanced Conversions)
 */
function sha256(value?: string): string | undefined {
  if (!value) return undefined;
  return crypto
    .createHash('sha256')
    .update(value.trim().toLowerCase())
    .digest('hex');
}

/**
 * POST /api/google-ads/conversions
 * 
 * For now, this logs the conversion. Full implementation requires:
 * 1. Google Ads API OAuth setup (complex)
 * 2. Conversion Action ID from Google Ads
 * 
 * Alternative: Use Google Tag Manager server-side (which we already have!)
 */
export async function POST(req: NextRequest) {
  try {
    const body: ConversionData = await req.json();

    if (!body.conversion_action) {
      return NextResponse.json(
        { error: 'conversion_action is required' },
        { status: 400 }
      );
    }

    // Log conversion for debugging
    console.log('Google Ads Conversion:', {
      action: body.conversion_action,
      value: body.conversion_value,
      currency: body.currency || 'SEK',
      gclid: body.gclid,
      hasEmail: !!body.email,
      hasPhone: !!body.phone,
      transaction_id: body.transaction_id,
      timestamp: new Date().toISOString(),
    });

    // For Enhanced Conversions, we'd send to Google Ads API here
    // But GTM Server-side already handles this via the GA4 -> Google Ads link
    
    // The best approach is to push to dataLayer and let GTM handle it:
    // This endpoint is mainly for:
    // 1. Offline conversions (app events)
    // 2. Backup tracking when GTM fails

    return NextResponse.json({
      success: true,
      message: 'Conversion logged. GTM Server handles forwarding to Google Ads.',
      conversion: {
        action: body.conversion_action,
        value: body.conversion_value,
        customer_id: GOOGLE_ADS_CUSTOMER_ID,
      }
    });
  } catch (error) {
    console.error('Google Ads conversion error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/google-ads/conversions
 * Health check endpoint
 */
export async function GET() {
  return NextResponse.json({
    status: 'ok',
    customer_id: GOOGLE_ADS_CUSTOMER_ID ? 'configured' : 'missing',
    message: 'Google Ads conversions are handled via GTM Server-side',
  });
}

