import { createProductComponents } from '@shopify/hydrogen/react';

import type { ProductData, ProductVariantData } from '~/lib/product/queries';

/**
 * The product-form store for the PDP: `ProductProvider` holds the loader's
 * product, `useProductForm` gives the option state, the selected variant and
 * the add-to-cart form bindings. Option clicks resolve client-side against
 * `adjacentVariants` / the encoded variant fields — no loader round-trip.
 */
export const { ProductProvider, useProductForm } = createProductComponents<ProductData>();

/**
 * The variant the page renders (and reports as viewed). `ProductProvider`
 * re-hydrates its store one render late, so between color siblings the store
 * still holds the previous product's variant. Until it catches up, the
 * loader's own selection is the truth. Always read the variant through this
 * (see common-pitfalls.md).
 */
export const resolveSelectedVariant = (
  formVariant: ProductVariantData | null | undefined,
  product: Pick<ProductData, 'handle' | 'selectedOrFirstAvailableVariant'>
): ProductVariantData | null =>
  formVariant && formVariant.product.handle === product.handle
    ? formVariant
    : product.selectedOrFirstAvailableVariant;
