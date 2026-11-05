/**
 * Shared form primitives: one way to read a field, one email rule, one
 * `{ ok, errors }` result shape.
 */
import { data } from 'react-router';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const INVALID_EMAIL_MESSAGE = 'Please enter a valid email address.';
export const REQUIRED_NAME_MESSAGE = 'Please enter your name.';
export const REQUIRED_MESSAGE_MESSAGE = 'Please enter a message.';
export const UNKNOWN_LIST_MESSAGE = 'Unknown list.';
const METHOD_NOT_ALLOWED_MESSAGE = 'Method not allowed';

export type FormErrors<Field extends string> = Partial<Record<Field, string>>;

export type FormResult<Field extends string> =
  | { ok: true }
  | { ok: false; errors: FormErrors<Field> };

/** The `/api/subscribe` response (the signup `fetcher` in `common/JoinForm` reads it). */
export type SubscribeResponse = FormResult<'name' | 'email' | 'list'>;

/** A trimmed string field; absent fields read as ''. */
export const readField = (form: FormData, key: string): string =>
  String(form.get(key) ?? '').trim();

export const validateEmail = (email: string): string | undefined =>
  EMAIL_RE.test(email) ? undefined : INVALID_EMAIL_MESSAGE;

export const validateRequired = (value: string, message: string): string | undefined =>
  value ? undefined : message;

/** Drops the fields that validated, leaving only the messages to render. */
const collectErrors = <Field extends string>(
  checks: Partial<Record<Field, string | undefined>>
): FormErrors<Field> | null => {
  const errors: FormErrors<Field> = {};
  for (const field of Object.keys(checks) as Array<Field>) {
    const message = checks[field];
    if (message) errors[field] = message;
  }
  return Object.keys(errors).length > 0 ? errors : null;
};

/**
 * The shared action contract for form POSTs: a non-POST is a 405 (reported on
 * `methodField`), failed checks are a 400 with one message per field, and
 * success is `{ ok: true }`. `check` maps the form to per-field messages
 * (undefined = valid); `onValid` runs only after every check passes.
 */
export const handleFormAction = async <Field extends string>(
  request: Request,
  {
    methodField,
    check,
    onValid,
  }: {
    methodField: Field;
    check: (form: FormData) => Partial<Record<Field, string | undefined>>;
    onValid?: (form: FormData) => void;
  }
) => {
  if (request.method !== 'POST') {
    return data<FormResult<Field>>(
      { ok: false, errors: { [methodField]: METHOD_NOT_ALLOWED_MESSAGE } as FormErrors<Field> },
      { status: 405 }
    );
  }

  const form = await request.formData();
  const errors = collectErrors(check(form));
  if (errors) return data<FormResult<Field>>({ ok: false, errors }, { status: 400 });

  onValid?.(form);
  return data<FormResult<Field>>({ ok: true });
};
