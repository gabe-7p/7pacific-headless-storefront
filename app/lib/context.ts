import { createHydrogenContext } from '@shopify/hydrogen';

import { CART_QUERY_FRAGMENT } from '~/lib/fragments';
import { AppSession } from '~/lib/session';

// Extra loader/action context (CMS clients, 3P SDKs, …) — none needed yet.
const additionalContext = {} as const;

// Automatically augment HydrogenAdditionalContext with the additional context type
type AdditionalContextType = typeof additionalContext;

declare global {
  // Global augmentation must use `interface` — type aliases can't be merged into the global scope.
  // eslint-disable-next-line @typescript-eslint/consistent-type-definitions
  interface HydrogenAdditionalContext extends AdditionalContextType {}
}

/**
 * Creates Hydrogen context for React Router 7.9.x
 * Returns HydrogenRouterContextProvider with hybrid access patterns
 * */
export async function createHydrogenRouterContext(
  request: Request,
  env: Env,
  executionContext: ExecutionContext
) {
  /**
   * Open a cache instance in the worker and a custom session instance.
   */
  if (!env?.SESSION_SECRET) {
    throw new Error('SESSION_SECRET environment variable is not set');
  }

  const waitUntil = executionContext.waitUntil.bind(executionContext);
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
      // Or detect from URL path based on locale subpath, cookies, or any other strategy
      i18n: { language: 'EN', country: 'US' },
      cart: {
        queryFragment: CART_QUERY_FRAGMENT,
      },
    },
    additionalContext
  );

  return hydrogenContext;
}
