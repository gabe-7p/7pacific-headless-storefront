import { CACHE_ONE_DAY } from '~/lib/http';
import { getSitemapIndex } from '~/lib/sitemap';
import { storefrontClientContext } from '~/lib/storefront';

import type { Route } from './+types/[sitemap.xml]';

export async function loader({ url, context }: Route.LoaderArgs) {
  const response = await getSitemapIndex(context.get(storefrontClientContext), url.origin);
  response.headers.set('Cache-Control', CACHE_ONE_DAY);
  return response;
}
