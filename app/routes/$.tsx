import { storefrontRedirect } from '@shopify/hydrogen';

import type { Route } from './+types/$';

export async function loader({ request, context }: Route.LoaderArgs) {
  const url = new URL(request.url);

  // Honor Shopify's URL redirect table (legacy Liquid paths → new routes) before
  // 404ing. storefrontRedirect returns a 301 Response when a redirect matches.
  const response = await storefrontRedirect({
    request,
    response: new Response(`${url.pathname} not found`, { status: 404 }),
    storefront: context.storefront,
  });

  throw response;
}

const CatchAllPage = () => {
  return null;
};

export default CatchAllPage;
