// A/B Testing Middleware Logic
// Used by Next.js middleware to assign variants server-side

import { NextRequest, NextResponse } from 'next/server';
import { getActiveExperimentsForPage } from './experiments';
import {
  AB_COOKIE_NAME,
  parseAssignments,
  serializeAssignments,
  getOrAssignVariant,
  isExperimentActive,
} from './utils';

export interface MiddlewareResult {
  response: NextResponse;
  assignments: Record<string, string>;
  newAssignments: Array<{ experimentId: string; variantId: string }>;
}

export function handleABTestMiddleware(request: NextRequest): MiddlewareResult {
  const pathname = request.nextUrl.pathname;
  const response = NextResponse.next();

  // Get existing assignments from cookie
  const cookieValue = request.cookies.get(AB_COOKIE_NAME)?.value || '{}';
  const assignments = parseAssignments(cookieValue);
  const newAssignments: Array<{ experimentId: string; variantId: string }> = [];

  // Get active experiments for this page
  const experiments = getActiveExperimentsForPage(pathname);

  // Assign variants for each experiment
  for (const experiment of experiments) {
    if (!isExperimentActive(experiment)) {
      continue;
    }

    const { variant, isNew } = getOrAssignVariant(experiment, assignments);
    assignments[experiment.id] = variant.id;

    if (isNew) {
      newAssignments.push({
        experimentId: experiment.id,
        variantId: variant.id,
      });
    }
  }

  // Update cookie if there are any assignments
  if (Object.keys(assignments).length > 0) {
    response.cookies.set(AB_COOKIE_NAME, serializeAssignments(assignments), {
      httpOnly: false, // Needs to be readable by client for tracking
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 90, // 90 days
      path: '/',
    });
  }

  return { response, assignments, newAssignments };
}
