import { Image as HydrogenImage } from '@shopify/hydrogen';
import type { ComponentProps } from 'react';

type HydrogenImageProps = ComponentProps<typeof HydrogenImage>;

/**
 * The storefront's image element — the ONE place Shopify CDN images are
 * rendered. Every slot gets a width-descriptor `srcset` plus `sizes`, so the
 * CDN delivers the slot's own pixel size: the shoot's 20-megapixel knit
 * close-ups alias into visible wave bands when a browser shrinks them itself
 * (see .claude/rules/common-pitfalls.md). Cropped slots pass `aspectRatio` +
 * `crop` and the CDN crops too.
 *
 * Only the props the site uses are exposed; `Image.test.tsx` pins the
 * rendered `srcset`/`sizes` contract so the implementation behind this seam
 * can change without a call-site hunt.
 */
export type ImageProps = Pick<
  HydrogenImageProps,
  | 'data'
  | 'src'
  | 'alt'
  | 'sizes'
  | 'aspectRatio'
  | 'crop'
  | 'loading'
  | 'fetchPriority'
  | 'decoding'
  | 'width'
  | 'height'
  | 'className'
> & {
  /** Explicit srcset ladder (px) for slots that need finer steps than the default. */
  srcSetWidths?: Array<number>;
};

const toSrcSetOptions = (widths: Array<number>) => ({
  intervals: widths.length,
  startingWidth: widths[0] ?? 0,
  incrementSize: (widths[1] ?? 0) - (widths[0] ?? 0),
  placeholderWidth: 100,
});

export const Image = ({ srcSetWidths, ...props }: ImageProps) => (
  <HydrogenImage
    {...props}
    srcSetOptions={srcSetWidths ? toSrcSetOptions(srcSetWidths) : undefined}
  />
);
