import { describe, expect, it, vi } from 'vitest';

import { getSitemap, getSitemapIndex, isSitemapType } from '~/lib/sitemap';
import type { StorefrontClient } from '~/lib/storefront';

const BASE_URL = 'https://7pacificapparel.com';

type Counts = { products: number; collections: number; pages: number; articles: number };

/**
 * A `StorefrontClient` whose `graphql` answers by operation name (a `gql()`
 * document is its query string). `resources` is what a page query returns;
 * `counts` drives the index.
 */
const mockClient = ({
  counts = { products: 1, collections: 1, pages: 1, articles: 1 },
  resources = [],
}: {
  counts?: Counts;
  resources?: Array<{ handle: string; updatedAt: string }>;
} = {}) => {
  const articles = Array.from({ length: counts.articles }, (_, index) => ({
    id: `gid://shopify/Article/${index + 1}`,
    handle: `article-${index + 1}`,
    publishedAt: `2026-07-${String(index + 1).padStart(2, '0')}T06:00:00Z`,
  }));
  const graphql = vi.fn(async (document: string) => {
    if (document.includes('query SitemapIndex')) {
      return {
        data: {
          products: { pagesCount: { count: counts.products } },
          collections: { pagesCount: { count: counts.collections } },
          pages: { pagesCount: { count: counts.pages } },
          journal: { articles: { nodes: articles.map(({ id }) => ({ id })) } },
        },
      };
    }
    if (document.includes('query SitemapJournal')) {
      return {
        data: {
          blog: {
            articles: {
              nodes: articles.map(({ handle, publishedAt }) => ({ handle, publishedAt })),
            },
          },
        },
      };
    }
    if (document.includes('query SitemapPage')) {
      return { data: { sitemap: { resources: { items: resources } } } };
    }
    throw new Error(`Unexpected document: ${document.slice(0, 40)}`);
  });
  return { client: { graphql } as unknown as StorefrontClient, graphql };
};

const locs = (body: string) => [...body.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);

describe('getSitemapIndex', () => {
  it('lists one child sitemap per 250-item page of each type', async () => {
    const { client } = mockClient({
      counts: { products: 2, collections: 1, pages: 3, articles: 251 },
    });
    const body = await (await getSitemapIndex(client, BASE_URL)).text();

    expect(locs(body)).toEqual([
      `${BASE_URL}/sitemap/products/1.xml`,
      `${BASE_URL}/sitemap/products/2.xml`,
      `${BASE_URL}/sitemap/collections/1.xml`,
      `${BASE_URL}/sitemap/pages/1.xml`,
      `${BASE_URL}/sitemap/pages/2.xml`,
      `${BASE_URL}/sitemap/pages/3.xml`,
      `${BASE_URL}/sitemap/journal/1.xml`,
      `${BASE_URL}/sitemap/journal/2.xml`,
    ]);
  });

  it('omits a type with nothing to list and serves XML', async () => {
    const { client } = mockClient({
      counts: { products: 1, collections: 0, pages: 0, articles: 0 },
    });
    const response = await getSitemapIndex(client, BASE_URL);

    expect(response.headers.get('Content-Type')).toBe('application/xml');
    expect(locs(await response.text())).toEqual([`${BASE_URL}/sitemap/products/1.xml`]);
  });
});

describe('getSitemap', () => {
  const resources = [
    { handle: 'airrail-6-performance-shorts-midnight', updatedAt: '2026-10-01T00:00:00Z' },
    { handle: 'tracefiber-tee-white', updatedAt: '2026-10-02T00:00:00Z' },
  ];

  it.each([
    ['products', '/products/', 'PRODUCT'],
    ['collections', '/collections/', 'COLLECTION'],
    ['pages', '/pages/', 'PAGE'],
  ] as const)('renders %s under %s with a lastmod per URL', async (type, prefix, apiType) => {
    const { client, graphql } = mockClient({ resources });
    const body = await (await getSitemap(client, { type, page: 1, baseUrl: BASE_URL })).text();

    expect(locs(body)).toEqual(resources.map(({ handle }) => `${BASE_URL}${prefix}${handle}`));
    expect(body).toContain('<lastmod>2026-10-01T00:00:00Z</lastmod>');
    expect(body).toContain('<lastmod>2026-10-02T00:00:00Z</lastmod>');
    expect(graphql).toHaveBeenCalledWith(
      expect.stringContaining('query SitemapPage'),
      expect.objectContaining({ variables: { type: apiType, page: 1 } })
    );
  });

  it('builds the journal page from the blog articles under /journal/', async () => {
    const { client } = mockClient({
      counts: { products: 0, collections: 0, pages: 0, articles: 2 },
    });
    const body = await (
      await getSitemap(client, { type: 'journal', page: 1, baseUrl: BASE_URL })
    ).text();

    expect(locs(body)).toEqual([`${BASE_URL}/journal/article-1`, `${BASE_URL}/journal/article-2`]);
    expect(body).toContain('<lastmod>2026-07-01T06:00:00Z</lastmod>');
  });

  it('escapes XML-significant characters in a URL', async () => {
    const { client } = mockClient({
      resources: [{ handle: 'a&b', updatedAt: '2026-10-01T00:00:00Z' }],
    });
    const body = await (
      await getSitemap(client, { type: 'pages', page: 1, baseUrl: BASE_URL })
    ).text();

    expect(body).toContain(`<loc>${BASE_URL}/pages/a&amp;b</loc>`);
  });
});

describe('isSitemapType', () => {
  it('accepts the four published types and rejects anything else', () => {
    expect(isSitemapType('products')).toBe(true);
    expect(isSitemapType('collections')).toBe(true);
    expect(isSitemapType('pages')).toBe(true);
    expect(isSitemapType('journal')).toBe(true);
    expect(isSitemapType('articles')).toBe(false);
    expect(isSitemapType('blogs')).toBe(false);
    expect(isSitemapType('')).toBe(false);
  });
});
