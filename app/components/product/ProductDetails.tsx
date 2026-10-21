import { Image } from '@shopify/hydrogen';

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
    {/* Sized and cropped by the CDN (`aspectRatio` + `crop`), never by the
        browser: the shoot's 20-megapixel knit close-ups alias into visible
        wave bands when a browser shrinks them 6x to a card, and no upload
        size fixes that. `sizes` mirrors the Scroller's 3-up basis, and the
        100px srcset steps keep any remaining browser scaling under ~10%
        (Hydrogen's 200px default left a 15% shrink that still showed). */}
    <Image
      src={card.imageUrl}
      alt=""
      aspectRatio="5/6"
      crop="center"
      srcSetOptions={{
        intervals: 16,
        startingWidth: 400,
        incrementSize: 100,
        placeholderWidth: 100,
      }}
      sizes="(min-width: 1024px) min(calc((100vw - 6rem) / 3), 435px), (min-width: 640px) 45vw, 78vw"
      className="aspect-[32/45] w-full object-cover impulse:aspect-[5/6]"
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
