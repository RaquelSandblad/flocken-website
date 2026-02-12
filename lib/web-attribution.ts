/**
 * Web attribution helpers (first-touch + last-touch)
 *
 * Goal:
 * - Persist first-touch (FT) once
 * - Update last-touch (LT) whenever new attribution params exist
 * - Expose `ft_*` and `lt_*` params that can be attached to dataLayer events
 *
 * Notes:
 * - Storage is only written when analytics consent is granted (handled by caller).
 * - Values are sanitized and length-limited to keep GA4/GTM payloads tidy.
 */
export type WebAttribution = {
  source?: string | null;
  medium?: string | null;
  campaign?: string | null;
  content?: string | null;
  term?: string | null;
  gclid?: string | null;
  fbclid?: string | null;
  wbraid?: string | null;
  gbraid?: string | null;
  msclkid?: string | null;
  ts?: number | null; // milliseconds since epoch
};

const FIRST_TOUCH_KEY = 'flocken_attribution_first_touch_v1';
const LAST_TOUCH_KEY = 'flocken_attribution_last_touch_v1';

function sanitize(value: string | null, maxLen: number = 120): string | null {
  if (!value) return null;
  const trimmed = value.trim();
  if (!trimmed) return null;
  return trimmed.length > maxLen ? trimmed.slice(0, maxLen) : trimmed;
}

function safeParseJson<T>(raw: string | null): T | null {
  if (!raw) return null;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

function hasAnyAttribution(a: WebAttribution | null | undefined): boolean {
  if (!a) return false;
  return Boolean(
    a.source ||
      a.medium ||
      a.campaign ||
      a.content ||
      a.term ||
      a.gclid ||
      a.fbclid ||
      a.wbraid ||
      a.gbraid ||
      a.msclkid
  );
}

export function parseAttributionFromSearch(search: string): WebAttribution {
  const params = new URLSearchParams(search.startsWith('?') ? search : `?${search}`);

  // GA4 manual campaign mapping:
  // - utm_source / utm_medium / utm_campaign / utm_content / utm_term
  // We keep them as strings and also capture common click IDs.
  return {
    source: sanitize(params.get('utm_source')),
    medium: sanitize(params.get('utm_medium')),
    campaign: sanitize(params.get('utm_campaign')),
    content: sanitize(params.get('utm_content')),
    term: sanitize(params.get('utm_term')),
    gclid: sanitize(params.get('gclid')),
    fbclid: sanitize(params.get('fbclid')),
    wbraid: sanitize(params.get('wbraid')),
    gbraid: sanitize(params.get('gbraid')),
    msclkid: sanitize(params.get('msclkid')),
    ts: Date.now(),
  };
}

export function readFirstTouch(): WebAttribution | null {
  if (typeof window === 'undefined' || typeof localStorage === 'undefined') return null;
  return safeParseJson<WebAttribution>(localStorage.getItem(FIRST_TOUCH_KEY));
}

export function readLastTouch(): WebAttribution | null {
  if (typeof window === 'undefined' || typeof localStorage === 'undefined') return null;
  return safeParseJson<WebAttribution>(localStorage.getItem(LAST_TOUCH_KEY));
}

export function upsertFromCurrentUrl(): { first: WebAttribution | null; last: WebAttribution | null } {
  if (typeof window === 'undefined' || typeof localStorage === 'undefined') {
    return { first: null, last: null };
  }

  const incoming = parseAttributionFromSearch(window.location.search);
  if (!hasAnyAttribution(incoming)) {
    return { first: readFirstTouch(), last: readLastTouch() };
  }

  const existingFirst = readFirstTouch();
  const nextFirst = existingFirst && hasAnyAttribution(existingFirst) ? existingFirst : incoming;
  const nextLast = incoming;

  try {
    if (!existingFirst || !hasAnyAttribution(existingFirst)) {
      localStorage.setItem(FIRST_TOUCH_KEY, JSON.stringify(nextFirst));
    }
    localStorage.setItem(LAST_TOUCH_KEY, JSON.stringify(nextLast));
  } catch {
    // ignore storage failures (private mode, quota, etc.)
  }

  return { first: nextFirst, last: nextLast };
}

function toEventParams(prefix: 'ft' | 'lt', a: WebAttribution | null): Record<string, string | number> {
  if (!a) return {};
  const out: Record<string, string | number> = {};

  const map: Array<[keyof WebAttribution, string]> = [
    ['source', 'source'],
    ['medium', 'medium'],
    ['campaign', 'campaign'],
    ['content', 'content'],
    ['term', 'term'],
    ['gclid', 'gclid'],
    ['fbclid', 'fbclid'],
    ['wbraid', 'wbraid'],
    ['gbraid', 'gbraid'],
    ['msclkid', 'msclkid'],
    ['ts', 'ts'],
  ];

  for (const [k, suffix] of map) {
    const v = a[k];
    if (v === null || v === undefined || v === '') continue;
    out[`${prefix}_${suffix}`] = v as string | number;
  }

  return out;
}

/**
 * Read stored FT/LT and return a flat object suitable to spread into dataLayer events.
 * This does NOT write storage.
 */
export function getAttributionEventParams(): Record<string, string | number> {
  const first = readFirstTouch();
  const last = readLastTouch();
  return {
    ...toEventParams('ft', first),
    ...toEventParams('lt', last),
  };
}

