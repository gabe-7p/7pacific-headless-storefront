import { createShopifyRouteTemplates } from '@shopify/hydrogen';

/**
 * Where Shopify's own URL shapes map onto this app's routes. Passed to
 * `handleShopifyRoutes`, `handleShopifyRedirects` and `ShopifyScripts` so
 * handler-owned URLs, redirect targets and agent-resolved links agree.
 * Only non-default shapes need listing.
 */
export const routeTemplates = createShopifyRouteTemplates({
  // Products never nest under a collection path on this storefront.
  productInCollection: '/products/:productHandle',
});
