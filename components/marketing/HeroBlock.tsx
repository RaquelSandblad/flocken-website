import Image from 'next/image';

interface HeroBlockProps {
  title: string;
  tagline: string;
  subtitle: string;
  ctaPrimary: { text: string; href: string };
  ctaSecondary?: { text: string; href: string };
  image: string;
  launchOffer?: string;
  appStoreComingSoon?: string;
  launchInfo?: string;
}

export function HeroBlock({ 
  title, 
  tagline, 
  subtitle, 
  ctaPrimary, 
  ctaSecondary, 
  image, 
  launchOffer,
  appStoreComingSoon,
  launchInfo
}: HeroBlockProps) {
  return (
    <section className="relative min-h-screen flex items-center bg-gradient-to-br from-white to-flocken-cream pt-20">
      <div className="container-custom py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Copy + CTA */}
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-5xl lg:text-7xl font-bold text-flocken-brown leading-tight">
                {title}
                <span className="block text-4xl lg:text-5xl text-flocken-olive mt-2">
                  {tagline}
                </span>
              </h1>
              
              <p className="text-xl lg:text-2xl text-flocken-brown opacity-90 leading-relaxed">
                {subtitle}
              </p>
            </div>

            {/* Launch Info */}
            {launchInfo && (
              <p className="text-lg text-flocken-brown opacity-80">
                {launchInfo}
              </p>
            )}

            {/* CTAs */}
            <div className="space-y-4">
              <div className="flex flex-col items-center gap-4">
                <a href={ctaPrimary.href} className="btn-primary inline-flex items-center justify-center">
                  {/* Google Play icon */}
                  <svg className="w-6 h-6 mr-2" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.53,12.9 20.18,13.18L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z"/>
                  </svg>
                  {ctaPrimary.text}
                </a>
                
                {appStoreComingSoon && (
                  <p className="text-sm text-flocken-olive font-medium">
                    {appStoreComingSoon}
                  </p>
                )}
              </div>
              
              {launchOffer && (
                <p className="text-base text-flocken-brown opacity-75 text-center">
                  {launchOffer}
                </p>
              )}
            </div>
          </div>

          {/* Hero Image */}
          <div className="relative h-[400px] lg:h-[600px] rounded-3xl overflow-hidden shadow-elevated">
            <Image
              src={image}
              alt="Flocken app hero"
              fill
              className="object-cover"
              priority
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

