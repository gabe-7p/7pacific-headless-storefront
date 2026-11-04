import { isJoinList, type JoinList } from '~/content/join';
import { ANALYTICS_EVENT } from '~/lib/analytics/posthog.events';
import { posthogContext } from '~/lib/analytics/posthog.server';
import {
  handleFormAction,
  readField,
  REQUIRED_NAME_MESSAGE,
  type SubscribeResponse,
  UNKNOWN_LIST_MESSAGE,
  validateEmail,
  validateRequired,
} from '~/lib/forms';

import type { Route } from './+types/api.subscribe';

type SubscribeField = keyof Extract<SubscribeResponse, { ok: false }>['errors'];

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
export const action = ({ request, context }: Route.ActionArgs) =>
  handleFormAction<SubscribeField>(request, {
    methodField: 'list',
    check: (form) => {
      if (!isJoinList(readField(form, 'list'))) return { list: UNKNOWN_LIST_MESSAGE };
      return {
        name:
          readField(form, 'list') === 'waitlist'
            ? validateRequired(readField(form, 'name'), REQUIRED_NAME_MESSAGE)
            : undefined,
        email: validateEmail(readField(form, 'email')),
      };
    },
    onValid: (form) => {
      const list = readField(form, 'list');
      if (isJoinList(list)) context.get(posthogContext)?.capture({ event: EVENT_BY_LIST[list] });
    },
  });
