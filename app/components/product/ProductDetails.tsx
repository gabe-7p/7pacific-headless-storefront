import { Heading } from '~/components/common/Heading';
import { Scroller } from '~/components/common/Scroller';
import { SectionHeader } from '~/components/common/SectionHeader';
import { PdpSection } from '~/components/product/PdpSection';
import type { ProductDetailCard } from '~/lib/productContent';

const DetailCard = ({ card }: { card: ProductDetailCard }) => (
  <div>
    {/* Live crops these portrait — 32:45 on mobile, 5:6 (500x600) from 769px up
        (its breakpoint, not Tailwind's `lg`). A square crop cut the legs and
        waistband out of the compositions. */}
    <img
      src={card.imageUrl}
      alt=""
      loading="lazy"
      className="aspect-[32/45] w-full object-cover min-[769px]:aspect-[5/6]"
    />
    <Heading as="h3" variant="caps" size="none" className="mt-3 text-sm">
      {card.caption}
    </Heading>
    <p className="mt-1 text-sm text-support-night">{card.subcaption}</p>
  </div>
);

/**
 * "PRODUCT DETAILS" — dark section of image cards (caption + subcaption),
 * three per view on desktop and a swipe carousel on mobile. Mirrors the live
 * section; rendered only for products that have detail cards.
 */
export const ProductDetails = ({ cards }: { cards: ReadonlyArray<ProductDetailCard> }) => (
  <PdpSection>
    <SectionHeader heading="Product Details" scale="panel" />
    {/* Live styles this gallery's scrollbar so it's always visible (8px,
        white/10 track, white/30 thumb) — not the macOS overlay bar that only
        appears mid-scroll. Styling the -webkit pseudos opts out of overlay
        scrollbars in Chrome/Safari, exactly as live does. */}
    <Scroller className="[&::-webkit-scrollbar]:h-2 [&::-webkit-scrollbar-track]:bg-white/10 [&::-webkit-scrollbar-thumb]:bg-white/30">
      {cards.map((card) => (
        <DetailCard key={card.caption} card={card} />
      ))}
    </Scroller>
  </PdpSection>
);
