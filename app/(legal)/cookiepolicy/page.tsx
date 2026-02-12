'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function CookiePolicyPage() {
  useEffect(() => {
    document.title = 'Cookiepolicy för flocken.info';
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Cookiepolicy för flocken.info - hur vi använder cookies på vår webbplats');
    }
  }, []);

  const handleOpenSettings = () => {
    if (typeof window !== 'undefined' && window.showCookieSettings) {
      window.showCookieSettings();
    }
  };

  return (
    <>
      <h1>Cookiepolicy för flocken.info</h1>
      
      <p className="lead">
        <strong>Senast uppdaterad:</strong> 12 februari 2026
      </p>
      
      <p>
        Denna cookiepolicy beskriver hur vi använder cookies och liknande tekniker på webbplatsen <strong>flocken.info</strong>. 
        Policyn gäller endast för webbplatsen och inte för Flocken-appen (iOS/Android) - för appen, se vår{' '}
        <Link href="/integritetspolicy" className="text-flocken-olive hover:underline">
          Integritetspolicy
        </Link>.
      </p>

      <div className="bg-flocken-cream p-6 rounded-lg my-6">
        <h3 className="text-xl font-semibold text-flocken-brown mb-2">Ändra dina cookie-inställningar</h3>
        <p className="mb-4 text-flocken-brown">
          Du har full kontroll över vilka cookies du accepterar. Klicka på knappen nedan för att ändra dina inställningar när som helst.
        </p>
        <button
          onClick={handleOpenSettings}
          className="btn-primary"
        >
          Ändra cookie-inställningar
        </button>
      </div>

      <h2 id="varfor-cookies">1. Vad cookies gör för dig</h2>
      
      <p>
        Vi använder cookies för att förbättra din upplevelse på flocken.info. Cookies hjälper oss att:
      </p>

      <ul>
        <li>
          <strong>Mäta och anpassa marknadsföring</strong> – Så att du ser information om funktioner som kan vara relevanta för dig
        </li>
        <li>
          <strong>Förstå hur webbplatsen används</strong> – Vi ser vilka sidor som besöks mest och kan förbättra upplevelsen
        </li>
        <li>
          <strong>Spara dina val</strong> – Du slipper godkänna cookies vid varje besök
        </li>
        <li>
          <strong>Optimera prestanda</strong> – Sidan laddas snabbare baserat på tidigare besök
        </li>
      </ul>

      <h2 id="vad-ar-cookies">2. Vad är cookies?</h2>
      <p>
        Cookies är små textfiler som lagras på din enhet (dator, telefon eller surfplatta) när du besöker en webbplats. 
        De hjälper webbplatsen att komma ihåg information om ditt besök, såsom dina preferenser och inställningar.
      </p>

      <p>
        Cookies kan vara <strong>sessionscookies</strong> som försvinner när du stänger webbläsaren, eller <strong>permanenta cookies</strong> som 
        stannar kvar på din enhet under en viss tid.
      </p>

      <h2 id="vilka-cookies">3. Vilka cookies använder vi?</h2>
      
      <p>
        Vi delar in cookies i tre kategorier baserat på deras syfte. Du kan välja vilka kategorier du vill acceptera via cookie-bannern 
        som visas vid ditt första besök.
      </p>

      <h3 id="nodvandiga-cookies">3.1 Nödvändiga cookies</h3>
      
      <p>
        Dessa cookies är nödvändiga för att webbplatsen ska fungera och kan inte stängas av. De lagrar inga personuppgifter och kan inte 
        spåra dig mellan olika webbplatser.
      </p>

      <div className="overflow-x-auto my-4">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-flocken-sand">
              <th className="border border-flocken-olive p-3 text-left">Cookie</th>
              <th className="border border-flocken-olive p-3 text-left">Syfte</th>
              <th className="border border-flocken-olive p-3 text-left">Varaktighet</th>
              <th className="border border-flocken-olive p-3 text-left">Typ</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border border-flocken-olive p-3"><code>cookie-consent</code></td>
              <td className="border border-flocken-olive p-3">Sparar dina cookie-preferenser (localStorage)</td>
              <td className="border border-flocken-olive p-3">12 månader</td>
              <td className="border border-flocken-olive p-3">Första part</td>
            </tr>
          </tbody>
        </table>
      </div>

      <p className="text-sm text-flocken-gray italic">
        <strong>Du kan inte stänga av dessa cookies</strong> eftersom de är nödvändiga för webbplatsens grundfunktion.
      </p>

      <h3 id="analys-cookies">3.2 Analys- och prestandacookies</h3>
      
      <p>
        Dessa cookies hjälper oss att förstå hur besökare använder vår webbplats genom att samla in och rapportera information på aggregerad nivå. 
        Data behandlas pseudonymiserat och används inte för att identifiera dig personligen.
      </p>

      <p>
        <strong>Verktyg vi använder (exempel):</strong>
      </p>
      <ul>
        <li><strong>Google Analytics</strong> – För att analysera trafik och användarbeteende</li>
        <li><strong>Google Tag Manager</strong> – För att hantera analysverktyg</li>
      </ul>

      <div className="overflow-x-auto my-4">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-flocken-sand">
              <th className="border border-flocken-olive p-3 text-left">Cookie</th>
              <th className="border border-flocken-olive p-3 text-left">Syfte</th>
              <th className="border border-flocken-olive p-3 text-left">Varaktighet</th>
              <th className="border border-flocken-olive p-3 text-left">Leverantör</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border border-flocken-olive p-3"><code>_ga</code></td>
              <td className="border border-flocken-olive p-3">Används för att skilja mellan olika användare</td>
              <td className="border border-flocken-olive p-3">2 år</td>
              <td className="border border-flocken-olive p-3">Google</td>
            </tr>
            <tr>
              <td className="border border-flocken-olive p-3"><code>_gid</code></td>
              <td className="border border-flocken-olive p-3">Används för att skilja mellan olika användare</td>
              <td className="border border-flocken-olive p-3">24 timmar</td>
              <td className="border border-flocken-olive p-3">Google</td>
            </tr>
            <tr>
              <td className="border border-flocken-olive p-3"><code>_gat</code></td>
              <td className="border border-flocken-olive p-3">Används för att begränsa antal förfrågningar</td>
              <td className="border border-flocken-olive p-3">1 minut</td>
              <td className="border border-flocken-olive p-3">Google</td>
            </tr>
          </tbody>
        </table>
      </div>

      <p className="text-sm text-flocken-gray italic">
        <strong>Obs:</strong> IP-adresser behandlas enligt Googles standardinställningar för Google Analytics 4, där IP-adresser 
        används kortvarigt för geopositionering och sedan kasseras.
      </p>

      <h3 id="marknadsforings-cookies">3.3 Marknadsförings- och annonscookies</h3>
      
      <p>
        Dessa cookies används för att visa relevanta annonser och mäta effektiviteten av våra marknadsföringskampanjer. 
        De möjliggör riktad marknadsföring baserat på ditt användande av webbplatsen.
      </p>

      <p>
        <strong>Verktyg vi använder (exempel):</strong>
      </p>
      <ul>
        <li><strong>Meta Pixel (Facebook)</strong> – För att visa relevanta annonser på Facebook och Instagram</li>
        <li><strong>Google Ads</strong> – För att visa relevanta annonser i Googles nätverk</li>
      </ul>

      <p className="text-sm text-flocken-brown bg-flocken-sand p-3 rounded my-3">
        <strong>Server-side tracking:</strong> Vissa marknadsföringsdata skickas också via server-to-server-anslutning (t.ex. Meta Conversions API) 
        för förbättrad datakvalitet och attribution. Detta sker endast om du har gett samtycke för marknadsföringscookies.
      </p>

      <div className="overflow-x-auto my-4">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-flocken-sand">
              <th className="border border-flocken-olive p-3 text-left">Cookie</th>
              <th className="border border-flocken-olive p-3 text-left">Syfte</th>
              <th className="border border-flocken-olive p-3 text-left">Varaktighet</th>
              <th className="border border-flocken-olive p-3 text-left">Leverantör</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border border-flocken-olive p-3"><code>_fbp</code></td>
              <td className="border border-flocken-olive p-3">Facebook Pixel – spårar besök och konverteringar</td>
              <td className="border border-flocken-olive p-3">3 månader</td>
              <td className="border border-flocken-olive p-3">Meta</td>
            </tr>
            <tr>
              <td className="border border-flocken-olive p-3"><code>_fbc</code></td>
              <td className="border border-flocken-olive p-3">Facebook Click ID – spårar klick från Facebook-annonser</td>
              <td className="border border-flocken-olive p-3">3 månader</td>
              <td className="border border-flocken-olive p-3">Meta</td>
            </tr>
            <tr>
              <td className="border border-flocken-olive p-3"><code>fr</code></td>
              <td className="border border-flocken-olive p-3">Facebook remarketing och annonsmätning (kan sättas från facebook.com)</td>
              <td className="border border-flocken-olive p-3">3 månader</td>
              <td className="border border-flocken-olive p-3">Meta</td>
            </tr>
          </tbody>
        </table>
      </div>

      <p className="text-sm text-flocken-gray italic">
        <strong>Obs:</strong> Du kan alltid stänga av marknadsföringscookies genom att ändra dina inställningar. Detta påverkar inte 
        webbplatsens funktion.
      </p>

      <h2 id="hantera-cookies">4. Hantera dina cookie-inställningar</h2>
      
      <p>
        Du har full kontroll över vilka cookies du accepterar. Du kan ändra dina inställningar när som helst.
      </p>

      <h3 id="via-cookie-banner">4.1 Via vår cookie-banner</h3>
      
      <p>
        Klicka på knappen nedan för att öppna cookie-inställningarna:
      </p>

      <button
        onClick={handleOpenSettings}
        className="btn-secondary my-4"
      >
        Ändra cookie-inställningar
      </button>

      <h3 id="via-webblasare">4.2 Via webbläsaren</h3>
      
      <p>
        Du kan också hantera och radera cookies direkt i din webbläsares inställningar:
      </p>

      <ul>
        <li><strong>Chrome:</strong> Inställningar → Sekretess och säkerhet → Cookies och andra webbplatsdata</li>
        <li><strong>Firefox:</strong> Inställningar → Sekretess & säkerhet → Cookies och webbplatsdata</li>
        <li><strong>Safari:</strong> Safari → Inställningar → Sekretess → Hantera webbplatsdata</li>
        <li><strong>Edge:</strong> Inställningar → Cookies och webbplatsbehörigheter → Hantera cookies</li>
      </ul>

      <p className="text-sm text-flocken-gray italic">
        <strong>Obs:</strong> Om du blockerar alla cookies kan vissa funktioner på webbplatsen sluta fungera korrekt.
      </p>

      <h2 id="tredjeparts-cookies">5. Tredjepartscookies och integritet</h2>
      
      <p>
        Vissa av de cookies vi använder sätts av tredjepartsleverantörer (t.ex. Google och Meta). Dessa företag har egna integritetspolicyer 
        som styr hur de behandlar data:
      </p>

      <ul>
        <li>
          <strong>Google:</strong>{' '}
          <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-flocken-olive hover:underline">
            Googles integritetspolicy
          </a>
        </li>
        <li>
          <strong>Meta (Facebook):</strong>{' '}
          <a href="https://www.facebook.com/privacy/policy/" target="_blank" rel="noopener noreferrer" className="text-flocken-olive hover:underline">
            Metas integritetspolicy
          </a>
        </li>
      </ul>

      <p>
        När du accepterar analys- eller marknadsföringscookies samtycker du till att dessa tredjepartsleverantörer kan behandla data 
        om ditt webbplatsbesök enligt deras respektive policyer.
      </p>

      <h2 id="hur-vi-skyddar">6. Hur vi skyddar din integritet</h2>
      
      <p>
        Vi tar din integritet på allvar och följer EU:s dataskyddsförordning (GDPR):
      </p>

      <ul>
        <li><strong>Samtycke först:</strong> Inga analys- eller marknadsföringscookies sätts förrän du har gett ditt samtycke</li>
        <li><strong>Blockering utan samtycke:</strong> Om du nekar cookies blockeras all tracking automatiskt</li>
        <li><strong>Begränsad användning vid ändring:</strong> Om du ändrar ditt samtycke stoppas vidare användning av de aktuella cookies</li>
        <li><strong>Pseudonymiserad data:</strong> Analysdata behandlas på aggregerad nivå utan personidentifikation</li>
        <li><strong>Transparens:</strong> Vi listar alla cookies och verktyg vi använder på denna sida</li>
      </ul>

      <h2 id="andringar">7. Ändringar i denna policy</h2>
      
      <p>
        Vi kan uppdatera denna cookiepolicy från tid till annan, till exempel om vi lägger till nya funktioner eller tjänster som 
        kräver nya cookies. När vi gör väsentliga ändringar kommer vi att informera dig genom en tydlig notis på webbplatsen.
      </p>

      <p>
        Den senaste uppdateringen visas alltid högst upp på denna sida.
      </p>

      <h2 id="kontakt">8. Kontakt</h2>
      
      <p>
        Har du frågor om hur vi använder cookies eller vill veta mer om vår behandling av personuppgifter?
      </p>

      <p>
        <strong>Kontakta oss:</strong>
      </p>

      <p>
        <strong>Spitakolus AB</strong><br />
        Organisationsnummer: 559554-6101<br />
        E-post:{' '}
        <a href="mailto:support@spitakolus.com" className="text-flocken-olive hover:underline">
          support@spitakolus.com
        </a>
      </p>

      <p>
        Läs mer om hur vi behandlar personuppgifter i vår{' '}
        <Link href="/integritetspolicy" className="text-flocken-olive hover:underline">
          Integritetspolicy
        </Link>.
      </p>

      <hr className="my-8" />
      
      <p className="text-sm text-flocken-gray text-center">
        © 2026 Spitakolus AB. Alla rättigheter förbehållna.
      </p>
    </>
  );
}
