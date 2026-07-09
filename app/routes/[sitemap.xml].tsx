import { getSitemapIndex } from '@shopify/hydrogen';

import type { Route } from './+types/[sitemap.xml]';

/**
 * Resource types advertised in the sitemap. Deliberately excludes
 * blogs/articles (no blog on this site — those routes were removed) and
 * metaObjects — every URL emitted here must resolve. Keep in sync with
 * sitemap.$type.$page[.xml].tsx.
 */
export const SITEMAP_TYPES = ['products', 'pages', 'collections'] as const;

export async function loader({ request, context: { storefront } }: Route.LoaderArgs) {
  const response = await getSitemapIndex({
    storefront,
    request,
    types: [...SITEMAP_TYPES],
  });

  response.headers.set('Cache-Control', `max-age=${60 * 60 * 24}`);

  return response;
}
