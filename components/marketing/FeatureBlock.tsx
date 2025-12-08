import { PhoneMockup } from './PhoneMockup';

interface FeatureBlockProps {
  title: string;
  subtitle: string;
  bullets: string[];
  screenshot: string;
  badge?: string;
  microCta?: string;
  reverse?: boolean;
}

export function FeatureBlock({
  title,
  subtitle,
  bullets,
  screenshot,
  badge,
  microCta,
  reverse = false
}: FeatureBlockProps) {
  return (
    <section className="section-padding bg-white even:bg-flocken-cream">
      <div className="container-custom">
        <div className={`grid lg:grid-cols-2 gap-12 items-center ${
          reverse ? '' : ''
        }`}>
          {/* Screenshot */}
          <div className={`flex justify-center ${reverse ? 'lg:order-2' : 'lg:order-1'}`}>
            <PhoneMockup screenshot={screenshot} badge={badge} />
          </div>
          
          {/* Copy */}
          <div className={`space-y-6 ${reverse ? 'lg:order-1' : 'lg:order-2'}`}>
            <div>
              <h2 className="text-3xl lg:text-5xl font-bold text-flocken-brown mb-4">
                {title}
              </h2>
              <p className="text-lg text-flocken-brown">
                {subtitle}
              </p>
            </div>
            
            <ul className="space-y-3">
              {bullets.map((bullet, i) => (
                <li key={i} className="flex items-start gap-3">
                  <svg className="w-6 h-6 text-flocken-olive flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                  </svg>
                  <span className="text-flocken-brown">{bullet}</span>
                </li>
              ))}
            </ul>
            
            {microCta && (
              <a href="#" className="inline-flex items-center text-flocken-olive font-semibold hover:text-flocken-accent transition-colors">
                {microCta}
                <svg className="w-5 h-5 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </a>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

