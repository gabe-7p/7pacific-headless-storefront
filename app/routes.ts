import { type RouteConfig } from '@react-router/dev/routes';
import { flatRoutes } from '@react-router/fs-routes';

// Flat file routes only. Shopify-owned URLs (/api/cart, /checkout, cart and
// buy permalinks, the Storefront API proxy, …) are answered by
// `handleShopifyRoutes` in the root middleware before the router runs.
// Route tests sit beside their route (`api.subscribe.test.ts`) and must not
// become routes themselves — or the build sees a client route importing
// server-only modules.
export default [
  ...(await flatRoutes({ ignoredRouteFiles: ['**/*.test.{ts,tsx}'] })),
] satisfies RouteConfig;
