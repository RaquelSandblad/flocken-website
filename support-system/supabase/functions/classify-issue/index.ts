// =============================================================================
// EDGE FUNCTION: classify-issue
// =============================================================================
//
// Klassificerar ett ärende med AI och uppdaterar databasen.
//
// Anropas:
// 1. Via Database Webhook när ett nytt ärende skapas
// 2. Eller manuellt via API
//
// =============================================================================

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ClassificationResult {
  priority: 'emergency' | 'high' | 'medium' | 'low';
  needs_response: boolean;
  summary: string;
  category: string;
}

// Klassificera med Claude API
async function classifyWithAI(description: string, deviceInfo: unknown): Promise<ClassificationResult> {
  const anthropicApiKey = Deno.env.get('ANTHROPIC_API_KEY');

  if (!anthropicApiKey) {
    console.error('ANTHROPIC_API_KEY not set, using fallback classification');
    return fallbackClassification(description);
  }

  const prompt = `Du är en supportklassificerare för en hundapp (Flocken). Analysera detta ärende och klassificera det.

ÄRENDE:
${description}

ENHETSINFORMATION:
${JSON.stringify(deviceInfo, null, 2)}

KLASSIFICERA enligt följande:

1. PRIORITY (välj EN):
   - emergency: GDPR-relaterat (radera konto/data), säkerhetsproblem, dataläcka, betalningsproblem
   - high: Kritisk funktion fungerar inte, användare blockerad
   - medium: Bugg med workaround, prestandaproblem
   - low: Feature request, minor issues, frågor

2. NEEDS_RESPONSE (true/false):
   - true: Användaren förväntar sig ett svar (fråga, klagomål med känsla, GDPR-request)
   - false: Ren buggrapport utan förväntning på personligt svar

3. CATEGORY (välj EN):
   - account_deletion: Radera konto
   - account_issue: Andra kontoproblem
   - bug: Teknisk bugg
   - performance: Prestandaproblem
   - feature_request: Önskemål om ny funktion
   - question: Fråga om hur något fungerar
   - payment: Betalningsrelaterat
   - other: Annat

4. SUMMARY: En kort sammanfattning för utvecklaren (max 100 tecken)

Svara ENDAST med JSON i detta format:
{
  "priority": "...",
  "needs_response": true/false,
  "category": "...",
  "summary": "..."
}`;

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': anthropicApiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-3-haiku-20240307',
        max_tokens: 256,
        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Anthropic API error:', errorText);
      return fallbackClassification(description);
    }

    const data = await response.json();
    const content = data.content[0].text;

    // Extrahera JSON från svaret
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      console.error('Could not parse AI response:', content);
      return fallbackClassification(description);
    }

    const parsed = JSON.parse(jsonMatch[0]);

    return {
      priority: parsed.priority || 'medium',
      needs_response: parsed.needs_response ?? true,
      summary: parsed.summary || 'Klassificerat ärende',
      category: parsed.category || 'other',
    };
  } catch (error) {
    console.error('AI classification error:', error);
    return fallbackClassification(description);
  }
}

// Fallback-klassificering om AI inte fungerar
function fallbackClassification(description: string): ClassificationResult {
  const lowerDesc = description.toLowerCase();

  // Emergency keywords
  if (
    lowerDesc.includes('radera') ||
    lowerDesc.includes('ta bort konto') ||
    lowerDesc.includes('gdpr') ||
    lowerDesc.includes('personuppgifter') ||
    lowerDesc.includes('säkerhet') ||
    lowerDesc.includes('hackad')
  ) {
    return {
      priority: 'emergency',
      needs_response: true,
      summary: 'Potentiellt GDPR/säkerhetsärende - kräver manuell granskning',
      category: 'account_deletion',
    };
  }

  // High priority keywords
  if (
    lowerDesc.includes('fungerar inte') ||
    lowerDesc.includes('krasch') ||
    lowerDesc.includes('kan inte logga in')
  ) {
    return {
      priority: 'high',
      needs_response: true,
      summary: 'Kritisk funktionalitet rapporterad som trasig',
      category: 'bug',
    };
  }

  // Feature request
  if (
    lowerDesc.includes('vore kul') ||
    lowerDesc.includes('önskar') ||
    lowerDesc.includes('skulle vilja') ||
    lowerDesc.includes('feature')
  ) {
    return {
      priority: 'low',
      needs_response: false,
      summary: 'Feature request',
      category: 'feature_request',
    };
  }

  // Default
  return {
    priority: 'medium',
    needs_response: true,
    summary: 'Ärende behöver manuell klassificering',
    category: 'other',
  };
}

serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Hämta issue_id från request
    const { issue_id, record } = await req.json();

    // Om anropat via webhook, använd record direkt
    // Om anropat manuellt, hämta från databasen
    let issue = record;

    if (!issue && issue_id) {
      const { data, error } = await supabase
        .from('issues')
        .select('*')
        .eq('id', issue_id)
        .single();

      if (error) throw error;
      issue = data;
    }

    if (!issue) {
      return new Response(
        JSON.stringify({ error: 'No issue provided' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Klassificera med AI
    const classification = await classifyWithAI(issue.description, issue.device_info);

    // Uppdatera ärendet
    const { error: updateError } = await supabase
      .from('issues')
      .update({
        ai_priority: classification.priority,
        ai_needs_response: classification.needs_response,
        ai_summary: classification.summary,
        ai_category: classification.category,
        ai_classified_at: new Date().toISOString(),
        title: classification.summary.slice(0, 100),
      })
      .eq('id', issue.id);

    if (updateError) throw updateError;

    // Logga event
    await supabase.from('issue_events').insert({
      issue_id: issue.id,
      event_type: 'classified',
      event_data: classification,
      actor: 'ai_classifier',
    });

    // Om emergency, skicka Slack-notis (implementera senare)
    if (classification.priority === 'emergency') {
      console.log('🚨 EMERGENCY ISSUE:', issue.id, classification.summary);
      // TODO: Implementera Slack webhook
    }

    return new Response(
      JSON.stringify({
        success: true,
        issue_id: issue.id,
        classification,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
