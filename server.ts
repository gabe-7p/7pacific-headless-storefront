import { createRequestHandler, RouterContextProvider } from 'react-router';
import * as serverBuild from 'virtual:react-router/server-build';

import { envContext } from '~/lib/env';
import { createPostHogClient, posthogContext } from '~/lib/posthog.server';

/**
 * The Oxygen worker entry. Hydrogen 2026.10 is a library, so this is a plain
 * React Router request handler: it threads the worker bindings (env, the
 * sub-request cache, waitUntil) onto the router context, and the root
 * middleware in app/root.tsx builds the Storefront client and runs Shopify's
 * request handlers per request.
 */
export default {
  async fetch(request: Request, env: Env, executionContext: ExecutionContext): Promise<Response> {
    const posthog = createPostHogClient(env, request);

    try {
      const url = new URL(request.url);
      if (url.pathname.includes('//')) {
        return new Response(null, {
          status: 301,
          headers: { location: url.pathname.replace(/[/]+/g, '/') },
        });
      }

      const routerContext = new RouterContextProvider();
      routerContext.cache = await caches.open('hydrogen-v1');
      routerContext.env = env;
      routerContext.waitUntil = executionContext.waitUntil.bind(executionContext);
      routerContext.set(envContext, env);
      routerContext.set(posthogContext, posthog);

      const handleRequest = createRequestHandler(serverBuild, process.env.NODE_ENV);
      return await handleRequest(request, routerContext as never);
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
