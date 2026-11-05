import { Cache, gql } from '@shopify/hydrogen';

import { gidNumericId } from '~/lib/gid';
import { CACHE_ONE_DAY } from '~/lib/http';
import { queryStorefront, type StorefrontClient } from '~/lib/storefront';

export const ROBOTS_QUERY = gql(`
  query StoreRobots {
    shop {
      id
    }
  }
`);

/** A plain-text response with the crawler surfaces' one-day cache. */
const text = (body: string) =>
  new Response(body, {
    status: 200,
    headers: { 'Content-Type': 'text/plain', 'Cache-Control': CACHE_ONE_DAY },
  });

/**
 * Disallow rules that follow Shopify's Online Store defaults, minus rules for
 * URLs this storefront can't produce: no /blogs, /search or /policies routes,
 * no collection sort/filter params (the collection page renders the
 * merchandised order), plus `/api/` (cart/proxy/MCP endpoints are not pages).
 */
const generalDisallowRules = (shopId: string | undefined, sitemapUrl: string) => `Disallow: /admin
Disallow: /api/
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
Sitemap: ${sitemapUrl}`;

/** The robots.txt body for a site origin; `shopId` adds Shopify's per-shop checkout paths. */
const buildRobotsTxt = (origin: string, shopId?: string): string => {
  const sitemapUrl = `${origin}/sitemap.xml`;
  const general = generalDisallowRules(shopId, sitemapUrl);

  return `
# LLM-readable site summary (llms.txt): ${origin}/llms.txt
User-agent: *
${general}

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
${general}

User-agent: AhrefsSiteAudit
Crawl-delay: 10
${general}

User-agent: MJ12bot
Crawl-Delay: 10

User-agent: Pinterest
Crawl-delay: 1
`.trim();
};

/** `/robots.txt`: the shop id (numeric tail of its GID) feeds the checkout paths. */
export const getRobotsTxt = async (client: StorefrontClient, origin: string) => {
  const data = await queryStorefront(client, ROBOTS_QUERY, { cache: Cache.long() });
  return text(buildRobotsTxt(origin, data ? gidNumericId(data.shop.id) : undefined));
};
