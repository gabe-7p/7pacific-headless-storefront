import { Suspense } from 'react';
import { Await } from 'react-router';
import type { RelatedProductsQuery } from 'storefrontapi.generated';

import { ProductCard } from '~/components/collection/ProductCard';
import { Container } from '~/components/common/Container';
import { Heading } from '~/components/common/Heading';

/**
 * "Planning to sweat more?" — up to three related products (live
 * `related-products` section). Config-driven from the summer-25 collection,
 * excluding the current product (Recommendations API a later option).
 */
export const RelatedProducts = ({
  products,
  currentHandle,
}: {
  products: Promise<RelatedProductsQuery | null>;
  currentHandle: string;
}) => {
  return (
    <Container className="py-14 md:py-20">
      <div className="mb-8 text-center">
        <Heading as="h2" size="lg">
          Planning to sweat more?
        </Heading>
        <p className="mt-2 text-sm text-neutral-600">
          Shop more of what you need to get you through those sessions.
        </p>
      </div>
      <Suspense fallback={null}>
        <Await resolve={products}>
          {(data) => {
            const items = (data?.products.nodes ?? [])
              .filter((product) => product.handle !== currentHandle)
              .slice(0, 3);
            if (items.length === 0) return null;
            return (
              <div className="grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3">
                {items.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            );
          }}
        </Await>
      </Suspense>
    </Container>
  );
};
