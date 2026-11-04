import { data } from 'react-router';

import { isJoinList, type JoinList } from '~/content/join';
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

import type { Route } from './+types/api.subscribe';

export type SubscribeResponse = FormResult<'name' | 'email' | 'list'>;

export const UNKNOWN_LIST_MESSAGE = 'Unknown list.';

const EVENT_BY_LIST: Record<JoinList, string> = {
  newsletter: ANALYTICS_EVENT.newsletterSubscribed,
  waitlist: ANALYTICS_EVENT.waitlistJoined,
};

/**
 * The one signup endpoint (POST /api/subscribe) behind `JoinForm`.
 *
 * Request: `list` (`newsletter` | `waitlist`), `email`, and — for the
 * waitlist — `name`. Response: `{ ok: true }`, or `{ ok: false, errors }` with
 * a message per failed field (400), `list` for an unknown list (400) or a
 * non-POST (405).
 *
 * TODO(GD): wire to the marketing provider (Shopify Email / Klaviyo via the
 * Admin API) once credentials are configured — out of scope for now, per
 * Gabe (2026-08-03). The response shape stays the same when that lands.
 */
export async function action({ request, context }: Route.ActionArgs) {
  if (request.method !== 'POST') {
    return data<SubscribeResponse>(
      { ok: false, errors: { list: 'Method not allowed' } },
      { status: 405 }
    );
  }

  const form = await request.formData();
  const list = readField(form, 'list');
  if (!isJoinList(list)) {
    return data<SubscribeResponse>(
      { ok: false, errors: { list: UNKNOWN_LIST_MESSAGE } },
      { status: 400 }
    );
  }

  const errors = collectErrors({
    name:
      list === 'waitlist'
        ? validateRequired(readField(form, 'name'), REQUIRED_NAME_MESSAGE)
        : undefined,
    email: validateEmail(readField(form, 'email')),
  });
  if (errors) return data<SubscribeResponse>({ ok: false, errors }, { status: 400 });

  context.get(posthogContext)?.capture({ event: EVENT_BY_LIST[list] });

  return data<SubscribeResponse>({ ok: true });
}
