'use client';

import Link from 'next/link';

export function TermsDA() {
  return (
    <>
      <h1>Brugervilkår</h1>

      <p className="lead">
        Sidst opdateret: 12. februar 2026
      </p>

      <p>
        Velkommen til Flocken! Disse brugervilkår (&quot;Vilkår&quot;) regulerer din brug af mobilapplikationen
        Flocken (&quot;Appen&quot;, &quot;Tjenesten&quot;) som leveres af Spitakolus AB (&quot;vi&quot;, &quot;os&quot;, &quot;vores&quot;).
      </p>

      <p>
        Ved at oprette en konto og bruge Flocken accepterer du disse vilkår. Hvis du ikke accepterer vilkårene,
        bedes du ikke bruge tjenesten.
      </p>

      <h2 id="definitioner">1. Definitioner</h2>
      <ul>
        <li><strong>&quot;Bruger&quot;:</strong> Person der har oprettet en konto i Flocken</li>
        <li><strong>&quot;Hundeprofil&quot;:</strong> Profil for en hund som oprettes af en bruger</li>
        <li><strong>&quot;Hundar&quot;:</strong> Funktion til at matche hunde til parring eller leg</li>
        <li><strong>&quot;Pas&quot;:</strong> Funktion til at finde og booke hundepassere</li>
        <li><strong>&quot;Luft&quot;:</strong> Funktion til at spore og dele gåture</li>
        <li><strong>&quot;Besøg&quot;:</strong> Funktion til at finde hundevenlige steder</li>
        <li><strong>&quot;Indhold&quot;:</strong> Al information, billeder, tekst og data som uploades af brugere</li>
        <li><strong>&quot;Abonnement&quot;:</strong> Betalt adgang til appens funktioner via månedligt eller årligt abonnement</li>
      </ul>

      <h2 id="konto">2. Konto og registrering</h2>

      <h3 id="konto-skapa">2.1 Opret konto</h3>
      <ul>
        <li>Du skal angive korrekte og fuldstændige oplysninger</li>
        <li>Du er ansvarlig for at holde dine loginoplysninger sikre</li>
        <li>En konto må ikke deles med andre personer</li>
        <li>Du er ansvarlig for al aktivitet der sker via din konto</li>
        <li>Vi forbeholder os retten til at afslutte eller suspendere konti der overtræder disse vilkår</li>
      </ul>

      <h3 id="konto-foraldrar">2.2 Forældreansvar</h3>
      <p>
        Hvis du er forælder eller værge og tillader dit barn at bruge Flocken, er du ansvarlig for:
      </p>
      <ul>
        <li>At overvåge barnets brug af appen</li>
        <li>Al aktivitet der sker via barnets konto</li>
        <li>At barnets brug følger disse brugervilkår</li>
        <li>Eventuelle abonnementer eller betalinger der foretages via barnets konto</li>
        <li>At sikre at barnet ikke deler personlige oplysninger med ukendte</li>
      </ul>
      <p>
        Vi anbefaler at forældre aktivt engagerer sig i deres børns brug af sociale apps og diskuterer sikker internetbrug.
      </p>

      <h3 id="konto-typer">2.3 Kontotyper</h3>
      <p>Flocken tilbyder fire kontotyper:</p>
      <ul>
        <li><strong>Hundeejer (dog_owner):</strong> For privatpersoner der ønsker at annoncere deres hunde til parring eller leg. Max 3 hunde kan annonceres.</li>
        <li><strong>Hundepasser (dog_sitter):</strong> For privatpersoner der kun ønsker at tilbyde hundepasningstjenester. Kan ikke annoncere hunde til parring.</li>
        <li><strong>Kennel (kennel):</strong> For registrerede kenneler og avlere. Kan annoncere ubegrænset antal hunde.</li>
        <li><strong>Hundedagpleje (dog_daycare):</strong> For virksomheder der tilbyder hundedagpleje og hundepasningstjenester. Kan annoncere ubegrænset antal hunde.</li>
      </ul>
      <p>
        Du kan til enhver tid opgradere eller ændre din kontotype i appens indstillinger.
      </p>

      <h2 id="prenumeration">3. Abonnement og betaling</h2>

      <h3 id="pren-betalning">3.1 Betaling og fakturering</h3>
      <ul>
        <li>Betaling sker via Apple App Store (for iOS) eller Google Play Store (for Android) i henhold til deres respektive vilkår og regler</li>
        <li>Priser angives inklusive moms</li>
        <li>Alle betalinger håndteres af Apple eller Google – vi modtager ikke betalinger direkte</li>
        <li>Du modtager kvittering via e-mail efter hver betaling fra den respektive platform</li>
        <li>For refusioner og tilbagebetalinger, følg Apple App Store eller Google Play Stores regler</li>
      </ul>

      <h3 id="pren-fornyelse">3.2 Automatisk fornyelse</h3>
      <ul>
        <li>Abonnementet løber ubegrænset og fornyes automatisk hver måned/år efter valgt periode</li>
        <li>Fornyelse sker automatisk ved udgangen af hver periode medmindre du opsiger abonnementet</li>
        <li>For at slå automatisk fornyelse fra skal du opsige abonnementet i App Store eller Google Play-indstillingerne</li>
        <li>Opsigelse skal ske før næste faktureringsperiode for at undgå betaling</li>
        <li>Ved opsigelse beholder du adgang til premiumfunktionerne til periodens udløb</li>
      </ul>

      <h3 id="pren-trial">3.3 Prøveperioder</h3>
      <ul>
        <li>Vi kan tilbyde prøveperioder hvor du kan teste appen uden omkostninger</li>
        <li>Under prøveperioden behøver du ikke angive betalingsoplysninger</li>
        <li>Du forpligter dig ikke til at fortsætte med en betalingsversion efter prøveperioden</li>
        <li>Hvis du vælger ikke at betale efter prøveperioden, kan du fortsætte med at bruge appen i en begrænset gratisversion</li>
        <li>Længde og vilkår for prøveperioder angives i appen når tilbuddet gives</li>
      </ul>

      <h3 id="pren-uppsagning">3.4 Opsigelse</h3>
      <ul>
        <li>Du kan opsige abonnementet til enhver tid i App Store eller Google Play-indstillingerne</li>
        <li>Opsigelse skal ske før næste faktureringsperiode begynder</li>
        <li>Opsigelse træder i kraft ved næste faktureringsperiode</li>
        <li>Ingen refusion sker for allerede betalte perioder</li>
        <li>Ved opsigelse beholder du adgang til premiumfunktionerne til periodens udløb</li>
        <li>Efter opsigelse overgår din konto automatisk til en begrænset gratisversion</li>
        <li>Du kan til enhver tid opgradere til premiumversion igen</li>
      </ul>

      <h3 id="pren-priser-andring">3.5 Priser og prisændringer</h3>
      <ul>
        <li>Priser for abonnementer vises i appen og kan variere afhængigt af kontotype og valgt periode (månedligt eller årligt)</li>
        <li>Vi kan tilbyde kampagner og rabatter der påvirker priserne</li>
        <li>Priser angives inklusive moms</li>
        <li>Vi forbeholder os retten til at ændre priser</li>
        <li>Prisændringer meddeles mindst 30 dage i forvejen via e-mail og i appen</li>
        <li>Hvis du ikke accepterer nye priser kan du opsige abonnementet før ændringen træder i kraft</li>
        <li>Hvis du fortsætter med at bruge tjenesten efter prisændringen accepterer du automatisk de nye priser</li>
      </ul>

      <h2 id="funktioner">4. Tjenestens funktioner</h2>

      <h3 id="funk-hundar">4.1 Hundar (Hundematchning)</h3>
      <p><strong>Tilladt brug:</strong></p>
      <ul>
        <li>Finde hunde til parring eller leg</li>
        <li>Filtrere på race, størrelse, sundhedstests og andre kriterier</li>
        <li>Kontakte andre hundeejere via appens beskedfunktion</li>
        <li>Oprette hundeprofiler med billeder og information (max antal hunde varierer per kontotype)</li>
      </ul>

      <p><strong>Brugeransvar:</strong></p>
      <ul>
        <li>Du er ansvarlig for at angive korrekte oplysninger om din hund</li>
        <li>Sundhedstests og stamtavler skal være ægte og verificerbare</li>
        <li>Du er ansvarlig for alle aftaler med andre brugere</li>
        <li>Flocken er ikke part i nogen aftaler mellem brugere</li>
        <li>Vi tager intet ansvar for resultatet af parringer der sker via appen</li>
        <li>Du er ansvarlig for at følge dansk dyrevelfærdslovgivning og etiske retningslinjer for hundeavl</li>
      </ul>

      <h3 id="funk-passa">4.2 Pas (Hundepasning)</h3>
      <p><strong>For hundepassere:</strong></p>
      <ul>
        <li>Du skal angive korrekte oplysninger om erfaring og tjenester</li>
        <li>Du er ansvarlig for hundens sikkerhed under pasning</li>
        <li>Du skal have passende forsikring der dækker hundepasningstjenester</li>
        <li>Du er ansvarlig for at følge alle instruktioner fra hundeejeren</li>
        <li>Du skal informere hundeejeren om eventuelle hændelser eller problemer øjeblikkeligt</li>
      </ul>

      <p><strong>For hundeejere:</strong></p>
      <ul>
        <li>Du er ansvarlig for at give korrekte instruktioner om hundens behov</li>
        <li>Du skal informere om medicinske behov, allergier eller adfærdsproblemer</li>
        <li>Du er ansvarlig for at din hund er vaccineret og rask</li>
        <li>Betaling for hundepasningstjenester sker direkte mellem dig og hundepasseren – Flocken tager ingen provision</li>
        <li>Du er ansvarlig for at sikre at hundepasseren har passende forsikring</li>
      </ul>

      <p><strong>Ansvarsbegrænsning:</strong></p>
      <ul>
        <li>Flocken er en formidlingsplatform – vi er ikke hundepasningstjenesten</li>
        <li>Vi kontrollerer ikke hundepassernes kompetence, egnethed eller forsikringer</li>
        <li>Alle aftaler om pasning er mellem dig og hundepasseren</li>
        <li>Vi ansvarer ikke for skader, tab eller ulykker under pasning</li>
        <li>Brugeren skal selv sikre tilstrækkelig forsikring og juridisk beskyttelse</li>
        <li>Vi forbeholder os retten til at fjerne brugere der overtræder disse regler</li>
      </ul>

      <h3 id="funk-rasta">4.3 Luft (Gåtur-tracking)</h3>
      <p><strong>Tilladt brug:</strong></p>
      <ul>
        <li>Spore dine gåture med GPS</li>
        <li>Gemme ruter privat eller dele dem offentligt</li>
        <li>Se andres delte ruter</li>
        <li>Samle point baseret på distance</li>
        <li>Dele gåture med venner</li>
      </ul>

      <p><strong>Brugeransvar:</strong></p>
      <ul>
        <li>Du er ansvarlig for at følge lokale regler og love ved gåture</li>
        <li>Du er ansvarlig for at holde din hund i snor hvor det er påkrævet</li>
        <li>GPS-data lagres i henhold til vores privatlivspolitik</li>
      </ul>

      <h3 id="funk-besoka">4.4 Besøg (Hundevenlige steder)</h3>
      <p><strong>Tilladt brug:</strong></p>
      <ul>
        <li>Finde hundevenlige caféer, restauranter og barer</li>
        <li>Tilføje manglende steder</li>
        <li>Filtrere på kategori</li>
        <li>Efterlade anmeldelser og bedømmelser</li>
      </ul>

      <p><strong>Brugeransvar:</strong></p>
      <ul>
        <li>Du er ansvarlig for at informationen du tilføjer er korrekt</li>
        <li>Anmeldelser skal være ærlige og baseret på faktiske oplevelser</li>
        <li>Vi forbeholder os retten til at fjerne forkert eller upassende information</li>
      </ul>

      <h2 id="innehall">5. Brugergenereret indhold</h2>

      <h3 id="innehall-ansvar">5.1 Dit ansvar</h3>
      <p>Du er ansvarlig for alt indhold du uploader, herunder:</p>
      <ul>
        <li>Billeder af hunde</li>
        <li>Beskrivelser og profiltekster</li>
        <li>Beskeder til andre brugere</li>
        <li>Anmeldelser af hundepassere og steder</li>
        <li>Delte gåture</li>
        <li>Kommentarer og interaktioner</li>
      </ul>

      <h3 id="innehall-forbud">5.2 Forbudt indhold</h3>
      <p>Følgende er forbudt:</p>
      <ul>
        <li>Ulovligt indhold eller indhold der opfordrer til ulovlig aktivitet</li>
        <li>Krænkende, truende eller chikanerende indhold</li>
        <li>Falsk eller vildledende information</li>
        <li>Pornografisk eller voldeligt materiale</li>
        <li>Spam eller markedsføring uden tilladelse</li>
        <li>Ophavsretligt beskyttet materiale du ikke har ret til at bruge</li>
        <li>Personoplysninger om andre personer uden deres samtykke</li>
        <li>Indhold der krænker dyrevelfærd eller etiske retningslinjer</li>
      </ul>

      <h3 id="innehall-licens">5.3 Licens til os</h3>
      <p>
        Ved at uploade indhold giver du os en ikke-eksklusiv, global, royaltyfri licens til at bruge,
        vise og distribuere indholdet inden for tjenesten. Dette er nødvendigt for at appen skal fungere
        (f.eks. vise dine hundebilleder for andre brugere). Du beholder ejerretten til dit indhold.
      </p>
      <p>
        Vi forbeholder os retten til at fjerne, redigere eller moderere indhold der overtræder disse vilkår
        uden forudgående meddelelse.
      </p>

      <h3 id="innehall-rapportering">5.4 Rapportering af upassende indhold</h3>
      <p>
        Hvis du støder på indhold der overtræder disse vilkår, bedes du rapportere det via appens
        rapporteringsfunktion eller kontakte os på support@spitakolus.com.
      </p>

      <h3 id="innehall-community">5.5 Community Guidelines</h3>
      <p>
        For at opretholde et sikkert og behageligt miljø for alle brugere forventer vi at du:
      </p>
      <ul>
        <li><strong>Er respektfuld:</strong> Behandl andre brugere med respekt og høflighed</li>
        <li><strong>Er ærlig:</strong> Giv sandfærdig information om dig selv og din hund</li>
        <li><strong>Følger love:</strong> Følg alle gældende love og regler, særligt dyrevelfærdslovgivning</li>
        <li><strong>Beskytter andres sikkerhed:</strong> Rapporter øjeblikkeligt hvis du mistænker at nogen udsættes for fare</li>
        <li><strong>Respekterer privatliv:</strong> Del ikke andre personers personoplysninger uden deres samtykke</li>
        <li><strong>Kommunikerer konstruktivt:</strong> Undgå konflikter, chikane og truende adfærd</li>
        <li><strong>Tager ansvar ved hundemøder:</strong> Sikr at hundemøder sker på sikre steder og at alle parter er komfortable</li>
      </ul>

      <p><strong>Vores ansvar og ret til at moderere:</strong></p>
      <ul>
        <li>Vi overvåger og modererer indhold og adfærd i appen</li>
        <li>Vi kan gennemgå rapporteret indhold og tage foranstaltninger ved overtrædelser</li>
        <li>Vi kan fjerne indhold der overtræder disse retningslinjer uden forudgående advarsel</li>
        <li>Vi kan udstede advarsler, midlertidige udelukkelser eller permanente udelukkelser ved gentagne eller alvorlige overtrædelser</li>
        <li>Vi samarbejder med myndigheder ved mistanke om kriminalitet</li>
        <li>Vores beslutninger om moderering er endelige, men du kan kontakte os på support@spitakolus.com hvis du mener at en beslutning er forkert</li>
      </ul>

      <h2 id="integritet">6. Privatliv og databeskyttelse</h2>

      <h3 id="integritet-behandling">6.1 Behandling af personoplysninger</h3>
      <p>
        Vi indsamler og behandler personoplysninger i henhold til vores privatlivspolitik, som følger GDPR og dansk
        databeskyttelseslovgivning. Ved at bruge tjenesten accepterer du vores behandling af personoplysninger
        i henhold til privatlivspolitikken.
      </p>
      <p>
        For mere information om hvordan vi behandler dine personoplysninger, se vores
        <Link href="/integritetspolicy?lang=da" className="text-flocken-olive hover:underline">privatlivspolitik</Link>.
      </p>

      <h3 id="integritet-rattigheter">6.2 Dine rettigheder</h3>
      <p>
        Du har ret til at:
      </p>
      <ul>
        <li>Få adgang til dine personoplysninger</li>
        <li>Rette forkert oplysninger</li>
        <li>Slette din konto og dine oplysninger</li>
        <li>Eksportere dine oplysninger (dataportabilitet)</li>
        <li>Gøre indsigelse mod visse behandlinger</li>
        <li>Tilbagekalde dit samtykke</li>
      </ul>
      <p>
        For at udøve dine rettigheder eller få mere information, besøg vores side for
        <Link href="/privacy-choices" className="text-flocken-olive hover:underline">privatlivsindstillinger</Link> eller kontakt os på support@spitakolus.com.
      </p>

      <h2 id="ansvar">7. Ansvarsbegrænsning</h2>

      <h3 id="ansvar-tjanst">7.1 Tjenestens tilgængelighed</h3>
      <p>
        Vi stræber efter høj tilgængelighed, men kan ikke garantere at tjenesten altid er tilgængelig eller fejlfri.
        Vi ansvarer ikke for:
      </p>
      <ul>
        <li>Afbrydelser i tjenesten (planlagte eller uplanlagte)</li>
        <li>Datatab</li>
        <li>Tekniske fejl eller fejl</li>
        <li>Tredjepartstjenester (inklusive men ikke begrænset til betalingsudbydere, korttjenester, cloud-tjenester, analyseværktøjer og beskedtjenester) der ikke fungerer eller er utilgængelige</li>
        <li>Tab der opstår på grund af tekniske problemer</li>
      </ul>

      <h3 id="ansvar-anvandare">7.2 Brugerinteraktioner</h3>
      <p>
        Flocken er en platform til at forbinde hundeejere. Vi ansvarer ikke for:
      </p>
      <ul>
        <li>Aftaler eller transaktioner mellem brugere</li>
        <li>Adfærd eller handlinger fra andre brugere</li>
        <li>Skader der opstår ved hundemøder, pasning eller andre aktiviteter</li>
        <li>Falskt eller vildledende indhold fra brugere</li>
        <li>Veterinære spørgsmål eller sundhedsproblemer hos hunde</li>
        <li>Økonomiske tab der opstår i forbindelse med brug af tjenesten</li>
      </ul>

      <h3 id="ansvar-max">7.3 Maksimalt ansvar</h3>
      <p>
        Vores samlede ansvar over for dig er begrænset til det beløb du har betalt for abonnementet i løbet af
        de seneste 12 måneder. Vi ansvarer ikke for indirekte skader, tabt fortjeneste eller andre konsekvenser.
      </p>

      <h3 id="ansvar-force-majeure">7.4 Force Majeure</h3>
      <p>
        Vi ansvarer ikke for forsinkelser eller manglende opfyldelse af vores forpligtelser i henhold til disse vilkår hvis dette skyldes
        omstændigheder uden for vores rimelige kontrol, herunder men ikke begrænset til:
      </p>
      <ul>
        <li>Naturkatastrofer (oversvømmelser, jordskælv, storme osv.)</li>
        <li>Krig, terrorisme eller civil uro</li>
        <li>Pandemier eller epidemier</li>
        <li>Strejker eller arbejdskonflikter</li>
        <li>Strømafbrydelser eller afbrydelser i telekommunikation</li>
        <li>Cyberangreb eller sabotage</li>
        <li>Myndighedsbeslutninger, lovændringer eller andre reguleringsforanstaltninger</li>
        <li>Fejl eller afbrydelser hos tredjepartsudbydere der er uden for vores kontrol</li>
      </ul>
      <p>
        Ved sådanne omstændigheder vil vores forpligtelser blive udskudt i den tid hindret varer. Hvis hindret varer
        længere end 60 dage har både du og vi ret til at opsige aftalen uden erstatningspligt.
      </p>

      <h2 id="upphovsratt">8. Ophavsret og immaterielle rettigheder</h2>

      <p>
        Appen, herunder dens design, logo, tekst og kode, er beskyttet af ophavsret og andre immaterielle
        rettigheder der tilhører Spitakolus AB eller vores licensgivere. Du må ikke kopiere, modificere eller
        distribuere appen uden vores skriftlige tilladelse.
      </p>

      <h2 id="uppsagning">9. Opsigelse af tjenesten</h2>

      <h3 id="uppsagning-anvandare">9.1 Opsigelse af dig</h3>
      <p>
        Du kan til enhver tid afslutte din konto ved at slette den i appens indstillinger eller ved at
        kontakte os på support@spitakolus.com.
      </p>

      <h3 id="uppsagning-oss">9.2 Opsigelse af os</h3>
      <p>
        Vi forbeholder os retten til at afslutte eller suspendere din konto øjeblikkeligt hvis du overtræder disse
        vilkår, uden forudgående meddelelse. Vi kan også afslutte tjenesten helt med 30 dages varsel.
      </p>

      <h2 id="andringar">10. Ændringer af vilkårene</h2>

      <p>
        Vi forbeholder os retten til at ændre disse vilkår til enhver tid. Betydelige ændringer meddeles via
        e-mail og i appen mindst 30 dage før de træder i kraft. Hvis du fortsætter med at bruge tjenesten efter
        at ændringerne er trådt i kraft, accepterer du de nye vilkår.
      </p>

      <h2 id="tvist">11. Tvistløsning og gældende lov</h2>

      <h3 id="tvist-lag">11.1 Gældende lov</h3>
      <p>
        Disse vilkår reguleres af svensk lov.
      </p>

      <h3 id="tvist-losning">11.2 Tvistløsning</h3>
      <p>
        Tvister skal i første omgang løses gennem forhandling mellem dig og os. Hvis forhandling ikke fører
        til løsning skal tvisten afgøres af svensk almindelig domstol.
      </p>

      <h3 id="tvist-konsument">11.3 Forbrugertvist</h3>
      <p>
        Hvis du er forbrugers kan du også henvende dig til Allmänna reklamationsnämnden (ARN) for tvistløsning.
        <br/>
        <strong>Websted:</strong>{' '}
        <a href="https://www.arn.se" target="_blank" rel="noopener noreferrer" className="text-flocken-olive hover:underline">www.arn.se</a>
      </p>

      <h2 id="ovrigt">12. Øvrigt</h2>

      <h3 id="ovrigt-delning">12.1 Deling af vilkår</h3>
      <p>
        Hvis en del af disse vilkår er ugyldig eller ugennemførlig, påvirker det ikke gyldigheden af
        de øvrige dele.
      </p>

      <h3 id="ovrigt-hela">12.2 Hele aftalen</h3>
      <p>
        Disse vilkår udgør hele aftalen mellem dig og os vedrørende brugen af tjenesten.
      </p>

      <h2 id="kontakt">13. Kontakt os</h2>

      <p>
        Hvis du har spørgsmål om disse vilkår, kontakt os:
      </p>
      <ul>
        <li><strong>E-mail:</strong> support@spitakolus.com</li>
        <li><strong>Postadresse:</strong> Spitakolus AB, Svängrumsgatan 46, 421 71 Västra Frölunda</li>
        <li><strong>Organisationsnummer:</strong> 559554-6101</li>
        <li><strong>Emne:</strong> Skriv &quot;Brugervilkår&quot; i emnefeltet</li>
      </ul>

      <p className="mt-8 text-sm text-flocken-gray">
        Disse brugervilkår blev senest opdateret 12. februar 2026 og træder i kraft øjeblikkeligt.
      </p>
    </>
  );
}
