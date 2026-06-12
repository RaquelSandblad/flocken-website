/**
 * /event/[id] — Publik landningssida för delade kalenderhändelser från appen.
 *
 * Flödet: användare delar ett event i appen → mottagaren får en
 * https://flocken.info/event/<id>-länk. Har mottagaren appen öppnas eventet
 * direkt via universal/app links; annars visas den här sidan med titel,
 * datum, tid, plats och vilka som är intresserade + knappar för att
 * öppna/hämta appen.
 *
 * Interaktion (anmäla intresse) sker ALLTID i appen med konto — sidan är
 * medvetet läs-och-läck-ingenting: den hämtar bara det RLS redan gör publikt
 * (is_active=true, godkända företagsprofiler, deltagare/hundar som redan
 * visas för gäster i appen) med publika anon-nycklar.
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

interface EventDog {
  id: string;
  name: string;
  image: string | null;
}

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
  dog_id: string | null;
  business_id: string | null;
  businessName?: string | null;
  participantCount: number;
  dogs: EventDog[];
  locale: string;
}

async function fetchFromRegion(
  region: (typeof REGIONS)[number],
  id: string
): Promise<SharedEvent | null> {
  const headers = { apikey: region.anonKey, Authorization: `Bearer ${region.anonKey}` };
  const get = async (path: string) => {
    const res = await fetch(`${region.url}/rest/v1/${path}`, {
      headers,
      next: { revalidate: 300 },
    });
    return res.ok ? res.json() : null;
  };

  try {
    const rows = (await get(
      `calendar_events?id=eq.${id}&is_active=eq.true` +
        `&select=id,title,description,event_type,event_date,start_time,end_time,location_name,city,dog_id,business_id`
    )) as Omit<SharedEvent, 'locale' | 'participantCount' | 'dogs'>[] | null;
    if (!rows?.length) return null;

    const event: SharedEvent = {
      ...rows[0],
      locale: region.locale,
      participantCount: 0,
      dogs: [],
    };

    // Arrangerande företag (RLS visar bara godkända profiler)
    if (event.business_id) {
      try {
        const biz = (await get(`business_profiles?id=eq.${event.business_id}&select=name`)) as
          | { name: string }[]
          | null;
        event.businessName = biz?.[0]?.name ?? null;
      } catch {}
    }

    // Intresserade + deras hundar (samma data som gäster ser i appen)
    try {
      const parts = (await get(
        `event_participants?event_id=eq.${id}&select=user_id,dog_id`
      )) as { user_id: string; dog_id: string | null }[] | null;
      event.participantCount = parts?.length ?? 0;

      const dogIds = [
        ...new Set(
          [event.dog_id, ...(parts ?? []).map(p => p.dog_id)].filter(Boolean) as string[]
        ),
      ];
      if (dogIds.length > 0) {
        const dogs = (await get(
          `dogs?id=in.(${dogIds.join(',')})&select=id,name,images`
        )) as { id: string; name: string; images: string[] | null }[] | null;
        event.dogs = (dogs ?? []).map(d => ({
          id: d.id,
          name: d.name,
          image: Array.isArray(d.images) && d.images.length > 0 ? d.images[0] : null,
        }));
        // Skaparens hund först, som i appen
        event.dogs.sort((a, b) => (a.id === event.dog_id ? -1 : b.id === event.dog_id ? 1 : 0));
      }
    } catch {}

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

const EVENT_TYPE_LABELS: Record<string, { sv: string; pt: string }> = {
  walk: { sv: 'Hundpromenad', pt: 'Passeio com cães' },
  course: { sv: 'Kurs', pt: 'Curso' },
  city_event: { sv: 'Händelse', pt: 'Evento' },
};

// ─── Ikoner i Flocken-stil (linje-ikoner i oliv, samma manér som appen) ──────

function IconCalendar() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="mt-0.5 h-5 w-5 shrink-0 text-flocken-olive"
      aria-hidden
    >
      <rect x="3" y="5" width="18" height="16" rx="3" />
      <path d="M8 3v4M16 3v4M3 10h18" />
    </svg>
  );
}

function IconPin() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="mt-0.5 h-5 w-5 shrink-0 text-flocken-olive"
      aria-hidden
    >
      <path d="M12 21.5S5 15.6 5 10a7 7 0 0 1 14 0c0 5.6-7 11.5-7 11.5z" />
      <circle cx="12" cy="10" r="2.6" />
    </svg>
  );
}

function IconBriefcase() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="mt-0.5 h-4 w-4 shrink-0 text-flocken-olive"
      aria-hidden
    >
      <rect x="3" y="8" width="18" height="12" rx="2.5" />
      <path d="M9 8V6a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2M3 13h18" />
    </svg>
  );
}

/** Tassavtryck — platshållare för hundar utan bild. */
function IconPaw({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <ellipse cx="12" cy="15.5" rx="4.2" ry="3.6" />
      <ellipse cx="6.2" cy="10.5" rx="1.9" ry="2.4" />
      <ellipse cx="10" cy="7.5" rx="1.9" ry="2.5" />
      <ellipse cx="14" cy="7.5" rx="1.9" ry="2.5" />
      <ellipse cx="17.8" cy="10.5" rx="1.9" ry="2.4" />
    </svg>
  );
}

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

  const n = event.participantCount;
  const t = {
    organizer: isPt ? 'Organizado por' : 'Arrangeras av',
    openInApp: isPt ? 'Abrir no app Flocken' : 'Öppna i Flocken-appen',
    getApp: isPt ? 'Baixar o app Flocken' : 'Hämta Flocken-appen',
    interested:
      n === 1
        ? isPt
          ? '1 pessoa está interessada'
          : '1 person är intresserad'
        : isPt
          ? `${n} pessoas estão interessadas`
          : `${n} personer är intresserade`,
    interactHint: isPt
      ? 'Para demonstrar interesse e participar, você precisa do app Flocken e de uma conta — leva um minutinho.'
      : 'För att anmäla intresse och delta behöver du Flocken-appen och ett konto — det tar bara en minut.',
  };

  const MAX_DOGS_SHOWN = 5;
  const shownDogs = event.dogs.slice(0, MAX_DOGS_SHOWN);
  const extraDogs = event.dogs.length - shownDogs.length;

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
          <div className="bg-flocken-olive px-6 py-7 text-center">
            <span className="inline-block rounded-full bg-white/20 px-4 py-1.5 text-small font-bold text-white uppercase tracking-wide">
              {isPt ? typeMeta.pt : typeMeta.sv}
            </span>
          </div>

          <div className="p-6 md:p-8">
            <h1 className="text-h4 md:text-h3 font-extrabold text-flocken-brown">
              {event.title}
            </h1>

            {event.businessName ? (
              <p className="mt-2 flex items-center gap-2 text-small font-semibold text-flocken-olive">
                <IconBriefcase />
                {t.organizer} {event.businessName}
              </p>
            ) : null}

            <div className="mt-4 space-y-2.5 text-body text-flocken-brown">
              <p className="flex items-start gap-2.5">
                <IconCalendar />
                <span>{formatEventDate(event)}</span>
              </p>
              {place ? (
                <p className="flex items-start gap-2.5">
                  <IconPin />
                  <span>{place}</span>
                </p>
              ) : null}
            </div>

            {event.description ? (
              <p className="mt-4 text-small leading-relaxed text-flocken-brown/80 whitespace-pre-line">
                {event.description}
              </p>
            ) : null}

            {/* Intresserade */}
            {(n > 0 || event.dogs.length > 0) && (
              <div className="mt-5 rounded-xl bg-flocken-cream px-4 py-3.5">
                {event.dogs.length > 0 ? (
                  <div className="mb-2 flex items-center">
                    {shownDogs.map((dog, i) => (
                      <span
                        key={dog.id}
                        title={dog.name}
                        className={`inline-block h-10 w-10 overflow-hidden rounded-full border-2 border-white bg-flocken-sand shadow-soft ${i > 0 ? '-ml-2.5' : ''}`}
                      >
                        {dog.image ? (
                          // eslint-disable-next-line @next/next/no-img-element -- externa S3-bilder, undviker remotePatterns-config
                          <img
                            src={dog.image}
                            alt={dog.name}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <IconPaw className="h-full w-full p-2 text-flocken-olive" />
                        )}
                      </span>
                    ))}
                    {extraDogs > 0 ? (
                      <span className="-ml-2.5 inline-flex h-10 w-10 items-center justify-center rounded-full border-2 border-white bg-flocken-olive text-small font-bold text-white shadow-soft">
                        +{extraDogs}
                      </span>
                    ) : null}
                    <span className="ml-3 text-small font-semibold text-flocken-brown">
                      {shownDogs.map(d => d.name).join(', ')}
                      {extraDogs > 0 ? ` +${extraDogs}` : ''}
                    </span>
                  </div>
                ) : null}
                {n > 0 ? (
                  <p className="text-small text-flocken-brown/80">{t.interested}</p>
                ) : null}
              </div>
            )}

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
