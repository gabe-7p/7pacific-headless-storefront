import type { CSSProperties, ImgHTMLAttributes } from 'react';

import { isShopifyCdnUrl } from '~/lib/shopifyFiles';

/**
 * The storefront's image element — the ONE place Shopify CDN images are
 * rendered. Two modes:
 *
 * - **Fluid** (the default, `width` is a percentage): a width-descriptor
 *   `srcset` ladder of CDN-resized URLs capped at the source size, `sizes`
 *   from the caller, and an inline `width` + `aspect-ratio` (from the
 *   `aspectRatio` prop or the source dimensions). That inline aspect-ratio
 *   is what sizes a slot: it wins over an `aspect-*` utility, exactly as the
 *   classic component did, so the product cards keep their 4:5 portrait.
 * - **Fixed** (`width` is a number): a density `srcset` (1x/2x/3x of the
 *   given size, cropped to the given ratio) and an inline `aspect-ratio`.
 *   Content photos pass their intrinsic size here, which is why they ship at
 *   full resolution.
 *
 * `Image.test.tsx` pins the contract. The inline style is the documented exception to the no-inline-style rule:
 * a per-image ratio can't be a Tailwind class.
 */

/** A Storefront API image (also the shape `lib/metafields` hands back). */
export type StorefrontImage = {
  id?: string | null;
  url: string;
  altText?: string | null;
  width?: number | null;
  height?: number | null;
};

type Crop = 'center' | 'top' | 'bottom' | 'left' | 'right';

export type ImageProps = {
  /** A Storefront API image (`url`, `altText`, `width`, `height`). */
  data?: StorefrontImage | null;
  /** A plain CDN URL (content files); pass the intrinsic `width`/`height`. */
  src?: string;
  /** Overrides `data.altText`. Decorative images pass "". */
  alt?: string;
  /** Fluid mode: the slot's rendered width, what the browser picks a candidate against. */
  sizes?: string;
  /** "5/6" etc. — the CDN crops every candidate to this ratio. */
  aspectRatio?: string;
  crop?: Crop;
  loading?: 'eager' | 'lazy';
  fetchPriority?: 'high' | 'low' | 'auto';
  decoding?: 'async' | 'sync' | 'auto';
  /** A percentage keeps fluid mode ("75%" narrows the box); a number switches to fixed mode. */
  width?: number | string;
  /** Fixed mode: the rendered height; with `width` it also sets the crop ratio. */
  height?: number;
  className?: string;
  /** Fluid mode: an explicit srcset ladder (px) for slots that need finer steps. */
  srcSetWidths?: Array<number>;
};

/** 200px steps up to 3000px — the ladder every fluid slot picks from by default. */
const DEFAULT_WIDTHS = Array.from({ length: 15 }, (_, index) => (index + 1) * 200);

/** The fluid `src` fallback (no-srcset clients): the candidate closest to 1200px. */
const FALLBACK_WIDTH = 1200;

/** "5/6" → height-per-width multiplier (1.2). */
const parseAspectRatio = (aspectRatio?: string): number | undefined => {
  if (!aspectRatio) return undefined;
  const [w, h] = aspectRatio.split('/').map(Number);
  return w && h ? h / w : undefined;
};

const isFixedWidth = (width: number | string) =>
  typeof width === 'number' || /\d(px|em|rem)$/.test(width);

/** A CDN URL resized (and cropped) through `ImageTransformInput` params, appended, never concatenated. */
const shopifyImageUrl = (
  url: string,
  { width, height, crop }: { width?: number; height?: number; crop?: Crop }
): string => {
  if (!isShopifyCdnUrl(url)) return url;
  const parsed = new URL(url);
  if (width) parsed.searchParams.set('width', String(width));
  if (height) parsed.searchParams.set('height', String(height));
  if (crop) parsed.searchParams.set('crop', crop);
  return parsed.toString();
};

type Candidate = { width: number; height?: number; crop?: Crop };

/** One candidate per ladder width, cropped to the ratio, dropped once it exceeds the source. */
const buildCandidates = (
  widths: Array<number>,
  ratio: number | undefined,
  crop: Crop,
  source: { width?: number | null; height?: number | null }
): Array<Candidate> =>
  widths
    .map((width) => ({ width, height: ratio ? Math.round(width * ratio) : undefined, crop }))
    .filter(
      ({ width, height }) =>
        !(source.width && width > source.width) &&
        !(source.height && height && height > source.height)
    );

export const Image = ({
  data,
  src,
  alt,
  sizes,
  aspectRatio,
  crop = 'center',
  loading = 'lazy',
  fetchPriority,
  decoding = 'async',
  width = '100%',
  height,
  className,
  srcSetWidths,
}: ImageProps) => {
  const url = data?.url ?? src;
  if (!url) return null;

  const source = { width: data?.width, height: data?.height };
  const sourceRatio =
    source.width && source.height ? `${source.width}/${source.height}` : undefined;
  const common: ImgHTMLAttributes<HTMLImageElement> = {
    alt: alt ?? data?.altText ?? '',
    loading,
    fetchPriority,
    decoding,
    className,
  };

  if (isFixedWidth(width)) {
    // Fixed mode: 1x/2x/3x of the given size (the CDN caps at the source), cropped to the ratio.
    const intWidth = typeof width === 'number' ? width : Number.parseFloat(width);
    const fixedRatio = aspectRatio ?? (height ? `${intWidth}/${height}` : undefined) ?? sourceRatio;
    const multiplier = parseAspectRatio(fixedRatio);
    const fixedHeight = height ?? (multiplier ? Math.round(intWidth * multiplier) : undefined);
    const candidates = buildCandidates(
      [1, 2, 3].map((n) => n * intWidth),
      multiplier,
      crop,
      source
    );
    const style: CSSProperties = { aspectRatio: fixedRatio };
    return (
      <img
        {...common}
        alt={common.alt}
        src={shopifyImageUrl(url, {
          width: intWidth,
          height: fixedHeight,
          crop: height ? crop : undefined,
        })}
        srcSet={
          candidates.length > 0
            ? candidates.map((c, index) => `${shopifyImageUrl(url, c)} ${index + 1}x`).join(', ')
            : undefined
        }
        width={intWidth}
        height={fixedHeight}
        style={style}
      />
    );
  }

  // Fluid mode: width descriptors + sizes; inline width/aspect-ratio size the box.
  const fluidRatio = aspectRatio ?? sourceRatio;
  const candidates = buildCandidates(
    srcSetWidths ?? DEFAULT_WIDTHS,
    parseAspectRatio(fluidRatio),
    crop,
    source
  );
  const fallback =
    candidates.reduce<Candidate | undefined>(
      (best, candidate) =>
        !best || Math.abs(candidate.width - FALLBACK_WIDTH) < Math.abs(best.width - FALLBACK_WIDTH)
          ? candidate
          : best,
      undefined
    ) ?? null;
  const style: CSSProperties = { width, aspectRatio: fluidRatio };

  return (
    <img
      {...common}
      alt={common.alt}
      src={fallback ? shopifyImageUrl(url, fallback) : url}
      srcSet={
        candidates.length > 0
          ? candidates.map((c) => `${shopifyImageUrl(url, c)} ${c.width}w`).join(', ')
          : undefined
      }
      sizes={sizes}
      width={source.width ?? undefined}
      height={source.height ?? undefined}
      style={style}
    />
  );
};
