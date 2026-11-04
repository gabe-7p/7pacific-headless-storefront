import { type RouteConfig } from '@react-router/dev/routes';
import { flatRoutes } from '@react-router/fs-routes';

// Flat file routes only (Shopify-owned URLs: module-boundaries.md).
// Route tests sit beside their route (`api.subscribe.test.ts`) and must not
// become routes themselves — or the build sees a client route importing
// server-only modules.
export default [
  ...(await flatRoutes({ ignoredRouteFiles: ['**/*.test.{ts,tsx}'] })),
] satisfies RouteConfig;
