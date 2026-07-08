import { Image } from '@shopify/hydrogen';
import { Link } from 'react-router';
import type { ProductCardFragment } from 'storefrontapi.generated';

import { Price } from '~/components/common/Price';
import { ColorSwatches } from '~/components/product/ColorSwatches';

type ProductCardProps = {
  product: ProductCardFragment;
  /** Optional badge text (e.g. the `theme.label` metafield, "Sold out"). */
  label?: string | null;
  /** Responsive `sizes` hint for the image. */
  imageSizes?: string;
};

/**
 * Grid product card — image, optional badge, title, price, and color swatches
 * linking to sibling color products. Swatches are hidden at rest and revealed
 * on card hover, matching the live theme's resting card (image/title/price
 * only). Presentational: renders the typed `ProductCardFragment` it's given
 * and fetches nothing.
 */
export const ProductCard = ({
  product,
  label,
  imageSizes = '(min-width: 768px) 33vw, 50vw',
}: ProductCardProps) => {
  const { handle, title, featuredImage, priceRange } = product;
  const to = `/products/${handle}`;

  return (
    <div className="group flex flex-col">
      <Link
        to={to}
        prefetch="intent"
        className="relative block overflow-hidden bg-neutral-100"
        aria-label={title}
      >
        {label && (
          <span className="absolute top-0 right-0 z-10 bg-black px-2 py-1 text-[10px] font-semibold tracking-wide text-white uppercase">
            {label}
          </span>
        )}
        {featuredImage && (
          <Image
            data={featuredImage}
            sizes={imageSizes}
            className="aspect-square w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        )}
      </Link>

      <div className="mt-3 flex flex-col gap-1.5">
        <Link to={to} prefetch="intent" className="text-xs font-medium tracking-wide uppercase">
          {title}
        </Link>
        <Price data={priceRange.minVariantPrice} className="text-sm text-neutral-700" />
        <ColorSwatches
          handle={handle}
          className="mt-1 opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-within:opacity-100"
        />
      </div>
    </div>
  );
};
