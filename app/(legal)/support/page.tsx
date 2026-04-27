import { ContactForm } from '@/components/support/ContactForm';
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
        Har du frågor eller behöver hjälp? Fyll i formuläret nedan eller maila oss på{' '}
        <a href="mailto:support@flocken.info" className="text-flocken-olive hover:underline">
          support@flocken.info
        </a>.
      </p>

      <div className="not-prose mt-6">
        <ContactForm />
      </div>

      <div className="not-prose">
        <FaqSection />
      </div>

      <h2 id="feedback" className="mt-10">Feedback & Förslag</h2>
      <p>
        Vi uppskattar all feedback! Om du har förslag på förbättringar eller nya
        funktioner, tveka inte att höra av dig — antingen via formuläret ovan eller direkt till{' '}
        <a href="mailto:support@flocken.info" className="text-flocken-olive hover:underline">
          support@flocken.info
        </a>.
      </p>
    </>
  );
}
