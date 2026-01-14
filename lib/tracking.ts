/**
 * Tracking utilities för Flocken
 * Skickar events till GTM dataLayer för GA4 tracking
 * och Meta Conversions API (CAPI) för server-side tracking
 */

// ============================================
// META PIXEL + CAPI HELPERS
// ============================================

declare global {
  interface Window {
    dataLayer: Record<string, unknown>[];
    fbq?: (...args: unknown[]) => void;
  }
}

/**
 * Get Facebook browser cookies for better attribution
 */
function getFacebookCookies(): { fbp?: string; fbc?: string } {
  if (typeof document === 'undefined') return {};
  
  const cookies = document.cookie.split(';').reduce((acc, cookie) => {
    const [key, value] = cookie.trim().split('=');
    acc[key] = value;
    return acc;
  }, {} as Record<string, string>);
  
  return {
    fbp: cookies['_fbp'],
    fbc: cookies['_fbc'],
  };
}

/**
 * Generate unique event ID for deduplication between Pixel and CAPI
 */
function generateEventId(): string {
  return `${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
}

/**
 * Send event to Meta Conversions API (server-side)
 */
async function sendToCAPI(eventData: {
  event_name: string;
  event_id?: string;
  email?: string;
  phone?: string;
  custom_data?: Record<string, unknown>;
}): Promise<void> {
  try {
    const { fbp, fbc } = getFacebookCookies();
    
    await fetch('/api/meta/capi', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...eventData,
        fbp,
        fbc,
        event_source_url: window.location.href,
      }),
    });
  } catch (error) {
    console.warn('CAPI request failed:', error);
  }
}

/**
 * Track Lead event (email signup, waitlist, etc.)
 * Sends to both Meta Pixel (client) and CAPI (server) for redundancy
 */
export async function trackLead(data: {
  email?: string;
  source?: string;
  content_name?: string;
}): Promise<void> {
  const eventId = generateEventId();
  
  // Client-side: Meta Pixel
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('track', 'Lead', {
      content_name: data.content_name || 'Waitlist Signup',
      content_category: data.source || 'website',
    }, { eventID: eventId });
  }
  
  // Server-side: CAPI
  await sendToCAPI({
    event_name: 'Lead',
    event_id: eventId,
    email: data.email,
    custom_data: {
      content_name: data.content_name || 'Waitlist Signup',
      content_category: data.source || 'website',
    },
  });
  
  // Also push to dataLayer for GA4
  if (typeof window !== 'undefined' && window.dataLayer) {
    window.dataLayer.push({
      event: 'generate_lead',
      lead_source: data.source || 'website',
      content_name: data.content_name,
    });
  }
}

/**
 * Track CompleteRegistration event (app signup completed)
 * Sends to both Meta Pixel and CAPI
 */
export async function trackCompleteRegistration(data: {
  email?: string;
  method?: 'email' | 'google' | 'apple';
  value?: number;
}): Promise<void> {
  const eventId = generateEventId();
  
  // Client-side: Meta Pixel
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('track', 'CompleteRegistration', {
      content_name: 'App Registration',
      status: 'completed',
      value: data.value || 100,
      currency: 'SEK',
    }, { eventID: eventId });
  }
  
  // Server-side: CAPI
  await sendToCAPI({
    event_name: 'CompleteRegistration',
    event_id: eventId,
    email: data.email,
    custom_data: {
      content_name: 'App Registration',
      status: 'completed',
      value: data.value || 100,
      currency: 'SEK',
    },
  });
}

// ============================================
// GOOGLE ADS CONVERSION TRACKING
// ============================================

/**
 * Get Google Click ID (gclid) from URL or cookie
 */
function getGclid(): string | undefined {
  if (typeof window === 'undefined') return undefined;
  
  // Check URL first
  const urlParams = new URLSearchParams(window.location.search);
  const gclidFromUrl = urlParams.get('gclid');
  if (gclidFromUrl) return gclidFromUrl;
  
  // Check cookie (Google stores it as _gcl_aw)
  const cookies = document.cookie.split(';').reduce((acc, cookie) => {
    const [key, value] = cookie.trim().split('=');
    acc[key] = value;
    return acc;
  }, {} as Record<string, string>);
  
  // _gcl_aw format: GCL.timestamp.gclid
  const gclCookie = cookies['_gcl_aw'];
  if (gclCookie) {
    const parts = gclCookie.split('.');
    if (parts.length >= 3) return parts.slice(2).join('.');
  }
  
  return undefined;
}

/**
 * Track Google Ads conversion
 * Sends to both dataLayer (for GTM) and optionally server-side
 */
export function trackGoogleAdsConversion(data: {
  action: 'lead' | 'signup' | 'purchase' | 'app_install';
  value?: number;
  currency?: string;
  transaction_id?: string;
  send_to?: string; // e.g., 'AW-17821309500/AbCdEf' for specific conversion
}): void {
  const gclid = getGclid();
  
  // Push to dataLayer for GTM
  if (typeof window !== 'undefined' && window.dataLayer) {
    window.dataLayer.push({
      event: 'conversion',
      conversion_action: data.action,
      conversion_value: data.value || 0,
      conversion_currency: data.currency || 'SEK',
      transaction_id: data.transaction_id,
      gclid: gclid,
      send_to: data.send_to,
    });
  }
  
  // Also push gtag conversion event if gtag exists
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('event', 'conversion', {
      send_to: data.send_to || `AW-17821309500/${data.action}`,
      value: data.value || 0,
      currency: data.currency || 'SEK',
      transaction_id: data.transaction_id,
    });
  }
}

// ============================================
// GA4 DATALAYER EVENTS (existing)
// ============================================

/**
 * Track app installation click
 * Använd när användare klickar på Google Play eller App Store länkar
 * 
 * Standard: app_install (följer Spitakolus event naming convention)
 */
export function trackAppInstall(platform: 'android' | 'ios', source?: string) {
  if (typeof window === 'undefined' || !window.dataLayer) {
    console.warn('dataLayer not available');
    return;
  }

  window.dataLayer.push({
    event: 'app_install',
    platform: platform,
    source: source || 'website',
    value: 50, // Estimated value in SEK (50-150 SEK range per documentation)
    currency: 'SEK'
  });
}

/**
 * Track sign up event
 * Använd när användare registrerar sig
 * 
 * Standard: sign_up (samma som Nästa Hem för konsistent cross-brand analysis)
 */
export function trackSignUp(method: 'email' | 'google' | 'apple', userId?: string) {
  if (typeof window === 'undefined' || !window.dataLayer) {
    console.warn('dataLayer not available');
    return;
  }

  window.dataLayer.push({
    event: 'sign_up',
    signup_method: method,
    user_id: userId,
    value: 100, // Estimated value in SEK (100-200 SEK range per standard)
    currency: 'SEK'
  });
}

/**
 * Track purchase/subscription event
 * Använd när användare köper premium subscription
 */
export function trackPurchase(
  transactionId: string,
  value: number,
  items: Array<{
    item_name: string;
    item_category?: string;
    item_id?: string;
    quantity?: number;
    price: number;
  }>
) {
  if (typeof window === 'undefined' || !window.dataLayer) {
    console.warn('dataLayer not available');
    return;
  }

  window.dataLayer.push({
    event: 'purchase',
    transaction_id: transactionId,
    value: value,
    currency: 'SEK',
    items: items
  });
}

/**
 * Track subscription start
 * Använd när användare startar premium subscription
 */
export function trackSubscriptionStart(transactionId: string, value: number) {
  if (typeof window === 'undefined' || !window.dataLayer) {
    console.warn('dataLayer not available');
    return;
  }

  window.dataLayer.push({
    event: 'subscription_start',
    transaction_id: transactionId,
    value: value,
    currency: 'SEK'
  });
}

/**
 * Track listing created
 * Använd när användare skapar en hundannons
 * 
 * Standard: listing_created (samma som Nästa Hem)
 * listing_type: 'dog' för Flocken, 'apartment' för Nästa Hem
 */
export function trackListingCreated(listingId: string, listingType: string = 'dog') {
  if (typeof window === 'undefined' || !window.dataLayer) {
    console.warn('dataLayer not available');
    return;
  }

  window.dataLayer.push({
    event: 'listing_created',
    listing_id: listingId,
    listing_type: listingType, // 'dog' för Flocken, 'apartment' för Nästa Hem
    value: 0, // Gratis funktion
    currency: 'SEK'
  });
}

/**
 * Track booking created
 * Använd när användare skapar en bokning
 */
export function trackBookingCreated(
  bookingId: string,
  bookingType: 'dog_sitter' | 'dog_walker',
  value: number
) {
  if (typeof window === 'undefined' || !window.dataLayer) {
    console.warn('dataLayer not available');
    return;
  }

  window.dataLayer.push({
    event: 'booking_created',
    booking_id: bookingId,
    booking_type: bookingType,
    value: value,
    currency: 'SEK'
  });
}

/**
 * Track booking confirmed
 * Använd när bokning bekräftas
 */
export function trackBookingConfirmed(
  bookingId: string,
  bookingType: 'dog_sitter' | 'dog_walker',
  value: number
) {
  if (typeof window === 'undefined' || !window.dataLayer) {
    console.warn('dataLayer not available');
    return;
  }

  window.dataLayer.push({
    event: 'booking_confirmed',
    booking_id: bookingId,
    booking_type: bookingType,
    value: value,
    currency: 'SEK'
  });
}

/**
 * Track message sent
 * Använd när användare skickar meddelande
 * 
 * Standard: message_sent (samma som Nästa Hem för konsistent tracking)
 */
export function trackMessageSent(messageType: 'text' | 'image' | 'video', conversationId?: string) {
  if (typeof window === 'undefined' || !window.dataLayer) {
    console.warn('dataLayer not available');
    return;
  }

  window.dataLayer.push({
    event: 'message_sent',
    message_type: messageType,
    conversation_id: conversationId,
    value: 0, // Engagement metric
    currency: 'SEK'
  });
}

/**
 * Track walk/route saved (Rasta funktion)
 * Använd när användare sparar en promenad/runda
 */
export function trackWalkSaved(routeId: string, distanceKm?: number) {
  if (typeof window === 'undefined' || !window.dataLayer) {
    console.warn('dataLayer not available');
    return;
  }

  window.dataLayer.push({
    event: 'walk_saved',
    route_id: routeId,
    distance_km: distanceKm,
    value: 0,
    currency: 'SEK'
  });
}

/**
 * Track place visited/saved (Besöka funktion)
 * Använd när användare besöker eller sparar en hundvänlig plats
 */
export function trackPlaceVisited(placeId: string, placeType?: string) {
  if (typeof window === 'undefined' || !window.dataLayer) {
    console.warn('dataLayer not available');
    return;
  }

  window.dataLayer.push({
    event: 'place_visited',
    place_id: placeId,
    place_type: placeType || 'dog_friendly',
    value: 0,
    currency: 'SEK'
  });
}

