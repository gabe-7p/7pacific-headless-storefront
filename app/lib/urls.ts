import type { SelectedOption } from '@shopify/hydrogen/storefront-api-types';

/**
 * The app's URL shapes, each built in exactly one place. Routes, the sitemap,
 * content links and the cart all go through these so a path change (or a
 * handle change in Shopify, via content/links.ts) is one edit, not a hunt
 * through template literals.
 */

/**
 * The one product-URL builder: `/products/<handle>`, plus the selected
 * options as search params so a sibling-color link or a cart line keeps the
 * shopper's size (color = separate product, so a color change is a navigation).
 */
export const productUrl = (
  handle: string,
  selectedOptions?: ReadonlyArray<Pick<SelectedOption, 'name' | 'value'>>
): string => {
  const params = new URLSearchParams();
  selectedOptions?.forEach((option) => params.set(option.name, option.value));
  const query = params.toString();
  return `/products/${handle}${query ? `?${query}` : ''}`;
};

/** `/collections/<handle>` — a collection page. */
export const collectionUrl = (handle: string): string => `/collections/${handle}`;

/** `/pages/<handle>` — a Shopify page (or a route that shadows one, like our-story). */
export const pageUrl = (handle: string): string => `/pages/${handle}`;

/** `/journal` (the index) or `/journal/<handle>` (an article). */
export const journalUrl = (articleHandle?: string): string =>
  articleHandle ? `/journal/${articleHandle}` : '/journal';

/** `/cart` — the full-page cart (the drawer is the primary surface). */
export const cartUrl = (): string => '/cart';

/**
 * A YouTube watch URL, optionally starting `startSeconds` in.
 */
export const youtubeWatchUrl = (videoId: string, startSeconds?: number): string =>
  `https://www.youtube.com/watch?v=${videoId}${startSeconds ? `&t=${startSeconds}s` : ''}`;

/**
 * Shopify menu items carry absolute URLs on the store's domains; strip those
 * to a path so they route client-side. External URLs pass through untouched.
 */
export const toInternalPath = (
  itemUrl: string,
  { publicStoreDomain, primaryDomainUrl }: { publicStoreDomain: string; primaryDomainUrl: string }
) =>
  itemUrl.includes('myshopify.com') ||
  itemUrl.includes(publicStoreDomain) ||
  itemUrl.includes(primaryDomainUrl)
    ? new URL(itemUrl).pathname
    : itemUrl;
