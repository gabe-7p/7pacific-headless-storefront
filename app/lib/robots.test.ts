import { describe, expect, it, vi } from 'vitest';

import { getRobotsTxt } from '~/lib/robots';
import type { StorefrontClient } from '~/lib/storefront';

const ORIGIN = 'https://7pacificapparel.com';

const clientWith = (shopId: string | null) =>
  ({
    graphql: vi.fn(async () => ({ data: shopId ? { shop: { id: shopId } } : null })),
  }) as unknown as StorefrontClient;

describe('getRobotsTxt', () => {
  it('points at the sitemap and llms.txt and keeps the API out of the index', async () => {
    const response = await getRobotsTxt(clientWith('gid://shopify/Shop/123'), ORIGIN);
    const body = await response.text();
    expect(response.headers.get('Content-Type')).toBe('text/plain');
    expect(response.headers.get('Cache-Control')).toBe('max-age=86400');
    expect(body).toContain(`Sitemap: ${ORIGIN}/sitemap.xml`);
    expect(body).toContain(`${ORIGIN}/llms.txt`);
    expect(body).toContain('Disallow: /api/');
    expect(body).toContain('# Google adsbot ignores robots.txt unless specifically named!');
  });

  it('carries the numeric shop id on the checkout paths', async () => {
    const body = await (await getRobotsTxt(clientWith('gid://shopify/Shop/123'), ORIGIN)).text();
    expect(body).toContain('Disallow: /123/checkouts');
    expect(body).toContain('Disallow: /123/orders');
  });

  it('omits the shop-id paths when the shop query returns nothing', async () => {
    const body = await (await getRobotsTxt(clientWith(null), ORIGIN)).text();
    expect(body).not.toContain('/checkouts\nDisallow: //');
    expect(body).not.toMatch(/Disallow: \/\d+\/checkouts/);
    expect(body).toContain('Disallow: /checkouts/');
  });
});
