/**
 * Shared form-handling primitives for the resource routes and the contact
 * page: one way to read a field, one email rule, one `{ ok, errors }` result
 * shape — so each form component reads the same contract.
 */
export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const INVALID_EMAIL_MESSAGE = 'Please enter a valid email address.';
export const REQUIRED_NAME_MESSAGE = 'Please enter your name.';
export const REQUIRED_MESSAGE_MESSAGE = 'Please enter a message.';

export type FormErrors<Field extends string> = Partial<Record<Field, string>>;

export type FormResult<Field extends string> =
  | { ok: true }
  | { ok: false; errors: FormErrors<Field> };

/** A trimmed string field; absent fields read as ''. */
export const readField = (form: FormData, key: string): string =>
  String(form.get(key) ?? '').trim();

export const validateEmail = (email: string): string | undefined =>
  EMAIL_RE.test(email) ? undefined : INVALID_EMAIL_MESSAGE;

export const validateRequired = (value: string, message: string): string | undefined =>
  value ? undefined : message;

/** Drops the fields that validated, leaving only the messages to render. */
export const collectErrors = <Field extends string>(
  checks: Record<Field, string | undefined>
): FormErrors<Field> | null => {
  const errors: FormErrors<Field> = {};
  for (const field of Object.keys(checks) as Array<Field>) {
    const message = checks[field];
    if (message) errors[field] = message;
  }
  return Object.keys(errors).length > 0 ? errors : null;
};
