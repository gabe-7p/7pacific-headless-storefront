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
