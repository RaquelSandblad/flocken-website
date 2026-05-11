'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { LanguageSwitcher, type Language } from '@/components/legal/LanguageSwitcher';
import { PrivacyChoicesPT } from '@/components/legal/privacy-choices/PrivacyChoicesPT';

const titles: Record<Language, string> = {
  sv: 'Integritetsval - Flocken',
  da: 'Privatlivsvalg - Flocken',
  no: 'Personvernvalg - Flocken',
  pt: 'Escolhas de Privacidade - Flocken',
};

const PrivacyChoicesSV = () => (
  <>
    <h1>Hantera dina integritetsval</h1>
    
    <p className="lead">
      Här hittar du information om hur du kan hantera, ändra eller radera dina personuppgifter i Flocken.
    </p>
    
    <h2 id="radera-konto">Radera ditt konto</h2>
    <p>
      Du kan när som helst radera ditt konto direkt i Flocken-appen:
    </p>
    <ol>
      <li>Öppna appen och gå till din profil</li>
      <li>Välj "Inställningar"</li>
      <li>Scrolla ned till "Radera konto"</li>
      <li>Följ instruktionerna för att bekräfta radering</li>
    </ol>
    <p>
      <strong>Vad händer när du raderar ditt konto:</strong>
    </p>
    <ul>
      <li>Din profil och all personinformation tas bort</li>
      <li>Information om din hund (bilder, beskrivning, uppgifter) raderas</li>
      <li>Chattmeddelanden raderas</li>
      <li>Favoritmarkeringar och inställningar tas bort</li>
      <li>Radering sker inom rimlig tid, normalt inom 30 dagar</li>
    </ul>
    <p>
      <strong>Obs:</strong> Vissa uppgifter kan behöva sparas om det krävs enligt lag (t.ex. bokföringskrav eller pågående utredningar).
    </p>
    
    <h2 id="ändra-uppgifter">Ändra dina uppgifter</h2>
    <p>
      Du kan när som helst ändra dina uppgifter direkt i appen:
    </p>
    
    <h3>Redigera din profil</h3>
    <ul>
      <li>Gå till din profil i appen</li>
      <li>Tryck på "Redigera profil"</li>
      <li>Ändra namn, e-post, telefon, profilbild eller annan information</li>
      <li>Spara dina ändringar</li>
    </ul>
    
    <h3>Redigera information om din hund</h3>
    <ul>
      <li>Gå till din hunds profil i appen</li>
      <li>Tryck på "Redigera"</li>
      <li>Uppdatera namn, ras, ålder, bilder, beskrivning eller annan information</li>
      <li>Spara dina ändringar</li>
    </ul>
    
    <h3>Ta bort bilder</h3>
    <p>
      Du kan ta bort bilder som du laddat upp när som helst genom att öppna bilden i appen och välja "Ta bort".
    </p>
    
    <h2 id="hantera-platsdata">Hantera platsdata</h2>
    <p>
      Platsdata samlas endast in när du aktivt startar en promenad i Rasta-funktionen.
    </p>
    <ul>
      <li><strong>Stänga av platsåtkomst:</strong> Du kan när som helst stänga av platsåtkomst i din enhets inställningar. Rasta-funktionen kommer då inte vara tillgänglig, men övriga funktioner fungerar.</li>
      <li><strong>Ta bort sparade promenader:</strong> Du kan ta bort enskilda promenader direkt i appen under "Mina promenader".</li>
      <li><strong>Privata vs synliga promenader:</strong> Du väljer själv om en promenad ska vara privat eller synlig för andra användare.</li>
    </ul>
    
    <h2 id="hantera-meddelanden">Hantera meddelanden</h2>
    <p>
      Du kan radera chattkonversationer direkt i appen:
    </p>
    <ul>
      <li>Öppna konversationen du vill radera</li>
      <li>Välj "Ta bort konversation"</li>
      <li>Meddelanden raderas permanent från våra servrar</li>
    </ul>
    
    <h2 id="exportera-data">Exportera dina uppgifter (dataportabilitet)</h2>
    <p>
      Du har rätt att få ut dina personuppgifter i ett strukturerat, maskinläsbart format.
    </p>
    <p>
      För att begära en kopia av dina uppgifter, kontakta oss via e-post på{' '}
      <a href="mailto:support@spitakolus.com" className="text-flocken-olive hover:underline">
        support@spitakolus.com
      </a>.
    </p>
    <p>
      Vi skickar då en kopia av dina uppgifter till din registrerade e-postadress inom 30 dagar.
    </p>
    
    <h2 id="andra-rättigheter">Övriga rättigheter</h2>
    <p>
      Om du vill utöva andra rättigheter såsom:
    </p>
    <ul>
      <li>Begära begränsning av behandling</li>
      <li>Invända mot behandling baserad på berättigat intresse</li>
      <li>Återkalla samtycke</li>
      <li>Lämna klagomål till tillsynsmyndighet</li>
    </ul>
    <p>
      Kontakta oss via{' '}
      <a href="mailto:support@spitakolus.com" className="text-flocken-olive hover:underline">
        support@spitakolus.com
      </a>{' '}
      eller läs mer i vår{' '}
      <a href="/integritetspolicy" className="text-flocken-olive hover:underline">
        integritetspolicy
      </a>.
    </p>
    
    <h2 id="kontakt-support">Kontakt</h2>
    <p>
      Vid frågor om hantering av dina personuppgifter eller för att utöva dina rättigheter:
    </p>
    <p>
      <strong>Spitakolus AB</strong><br />
      E-post:{' '}
      <a href="mailto:support@spitakolus.com" className="text-flocken-olive hover:underline">
        support@spitakolus.com
      </a><br />
      Organisationsnummer: 559554-6101
    </p>
  </>
);

function PrivacyChoicesContent() {
  const searchParams = useSearchParams();
  const langParam = searchParams.get('lang') as Language | null;
  const [lang, setLang] = useState<Language>(
    langParam && ['sv', 'da', 'no', 'pt'].includes(langParam) ? langParam : 'sv'
  );

  useEffect(() => {
    document.title = titles[lang];
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', titles[lang]);
    }
  }, [lang]);

  return (
    <>
      <LanguageSwitcher current={lang} onChange={setLang} />
      {lang === 'sv' && <PrivacyChoicesSV />}
      {lang === 'pt' && <PrivacyChoicesPT />}
      {(lang === 'da' || lang === 'no') && (
        <div className="bg-flocken-sand/30 border border-flocken-sand p-6 rounded-lg">
          <p className="text-flocken-brown">
            Översättning till {lang === 'da' ? 'danska' : 'norska'} kommer snart. 
            Välj svenska eller portugisiska i språkväljaren ovan.
          </p>
        </div>
      )}
    </>
  );
}

export default function PrivacyChoicesPage() {
  return (
    <Suspense fallback={<div className="animate-pulse h-96" />}>
      <PrivacyChoicesContent />
    </Suspense>
  );
}
