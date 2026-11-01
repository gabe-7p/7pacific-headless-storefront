import type { SelectedOption } from '@shopify/hydrogen/storefront-api-types';

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
