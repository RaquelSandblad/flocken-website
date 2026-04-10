#!/usr/bin/env node

/**
 * Support System MCP Server
 *
 * Hanterar supportärenden via Claude Code.
 */

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Environment variables
const SUPABASE_URL = process.env.SUPPORT_SUPABASE_URL!;
const SUPABASE_SERVICE_KEY = process.env.SUPPORT_SUPABASE_SERVICE_KEY!;

let supabase: SupabaseClient;

if (SUPABASE_URL && SUPABASE_SERVICE_KEY) {
  supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);
}

// Create MCP server
const server = new Server(
  {
    name: 'support-system',
    version: '1.0.0',
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// Define tools
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: 'list_issues',
        description: 'Lista supportärenden. Kan filtrera på status, prioritet och app.',
        inputSchema: {
          type: 'object',
          properties: {
            status: {
              type: 'string',
              enum: ['new', 'in_progress', 'waiting_user', 'resolved', 'closed', 'all'],
              description: 'Filtrera på status (default: alla utom resolved/closed)',
            },
            priority: {
              type: 'string',
              enum: ['emergency', 'high', 'medium', 'low', 'all'],
              description: 'Filtrera på prioritet',
            },
            app: {
              type: 'string',
              description: 'Filtrera på app-namn (t.ex. "flocken")',
            },
            needs_response: {
              type: 'boolean',
              description: 'Endast ärenden som behöver svar',
            },
            limit: {
              type: 'number',
              description: 'Max antal resultat (default: 20)',
            },
          },
        },
      },
      {
        name: 'get_issue',
        description: 'Hämta detaljer för ett specifikt ärende.',
        inputSchema: {
          type: 'object',
          properties: {
            issue_id: {
              type: 'string',
              description: 'Ärendets UUID',
            },
          },
          required: ['issue_id'],
        },
      },
      {
        name: 'update_issue',
        description: 'Uppdatera ett ärende (status, tilldelning, anteckningar).',
        inputSchema: {
          type: 'object',
          properties: {
            issue_id: {
              type: 'string',
              description: 'Ärendets UUID',
            },
            status: {
              type: 'string',
              enum: ['new', 'in_progress', 'waiting_user', 'resolved', 'closed'],
              description: 'Ny status',
            },
            assigned_to: {
              type: 'string',
              description: 'Vem som hanterar ärendet',
            },
            resolution_notes: {
              type: 'string',
              description: 'Intern anteckning om lösning',
            },
          },
          required: ['issue_id'],
        },
      },
      {
        name: 'respond_to_issue',
        description: 'Skicka ett svar till användaren på ett ärende.',
        inputSchema: {
          type: 'object',
          properties: {
            issue_id: {
              type: 'string',
              description: 'Ärendets UUID',
            },
            message: {
              type: 'string',
              description: 'Meddelande till användaren',
            },
            send_email: {
              type: 'boolean',
              description: 'Skicka som email (kräver att användaren angett email)',
            },
          },
          required: ['issue_id', 'message'],
        },
      },
      {
        name: 'get_stats',
        description: 'Hämta statistik över supportärenden.',
        inputSchema: {
          type: 'object',
          properties: {
            app: {
              type: 'string',
              description: 'Filtrera på app (valfritt)',
            },
          },
        },
      },
      {
        name: 'list_apps',
        description: 'Lista alla registrerade appar i supportsystemet.',
        inputSchema: {
          type: 'object',
          properties: {},
        },
      },
    ],
  };
});

// Handle tool calls
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  if (!supabase) {
    return {
      content: [
        {
          type: 'text',
          text: 'Supabase är inte konfigurerat. Sätt SUPPORT_SUPABASE_URL och SUPPORT_SUPABASE_SERVICE_KEY.',
        },
      ],
      isError: true,
    };
  }

  try {
    switch (name) {
      case 'list_issues': {
        let query = supabase
          .from('issues_with_app')
          .select('*')
          .order('created_at', { ascending: false });

        // Filter på status
        const status = args?.status as string;
        if (status && status !== 'all') {
          query = query.eq('status', status);
        } else if (!status) {
          // Default: visa inte resolved/closed
          query = query.not('status', 'in', '("resolved","closed")');
        }

        // Filter på prioritet
        const priority = args?.priority as string;
        if (priority && priority !== 'all') {
          query = query.eq('ai_priority', priority);
        }

        // Filter på app
        const app = args?.app as string;
        if (app) {
          query = query.eq('app_name', app);
        }

        // Filter på needs_response
        if (args?.needs_response === true) {
          query = query.eq('ai_needs_response', true);
        }

        // Limit
        const limit = (args?.limit as number) || 20;
        query = query.limit(limit);

        const { data, error } = await query;

        if (error) throw error;

        if (!data || data.length === 0) {
          return {
            content: [{ type: 'text', text: 'Inga ärenden hittades.' }],
          };
        }

        let text = `## Supportärenden (${data.length} st)\n\n`;

        for (const issue of data) {
          const priorityEmoji =
            issue.ai_priority === 'emergency' ? '🚨' :
            issue.ai_priority === 'high' ? '🔴' :
            issue.ai_priority === 'medium' ? '🟡' : '🟢';

          const needsResponseEmoji = issue.ai_needs_response ? '💬' : '';

          text += `### ${priorityEmoji} ${needsResponseEmoji} ${issue.title || 'Utan titel'}\n`;
          text += `**ID:** \`${issue.id.slice(0, 8)}\` | `;
          text += `**App:** ${issue.app_display_name} | `;
          text += `**Status:** ${issue.status} | `;
          text += `**Skapad:** ${new Date(issue.created_at).toLocaleDateString('sv-SE')}\n`;
          if (issue.user_email) {
            text += `**Email:** ${issue.user_email}\n`;
          }
          text += `\n${issue.description.slice(0, 200)}${issue.description.length > 200 ? '...' : ''}\n\n`;
          text += `---\n\n`;
        }

        return { content: [{ type: 'text', text }] };
      }

      case 'get_issue': {
        const issueId = args?.issue_id as string;

        const { data: issue, error } = await supabase
          .from('issues_with_app')
          .select('*')
          .eq('id', issueId)
          .single();

        if (error) throw error;

        // Hämta svar
        const { data: responses } = await supabase
          .from('issue_responses')
          .select('*')
          .eq('issue_id', issueId)
          .order('created_at', { ascending: true });

        const priorityEmoji =
          issue.ai_priority === 'emergency' ? '🚨 EMERGENCY' :
          issue.ai_priority === 'high' ? '🔴 HÖG' :
          issue.ai_priority === 'medium' ? '🟡 MEDIUM' : '🟢 LÅG';

        let text = `## Ärende: ${issue.title || 'Utan titel'}\n\n`;
        text += `**ID:** ${issue.id}\n`;
        text += `**App:** ${issue.app_display_name}\n`;
        text += `**Status:** ${issue.status}\n`;
        text += `**Prioritet:** ${priorityEmoji}\n`;
        text += `**Behöver svar:** ${issue.ai_needs_response ? 'Ja' : 'Nej'}\n`;
        text += `**Kategori:** ${issue.ai_category || '-'}\n`;
        text += `**Skapad:** ${new Date(issue.created_at).toLocaleString('sv-SE')}\n`;

        if (issue.user_email) {
          text += `**Email:** ${issue.user_email}\n`;
        }
        if (issue.user_name) {
          text += `**Namn:** ${issue.user_name}\n`;
        }
        if (issue.assigned_to) {
          text += `**Tilldelad:** ${issue.assigned_to}\n`;
        }

        text += `\n### Beskrivning\n\n${issue.description}\n`;

        if (issue.ai_summary) {
          text += `\n### AI-sammanfattning\n\n${issue.ai_summary}\n`;
        }

        if (issue.device_info) {
          text += `\n### Enhetsinformation\n\n`;
          text += `\`\`\`json\n${JSON.stringify(issue.device_info, null, 2)}\n\`\`\`\n`;
        }

        if (issue.resolution_notes) {
          text += `\n### Interna anteckningar\n\n${issue.resolution_notes}\n`;
        }

        if (responses && responses.length > 0) {
          text += `\n### Kommunikation (${responses.length} meddelanden)\n\n`;
          for (const r of responses) {
            const sender = r.response_type === 'user' ? '👤 Användare' : '👩‍💻 Support';
            text += `**${sender}** (${new Date(r.created_at).toLocaleString('sv-SE')}):\n`;
            text += `${r.message}\n\n`;
          }
        }

        return { content: [{ type: 'text', text }] };
      }

      case 'update_issue': {
        const issueId = args?.issue_id as string;
        const updates: Record<string, unknown> = {};

        if (args?.status) updates.status = args.status;
        if (args?.assigned_to) updates.assigned_to = args.assigned_to;
        if (args?.resolution_notes) updates.resolution_notes = args.resolution_notes;

        if (args?.status === 'resolved') {
          updates.resolved_at = new Date().toISOString();
        }

        const { error } = await supabase
          .from('issues')
          .update(updates)
          .eq('id', issueId);

        if (error) throw error;

        // Logga event
        await supabase.from('issue_events').insert({
          issue_id: issueId,
          event_type: 'updated',
          event_data: updates,
          actor: 'claude_mcp',
        });

        return {
          content: [{ type: 'text', text: `✅ Ärende ${issueId.slice(0, 8)} uppdaterat.` }],
        };
      }

      case 'respond_to_issue': {
        const issueId = args?.issue_id as string;
        const message = args?.message as string;

        // Spara svaret
        const { error } = await supabase.from('issue_responses').insert({
          issue_id: issueId,
          response_type: 'support',
          responder_name: 'Support via Claude',
          message,
          sent_to_user: args?.send_email || false,
          sent_at: args?.send_email ? new Date().toISOString() : null,
          sent_via: args?.send_email ? 'email' : null,
        });

        if (error) throw error;

        // TODO: Om send_email, skicka faktiskt email via Resend/SendGrid

        let text = `✅ Svar sparat på ärende ${issueId.slice(0, 8)}.`;
        if (args?.send_email) {
          text += '\n\n⚠️ Email-utskick är inte implementerat än. Svaret är sparat men inte skickat.';
        }

        return { content: [{ type: 'text', text }] };
      }

      case 'get_stats': {
        const { data, error } = await supabase.rpc('get_app_stats');

        if (error) throw error;

        let text = `## Supportstatistik\n\n`;
        text += `| App | Totalt | Öppna | Emergency | Väntar svar | Snitt lösningstid |\n`;
        text += `|-----|--------|-------|-----------|-------------|-------------------|\n`;

        for (const row of data) {
          text += `| ${row.app_name} | ${row.total_issues} | ${row.open_issues} | ${row.emergency_issues} | ${row.needs_response} | ${row.avg_resolution_hours || '-'} h |\n`;
        }

        return { content: [{ type: 'text', text }] };
      }

      case 'list_apps': {
        const { data, error } = await supabase
          .from('apps')
          .select('name, display_name, created_at');

        if (error) throw error;

        let text = `## Registrerade appar\n\n`;
        for (const app of data || []) {
          text += `- **${app.display_name}** (\`${app.name}\`)\n`;
        }

        return { content: [{ type: 'text', text }] };
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
      content: [{ type: 'text', text: `Fel: ${errorMessage}` }],
      isError: true,
    };
  }
});

// Start server
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('Support System MCP server running');
}

main().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
