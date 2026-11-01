import { createProductComponents } from '@shopify/hydrogen/react';

import type { ProductData } from '~/lib/product/queries';

/**
 * The product-form store for the PDP: `ProductProvider` holds the loader's
 * product, `useProductForm` gives the option state, the selected variant and
 * the add-to-cart form bindings. Option clicks resolve client-side against
 * `adjacentVariants` / the encoded variant fields — no loader round-trip.
 * (Type-only import above: the queries never reach the browser bundle.)
 */
export const { ProductProvider, useProductForm } = createProductComponents<ProductData>();
