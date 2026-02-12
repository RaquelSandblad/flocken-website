// BigQuery client for fetching A/B test data

import { BigQuery } from '@google-cloud/bigquery';

export interface ExperimentData {
  experimentId: string;
  variantId: string;
  impressions: number;
  conversions: number;
  conversionEvents: string[];
}

export interface ExperimentSummary {
  experimentId: string;
  startDate: string;
  endDate: string;
  daysRunning: number;
  variants: ExperimentData[];
  totalImpressions: number;
  totalConversions: number;
}

let bigqueryClient: BigQuery | null = null;

/**
 * Initialize BigQuery client with service account credentials
 */
export function initializeBigQuery(serviceAccountJson: string): void {
  const credentials = JSON.parse(serviceAccountJson);

  bigqueryClient = new BigQuery({
    projectId: credentials.project_id,
    credentials: credentials,
  });
}

/**
 * Get BigQuery client (throws if not initialized)
 */
function getClient(): BigQuery {
  if (!bigqueryClient) {
    throw new Error('BigQuery client not initialized. Call initializeBigQuery first.');
  }
  return bigqueryClient;
}

/**
 * Fetch experiment data from BigQuery (GA4 export)
 */
export async function getExperimentData(
  experimentId: string,
  conversionEventName: string = 'cta_click',
  daysBack: number = 30
): Promise<ExperimentSummary> {
  const client = getClient();

  // Query to get experiment impressions and conversions by variant
  const query = `
    WITH experiment_impressions AS (
      SELECT
        user_pseudo_id,
        event_date,
        (SELECT value.string_value FROM UNNEST(event_params) WHERE key = 'variant_id') AS variant_id,
        MIN(event_timestamp) AS first_impression
      FROM \`nastahem-tracking.flocken_raw.events_*\`
      WHERE event_name = 'experiment_impression'
        AND (SELECT value.string_value FROM UNNEST(event_params) WHERE key = 'experiment_id') = @experimentId
        AND _TABLE_SUFFIX >= FORMAT_DATE('%Y%m%d', DATE_SUB(CURRENT_DATE(), INTERVAL @daysBack DAY))
      GROUP BY user_pseudo_id, event_date, variant_id
    ),

    conversions AS (
      SELECT
        user_pseudo_id,
        event_date,
        (SELECT value.string_value FROM UNNEST(event_params) WHERE key = 'variant_id') AS variant_id,
        event_name AS conversion_event
      FROM \`nastahem-tracking.flocken_raw.events_*\`
      WHERE event_name = @conversionEventName
        AND (SELECT value.string_value FROM UNNEST(event_params) WHERE key = 'experiment_id') = @experimentId
        AND _TABLE_SUFFIX >= FORMAT_DATE('%Y%m%d', DATE_SUB(CURRENT_DATE(), INTERVAL @daysBack DAY))
    ),

    variant_stats AS (
      SELECT
        ei.variant_id,
        COUNT(DISTINCT ei.user_pseudo_id) AS impressions,
        COUNT(DISTINCT c.user_pseudo_id) AS conversions
      FROM experiment_impressions ei
      LEFT JOIN conversions c
        ON ei.user_pseudo_id = c.user_pseudo_id
        AND ei.variant_id = c.variant_id
      GROUP BY ei.variant_id
    ),

    date_range AS (
      SELECT
        MIN(event_date) AS start_date,
        MAX(event_date) AS end_date
      FROM experiment_impressions
    )

    SELECT
      vs.variant_id,
      vs.impressions,
      vs.conversions,
      dr.start_date,
      dr.end_date,
      DATE_DIFF(PARSE_DATE('%Y%m%d', dr.end_date), PARSE_DATE('%Y%m%d', dr.start_date), DAY) + 1 AS days_running
    FROM variant_stats vs
    CROSS JOIN date_range dr
    ORDER BY vs.variant_id;
  `;

  const options = {
    query,
    params: {
      experimentId,
      conversionEventName,
      daysBack,
    },
  };

  const [rows] = await client.query(options);

  if (!rows || rows.length === 0) {
    return {
      experimentId,
      startDate: '',
      endDate: '',
      daysRunning: 0,
      variants: [],
      totalImpressions: 0,
      totalConversions: 0,
    };
  }

  const variants: ExperimentData[] = rows.map((row: Record<string, unknown>) => ({
    experimentId,
    variantId: row.variant_id as string,
    impressions: Number(row.impressions),
    conversions: Number(row.conversions),
    conversionEvents: [conversionEventName],
  }));

  const totalImpressions = variants.reduce((sum, v) => sum + v.impressions, 0);
  const totalConversions = variants.reduce((sum, v) => sum + v.conversions, 0);

  return {
    experimentId,
    startDate: rows[0].start_date as string,
    endDate: rows[0].end_date as string,
    daysRunning: Number(rows[0].days_running) || 0,
    variants,
    totalImpressions,
    totalConversions,
  };
}

/**
 * List all experiments with data
 */
export async function listExperiments(daysBack: number = 90): Promise<string[]> {
  const client = getClient();

  const query = `
    SELECT DISTINCT
      (SELECT value.string_value FROM UNNEST(event_params) WHERE key = 'experiment_id') AS experiment_id
    FROM \`nastahem-tracking.flocken_raw.events_*\`
    WHERE event_name = 'experiment_impression'
      AND _TABLE_SUFFIX >= FORMAT_DATE('%Y%m%d', DATE_SUB(CURRENT_DATE(), INTERVAL @daysBack DAY))
      AND (SELECT value.string_value FROM UNNEST(event_params) WHERE key = 'experiment_id') IS NOT NULL
    ORDER BY experiment_id;
  `;

  const options = {
    query,
    params: { daysBack },
  };

  const [rows] = await client.query(options);

  return rows.map((row: Record<string, unknown>) => row.experiment_id as string);
}

/**
 * Get daily breakdown of experiment performance
 */
export async function getExperimentDailyBreakdown(
  experimentId: string,
  conversionEventName: string = 'cta_click',
  daysBack: number = 30
): Promise<Array<{
  date: string;
  variantId: string;
  impressions: number;
  conversions: number;
  conversionRate: number;
}>> {
  const client = getClient();

  const query = `
    WITH daily_impressions AS (
      SELECT
        event_date AS date,
        (SELECT value.string_value FROM UNNEST(event_params) WHERE key = 'variant_id') AS variant_id,
        COUNT(DISTINCT user_pseudo_id) AS impressions
      FROM \`nastahem-tracking.flocken_raw.events_*\`
      WHERE event_name = 'experiment_impression'
        AND (SELECT value.string_value FROM UNNEST(event_params) WHERE key = 'experiment_id') = @experimentId
        AND _TABLE_SUFFIX >= FORMAT_DATE('%Y%m%d', DATE_SUB(CURRENT_DATE(), INTERVAL @daysBack DAY))
      GROUP BY date, variant_id
    ),

    daily_conversions AS (
      SELECT
        event_date AS date,
        (SELECT value.string_value FROM UNNEST(event_params) WHERE key = 'variant_id') AS variant_id,
        COUNT(DISTINCT user_pseudo_id) AS conversions
      FROM \`nastahem-tracking.flocken_raw.events_*\`
      WHERE event_name = @conversionEventName
        AND (SELECT value.string_value FROM UNNEST(event_params) WHERE key = 'experiment_id') = @experimentId
        AND _TABLE_SUFFIX >= FORMAT_DATE('%Y%m%d', DATE_SUB(CURRENT_DATE(), INTERVAL @daysBack DAY))
      GROUP BY date, variant_id
    )

    SELECT
      di.date,
      di.variant_id,
      di.impressions,
      COALESCE(dc.conversions, 0) AS conversions,
      SAFE_DIVIDE(COALESCE(dc.conversions, 0), di.impressions) AS conversion_rate
    FROM daily_impressions di
    LEFT JOIN daily_conversions dc
      ON di.date = dc.date AND di.variant_id = dc.variant_id
    ORDER BY di.date DESC, di.variant_id;
  `;

  const options = {
    query,
    params: {
      experimentId,
      conversionEventName,
      daysBack,
    },
  };

  const [rows] = await client.query(options);

  return rows.map((row: Record<string, unknown>) => ({
    date: row.date as string,
    variantId: row.variant_id as string,
    impressions: Number(row.impressions),
    conversions: Number(row.conversions),
    conversionRate: Number(row.conversion_rate) || 0,
  }));
}
