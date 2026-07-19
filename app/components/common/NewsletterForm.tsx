import { Mail } from 'lucide-react';
import { useEffect } from 'react';
import { useFetcher } from 'react-router';

import { BRAND } from '~/lib/brand';
import type { NewsletterResponse } from '~/routes/api.newsletter';

type NewsletterFormProps = {
  /** footer = underline input + mail-icon submit (on dark); popup = boxed input + block brand button. */
  variant: 'footer' | 'popup';
  /** Fired once when the signup succeeds (e.g. the popup persists its dismissal). */
  onSuccess?: () => void;
};

/**
 * The one newsletter signup form — owns the /api/newsletter fetcher,
 * submitting/succeeded states, and BRAND.newsletter copy. Footer and
 * NewsletterPopup wrap it with their own surrounding chrome.
 */
export const NewsletterForm = ({ variant, onSuccess }: NewsletterFormProps) => {
  const fetcher = useFetcher<NewsletterResponse>();
  const submitting = fetcher.state !== 'idle';
  const succeeded = fetcher.data?.ok === true;
  const { placeholder, submitLabel, successMessage } = BRAND.newsletter;

  useEffect(() => {
    if (succeeded) onSuccess?.();
  }, [succeeded, onSuccess]);

  if (succeeded) {
    return (
      <p className={variant === 'footer' ? 'mt-5 text-sm font-medium' : 'mt-6 text-sm font-medium'}>
        {successMessage}
      </p>
    );
  }

  if (variant === 'footer') {
    return (
      <fetcher.Form method="post" action="/api/newsletter" className="mt-5">
        <div className="relative max-w-sm">
          <label htmlFor="newsletter-email" className="sr-only">
            {placeholder}
          </label>
          <input
            id="newsletter-email"
            type="email"
            name="email"
            required
            autoCorrect="off"
            autoCapitalize="off"
            placeholder={placeholder}
            className="w-full rounded-none border-0 border-b border-white/60 bg-transparent px-0 py-2 pr-10 text-white placeholder:text-white/60 focus:border-white focus:outline-none"
          />
          <button
            type="submit"
            disabled={submitting}
            aria-label={submitLabel}
            className="absolute top-1/2 right-0 -translate-y-1/2 transition-opacity hover:opacity-70 disabled:opacity-40"
          >
            <Mail className="size-5" />
          </button>
        </div>
        {fetcher.data?.error && <p className="mt-2 text-sm text-white/80">{fetcher.data.error}</p>}
      </fetcher.Form>
    );
  }

  return (
    <fetcher.Form method="post" action="/api/newsletter" className="mt-6">
      <label htmlFor="nl-popup-email" className="sr-only">
        {placeholder}
      </label>
      <input
        id="nl-popup-email"
        type="email"
        name="email"
        required
        autoCorrect="off"
        autoCapitalize="off"
        placeholder={placeholder}
        className="border-border-subtle w-full border bg-white px-4 py-3 text-sm focus:border-black focus:outline-none"
      />
      {/* Secondary, sentence case — buttons in forms are the type system's
          "UI sentence" tier, and Ember is reserved for the page's primary CTA
          (7PA-230). Text color inherits so it adapts to the Carbon footer. */}
      <button
        type="submit"
        disabled={submitting}
        className="border-fog mt-3 w-full border px-6 py-3 text-sm font-medium transition-opacity hover:opacity-70 disabled:opacity-50"
      >
        {submitting ? 'Signing up…' : submitLabel}
      </button>
      {fetcher.data?.error && <p className="mt-2 text-sm text-neutral-500">{fetcher.data.error}</p>}
    </fetcher.Form>
  );
};
