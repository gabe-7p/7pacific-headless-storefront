import { Cache, gql } from '@shopify/hydrogen';

import { CACHE_ONE_DAY } from '~/lib/http';
import { storefrontClientContext } from '~/lib/storefront';

import type { Route } from './+types/[robots.txt]';

export async function loader({ url, context }: Route.LoaderArgs) {
  const { data } = await context
    .get(storefrontClientContext)
    .graphql(ROBOTS_QUERY, { cache: Cache.long() });

  // The numeric id out of `gid://shopify/Shop/123` — the checkout paths use it.
  const shopId = data?.shop.id.split('/').pop();
  const body = robotsTxtData({ url: url.origin, shopId });

  return new Response(body, {
    status: 200,
    headers: {
      'Content-Type': 'text/plain',
      'Cache-Control': CACHE_ONE_DAY,
    },
  });
}

function robotsTxtData({ url, shopId }: { shopId?: string; url?: string }) {
  const sitemapUrl = url ? `${url}/sitemap.xml` : undefined;
  const llmsUrl = url ? `${url}/llms.txt` : undefined;

  return `
${llmsUrl ? `# LLM-readable site summary (llms.txt): ${llmsUrl}` : ''}
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
 * Disallow rules that follow Shopify's Online Store defaults, minus rules for
 * URLs this storefront can't produce: no /blogs, /search or /policies routes,
 * no collection sort/filter params (the collection page renders the
 * merchandised order), plus `/api/` (cart/proxy/MCP endpoints are not pages).
 */
function generalDisallowRules({ shopId, sitemapUrl }: { shopId?: string; sitemapUrl?: string }) {
  return `Disallow: /admin
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
${sitemapUrl ? `Sitemap: ${sitemapUrl}` : ''}`;
}

const ROBOTS_QUERY = gql(`
  query StoreRobots {
    shop {
      id
    }
  }
`);
