import { isJoinList, type JoinList } from '~/content/join';
import { ANALYTICS_EVENT } from '~/lib/analytics/posthog.events';
import { posthogContext } from '~/lib/analytics/posthog.server';
import {
  handleFormAction,
  INVALID_EMAIL_MESSAGE,
  readField,
  REQUIRED_NAME_MESSAGE,
  SIGNUP_FAILED_MESSAGE,
  type SubscribeResponse,
  UNKNOWN_LIST_MESSAGE,
  validateEmail,
  validateRequired,
} from '~/lib/forms';
import { oxygenContext } from '~/lib/oxygen';
import { saveSignup } from '~/lib/signups.server';

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
 * waitlist — `name`. Each valid signup is saved as a Shopify customer tagged
 * with its list (lib/signups.server.ts). Response: `{ ok: true }`, or
 * `{ ok: false, errors }` with a message per failed field (400), `list` for
 * an unknown list (400) or a save that failed (502), or a non-POST (405).
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
    onValid: async (form) => {
      const list = readField(form, 'list');
      if (!isJoinList(list)) return { list: UNKNOWN_LIST_MESSAGE };

      const result = await saveSignup(context.get(oxygenContext).env, {
        list,
        email: readField(form, 'email'),
        name: list === 'waitlist' ? readField(form, 'name') : undefined,
      });
      if (!result.ok) {
        return result.reason === 'invalid-email'
          ? { email: INVALID_EMAIL_MESSAGE }
          : { list: SIGNUP_FAILED_MESSAGE };
      }

      context.get(posthogContext)?.capture({ event: EVENT_BY_LIST[list] });
      return undefined;
    },
  });
