import { useId } from 'react';
import { useFetcher } from 'react-router';

import { Cta, type CtaVariant } from '~/components/common/Cta';
import type { WaitlistResponse } from '~/routes/api.waitlist';

type WaitlistCopy = {
  namePlaceholder: string;
  emailPlaceholder: string;
  submitLabel: string;
  successMessage: string;
};

type WaitlistFormProps = {
  copy: WaitlistCopy;
  /** Layout of the <Form> (stacked dialog vs. inline row). */
  className?: string;
  /** Field treatment (night-tier underline vs. boxed mono) — surface-owned. */
  fieldClassName: string;
  errorClassName?: string;
  successClassName?: string;
  ctaVariant?: CtaVariant;
  ctaClassName?: string;
};

/**
 * The drop-waitlist form (name + email) — owns the /api/waitlist fetcher and
 * the submitting/succeeded states, mirroring `NewsletterForm`. One list, two
 * doors: the homepage waitlist dialog and the FIRST LIGHT Early Access block
 * both render through this with their own field/layout treatments. On success
 * the form is replaced by the confirmation line.
 */
export const WaitlistForm = ({
  copy,
  className,
  fieldClassName,
  errorClassName = 'mt-1 text-xs text-support',
  successClassName = 'mt-5 text-sm font-medium',
  ctaVariant,
  ctaClassName,
}: WaitlistFormProps) => {
  const fetcher = useFetcher<WaitlistResponse>();
  // Two instances can be mounted at once, so ids are per-instance or a label
  // points at the wrong field.
  const nameId = useId();
  const emailId = useId();
  const submitting = fetcher.state !== 'idle';
  const errors = fetcher.data?.ok === false ? fetcher.data.errors : undefined;

  if (fetcher.data?.ok === true) {
    return <p className={successClassName}>{copy.successMessage}</p>;
  }

  return (
    <fetcher.Form method="post" action="/api/waitlist" noValidate className={className}>
      <div>
        <label htmlFor={nameId} className="sr-only">
          {copy.namePlaceholder}
        </label>
        <input
          id={nameId}
          type="text"
          name="name"
          required
          autoComplete="name"
          placeholder={copy.namePlaceholder}
          className={fieldClassName}
        />
        {errors?.name && <p className={errorClassName}>{errors.name}</p>}
      </div>
      <div>
        <label htmlFor={emailId} className="sr-only">
          {copy.emailPlaceholder}
        </label>
        <input
          id={emailId}
          type="email"
          name="email"
          required
          autoComplete="email"
          autoCorrect="off"
          autoCapitalize="off"
          placeholder={copy.emailPlaceholder}
          className={fieldClassName}
        />
        {errors?.email && <p className={errorClassName}>{errors.email}</p>}
      </div>
      <Cta type="submit" variant={ctaVariant} disabled={submitting} className={ctaClassName}>
        {copy.submitLabel}
      </Cta>
    </fetcher.Form>
  );
};
