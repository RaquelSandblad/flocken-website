import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';
import { sendEmail } from '@/lib/email/send';
import { buildWelcomeEmail } from '@/lib/email/templates';

function getSupabaseClient() {
  const url = process.env.SUPPORT_SUPABASE_URL;
  const key = process.env.SUPPORT_SUPABASE_SERVICE_KEY;

  if (!url || !key) {
    throw new Error('Missing SUPPORT_SUPABASE_URL or SUPPORT_SUPABASE_SERVICE_KEY');
  }

  return createClient(url, key, { auth: { persistSession: false } });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, quizSlug } = body;

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: 'Ogiltig e-postadress.' }, { status: 400 });
    }

    const supabase = getSupabaseClient();

    const { error } = await supabase.from('flocken_quiz_subscribers').insert({
      email: email.toLowerCase().trim(),
      quiz_slug: quizSlug ?? null,
    });

    // Duplicate email – redan registrerad, behandla som success men skicka inte nytt mejl
    if (error) {
      if (error.code === '23505') {
        return NextResponse.json({ success: true, alreadySubscribed: true });
      }
      console.error('Supabase insert error:', error);
      return NextResponse.json({ error: 'Något gick fel. Försök igen.' }, { status: 500 });
    }

    // Skicka välkomstmejl med länk till kända hundar-quizet
    const { subject, html, text } = buildWelcomeEmail();
    const emailResult = await sendEmail({ to: email, subject, html, text });

    if (!emailResult.success) {
      // Prenumerationen sparades – logga felet men returnera success till användaren
      console.error('Välkomstmejl misslyckades:', emailResult.error);
    }

    console.log(`✅ Quiz-prenumerant registrerad: ${email} (quiz: ${quizSlug ?? 'okänt'})`);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Quiz subscribe error:', error);
    return NextResponse.json({ error: 'Något gick fel. Försök igen.' }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    endpoint: '/api/email/quiz-subscribe',
    methods: ['POST'],
    body: { email: 'string (required)', quizSlug: 'string (optional)' },
  });
}
