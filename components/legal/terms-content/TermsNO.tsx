'use client';

import Link from 'next/link';

export function TermsNO() {
  return (
    <>
      <h1>Brukervilkår</h1>

      <p className="lead">
        Sist oppdatert: 12. februar 2026
      </p>

      <p>
        Velkommen til Flocken! Disse brukervilkårene (&quot;Vilkårene&quot;) regulerer din bruk av mobilapplikasjonen
        Flocken (&quot;appen&quot;, &quot;tjenesten&quot;) som leveres av Spitakolus AB (&quot;vi&quot;, &quot;oss&quot;, &quot;vår&quot;).
      </p>

      <p>
        Ved å opprette en konto og bruke Flocken godtar du disse vilkårene. Hvis du ikke godtar vilkårene,
        vennligst ikke bruk tjenesten.
      </p>

      <h2 id="definitioner">1. Definisjoner</h2>
      <ul>
        <li><strong>&quot;Bruker&quot;:</strong> Person som har opprettet en konto i Flocken</li>
        <li><strong>&quot;Hundeprofil&quot;:</strong> Profil for en hund som legges ut av en bruker</li>
        <li><strong>&quot;Hundar&quot;:</strong> Funksjon for å matche hunder for parring eller lek</li>
        <li><strong>&quot;Pass&quot;:</strong> Funksjon for å finne og bestille hundepassing</li>
        <li><strong>&quot;Luft&quot;:</strong> Funksjon for å spore og dele turer</li>
        <li><strong>&quot;Besøk&quot;:</strong> Funksjon for å finne hundevennlige steder</li>
        <li><strong>&quot;Innhold&quot;:</strong> All informasjon, bilder, tekst og data som legges ut av brukere</li>
        <li><strong>&quot;Abonnement&quot;:</strong> Betalt tilgang til appens funksjoner via månedlig eller årlig abonnement</li>
      </ul>

      <h2 id="konto">2. Konto og registrering</h2>

      <h3 id="konto-skapa">2.1 Opprette konto</h3>
      <ul>
        <li>Du må oppgi korrekt og fullstendig informasjon</li>
        <li>Du er ansvarlig for å holde innloggingsdetaljene dine sikre</li>
        <li>En konto må ikke deles med andre personer</li>
        <li>Du er ansvarlig for all aktivitet som skjer via kontoen din</li>
        <li>Vi forbeholder oss retten til å avslutte eller suspendere kontoer som bryter med disse vilkårene</li>
      </ul>

      <h3 id="konto-foraldrar">2.2 Foreldreansvar</h3>
      <p>
        Hvis du er forelder eller verge og tillater barnet ditt å bruke Flocken, er du ansvarlig for:
      </p>
      <ul>
        <li>Å overvåke barnets bruk av appen</li>
        <li>All aktivitet som skjer via barnets konto</li>
        <li>At barnets bruk følger disse brukervilkårene</li>
        <li>Eventuelle abonnementer eller betalinger som gjøres via barnets konto</li>
        <li>Å sikre at barnet ikke deler personlig informasjon med ukjente</li>
      </ul>
      <p>
        Vi anbefaler at foreldre aktivt engasjerer seg i barnas bruk av sosiale apper og diskuterer trygg bruk av internett.
      </p>

      <h3 id="konto-typer">2.3 Kontotyper</h3>
      <p>Flocken tilbyr fire kontotyper:</p>
      <ul>
        <li><strong>Hundeeier (dog_owner):</strong> For privatpersoner som ønsker å annonsere sine hunder for parring eller lek. Maks 3 hunder kan annonseres.</li>
        <li><strong>Hundepasser (dog_sitter):</strong> For privatpersoner som kun ønsker å tilby hundepassingstjenester. Kan ikke annonsere hunder for parring.</li>
        <li><strong>Kennel (kennel):</strong> For registrerte kenneler og oppdrettere. Kan annonsere ubegrenset antall hunder.</li>
        <li><strong>Hundedagplass (dog_daycare):</strong> For virksomheter som tilbyr hundedagplass og hundepassingstjenester. Kan annonsere ubegrenset antall hunder.</li>
      </ul>
      <p>
        Du kan når som helst oppgradere eller endre kontotypen din i appens innstillinger.
      </p>

      <h2 id="prenumeration">3. Abonnement og betaling</h2>

      <h3 id="pren-betalning">3.1 Betaling og fakturering</h3>
      <ul>
        <li>Betaling skjer via Apple App Store (for iOS) eller Google Play Store (for Android) i henhold til deres respektive vilkår og regler</li>
        <li>Priser angis inkludert mva</li>
        <li>Alle betalinger håndteres av Apple eller Google – vi mottar ikke betalinger direkte</li>
        <li>Du får kvittering via e-post etter hver betaling fra respektive plattform</li>
        <li>For refusjoner og tilbakebetalinger, følg Apple App Store eller Google Play Stores regler</li>
      </ul>

      <h3 id="pren-fornyelse">3.2 Automatisk fornyelse</h3>
      <ul>
        <li>Abonnementet løper til videre og fornyes automatisk hver måned/år i henhold til valgt periode</li>
        <li>Fornyelse skjer automatisk ved slutten av hver periode med mindre du sier opp abonnementet</li>
        <li>For å slå av automatisk fornyelse må du si opp abonnementet i App Store eller Google Play-innstillingene</li>
        <li>Oppsigelse må skje før neste faktureringsperiode for å unngå betaling</li>
        <li>Ved oppsigelse beholder du tilgang til premiumfunksjonene til periodens slutt</li>
      </ul>

      <h3 id="pren-trial">3.3 Prøveperioder</h3>
      <ul>
        <li>Vi kan tilby prøveperioder der du kan teste appen uten kostnad</li>
        <li>Under prøveperioden trenger du ikke oppgi betalingsinformasjon</li>
        <li>Du forplikter deg ikke til å fortsette med en betalt versjon etter prøveperioden</li>
        <li>Hvis du velger å ikke betale etter prøveperioden, kan du fortsette å bruke appen i en begrenset gratisversjon</li>
        <li>Varighet og vilkår for prøveperioder angis i appen når tilbudet gis</li>
      </ul>

      <h3 id="pren-uppsagning">3.4 Oppsigelse</h3>
      <ul>
        <li>Du kan si opp abonnementet når som helst i App Store eller Google Play-innstillingene</li>
        <li>Oppsigelse må skje før neste faktureringsperiode starter</li>
        <li>Oppsigelse trer i kraft ved neste faktureringsperiode</li>
        <li>Ingen refusjon skjer for allerede betalte perioder</li>
        <li>Ved oppsigelse beholder du tilgang til premiumfunksjonene til periodens slutt</li>
        <li>Etter oppsigelse overgår kontoen din automatisk til en begrenset gratisversjon</li>
        <li>Du kan når som helst oppgradere til premiumversjon igjen</li>
      </ul>

      <h3 id="pren-priser-andring">3.5 Priser og prisendringer</h3>
      <ul>
        <li>Priser for abonnementer vises i appen og kan variere avhengig av kontotype og valgt periode (månedlig eller årlig)</li>
        <li>Vi kan tilby kampanjer og rabatter som påvirker prisene</li>
        <li>Priser angis inkludert mva</li>
        <li>Vi forbeholder oss retten til å endre priser</li>
        <li>Prisendringer varsles minst 30 dager i forveien via e-post og i appen</li>
        <li>Hvis du ikke godtar nye priser, kan du si opp abonnementet før endringen trer i kraft</li>
        <li>Hvis du fortsetter å bruke tjenesten etter prisendringen, godtar du automatisk de nye prisene</li>
      </ul>

      <h2 id="funktioner">4. Tjenestens funksjoner</h2>

      <h3 id="funk-hundar">4.1 Hundar (Hundematching)</h3>
      <p><strong>Tillatt bruk:</strong></p>
      <ul>
        <li>Finne hunder for parring eller lek</li>
        <li>Filtrere på rase, størrelse, helsetester og andre kriterier</li>
        <li>Kontakte andre hundeeiere via appens meldingsfunksjon</li>
        <li>Legge ut hundeprofiler med bilder og informasjon (maks antall hunder varierer per kontotype)</li>
      </ul>

      <p><strong>Brukeransvar:</strong></p>
      <ul>
        <li>Du er ansvarlig for å oppgi korrekte opplysninger om hunden din</li>
        <li>Helsetester og stamtavler må være ekte og verifiserbare</li>
        <li>Du er ansvarlig for alle avtaler med andre brukere</li>
        <li>Flocken er ikke part i noen avtaler mellom brukere</li>
        <li>Vi tar ikke ansvar for resultatet av parringer som skjer via appen</li>
        <li>Du er ansvarlig for å følge svensk dyrevelferdslovgivning og etiske retningslinjer for hundavl</li>
      </ul>

      <h3 id="funk-passa">4.2 Pass (Hundepassingstjenester)</h3>
      <p><strong>For hundepassere:</strong></p>
      <ul>
        <li>Du må oppgi korrekte opplysninger om erfaring og tjenester</li>
        <li>Du er ansvarlig for hundens sikkerhet under passing</li>
        <li>Du må ha passende forsikring som dekker hundepassingstjenester</li>
        <li>Du er ansvarlig for å følge alle instruksjoner fra hundeeieren</li>
        <li>Du må informere hundeeieren om eventuelle hendelser eller problemer umiddelbart</li>
      </ul>

      <p><strong>For hundeeiere:</strong></p>
      <ul>
        <li>Du er ansvarlig for å gi korrekte instruksjoner om hundens behov</li>
        <li>Du må informere om medisinske behov, allergier eller atferdsproblemer</li>
        <li>Du er ansvarlig for at hunden din er vaksinert og frisk</li>
        <li>Betaling for hundepassingstjenester skjer direkte mellom deg og hundepasseren – Flocken tar ingen provisjon</li>
        <li>Du er ansvarlig for å sikre at hundepasseren har passende forsikring</li>
      </ul>

      <p><strong>Ansvarsbegrensning:</strong></p>
      <ul>
        <li>Flocken er en formidlingsplattform – vi er ikke hundepassingstjenesten</li>
        <li>Vi kontrollerer ikke hundepassernes kompetanse, egnethet eller forsikringer</li>
        <li>Alle avtaler om passing er mellom deg og hundepasseren</li>
        <li>Vi ansvarer ikke for skader, tap eller ulykker under passing</li>
        <li>Brukeren må selv sikre tilstrekkelig forsikring og juridisk beskyttelse</li>
        <li>Vi forbeholder oss retten til å fjerne brukere som bryter med disse reglene</li>
      </ul>

      <h3 id="funk-rasta">4.3 Luft (Tur-tracking)</h3>
      <p><strong>Tillatt bruk:</strong></p>
      <ul>
        <li>Spore turene dine med GPS</li>
        <li>Lagre turer privat eller dele dem offentlig</li>
        <li>Se andres delte turer</li>
        <li>Samle poeng basert på distanse</li>
        <li>Dele turer med venner</li>
      </ul>

      <p><strong>Brukeransvar:</strong></p>
      <ul>
        <li>Du er ansvarlig for å følge lokale regler og lover ved turer</li>
        <li>Du er ansvarlig for å holde hunden din i bånd der det kreves</li>
        <li>GPS-data lagres i henhold til vår integritetspolicy</li>
      </ul>

      <h3 id="funk-besoka">4.4 Besøk (Hundevennlige steder)</h3>
      <p><strong>Tillatt bruk:</strong></p>
      <ul>
        <li>Finne hundevennlige kafeer, restauranter og barer</li>
        <li>Legge til manglende steder</li>
        <li>Filtrere på kategori</li>
        <li>Legge igjen anmeldelser og vurderinger</li>
      </ul>

      <p><strong>Brukeransvar:</strong></p>
      <ul>
        <li>Du er ansvarlig for at informasjonen du legger til er korrekt</li>
        <li>Anmeldelser må være ærlige og basert på faktiske opplevelser</li>
        <li>Vi forbeholder oss retten til å fjerne feilaktig eller upassende informasjon</li>
      </ul>

      <h2 id="innehall">5. Brukergenerert innhold</h2>

      <h3 id="innehall-ansvar">5.1 Ditt ansvar</h3>
      <p>Du er ansvarlig for alt innhold du laster opp, inkludert:</p>
      <ul>
        <li>Bilder av hunder</li>
        <li>Beskrivelser og profiltekster</li>
        <li>Meldinger til andre brukere</li>
        <li>Anmeldelser av hundepassere og steder</li>
        <li>Delte turer</li>
        <li>Kommentarer og interaksjoner</li>
      </ul>

      <h3 id="innehall-forbud">5.2 Forbudt innhold</h3>
      <p>Følgende er forbudt:</p>
      <ul>
        <li>Ulovlig innhold eller innhold som oppfordrer til ulovlig virksomhet</li>
        <li>Krenkende, truende eller trakasserende innhold</li>
        <li>Falsk eller villedende informasjon</li>
        <li>Pornografisk eller voldelig materiale</li>
        <li>Spam eller markedsføring uten tillatelse</li>
        <li>Opphavsrettsbeskyttet materiale du ikke har rett til å bruke</li>
        <li>Personopplysninger om andre personer uten deres samtykke</li>
        <li>Innhold som krenker dyrevelferd eller etiske retningslinjer</li>
      </ul>

      <h3 id="innehall-licens">5.3 Lisens til oss</h3>
      <p>
        Ved å laste opp innhold gir du oss en ikke-eksklusiv, global, royaltyfri lisens til å bruke,
        vise og distribuere innholdet innenfor tjenesten. Dette er nødvendig for at appen skal fungere
        (f.eks. vise hundebildene dine for andre brukere). Du beholder eierskapet til innholdet ditt.
      </p>
      <p>
        Vi forbeholder oss retten til å fjerne, redigere eller moderere innhold som bryter med disse vilkårene
        uten forhåndsvarsel.
      </p>

      <h3 id="innehall-rapportering">5.4 Rapportering av upassende innhold</h3>
      <p>
        Hvis du støter på innhold som bryter med disse vilkårene, vennligst rapporter det via appens
        rapporteringsfunksjon eller kontakt oss på support@spitakolus.com.
      </p>

      <h3 id="innehall-community">5.5 Community Guidelines</h3>
      <p>
        For å opprettholde et trygt og hyggelig miljø for alle brukere forventer vi at du:
      </p>
      <ul>
        <li><strong>Er respektfull:</strong> Behandle andre brukere med respekt og høflighet</li>
        <li><strong>Er ærlig:</strong> Gi sannferdig informasjon om deg selv og hunden din</li>
        <li><strong>Følger lover:</strong> Følg alle gjeldende lover og regler, spesielt dyrevelferdslovgivning</li>
        <li><strong>Beskytter andres sikkerhet:</strong> Rapporter umiddelbart hvis du mistenker at noen utsettes for fare</li>
        <li><strong>Respekterer personvern:</strong> Del ikke andre personers personopplysninger uten deres samtykke</li>
        <li><strong>Kommuniserer konstruktivt:</strong> Unngå konflikter, trakassering og truende oppførsel</li>
        <li><strong>Tar ansvar ved hundemøter:</strong> Sikre at hundemøter skjer på trygge steder og at alle parter er komfortable</li>
      </ul>

      <p><strong>Vårt ansvar og rett til å moderere:</strong></p>
      <ul>
        <li>Vi overvåker og modererer innhold og oppførsel i appen</li>
        <li>Vi kan gjennomgå rapportert innhold og iverksette tiltak ved overtredelser</li>
        <li>Vi kan fjerne innhold som bryter med disse retningslinjene uten forhåndsvarsel</li>
        <li>Vi kan utstede advarsler, midlertidige utestengelser eller permanente utestengelser ved gjentatte eller alvorlige overtredelser</li>
        <li>Vi samarbeider med myndigheter ved mistanke om kriminalitet</li>
        <li>Våre beslutninger om moderering er endelige, men du kan kontakte oss på support@spitakolus.com hvis du mener at en beslutning er feilaktig</li>
      </ul>

      <h2 id="integritet">6. Personvern og databeskyttelse</h2>

      <h3 id="integritet-behandling">6.1 Behandling av personopplysninger</h3>
      <p>
        Vi samler inn og behandler personopplysninger i henhold til vår integritetspolicy, som følger GDPR og svensk
        personvernlovgivning. Ved å bruke tjenesten godtar du vår behandling av personopplysninger
        i henhold til integritetspolicen.
      </p>
      <p>
        For mer informasjon om hvordan vi behandler dine personopplysninger, se vår{' '}
        <Link href="/integritetspolicy?lang=no" className="text-flocken-olive hover:underline">integritetspolicy</Link>.
      </p>

      <h3 id="integritet-rattigheter">6.2 Dine rettigheter</h3>
      <p>
        Du har rett til å:
      </p>
      <ul>
        <li>Få tilgang til dine personopplysninger</li>
        <li>Retting av feilaktige opplysninger</li>
        <li>Slette kontoen din og dine opplysninger</li>
        <li>Eksportere dine opplysninger (dataportabilitet)</li>
        <li>Protestere mot visse behandlinger</li>
        <li>Trekke tilbake ditt samtykke</li>
      </ul>
      <p>
        For å utøve dine rettigheter eller få mer informasjon, besøk vår side for{' '}
        <Link href="/privacy-choices" className="text-flocken-olive hover:underline">personvernvalg</Link> eller kontakt oss på support@spitakolus.com.
      </p>

      <h2 id="ansvar">7. Ansvarsbegrensning</h2>

      <h3 id="ansvar-tjanst">7.1 Tjenestens tilgjengelighet</h3>
      <p>
        Vi streber etter høy tilgjengelighet, men kan ikke garantere at tjenesten alltid er tilgjengelig eller feilfri.
        Vi ansvarer ikke for:
      </p>
      <ul>
        <li>Avbrudd i tjenesten (planlagte eller uplanlagte)</li>
        <li>Datatap</li>
        <li>Tekniske feil eller feil</li>
        <li>Tredjepartstjenester (inkludert men ikke begrenset til betalingsleverandører, karttjenester, skytjenester, analyseverktøy og meldingstjenester) som ikke fungerer eller er utilgjengelige</li>
        <li>Tap som oppstår på grunn av tekniske problemer</li>
      </ul>

      <h3 id="ansvar-anvandare">7.2 Brukerinteraksjoner</h3>
      <p>
        Flocken er en plattform for å koble sammen hundeeiere. Vi ansvarer ikke for:
      </p>
      <ul>
        <li>Avtaler eller transaksjoner mellom brukere</li>
        <li>Oppførsel eller handlinger fra andre brukere</li>
        <li>Skader som oppstår ved hundemøter, passing eller andre aktiviteter</li>
        <li>Falskt eller villedende innhold fra brukere</li>
        <li>Veterinære spørsmål eller helseproblemer hos hunder</li>
        <li>Økonomiske tap som oppstår i forbindelse med bruk av tjenesten</li>
      </ul>

      <h3 id="ansvar-max">7.3 Maksimalt ansvar</h3>
      <p>
        Vårt totale ansvar overfor deg er begrenset til det beløp du har betalt for abonnementet i løpet av
        de siste 12 månedene. Vi ansvarer ikke for indirekte skader, tapt fortjeneste eller andre konsekvenser.
      </p>

      <h3 id="ansvar-force-majeure">7.4 Force Majeure</h3>
      <p>
        Vi ansvarer ikke for forsinkelser eller manglende oppfyllelse av våre forpliktelser i henhold til disse vilkårene hvis dette skyldes
        omstendigheter utenfor vår rimelige kontroll, inkludert men ikke begrenset til:
      </p>
      <ul>
        <li>Naturkatastrofer (flom, jordskjelv, stormer osv.)</li>
        <li>Krig, terrorisme eller sivil uro</li>
        <li>Pandemier eller epidemier</li>
        <li>Streiker eller arbeidskonflikter</li>
        <li>Strømbrudd eller avbrudd i telekommunikasjon</li>
        <li>Cyberangrep eller sabotasje</li>
        <li>Myndighetsbeslutninger, lovendringer eller andre reguleringstiltak</li>
        <li>Feil eller avbrudd hos tredjepartsleverandører som er utenfor vår kontroll</li>
      </ul>
      <p>
        Ved slike omstendigheter vil våre forpliktelser bli utsatt for den tiden hindringen varer. Hvis hindringen varer
        lenger enn 60 dager, har både du og vi rett til å si opp avtalen uten erstatningsplikt.
      </p>

      <h2 id="upphovsratt">8. Opphavsrett og immaterielle rettigheter</h2>

      <p>
        Appen, inkludert design, logo, tekst og kode, er beskyttet av opphavsrett og andre immaterielle
        rettigheter som tilhører Spitakolus AB eller våre lisensgivere. Du har ikke rett til å kopiere, endre eller
        distribuere appen uten vår skriftlige tillatelse.
      </p>

      <h2 id="uppsagning">9. Oppsigelse av tjenesten</h2>

      <h3 id="uppsagning-anvandare">9.1 Oppsigelse av deg</h3>
      <p>
        Du kan når som helst avslutte kontoen din ved å slette den i appens innstillinger eller ved å
        kontakte oss på support@spitakolus.com.
      </p>

      <h3 id="uppsagning-oss">9.2 Oppsigelse av oss</h3>
      <p>
        Vi forbeholder oss retten til å avslutte eller suspendere kontoen din umiddelbart hvis du bryter med disse
        vilkårene, uten forhåndsvarsel. Vi kan også avslutte tjenesten helt med 30 dagers varsel.
      </p>

      <h2 id="andringar">10. Endringer i vilkårene</h2>

      <p>
        Vi forbeholder oss retten til å endre disse vilkårene når som helst. Betydelige endringer varsles via
        e-post og i appen minst 30 dager før de trer i kraft. Hvis du fortsetter å bruke tjenesten etter
        at endringene har trådt i kraft, godtar du de nye vilkårene.
      </p>

      <h2 id="tvist">11. Tvisteløsning og gjeldende lov</h2>

      <h3 id="tvist-lag">11.1 Gjeldende lov</h3>
      <p>
        Disse vilkårene reguleres av svensk lov.
      </p>

      <h3 id="tvist-losning">11.2 Tvisteløsning</h3>
      <p>
        Tvister skal i første omgang løses gjennom forhandling mellom deg og oss. Hvis forhandling ikke fører
        til løsning, skal tvisten avgjøres av svensk alminnelig domstol.
      </p>

      <h3 id="tvist-konsument">11.3 Forbrukertvist</h3>
      <p>
        Hvis du er forbruker, kan du også vende deg til Allmänna reklamationsnämnden (ARN) for tvisteløsning.
        <br/>
        <strong>Nettside:</strong>{' '}
        <a href="https://www.arn.se" target="_blank" rel="noopener noreferrer" className="text-flocken-olive hover:underline">www.arn.se</a>
      </p>

      <h2 id="ovrigt">12. Øvrig</h2>

      <h3 id="ovrigt-delning">12.1 Ugyldige bestemmelser</h3>
      <p>
        Hvis noen del av disse vilkårene er ugyldig eller uoppfyllbar, påvirker ikke dette gyldigheten av
        øvrige deler.
      </p>

      <h3 id="ovrigt-hela">12.2 Hele avtalen</h3>
      <p>
        Disse vilkårene utgjør hele avtalen mellom deg og oss angående bruken av tjenesten.
      </p>

      <h2 id="kontakt">13. Kontakt oss</h2>

      <p>
        Hvis du har spørsmål om disse vilkårene, kontakt oss:
      </p>
      <ul>
        <li><strong>E-post:</strong> support@spitakolus.com</li>
        <li><strong>Postadresse:</strong> Spitakolus AB, Svängrumsgatan 46, 421 71 Västra Frölunda</li>
        <li><strong>Organisasjonsnummer:</strong> 559554-6101</li>
        <li><strong>Sak:</strong> Skriv &quot;Brukervilkår&quot; i emnefeltet</li>
      </ul>

      <p className="mt-8 text-sm text-flocken-gray">
        Disse brukervilkårene ble sist oppdatert 12. februar 2026 og trer i kraft umiddelbart.
      </p>
    </>
  );
}
