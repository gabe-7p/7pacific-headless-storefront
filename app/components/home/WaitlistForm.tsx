import { useId } from 'react';
import { useFetcher } from 'react-router';

import { Cta } from '~/components/common/Cta';
import { HOME_DROP_TWO } from '~/content/home';
import type { WaitlistResponse } from '~/routes/api.waitlist';

/** Night-tier underline field — the footer/newsletter input recipe. */
const fieldClass =
  'w-full rounded-none border-0 border-b border-border-subtle bg-transparent px-0 py-2 text-ink-night placeholder:text-support-night focus:border-ink-night focus:outline-none';

/**
 * The drop-waitlist form (name + email) inside `WaitlistDialog` — owns the
 * /api/waitlist fetcher and the submitting/succeeded states, mirroring
 * `NewsletterForm`. On success the form is replaced by the confirmation line.
 */
export const WaitlistForm = () => {
  const fetcher = useFetcher<WaitlistResponse>();
  const nameId = useId();
  const emailId = useId();
  const submitting = fetcher.state !== 'idle';
  const succeeded = fetcher.data?.ok === true;
  const errors = fetcher.data?.ok === false ? fetcher.data.errors : undefined;
  const { namePlaceholder, emailPlaceholder, submitLabel, successMessage } = HOME_DROP_TWO.waitlist;

  if (succeeded) {
    return <p className="mt-5 text-sm font-medium">{successMessage}</p>;
  }

  return (
    <fetcher.Form method="post" action="/api/waitlist" noValidate className="mt-5 space-y-4">
      <div>
        <label htmlFor={nameId} className="sr-only">
          {namePlaceholder}
        </label>
        <input
          id={nameId}
          type="text"
          name="name"
          required
          autoComplete="name"
          placeholder={namePlaceholder}
          className={fieldClass}
        />
        {errors?.name && <p className="mt-1 text-xs text-support-night">{errors.name}</p>}
      </div>
      <div>
        <label htmlFor={emailId} className="sr-only">
          {emailPlaceholder}
        </label>
        <input
          id={emailId}
          type="email"
          name="email"
          required
          autoComplete="email"
          autoCorrect="off"
          autoCapitalize="off"
          placeholder={emailPlaceholder}
          className={fieldClass}
        />
        {errors?.email && <p className="mt-1 text-xs text-support-night">{errors.email}</p>}
      </div>
      <Cta type="submit" disabled={submitting} className="mt-2">
        {submitLabel}
      </Cta>
    </fetcher.Form>
  );
};
