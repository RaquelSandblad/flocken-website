'use client';

import { useEffect } from 'react';

export default function IntegritetspolicyPage() {
  useEffect(() => {
    document.title = 'Integritetspolicy för Flocken';
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Integritetspolicy för Flocken - hur vi samlar in, använder och skyddar dina personuppgifter');
    }
  }, []);

  return (
    <>
      <h1>Integritetspolicy för Flocken</h1>
      
      <p className="lead">
        <strong>Senast uppdaterad:</strong> 18 januari 2026
      </p>
      
      <p>
        Denna integritetspolicy gäller för behandling av personuppgifter i samband med användning av Flockens tjänster, inklusive mobilappar (iOS och Android) samt våra webbplatser, såsom flocken.info.
      </p>
      <p>
        Policyn beskriver hur vi samlar in, använder och skyddar personuppgifter i samband med kontoskapande, användning av funktioner, samt mätning och förbättring av våra tjänster. Viss mätning kan ske via våra egna system och domäner innan data delas med utvalda tjänsteleverantörer, i enlighet med denna policy.
      </p>
      
      <p>
        Vi tar din integritet på allvar och behandlar alltid personuppgifter i enlighet med EU:s dataskyddsförordning (GDPR) och tillämplig svensk lagstiftning.
      </p>
      
      <h2 id="personuppgiftsansvarig">1. Personuppgiftsansvarig</h2>
      <p>
        Personuppgiftsansvarig för behandlingen av personuppgifter i Flocken är:
      </p>
      <p>
        <strong>Spitakolus AB</strong><br />
        Organisationsnummer: 559554-6101<br />
        E-post till support:{' '}
        <a href="mailto:support@spitakolus.com" className="text-flocken-olive hover:underline">
          support@spitakolus.com
        </a>
      </p>
      <p>
        Vid frågor om denna policy eller vår behandling av personuppgifter kan du kontakta oss via ovanstående kontaktuppgifter.
      </p>
      
      <h2 id="vilka-uppgifter">2. Vilka personuppgifter vi samlar in</h2>
      <p>
        Vi behandlar följande kategorier av personuppgifter:
      </p>
      
      <h3 id="uppgifter-kontoinformation">2.1 Kontoinformation</h3>
      <p>
        För att använda Flocken krävs ett användarkonto. Appen är gratis att ladda ner och det finns en kostnadsfri kontonivå utan tidsbegränsning.
      </p>
      <p>
        Vid registrering samlar vi in e-postadress, förnamn och efternamn. E-postadressen verifieras i samband med kontoskapande.
      </p>
      <ul>
        <li>E-postadress (obligatorisk)</li>
        <li>Förnamn och efternamn (obligatoriska)</li>
        <li>Lösenord (lagras krypterat, vi kan aldrig se ditt lösenord i klartext)</li>
        <li>Telefonnummer (valfritt)</li>
        <li>Profilbild (valfritt)</li>
      </ul>
      
      <h3 id="uppgifter-hundinfo">2.2 Hundinformation</h3>
      <p>
        Uppgifter om hundar (såsom namn, ras, kön, ålder, bilder samt eventuella hälsodata eller tester inför parning) lämnas av användaren själv.
      </p>
      <p>
        <strong>Flocken verifierar, granskar eller kontrollerar inte dessa uppgifter och ansvarar inte för deras korrekthet eller fullständighet. Det är användarens ansvar att lämna sanningsenlig information.</strong>
      </p>
      <ul>
        <li>Hundnamn</li>
        <li>Hundras (inkl. blandras)</li>
        <li>Kön</li>
        <li>Ålder/födelseår</li>
        <li>Storlek (liten, medel, stor)</li>
        <li>Färg</li>
        <li>Beskrivning av hunden</li>
        <li>Bilder på hunden (upp till 6 st)</li>
        <li>Uppgifter om stamtavla (om du väljer att ange)</li>
        <li>Hälsoinformation på övergripande nivå (t.ex. kastrerad/steriliserad)</li>
        <li>Temperament och egenskaper</li>
      </ul>
      <p>
        <strong>Obs:</strong> Du bör aldrig lägga in känsliga uppgifter om varken dig själv eller andra personer (t.ex. sjukdomsdiagnoser, religiös övertygelse, politiska åsikter).
      </p>
      
      <h3 id="uppgifter-plats">2.3 Platsdata och GPS</h3>
      <p>
        Flocken samlar endast in användarens exakta platsdata (GPS) i samband med att användaren aktivt startar en promenad i funktionen Rasta.
      </p>
      <p>
        Platsdata registreras endast under den tid promenaden pågår och upphör automatiskt när promenaden avslutas. Ingen platsdata samlas in i bakgrunden eller i andra delar av appen.
      </p>
      <p>
        Platsdata delas inte med andra användare i realtid. Efter avslutad promenad kan användaren själv välja om promenaden ska sparas privat eller göras synlig för andra användare.
      </p>
      <p>
        Användning av appen i övrigt kräver inte tillgång till platsdata. Funktionen Rasta är dock inte tillgänglig utan att platsåtkomst tillåts.
      </p>
      <p>
        Sparade promenader lagras tills användaren själv väljer att ta bort dem. Vid radering av en promenad tas detaljerad platsdata bort och endast sammanställd information såsom total sträcka och poäng kan sparas.
      </p>
      <p>
        <strong>Rättslig grund:</strong> Behandling av platsdata sker för att fullgöra användarens uttryckliga begäran att registrera en promenad och baseras på avtalet mellan användaren och Flocken.
      </p>
      
      <h3 id="uppgifter-kartvisning">2.3.1 Kartvisning och ungefärlig plats (kartbaserad tjänst – ej realtidsposition)</h3>
      <p>
        Flocken är en kartbaserad tjänst. En kärnfunktion i appen är att användare ska kunna upptäcka och bli upptäckta via kartan genom publicerade annonser och tjänster (t.ex. parning, hundpassning och hundvänliga verksamheter).
      </p>
      <p>
        <strong>Ingen realtidsposition delas i kartan:</strong><br />
        Kartan visar inte användares live-position eller var en användares enhet befinner sig i realtid. Vi samlar inte in eller delar kontinuerlig GPS-position för kartvisning, och ingen automatisk eller manuell "check-in" förekommer.
      </p>
      <p>
        <strong>Privatpersoner (icke-företag):</strong><br />
        För privatpersoner visas aldrig exakt adress i kartan. Platsinformation visas endast på en ungefärlig nivå, till exempel som stad eller område, och kan visualiseras som en approximativ punkt inom ett större geografiskt område (t.ex. postnummerområde). Detta görs för att skydda användarens integritet.
      </p>
      <p>
        <strong>Företag och verksamheter:</strong><br />
        Företag och verksamheter (t.ex. hunddagis) kan välja att visa sin verksamhetsadress i kartan, eftersom detta är en publikt avsedd adress som syftar till att kunder ska kunna hitta verksamheten.
      </p>
      <p>
        <strong>Val och kontroll:</strong><br />
        Att synas i kartan är kopplat till att aktivt skapa och publicera en profil eller annons. Användare som inte vill vara synliga i kartan ska inte publicera en sådan listning, eller kan när som helst ta bort sin listning eller radera sitt konto direkt i appen.
      </p>
      
      <h3 id="uppgifter-funktion">2.4 Funktionsspecifik data</h3>
      <ul>
        <li><strong>Hundvakt:</strong> tillgänglighet, priser, erfarenhet/beskrivning</li>
        <li><strong>Parning:</strong> information om att hunden är tillgänglig för parning, övergripande parningshistorik (i den mån du själv anger den)</li>
        <li><strong>Hundrastgårdar:</strong> platser du markerar som favorit eller rekommenderar</li>
      </ul>
      
      <h3 id="uppgifter-kommunikation">2.5 Kommunikation mellan användare</h3>
      <p>
        Flocken erbjuder möjlighet till direkt kommunikation mellan användare via privat chatt. Meddelanden är endast synliga för de konton som deltar i konversationen.
      </p>
      <p>
        Chattmeddelanden lagras på våra servrar och raderas när användaren själv tar bort dem eller när ett konto raderas. Meddelanden raderas inte automatiskt efter en viss tid.
      </p>
      <p>
        <strong>Flocken tar inte del av innehållet i chattmeddelanden.</strong> Teknisk åtkomst kan dock förekomma i undantagsfall, exempelvis vid felsökning, säkerhetsincidenter eller när det krävs enligt lag eller myndighetsbeslut.
      </p>
      
      <h3 id="uppgifter-interaktion">2.6 Användarinteraktioner</h3>
      <ul>
        <li>Favoriter (hundar/användare du markerar som favorit)</li>
        <li>Skickade och mottagna meddelanden</li>
        <li>Blockerade användare</li>
        <li>Sökhistorik och filter du använder i appen</li>
        <li>Tekniska loggar (t.ex. IP-adress, enhetstyp, appversion, tidsstämplar, kraschloggar)</li>
      </ul>
      
      <h3 id="uppgifter-teknisk">2.7 Teknisk användningsdata och mätning</h3>
      <p>
        När du använder Flockens appar eller webbplatser samlar vi in teknisk användningsdata i syfte att säkerställa funktionalitet, förbättra användarupplevelsen och analysera hur tjänsten används.
      </p>
      <p>
        Sådan data kan omfatta:
      </p>
      <ul>
        <li>information om enhet och operativsystem</li>
        <li>appversion, språk och tidsstämplar</li>
        <li>hur funktioner används (t.ex. visningar, klick och andra interaktioner)</li>
        <li>tekniska identifierare som krävs för drift, säkerhet och analys</li>
      </ul>
      <p>
        Denna information används inte för att identifiera dig direkt, utan behandlas i första hand på aggregerad eller pseudonymiserad nivå.
      </p>
      
      <h2 id="varifrån">3. Varifrån vi får uppgifterna</h2>
      <p>
        Vi samlar främst in personuppgifter direkt från dig när du:
      </p>
      <ul>
        <li>Registrerar konto</li>
        <li>Skapar eller uppdaterar din profil eller din hunds profil</li>
        <li>Startar en promenad i funktionen Rasta (platsåtkomst)</li>
        <li>Skickar meddelanden i appen</li>
        <li>Använder olika funktioner (sök, filter, favoriter, blockering m.m.)</li>
      </ul>
      <p>
        Viss teknisk data kan samlas in automatiskt via appen (t.ex. enhetstyp, IP-adress, loggar).
      </p>
      
      <h2 id="ändamål">4. Ändamål med behandlingen och rättslig grund</h2>
      <p>
        Vi behandlar personuppgifter för följande ändamål:
      </p>
      
      <h3 id="ändamål-grundfunktioner">4.1 För att tillhandahålla appens grundfunktioner</h3>
      <p><strong>Exempel på behandlingar:</strong></p>
      <ul>
        <li>Skapa och hantera ditt konto</li>
        <li>Visa hundar och hundägare i närheten</li>
        <li>Möjliggöra chatt och kontakt mellan användare</li>
        <li>Visa och hantera favoritmarkeringar och blockeringar</li>
      </ul>
      <p>
        <strong>Rättslig grund:</strong> Avtal (artikel 6.1 b GDPR) – behandlingen är nödvändig för att fullgöra avtalet med dig, dvs. att tillhandahålla Flocken enligt våra användarvillkor.
      </p>
      
      <h3 id="ändamål-hundvakt">4.2 För att erbjuda hundvakt- och parningsfunktioner</h3>
      <p><strong>Exempel på behandlingar:</strong></p>
      <ul>
        <li>Visa användare som erbjuder hundvakt</li>
        <li>Visa hundar tillgängliga för parning</li>
        <li>Hantera information om tillgänglighet, pris och kort beskrivning av erfarenhet</li>
      </ul>
      <p>
        <strong>Rättslig grund:</strong> Avtal (artikel 6.1 b) – för att möjliggöra de funktioner du valt att använda.
      </p>
      
      
      <h3 id="ändamål-support">4.4 För kommunikation och support</h3>
      <p><strong>Exempel på behandlingar:</strong></p>
      <ul>
        <li>Skicka viktig information om appen, villkor eller ändringar i policyn</li>
        <li>Svara på supportärenden</li>
        <li>Kontakta dig vid misstanke om missbruk eller brott mot villkor</li>
      </ul>
      <p>
        Vid kontakt med support via e-post behandlas personuppgifter för att hantera ärendet. Supportärenden sparas i upp till 365 dagar, eller längre om det krävs för att hantera pågående ärenden eller rättsliga krav.
      </p>
      <p>
        <strong>Rättslig grund:</strong> Avtal (artikel 6.1 b) – nödvändigt för att kunna hjälpa dig som användare. Berättigat intresse (artikel 6.1 f) – vårt intresse av att administrera appen och ge god kundservice.
      </p>
      
      <h3 id="ändamål-utveckla">4.5 För att förbättra och utveckla appen</h3>
      <p><strong>Exempel på behandlingar:</strong></p>
      <ul>
        <li>Analys av hur appen används (t.ex. vilka funktioner som används mest)</li>
        <li>Felsökning, kraschloggar och prestandaoptimering</li>
      </ul>
      <p>
        För analys och statistik använder vi analysverktyg såsom Google Analytics 4 och/eller Firebase (Google). Dessa verktyg hjälper oss att förstå hur våra tjänster används, identifiera förbättringsområden och säkerställa stabil drift.
      </p>
      <p>
        Analys sker för produktutveckling, felsökning och övergripande statistik, och är inte ett krav för att skapa konto eller använda tjänsten.
      </p>
      <p>
        <strong>Rättslig grund:</strong> Berättigat intresse (artikel 6.1 f) – vårt berättigade intresse av att utveckla och förbättra våra tjänster.
      </p>
      
      <h3 id="ändamål-marknadsföring">4.6 Marknadsföring och konverteringsmätning</h3>
      <p>
        Flocken använder mätning kopplad till marknadsföring på vår webbplats (flocken.info) för att förstå om annonser leder till besök, installation, registrering eller annan användaraktivitet.
      </p>
      <p>
        Denna mätning innebär att tekniska händelser kan delas med marknadsföringsplattformar, såsom Google eller Meta, i syfte att:
      </p>
      <ul>
        <li>mäta effektiviteten av marknadsföring</li>
        <li>förbättra och optimera kampanjer</li>
        <li>minska irrelevant annonsering</li>
      </ul>
      <p>
        Vi använder följande verktyg för marknadsföringsmätning:
      </p>
      <ul>
        <li><strong>Meta Pixel (Facebook Pixel)</strong> – för att mäta konverteringar från Meta-annonser och förbättra annonsering</li>
        <li><strong>Google Tag Manager</strong> – för att hantera och koordinera spårningsskript</li>
      </ul>
      <p>
        <strong>Viktigt:</strong> Marknadsföringsspårning aktiveras endast om du ger ditt samtycke via vår cookie-banner. Du kan när som helst ändra dina val via{' '}
        <a href="/privacy-choices" className="text-flocken-olive hover:underline">
          användarens integritetsval
        </a>{' '}
        eller genom att klicka på "Hantera cookies" i sidfoten.
      </p>
      <p>
        <strong>Rättslig grund:</strong> Samtycke (artikel 6.1 a GDPR) – marknadsföringsspårning sker endast efter att du aktivt godkänt detta via cookie-bannern.
      </p>
      
      <h3 id="ändamål-juridik">4.7 För att följa lagar och hantera tvister</h3>
      <p><strong>Exempel på behandlingar:</strong></p>
      <ul>
        <li>Uppfylla bokförings- och andra rättsliga skyldigheter</li>
        <li>Hantera eventuella rättsliga krav eller tvister</li>
      </ul>
      <p>
        <strong>Rättslig grund:</strong> Rättslig förpliktelse (artikel 6.1 c) – när vi är skyldiga enligt lag. Berättigat intresse (artikel 6.1 f) – för att bevaka och försvara våra rättsliga intressen.
      </p>
      
      <h3 id="ändamål-profilering">4.8 Profilering och rekommendationer</h3>
      <p>
        Eventuella rekommendationer i appen baseras på användarens egna val, filter och inställningar (t.ex. ras, storlek eller geografisk närhet).
      </p>
      <p>
        Rekommendationerna utgör endast förslag och innebär inte automatiserat beslutsfattande med rättsliga eller liknande betydande konsekvenser för användaren.
      </p>
      
      <h2 id="delning">5. Delning av personuppgifter</h2>
      <p>
        <strong>Vi säljer inte dina personuppgifter.</strong>
      </p>
      <p>
        Vi kan dela personuppgifter med följande kategorier av mottagare:
      </p>
      
      <h3 id="delning-användare">5.1 Andra användare i appen</h3>
      <p>
        När du använder Flocken delas vissa uppgifter med andra användare:
      </p>
      <ul>
        <li><strong>Offentligt synliga uppgifter:</strong> hundprofiler (namn, bilder, ras, ålder, beskrivning, plats i form av stad/område), ditt användarnamn, din profilbild (om du valt att ladda upp en), eventuell beskrivning av dig som hundvakt eller liknande.</li>
        <li><strong>När du kontaktar någon:</strong> din kontaktinformation (namn, profilbild) samt de meddelanden du skickar.</li>
        <li><strong>Favoritmarkeringar:</strong> om du markerar en användare som favorit kan den användaren se det (beroende på appens inställningar).</li>
      </ul>
      
      <h3 id="delning-leverantörer">5.2 Tjänsteleverantörer och underleverantörer</h3>
      <p>
        Personuppgifter lagras och behandlas med hjälp av tredjepartsleverantörer. Vi anlitar externa tjänsteleverantörer för att hjälpa oss driva appen, t.ex.:
      </p>
      <ul>
        <li><strong>Supabase (backend och databas)</strong> – för lagring och hantering av användarkonton och data. Databastjänster tillhandahålls via Supabase, vars servrar är lokaliserade inom EU (Irland).</li>
        <li><strong>Google Maps API</strong> – för kartfunktioner och geolokalisering</li>
        <li><strong>Google (t.ex. Google Analytics och Firebase)</strong> – för analys och statistik</li>
        <li><strong>Tekniska tjänsteleverantörer</strong> för drift, säkerhet och mätning</li>
        <li><strong>Marknadsföringsplattformar</strong> (t.ex. Google Ads eller Meta), i den mån marknadsföringsmätning aktiveras och är tillåten enligt lag</li>
        <li><strong>Betalningsleverantörer</strong> (om vi i framtiden erbjuder betalfunktioner direkt i appen)</li>
        <li><strong>Hosting och infrastruktur</strong> – där appen och databasservrar körs</li>
      </ul>
      <p>
        Dessa leverantörer behandlar personuppgifter endast på våra instruktioner och i enlighet med personuppgiftsbiträdesavtal (DPA) samt gällande dataskyddslagar.
      </p>
      
      <h3 id="delning-myndigheter">5.3 Myndigheter och rättsliga krav</h3>
      <p>
        Vi kan komma att lämna ut personuppgifter om det krävs enligt lag, t.ex.:
      </p>
      <ul>
        <li>Vid domstolsbeslut eller myndighetsbeslut</li>
        <li>Vid misstanke om brott (t.ex. polisutredningar)</li>
        <li>För att skydda våra rättigheter eller andras säkerhet</li>
      </ul>
      
      <h3 id="delning-internationell">5.4 Internationell överföring</h3>
      <p>
        Analys- och spårningstjänster kan innebära att personuppgifter behandlas av leverantörer utanför EU/EES. Sådan överföring sker i enlighet med gällande dataskyddslagstiftning och med lämpliga skyddsåtgärder, såsom EU:s standardavtalsklausuler.
      </p>
      <p>
        Vissa av våra tjänsteleverantörer (t.ex. molntjänster, Google) kan ha servrar eller säkerhetskopior utanför EU/EES. För att säkerställa en hög skyddsnivå för dina personuppgifter vid överföring till tredjeland säkerställer vi att överföringen sker i enlighet med GDPR, exempelvis genom:
      </p>
      <ul>
        <li>beslut om adekvat skyddsnivå av EU-kommissionen, eller</li>
        <li>standardavtalsklausuler (SCC) och vid behov ytterligare skyddsåtgärder.</li>
      </ul>
      <p>
        Du kan kontakta oss om du vill ha mer information om vilka skyddsåtgärder som används vid internationella överföringar.
      </p>
      
      <h2 id="lagringstid">6. Lagringstid (retention)</h2>
      <p>
        Vi sparar dina personuppgifter så länge det är nödvändigt för de ändamål som beskrivs i denna policy eller så länge det krävs enligt lag.
      </p>
      <ul>
        <li><strong>Ditt konto:</strong> lagras så länge du har ett aktivt konto.</li>
        <li><strong>Raderat konto:</strong> Du kan när som helst radera ditt konto direkt i appen. När kontot raderas tas personuppgifter, profilinformation, hunduppgifter, bilder och chattmeddelanden bort från våra system inom rimlig tid, om inget annat krävs enligt lag.</li>
        <li><strong>Säkerhetskopior (backups):</strong> kan sparas i upp till 7 dagar innan de raderas automatiskt.</li>
        <li><strong>Inaktivitet:</strong> Om ett konto är inaktivt i 365 dagar kontaktas användaren. Om ingen åtgärd vidtas inom 30 dagar efter sådan kontakt raderas kontot permanent.</li>
        <li><strong>Meddelanden:</strong> raderas eller anonymiseras när du tar bort en konversation i appen, eller senast i samband med att kontot raderas (med beaktande av ev. teknisk fördröjning och backup-rutiner).</li>
        <li><strong>Loggar och tekniska uppgifter:</strong> sparas endast så länge som behövs för säkerhet, felsökning och utveckling.</li>
      </ul>
      
      <h2 id="samtycke-val">7. Samtycke och dina val</h2>
      <p>
        Du kan påverka hur viss behandling av personuppgifter sker:
      </p>
      <ul>
        <li><strong>Webb:</strong> För användning av cookies och liknande tekniker kan du lämna eller återkalla ditt samtycke via våra cookieinställningar. Dessa nås via{' '}
        <a href="https://flocken.info/privacy-choices" className="text-flocken-olive hover:underline">
          https://flocken.info/privacy-choices
        </a>{' '}eller via länk i webbplatsens sidfot.</li>
        <li><strong>App:</strong> Viss mätning kan styras av inställningar i din enhet eller i appen. Eventuell spårning för marknadsföringsändamål är alltid frivillig och påverkar inte möjligheten att använda tjänsten.</li>
      </ul>
      <p>
        Du kan när som helst ändra dina val.
      </p>
      
      <h2 id="rättigheter">8. Dina rättigheter</h2>
      <p>
        Som användare har du rätt att begära tillgång till de personuppgifter vi behandlar om dig, begära rättelse av felaktiga uppgifter eller invända mot viss behandling.
      </p>
      <p>
        För frågor eller för att utöva dina rättigheter kan du kontakta oss via e-post på support@spitakolus.com.
      </p>
      
      <h3>Dina rättigheter enligt GDPR</h3>
      <p>
        Som registrerad har du följande rättigheter:
      </p>
      
      <h3>Rätt till tillgång (registerutdrag)</h3>
      <p>
        Du har rätt att få ett bekräftelse på om vi behandlar personuppgifter om dig och i så fall få en kopia av uppgifterna.
      </p>
      
      <h3>Rätt till rättelse</h3>
      <p>
        Du har rätt att få felaktiga eller ofullständiga uppgifter rättade. Du kan själv redigera dina profiluppgifter och information om din hund direkt i appen. Bilder som du laddat upp kan tas bort av dig när som helst via appen.
      </p>
      
      <h3>Rätt till radering ("rätten att bli bortglömd")</h3>
      <p>
        Du kan när som helst radera ditt konto direkt i appen. När kontot raderas tas personuppgifter, profilinformation, hunduppgifter, bilder och chattmeddelanden bort från våra system inom rimlig tid, om inget annat krävs enligt lag.
      </p>
      <p>
        Du har även rätt att begära radering genom att kontakta oss via e-post, t.ex. om du inte har tillgång till appen.
      </p>
      
      <h3>Rätt till begränsning av behandling</h3>
      <p>
        Du kan i vissa fall begära att vi begränsar behandlingen av dina personuppgifter, t.ex. medan vi utreder en invändning.
      </p>
      
      <h3>Rätt till dataportabilitet</h3>
      <p>
        För uppgifter som du själv har lämnat till oss med stöd av samtycke eller avtal har du rätt att få dem i ett strukturerat, allmänt använt och maskinläsbart format och, om det är tekniskt möjligt, få dem överförda till en annan personuppgiftsansvarig.
      </p>
      
      <h3>Rätt att göra invändning</h3>
      <p>
        Du har rätt att invända mot viss behandling som sker med stöd av berättigat intresse. Vi kommer då att sluta behandla uppgifterna om vi inte kan visa tvingande berättigade skäl som väger tyngre.
      </p>
      
      <h3>Rätt att återkalla samtycke</h3>
      <p>
        Om behandlingen grundas på ditt samtycke kan du när som helst återkalla det, t.ex. genom att stänga av platsdelning i enhetens inställningar eller genom att kontakta oss.
      </p>
      
      <h3>Rätt att lämna in klagomål till tillsynsmyndighet</h3>
      <p>
        Om du anser att vi behandlar dina personuppgifter i strid med dataskyddsreglerna har du rätt att lämna in klagomål till:
      </p>
      <p>
        <strong>Integritetsskyddsmyndigheten (IMY)</strong><br />
        Webbplats:{' '}
        <a href="https://www.imy.se" target="_blank" rel="noopener noreferrer" className="text-flocken-olive hover:underline">
          imy.se
        </a>
      </p>
      <p>
        För att utöva dina rättigheter kan du kontakta oss via de kontaktuppgifter som anges i avsnitt 1. Vi kan behöva be dig bekräfta din identitet för att säkerställa att vi lämnar ut uppgifter till rätt person.
      </p>
      
      <h2 id="säkerhet">9. Datasäkerhet</h2>
      <p>
        Vi vidtar lämpliga tekniska och organisatoriska säkerhetsåtgärder för att skydda dina personuppgifter, bl.a.:
      </p>
      <ul>
        <li>Krypterad kommunikation via HTTPS</li>
        <li>Lösenord lagras endast i krypterad/hashed form</li>
        <li>Row Level Security (RLS) i databasen för att begränsa åtkomst till rätt användare</li>
        <li>Begränsad åtkomst till personuppgifter för endast behörig personal och system</li>
        <li>Regelbunden uppdatering av system och säkerhetsrutiner</li>
      </ul>
      <p>
        Trots våra åtgärder kan ingen teknisk lösning vara 100 % säker. Om en personuppgiftsincident skulle inträffa hanterar vi den i enlighet med GDPR och, vid behov, anmäler till IMY samt informerar berörda användare.
      </p>
      
      <h2 id="barn">10. Barns integritet</h2>
      <p>
        <strong>Flocken är inte avsedd för barn under 13 år.</strong>
      </p>
      <ul>
        <li>Vi samlar inte medvetet in personuppgifter om barn under 13 år.</li>
        <li>Om vi får kännedom om att ett konto tillhör någon under 13 år kommer vi att vidta åtgärder för att radera kontot och tillhörande uppgifter.</li>
        <li>Vi kan ha en åldersverifiering vid registrering och du bekräftar att du är tillräckligt gammal enligt vår policy och tillämplig lag när du skapar konto.</li>
      </ul>
      
      <h2 id="ändringar">11. Ändringar i denna integritetspolicy</h2>
      <ul>
        <li>Vi kan ibland uppdatera denna integritetspolicy, t.ex. om vi lägger till nya funktioner eller om lagstiftningen ändras.</li>
        <li>Vid större ändringar informerar vi dig tydligt i appen eller via e-post.</li>
        <li>Den senaste versionen finns alltid tillgänglig i appen eller på vår webbplats.</li>
        <li>Datumet högst upp på sidan visar när policyn senast uppdaterades.</li>
      </ul>
      
      <h2 id="kontakt">12. Kontakt</h2>
      <p>
        Har du frågor om hur vi behandlar dina personuppgifter, eller vill du utöva någon av dina rättigheter?
      </p>
      <p>
        Kontakta oss:
      </p>
      <p>
        <strong>Spitakolus AB</strong><br />
        E-post:{' '}
        <a href="mailto:support@spitakolus.com" className="text-flocken-olive hover:underline">
          support@spitakolus.com
        </a>
      </p>
      
      <h2 id="privacy-choices">13. Hantera dina integritetsval</h2>
      <p>
        Mer information om hur du kan hantera, ändra dina uppgifter eller cookieinställningar, samt hur du gör för att radera dina uppgifter, finns på vår sida för{' '}
        <a href="/privacy-choices" className="text-flocken-olive hover:underline">
          användarens integritetsval
        </a>.
      </p>
      <p>
        Här kan du{' '}
        <button
          onClick={() => {
            if (typeof window !== 'undefined' && window.showCookieSettings) {
              window.showCookieSettings();
            }
          }}
          className="text-flocken-olive hover:underline bg-transparent border-none p-0 cursor-pointer"
        >
          ändra dina cookie-inställningar
        </button>.
      </p>
    </>
  );
}
