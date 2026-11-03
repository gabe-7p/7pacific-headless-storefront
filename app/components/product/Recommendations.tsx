import { ProductCard } from '~/components/collection/ProductCard';
import { Container } from '~/components/common/Container';
import { LazyVideo } from '~/components/common/LazyVideo';
import { SectionHeader } from '~/components/common/SectionHeader';
import { PRODUCT_RECOMMENDATIONS } from '~/content/product-page';
import type { ProductCardData } from '~/lib/fragments';

/**
 * "PLANNING TO SWEAT MORE?" — recommended products (from the current product's
 * custom.recommended_products metafield references, capped at three) as a
 * "style with" spread: a portrait training loop on the left, the cards in a
 * two-column grid on the right (two up top, the third alone below). On
 * mobile the loop leads, then the same two-column grid.
 */
export const Recommendations = ({ products }: { products: ReadonlyArray<ProductCardData> }) => {
  const { heading, subtitle, video } = PRODUCT_RECOMMENDATIONS;
  return (
    <Container className="py-14 md:py-20">
      {/* Live left-aligns this heading and its subtitle at 40px. */}
      <SectionHeader heading={heading} subtitle={subtitle} scale="panel" />
      {/* Capped at 66rem and left-aligned under the heading (Gabe's decision):
          at full width the stretched video box ran past a MacBook viewport.
          At 1440 the 13/12 split and 40px gutter give ~232px cards and a
          ~528×704 video box (ratio 0.75); the right quarter stays empty on
          purpose. */}
      <div className="grid grid-cols-1 gap-4 md:max-w-[66rem] md:grid-cols-[minmax(0,13fr)_minmax(0,12fr)] md:gap-10">
        {/* 4:5 on mobile (the clip is 9:16, so it crops top/bottom); from md
            the box has no ratio of its own and fills the row — the video
            fills it absolutely so its intrinsic 9:16 never sizes the row. */}
        <div className="relative aspect-[4/5] overflow-hidden bg-field-night md:aspect-auto">
          <LazyVideo
            src={video.src}
            poster={video.poster}
            label={video.label}
            className="absolute inset-0 size-full object-cover"
          />
        </div>
        {/* content-start keeps a short grid (three cards → one empty cell)
            pinned to the top so the row height is the cards', not stretched.
            One gap value on both axes so the cards sit on an even grid. */}
        <div className="grid grid-cols-2 content-start gap-4 md:gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </Container>
  );
};
