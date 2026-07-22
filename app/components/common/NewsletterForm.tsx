import { Mail } from 'lucide-react';
import { useEffect, useId } from 'react';
import { useFetcher } from 'react-router';

import { BRAND } from '~/lib/brand';
import type { NewsletterResponse } from '~/routes/api.newsletter';

type NewsletterFormProps = {
  /** Fired once when the signup succeeds. */
  onSuccess?: () => void;
};

/**
 * The one newsletter signup form — owns the /api/newsletter fetcher,
 * submitting/succeeded states, and BRAND.newsletter copy. The footer is the
 * single signup per page (7PA-241: acquisition through community, not price —
 * the old site-wide popup and its boxed variant are gone).
 */
export const NewsletterForm = ({ onSuccess }: NewsletterFormProps) => {
  const fetcher = useFetcher<NewsletterResponse>();
  // The footer form and the dialog form can both be mounted, so the input id
  // has to be per-instance or the label points at the wrong field.
  const emailId = useId();
  const submitting = fetcher.state !== 'idle';
  const succeeded = fetcher.data?.ok === true;
  const { placeholder, submitLabel, successMessage } = BRAND.newsletter;

  useEffect(() => {
    if (succeeded) onSuccess?.();
  }, [succeeded, onSuccess]);

  if (succeeded) {
    return <p className="mt-5 text-sm font-medium">{successMessage}</p>;
  }

  return (
    <fetcher.Form method="post" action="/api/newsletter" className="mt-5">
      <div className="relative max-w-sm">
        <label htmlFor={emailId} className="sr-only">
          {placeholder}
        </label>
        <input
          id={emailId}
          type="email"
          name="email"
          required
          autoCorrect="off"
          autoCapitalize="off"
          placeholder={placeholder}
          className="w-full rounded-none border-0 border-b border-border-subtle bg-transparent px-0 py-2 pr-10 text-ink-night placeholder:text-support-night focus:border-ink-night focus:outline-none"
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
      {fetcher.data?.error && (
        <p className="mt-2 text-sm text-support-night">{fetcher.data.error}</p>
      )}
    </fetcher.Form>
  );
};
