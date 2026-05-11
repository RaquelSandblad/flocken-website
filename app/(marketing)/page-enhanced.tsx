'use client';

import { HeroBlock } from '@/components/marketing/HeroBlock';
import { FeatureBlock } from '@/components/marketing/FeatureBlock';
import { TestimonialBlock } from '@/components/marketing/TestimonialBlock';
import { trackAppInstall } from '@/lib/tracking';
import Image from 'next/image';

export default function HomePageEnhanced() {
  return (
    <>
      {/* 1. NYA HERO - Ett enklare liv som hundälskare */}
      <section className="section-padding bg-gradient-to-br from-flocken-olive to-flocken-accent pt-32">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-white space-y-6">
              <h1 className="text-4xl lg:text-6xl font-bold">
                Ett enklare liv som hundälskare
              </h1>
              <p className="text-xl lg:text-2xl leading-relaxed">
                Hitta hundar, hundvakt, promenader och hundvänliga platser. För hundägare, hundvakter, kennlar och hunddagis.
              </p>
              
              {/* Nyckelfunktioner direkt synliga */}
              <div className="grid grid-cols-2 gap-4 pt-4">
                <div className="flex items-start gap-3">
                  <svg className="w-6 h-6 flex-shrink-0 mt-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"/>
                  </svg>
                  <span className="text-lg">Karta och lista</span>
                </div>
                <div className="flex items-start gap-3">
                  <svg className="w-6 h-6 flex-shrink-0 mt-1" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2 5a2 2 0 012-2h7a2 2 0 012 2v4a2 2 0 01-2 2H9l-3 3v-3H4a2 2 0 01-2-2V5z"/>
                    <path d="M15 7v2a4 4 0 01-4 4H9.828l-1.766 1.767c.28.149.599.233.938.233h2l3 3v-3h2a2 2 0 002-2V9a2 2 0 00-2-2h-1z"/>
                  </svg>
                  <span className="text-lg">Chatt direkt i appen</span>
                </div>
                <div className="flex items-start gap-3">
                  <svg className="w-6 h-6 flex-shrink-0 mt-1" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                  </svg>
                  <span className="text-lg">Favoriter och bokningar</span>
                </div>
                <div className="flex items-start gap-3">
                  <svg className="w-6 h-6 flex-shrink-0 mt-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                  </svg>
                  <span className="text-lg">Trygg ungefärlig platsvisning</span>
                </div>
              </div>

              {/* CTA knappar */}
              <div className="flex flex-col sm:flex-row gap-4 pt-6">
                <a 
                  href="https://play.google.com/store/apps/details?id=com.bastavan.app" 
                  className="inline-flex items-center justify-center px-8 py-4 bg-white text-flocken-olive rounded-xl font-semibold text-lg hover:bg-flocken-cream transition-all hover:scale-105 shadow-soft"
                  onClick={() => trackAppInstall('android', 'hero')}
                >
                  <svg className="w-6 h-6 mr-2" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.53,12.9 20.18,13.18L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z"/>
                  </svg>
                  Ladda ner på Google Play
                </a>
                <a 
                  href="https://apps.apple.com/app/flocken/id6755424578" 
                  className="inline-flex items-center justify-center px-8 py-4 bg-white text-flocken-olive rounded-xl font-semibold text-lg hover:bg-flocken-cream transition-all hover:scale-105 shadow-soft"
                  onClick={() => trackAppInstall('ios', 'hero')}
                >
                  <svg className="w-6 h-6 mr-2" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C1.79 15.25 2.1 7.59 9.5 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
                  </svg>
                  Ladda ner på AppStore
                </a>
              </div>

              {/* Launch offer */}
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                <p className="text-white font-semibold">
                  Appen är alltid gratis. Testa premiumfunktioner gratis i 6 månader, gäller till den 31 mars.
                </p>
              </div>
            </div>

            <div className="relative h-[500px] rounded-2xl overflow-hidden shadow-card">
              <Image
                src="/assets/flocken/generated/flocken_image_malua-arlo-coco-jumping-dog-park_1x1.jpeg"
                alt="Hundägare med sina hundar i hundparken"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 2. NYA SEKTION: Vad du kan göra i Flocken */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto text-center mb-12">
            <h2 className="text-4xl lg:text-5xl font-bold text-flocken-brown mb-4">
              Vad du kan göra i Flocken
            </h2>
            <p className="text-xl text-flocken-brown">
              Sex sätt att förenkla ditt liv med hund
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <div className="bg-flocken-cream rounded-2xl p-6 text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-flocken-sand rounded-2xl flex items-center justify-center">
                <svg className="w-8 h-8 text-flocken-olive" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-flocken-brown mb-2">Hitta hundar nära dig</h3>
              <p className="text-flocken-brown">Lekkamrater, parningspartners och hundägare att träffa</p>
            </div>

            <div className="bg-flocken-cream rounded-2xl p-6 text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-flocken-sand rounded-2xl flex items-center justify-center">
                <svg className="w-8 h-8 text-flocken-olive" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-flocken-brown mb-2">Hitta hundvakt eller hunddagis</h3>
              <p className="text-flocken-brown">Tydliga profiler, priser och tillgänglighet</p>
            </div>

            <div className="bg-flocken-cream rounded-2xl p-6 text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-flocken-sand rounded-2xl flex items-center justify-center">
                <svg className="w-8 h-8 text-flocken-olive" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-flocken-brown mb-2">Skapa och dela promenader</h3>
              <p className="text-flocken-brown">GPS-tracking, statistik och hitta nya rundor</p>
            </div>

            <div className="bg-flocken-cream rounded-2xl p-6 text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-flocken-sand rounded-2xl flex items-center justify-center">
                <svg className="w-8 h-8 text-flocken-olive" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-flocken-brown mb-2">Upptäck hundvänliga platser</h3>
              <p className="text-flocken-brown">Caféer, restauranger, parker, stränder och hotell</p>
            </div>

            <div className="bg-flocken-cream rounded-2xl p-6 text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-flocken-sand rounded-2xl flex items-center justify-center">
                <svg className="w-8 h-8 text-flocken-olive" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-flocken-brown mb-2">Chatta direkt i appen</h3>
              <p className="text-flocken-brown">Kontakta hundägare, hundvakter och kennlar enkelt</p>
            </div>

            <div className="bg-flocken-cream rounded-2xl p-6 text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-flocken-sand rounded-2xl flex items-center justify-center">
                <svg className="w-8 h-8 text-flocken-olive" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-flocken-brown mb-2">Spara favoriter och hantera allt</h3>
              <p className="text-flocken-brown">Bokningar, statistik och inställningar under Mina sidor</p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. NYA SEKTION: För vem är Flocken? */}
      <section className="section-padding bg-flocken-sand">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto text-center mb-12">
            <h2 className="text-4xl lg:text-5xl font-bold text-flocken-brown mb-4">
              För vem är Flocken?
            </h2>
            <p className="text-xl text-flocken-brown">
              Flocken är till för alla som älskar hundar
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            <div className="bg-white rounded-2xl p-6">
              <div className="w-16 h-16 mx-auto mb-4 bg-flocken-sand rounded-2xl flex items-center justify-center">
                <svg className="w-8 h-8 text-flocken-olive" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-flocken-brown mb-3 text-center">Hundägare</h3>
              <ul className="space-y-2 text-flocken-brown text-sm">
                <li className="flex items-start gap-2">
                  <svg className="w-5 h-5 text-flocken-olive flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                  </svg>
                  <span>Hitta hundar nära dig</span>
                </li>
                <li className="flex items-start gap-2">
                  <svg className="w-5 h-5 text-flocken-olive flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                  </svg>
                  <span>Hitta hundvakt</span>
                </li>
                <li className="flex items-start gap-2">
                  <svg className="w-5 h-5 text-flocken-olive flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                  </svg>
                  <span>Spara promenader</span>
                </li>
                <li className="flex items-start gap-2">
                  <svg className="w-5 h-5 text-flocken-olive flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                  </svg>
                  <span>Upptäck hundvänliga platser</span>
                </li>
              </ul>
            </div>

            <div className="bg-white rounded-2xl p-6">
              <div className="w-16 h-16 mx-auto mb-4 bg-flocken-sand rounded-2xl flex items-center justify-center">
                <svg className="w-8 h-8 text-flocken-olive" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-flocken-brown mb-3 text-center">Hundvakter</h3>
              <ul className="space-y-2 text-flocken-brown text-sm">
                <li className="flex items-start gap-2">
                  <svg className="w-5 h-5 text-flocken-olive flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                  </svg>
                  <span>Skapa din profil</span>
                </li>
                <li className="flex items-start gap-2">
                  <svg className="w-5 h-5 text-flocken-olive flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                  </svg>
                  <span>Visa tjänster och priser</span>
                </li>
                <li className="flex items-start gap-2">
                  <svg className="w-5 h-5 text-flocken-olive flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                  </svg>
                  <span>Ange tillgänglighet</span>
                </li>
                <li className="flex items-start gap-2">
                  <svg className="w-5 h-5 text-flocken-olive flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                  </svg>
                  <span>Ta emot bokningsförfrågningar</span>
                </li>
              </ul>
            </div>

            <div className="bg-white rounded-2xl p-6">
              <div className="w-16 h-16 mx-auto mb-4 bg-flocken-sand rounded-2xl flex items-center justify-center">
                <svg className="w-8 h-8 text-flocken-olive" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-flocken-brown mb-3 text-center">Kennlar</h3>
              <ul className="space-y-2 text-flocken-brown text-sm">
                <li className="flex items-start gap-2">
                  <svg className="w-5 h-5 text-flocken-olive flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                  </svg>
                  <span>Visa dina hundar</span>
                </li>
                <li className="flex items-start gap-2">
                  <svg className="w-5 h-5 text-flocken-olive flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                  </svg>
                  <span>Annonsera kullar och valpar</span>
                </li>
                <li className="flex items-start gap-2">
                  <svg className="w-5 h-5 text-flocken-olive flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                  </svg>
                  <span>Länka till din hemsida</span>
                </li>
                <li className="flex items-start gap-2">
                  <svg className="w-5 h-5 text-flocken-olive flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                  </svg>
                  <span>Nå rätt köpare</span>
                </li>
              </ul>
            </div>

            <div className="bg-white rounded-2xl p-6">
              <div className="w-16 h-16 mx-auto mb-4 bg-flocken-sand rounded-2xl flex items-center justify-center">
                <svg className="w-8 h-8 text-flocken-olive" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-flocken-brown mb-3 text-center">Hunddagis</h3>
              <ul className="space-y-2 text-flocken-brown text-sm">
                <li className="flex items-start gap-2">
                  <svg className="w-5 h-5 text-flocken-olive flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                  </svg>
                  <span>Synas lokalt på kartan</span>
                </li>
                <li className="flex items-start gap-2">
                  <svg className="w-5 h-5 text-flocken-olive flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                  </svg>
                  <span>Visa tjänster och öppettider</span>
                </li>
                <li className="flex items-start gap-2">
                  <svg className="w-5 h-5 text-flocken-olive flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                  </svg>
                  <span>Ta emot förfrågningar</span>
                </li>
                <li className="flex items-start gap-2">
                  <svg className="w-5 h-5 text-flocken-olive flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                  </svg>
                  <span>Bygg kundrelationer</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>
      
      {/* 4. UTÖKADE FUNKTIONER - Behåller befintliga men med mer detaljer */}
      <div id="funktioner">
        {/* Feature: Hundar - UTÖKAD */}
        <section className="section-padding bg-white">
          <div className="container-custom">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-4xl lg:text-5xl font-bold text-flocken-brown mb-6">
                  Hundar
                </h2>
                <p className="text-xl text-flocken-brown mb-6">
                  Hitta en lekkamrat eller parningspartner till din hund. Enkel filtrering efter dina kriterier - slipp röriga grupper i sociala medier.
                </p>
                <ul className="space-y-3 text-lg text-flocken-brown mb-6">
                  <li className="flex items-start gap-3">
                    <svg className="w-6 h-6 text-flocken-olive flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                    </svg>
                    <span>Se alla hundar på en karta eller i listvyn</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <svg className="w-6 h-6 text-flocken-olive flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                    </svg>
                    <span>Filtrera på ras, kön, storlek, stad och mycket mer</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <svg className="w-6 h-6 text-flocken-olive flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                    </svg>
                    <span>Komplett profil med bilder, temperament och vad ägaren söker</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <svg className="w-6 h-6 text-flocken-olive flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                    </svg>
                    <span>Chatta direkt med hundägare i appen</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <svg className="w-6 h-6 text-flocken-olive flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                    </svg>
                    <span>Favoritmarkera hundar du vill komma ihåg</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <svg className="w-6 h-6 text-flocken-olive flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                    </svg>
                    <span><strong>Trygg platsvisning:</strong> Din exakta adress visas inte - hunden placeras slumpmässigt inom ditt postnummerområde</span>
                  </li>
                </ul>
                <a 
                  href="/funktioner#hundar" 
                  className="inline-block text-flocken-olive hover:text-flocken-brown font-semibold text-lg transition-colors"
                >
                  Läs mer om Hundar →
                </a>
              </div>
              <div className="relative h-[500px] rounded-2xl overflow-hidden shadow-card">
                <Image
                  src="/assets/flocken/screenshots/flocken_para_karta-alla-hundar.png"
                  alt="Hundar-funktionen i Flocken"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
            </div>
          </div>
        </section>
        
        {/* Feature: Passa - UTÖKAD */}
        <section className="section-padding bg-flocken-cream">
          <div className="container-custom">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="order-2 lg:order-1 relative h-[500px] rounded-2xl overflow-hidden shadow-card">
                <Image
                  src="/assets/flocken/screenshots/flocken_passa_yasmin.png"
                  alt="Passa-funktionen i Flocken"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
              <div className="order-1 lg:order-2">
                <h2 className="text-4xl lg:text-5xl font-bold text-flocken-brown mb-6">
                  Passa
                </h2>
                <p className="text-xl text-flocken-brown mb-6">
                  Hitta en hundvakt du och din hund är trygga med. Välj rätt hundvakt eller passa varandras hundar.
                </p>
                <ul className="space-y-3 text-lg text-flocken-brown mb-6">
                  <li className="flex items-start gap-3">
                    <svg className="w-6 h-6 text-flocken-olive flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                    </svg>
                    <span>Hundvakter och hunddagis med tydliga profiler</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <svg className="w-6 h-6 text-flocken-olive flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                    </svg>
                    <span>Tydliga tjänster: dagpassning, övernattning, promenad, hembesök</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <svg className="w-6 h-6 text-flocken-olive flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                    </svg>
                    <span>Priser och tillgänglighet direkt i profilen</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <svg className="w-6 h-6 text-flocken-olive flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                    </svg>
                    <span>Profilbilder, erfarenhet och omdömen</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <svg className="w-6 h-6 text-flocken-olive flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                    </svg>
                    <span>Ta kontakt direkt i appen eller skicka bokningsförfrågan</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <svg className="w-6 h-6 text-flocken-olive flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                    </svg>
                    <span>Byt passning kostnadsfritt med andra hundägare</span>
                  </li>
                </ul>
                <a 
                  href="/funktioner#passa" 
                  className="inline-block text-flocken-olive hover:text-flocken-brown font-semibold text-lg transition-colors"
                >
                  Läs mer om Passa →
                </a>
              </div>
            </div>
          </div>
        </section>
        
        {/* Feature: Rasta - UTÖKAD */}
        <section className="section-padding bg-white">
          <div className="container-custom">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-4xl lg:text-5xl font-bold text-flocken-brown mb-6">
                  Rasta
                </h2>
                <p className="text-xl text-flocken-brown mb-6">
                  Registrera dina rundor och hur långt du går. Logga dina promenader, hitta nya rundor och se hur mycket din hund rör sig.
                </p>
                <ul className="space-y-3 text-lg text-flocken-brown mb-6">
                  <li className="flex items-start gap-3">
                    <svg className="w-6 h-6 text-flocken-olive flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                    </svg>
                    <span>GPS-tracking för att spara dina rundor</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <svg className="w-6 h-6 text-flocken-olive flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                    </svg>
                    <span>Skapa egna rundor och följa andras rundor</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <svg className="w-6 h-6 text-flocken-olive flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                    </svg>
                    <span>Dela med andra eller håll dina rundor privata</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <svg className="w-6 h-6 text-flocken-olive flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                    </svg>
                    <span>Markera dina favoritrundor</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <svg className="w-6 h-6 text-flocken-olive flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                    </svg>
                    <span>Se statistik: antal promenader, total distans och genomsnitt</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <svg className="w-6 h-6 text-flocken-olive flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                    </svg>
                    <span>Samla poäng, nå nya nivåer och få belöningar</span>
                  </li>
                </ul>
                <a 
                  href="/funktioner#rasta" 
                  className="inline-block text-flocken-olive hover:text-flocken-brown font-semibold text-lg transition-colors"
                >
                  Läs mer om Rasta →
                </a>
              </div>
              <div className="relative h-[500px] rounded-2xl overflow-hidden shadow-card">
                <Image
                  src="/assets/flocken/screenshots/flocken_rasta_starta-promenad.png"
                  alt="Rasta-funktionen i Flocken"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
            </div>
          </div>
        </section>
        
        {/* Feature: Besöka - UTÖKAD */}
        <section className="section-padding bg-flocken-cream">
          <div className="container-custom">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="order-2 lg:order-1 relative h-[500px] rounded-2xl overflow-hidden shadow-card">
                <Image
                  src="/assets/flocken/screenshots/flocken_besoka_karta-alla.png"
                  alt="Besöka-funktionen i Flocken"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
              <div className="order-1 lg:order-2">
                <h2 className="text-4xl lg:text-5xl font-bold text-flocken-brown mb-6">
                  Besöka
                </h2>
                <p className="text-xl text-flocken-brown mb-6">
                  Var är du välkommen att ta med hunden? Karta med caféer, restauranger, parker, stränder och hotell som välkomnar hundar.
                </p>
                <ul className="space-y-3 text-lg text-flocken-brown mb-6">
                  <li className="flex items-start gap-3">
                    <svg className="w-6 h-6 text-flocken-olive flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                    </svg>
                    <span>Alla hundvänliga verksamheter från Google Maps</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <svg className="w-6 h-6 text-flocken-olive flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                    </svg>
                    <span>Caféer, restauranger, barer, parker, stränder och hotell</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <svg className="w-6 h-6 text-flocken-olive flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                    </svg>
                    <span>Lägg till egna ställen för att tipsa andra i communityn</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <svg className="w-6 h-6 text-flocken-olive flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                    </svg>
                    <span>Läs och skriv kommentarer och betyg</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <svg className="w-6 h-6 text-flocken-olive flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                    </svg>
                    <span>Skapa din lista med favoriter</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <svg className="w-6 h-6 text-flocken-olive flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                    </svg>
                    <span>Perfekt när du är ute och reser eller utforskar nya områden</span>
                  </li>
                </ul>
                <a 
                  href="/funktioner#besoka" 
                  className="inline-block text-flocken-olive hover:text-flocken-brown font-semibold text-lg transition-colors"
                >
                  Läs mer om Besöka →
                </a>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* 5. NYA SEKTION: Särskilda situationer */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto text-center mb-12">
            <h2 className="text-4xl lg:text-5xl font-bold text-flocken-brown mb-4">
              Särskilda situationer
            </h2>
            <p className="text-xl text-flocken-brown">
              Flocken hjälper dig även i speciella situationer
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="bg-flocken-sand rounded-2xl p-8 text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-white rounded-2xl flex items-center justify-center">
                <svg className="w-8 h-8 text-flocken-olive" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-flocken-brown mb-3">Valpar och kennel</h3>
              <p className="text-flocken-brown">
                Visa din kennel, kullar och valpar. Länka till din hemsida och nå rätt köpare.
              </p>
            </div>

            <div className="bg-flocken-sand rounded-2xl p-8 text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-white rounded-2xl flex items-center justify-center">
                <svg className="w-8 h-8 text-flocken-olive" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-flocken-brown mb-3">När en hund försvinner</h3>
              <p className="text-flocken-brown">
                Snabb synlighet i närområdet när det verkligen gäller. Nå ut till hundägare runt omkring.
              </p>
            </div>

            <div className="bg-flocken-sand rounded-2xl p-8 text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-white rounded-2xl flex items-center justify-center">
                <svg className="w-8 h-8 text-flocken-olive" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-flocken-brown mb-3">När en hund behöver nytt hem</h3>
              <p className="text-flocken-brown">
                Hjälp rätt familj att hitta rätt hund. Omplacering med omsorg och trygghet.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. NYA SEKTION: Inte bara hitta - utan också spara och följa upp */}
      <section className="section-padding bg-flocken-cream">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto text-center mb-12">
            <h2 className="text-4xl lg:text-5xl font-bold text-flocken-brown mb-4">
              Inte bara hitta – utan också spara, följa upp och hålla kontakt
            </h2>
            <p className="text-xl text-flocken-brown">
              Flocken är en app du använder ofta, inte bara testar en gång
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <div className="bg-white rounded-2xl p-6">
              <div className="w-12 h-12 mb-4 bg-flocken-sand rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-flocken-olive" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-flocken-brown mb-2">Favoriter</h3>
              <p className="text-flocken-brown text-sm">Spara hundar, hundvakter, promenader och platser du vill komma ihåg</p>
            </div>

            <div className="bg-white rounded-2xl p-6">
              <div className="w-12 h-12 mb-4 bg-flocken-sand rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-flocken-olive" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-flocken-brown mb-2">Chatt</h3>
              <p className="text-flocken-brown text-sm">Kontakta hundägare, hundvakter och kennlar direkt i appen</p>
            </div>

            <div className="bg-white rounded-2xl p-6">
              <div className="w-12 h-12 mb-4 bg-flocken-sand rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-flocken-olive" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-flocken-brown mb-2">Bokningar</h3>
              <p className="text-flocken-brown text-sm">Hantera kommande och tidigare bokningar av hundpassning</p>
            </div>

            <div className="bg-white rounded-2xl p-6">
              <div className="w-12 h-12 mb-4 bg-flocken-sand rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-flocken-olive" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-flocken-brown mb-2">Promenadstatistik</h3>
              <p className="text-flocken-brown text-sm">Se antal promenader, distans, poäng och nå nya nivåer</p>
            </div>

            <div className="bg-white rounded-2xl p-6">
              <div className="w-12 h-12 mb-4 bg-flocken-sand rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-flocken-olive" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-flocken-brown mb-2">Notifieringar</h3>
              <p className="text-flocken-brown text-sm">Se nya meddelanden direkt och missa inget viktigt</p>
            </div>

            <div className="bg-white rounded-2xl p-6">
              <div className="w-12 h-12 mb-4 bg-flocken-sand rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-flocken-olive" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-flocken-brown mb-2">Konto och prenumeration</h3>
              <p className="text-flocken-brown text-sm">Hantera dina uppgifter, lösenord och prenumeration</p>
            </div>
          </div>
        </div>
      </section>

      {/* 7. NYA SEKTION: Trygghet */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto text-center mb-12">
            <h2 className="text-4xl lg:text-5xl font-bold text-flocken-brown mb-4">
              Tryggt och enkelt att använda
            </h2>
            <p className="text-xl text-flocken-brown">
              Din säkerhet och integritet är viktig för oss
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-flocken-sand rounded-2xl flex items-center justify-center">
                <svg className="w-8 h-8 text-flocken-olive" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-flocken-brown mb-2">Din exakta adress visas inte</h3>
              <p className="text-flocken-brown text-sm">Hundar placeras slumpmässigt inom postnummerområdet</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-flocken-sand rounded-2xl flex items-center justify-center">
                <svg className="w-8 h-8 text-flocken-olive" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-flocken-brown mb-2">Du väljer själv vad du delar</h3>
              <p className="text-flocken-brown text-sm">Full kontroll över din profil och vad andra ser</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-flocken-sand rounded-2xl flex items-center justify-center">
                <svg className="w-8 h-8 text-flocken-olive" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-flocken-brown mb-2">Kontakt sker direkt i appen</h3>
              <p className="text-flocken-brown text-sm">Ingen behöver dela telefonnummer eller e-post i förväg</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-flocken-sand rounded-2xl flex items-center justify-center">
                <svg className="w-8 h-8 text-flocken-olive" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-flocken-brown mb-2">Du ser nya meddelanden direkt</h3>
              <p className="text-flocken-brown text-sm">Notifieringar håller dig uppdaterad</p>
            </div>
          </div>

          <div className="max-w-2xl mx-auto mt-12 text-center">
            <p className="text-flocken-brown">
              Läs mer i vår{' '}
              <a href="/integritetspolicy" className="text-flocken-olive hover:underline font-semibold">
                integritetspolicy
              </a>
              {' '}och{' '}
              <a href="/anvandarvillkor" className="text-flocken-olive hover:underline font-semibold">
                användarvillkor
              </a>
            </p>
          </div>
        </div>
      </section>
      
      {/* USPs - BEHÅLLS */}
      <section className="section-padding bg-flocken-sand">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-flocken-brown mb-4">
              Varför Flocken?
            </h2>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="text-center bg-white rounded-2xl p-8">
              <div className="w-16 h-16 mx-auto mb-4 bg-flocken-sand rounded-2xl flex items-center justify-center">
                <svg className="w-8 h-8 text-flocken-olive" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-flocken-brown mb-2">Helhetsplattform</h3>
              <p className="text-flocken-brown">Slipp en massa olika appar och att leta i facebook-grupper.</p>
            </div>
            
            <div className="text-center bg-white rounded-2xl p-8">
              <div className="w-16 h-16 mx-auto mb-4 bg-flocken-sand rounded-2xl flex items-center justify-center">
                <svg className="w-8 h-8 text-flocken-olive" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-flocken-brown mb-2">Lugn och vuxen</h3>
              <p className="text-flocken-brown">Ingen social press, utan praktiska funktioner på dina villkor.</p>
            </div>
            
            <div className="text-center bg-white rounded-2xl p-8">
              <div className="w-16 h-16 mx-auto mb-4 bg-flocken-sand rounded-2xl flex items-center justify-center">
                <svg className="w-8 h-8 text-flocken-olive" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-flocken-brown mb-2">Svensk vardag</h3>
              <p className="text-flocken-brown">Appen är framtagen av svenska hundägare för svenska hundägare</p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Testimonials - BEHÅLLS */}
      <TestimonialBlock
        testimonials={[
          {
            quote: "Fantastiskt att hitta nya favoritställen genom appen, så att hunden kan följa med på stan.",
            author: "Anders",
            role: "Australian Shepherd-ägare"
          },
          {
            quote: "Flocken är navet i mitt hundliv numera. Otroligt mycket smidigare än grupper i sociala medier.",
            author: "Jonas",
            role: "Blandras-ägare"
          }
        ]}
      />
      
      {/* Final CTA - BEHÅLLS */}
      <section className="section-padding bg-gradient-to-br from-flocken-olive to-flocken-accent">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <div className="space-y-4">
              <h2 className="text-4xl lg:text-6xl font-bold text-white">
                Gå med i flocken idag
              </h2>
              <p className="text-xl text-white/90">
                Ladda ner appen, skapa ditt konto och lägg upp din hund
              </p>
            </div>
            
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a 
                  href="https://play.google.com/store/apps/details?id=com.bastavan.app" 
                  className="inline-flex items-center justify-center px-8 py-4 bg-white text-flocken-olive rounded-xl font-semibold text-lg hover:bg-flocken-cream transition-all hover:scale-105 shadow-soft"
                  onClick={() => trackAppInstall('android', 'final_cta')}
                >
                  <svg className="w-6 h-6 mr-2" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.53,12.9 20.18,13.18L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z"/>
                  </svg>
                  Ladda ner på Google Play
                </a>
                
                <a 
                  href="https://apps.apple.com/app/flocken/id6755424578" 
                  className="inline-flex items-center justify-center px-8 py-4 bg-white text-flocken-olive rounded-xl font-semibold text-lg hover:bg-flocken-cream transition-all hover:scale-105 shadow-soft"
                  onClick={() => trackAppInstall('ios', 'final_cta')}
                >
                  <svg className="w-6 h-6 mr-2" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C1.79 15.25 2.1 7.59 9.5 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
                  </svg>
                  Ladda ner på AppStore
                </a>
              </div>
              
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 max-w-2xl mx-auto mb-8">
                <p className="text-lg text-white font-semibold whitespace-pre-line">
                  Appen är alltid gratis.{"\n"}
                  Testa premiumfunktioner gratis i 6 månader, gäller till den 31 mars.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
