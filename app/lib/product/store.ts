import { createProductComponents } from '@shopify/hydrogen/react';

import type { ProductPageData, ProductVariantData } from '~/lib/product/queries';
import { productUrl } from '~/lib/urls';

/**
 * The product-form store for the PDP: `ProductProvider` holds the loader's
 * product, `useProductForm` gives the option state, the selected variant and
 * the add-to-cart form bindings. Option clicks resolve client-side against
 * `adjacentVariants` / the encoded variant fields — no loader round-trip.
 */
export const { ProductProvider, useProductForm } = createProductComponents<ProductPageData>();

/**
 * The variant the page renders (and reports as viewed). `ProductProvider`
 * re-hydrates its store one render late, so between color siblings the store
 * still holds the previous product's variant. Until it catches up, the
 * loader's own selection is the truth. Always read the variant through this
 * (see common-pitfalls.md).
 */
export const resolveSelectedVariant = <TVariant extends Pick<ProductVariantData, 'id' | 'product'>>(
  formVariant: TVariant | null | undefined,
  product: { handle: string; selectedOrFirstAvailableVariant: TVariant | null }
): TVariant | null =>
  formVariant && formVariant.product.handle === product.handle
    ? formVariant
    : product.selectedOrFirstAvailableVariant;

/** What `selectionTarget` reads from the store's `onSelect` result. */
type SelectionResult = {
  status: 'resolved' | 'unresolved';
  selectedOptions: ReadonlyArray<{ name: string; value: string }>;
  selectedVariant?: { product?: { handle: string } | null } | null;
};

/**
 * Where a size click goes: the URL for the selection, keeping unrelated params
 * (`?utm_source=…`) from `currentSearch`. `skipRevalidate` is true for a
 * selection the store resolved, because the page already holds that variant;
 * an unresolved one needs the loader.
 */
export const selectionTarget = (
  result: SelectionResult,
  fallbackHandle: string,
  currentSearch: string
) => ({
  to: productUrl(
    result.selectedVariant?.product?.handle ?? fallbackHandle,
    result.selectedOptions,
    new URLSearchParams(currentSearch)
  ),
  skipRevalidate: result.status === 'resolved',
});
