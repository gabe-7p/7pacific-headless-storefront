import { Cache, gql } from '@shopify/hydrogen';

import type { StorefrontClient } from '~/lib/storefront';

/**
 * Sitemaps, app-owned since Hydrogen 2026.10 (classic's `getSitemapIndex` /
 * `getSitemap` are gone and were typed for the classic client). Same URL
 * shapes as before, plus the journal: the Storefront API's `sitemap` field
 * pages every resource type 250 at a time, so the index advertises one child
 * sitemap per page and each child renders that page.
 */
export const SITEMAP_TYPES = ['products', 'collections', 'pages', 'journal'] as const;
export type SitemapType = (typeof SITEMAP_TYPES)[number];

/** The one blog the journal publishes. The API's ARTICLE sitemap mixes every blog's
    articles with bare handles, so the journal page is built from the blog itself. */
const JOURNAL_BLOG_HANDLE = 'journal';
const SITEMAP_PAGE_SIZE = 250;

const SITEMAP_INDEX_QUERY = gql(`
  query SitemapIndex {
    products: sitemap(type: PRODUCT) {
      pagesCount {
        count
      }
    }
    collections: sitemap(type: COLLECTION) {
      pagesCount {
        count
      }
    }
    pages: sitemap(type: PAGE) {
      pagesCount {
        count
      }
    }
    journal: blog(handle: "journal") {
      articles(first: 250) {
        nodes {
          id
        }
      }
    }
  }
`);

const JOURNAL_SITEMAP_QUERY = gql(`
  query SitemapJournal($blogHandle: String!, $first: Int!) {
    blog(handle: $blogHandle) {
      articles(first: $first, sortKey: PUBLISHED_AT, reverse: true) {
        nodes {
          handle
          publishedAt
        }
      }
    }
  }
`);

const SITEMAP_PAGE_QUERY = gql(`
  query SitemapPage($type: SitemapType!, $page: Int!) {
    sitemap(type: $type) {
      resources(page: $page) {
        items {
          handle
          updatedAt
        }
      }
    }
  }
`);

const SITEMAP_API_TYPE = {
  products: 'PRODUCT',
  collections: 'COLLECTION',
  pages: 'PAGE',
} as const;

const PATH_PREFIX: Record<SitemapType, string> = {
  products: '/products',
  collections: '/collections',
  pages: '/pages',
  journal: '/journal',
};

export const isSitemapType = (value: string): value is SitemapType =>
  (SITEMAP_TYPES as ReadonlyArray<string>).includes(value);

const xml = (body: string) =>
  new Response(`<?xml version="1.0" encoding="UTF-8"?>\n${body}`, {
    headers: { 'Content-Type': 'application/xml' },
  });

const escape = (value: string) =>
  value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

type SitemapItem = { handle: string; lastmod: string };

const resourceItems = async (
  client: StorefrontClient,
  type: Exclude<SitemapType, 'journal'>,
  page: number
): Promise<Array<SitemapItem>> => {
  const { data, errors } = await client.graphql(SITEMAP_PAGE_QUERY, {
    variables: { type: SITEMAP_API_TYPE[type], page },
    cache: Cache.long(),
  });
  if (errors) console.error(errors);
  return (data?.sitemap?.resources?.items ?? []).map(({ handle, updatedAt }) => ({
    handle,
    lastmod: updatedAt,
  }));
};

const journalItems = async (
  client: StorefrontClient,
  page: number
): Promise<Array<SitemapItem>> => {
  const { data, errors } = await client.graphql(JOURNAL_SITEMAP_QUERY, {
    variables: { blogHandle: JOURNAL_BLOG_HANDLE, first: SITEMAP_PAGE_SIZE },
    cache: Cache.long(),
  });
  if (errors) console.error(errors);
  // One page of articles for now; a second page would need cursor pagination.
  if (page !== 1) return [];
  return (data?.blog?.articles.nodes ?? []).map(({ handle, publishedAt }) => ({
    handle,
    lastmod: publishedAt,
  }));
};

/** `/sitemap.xml`: one `<sitemap>` per resource type per 250-item page. */
export const getSitemapIndex = async (client: StorefrontClient, baseUrl: string) => {
  const { data, errors } = await client.graphql(SITEMAP_INDEX_QUERY, { cache: Cache.long() });
  if (errors) console.error(errors);
  if (!data) throw new Response('Sitemap unavailable', { status: 500 });
  // Re-bound after the guard: the narrowing doesn't survive into the callback.
  const counts: NonNullable<typeof data> = data;

  const entries = SITEMAP_TYPES.flatMap((type) => {
    const count =
      type === 'journal'
        ? Math.ceil((counts.journal?.articles.nodes.length ?? 0) / SITEMAP_PAGE_SIZE)
        : (counts[type]?.pagesCount?.count ?? 0);
    return Array.from(
      { length: count },
      (_, index) => `  <sitemap><loc>${baseUrl}/sitemap/${type}/${index + 1}.xml</loc></sitemap>`
    );
  });

  return xml(
    `<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${entries.join('\n')}\n</sitemapindex>`
  );
};

/** `/sitemap/<type>/<page>.xml`: the URLs of one page of one resource type. */
export const getSitemap = async (
  client: StorefrontClient,
  { type, page, baseUrl }: { type: SitemapType; page: number; baseUrl: string }
) => {
  const items = await (type === 'journal'
    ? journalItems(client, page)
    : resourceItems(client, type, page));

  const urls = items.map(
    ({ handle, lastmod }) =>
      `  <url>\n    <loc>${escape(`${baseUrl}${PATH_PREFIX[type]}/${handle}`)}</loc>\n    <lastmod>${lastmod}</lastmod>\n  </url>`
  );

  return xml(
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join('\n')}\n</urlset>`
  );
};
