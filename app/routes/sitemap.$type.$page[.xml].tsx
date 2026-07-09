import { getSitemap } from '@shopify/hydrogen';

import { notFound } from '~/lib/http';

import { SITEMAP_TYPES } from './[sitemap.xml]';
import type { Route } from './+types/sitemap.$type.$page[.xml]';

export async function loader({ request, params, context: { storefront } }: Route.LoaderArgs) {
  // Only emit child sitemaps for types whose URLs actually resolve — a
  // /sitemap/blogs/1.xml full of 404ing /blogs/... URLs is worse than none.
  if (!SITEMAP_TYPES.includes(params.type as (typeof SITEMAP_TYPES)[number])) {
    throw notFound('Sitemap not found');
  }

  const response = await getSitemap({
    storefront,
    request,
    params,
    // English/US only — no localized URL variants exist.
    getLink: ({ type, baseUrl, handle }) => `${baseUrl}/${type}/${handle}`,
  });

  response.headers.set('Cache-Control', `max-age=${60 * 60 * 24}`);

  return response;
}
