import { Link } from 'react-router';

import { Heading } from '~/components/common/Heading';
import { Image } from '~/components/common/Image';
import { Price } from '~/components/common/Price';
import { SpecLine } from '~/components/common/SpecLine';
import { ColorSwatches } from '~/components/product/ColorSwatches';
import { EditionTag } from '~/components/product/EditionTag';
import type { ProductCardData } from '~/lib/fragments';
import { IMAGE_SIZES } from '~/lib/imageSizes';
import { getColorSwatches } from '~/lib/product/colors';
import { getShortTitle } from '~/lib/product/display';
import { productUrl } from '~/lib/urls';

/** The one card shape: a 4:5 portrait. */
const CARD_ASPECT_RATIO = '4/5';

type ProductCardProps = {
  product: ProductCardData;
  /** Optional badge text (e.g. the `theme.label` metafield, "Sold out"). */
  label?: string | null;
  /** Eager-load the featured image (for above-the-fold cards). Default lazy. */
  priority?: boolean;
  /** The grid's slot width for the image candidates. Default: 2-up mobile / 3-up desktop. */
  sizes?: string;
};

/**
 * Grid product card. On hover the product's second image crossfades in and
 * the color swatches rise from the bottom edge of the image one-by-one (left to right),
 * each with a color-name tooltip and linking to its sibling color product.
 * Renders the typed `ProductCardData` it's given.
 */
export const ProductCard = ({
  product,
  label,
  priority = false,
  sizes = IMAGE_SIZES.card,
}: ProductCardProps) => {
  const { handle, title, featuredImage, priceRange } = product;
  // Second Shopify image crossfades in on hover (live's product-image-hover).
  const hoverImage = product.images.nodes[1];
  const to = productUrl(handle);

  // The signature two-line device (7PA-234): short name + mono strip.
  // The product's own color name comes from its entry in the sibling list.
  const swatches = getColorSwatches(product.colorSiblings);
  const colorName = swatches.find((swatch) => swatch.handle === handle)?.name;
  const shortTitle = getShortTitle(title, colorName);

  return (
    // The card itself stays put on hover (no lift, shadow or scale): only the
    // photo swap and the swatch rise move.
    <div className="group flex flex-col">
      <div className="relative overflow-hidden bg-field">
        <Link to={to} prefetch="intent" className="block" aria-label={title}>
          {label && (
            // 8px: a one-off, below the type scale, for a badge on the card image.
            <span className="absolute top-0 right-0 z-10 bg-field-night px-1.5 py-0.5 text-[8px] font-semibold tracking-wide text-ink-night uppercase">
              {label}
            </span>
          )}
          {/* Every card is a 4:5 portrait whatever the source photo's shape,
              so a grid row lines up. The ratio goes through `aspectRatio`, not
              an `aspect-*` class: Image's inline ratio beats any utility, and
              this way the CDN crops each candidate to 4:5 as well. */}
          {featuredImage && (
            <Image
              data={featuredImage}
              sizes={sizes}
              aspectRatio={CARD_ASPECT_RATIO}
              crop="center"
              loading={priority ? 'eager' : 'lazy'}
              className="w-full object-cover"
            />
          )}
          {hoverImage && (
            // Eager like live: a lazy hover image can still be mid-fetch/decode
            // on first hover, which reads as flicker instead of a crossfade.
            <Image
              data={hoverImage}
              sizes={sizes}
              aspectRatio={CARD_ASPECT_RATIO}
              crop="center"
              loading="eager"
              className="absolute inset-0 size-full object-cover opacity-0 transition-opacity duration-300 group-hover:opacity-100"
            />
          )}
        </Link>
        {/* Swatch overlay at the image's bottom edge — a sibling of the image
            link (nested anchors are invalid HTML). Slides up on card hover;
            the swatches themselves cascade in via ColorSwatches. */}
        <div className="absolute right-0 bottom-0 left-0 flex translate-y-[110%] justify-start px-2.5 py-1.5 transition-transform duration-200 group-hover:-translate-y-[2%]">
          <ColorSwatches swatches={swatches} currentHandle={handle} cascade alwaysRender />
        </div>
      </div>

      <div className="mt-1.5 flex flex-col gap-0.5">
        {/* Line 1 — product-name tier (Heading brand variant): derived short
            name (no raw "- COLOR" / "//" strings). */}
        <Heading as="h3" size="none" className="text-lg leading-[1.15] tracking-product">
          <Link to={to} prefetch="intent">
            {shortTitle}
          </Link>
        </Heading>
        {/* Line 2 — the mono spec strip: middle dots (never slash/pipe as a
            separator), Graphite (`text-support`), price lives here in mono.
            The edition device leads it. */}
        <SpecLine as="span" size="strip" className="text-support">
          <EditionTag
            number={product.editionNumber?.value}
            status={product.editionStatus?.value}
            variant="strip"
          />
          {product.editionNumber?.value ? ' · ' : ''}
          {colorName ? `${colorName} · ` : ''}
          <Price data={priceRange.minVariantPrice} variant="compact" />
        </SpecLine>
      </div>
    </div>
  );
};
