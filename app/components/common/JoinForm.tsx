import { Mail } from 'lucide-react';
import { useId } from 'react';
import { useFetcher } from 'react-router';

import { Cta, type CtaVariant } from '~/components/common/Cta';
import { FieldError } from '~/components/common/FieldError';
import type { JoinFormCopy, JoinList } from '~/content/join';
import { cn } from '~/lib/cn';
import type { SubscribeResponse } from '~/lib/forms';

/**
 * The night-tier underline field — the footer signup's input recipe, also
 * used by both dialogs. Surfaces on a light ground pass their own
 * `fieldClassName` (FIRST LIGHT's boxed mono box).
 */
const NIGHT_UNDERLINE_FIELD =
  'mt-1 mb-2 w-full border-b border-border-subtle bg-transparent py-2 text-ink-night placeholder:text-support-night focus:border-ink-night focus:outline-none';

/** The confirmation line that replaces the form, per ground. */
const SUCCESS_LINE = {
  day: 'mt-6 text-sm font-medium text-ink',
  night: 'mt-5 text-sm font-medium',
} as const;

type JoinFormProps = {
  /** Which list the signup lands on — sent as the `list` field. */
  list: JoinList;
  copy: JoinFormCopy;
  /**
   * The submit device: a `Cta` below the fields (default) or the mail glyph
   * sitting inside the email field's right edge — the footer treatment.
   */
  submit?: 'cta' | 'mail';
  /** Skip the browser's own validation so the server messages render instead. */
  noValidate?: boolean;
  /** Layout of the <Form> (stacked dialog vs. inline row). */
  className?: string;
  /** The ground the form sits on; sets the error and confirmation lines. */
  tone?: 'day' | 'night';
  /** Field treatment — surface-owned; defaults to the night underline. */
  fieldClassName?: string;
  ctaVariant?: CtaVariant;
  ctaClassName?: string;
};

/**
 * The one signup form (name + email on every list) — owns the /api/subscribe fetcher, the submitting and
 * succeeded states, and per-field errors for whichever list it's pointed at.
 * On success the form is replaced by the confirmation line.
 */
export const JoinForm = ({
  list,
  copy,
  submit = 'cta',
  noValidate = false,
  className,
  tone = 'night',
  fieldClassName = NIGHT_UNDERLINE_FIELD,
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
  // The mail row (footer, newsletter dialog) sets its error a step larger.
  const errorClassName = submit === 'mail' ? 'mt-2 text-sm' : undefined;
  const fieldError = (message: string | undefined) =>
    message ? (
      <FieldError tone={tone} className={errorClassName}>
        {message}
      </FieldError>
    ) : null;

  if (fetcher.data?.ok === true) {
    return <p className={SUCCESS_LINE[tone]}>{copy.successMessage}</p>;
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
      {/* Every list collects a name; the API rejects a signup without one. */}
      <div className={cn(submit === 'mail' && 'max-w-sm')}>
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
        {fieldError(errors?.name)}
      </div>
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
        {fieldError(errors?.email)}
      </div>
      {fieldError(errors?.list)}
      {submit === 'cta' && (
        <Cta type="submit" variant={ctaVariant} disabled={submitting} className={ctaClassName}>
          {copy.submitLabel}
        </Cta>
      )}
    </fetcher.Form>
  );
};
