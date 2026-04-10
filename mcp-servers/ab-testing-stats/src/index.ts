#!/usr/bin/env node

/**
 * A/B Testing Statistics MCP Server
 *
 * Provides tools for analyzing A/B test experiments using BigQuery data.
 */

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';

import {
  initializeBigQuery,
  getExperimentData,
  listExperiments,
  getExperimentDailyBreakdown,
} from './bigquery.js';

import {
  formatExperimentReport,
  zTestForProportions,
  bayesianAnalysis,
  calculateSampleSize,
} from './statistics.js';

// Initialize BigQuery with credentials from environment
const serviceAccountJson = process.env.GOOGLE_ADS_SERVICE_ACCOUNT_JSON;
if (serviceAccountJson) {
  initializeBigQuery(serviceAccountJson);
}

// Create MCP server
const server = new Server(
  {
    name: 'ab-testing-stats',
    version: '1.0.0',
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// Define available tools
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: 'get_experiment_stats',
        description:
          'Hämta statistik för ett A/B-test experiment. Returnerar visningar, konverteringar, konverteringsgrad, statistisk signifikans och rekommendation.',
        inputSchema: {
          type: 'object',
          properties: {
            experiment_id: {
              type: 'string',
              description: 'ID för experimentet (t.ex. "valkommen_hero_v1")',
            },
            conversion_event: {
              type: 'string',
              description: 'Namn på konverteringseventet (default: "cta_click")',
              default: 'cta_click',
            },
            days_back: {
              type: 'number',
              description: 'Antal dagar bakåt att analysera (default: 30)',
              default: 30,
            },
          },
          required: ['experiment_id'],
        },
      },
      {
        name: 'list_experiments',
        description: 'Lista alla experiment som har data i BigQuery.',
        inputSchema: {
          type: 'object',
          properties: {
            days_back: {
              type: 'number',
              description: 'Antal dagar bakåt att söka (default: 90)',
              default: 90,
            },
          },
        },
      },
      {
        name: 'get_daily_breakdown',
        description:
          'Hämta daglig uppdelning av experimentets prestanda. Bra för att se trender över tid.',
        inputSchema: {
          type: 'object',
          properties: {
            experiment_id: {
              type: 'string',
              description: 'ID för experimentet',
            },
            conversion_event: {
              type: 'string',
              description: 'Namn på konverteringseventet (default: "cta_click")',
              default: 'cta_click',
            },
            days_back: {
              type: 'number',
              description: 'Antal dagar bakåt (default: 30)',
              default: 30,
            },
          },
          required: ['experiment_id'],
        },
      },
      {
        name: 'calculate_sample_size',
        description:
          'Beräkna hur många besökare som behövs för att uppnå statistisk signifikans.',
        inputSchema: {
          type: 'object',
          properties: {
            baseline_conversion_rate: {
              type: 'number',
              description: 'Nuvarande konverteringsgrad (t.ex. 0.05 för 5%)',
            },
            minimum_detectable_effect: {
              type: 'number',
              description: 'Minsta förändring vi vill kunna upptäcka, relativt (t.ex. 0.20 för 20% förbättring)',
            },
            daily_visitors: {
              type: 'number',
              description: 'Antal besökare per dag på sidan',
              default: 100,
            },
          },
          required: ['baseline_conversion_rate', 'minimum_detectable_effect'],
        },
      },
      {
        name: 'compare_variants',
        description:
          'Jämför två varianter manuellt med angivna siffror (utan BigQuery).',
        inputSchema: {
          type: 'object',
          properties: {
            control_visitors: {
              type: 'number',
              description: 'Antal besökare för kontrollvarianten',
            },
            control_conversions: {
              type: 'number',
              description: 'Antal konverteringar för kontrollvarianten',
            },
            variant_visitors: {
              type: 'number',
              description: 'Antal besökare för testvarianten',
            },
            variant_conversions: {
              type: 'number',
              description: 'Antal konverteringar för testvarianten',
            },
          },
          required: [
            'control_visitors',
            'control_conversions',
            'variant_visitors',
            'variant_conversions',
          ],
        },
      },
    ],
  };
});

// Handle tool calls
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    switch (name) {
      case 'get_experiment_stats': {
        const experimentId = args?.experiment_id as string;
        const conversionEvent = (args?.conversion_event as string) || 'cta_click';
        const daysBack = (args?.days_back as number) || 30;

        const data = await getExperimentData(experimentId, conversionEvent, daysBack);

        if (data.variants.length === 0) {
          return {
            content: [
              {
                type: 'text',
                text: `Ingen data hittades för experiment "${experimentId}". Kontrollera att experimentet är aktivt och att GA4 → BigQuery export fungerar.`,
              },
            ],
          };
        }

        // Find control and variant
        const control = data.variants.find((v) => v.variantId === 'control') || data.variants[0];
        const variant = data.variants.find((v) => v.variantId !== 'control') || data.variants[1];

        if (!control || !variant) {
          return {
            content: [
              {
                type: 'text',
                text: `Endast en variant hittades. A/B-test kräver minst två varianter.`,
              },
            ],
          };
        }

        const report = formatExperimentReport(
          experimentId,
          experimentId,
          control.impressions,
          control.conversions,
          variant.impressions,
          variant.conversions,
          variant.variantId,
          data.daysRunning
        );

        return {
          content: [{ type: 'text', text: report }],
        };
      }

      case 'list_experiments': {
        const daysBack = (args?.days_back as number) || 90;
        const experiments = await listExperiments(daysBack);

        if (experiments.length === 0) {
          return {
            content: [
              {
                type: 'text',
                text: 'Inga experiment hittades i BigQuery. Kontrollera att experiment kör och att GA4 → BigQuery export är konfigurerad.',
              },
            ],
          };
        }

        const list = experiments.map((e) => `- ${e}`).join('\n');
        return {
          content: [
            {
              type: 'text',
              text: `## Aktiva experiment (senaste ${daysBack} dagarna)\n\n${list}`,
            },
          ],
        };
      }

      case 'get_daily_breakdown': {
        const experimentId = args?.experiment_id as string;
        const conversionEvent = (args?.conversion_event as string) || 'cta_click';
        const daysBack = (args?.days_back as number) || 30;

        const breakdown = await getExperimentDailyBreakdown(
          experimentId,
          conversionEvent,
          daysBack
        );

        if (breakdown.length === 0) {
          return {
            content: [
              {
                type: 'text',
                text: `Ingen daglig data hittades för experiment "${experimentId}".`,
              },
            ],
          };
        }

        let table = `## Daglig uppdelning: ${experimentId}\n\n`;
        table += `| Datum | Variant | Visningar | Konv. | Konv.grad |\n`;
        table += `|-------|---------|-----------|-------|----------|\n`;

        for (const row of breakdown.slice(0, 30)) {
          const rate = (row.conversionRate * 100).toFixed(2);
          table += `| ${row.date} | ${row.variantId} | ${row.impressions} | ${row.conversions} | ${rate}% |\n`;
        }

        return {
          content: [{ type: 'text', text: table }],
        };
      }

      case 'calculate_sample_size': {
        const baselineRate = args?.baseline_conversion_rate as number;
        const mde = args?.minimum_detectable_effect as number;
        const dailyVisitors = (args?.daily_visitors as number) || 100;

        const result = calculateSampleSize(baselineRate, mde, 0.8, 0.05, dailyVisitors);

        const baselinePercent = (baselineRate * 100).toFixed(1);
        const mdePercent = (mde * 100).toFixed(0);

        let text = `## Sample Size Beräkning\n\n`;
        text += `**Input:**\n`;
        text += `- Nuvarande konverteringsgrad: ${baselinePercent}%\n`;
        text += `- Minsta detekterbara effekt: ${mdePercent}%\n`;
        text += `- Dagliga besökare: ${dailyVisitors}\n\n`;
        text += `**Resultat:**\n`;
        text += `- Besökare per variant: ${result.sampleSizePerVariant.toLocaleString()}\n`;
        text += `- Totalt antal besökare: ${result.totalSampleSize.toLocaleString()}\n`;
        text += `- Uppskattad tid: **${result.estimatedDaysToComplete} dagar**\n`;

        return {
          content: [{ type: 'text', text }],
        };
      }

      case 'compare_variants': {
        const controlVisitors = args?.control_visitors as number;
        const controlConversions = args?.control_conversions as number;
        const variantVisitors = args?.variant_visitors as number;
        const variantConversions = args?.variant_conversions as number;

        const zTest = zTestForProportions(
          controlVisitors,
          controlConversions,
          variantVisitors,
          variantConversions
        );

        const bayesian = bayesianAnalysis(
          controlVisitors,
          controlConversions,
          variantVisitors,
          variantConversions
        );

        let text = `## Variant-jämförelse\n\n`;
        text += `| Variant | Besökare | Konv. | Konv.grad |\n`;
        text += `|---------|----------|-------|----------|\n`;
        text += `| Kontroll | ${controlVisitors.toLocaleString()} | ${controlConversions.toLocaleString()} | ${(zTest.controlRate * 100).toFixed(2)}% |\n`;
        text += `| Variant | ${variantVisitors.toLocaleString()} | ${variantConversions.toLocaleString()} | ${(zTest.variantRate * 100).toFixed(2)}% |\n\n`;

        text += `**Analys:**\n`;
        text += `- Relativ förändring: ${(zTest.relativeLift * 100).toFixed(1)}%\n`;
        text += `- Statistisk signifikans: ${zTest.confidenceLevel.toFixed(1)}% ${zTest.isSignificant ? '✅' : '⏳'}\n`;
        text += `- P-värde: ${zTest.pValue.toFixed(4)}\n`;
        text += `- Bayesian P(variant bättre): ${(bayesian.probabilityVariantBetter * 100).toFixed(1)}%\n\n`;

        text += `**Rekommendation:** ${bayesian.recommendation}`;

        return {
          content: [{ type: 'text', text }],
        };
      }

      default:
        return {
          content: [{ type: 'text', text: `Okänt verktyg: ${name}` }],
          isError: true,
        };
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return {
      content: [
        {
          type: 'text',
          text: `Fel vid körning av ${name}: ${errorMessage}`,
        },
      ],
      isError: true,
    };
  }
});

// Start the server
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('A/B Testing Stats MCP server running');
}

main().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
