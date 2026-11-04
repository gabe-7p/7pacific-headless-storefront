import { ProductCard } from '~/components/collection/ProductCard';
import { Container } from '~/components/common/Container';
import { SectionHeader } from '~/components/common/SectionHeader';
import { HOME_FIRST_DROP } from '~/content/home';
import type { ProductCardData } from '~/lib/fragments';

/**
 * "The Starting Lineup" — heading + the full-catalog product grid, in the
 * order of the manual homepage collection (HANDLES.homepageCollection).
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
        Tailwind's lg — the cards hold their proportions well below 1024. */}
    <div className="grid grid-cols-2 gap-x-4 gap-y-10 impulse:grid-cols-3">
      {products.map((product, index) => (
        // Eager-load the first visible row (2 on mobile, 3 on desktop) so the
        // grid paints on load; the rest lazy-load on scroll.
        <ProductCard key={product.id} product={product} priority={index < 3} />
      ))}
    </div>
  </Container>
);
