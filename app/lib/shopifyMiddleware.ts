import { handleShopifyRedirects, handleShopifyRoutes } from '@shopify/hydrogen';

import { cartHandlers } from '~/lib/cart.server';
import {
  createRequestStorefrontClient,
  routeTemplates,
  storefrontClientContext,
} from '~/lib/storefront';

import type { Route } from '../+types/root';

/**
 * The root middleware: Hydrogen 2026.10 is a library we compose, not a
 * framework that owns the request, so this is where its request lifecycle
 * (client → Shopify-owned URLs → router → redirects → response headers) is
 * wired. The lifecycle itself is documented in docs/architecture.md →
 * "Request & data flow". One thing bears repeating: `applyResponseHeaders`
 * MUST run on every app response or consent and checkout continuity break.
 */
export const shopifyMiddleware: Route.MiddlewareFunction = async (
  { context, request, url },
  next
) => {
  // Under `future.v8_passThroughRequests` React Router hands us the raw request:
  // a client-side navigation or fetcher call arrives as `/products/x.data?_routes=…`.
  // Hydrogen's handlers match on `request.url` and know nothing about `.data`, so
  // they get a copy at the normalized location (the `?variant=` redirect and the
  // Shopify URL-redirect lookup must keep working for SPA navigations). Document
  // requests and direct fetches (/api/cart) are the same object either way. The
  // copy deliberately carries no body: `new Request(url, request)` would lock the
  // stream, and the fetcher POST to /api/subscribe still has to read it.
  const shopifyRequest =
    request.url === url.href
      ? request
      : new Request(url, { method: request.method, headers: request.headers });

  const storefrontClient = createRequestStorefrontClient(
    shopifyRequest,
    context.env,
    context.cache,
    context.waitUntil
  );
  const requestContext = storefrontClient.requestContext;

  // Decided synchronously: a Promise<Response> for handler-owned paths, else null.
  const shopifyRoute = handleShopifyRoutes({
    request: shopifyRequest,
    requestContext,
    storefrontClient,
    routeTemplates,
    handlers: [cartHandlers],
  });
  if (shopifyRoute) return await shopifyRoute;

  context.set(storefrontClientContext, storefrontClient);

  const response = await next();
  if (response.status === 404) {
    const redirect = await handleShopifyRedirects({
      request: shopifyRequest,
      storefrontClient,
      routeTemplates,
    });
    if (redirect) return redirect;
  }
  requestContext.applyResponseHeaders(response.headers);
  return response;
};
