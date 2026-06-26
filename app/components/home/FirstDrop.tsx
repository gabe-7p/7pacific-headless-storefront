import type { ProductCardFragment } from 'storefrontapi.generated';

import { ProductCard } from '~/components/collection/ProductCard';
import { Container } from '~/components/common/Container';
import { Heading } from '~/components/common/Heading';
import { HOME_FIRST_DROP } from '~/content/home';

/**
 * "Our First Drop" — heading + the summer-25 product grid. Mirrors the live
 * `main-collection` section; renders the typed products the loader fetched.
 */
export const FirstDrop = ({ products }: { products: ReadonlyArray<ProductCardFragment> }) => (
  <Container className="py-14 md:py-20">
    <div className="mb-8 text-center">
      <Heading as="h2" size="lg">
        {HOME_FIRST_DROP.heading}
      </Heading>
      <p className="mt-2 text-sm text-neutral-600">{HOME_FIRST_DROP.subtitle}</p>
    </div>
    <div className="grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  </Container>
);
