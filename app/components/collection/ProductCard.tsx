import { Image, Money } from '@shopify/hydrogen';
import { Link } from 'react-router';
import type { ProductCardFragment } from 'storefrontapi.generated';

import { Heading } from '~/components/common/Heading';
import { ColorSwatches } from '~/components/product/ColorSwatches';
import { EditionTag } from '~/components/product/EditionTag';
import { getColorSwatches } from '~/lib/colors';
import { getShortTitle } from '~/lib/productDisplay';

type ProductCardProps = {
  product: ProductCardFragment;
  /** Optional badge text (e.g. the `theme.label` metafield, "Sold out"). */
  label?: string | null;
  /** Responsive `sizes` hint for the image. */
  imageSizes?: string;
  /** Eager-load the featured image (for above-the-fold cards). Default lazy. */
  priority?: boolean;
};

/**
 * Grid product card, matching the live card's hover ensemble: the card lifts
 * with a shadow, the product's second image crossfades in, and the color
 * swatches rise from the bottom edge of the image one-by-one (left to right),
 * each with a color-name tooltip and linking to its sibling color product.
 * Presentational: renders the typed `ProductCardFragment` it's given and
 * fetches nothing.
 */
export const ProductCard = ({
  product,
  label,
  imageSizes = '(min-width: 768px) 33vw, 50vw',
  priority = false,
}: ProductCardProps) => {
  const { handle, title, featuredImage, priceRange } = product;
  // Second Shopify image crossfades in on hover (live's product-image-hover).
  const hoverImage = product.images.nodes[1];
  const to = `/products/${handle}`;

  // The signature two-line device (7PA-234): short name + mono strip.
  // The product's own color name comes from its entry in the sibling list.
  const swatches = getColorSwatches(product.colorSiblings);
  const colorName = swatches.find((swatch) => swatch.handle === handle)?.name;
  const shortTitle = getShortTitle(title, colorName);

  return (
    // transition-[translate,…], NOT transform: Tailwind v4's -translate-y-*
    // sets the native `translate` property, which a `transform` transition
    // list won't animate (the lift would snap).
    <div className="group flex flex-col transition-[translate,box-shadow] duration-300 hover:-translate-y-1 hover:shadow-[0_4px_8px_rgba(0,0,0,0.3)]">
      <div className="relative overflow-hidden bg-court">
        <Link to={to} prefetch="intent" className="block" aria-label={title}>
          {label && (
            <span className="absolute top-0 right-0 z-10 bg-carbon px-1.5 py-0.5 text-[8px] font-semibold tracking-wide text-court uppercase">
              {label}
            </span>
          )}
          {featuredImage && (
            <Image
              data={featuredImage}
              sizes={imageSizes}
              // Eager-load the first visible row (above the fold) so the grid
              // paints immediately; the rest lazy-load on scroll.
              loading={priority ? 'eager' : 'lazy'}
              className="aspect-square w-full object-cover"
            />
          )}
          {hoverImage && (
            // Eager like live: a lazy hover image can still be mid-fetch/decode
            // on first hover, which reads as flicker instead of a crossfade.
            <Image
              data={hoverImage}
              sizes={imageSizes}
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
            separator), Carbon at 80%, price lives here in mono. The edition
            device (7PA-246) leads it, carrying its own status color. */}
        <span className="text-graphite tracking-spec font-mono text-[11px] uppercase">
          <EditionTag
            number={product.editionNumber?.value}
            status={product.editionStatus?.value}
            className="tracking-spec text-[11px]"
          />
          {product.editionNumber?.value ? ' · ' : ''}
          {colorName ? `${colorName} · ` : ''}
          <Money data={priceRange.minVariantPrice} withoutTrailingZeros as="span" />
        </span>
      </div>
    </div>
  );
};
