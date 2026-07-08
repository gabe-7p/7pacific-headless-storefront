import { Scroller } from '~/components/common/Scroller';
import { SectionHeader } from '~/components/common/SectionHeader';
import { PdpSection } from '~/components/product/PdpSection';
import type { ProductDetailCard } from '~/lib/productContent';

const DetailCard = ({ card }: { card: ProductDetailCard }) => (
  <div>
    <img src={card.imageUrl} alt="" loading="lazy" className="aspect-square w-full object-cover" />
    <h3 className="mt-3 text-sm font-bold tracking-wide uppercase">{card.caption}</h3>
    <p className="mt-1 text-sm text-white/70">{card.subcaption}</p>
  </div>
);

/**
 * "PRODUCT DETAILS" — dark section of image cards (caption + subcaption),
 * three per view on desktop and a swipe carousel on mobile. Mirrors the live
 * section; rendered only for products that have detail cards.
 */
export const ProductDetails = ({ cards }: { cards: ReadonlyArray<ProductDetailCard> }) => (
  <PdpSection>
    <SectionHeader heading="Product Details" />
    <Scroller>
      {cards.map((card) => (
        <DetailCard key={card.caption} card={card} />
      ))}
    </Scroller>
  </PdpSection>
);
