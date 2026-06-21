import { BRAND } from '~/lib/brand';

/**
 * SEO defaults — single source for the page-title format and fallback meta.
 * Use `pageTitle()` in every route's `meta` so the title format changes in one
 * place.
 */
export const DEFAULT_DESCRIPTION =
  'Lightweight, breathable training gear built for performance. Free shipping on orders over $200.';

/** `pageTitle('Cart')` → "7Pacific | Cart"; `pageTitle()` → "7Pacific". */
export const pageTitle = (title?: string | null) =>
  title ? `${BRAND.name} | ${title}` : BRAND.name;
