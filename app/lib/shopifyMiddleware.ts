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
export const shopifyMiddleware: Route.MiddlewareFunction = async ({ context, request }, next) => {
  const storefrontClient = createRequestStorefrontClient(
    request,
    context.env,
    context.cache,
    context.waitUntil
  );
  const requestContext = storefrontClient.requestContext;

  // Decided synchronously: a Promise<Response> for handler-owned paths, else null.
  const shopifyRoute = handleShopifyRoutes({
    request,
    requestContext,
    storefrontClient,
    routeTemplates,
    handlers: [cartHandlers],
  });
  if (shopifyRoute) return await shopifyRoute;

  context.set(storefrontClientContext, storefrontClient);

  const response = await next();
  if (response.status === 404) {
    const redirect = await handleShopifyRedirects({ request, storefrontClient, routeTemplates });
    if (redirect) return redirect;
  }
  requestContext.applyResponseHeaders(response.headers);
  return response;
};
