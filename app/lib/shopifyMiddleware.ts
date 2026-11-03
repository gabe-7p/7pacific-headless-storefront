import { handleShopifyRedirects, handleShopifyRoutes } from '@shopify/hydrogen';

import { cartHandlers } from '~/lib/cart.server';
import { oxygenContext } from '~/lib/oxygen';
import {
  createRequestStorefrontClient,
  routeTemplates,
  storefrontClientContext,
} from '~/lib/storefront';

import type { Route } from '../+types/root';

/**
 * The root middleware: Hydrogen's request lifecycle, wired (docs/architecture.md →
 * "Request & data flow"). `applyResponseHeaders` MUST run on every app response
 * or consent and checkout continuity break.
 */
export const shopifyMiddleware: Route.MiddlewareFunction = async (
  { context, request, url },
  next
) => {
  // React Router 8 hands us the raw request (ADR 0012): a client-side navigation
  // or fetcher call arrives as `/products/x.data?_routes=…`. Hydrogen's handlers
  // match on `request.url` and know nothing about `.data`, so they get a copy at
  // the normalized location (the `?variant=` redirect and the Shopify
  // URL-redirect lookup must keep working for SPA navigations). The copy
  // deliberately carries no body: `new Request(url, request)` would lock the
  // stream, and the fetcher POST to /api/subscribe still has to read it.
  const shopifyRequest =
    request.url === url.href
      ? request
      : new Request(url, { method: request.method, headers: request.headers });

  const { env, cache, waitUntil } = context.get(oxygenContext);
  const storefrontClient = createRequestStorefrontClient(shopifyRequest, env, cache, waitUntil);
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
