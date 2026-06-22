import type { ProductCardFragment } from 'storefrontapi.generated';

import { ProductCard } from '~/components/collection/ProductCard';
import { cn } from '~/lib/cn';

/** Shared product-grid layout (2 cols → 3 at md). Used by the collection page,
 * homepage drop, and related products so the grid lives in one place. */
export const PRODUCT_GRID_CLASS = 'grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3';

export const ProductGrid = ({
  products,
  className,
}: {
  products: ReadonlyArray<ProductCardFragment>;
  className?: string;
}) => (
  <div className={cn(PRODUCT_GRID_CLASS, className)}>
    {products.map((product) => (
      <ProductCard key={product.id} product={product} />
    ))}
  </div>
);
