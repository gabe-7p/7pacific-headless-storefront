import { Suspense } from 'react';
import { Await } from 'react-router';
import type { RelatedProductsQuery } from 'storefrontapi.generated';

import { Container } from '~/components/common/Container';
import { ProductGrid } from '~/components/common/ProductGrid';
import { SectionHeading } from '~/components/common/SectionHeading';

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
      <SectionHeading
        title="Planning to sweat more?"
        subtitle="Shop more of what you need to get you through those sessions."
      />
      <Suspense fallback={null}>
        <Await resolve={products}>
          {(data) => {
            const items = (data?.products.nodes ?? [])
              .filter((product) => product.handle !== currentHandle)
              .slice(0, 3);
            if (items.length === 0) return null;
            return <ProductGrid products={items} />;
          }}
        </Await>
      </Suspense>
    </Container>
  );
};
