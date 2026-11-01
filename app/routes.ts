import { type RouteConfig } from '@react-router/dev/routes';
import { flatRoutes } from '@react-router/fs-routes';

// Flat file routes only. Shopify-owned URLs (/api/cart, /checkout, cart and
// buy permalinks, the Storefront API proxy, …) are answered by
// `handleShopifyRoutes` in the root middleware before the router runs.
export default [...(await flatRoutes())] satisfies RouteConfig;
