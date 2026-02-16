'use client';

declare global {
  interface Window {
    dataLayer: Array<Record<string, unknown>>;
  }
}

export type QuizTrackingEvent =
  | 'quiz_view'
  | 'quiz_start'
  | 'quiz_complete'
  | 'quiz_score_bucket'
  | 'quiz_cta_click'
  | 'quiz_cta_download_click'
  | 'quiz_share';

export function track(eventName: QuizTrackingEvent, payload: Record<string, unknown> = {}): void {
  if (typeof window === 'undefined') {
    return;
  }

  window.dataLayer = window.dataLayer || [];

  window.dataLayer.push({
    event: eventName,
    ...payload,
  });

  if (process.env.NODE_ENV === 'development') {
    console.log('[quiz-track]', eventName, payload);
  }
}
