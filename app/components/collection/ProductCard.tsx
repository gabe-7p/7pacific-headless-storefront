import { Image } from '@shopify/hydrogen';
import { Link } from 'react-router';
import type { ProductCardFragment } from 'storefrontapi.generated';

import { Price } from '~/components/common/Price';
import { ColorSwatches } from '~/components/product/ColorSwatches';
import { getColorSwatches } from '~/lib/colors';

type ProductCardProps = {
  product: ProductCardFragment;
  /** Optional badge text (e.g. the `theme.label` metafield, "Sold out"). */
  label?: string | null;
  /** Responsive `sizes` hint for the image. */
  imageSizes?: string;
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
}: ProductCardProps) => {
  const { handle, title, featuredImage, priceRange } = product;
  // Second Shopify image crossfades in on hover (live's product-image-hover).
  const hoverImage = product.images.nodes[1];
  const to = `/products/${handle}`;

  return (
    // transition-[translate,…], NOT transform: Tailwind v4's -translate-y-*
    // sets the native `translate` property, which a `transform` transition
    // list won't animate (the lift would snap).
    <div className="group flex flex-col transition-[translate,box-shadow] duration-300 hover:-translate-y-1 hover:shadow-[0_4px_8px_rgba(0,0,0,0.3)]">
      <div className="relative overflow-hidden bg-neutral-100">
        <Link to={to} prefetch="intent" className="block" aria-label={title}>
          {label && (
            <span className="absolute top-0 right-0 z-10 bg-black px-2 py-1 text-[10px] font-semibold tracking-wide text-white uppercase">
              {label}
            </span>
          )}
          {featuredImage && (
            <Image
              data={featuredImage}
              sizes={imageSizes}
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
        <div className="absolute right-0 bottom-0 left-0 flex translate-y-[110%] justify-start px-4 py-1.5 transition-transform duration-200 group-hover:-translate-y-[10%]">
          <ColorSwatches
            swatches={getColorSwatches(product.colorSiblings)}
            currentHandle={handle}
            cascade
            alwaysRender
          />
        </div>
      </div>

      <div className="mt-3 flex flex-col gap-1.5">
        <Link to={to} prefetch="intent" className="text-xs font-medium tracking-wide uppercase">
          {title}
        </Link>
        <Price data={priceRange.minVariantPrice} className="text-sm text-neutral-700" />
      </div>
    </div>
  );
};
