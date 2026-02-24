'use client';

// =============================================================================
// SUPPORT FORM (Webb-version för Flocken)
// =============================================================================

import { useState } from 'react';
import { submitIssue } from '@/lib/support-client';

interface ReportIssueFormProps {
  userId?: string;
  userEmail?: string;
  userName?: string;
  onSuccess?: (issueId: string) => void;
}

// Kategorier med logik
const CATEGORIES = [
  {
    id: 'technical',
    label: 'Tekniskt problem',
    description: 'Appen fungerar inte, kraschar eller har buggar',
    requiresResponse: false,
    placeholder: 'Beskriv vilket tekniskt problem du stött på...',
  },
  {
    id: 'account',
    label: 'Problem med mitt konto',
    description: 'Inloggning, kontoinställningar, profil eller liknande',
    requiresResponse: false,
    placeholder: 'Beskriv vilket problem du har med ditt konto...',
  },
  {
    id: 'content',
    label: 'Rapportera olämpligt innehåll',
    description: 'Olämpliga bilder, texter eller användarbeteende',
    requiresResponse: false,
    placeholder: 'Beskriv vad som är olämpligt...',
  },
  {
    id: 'suggestion',
    label: 'Förslag på förbättring',
    description: 'Ny funktion eller förbättring av befintlig funktion',
    requiresResponse: false,
    placeholder: 'Beskriv ditt förslag...',
  },
  {
    id: 'other',
    label: 'Övrigt',
    description: 'Annat ärende',
    requiresResponse: false,
    placeholder: 'Beskriv ditt ärende...',
  },
] as const;

export function ReportIssueForm({
  userId,
  userEmail: initialEmail,
  userName,
  onSuccess,
}: ReportIssueFormProps) {
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [email, setEmail] = useState(initialEmail || '');
  const [wantsResponse, setWantsResponse] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const selectedCategory = CATEGORIES.find((c) => c.id === category);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!category) {
      setError('Välj en kategori för ditt ärende.');
      return;
    }

    if (description.trim().length < 10) {
      setError('Beskriv problemet med minst 10 tecken.');
      return;
    }

    if (wantsResponse && !email.trim()) {
      setError('Ange din email för att få återkoppling.');
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await submitIssue({
        description: `[${selectedCategory?.label}]\n\n${description.trim()}`,
        userId,
        userName,
        userEmail: wantsResponse ? email : undefined,
      });

      if (result.success) {
        setIsSubmitted(true);
        onSuccess?.(result.issueId!);
      } else {
        setError(result.error || 'Kunde inte skicka ärendet. Försök igen.');
      }
    } catch (err) {
      setError('Något gick fel. Försök igen.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Success-vy
  if (isSubmitted) {
    return (
      <div className="bg-flocken-sand rounded-2xl p-8 md:p-12 text-center">
        <div className="text-6xl mb-6">✓</div>
        <h2 className="text-3xl font-bold text-flocken-brown mb-4">
          Tack för din feedback!
        </h2>
        <p className="text-lg text-flocken-brown/80 mb-8 max-w-xl mx-auto">
          Vi har tagit emot ditt ärende och kommer att titta på det så snart vi kan.
          {wantsResponse && email && (
            <span className="block mt-2 font-semibold">
              Vi återkommer till dig via email: {email}
            </span>
          )}
        </p>
        <button
          onClick={() => window.location.reload()}
          className="bg-flocken-olive hover:bg-flocken-accent text-white px-8 py-3 rounded-lg font-semibold transition-colors"
        >
          Skicka ett till ärende
        </button>
      </div>
    );
  }

  // Formulär
  return (
    <div className="bg-flocken-cream rounded-2xl p-6 md:p-10">
      <h2 className="text-3xl md:text-4xl font-bold text-flocken-brown mb-3">
        Rapportera problem
      </h2>
      <p className="text-flocken-brown/70 mb-8 text-lg">
        Beskriv vad som hände så hjälper vi dig så snart vi kan.
      </p>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Kategori */}
        <div>
          <label
            htmlFor="category"
            className="block text-sm font-semibold text-flocken-brown mb-2"
          >
            Vad handlar det om? *
          </label>
          <select
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full px-4 py-3 border border-flocken-gray/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-flocken-olive bg-white text-flocken-brown"
          >
            <option value="">Välj kategori...</option>
            {CATEGORIES.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.label}
              </option>
            ))}
          </select>
          {selectedCategory && (
            <p className="text-sm text-flocken-gray mt-2">
              {selectedCategory.description}
            </p>
          )}
        </div>

        {/* Beskrivning */}
        <div>
          <label
            htmlFor="description"
            className="block text-sm font-semibold text-flocken-brown mb-2"
          >
            Beskriv ärendet *
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder={selectedCategory?.placeholder || 'Beskriv så detaljerat du kan...'}
            rows={6}
            className="w-full px-4 py-3 border border-flocken-gray/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-flocken-olive bg-white text-flocken-brown resize-none"
          />
          <p className="text-sm text-flocken-gray mt-1 text-right">
            {description.length} tecken (minst 10)
          </p>
        </div>

        {/* Återkoppling (valfritt) */}
        <div>
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={wantsResponse}
              onChange={(e) => setWantsResponse(e.target.checked)}
              className="w-5 h-5 rounded border-flocken-gray/30 text-flocken-olive focus:ring-flocken-olive"
            />
            <span className="text-flocken-brown font-medium">
              Jag vill ha återkoppling
            </span>
          </label>

          {wantsResponse && (
            <div className="mt-4">
              <label
                htmlFor="email"
                className="block text-sm font-semibold text-flocken-brown mb-2"
              >
                Din email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="namn@exempel.se"
                className="w-full px-4 py-3 border border-flocken-gray/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-flocken-olive bg-white text-flocken-brown"
              />
            </div>
          )}
        </div>

        {/* Error */}
        {error && (
          <div className="bg-flocken-error/10 border border-flocken-error/30 text-flocken-error px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {/* Submit */}
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-flocken-olive hover:bg-flocken-accent disabled:opacity-50 disabled:cursor-not-allowed text-white px-10 py-4 rounded-lg font-semibold text-lg transition-colors min-w-[180px]"
          >
            {isSubmitting ? 'Skickar...' : 'Skicka'}
          </button>
        </div>

        {/* Info */}
        <p className="text-xs text-flocken-gray text-center pt-4">
          Enhetsinformation skickas automatiskt för att hjälpa oss felsöka.
        </p>
      </form>
    </div>
  );
}
