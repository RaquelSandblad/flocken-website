import Link from "next/link";
import { trackAppInstall } from "@/lib/tracking";

const APPSTORE_URL = process.env.NEXT_PUBLIC_FLOCKEN_APPSTORE_URL || "https://apps.apple.com/app/flocken/id6755424578";
const PLAYSTORE_URL = process.env.NEXT_PUBLIC_FLOCKEN_PLAYSTORE_URL || "https://play.google.com/store/apps/details?id=com.bastavan.app";

export default function ManualDownloadPage() {
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

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href={APPSTORE_URL}
            onClick={() => trackAppInstall('ios', 'download_manual')}
            className="btn-primary inline-flex items-center justify-center"
          >
            <svg className="w-6 h-6 mr-2" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C1.79 15.25 2.1 7.59 9.5 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
            </svg>
            App Store
          </a>

          <a
            href={PLAYSTORE_URL}
            onClick={() => trackAppInstall('android', 'download_manual')}
            className="btn-primary inline-flex items-center justify-center"
          >
            <svg className="w-6 h-6 mr-2" fill="currentColor" viewBox="0 0 24 24">
              <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.53,12.9 20.18,13.18L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z"/>
            </svg>
            Google Play
          </a>
        </div>
      </div>
    </main>
  );
}
