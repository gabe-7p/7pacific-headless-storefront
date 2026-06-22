import type { ProductCardFragment } from 'storefrontapi.generated';

import { Container } from '~/components/common/Container';
import { ProductGrid } from '~/components/common/ProductGrid';
import { SectionHeading } from '~/components/common/SectionHeading';
import { HOME_FIRST_DROP } from '~/content/home';

/**
 * "Our First Drop" — heading + the summer-25 product grid. Mirrors the live
 * `main-collection` section; renders the typed products the loader fetched.
 */
export const FirstDrop = ({ products }: { products: ReadonlyArray<ProductCardFragment> }) => (
  <Container className="py-14 md:py-20">
    <SectionHeading title={HOME_FIRST_DROP.heading} subtitle={HOME_FIRST_DROP.subtitle} />
    <ProductGrid products={products} />
  </Container>
);
