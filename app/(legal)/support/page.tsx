export const metadata = {
  title: "Support & Kontakt",
  description: "Kontakta Flocken för support, frågor eller feedback",
};

export default function SupportPage() {
  return (
    <>
      <h1>Support & Kontakt</h1>
      
      <p className="lead">
        Har du frågor eller behöver hjälp? Vi finns här för dig!
      </p>
      
      <h2 id="kontakta-oss">Kontakta oss</h2>
      <p>
        Du kan nå oss via e-post för support, frågor om appen, feedback eller 
        andra ärenden relaterade till Flocken.
      </p>
      
      <div className="bg-flocken-sand p-6 rounded-lg my-6">
        <h3 className="text-xl font-semibold text-flocken-brown mb-4">Kontaktinformation</h3>
        <ul className="space-y-3">
          <li>
            <strong className="text-flocken-brown">E-post:</strong>{' '}
            <a href="mailto:kontakt@flocken.info" className="text-flocken-olive hover:underline">
              kontakt@flocken.info
            </a>
          </li>
          <li>
            <strong className="text-flocken-brown">Företag:</strong> Spitakolus AB
          </li>
          <li>
            <strong className="text-flocken-brown">Organisationsnummer:</strong> 559554-6101
          </li>
          <li>
            <strong className="text-flocken-brown">Adress:</strong> Svängrumsgatan 46, 421 71 Västra Frölunda
          </li>
        </ul>
      </div>
      
      <h2 id="vanliga-fragor">Vanliga frågor</h2>
      
      <h3>Hur skapar jag ett konto?</h3>
      <p>
        Ladda ner Flocken-appen från App Store eller Google Play. När du öppnar appen 
        kan du registrera dig med din e-postadress eller logga in via sociala medier.
      </p>
      
      <h3>Hur lägger jag till min hund?</h3>
      <p>
        Efter att du skapat ett konto kan du lägga till din hunds profil genom att 
        klicka på "Lägg till hund" i appen. Fyll i relevant information som ras, ålder, 
        och ladda upp bilder.
      </p>
      
      <h3>Är Flocken gratis?</h3>
      <p>
        Ja, Flocken är gratis i 6 månader för alla som skapar konto innan nyår. 
        Därefter kommer vi erbjuda olika prenumerationsplaner.
      </p>
      
      <h3>Hur fungerar Para-funktionen?</h3>
      <p>
        Para-funktionen hjälper dig hitta rätt parningspartner för din hund. Du kan 
        söka efter hundar baserat på ras, storlek, plats och andra kriterier. 
        Kontakta hundägare direkt genom appen.
      </p>
      
      <h3>Är mina uppgifter säkra?</h3>
      <p>
        Ja, vi tar din integritet på största allvar. Läs vår{' '}
        <a href="/integritetspolicy" className="text-flocken-olive hover:underline">
          integritetspolicy
        </a>{' '}
        för mer information om hur vi hanterar dina personuppgifter.
      </p>
      
      <h2 id="feedback">Feedback & Förslag</h2>
      <p>
        Vi uppskattar all feedback! Om du har förslag på förbättringar eller nya 
        funktioner, tveka inte att höra av dig till{' '}
        <a href="mailto:kontakt@flocken.info" className="text-flocken-olive hover:underline">
          kontakt@flocken.info
        </a>
      </p>
      
      <h2 id="press">Press & Media</h2>
      <p>
        För pressförfrågningar, intervjuer eller annat mediasamarbete, vänligen 
        kontakta oss på{' '}
        <a href="mailto:kontakt@flocken.info" className="text-flocken-olive hover:underline">
          kontakt@flocken.info
        </a>
      </p>
    </>
  );
}

