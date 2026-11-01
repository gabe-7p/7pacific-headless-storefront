import { createProductComponents } from '@shopify/hydrogen/react';

import type { ProductData, ProductVariantData } from '~/lib/product/queries';

/**
 * The product-form store for the PDP: `ProductProvider` holds the loader's
 * product, `useProductForm` gives the option state, the selected variant and
 * the add-to-cart form bindings. Option clicks resolve client-side against
 * `adjacentVariants` / the encoded variant fields — no loader round-trip.
 * (Type-only import above: the queries never reach the browser bundle.)
 */
export const { ProductProvider, useProductForm } = createProductComponents<ProductData>();

/**
 * The variant the page renders (and reports as viewed). `ProductProvider`
 * re-hydrates its store in an effect *after* the loader hands it a new
 * product, so for one render a client-side navigation between color siblings
 * pairs the new product with the previous product's variant — the PDP showed
 * the old price for a frame and published `product_viewed` twice per swatch
 * click, the first with mismatched ids. Until the store has caught up (its
 * variant belongs to another product), the loader's own selection is the
 * truth; it already honours the URL's selected options.
 */
export const resolveSelectedVariant = (
  formVariant: ProductVariantData | null | undefined,
  product: Pick<ProductData, 'handle' | 'selectedOrFirstAvailableVariant'>
): ProductVariantData | null =>
  formVariant && formVariant.product.handle === product.handle
    ? formVariant
    : product.selectedOrFirstAvailableVariant;
