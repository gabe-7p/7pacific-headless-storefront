import { data } from 'react-router';

import { EMAIL_RE, INVALID_EMAIL_MESSAGE } from '~/lib/validation';

import type { Route } from './+types/api.waitlist';

export type WaitlistResponse =
  | { ok: true }
  | { ok: false; errors: { name?: string; email?: string } };

/**
 * Drop waitlist signup endpoint (POST /api/waitlist) — name + email from the
 * homepage "Get on the List" dialog.
 *
 * Same contract as /api/newsletter: validate and confirm.
 *
 * TODO(GD): wire to the marketing provider (Shopify Email / Klaviyo via the
 * Admin API) once credentials are configured — out of scope for now, per
 * Gabe (2026-08-03). The response shape stays the same when that lands.
 */
export async function action({ request }: Route.ActionArgs) {
  if (request.method !== 'POST') {
    return data<WaitlistResponse>(
      { ok: false, errors: { email: 'Method not allowed' } },
      { status: 405 }
    );
  }

  const form = await request.formData();
  const name = String(form.get('name') ?? '').trim();
  const email = String(form.get('email') ?? '').trim();

  const errors: { name?: string; email?: string } = {};
  if (!name) errors.name = 'Please enter your name.';
  if (!EMAIL_RE.test(email)) errors.email = INVALID_EMAIL_MESSAGE;

  if (errors.name || errors.email) {
    return data<WaitlistResponse>({ ok: false, errors }, { status: 400 });
  }

  return data<WaitlistResponse>({ ok: true });
}
