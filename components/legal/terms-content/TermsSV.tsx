'use client';

import Link from 'next/link';

export function TermsSV() {
  return (
    <>
      <h1>Användarvillkor</h1>

      <p className="lead">
        <strong>Senast uppdaterad:</strong> 30 april 2026
      </p>

      <p>Välkommen till Flocken! Dessa användarvillkor (&quot;Villkor&quot;) reglerar din användning av mobilapplikationen Flocken (&quot;Appen&quot;, &quot;Tjänsten&quot;) som tillhandahålls av Spitakolus AB (&quot;vi&quot;, &quot;oss&quot;, &quot;vår&quot;).</p>
      <p>Genom att skapa ett konto och använda Flocken godkänner du dessa villkor. Om du inte godkänner villkoren, vänligen använd inte tjänsten.</p>

      <h2 id="definitioner">1. Definitioner</h2>
      <ul>
        <li><strong>&quot;Användare&quot;:</strong> Person som har skapat ett konto i Flocken.</li>
        <li><strong>&quot;Hundprofil&quot;:</strong> Profil för en hund som läggs upp av en användare.</li>
        <li><strong>&quot;Hundar&quot;:</strong> Funktion för att matcha hundar för parning eller lek.</li>
        <li><strong>&quot;Passa&quot;:</strong> Funktion för att hitta och boka hundvakter.</li>
        <li><strong>&quot;Rasta&quot;:</strong> Funktion för att spåra och dela promenader.</li>
        <li><strong>&quot;Besöka&quot;:</strong> Funktion för att hitta hundvänliga platser.</li>
        <li><strong>&quot;Innehåll&quot;:</strong> All information, bilder, text och data som läggs upp av användare.</li>
        <li><strong>&quot;Prenumeration&quot;:</strong> Betald åtkomst till appens funktioner via månads- eller årsabonnemang.</li>
      </ul>

      <h2 id="konto">2. Konto och registrering</h2>

      <h3 id="konto-skapa">2.1 Skapa konto</h3>
      <p>Du ansvarar för att ange korrekt och fullständig information samt att hålla dina inloggningsuppgifter säkra. Kontot är personligt och får inte delas med andra. Du är ansvarig för all aktivitet som sker via ditt konto, och vi förbehåller oss rätten att avsluta eller suspendera konton som bryter mot dessa villkor.</p>

      <h3 id="konto-foraldrar">2.2 Föräldraansvar</h3>
      <p>Om du är förälder eller vårdnadshavare och tillåter ditt barn att använda Flocken, är du ansvarig för barnets användning av appen. Det innefattar all aktivitet via barnets konto, eventuella prenumerationer och betalningar, samt att barnets användning följer dessa villkor.</p>
      <p>Se till att barnet inte delar personlig information med okända. Vi rekommenderar att föräldrar aktivt engagerar sig i sina barns användning av sociala appar och diskuterar säker internetanvändning.</p>

      <h3 id="konto-typer">2.3 Kontotyper</h3>
      <p>Flocken erbjuder fyra kontotyper:</p>
      <ul>
        <li><strong>Hundägare (dog_owner):</strong> För privatpersoner som vill annonsera sina hundar för parning eller lek. Max 3 hundar kan annonseras.</li>
        <li><strong>Hundvakt (dog_sitter):</strong> För privatpersoner som endast vill erbjuda hundvaktstjänster. Kan inte annonsera hundar för parning.</li>
        <li><strong>Kennel (kennel):</strong> För registrerade kennlar och uppfödare. Kan annonsera obegränsat antal hundar.</li>
        <li><strong>Hunddagis (dog_daycare):</strong> För företag som erbjuder hunddagis och hundvaktstjänster. Kan annonsera obegränsat antal hundar.</li>
      </ul>
      <p>Du kan när som helst uppgradera eller ändra din kontotyp i appens inställningar.</p>

      <h2 id="prenumeration">3. Prenumeration och betalning</h2>

      <h3 id="pren-betalning">3.1 Betalning och fakturering</h3>
      <p>Betalning sker via Apple App Store (iOS) eller Google Play Store (Android) i enlighet med respektive plattforms villkor. Vi tar inte emot betalningar direkt. Priser anges inklusive moms och du får kvitto via e-post från den plattform du använder. Vid frågor om återbetalningar och refunderingar gäller App Store respektive Google Play Stores regler.</p>

      <h3 id="pren-fornyelse">3.2 Automatisk förnyelse</h3>
      <p>Prenumerationen löper tillsvidare och förnyas automatiskt vid varje periods slut. För att stänga av automatisk förnyelse måste du säga upp prenumerationen i App Store eller Google Play-inställningarna innan nästa faktureringsperiod börjar. Vid uppsägning behåller du tillgång till premiumfunktionerna fram till periodens slut.</p>

      <h3 id="pren-trial">3.3 Provperioder</h3>
      <p>Vi kan erbjuda provperioder utan kostnad där ingen betalningsinformation krävs. Du förbinder dig inte till en betalversion. Väljer du att inte teckna prenumeration efter provperioden fortsätter du i en begränsad gratisversion. Längd och villkor anges i appen när erbjudandet görs.</p>

      <h3 id="pren-uppsagning">3.4 Uppsägning</h3>
      <p>Du kan säga upp prenumerationen när som helst i App Store eller Google Play-inställningarna, men uppsägningen måste ske innan nästa faktureringsperiod börjar. Uppsägning träder i kraft vid nästa faktureringsperiod. Ingen återbetalning sker för redan betalda perioder. Du behåller tillgång till premiumfunktionerna till periodens slut, varefter kontot automatiskt övergår till en begränsad gratisversion. Du kan när som helst uppgradera igen.</p>

      <h3 id="pren-priser-andring">3.5 Priser och prisändringar</h3>
      <p>Priser visas i appen och varierar beroende på kontotyp och vald period. Alla priser anges inklusive moms. Vi kan erbjuda kampanjer och rabatter.</p>
      <p>Vi förbehåller oss rätten att ändra priser med minst 30 dagars förvarning via e-post och i appen. Godkänner du inte nya priser kan du säga upp prenumerationen innan ändringen träder i kraft. Fortsätter du använda tjänsten efter prisändringen godkänner du automatiskt de nya priserna.</p>

      <h2 id="funktioner">4. Tjänstens funktioner</h2>

      <h3 id="funk-hundar">4.1 Hundar</h3>
      <p>I funktionen Hundar kan du hitta hundar för parning eller lek, filtrera på ras, storlek, hälsotester och andra kriterier, kontakta andra hundägare via appens meddelandefunktion samt lägga upp hundprofiler med bilder och information.</p>
      <p>Du ansvarar för att uppgifterna om din hund är korrekta och att hälsotester och stamtavlor är äkta och verifierbara.</p>
      <p>Alla överenskommelser om parning träffas direkt mellan användarna. Flocken är inte part i dessa avtal och tar inget ansvar för resultaten. Du ansvarar för att följa svensk djurskyddslagstiftning och etiska riktlinjer för hundavel.</p>

      <h3 id="funk-passa">4.2 Passa (Hundvaktstjänster)</h3>
      <p><strong>För hundvakter</strong> gäller att du anger korrekta uppgifter om din erfarenhet och dina tjänster, ansvarar för hundens säkerhet under passning och har lämplig försäkring som täcker hundvaktstjänster.</p>
      <p>Du ska följa alla instruktioner från hundägaren och informera omgående om eventuella incidenter eller problem.</p>
      <p><strong>För hundägare</strong> gäller att du ger korrekta instruktioner om hundens behov och informerar om medicinska behov, allergier eller beteendeproblem. Du ansvarar för att hunden är vaccinerad och frisk. Betalning sker direkt mellan dig och hundvakten. Flocken tar ingen provision, men du ansvarar för att kontrollera att hundvakten har lämplig försäkring.</p>
      <p>Flocken är en förmedlingsplattform. Vi är inte hundvaktstjänsten och är inte part i de avtal som ingås.</p>
      <p>Vi kontrollerar inte hundvakternas kompetens, lämplighet eller försäkringar, och vi ansvarar inte för skador, förluster eller olyckor under passning. Användaren måste själv säkerställa adekvat försäkring och juridiskt skydd. Vi förbehåller oss rätten att ta bort användare som bryter mot dessa regler.</p>

      <h3 id="funk-rasta">4.3 Rasta (Promenad-tracking)</h3>
      <p>I funktionen Rasta kan du spåra promenader med GPS, spara rundor privat eller dela dem offentligt, se andras delade rundor, samla poäng baserat på sträcka och dela promenader med vänner. Du ansvarar för att följa lokala regler och lagar vid promenader samt hålla hunden kopplad där det krävs. GPS-data lagras enligt vår integritetspolicy.</p>

      <h3 id="funk-besoka">4.4 Besöka (Hundvänliga platser)</h3>
      <p>I funktionen Besöka hittar du hundvänliga caféer, restauranger och barer. Du kan lägga till saknade platser, filtrera på kategori och lämna recensioner och betyg. Du ansvarar för att informationen du lägger till är korrekt och att recensioner är ärliga och baserade på faktiska upplevelser. Vi förbehåller oss rätten att ta bort felaktig eller olämplig information.</p>

      <h2 id="innehall">5. Användargenererat innehåll</h2>

      <h3 id="innehall-ansvar">5.1 Ditt ansvar</h3>
      <p>Du är ansvarig för allt innehåll du laddar upp, inklusive:</p>
      <ul>
        <li>Bilder av hundar.</li>
        <li>Beskrivningar och profiltexter.</li>
        <li>Meddelanden till andra användare.</li>
        <li>Recensioner av hundvakter och platser.</li>
        <li>Delade promenader.</li>
        <li>Kommentarer och interaktioner.</li>
      </ul>

      <h3 id="innehall-forbud">5.2 Förbjudet innehåll</h3>
      <p>Följande är förbjudet:</p>
      <ul>
        <li>Olagligt innehåll eller innehåll som uppmuntrar olaglig verksamhet.</li>
        <li>Kränkande, hotfullt eller trakasserande innehåll.</li>
        <li>Falsk eller vilseledande information.</li>
        <li>Pornografiskt eller våldsamt material.</li>
        <li>Spam eller marknadsföring utan tillstånd.</li>
        <li>Upphovsrättsskyddat material du inte har rätt att använda.</li>
        <li>Personuppgifter om andra personer utan deras samtycke.</li>
        <li>Innehåll som kränker djurskydd eller etiska riktlinjer.</li>
      </ul>

      <h3 id="innehall-licens">5.3 Licens till oss</h3>
      <p>Genom att ladda upp innehåll ger du oss en icke-exklusiv, global, royaltyfri licens att använda, visa och distribuera innehållet inom tjänsten. Detta är nödvändigt för att appen ska fungera, till exempel för att visa dina hundbilder för andra användare. Du behåller äganderätten till ditt innehåll.</p>
      <p>Vi förbehåller oss rätten att ta bort, redigera eller moderera innehåll som bryter mot dessa villkor utan föregående meddelande.</p>

      <h3 id="innehall-rapportering">5.4 Rapportering av olämpligt innehåll</h3>
      <p>Om du stöter på innehåll som bryter mot dessa villkor, vänligen rapportera det via appens rapporteringsfunktion eller kontakta oss på <a href="mailto:support@flocken.info" className="text-flocken-olive hover:underline">support@flocken.info</a>.</p>

      <h3 id="innehall-community">5.5 Community Guidelines</h3>
      <p>För att upprätthålla en säker och trevlig miljö för alla användare förväntar vi oss att du:</p>
      <ul>
        <li><strong>Är respektfull:</strong> Behandla andra användare med respekt och artighet.</li>
        <li><strong>Är ärlig:</strong> Ge sanningsenlig information om dig själv och din hund.</li>
        <li><strong>Följer lagar:</strong> Följ alla tillämpliga lagar och regler, särskilt djurskyddslagstiftning.</li>
        <li><strong>Skyddar andras säkerhet:</strong> Rapportera omedelbart om du misstänker att någon utsätts för fara.</li>
        <li><strong>Respekterar privatliv:</strong> Dela inte andra personers personuppgifter utan deras samtycke.</li>
        <li><strong>Kommunicerar konstruktivt:</strong> Undvik konflikter, trakasserier och hotfullt beteende.</li>
        <li><strong>Tar ansvar vid hundmöten:</strong> Säkerställ att hundmöten sker på säkra platser och att alla parter är bekväma.</li>
      </ul>
      <p>Vi övervakar och modererar innehåll och beteende i appen och kan granska rapporterat innehåll, ta bort innehåll utan föregående varning samt utfärda varningar eller tillfälliga och permanenta avstängningar vid upprepade eller allvarliga överträdelser. Vi samarbetar med myndigheter vid misstanke om brott. Våra modereringsbeslut är slutgiltiga, men du kan kontakta oss på <a href="mailto:support@flocken.info" className="text-flocken-olive hover:underline">support@flocken.info</a> om du anser att ett beslut är felaktigt.</p>

      <h2 id="integritet">6. Integritet och dataskydd</h2>

      <h3 id="integritet-behandling">6.1 Behandling av personuppgifter</h3>
      <p>Vi samlar in och behandlar personuppgifter enligt vår integritetspolicy, som följer GDPR och svensk dataskyddslagstiftning. Genom att använda tjänsten godkänner du vår behandling av personuppgifter enligt integritetspolicyn.</p>
      <p>För mer information om hur vi behandlar dina personuppgifter, se vår <Link href="/integritetspolicy" className="text-flocken-olive hover:underline">integritetspolicy</Link>.</p>

      <h3 id="integritet-rattigheter">6.2 Dina rättigheter</h3>
      <p>Du har rätt att:</p>
      <ul>
        <li>Få tillgång till dina personuppgifter.</li>
        <li>Rätta felaktiga uppgifter.</li>
        <li>Radera ditt konto och dina uppgifter.</li>
        <li>Exportera dina uppgifter (dataportabilitet).</li>
        <li>Invända mot viss behandling.</li>
        <li>Återkalla ditt samtycke.</li>
      </ul>
      <p>För att utöva dina rättigheter eller få mer information, besök vår sida för <Link href="/privacy-choices" className="text-flocken-olive hover:underline">integritetsinställningar</Link> eller kontakta oss på <a href="mailto:support@flocken.info" className="text-flocken-olive hover:underline">support@flocken.info</a>.</p>

      <h2 id="ansvar">7. Ansvarsbegränsning</h2>

      <h3 id="ansvar-tjanst">7.1 Tjänstens tillgänglighet</h3>
      <p>Vi strävar efter hög tillgänglighet, men kan inte garantera att tjänsten alltid är tillgänglig eller felfri.</p>
      <p>Vi ansvarar inte för avbrott (planerade eller oplanerade), dataförlust, tekniska fel eller buggar, tredjepartstjänster som inte fungerar eller är otillgängliga, eller förluster som uppstår till följd av tekniska problem.</p>

      <h3 id="ansvar-anvandare">7.2 Användarinteraktioner</h3>
      <p>Flocken är en plattform för att koppla samman hundägare och ansvarar inte för avtal eller transaktioner mellan användare, beteende eller handlingar från andra användare, eller skador som uppstår vid hundmöten, passning eller andra aktiviteter.</p>
      <p>Vi ansvarar inte heller för falskt eller vilseledande innehåll, veterinära frågor eller hälsoproblem hos hundar, eller ekonomiska förluster som uppstår i samband med användning av tjänsten.</p>

      <h3 id="ansvar-max">7.3 Maximalt ansvar</h3>
      <p>Vårt totala ansvar gentemot dig är begränsat till det belopp du har betalat för prenumerationen under de senaste 12 månaderna. Vi ansvarar inte för indirekta skador, förlorad vinst eller andra konsekvenser.</p>

      <h3 id="ansvar-force-majeure">7.4 Force Majeure</h3>
      <p>Vi ansvarar inte för förseningar eller utebliven prestation av våra åtaganden om detta orsakas av omständigheter utanför vår rimliga kontroll, inklusive men inte begränsat till:</p>
      <ul>
        <li>Naturkatastrofer (översvämningar, jordbävningar, stormar, etc.).</li>
        <li>Krig, terrorism eller civil oro.</li>
        <li>Pandemier eller epidemier.</li>
        <li>Strejker eller arbetskonflikter.</li>
        <li>Strömavbrott eller avbrott i telekommunikation.</li>
        <li>Cyberattacker eller sabotage.</li>
        <li>Myndighetsbeslut, lagändringar eller andra regleringsåtgärder.</li>
        <li>Fel eller avbrott hos tredjepartsleverantörer som är utanför vår kontroll.</li>
      </ul>
      <p>Vid sådana omständigheter skjuts våra åtaganden upp under den tid hindret består. Om hindret varar längre än 60 dagar har både du och vi rätt att säga upp avtalet utan ersättningsskyldighet.</p>

      <h2 id="upphovsratt">8. Upphovsrätt och immateriella rättigheter</h2>
      <p>Appen, inklusive dess design, logotyp, text och kod, är skyddad av upphovsrätt och andra immateriella rättigheter som tillhör Spitakolus AB eller våra licensgivare. Du får inte kopiera, modifiera eller distribuera appen utan vårt skriftliga tillstånd.</p>

      <h2 id="uppsagning">9. Uppsägning av tjänsten</h2>

      <h3 id="uppsagning-anvandare">9.1 Uppsägning av dig</h3>
      <p>Du kan när som helst avsluta ditt konto genom att ta bort det i appens inställningar eller genom att kontakta oss på <a href="mailto:support@flocken.info" className="text-flocken-olive hover:underline">support@flocken.info</a>.</p>

      <h3 id="uppsagning-oss">9.2 Uppsägning av oss</h3>
      <p>Vi förbehåller oss rätten att avsluta eller suspendera ditt konto omedelbart om du bryter mot dessa villkor, utan föregående meddelande. Vi kan också avsluta tjänsten helt med 30 dagars varsel.</p>

      <h2 id="andringar">10. Ändringar av villkoren</h2>
      <p>Vi förbehåller oss rätten att ändra dessa villkor när som helst. Betydande ändringar meddelas via e-post och i appen minst 30 dagar innan de träder i kraft. Om du fortsätter använda tjänsten efter att ändringarna trätt i kraft, godkänner du de nya villkoren.</p>

      <h2 id="tvist">11. Tvistlösning och tillämplig lag</h2>

      <h3 id="tvist-lag">11.1 Tillämplig lag</h3>
      <p>Dessa villkor regleras av svensk lag.</p>

      <h3 id="tvist-losning">11.2 Tvistlösning</h3>
      <p>Tvister ska i första hand lösas genom förhandling mellan dig och oss. Om förhandling inte leder till lösning ska tvisten avgöras av svensk allmän domstol.</p>

      <h3 id="tvist-konsument">11.3 Konsumenttvist</h3>
      <p>Om du är konsument kan du även vända dig till Allmänna reklamationsnämnden (ARN) för tvistlösning.<br /><strong>Webbplats:</strong>{' '}<a href="https://www.arn.se" target="_blank" rel="noopener noreferrer" className="text-flocken-olive hover:underline">www.arn.se</a></p>

      <h2 id="ovrigt">12. Övrigt</h2>

      <h3 id="ovrigt-delning">12.1 Delning av villkor</h3>
      <p>Om någon del av dessa villkor är ogiltig eller ogenomförbar, påverkar inte detta giltigheten av övriga delar.</p>

      <h3 id="ovrigt-hela">12.2 Hela avtalet</h3>
      <p>Dessa villkor utgör hela avtalet mellan dig och oss gällande användningen av tjänsten.</p>

      <h2 id="kontakt">13. Kontakta oss</h2>
      <p>Om du har frågor om dessa villkor, besök vår <Link href="/support" className="text-flocken-olive hover:underline">kontaktsida</Link> eller skicka e-post till <a href="mailto:support@flocken.info" className="text-flocken-olive hover:underline">support@flocken.info</a> med &quot;Användarvillkor&quot; i ämnesraden.</p>
      <ul>
        <li><strong>Organisationsnummer:</strong> 559554-6101</li>
      </ul>

      <p className="mt-8 text-sm text-flocken-gray">
        Dessa användarvillkor uppdaterades senast 30 april 2026 och träder i kraft omedelbart.
      </p>
    </>
  );
}
