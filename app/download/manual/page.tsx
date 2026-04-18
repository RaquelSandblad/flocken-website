import Link from 'next/link';
import QRCode from 'qrcode';
import { DownloadButtons } from '@/components/download/DownloadButtons';

const QR_URL =
  'https://flocken.info/download?utm_source=manual_page&utm_medium=qr&utm_campaign=download_desktop';

/**
 * Genererar en inline SVG-sträng för QR-koden server-side.
 * Faller tillbaka till null om genereringen misslyckas — UI visar
 * då en text-fallback istället för att krascha.
 */
async function generateQrSvg(url: string): Promise<string | null> {
  try {
    return await QRCode.toString(url, {
      type: 'svg',
      width: 200,
      margin: 2,
      color: {
        dark: '#3E3B32', // flocken-brown
        light: '#F5F1E8', // flocken-cream
      },
    });
  } catch {
    return null;
  }
}

export default async function ManualDownloadPage() {
  const qrSvg = await generateQrSvg(QR_URL);

  return (
    <main className="min-h-screen bg-gradient-to-br from-white to-flocken-cream flex items-center justify-center py-20 px-4">
      <div className="max-w-2xl w-full space-y-8 text-center">
        <div className="space-y-4">
          <h1 className="text-4xl lg:text-5xl font-bold text-flocken-brown">
            Hämta Flocken
          </h1>
          <p className="text-lg text-flocken-brown opacity-80">
            Välj din appbutik:
          </p>
        </div>

        <DownloadButtons />

        {/* QR-kod — öppna på din telefon */}
        <div className="flex flex-col items-center gap-3 pt-2">
          <p className="text-sm font-medium text-flocken-brown opacity-70">
            Eller skanna QR-koden med din telefon:
          </p>

          <div
            className="rounded-2xl border border-flocken-sand p-3 shadow-sm bg-flocken-cream"
            style={{ width: 220, height: 220 }}
            aria-label="QR-kod — öppna Flocken på din telefon"
          >
            {qrSvg ? (
              /* Inline SVG genererad server-side via qrcode-biblioteket */
              <div
                className="w-full h-full"
                // eslint-disable-next-line react/no-danger
                dangerouslySetInnerHTML={{ __html: qrSvg }}
              />
            ) : (
              /* Fallback om SVG-generering misslyckas */
              <div className="w-full h-full flex items-center justify-center rounded-xl bg-flocken-sand">
                <p className="text-xs text-flocken-gray text-center px-2">
                  QR-kod kunde inte laddas.
                  <br />
                  Besök flocken.info/download
                </p>
              </div>
            )}
          </div>

          <p className="text-xs text-flocken-gray max-w-[200px]">
            Skanna med kameran — öppnas direkt i rätt appbutik
          </p>
        </div>

        <p className="text-sm text-flocken-gray">
          Vill du veta mer först?{' '}
          <Link
            href="/funktioner"
            className="font-semibold text-flocken-olive underline underline-offset-2 hover:text-flocken-male"
          >
            Läs mer om Flocken
          </Link>
        </p>
      </div>
    </main>
  );
}
