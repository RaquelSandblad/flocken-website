import Image from 'next/image';

interface HeroBlockProps {
  title: string;
  tagline: string;
  subtitle: string;
  ctaPrimary: { text: string; href: string };
  ctaSecondary?: { text: string; href: string };
  image: string;
  launchOffer?: string;
}

export function HeroBlock({ 
  title, 
  tagline, 
  subtitle, 
  ctaPrimary, 
  ctaSecondary, 
  image, 
  launchOffer 
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

            {/* CTAs */}
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <a href={ctaPrimary.href} className="btn-primary inline-flex items-center justify-center">
                  {/* App Store icon */}
                  <svg className="w-6 h-6 mr-2" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18.71 19.5C17.88 20.74 17 21.95 15.66 21.97C14.32 22 13.89 21.18 12.37 21.18C10.84 21.18 10.37 21.95 9.09997 22C7.78997 22.05 6.79997 20.68 5.95997 19.47C4.24997 17 2.93997 12.45 4.69997 9.39C5.56997 7.87 7.12997 6.91 8.81997 6.88C10.1 6.86 11.32 7.75 12.11 7.75C12.89 7.75 14.37 6.68 15.92 6.84C16.57 6.87 18.39 7.1 19.56 8.82C19.47 8.88 17.39 10.1 17.41 12.63C17.44 15.65 20.06 16.66 20.09 16.67C20.06 16.74 19.67 18.11 18.71 19.5ZM13 3.5C13.73 2.67 14.94 2.04 15.94 2C16.07 3.17 15.6 4.35 14.9 5.19C14.21 6.04 13.07 6.7 11.95 6.61C11.8 5.46 12.36 4.26 13 3.5Z"/>
                  </svg>
                  {ctaPrimary.text}
                </a>
                
                {ctaSecondary && (
                  <a href={ctaSecondary.href} className="btn-primary inline-flex items-center justify-center">
                    {/* Google Play icon */}
                    <svg className="w-6 h-6 mr-2" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.53,12.9 20.18,13.18L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z"/>
                    </svg>
                    {ctaSecondary.text}
                  </a>
                )}
              </div>
              
              {launchOffer && (
                <p className="text-sm text-flocken-olive font-medium">
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

