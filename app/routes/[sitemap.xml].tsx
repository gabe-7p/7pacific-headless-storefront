import { getSitemapIndex } from '@shopify/hydrogen';

import { CACHE_ONE_DAY } from '~/lib/http';

import type { Route } from './+types/[sitemap.xml]';

/**
 * Resource types advertised in the sitemap. Deliberately excludes
 * blogs/articles (the journal lives at /journal/<handle>, not the /blogs/…
 * shape this helper emits, so its URLs would 404) and metaObjects — every URL
 * emitted here must resolve. Keep in sync with
 * sitemap.$type.$page[.xml].tsx.
 */
export const SITEMAP_TYPES = ['products', 'pages', 'collections'] as const;

export async function loader({ request, context: { storefront } }: Route.LoaderArgs) {
  const response = await getSitemapIndex({
    storefront,
    request,
    types: [...SITEMAP_TYPES],
  });

  response.headers.set('Cache-Control', CACHE_ONE_DAY);

  return response;
}
