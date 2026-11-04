import { getSitemapIndex } from '~/lib/sitemap';
import { storefrontClientContext } from '~/lib/storefront';

import type { Route } from './+types/[sitemap.xml]';

export async function loader({ url, context }: Route.LoaderArgs) {
  return getSitemapIndex(context.get(storefrontClientContext), url.origin);
}
