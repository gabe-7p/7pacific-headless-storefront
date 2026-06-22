/**
 * Shopify asset helpers — the single source for the store's Files CDN base.
 * Section/marketing imagery (hero, videos, photography) lives in Shopify Files;
 * reference it via `fileUrl('name.jpg')` so the store path is defined once.
 *
 * (Product/collection images still come from the Storefront API and render with
 * Hydrogen's `<Image>` — this is only for theme/brand assets referenced by name.)
 */
export const SHOPIFY_FILES_CDN = 'https://cdn.shopify.com/s/files/1/0686/3988/3581/files';

/** `fileUrl('hero.jpg')` → full Shopify Files CDN URL. */
export const fileUrl = (name: string) => `${SHOPIFY_FILES_CDN}/${name}`;
