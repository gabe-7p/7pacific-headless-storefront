import { data } from 'react-router';

import { ANALYTICS_EVENT } from '~/lib/analytics/posthog.events';
import { posthogContext } from '~/lib/analytics/posthog.server';
import {
  collectErrors,
  type FormResult,
  readField,
  REQUIRED_NAME_MESSAGE,
  validateEmail,
  validateRequired,
} from '~/lib/forms';

import type { Route } from './+types/api.waitlist';

export type WaitlistResponse = FormResult<'name' | 'email'>;

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
export async function action({ request, context }: Route.ActionArgs) {
  if (request.method !== 'POST') {
    return data<WaitlistResponse>(
      { ok: false, errors: { email: 'Method not allowed' } },
      { status: 405 }
    );
  }

  const form = await request.formData();
  const errors = collectErrors({
    name: validateRequired(readField(form, 'name'), REQUIRED_NAME_MESSAGE),
    email: validateEmail(readField(form, 'email')),
  });
  if (errors) return data<WaitlistResponse>({ ok: false, errors }, { status: 400 });

  context.get(posthogContext)?.capture({ event: ANALYTICS_EVENT.waitlistJoined });

  return data<WaitlistResponse>({ ok: true });
}
