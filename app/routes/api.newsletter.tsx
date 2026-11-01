import { data } from 'react-router';

import { collectErrors, type FormResult, readField, validateEmail } from '~/lib/forms';

import type { Route } from './+types/api.newsletter';

export type NewsletterResponse = FormResult<'email'>;

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
export async function action({ request, context }: Route.ActionArgs) {
  if (request.method !== 'POST') {
    return data<NewsletterResponse>(
      { ok: false, errors: { email: 'Method not allowed' } },
      { status: 405 }
    );
  }

  const form = await request.formData();
  const errors = collectErrors({ email: validateEmail(readField(form, 'email')) });
  if (errors) return data<NewsletterResponse>({ ok: false, errors }, { status: 400 });

  context.posthog?.capture({ event: 'newsletter_subscribed' });

  return data<NewsletterResponse>({ ok: true });
}
