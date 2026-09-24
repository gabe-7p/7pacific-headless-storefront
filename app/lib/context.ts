import { createHydrogenContext } from '@shopify/hydrogen';

import { CART_QUERY_FRAGMENT } from '~/lib/fragments';
import { createPostHogClient } from '~/lib/posthog.server';
import { AppSession } from '~/lib/session';

type AdditionalContextType = {
  posthog?: ReturnType<typeof createPostHogClient>;
};

declare global {
  // Global augmentation must use `interface` — type aliases can't be merged into the global scope.
  // eslint-disable-next-line @typescript-eslint/consistent-type-definitions
  interface HydrogenAdditionalContext extends AdditionalContextType {}
}

/** Builds the per-request Hydrogen context (storefront client, cart, session). */
export async function createHydrogenRouterContext(
  request: Request,
  env: Env,
  executionContext: ExecutionContext
) {
  if (!env?.SESSION_SECRET) {
    throw new Error('SESSION_SECRET environment variable is not set');
  }

  const waitUntil = executionContext.waitUntil.bind(executionContext);
  const posthog = createPostHogClient(env);
  const [cache, session] = await Promise.all([
    caches.open('hydrogen'),
    AppSession.init(request, [env.SESSION_SECRET]),
  ]);

  const hydrogenContext = createHydrogenContext(
    {
      env,
      request,
      cache,
      waitUntil,
      session,
      // English/US only for v1 — no locale detection.
      i18n: { language: 'EN', country: 'US' },
      cart: {
        queryFragment: CART_QUERY_FRAGMENT,
      },
    },
    { posthog }
  );

  return hydrogenContext;
}
