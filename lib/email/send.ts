// =============================================================================
// MAILERSEND WRAPPER
// Skickar mejl via MailerSend API med råHTML (ingen template).
// =============================================================================

interface SendEmailParams {
  to: string;
  subject: string;
  html: string;
  text: string;
}

interface SendEmailResult {
  success: boolean;
  messageId?: string;
  error?: string;
}

export async function sendEmail(params: SendEmailParams): Promise<SendEmailResult> {
  const apiToken = process.env.MAILERSEND_API_TOKEN;
  const fromEmail = process.env.MAILERSEND_FROM_EMAIL ?? 'hej@email.flocken.info';
  const fromName = process.env.MAILERSEND_FROM_NAME ?? 'Flocken';

  if (!apiToken) {
    console.error('❌ MAILERSEND_API_TOKEN saknas');
    return { success: false, error: 'Email provider not configured' };
  }

  const body = {
    from: { email: fromEmail, name: fromName },
    to: [{ email: params.to }],
    subject: params.subject,
    html: params.html,
    text: params.text,
  };

  try {
    const response = await fetch('https://api.mailersend.com/v1/email', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    const messageId = response.headers.get('x-message-id') ?? undefined;

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`❌ MailerSend fel ${response.status}:`, errorText);
      return { success: false, error: `MailerSend ${response.status}` };
    }

    console.log(`✅ Mejl skickat till ${params.to} (id: ${messageId})`);
    return { success: true, messageId };
  } catch (error) {
    console.error('❌ MailerSend nätverksfel:', error);
    return { success: false, error: 'Network error' };
  }
}
