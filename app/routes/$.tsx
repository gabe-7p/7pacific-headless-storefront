import type { Route } from './+types/$';

/**
 * The catch-all. A 404 here reaches the root middleware, which checks
 * Shopify's URL redirect table (legacy Liquid paths → new routes, /admin)
 * before the NotFound page renders.
 */
export async function loader(_args: Route.LoaderArgs) {
  throw new Response('Not Found', { status: 404 });
}

const CatchAllPage = () => null;

export default CatchAllPage;
