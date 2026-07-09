import type { ProductCardFragment } from 'storefrontapi.generated';

import { ProductCard } from '~/components/collection/ProductCard';
import { Container } from '~/components/common/Container';
import { Scroller } from '~/components/common/Scroller';
import { SectionHeader } from '~/components/common/SectionHeader';

/**
 * "PLANNING TO SWEAT MORE?" — recommended products (from the current product's
 * custom.recommended_products metafield references), three per view on desktop
 * and a swipe carousel on mobile.
 */
export const Recommendations = ({ products }: { products: ReadonlyArray<ProductCardFragment> }) => (
  <Container className="py-14 md:py-20">
    {/* Live left-aligns this heading and its subtitle at 40px. */}
    <SectionHeader
      heading="Planning To Sweat More?"
      subtitle="Shop more of what you need to get you through those sessions."
      scale="sub"
    />
    <Scroller>
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </Scroller>
  </Container>
);
