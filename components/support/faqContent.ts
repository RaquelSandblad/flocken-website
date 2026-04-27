import type { LucideIcon } from 'lucide-react';
import { PawPrint, Smartphone, Shield } from 'lucide-react';

export const FAQ_TOPICS: {
  icon: LucideIcon;
  title: string;
  items: { q: string; a: string; key?: string }[];
}[] = [
  {
    icon: Smartphone,
    title: 'Appen & konto',
    items: [
      {
        q: 'Hur laddar jag ner Flocken?',
        a: 'Flocken finns att ladda ner på App Store och Google Play. Sök på "Flocken" eller klicka på knapparna på vår nedladdningssida. Appen är gratis att ladda ner.',
      },
      {
        q: 'Hur skapar jag ett konto?',
        a: 'Öppna appen och registrera dig med din e-postadress. Du kan sedan lägga till dina hundar under Mina sidor.',
      },
      {
        q: 'Är Flocken gratis?',
        a: 'Ja, Flocken har ett gratiskonto utan tidsbegränsning. För premiumfunktioner finns prenumerationsalternativ anpassade efter din roll.',
        key: 'pricing',
      },
      {
        q: 'Hur återställer jag mitt lösenord?',
        a: 'Välj "Glömt lösenord" på inloggningssidan och följ instruktionerna. Du får ett e-postmeddelande med en återställningslänk.',
      },
    ],
  },
  {
    icon: PawPrint,
    title: 'Hundar & Passa',
    items: [
      {
        q: 'Hur lägger jag till min hund?',
        a: 'Gå till Mina sidor i appen och välj "Lägg till hund". Fyll i uppgifter om ras, ålder och ladda upp bilder. Ju mer du fyller i, desto fler sökningar matchar din hund.',
      },
      {
        q: 'Syns min exakta adress på kartan?',
        a: 'Nej. Din hund placeras slumpmässigt inom ditt postnummerområde – din exakta adress visas aldrig för andra användare.',
      },
      {
        q: 'Hur fungerar Passa?',
        a: 'I Passa hittar du hundvakter och hunddagis som annonserar sina tjänster. Filtrera på typ av tjänst, pris och tillgänglighet. Ta kontakt direkt via appen.',
      },
      {
        q: 'Hur hittar jag hundägare som vill byta hundpassning?',
        a: 'I funktionen Hundar kan du filtrera på "intresserad av att dela hundpassning" för att hitta hundägare som vill byta passning kostnadsfritt.',
      },
    ],
  },
  {
    icon: Shield,
    title: 'Integritet & data',
    items: [
      {
        q: 'Är mina uppgifter säkra?',
        a: 'Ja, vi tar din integritet på största allvar. Läs vår integritetspolicy för mer information om hur vi hanterar dina personuppgifter.',
      },
      {
        q: 'Hur tar jag bort mitt konto?',
        a: 'Gå till Inställningar i appen och välj att radera kontot. Tänk på att all din data – hundar, bokningar och promenader – raderas permanent och kan inte återställas.',
      },
      {
        q: 'Vilken data delas med andra användare?',
        a: 'Bara det du väljer att visa: din hundprofil, dina promenader (om de är satta som publika) och din kontaktinformation om du väljer att dela den.',
      },
    ],
  },
];
