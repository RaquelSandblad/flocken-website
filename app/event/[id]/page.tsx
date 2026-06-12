/**
 * /event/[id] — Publik landningssida för delade kalenderhändelser från appen.
 *
 * Flödet: användare delar ett event i appen → mottagaren får en
 * https://flocken.info/event/<id>-länk. Har mottagaren appen öppnas eventet
 * direkt via universal/app links; annars visas den här sidan med titel,
 * datum, tid och plats + knappar för att öppna/hämta appen.
 *
 * Interaktion (anmäla intresse) sker ALLTID i appen med konto — sidan är
 * medvetet läs-och-läck-ingenting: den hämtar bara det RLS redan gör publikt
 * (is_active=true, godkända företagsprofiler) med publika anon-nycklar.
 *
 * Appen finns i två regioner med separata databaser — vi provar Europa först
 * och faller tillbaka till Brasilien.
 */

import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';

// Publika anon-nycklar — samma som skeppas i appbundlen, medvetet ej hemliga.
const REGIONS = [
  {
    name: 'europe',
    url: 'https://jzbdxcsocwdxwzjjlnrw.supabase.co',
    anonKey:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp6YmR4Y3NvY3dkeHd6ampsbnJ3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjEyMjY4NTEsImV4cCI6MjA3NjgwMjg1MX0.eWpRvtv_2dClpwRYnLsD8yvNWz75jd1J42KLstVGpd4',
    locale: 'sv-SE',
  },
  {
    name: 'brazil',
    url: 'https://vdpdehoreqjlenvqumho.supabase.co',
    anonKey:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZkcGRlaG9yZXFqbGVudnF1bWhvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg0OTY0NDQsImV4cCI6MjA5NDA3MjQ0NH0.kVj5K22XGa5caJtSvzQwWYSB57C4nEY3-gapI-v_PSU',
    locale: 'pt-BR',
  },
] as const;

const UUID_RE = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;

interface SharedEvent {
  id: string;
  title: string;
  description: string | null;
  event_type: 'walk' | 'course' | 'city_event';
  event_date: string;
  start_time: string | null;
  end_time: string | null;
  location_name: string | null;
  city: string | null;
  business_id: string | null;
  businessName?: string | null;
  locale: string;
}

async function fetchFromRegion(
  region: (typeof REGIONS)[number],
  id: string
): Promise<SharedEvent | null> {
  const headers = { apikey: region.anonKey, Authorization: `Bearer ${region.anonKey}` };
  try {
    const res = await fetch(
      `${region.url}/rest/v1/calendar_events?id=eq.${id}&is_active=eq.true` +
        `&select=id,title,description,event_type,event_date,start_time,end_time,location_name,city,business_id`,
      { headers, next: { revalidate: 300 } }
    );
    if (!res.ok) return null;
    const rows = (await res.json()) as Omit<SharedEvent, 'locale'>[];
    if (!rows.length) return null;
    const event: SharedEvent = { ...rows[0], locale: region.locale };

    // Arrangerande företag (RLS visar bara godkända profiler)
    if (event.business_id) {
      try {
        const bizRes = await fetch(
          `${region.url}/rest/v1/business_profiles?id=eq.${event.business_id}&select=name`,
          { headers, next: { revalidate: 300 } }
        );
        if (bizRes.ok) {
          const biz = (await bizRes.json()) as { name: string }[];
          event.businessName = biz[0]?.name ?? null;
        }
      } catch {}
    }
    return event;
  } catch {
    return null;
  }
}

async function getEvent(id: string): Promise<SharedEvent | null> {
  if (!UUID_RE.test(id)) return null;
  for (const region of REGIONS) {
    const event = await fetchFromRegion(region, id);
    if (event) return event;
  }
  return null;
}

function formatEventDate(event: SharedEvent): string {
  const date = new Date(`${event.event_date}T00:00:00`);
  const dateText = date.toLocaleDateString(event.locale, {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
  if (!event.start_time) return dateText;
  const kl = event.locale === 'pt-BR' ? 'às' : 'kl';
  const time = event.start_time.substring(0, 5);
  const end = event.end_time ? `–${event.end_time.substring(0, 5)}` : '';
  return `${dateText} ${kl} ${time}${end}`;
}

const EVENT_TYPE_LABELS: Record<string, { sv: string; pt: string; emoji: string }> = {
  walk: { sv: 'Hundpromenad', pt: 'Passeio com cães', emoji: '🐾' },
  course: { sv: 'Kurs', pt: 'Curso', emoji: '🎓' },
  city_event: { sv: 'Händelse', pt: 'Evento', emoji: '📍' },
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const event = await getEvent(id);
  if (!event) {
    return { title: 'Händelse' };
  }
  const place = [event.location_name, event.city].filter(Boolean).join(', ');
  const description = [`📅 ${formatEventDate(event)}`, place ? `📍 ${place}` : null]
    .filter(Boolean)
    .join('  ·  ');
  return {
    title: event.title,
    description,
    openGraph: {
      title: event.title,
      description,
      siteName: 'Flocken',
      type: 'website',
    },
  };
}

export default async function EventPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const event = await getEvent(id);
  if (!event) notFound();

  const isPt = event.locale === 'pt-BR';
  const typeMeta = EVENT_TYPE_LABELS[event.event_type] ?? EVENT_TYPE_LABELS.city_event;
  const place = [event.location_name, event.city].filter(Boolean).join(', ');

  const t = {
    organizer: isPt ? 'Organizado por' : 'Arrangeras av',
    openInApp: isPt ? 'Abrir no app Flocken' : 'Öppna i Flocken-appen',
    getApp: isPt ? 'Baixar o app Flocken' : 'Hämta Flocken-appen',
    interactHint: isPt
      ? 'Para demonstrar interesse e participar, você precisa do app Flocken e de uma conta — leva um minutinho.'
      : 'För att anmäla intresse och delta behöver du Flocken-appen och ett konto — det tar bara en minut.',
  };

  return (
    <main className="min-h-screen bg-flocken-cream flex flex-col items-center justify-center px-4 py-12 md:py-16">
      <div className="w-full max-w-md">
        {/* Logotyp */}
        <Link
          href="/"
          className="mb-6 flex items-center justify-center gap-2 hover:opacity-80 transition-opacity"
          aria-label="Flocken — till startsidan"
        >
          <Image
            src="/assets/flocken/logo/logo_icon_flocken_large_1x1.png"
            alt=""
            width={28}
            height={28}
            className="rounded-lg"
            priority
          />
          <span className="text-base font-bold text-flocken-brown">Flocken</span>
        </Link>

        <div className="rounded-2xl bg-white shadow-card border border-flocken-warm overflow-hidden">
          {/* Hero */}
          <div className="bg-flocken-olive px-6 py-8 text-center">
            <div className="text-4xl mb-3" aria-hidden>{typeMeta.emoji}</div>
            <span className="inline-block rounded-full bg-white/20 px-3 py-1 text-small font-bold text-white uppercase tracking-wide">
              {isPt ? typeMeta.pt : typeMeta.sv}
            </span>
          </div>

          <div className="p-6 md:p-8">
            <h1 className="text-h4 md:text-h3 font-extrabold text-flocken-brown">
              {event.title}
            </h1>

            {event.businessName ? (
              <p className="mt-2 text-small font-semibold text-flocken-olive">
                💼 {t.organizer} {event.businessName}
              </p>
            ) : null}

            <div className="mt-4 space-y-2 text-body text-flocken-brown">
              <p>📅 {formatEventDate(event)}</p>
              {place ? <p>📍 {place}</p> : null}
            </div>

            {event.description ? (
              <p className="mt-4 text-small leading-relaxed text-flocken-brown/80 whitespace-pre-line">
                {event.description}
              </p>
            ) : null}

            <div className="mt-6 space-y-3">
              <a
                href={`flocken://event/${event.id}`}
                className="block w-full rounded-xl bg-flocken-olive px-4 py-3 text-center font-bold text-white hover:bg-flocken-accent transition-colors"
              >
                {t.openInApp}
              </a>
              <Link
                href={`/download?utm_source=event_share&utm_content=${event.id}`}
                className="block w-full rounded-xl border-2 border-flocken-olive px-4 py-3 text-center font-bold text-flocken-olive hover:bg-flocken-sand/40 transition-colors"
              >
                {t.getApp}
              </Link>
            </div>

            <p className="mt-5 text-center text-small leading-relaxed text-flocken-brown/80">
              {t.interactHint}
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
