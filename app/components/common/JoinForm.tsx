import { Mail } from 'lucide-react';
import { useId } from 'react';
import { useFetcher } from 'react-router';

import { Cta, type CtaVariant } from '~/components/common/Cta';
import type { JoinFormCopy, JoinList } from '~/content/join';
import { cn } from '~/lib/cn';
import type { SubscribeResponse } from '~/routes/api.subscribe';

/**
 * The night-tier underline field — the footer signup's input recipe, also
 * used by both dialogs. Surfaces on a light ground pass their own
 * `fieldClassName` (FIRST LIGHT's boxed mono box).
 */
const NIGHT_UNDERLINE_FIELD =
  'w-full rounded-none border-0 border-b border-border-subtle bg-transparent px-0 py-2 text-ink-night placeholder:text-support-night focus:border-ink-night focus:outline-none';

type JoinFormProps = {
  /** Which list the signup lands on — sent as the `list` field. */
  list: JoinList;
  copy: JoinFormCopy;
  /** Adds the name field above the email (the waitlist contract). */
  withName?: boolean;
  /**
   * The submit device: a `Cta` below the fields (default) or the mail glyph
   * sitting inside the email field's right edge — the footer treatment.
   */
  submit?: 'cta' | 'mail';
  /** Skip the browser's own validation so the server messages render instead. */
  noValidate?: boolean;
  /** Layout of the <Form> (stacked dialog vs. inline row). */
  className?: string;
  /** Field treatment — surface-owned; defaults to the night underline. */
  fieldClassName?: string;
  errorClassName?: string;
  successClassName?: string;
  ctaVariant?: CtaVariant;
  ctaClassName?: string;
};

/**
 * The one signup form — owns the /api/subscribe fetcher, the submitting and
 * succeeded states, and per-field errors for whichever list it's pointed at.
 * It renders in four places: the footer (newsletter, mail-glyph submit), the
 * `JoinDialog` for either list, and the FIRST LIGHT Early Access block
 * (waitlist, inline row). On success the form is replaced by the
 * confirmation line.
 *
 * Signups are click-triggered only (7PA-241: acquisition through community,
 * not price — the old on-load site-wide popup is gone).
 */
export const JoinForm = ({
  list,
  copy,
  withName = false,
  submit = 'cta',
  noValidate = false,
  className,
  fieldClassName = NIGHT_UNDERLINE_FIELD,
  errorClassName = 'mt-1 text-xs text-support',
  successClassName = 'mt-5 text-sm font-medium',
  ctaVariant,
  ctaClassName,
}: JoinFormProps) => {
  const fetcher = useFetcher<SubscribeResponse>();
  // Two instances can be mounted at once (footer + dialog), so ids are
  // per-instance or a label points at the wrong field.
  const nameId = useId();
  const emailId = useId();
  const submitting = fetcher.state !== 'idle';
  const errors = fetcher.data?.ok === false ? fetcher.data.errors : undefined;

  if (fetcher.data?.ok === true) {
    return <p className={successClassName}>{copy.successMessage}</p>;
  }

  const emailField = (
    <input
      id={emailId}
      type="email"
      name="email"
      required
      autoComplete="email"
      autoCorrect="off"
      autoCapitalize="off"
      placeholder={copy.emailPlaceholder}
      className={cn(fieldClassName, submit === 'mail' && 'pr-10')}
    />
  );

  return (
    <fetcher.Form
      method="post"
      action="/api/subscribe"
      noValidate={noValidate}
      className={className}
    >
      <input type="hidden" name="list" value={list} />
      {withName && (
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
      )}
      <div>
        <label htmlFor={emailId} className="sr-only">
          {copy.emailPlaceholder}
        </label>
        {submit === 'mail' ? (
          <div className="relative max-w-sm">
            {emailField}
            <button
              type="submit"
              disabled={submitting}
              aria-label={copy.submitLabel}
              className="absolute top-1/2 right-0 -translate-y-1/2 transition-opacity hover:opacity-70 disabled:opacity-40"
            >
              <Mail className="size-5" />
            </button>
          </div>
        ) : (
          emailField
        )}
        {errors?.email && <p className={errorClassName}>{errors.email}</p>}
      </div>
      {errors?.list && <p className={errorClassName}>{errors.list}</p>}
      {submit === 'cta' && (
        <Cta type="submit" variant={ctaVariant} disabled={submitting} className={ctaClassName}>
          {copy.submitLabel}
        </Cta>
      )}
    </fetcher.Form>
  );
};
