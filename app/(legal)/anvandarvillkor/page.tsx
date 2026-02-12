import Link from 'next/link';

export const metadata = {
  title: "Användarvillkor",
  description: "Användarvillkor och regler för att använda Flocken",
};

export default function AnvandarvillkorPage() {
  return (
    <>
      <h1>Användarvillkor</h1>
      
      <p className="lead">
        Senast uppdaterad: {new Date().toLocaleDateString('sv-SE')}
      </p>
      
      <p>
        Välkommen till Flocken! Dessa användarvillkor ("Villkor") reglerar din användning av mobilapplikationen 
        Flocken ("Appen", "Tjänsten") som tillhandahålls av Spitakolus AB ("vi", "oss", "vår").
      </p>
      
      <p>
        Genom att skapa ett konto och använda Flocken godkänner du dessa villkor. Om du inte godkänner villkoren, 
        vänligen använd inte tjänsten.
      </p>
      
      <h2 id="definitioner">1. Definitioner</h2>
      <ul>
        <li><strong>"Användare":</strong> Person som har skapat ett konto i Flocken</li>
        <li><strong>"Hundprofil":</strong> Profil för en hund som läggs upp av en användare</li>
        <li><strong>"Para":</strong> Funktion för att matcha hundar för parning eller lek</li>
        <li><strong>"Passa":</strong> Funktion för att hitta och boka hundvakter</li>
        <li><strong>"Rasta":</strong> Funktion för att spåra och dela promenader</li>
        <li><strong>"Besöka":</strong> Funktion för att hitta hundvänliga platser</li>
        <li><strong>"Innehåll":</strong> All information, bilder, text och data som läggs upp av användare</li>
        <li><strong>"Prenumeration":</strong> Betald åtkomst till appens funktioner via månads- eller årsabonnemang</li>
      </ul>
      
      <h2 id="konto">2. Konto och registrering</h2>
      
      <h3 id="konto-skapa">2.1 Skapa konto</h3>
      <ul>
        <li>Du måste ange korrekt och fullständig information</li>
        <li>Du är ansvarig för att hålla dina inloggningsuppgifter säkra</li>
        <li>Ett konto får inte delas med andra personer</li>
        <li>Du är ansvarig för all aktivitet som sker via ditt konto</li>
        <li>Vi förbehåller oss rätten att avsluta eller suspendera konton som bryter mot dessa villkor</li>
      </ul>
      
      <h3 id="konto-foraldrar">2.2 Föräldraansvar</h3>
      <p>
        Om du är förälder eller vårdnadshavare och tillåter ditt barn att använda Flocken, är du ansvarig för:
      </p>
      <ul>
        <li>Att övervaka barnets användning av appen</li>
        <li>All aktivitet som sker via barnets konto</li>
        <li>Att barnets användning följer dessa användarvillkor</li>
        <li>Eventuella prenumerationer eller betalningar som görs via barnets konto</li>
        <li>Att säkerställa att barnet inte delar personlig information med okända</li>
      </ul>
      <p>
        Vi rekommenderar att föräldrar aktivt engagerar sig i sina barns användning av sociala appar och diskuterar säker internetanvändning.
      </p>
      
      <h3 id="konto-typer">2.3 Kontotyper</h3>
      <p>Flocken erbjuder fyra kontotyper:</p>
      <ul>
        <li><strong>Hundägare (dog_owner):</strong> För privatpersoner som vill annonsera sina hundar för parning eller lek. Max 3 hundar kan annonseras.</li>
        <li><strong>Hundvakt (dog_sitter):</strong> För privatpersoner som endast vill erbjuda hundvaktstjänster. Kan inte annonsera hundar för parning.</li>
        <li><strong>Kennel (kennel):</strong> För registrerade kennlar och uppfödare. Kan annonsera obegränsat antal hundar.</li>
        <li><strong>Hunddagis (dog_daycare):</strong> För företag som erbjuder hunddagis och hundvaktstjänster. Kan annonsera obegränsat antal hundar.</li>
      </ul>
      <p>
        Du kan när som helst uppgradera eller ändra din kontotyp i appens inställningar.
      </p>
      
      <h2 id="prenumeration">3. Prenumeration och betalning</h2>
      
      <h3 id="pren-betalning">3.1 Betalning och fakturering</h3>
      <ul>
        <li>Betalning sker via Apple App Store (för iOS) eller Google Play Store (för Android) enligt deras respektive villkor och regler</li>
        <li>Priser anges inklusive moms</li>
        <li>Alla betalningar hanteras av Apple eller Google – vi tar inte emot betalningar direkt</li>
        <li>Du får kvitto via e-post efter varje betalning från respektive plattform</li>
        <li>För återbetalningar och refunderingar, följ Apple App Store eller Google Play Stores regler</li>
      </ul>
      
      <h3 id="pren-fornyelse">3.2 Automatisk förnyelse</h3>
      <ul>
        <li>Prenumerationen löper tillsvidare och förnyas automatiskt varje månad/år enligt vald period</li>
        <li>Förnyelse sker automatiskt vid slutet av varje period om du inte säger upp prenumerationen</li>
        <li>För att stänga av automatisk förnyelse måste du säga upp prenumerationen i App Store eller Google Play-inställningarna</li>
        <li>Uppsägning måste ske innan nästa faktureringsperiod för att undvika betalning</li>
        <li>Vid uppsägning behåller du tillgång till premiumfunktionerna till periodens slut</li>
      </ul>
      
      <h3 id="pren-trial">3.3 Provperioder</h3>
      <ul>
        <li>Vi kan erbjuda provperioder där du kan testa appen utan kostnad</li>
        <li>Under provperioden behöver du inte ange betalningsuppgifter</li>
        <li>Du förbinder dig inte att fortsätta med en betalversion efter provperioden</li>
        <li>Om du väljer att inte betala efter provperioden kan du fortsätta använda appen i en begränsad gratisversion</li>
        <li>Längd och villkor för provperioder anges i appen när erbjudandet görs</li>
      </ul>
      
      <h3 id="pren-uppsagning">3.4 Uppsägning</h3>
      <ul>
        <li>Du kan säga upp prenumerationen när som helst i App Store eller Google Play-inställningarna</li>
        <li>Uppsägning måste ske innan nästa faktureringsperiod börjar</li>
        <li>Uppsägning träder i kraft vid nästa faktureringsperiod</li>
        <li>Ingen återbetalning sker för redan betalda perioder</li>
        <li>Vid uppsägning behåller du tillgång till premiumfunktionerna till periodens slut</li>
        <li>Efter uppsägning övergår ditt konto automatiskt till en begränsad gratisversion</li>
        <li>Du kan när som helst uppgradera till premiumversion igen</li>
      </ul>
      
      <h3 id="pren-priser-andring">3.5 Priser och prisändringar</h3>
      <ul>
        <li>Priser för prenumerationer visas i appen och kan variera beroende på kontotyp och vald period (månadsvis eller årligen)</li>
        <li>Vi kan erbjuda kampanjer och rabatter som påverkar priserna</li>
        <li>Priser anges inklusive moms</li>
        <li>Vi förbehåller oss rätten att ändra priser</li>
        <li>Prisändringar meddelas minst 30 dagar i förväg via e-post och i appen</li>
        <li>Om du inte godkänner nya priser kan du säga upp prenumerationen innan ändringen träder i kraft</li>
        <li>Om du fortsätter använda tjänsten efter prisändringen godkänner du automatiskt de nya priserna</li>
      </ul>
      
      <h2 id="funktioner">4. Tjänstens funktioner</h2>
      
      <h3 id="funk-para">4.1 Para (Hundmatchning)</h3>
      <p><strong>Tillåten användning:</strong></p>
      <ul>
        <li>Hitta hundar för parning eller lek</li>
        <li>Filtrera på ras, storlek, hälsotester och andra kriterier</li>
        <li>Kontakta andra hundägare via appens meddelandefunktion</li>
        <li>Lägga upp hundprofiler med bilder och information (max antal hundar varierar per kontotyp)</li>
      </ul>
      
      <p><strong>Användaransvar:</strong></p>
      <ul>
        <li>Du ansvarar för att uppge korrekta uppgifter om din hund</li>
        <li>Hälsotester och stamtavlor måste vara äkta och verifierbara</li>
        <li>Du ansvarar för alla överenskommelser med andra användare</li>
        <li>Flocken är inte part i några avtal mellan användare</li>
        <li>Vi tar inget ansvar för resultatet av parningar som sker via appen</li>
        <li>Du ansvarar för att följa svensk djurskyddslagstiftning och etiska riktlinjer för hundavel</li>
      </ul>
      
      <h3 id="funk-passa">4.2 Passa (Hundvaktstjänster)</h3>
      <p><strong>För hundvakter:</strong></p>
      <ul>
        <li>Du måste ange korrekta uppgifter om erfarenhet och tjänster</li>
        <li>Du ansvarar för hundens säkerhet under passning</li>
        <li>Du måste ha lämplig försäkring som täcker hundvaktstjänster</li>
        <li>Du ansvarar för att följa alla instruktioner från hundägaren</li>
        <li>Du måste informera hundägaren om eventuella incidenter eller problem omedelbart</li>
      </ul>
      
      <p><strong>För hundägare:</strong></p>
      <ul>
        <li>Du ansvarar för att ge korrekta instruktioner om hundens behov</li>
        <li>Du måste informera om medicinska behov, allergier eller beteendeproblem</li>
        <li>Du ansvarar för att din hund är vaccinerad och frisk</li>
        <li>Betalning för hundvaktstjänster sker direkt mellan dig och hundvakten – Flocken tar ingen provision</li>
        <li>Du ansvarar för att säkerställa att hundvakten har lämplig försäkring</li>
      </ul>
      
      <p><strong>Ansvarsbegränsning:</strong></p>
      <ul>
        <li>Flocken är en förmedlingsplattform – vi är inte hundvakt-tjänsten</li>
        <li>Vi kontrollerar inte hundvakternas kompetens, lämplighet eller försäkringar</li>
        <li>Alla avtal om passning är mellan dig och hundvakten</li>
        <li>Vi ansvarar inte för skador, förluster eller olyckor under passning</li>
        <li>Användaren måste själv säkerställa adekvat försäkring och juridiskt skydd</li>
        <li>Vi förbehåller oss rätten att ta bort användare som bryter mot dessa regler</li>
      </ul>
      
      <h3 id="funk-rasta">4.3 Rasta (Promenad-tracking)</h3>
      <p><strong>Tillåten användning:</strong></p>
      <ul>
        <li>Spåra dina promenader med GPS</li>
        <li>Spara rundor privat eller dela dem offentligt</li>
        <li>Se andras delade rundor</li>
        <li>Samla poäng baserat på sträcka</li>
        <li>Dela promenader med vänner</li>
      </ul>
      
      <p><strong>Användaransvar:</strong></p>
      <ul>
        <li>Du ansvarar för att följa lokala regler och lagar vid promenader</li>
        <li>Du ansvarar för att hålla din hund kopplad där det krävs</li>
        <li>GPS-data lagras enligt vår integritetspolicy</li>
      </ul>
      
      <h3 id="funk-besoka">4.4 Besöka (Hundvänliga platser)</h3>
      <p><strong>Tillåten användning:</strong></p>
      <ul>
        <li>Hitta hundvänliga caféer, restauranger och barer</li>
        <li>Lägga till saknade platser</li>
        <li>Filtrera på kategori</li>
        <li>Lämna recensioner och betyg</li>
      </ul>
      
      <p><strong>Användaransvar:</strong></p>
      <ul>
        <li>Du ansvarar för att informationen du lägger till är korrekt</li>
        <li>Recensioner måste vara ärliga och baserade på faktiska upplevelser</li>
        <li>Vi förbehåller oss rätten att ta bort felaktig eller olämplig information</li>
      </ul>
      
      <h2 id="innehall">5. Användargenererat innehåll</h2>
      
      <h3 id="innehall-ansvar">5.1 Ditt ansvar</h3>
      <p>Du är ansvarig för allt innehåll du laddar upp, inklusive:</p>
      <ul>
        <li>Bilder av hundar</li>
        <li>Beskrivningar och profiltexter</li>
        <li>Meddelanden till andra användare</li>
        <li>Recensioner av hundvakter och platser</li>
        <li>Delade promenader</li>
        <li>Kommentarer och interaktioner</li>
      </ul>
      
      <h3 id="innehall-forbud">5.2 Förbjudet innehåll</h3>
      <p>Följande är förbjudet:</p>
      <ul>
        <li>Olagligt innehåll eller innehåll som uppmuntrar olaglig verksamhet</li>
        <li>Kränkande, hotfullt eller trakasserande innehåll</li>
        <li>Falsk eller vilseledande information</li>
        <li>Pornografiskt eller våldsamt material</li>
        <li>Spam eller marknadsföring utan tillstånd</li>
        <li>Upphovsrättsskyddat material du inte har rätt att använda</li>
        <li>Personuppgifter om andra personer utan deras samtycke</li>
        <li>Innehåll som kränker djurskydd eller etiska riktlinjer</li>
      </ul>
      
      <h3 id="innehall-licens">5.3 Licens till oss</h3>
      <p>
        Genom att ladda upp innehåll ger du oss en icke-exklusiv, global, royaltyfri licens att använda, 
        visa och distribuera innehållet inom tjänsten. Detta är nödvändigt för att appen ska fungera 
        (t.ex. visa dina hundbilder för andra användare). Du behåller äganderätten till ditt innehåll.
      </p>
      <p>
        Vi förbehåller oss rätten att ta bort, redigera eller moderera innehåll som bryter mot dessa villkor 
        utan föregående meddelande.
      </p>
      
      <h3 id="innehall-rapportering">5.4 Rapportering av olämpligt innehåll</h3>
      <p>
        Om du stöter på innehåll som bryter mot dessa villkor, vänligen rapportera det via appens 
        rapporteringsfunktion eller kontakta oss på support@spitakolus.com.
      </p>
      
      <h3 id="innehall-community">5.5 Community Guidelines</h3>
      <p>
        För att upprätthålla en säker och trevlig miljö för alla användare förväntar vi oss att du:
      </p>
      <ul>
        <li><strong>Är respektfull:</strong> Behandla andra användare med respekt och artighet</li>
        <li><strong>Är ärlig:</strong> Ge sanningsenlig information om dig själv och din hund</li>
        <li><strong>Följer lagar:</strong> Följ alla tillämpliga lagar och regler, särskilt djurskyddslagstiftning</li>
        <li><strong>Skyddar andras säkerhet:</strong> Rapportera omedelbart om du misstänker att någon utsätts för fara</li>
        <li><strong>Respekterar privatliv:</strong> Dela inte andra personers personuppgifter utan deras samtycke</li>
        <li><strong>Kommunicerar konstruktivt:</strong> Undvik konflikter, trakasserier och hotfullt beteende</li>
        <li><strong>Tar ansvar vid hundmöten:</strong> Säkerställ att hundmöten sker på säkra platser och att alla parter är bekväma</li>
      </ul>
      
      <p><strong>Vårt ansvar och rätt att moderera:</strong></p>
      <ul>
        <li>Vi övervakar och modererar innehåll och beteende i appen</li>
        <li>Vi kan granska rapporterat innehåll och vidta åtgärder vid överträdelser</li>
        <li>Vi kan ta bort innehåll som bryter mot dessa riktlinjer utan föregående varning</li>
        <li>Vi kan utfärda varningar, tillfälliga avstängningar eller permanenta avstängningar vid upprepade eller allvarliga överträdelser</li>
        <li>Vi samarbetar med myndigheter vid misstanke om brott</li>
        <li>Våra beslut om moderering är slutgiltiga, men du kan kontakta oss på support@spitakolus.com om du anser att ett beslut är felaktigt</li>
      </ul>
      
      <h2 id="integritet">6. Integritet och dataskydd</h2>
      
      <h3 id="integritet-behandling">6.1 Behandling av personuppgifter</h3>
      <p>
        Vi samlar in och behandlar personuppgifter enligt vår integritetspolicy, som följer GDPR och svensk 
        dataskyddslagstiftning. Genom att använda tjänsten godkänner du vår behandling av personuppgifter 
        enligt integritetspolicyn.
      </p>
      <p>
        För mer information om hur vi behandlar dina personuppgifter, se vår 
        <Link href="/integritetspolicy" className="text-flocken-olive hover:underline">integritetspolicy</Link>.
      </p>
      
      <h3 id="integritet-rattigheter">6.2 Dina rättigheter</h3>
      <p>
        Du har rätt att:
      </p>
      <ul>
        <li>Få tillgång till dina personuppgifter</li>
        <li>Rätta felaktiga uppgifter</li>
        <li>Radera ditt konto och dina uppgifter</li>
        <li>Exportera dina uppgifter (dataportabilitet)</li>
        <li>Invända mot viss behandling</li>
        <li>Återkalla ditt samtycke</li>
      </ul>
      <p>
        För att utöva dina rättigheter eller få mer information, besök vår sida för 
        <Link href="/privacy-choices" className="text-flocken-olive hover:underline">integritetsinställningar</Link> eller kontakta oss på support@spitakolus.com.
      </p>
      
      <h2 id="ansvar">7. Ansvarsbegränsning</h2>
      
      <h3 id="ansvar-tjanst">7.1 Tjänstens tillgänglighet</h3>
      <p>
        Vi strävar efter hög tillgänglighet, men kan inte garantera att tjänsten alltid är tillgänglig eller felfri. 
        Vi ansvarar inte för:
      </p>
      <ul>
        <li>Avbrott i tjänsten (planerade eller oplanerade)</li>
        <li>Dataförlust</li>
        <li>Tekniska fel eller buggar</li>
        <li>Tredjepartstjänster (inklusive men inte begränsat till betalningsleverantörer, karttjänster, molntjänster, analysverktyg och meddelandetjänster) som inte fungerar eller är otillgängliga</li>
        <li>Förluster som uppstår på grund av tekniska problem</li>
      </ul>
      
      <h3 id="ansvar-anvandare">7.2 Användarinteraktioner</h3>
      <p>
        Flocken är en plattform för att koppla samman hundägare. Vi ansvarar inte för:
      </p>
      <ul>
        <li>Avtal eller transaktioner mellan användare</li>
        <li>Beteende eller handlingar från andra användare</li>
        <li>Skador som uppstår vid hundmöten, passning eller andra aktiviteter</li>
        <li>Falskt eller vilseledande innehåll från användare</li>
        <li>Veterinära frågor eller hälsoproblem hos hundar</li>
        <li>Ekonomiska förluster som uppstår i samband med användning av tjänsten</li>
      </ul>
      
      <h3 id="ansvar-max">7.3 Maximalt ansvar</h3>
      <p>
        Vårt totala ansvar gentemot dig är begränsat till det belopp du har betalat för prenumerationen under 
        de senaste 12 månaderna. Vi ansvarar inte för indirekta skador, förlorad vinst eller andra konsekvenser.
      </p>
      
      <h3 id="ansvar-force-majeure">7.4 Force Majeure</h3>
      <p>
        Vi ansvarar inte för förseningar eller utebliven prestation av våra åtaganden enligt dessa villkor om detta orsakas av 
        omständigheter utanför vår rimliga kontroll, inklusive men inte begränsat till:
      </p>
      <ul>
        <li>Naturkatastrofer (översvämningar, jordbävningar, stormar, etc.)</li>
        <li>Krig, terrorism eller civil oro</li>
        <li>Pandemier eller epidemier</li>
        <li>Strejker eller arbetskonflikter</li>
        <li>Strömavbrott eller avbrott i telekommunikation</li>
        <li>Cyberattacker eller sabotage</li>
        <li>Myndighetsbeslut, lagändringar eller andra regleringsåtgärder</li>
        <li>Fel eller avbrott hos tredjepartsleverantörer som är utanför vår kontroll</li>
      </ul>
      <p>
        Vid sådana omständigheter kommer våra åtaganden att skjutas upp under den tid hindret består. Om hindret varar 
        längre än 60 dagar har både du och vi rätt att säga upp avtalet utan ersättningsskyldighet.
      </p>
      
      <h2 id="upphovsratt">8. Upphovsrätt och immateriella rättigheter</h2>
      
      <p>
        Appen, inklusive dess design, logotyp, text och kod, är skyddad av upphovsrätt och andra immateriella 
        rättigheter som tillhör Spitakolus AB eller våra licensgivare. Du får inte kopiera, modifiera eller 
        distribuera appen utan vårt skriftliga tillstånd.
      </p>
      
      <h2 id="uppsagning">9. Uppsägning av tjänsten</h2>
      
      <h3 id="uppsagning-anvandare">9.1 Uppsägning av dig</h3>
      <p>
        Du kan när som helst avsluta ditt konto genom att ta bort det i appens inställningar eller genom att 
        kontakta oss på support@spitakolus.com.
      </p>
      
      <h3 id="uppsagning-oss">9.2 Uppsägning av oss</h3>
      <p>
        Vi förbehåller oss rätten att avsluta eller suspendera ditt konto omedelbart om du bryter mot dessa 
        villkor, utan föregående meddelande. Vi kan också avsluta tjänsten helt med 30 dagars varsel.
      </p>
      
      <h2 id="andringar">10. Ändringar av villkoren</h2>
      
      <p>
        Vi förbehåller oss rätten att ändra dessa villkor när som helst. Betydande ändringar meddelas via 
        e-post och i appen minst 30 dagar innan de träder i kraft. Om du fortsätter använda tjänsten efter 
        att ändringarna trätt i kraft, godkänner du de nya villkoren.
      </p>
      
      <h2 id="tvist">11. Tvistlösning och tillämplig lag</h2>
      
      <h3 id="tvist-lag">11.1 Tillämplig lag</h3>
      <p>
        Dessa villkor regleras av svensk lag.
      </p>
      
      <h3 id="tvist-losning">11.2 Tvistlösning</h3>
      <p>
        Tvister ska i första hand lösas genom förhandling mellan dig och oss. Om förhandling inte leder 
        till lösning ska tvisten avgöras av svensk allmän domstol.
      </p>
      
      <h3 id="tvist-konsument">11.3 Konsumenttvist</h3>
      <p>
        Om du är konsument kan du även vända dig till Allmänna reklamationsnämnden (ARN) för tvistlösning.
        <br/>
        <strong>Webbplats:</strong> <a href="https://www.arn.se" target="_blank" rel="noopener noreferrer">www.arn.se</a>
      </p>
      
      <h2 id="ovrigt">12. Övrigt</h2>
      
      <h3 id="ovrigt-delning">12.1 Delning av villkor</h3>
      <p>
        Om någon del av dessa villkor är ogiltig eller ogenomförbar, påverkar inte detta giltigheten av 
        övriga delar.
      </p>
      
      <h3 id="ovrigt-hela">12.2 Hela avtalet</h3>
      <p>
        Dessa villkor utgör hela avtalet mellan dig och oss gällande användningen av tjänsten.
      </p>
      
      <h2 id="kontakt">13. Kontakta oss</h2>
      
      <p>
        Om du har frågor om dessa villkor, kontakta oss:
      </p>
      <ul>
        <li><strong>E-post:</strong> support@spitakolus.com</li>
        <li><strong>Postadress:</strong> Spitakolus AB, Svängrumsgatan 46, 421 71 Västra Frölunda</li>
        <li><strong>Organisationsnummer:</strong> 559554-6101</li>
        <li><strong>Ärende:</strong> Skriv "Användarvillkor" i ämnesraden</li>
      </ul>
      
      <p className="mt-8 text-sm text-flocken-gray">
        Dessa användarvillkor uppdaterades senast {new Date().toLocaleDateString('sv-SE')} och träder i kraft omedelbart.
      </p>
    </>
  );
}

