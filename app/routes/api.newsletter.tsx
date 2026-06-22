import { data } from 'react-router';

import type { Route } from './+types/api.newsletter';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export type NewsletterResponse = { ok: boolean; error?: string };

/**
 * Newsletter signup endpoint (POST /api/newsletter).
 *
 * The live Liquid theme posted to Shopify's `form 'customer'` with the contact
 * tagged `prospect,newsletter`. Headless has no equivalent built-in endpoint, so
 * this resource route validates the email and confirms the signup.
 *
 * TODO(GD): wire to the marketing provider (Shopify Email / Klaviyo via the
 * Admin API) once credentials are configured — out of scope for the front-end
 * migration.
 */
export async function action({ request }: Route.ActionArgs) {
  if (request.method !== 'POST') {
    return data<NewsletterResponse>({ ok: false, error: 'Method not allowed' }, { status: 405 });
  }

  const form = await request.formData();
  const email = String(form.get('email') ?? '').trim();

  if (!EMAIL_RE.test(email)) {
    return data<NewsletterResponse>(
      { ok: false, error: 'Please enter a valid email address.' },
      { status: 400 }
    );
  }

  return data<NewsletterResponse>({ ok: true });
}
