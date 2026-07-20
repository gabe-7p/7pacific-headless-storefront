import { parseGid } from '@shopify/hydrogen';

import type { Route } from './+types/[robots.txt]';

export async function loader({ request, context }: Route.LoaderArgs) {
  const url = new URL(request.url);

  const { shop } = await context.storefront.query(ROBOTS_QUERY, {
    cache: context.storefront.CacheLong(),
  });

  const shopId = parseGid(shop.id).id;
  const body = robotsTxtData({ url: url.origin, shopId });

  return new Response(body, {
    status: 200,
    headers: {
      'Content-Type': 'text/plain',

      'Cache-Control': `max-age=${60 * 60 * 24}`,
    },
  });
}

function robotsTxtData({ url, shopId }: { shopId?: string; url?: string }) {
  const sitemapUrl = url ? `${url}/sitemap.xml` : undefined;

  return `
User-agent: *
${generalDisallowRules({ sitemapUrl, shopId })}

# Google adsbot ignores robots.txt unless specifically named!
User-agent: adsbot-google
Disallow: /checkouts/
Disallow: /checkout
Disallow: /carts
Disallow: /orders
${shopId ? `Disallow: /${shopId}/checkouts` : ''}
${shopId ? `Disallow: /${shopId}/orders` : ''}
Disallow: /*?*oseid=*
Disallow: /*preview_theme_id*
Disallow: /*preview_script_id*

User-agent: Nutch
Disallow: /

User-agent: AhrefsBot
Crawl-delay: 10
${generalDisallowRules({ sitemapUrl, shopId })}

User-agent: AhrefsSiteAudit
Crawl-delay: 10
${generalDisallowRules({ sitemapUrl, shopId })}

User-agent: MJ12bot
Crawl-Delay: 10

User-agent: Pinterest
Crawl-delay: 1
`.trim();
}

/**
 * This function generates disallow rules that generally follow what Shopify's
 * Online Store has as defaults for their robots.txt — minus rules for URLs
 * this storefront can't produce: no /blogs or /search routes (no blog, no
 * search UI), no /policies routes, and no collection sort/filter params (the
 * collection page renders the merchandised order, unsorted and unfiltered).
 */
function generalDisallowRules({ shopId, sitemapUrl }: { shopId?: string; sitemapUrl?: string }) {
  return `Disallow: /admin
Disallow: /cart
Disallow: /orders
Disallow: /checkouts/
Disallow: /checkout
${shopId ? `Disallow: /${shopId}/checkouts` : ''}
${shopId ? `Disallow: /${shopId}/orders` : ''}
Disallow: /carts
Disallow: /*?*oseid=*
Disallow: /*preview_theme_id*
Disallow: /*preview_script_id*
Disallow: /*/*?*ls=*&ls=*
Disallow: /*/*?*ls%3D*%3Fls%3D*
Disallow: /*/*?*ls%3d*%3fls%3d*
Disallow: /apple-app-site-association
Disallow: /.well-known/shopify/monorail
${sitemapUrl ? `Sitemap: ${sitemapUrl}` : ''}`;
}

const ROBOTS_QUERY = `#graphql
  query StoreRobots($country: CountryCode, $language: LanguageCode)
   @inContext(country: $country, language: $language) {
    shop {
      id
    }
  }
` as const;
