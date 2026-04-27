'use client';

import { useState } from 'react';
import { submitIssue } from '@/lib/support-client';

const CATEGORIES = [
  { id: 'technical', label: 'Tekniskt problem', placeholder: 'Beskriv vad som händer — t.ex. felmeddelande, vilken funktion det gäller...' },
  { id: 'account', label: 'Problem med mitt konto', placeholder: 'Beskriv kontoproblemet...' },
  { id: 'subscription', label: 'Prenumeration & betalning', placeholder: 'Beskriv betalningsärendet...' },
  { id: 'suggestion', label: 'Förslag på förbättring', placeholder: 'Beskriv ditt förslag...' },
  { id: 'other', label: 'Övrigt', placeholder: 'Beskriv ditt ärende...' },
] as const;

export function ContactForm() {
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [email, setEmail] = useState('');
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
      setError('Beskriv ärendet med minst 10 tecken.');
      return;
    }
    if (wantsResponse && !email.trim()) {
      setError('Ange din e-postadress för att få återkoppling.');
      return;
    }

    setIsSubmitting(true);
    const result = await submitIssue({
      description: `[${selectedCategory?.label}]\n\n${description.trim()}`,
      userEmail: wantsResponse ? email.trim() : undefined,
    });
    setIsSubmitting(false);

    if (result.success) {
      setIsSubmitted(true);
    } else {
      setError(result.error || 'Något gick fel. Försök igen eller maila support@flocken.info.');
    }
  };

  if (isSubmitted) {
    return (
      <div className="bg-flocken-cream rounded-2xl p-8 text-center">
        <div className="w-14 h-14 mx-auto mb-4 bg-flocken-olive rounded-full flex items-center justify-center">
          <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="text-xl font-bold text-flocken-brown mb-2">Tack, vi har tagit emot ditt ärende!</h3>
        <p className="text-flocken-brown/80 mb-6">
          Vi återkommer så snart vi kan.
          {wantsResponse && email && (
            <span className="block mt-1 font-medium">Svar skickas till: {email}</span>
          )}
        </p>
        <button
          onClick={() => {
            setIsSubmitted(false);
            setCategory('');
            setDescription('');
            setEmail('');
            setWantsResponse(false);
          }}
          className="text-flocken-olive font-semibold hover:text-flocken-brown transition-colors"
        >
          Skicka ett till ärende
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label htmlFor="category" className="block text-sm font-semibold text-flocken-brown mb-2">
          Vad handlar det om? *
        </label>
        <select
          id="category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full px-4 py-3 border border-flocken-sand rounded-xl focus:outline-none focus:ring-2 focus:ring-flocken-olive bg-white text-flocken-brown"
        >
          <option value="">Välj kategori...</option>
          {CATEGORIES.map((cat) => (
            <option key={cat.id} value={cat.id}>{cat.label}</option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-semibold text-flocken-brown mb-2">
          Beskriv ärendet *
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder={selectedCategory?.placeholder ?? 'Beskriv så detaljerat du kan...'}
          rows={5}
          className="w-full px-4 py-3 border border-flocken-sand rounded-xl focus:outline-none focus:ring-2 focus:ring-flocken-olive bg-white text-flocken-brown resize-none"
        />
        <p className="text-xs text-flocken-gray mt-1 text-right">{description.length} tecken (minst 10)</p>
      </div>

      <label className="flex items-center gap-3 cursor-pointer">
        <input
          type="checkbox"
          checked={wantsResponse}
          onChange={(e) => setWantsResponse(e.target.checked)}
          className="w-5 h-5 rounded border-flocken-sand accent-flocken-olive"
        />
        <span className="text-flocken-brown font-medium">Jag vill ha återkoppling</span>
      </label>

      {wantsResponse && (
        <div>
          <label htmlFor="email" className="block text-sm font-semibold text-flocken-brown mb-2">
            Din e-postadress
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="namn@exempel.se"
            className="w-full px-4 py-3 border border-flocken-sand rounded-xl focus:outline-none focus:ring-2 focus:ring-flocken-olive bg-white text-flocken-brown"
          />
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
          {error}
        </div>
      )}

      <div className="flex justify-end pt-1">
        <button
          type="submit"
          disabled={isSubmitting}
          className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed min-w-[140px]"
        >
          {isSubmitting ? 'Skickar...' : 'Skicka'}
        </button>
      </div>
    </form>
  );
}
