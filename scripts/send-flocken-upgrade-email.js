/**
 * FLOCKEN – Skicka uppgraderingsmejl till gratis-användare
 *
 * TEST-läge: skickar bara till TEST_EMAIL
 * Fullt läge: skickar till alla profiles.plan = 'free'
 *
 * Kör: node scripts/send-flocken-upgrade-email.js
 * Kör fullt: node scripts/send-flocken-upgrade-email.js --send-all
 */

const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');
const { Resend } = require('resend');

// ── Läs .env.local ──────────────────────────────────────────────────────────
const envPath = path.join(__dirname, '..', '.env.local');
const envVars = {};
if (fs.existsSync(envPath)) {
  fs.readFileSync(envPath, 'utf8').split('\n').forEach(line => {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#')) {
      const m = trimmed.match(/^([^#=]+)=(.*)$/);
      if (m) envVars[m[1].trim()] = m[2].trim().replace(/^["']|["']$/g, '');
    }
  });
}

const SUPABASE_URL        = envVars['SUPABASE_URL'] || '';
const SERVICE_ROLE_KEY    = envVars['SUPABASE_SERVICE_ROLE_KEY'] || '';
const RESEND_API_KEY      = envVars['RESEND_API_KEY'] || '';

if (!SUPABASE_URL || !SERVICE_ROLE_KEY || !RESEND_API_KEY) {
  console.error('❌ Saknar miljövariabler i .env.local:');
  if (!SUPABASE_URL)     console.error('   – SUPABASE_URL');
  if (!SERVICE_ROLE_KEY) console.error('   – SUPABASE_SERVICE_ROLE_KEY');
  if (!RESEND_API_KEY)   console.error('   – RESEND_API_KEY');
  process.exit(1);
}

// ── Konfiguration ────────────────────────────────────────────────────────────
const TEST_EMAIL  = 'tb.sandblad+11@gmail.com'; // Standardtest
const SEND_ALL    = process.argv.includes('--send-all');
const TO_ARG      = (() => { const i = process.argv.indexOf('--to'); return i > -1 ? process.argv[i+1] : null; })();
const FROM_EMAIL  = 'Flocken <support@flocken.info>';
const REPLY_TO    = 'support@flocken.info';

// Djuplänk till uppgradera-skärmen i appen
// Obs: flocken:// fungerar i mobilmejl-appar (Gmail-app, Apple Mail osv)
const UPGRADE_URL = 'flocken://mina-sidor';

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);
const resend   = new Resend(RESEND_API_KEY);

// ── E-post HTML ──────────────────────────────────────────────────────────────
function buildEmailHTML() {
  return `<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Sista dagen att uppgradera gratis</title>
</head>
<body style="margin:0;padding:0;background-color:#F5F1E8;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#F5F1E8;">
    <tr>
      <td align="center" style="padding:20px 0;">
        <table width="600" cellpadding="0" cellspacing="0" border="0" style="background-color:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.08);">

          <!-- HEADER -->
          <tr>
            <td style="background-color:#6B7A3A;padding:36px 30px 32px 30px;text-align:center;">
              <img src="https://quiz.flocken.info/email-assets/ikon.png"
                   alt="Flocken"
                   width="72" height="72"
                   style="display:block;margin:0 auto 16px auto;border-radius:16px;" />
              <p style="color:#ffffff;margin:0;font-size:22px;font-weight:700;line-height:1.3;">Sista chansen att testa Premium gratis</p>
            </td>
          </tr>

          <!-- BODY -->
          <tr>
            <td style="padding:40px 36px;">

              <p style="color:#3E3B32;font-size:17px;line-height:1.7;margin:0 0 20px 0;">
                Idag, tisdag 31 mars, är sista dagen att uppgradera helt gratis till Flockens Premium-konto i 6 månader.
              </p>

              <p style="color:#3E3B32;font-size:16px;line-height:1.7;margin:0 0 28px 0;">
                Testa Flocken-appen fullt ut under hela sommaren och in i hösten (värde 234 kr).
                När perioden är slut övergår ditt konto automatiskt till ett gratiskonto, precis som idag, utan att du behöver göra någonting.
              </p>

              <!-- KNAPP -->
              <table width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td align="center" style="padding:0 0 12px 0;">
                    <table cellpadding="0" cellspacing="0" border="0">
                      <tr>
                        <td style="background-color:#6B7A3A;border-radius:8px;">
                          <a href="${UPGRADE_URL}"
                             style="display:inline-block;padding:16px 44px;color:#ffffff;text-decoration:none;font-weight:700;font-size:17px;letter-spacing:0.3px;">
                            Uppgradera ditt konto här
                          </a>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                <tr>
                  <td align="center" style="padding:0 0 32px 0;">
                    <p style="color:#A29D89;font-size:13px;margin:0;line-height:1.6;">
                      Funkar inte knappen? Uppgradera under <strong>Mina sidor</strong> i Flocken-appen.
                    </p>
                  </td>
                </tr>
              </table>

              <p style="color:#3E3B32;font-size:16px;line-height:1.7;margin:0 0 20px 0;">
                Med Premium kan du bl.a. visa upp din egen hund, söka hundar och kontakta eller ta emot meddelanden från hundägare direkt i appen.
              </p>

              <p style="color:#3E3B32;font-size:16px;line-height:1.7;margin:0 0 32px 0;">
                Vi tror helt enkelt att Flocken blir bättre och roligare för alla ju fler som är med. Därför gör vi det gratis lägga upp sin hund eller hundvaktsprofil under en längre period.
              </p>

              <!-- INFO-BOX -->
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:0 0 32px 0;">
                <tr>
                  <td style="background-color:#E8DCC0;border-left:4px solid #6B7A3A;border-radius:6px;padding:16px 20px;">
                    <p style="color:#3E3B32;margin:0;font-size:15px;font-weight:600;">
                      🗓 Sista dag för erbjudandet är den 31 mars 2026
                    </p>
                  </td>
                </tr>
              </table>

              <p style="color:#A29D89;font-size:13px;line-height:1.6;margin:0;text-align:center;">
                Frågor? Svara på det här mejlet eller skriv till
                <a href="mailto:${REPLY_TO}" style="color:#6B7A3A;">${REPLY_TO}</a>
              </p>

            </td>
          </tr>

          <!-- FOOTER -->
          <tr>
            <td style="background-color:#3E3B32;padding:24px 30px;text-align:center;">
              <p style="color:#E8DCC0;margin:0;font-size:14px;font-weight:600;">Flocken – ett enklare liv som hundägare</p>
              <p style="color:#A29D89;margin:8px 0 0 0;font-size:12px;">© 2026 Spitakolus AB</p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

// ── Hämta gratis-användare ───────────────────────────────────────────────────
async function getFreeUsers() {
  console.log('🔍 Hämtar gratis-användare från Supabase...');

  const { data: profiles, error: profileError } = await supabase
    .from('profiles')
    .select('id, full_name, email')
    .eq('subscription_status', 'inactive')
    .not('email', 'is', null);

  if (profileError) throw new Error(`Profiles-fel: ${profileError.message}`);
  console.log(`   Hittade ${profiles.length} profiler med subscription_status='inactive'`);

  return profiles.map(p => ({
    email: p.email,
    name: p.full_name || p.email
  }));
}

// ── Skicka ett mejl ──────────────────────────────────────────────────────────
async function sendEmail(email, name) {
  const { data, error } = await resend.emails.send({
    from: FROM_EMAIL,
    to: email,
    replyTo: REPLY_TO,
    subject: 'Sista dagen att uppgradera gratis',
    html: buildEmailHTML(),
  });

  if (error) throw new Error(`Resend-fel för ${email}: ${JSON.stringify(error)}`);
  return data?.id;
}

// ── Main ─────────────────────────────────────────────────────────────────────
async function main() {
  console.log('');
  console.log('📬 FLOCKEN – Uppgraderingsmejl');
  console.log('──────────────────────────────');

  if (!SEND_ALL) {
    // TEST-läge – skicka till --to adress eller standardtest
    const target = TO_ARG || TEST_EMAIL;
    console.log(`🧪 TEST-LÄGE: Skickar till ${target}`);
    const id = await sendEmail(target, 'Testare');
    console.log(`✅ Testmejl skickat! Resend-ID: ${id}`);
    console.log('');
    console.log('👉 Om testmejlet ser bra ut, kör med flaggan:');
    console.log('   node scripts/send-flocken-upgrade-email.js --send-all');
    return;
  }

  // FULLT UTSKICK
  console.log('🚀 FULLT UTSKICK – skickar till alla gratis-användare');
  const users = await getFreeUsers();
  console.log(`📊 Totalt ${users.length} mottagare`);
  console.log('');

  let sent = 0, failed = 0;

  for (const user of users) {
    try {
      const id = await sendEmail(user.email, user.name);
      console.log(`✅ ${user.email} (${id})`);
      sent++;
      // Vänta 200ms mellan mejl för att respektera rate limits
      await new Promise(r => setTimeout(r, 200));
    } catch (err) {
      console.error(`❌ ${user.email}: ${err.message}`);
      failed++;
    }
  }

  console.log('');
  console.log(`📊 Klart! Skickade: ${sent}, Misslyckade: ${failed}`);
}

main().catch(err => {
  console.error('❌ Kritiskt fel:', err.message);
  process.exit(1);
});
