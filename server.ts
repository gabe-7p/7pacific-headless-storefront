import { createRequestHandler, storefrontRedirect } from '@shopify/hydrogen';
import * as serverBuild from 'virtual:react-router/server-build';

import { createHydrogenRouterContext } from '~/lib/context';

export default {
  async fetch(request: Request, env: Env, executionContext: ExecutionContext): Promise<Response> {
    let posthog: HydrogenAdditionalContext['posthog'];

    try {
      const hydrogenContext = await createHydrogenRouterContext(request, env, executionContext);
      posthog = hydrogenContext.posthog;

      const handleRequest = createRequestHandler({
        build: serverBuild,
        mode: process.env.NODE_ENV,
        getLoadContext: () => hydrogenContext,
      });

      const response = await handleRequest(request);

      if (hydrogenContext.session.isPending) {
        response.headers.set('Set-Cookie', await hydrogenContext.session.commit());
      }

      if (response.status === 404) {
        // Shopify-configured URL redirects; passes the 404 through when none match.
        return storefrontRedirect({
          request,
          response,
          storefront: hydrogenContext.storefront,
        });
      }

      return response;
    } catch (error) {
      console.error(error);
      posthog?.captureException(error);
      return new Response('An unexpected error occurred', { status: 500 });
    } finally {
      // Flush after the response is sent — awaiting here would hold every
      // response until PostHog answers.
      if (posthog) executionContext.waitUntil(posthog.shutdown().catch(() => undefined));
    }
  },
};
