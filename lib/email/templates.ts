// =============================================================================
// FLOCKEN EMAIL TEMPLATES
// =============================================================================
// Varje mejl är en funktion som returnerar { subject, html, text }.
// Lägg till nya mejltyper som nya funktioner – ingen MailerSend-template behövs.
// =============================================================================

const BRAND = {
  olive: '#6B7A3A',
  accent: '#8BA45D',
  sand: '#E8DCC0',
  cream: '#F5F1E8',
  brown: '#3E3B32',
  gray: '#A29D89',
  white: '#FFFFFF',
  logoUrl: 'https://flocken.info/assets/flocken/logo/flocken_logo_white.png',
  baseUrl: 'https://quiz.flocken.info',
  unsubscribeUrl: '{$unsubscribe}', // MailerSend fyller i automatiskt
};

function emailWrapper(content: string): string {
  return `<!DOCTYPE html>
<html lang="sv">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Flocken</title>
</head>
<body style="margin:0;padding:0;background-color:${BRAND.cream};font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:${BRAND.cream};padding:32px 16px;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width:580px;">

          <!-- Header -->
          <tr>
            <td style="background-color:${BRAND.olive};padding:24px 32px;border-radius:12px 12px 0 0;text-align:center;">
              <span style="font-size:22px;font-weight:700;color:${BRAND.white};letter-spacing:-0.3px;">🐾 Flocken</span>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="background-color:${BRAND.white};padding:36px 32px;border-radius:0 0 12px 12px;">
              ${content}
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:24px 0;text-align:center;">
              <p style="margin:0;font-size:12px;color:${BRAND.gray};line-height:1.6;">
                © Spitakolus AB · Du får det här eftersom du registrerat dig på quiz.flocken.info
              </p>
              <p style="margin:8px 0 0;font-size:12px;">
                <a href="${BRAND.unsubscribeUrl}" style="color:${BRAND.gray};text-decoration:underline;">Avregistrera dig</a>
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

function ctaButton(text: string, url: string): string {
  return `<table cellpadding="0" cellspacing="0" style="margin:24px 0;">
    <tr>
      <td style="background-color:${BRAND.olive};border-radius:8px;">
        <a href="${url}" style="display:inline-block;padding:14px 28px;font-size:15px;font-weight:600;color:${BRAND.white};text-decoration:none;border-radius:8px;letter-spacing:-0.1px;">${text}</a>
      </td>
    </tr>
  </table>`;
}

function flockenPromo(): string {
  return `<table cellpadding="0" cellspacing="0" width="100%" style="margin-top:28px;border-top:1px solid ${BRAND.sand};">
    <tr>
      <td style="padding-top:24px;">
        <p style="margin:0 0 6px;font-size:13px;font-weight:700;color:${BRAND.brown};">Prova Flocken – gratis</p>
        <p style="margin:0 0 12px;font-size:13px;color:${BRAND.gray};line-height:1.6;">
          Hitta hundvänner, hundvakter och hundvänliga platser nära dig.
        </p>
        <a href="https://flocken.info/download" style="font-size:13px;font-weight:600;color:${BRAND.olive};text-decoration:underline;">Ladda ner appen (gratis)</a>
      </td>
    </tr>
  </table>`;
}

// =============================================================================
// VÄLKOMSTMEJL – skickas direkt vid registrering
// Innehåller länk till kända hundar-quizet som lead magnet
// =============================================================================
export function buildWelcomeEmail(): { subject: string; html: string; text: string } {
  const quizUrl = `${BRAND.baseUrl}/kanda_hundar`;

  const content = `
    <h1 style="margin:0 0 8px;font-size:24px;font-weight:700;color:${BRAND.brown};line-height:1.3;">
      Ditt bonusquiz väntar! 🐶
    </h1>
    <p style="margin:0 0 20px;font-size:16px;color:${BRAND.gray};line-height:1.6;">
      Tack för att du registrerade dig.
    </p>

    <p style="margin:0 0 8px;font-size:15px;color:${BRAND.brown};line-height:1.7;">
      Som utlovat – här är quizet om <strong>kända hundar</strong>. Känner du igen dem alla?
    </p>

    ${ctaButton('Starta quizet om kända hundar', quizUrl)}

    <p style="margin:0;font-size:14px;color:${BRAND.gray};line-height:1.7;">
      Vi hör av oss när vi släpper nästa quiz.
    </p>

    ${flockenPromo()}
  `;

  const text = `Ditt bonusquiz väntar!\n\nTack för att du registrerade dig på Flocken Quiz.\n\nHär är quizet om kända hundar: ${quizUrl}\n\nVi hör av oss när vi släpper nästa quiz.\n\n© Spitakolus AB\nAvregistrera dig: ${BRAND.unsubscribeUrl}`;

  return {
    subject: 'Ditt quiz om kända hundar – öppna och testa 🐾',
    html: emailWrapper(content),
    text,
  };
}

// =============================================================================
// NYTT QUIZ-NOTIS – broadcast när ett nytt quiz släpps
// Anropas manuellt via /api/email/broadcast (byggs senare)
// =============================================================================
export function buildNewQuizEmail(params: {
  quizTitle: string;
  quizSlug: string;
  teaser: string;
}): { subject: string; html: string; text: string } {
  const quizUrl = `${BRAND.baseUrl}/${params.quizSlug}`;

  const content = `
    <h1 style="margin:0 0 8px;font-size:24px;font-weight:700;color:${BRAND.brown};line-height:1.3;">
      Nytt quiz! 🎉
    </h1>

    <p style="margin:0 0 20px;font-size:16px;color:${BRAND.brown};font-weight:600;">
      ${params.quizTitle}
    </p>

    <p style="margin:0 0 8px;font-size:15px;color:${BRAND.brown};line-height:1.7;">
      ${params.teaser}
    </p>

    ${ctaButton('Ta quizet nu', quizUrl)}

    <p style="margin:0;font-size:14px;color:${BRAND.gray};line-height:1.7;">
      Du får det här mejlet för att du registrerade dig på quiz.flocken.info.
    </p>

    ${flockenPromo()}
  `;

  const text = `Nytt quiz: ${params.quizTitle}\n\n${params.teaser}\n\nTa quizet här: ${quizUrl}\n\n© Spitakolus AB\nAvregistrera dig: ${BRAND.unsubscribeUrl}`;

  return {
    subject: `Nytt quiz: ${params.quizTitle} 🐾`,
    html: emailWrapper(content),
    text,
  };
}
