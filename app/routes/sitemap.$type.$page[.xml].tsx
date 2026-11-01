import { CACHE_ONE_DAY, notFound } from '~/lib/http';
import { getSitemap, isSitemapType } from '~/lib/sitemap';
import { storefrontClientContext } from '~/lib/storefront';

import type { Route } from './+types/sitemap.$type.$page[.xml]';

export async function loader({ request, params, context }: Route.LoaderArgs) {
  const page = Number.parseInt(params.page ?? '', 10);
  // Only emit child sitemaps for types whose URLs resolve on this storefront.
  if (!params.type || !isSitemapType(params.type) || !Number.isInteger(page) || page < 1) {
    throw notFound('Sitemap not found');
  }

  const response = await getSitemap(context.get(storefrontClientContext), {
    type: params.type,
    page,
    baseUrl: new URL(request.url).origin,
  });
  response.headers.set('Cache-Control', CACHE_ONE_DAY);
  return response;
}
