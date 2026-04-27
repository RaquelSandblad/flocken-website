import { FaqSection } from '@/components/support/FaqSection';

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
            <a href="mailto:support@flocken.info" className="text-flocken-olive hover:underline">
              support@flocken.info
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

      <div className="not-prose">
        <FaqSection />
      </div>

      <h2 id="feedback" className="mt-10">Feedback & Förslag</h2>
      <p>
        Vi uppskattar all feedback! Om du har förslag på förbättringar eller nya
        funktioner, tveka inte att höra av dig till{' '}
        <a href="mailto:support@flocken.info" className="text-flocken-olive hover:underline">
          support@flocken.info
        </a>.
      </p>
    </>
  );
}
