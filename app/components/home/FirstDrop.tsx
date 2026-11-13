import { ProductCard } from '~/components/collection/ProductCard';
import { Container } from '~/components/common/Container';
import { SectionHeader } from '~/components/common/SectionHeader';
import { HOME_FIRST_DROP } from '~/content/home';
import type { ProductCardData } from '~/lib/fragments';

/**
 * The homepage product grid (HOME_FIRST_DROP) — the First Light collection
 * first, then the manual homepage collection (HANDLES.homepageCollection) in
 * its admin order, deduped and capped at nine (merged in the _index loader).
 */
export const FirstDrop = ({ products }: { products: ReadonlyArray<ProductCardData> }) => (
  <Container className="py-9 md:py-12">
    <SectionHeader
      heading={HOME_FIRST_DROP.heading}
      subtitle={HOME_FIRST_DROP.subtitle}
      scale="section"
      className="mb-8"
    />
    {/* Three across down to live's Impulse breakpoint (769px) rather than
        Tailwind's lg — the cards hold their proportions well below 1024.
        A hairline gutter so the photos read as one block. */}
    <div className="grid grid-cols-2 gap-x-1 gap-y-6 impulse:grid-cols-3">
      {products.map((product, index) => (
        // Eager-load the first visible row (2 on mobile, 3 on desktop) so the
        // grid paints on load; the rest lazy-load on scroll.
        <ProductCard key={product.id} product={product} priority={index < 3} />
      ))}
    </div>
  </Container>
);
