import type { ProductCardFragment } from 'storefrontapi.generated';

import { ProductCard } from '~/components/collection/ProductCard';
import { Container } from '~/components/common/Container';
import { SectionHeader } from '~/components/common/SectionHeader';
import { HOME_FIRST_DROP } from '~/content/home';

/**
 * "Our First Drop" — heading + the full-catalog product grid. Mirrors the live
 * `main-collection` section; renders the typed products the loader fetched
 * (all live products, ordered by HOME_FIRST_DROP.productOrder).
 */
export const FirstDrop = ({ products }: { products: ReadonlyArray<ProductCardFragment> }) => (
  <Container className="py-14 md:py-20">
    <SectionHeader
      heading={HOME_FIRST_DROP.heading}
      subtitle={HOME_FIRST_DROP.subtitle}
      align="center"
    />
    <div className="grid grid-cols-2 gap-x-4 gap-y-10 lg:grid-cols-3">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  </Container>
);
