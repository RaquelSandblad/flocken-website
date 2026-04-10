'use client';

interface Benefit {
  icon: JSX.Element;
  title: string;
  description: string;
}

const benefits: Benefit[] = [
  {
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    ),
    title: 'Hitta hundvakt',
    description: 'Trygga hundvakter med tydliga profiler',
  },
  {
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
      </svg>
    ),
    title: 'Hitta lekkompisar',
    description: 'Se hundar på kartan och ta kontakt direkt',
  },
  {
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
      </svg>
    ),
    title: 'Hundvänliga ställen',
    description: 'Upptäck caféer och platser som välkomnar hundar',
  },
  {
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
    title: 'Logga promenader',
    description: 'Spara rastrundor och samla poäng',
  },
];

export function QuickBenefitsSection() {
  return (
    <section className="section-padding bg-flocken-sand">
      <div className="container-custom">
        {/* Optional header - kan tas bort för att spara plats */}
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-flocken-brown mb-3">
            Allt för hundägare på ett ställe
          </h2>
          <p className="text-lg text-flocken-brown opacity-75">
            Slipp röriga grupper i sociala medier
          </p>
        </div>

        {/* Benefits Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {benefits.map((benefit, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl p-6 shadow-card hover:shadow-elevated transition-shadow duration-300 text-center"
            >
              {/* Icon */}
              <div className="w-16 h-16 mx-auto mb-4 bg-flocken-olive/10 rounded-2xl flex items-center justify-center text-flocken-olive">
                {benefit.icon}
              </div>

              {/* Title */}
              <h3 className="text-lg font-bold text-flocken-brown mb-2">
                {benefit.title}
              </h3>

              {/* Description */}
              <p className="text-sm text-flocken-brown opacity-75">
                {benefit.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
