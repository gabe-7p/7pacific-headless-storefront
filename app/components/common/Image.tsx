import type { ImgHTMLAttributes } from 'react';

/**
 * The storefront's image element — the ONE place Shopify CDN images are
 * rendered. Hydrogen 2026.10 ships no Image component, so this owns what the
 * knit-aliasing pitfall depends on: every slot gets a width-descriptor
 * `srcset` of CDN-resized URLs plus `sizes`, so the CDN delivers the slot's
 * own pixel size and the browser never shrinks a 20-megapixel photo itself
 * (see .claude/rules/common-pitfalls.md). Cropped slots pass `aspectRatio` +
 * `crop` and the CDN crops too. `Image.test.tsx` pins the contract.
 */

type ImageData = {
  url: string;
  altText?: string | null;
  width?: number | null;
  height?: number | null;
};

type Crop = 'center' | 'top' | 'bottom' | 'left' | 'right';

export type ImageProps = {
  /** A Storefront API image (`url`, `altText`, `width`, `height`). */
  data?: ImageData | null;
  /** A plain CDN URL (content files); pass `width`/`height` for CLS. */
  src?: string;
  /** Overrides `data.altText`. Decorative images pass "". */
  alt?: string;
  /** The slot's rendered width — what the browser picks a candidate against. */
  sizes?: string;
  /** "5/6" etc. — the CDN crops every candidate to this ratio. */
  aspectRatio?: string;
  crop?: Crop;
  loading?: 'eager' | 'lazy';
  fetchPriority?: 'high' | 'low' | 'auto';
  decoding?: 'async' | 'sync' | 'auto';
  /** Intrinsic width/height attributes (for CLS); default to the source's. */
  width?: number;
  height?: number;
  className?: string;
  /** Explicit srcset ladder (px) for slots that need finer steps than the default. */
  srcSetWidths?: Array<number>;
};

const SHOPIFY_CDN_HOSTS = ['cdn.shopify.com', 'mock.shop'];

const isShopifyImageHost = (hostname: string) =>
  SHOPIFY_CDN_HOSTS.some((host) => hostname === host || hostname.endsWith(`.${host}`));

/** 200px steps up to 3000px — the ladder every slot picks from by default. */
const DEFAULT_WIDTHS = Array.from({ length: 15 }, (_, index) => (index + 1) * 200);

/** The `src` fallback (no-srcset clients): the candidate closest to 1200px. */
const FALLBACK_WIDTH = 1200;

const parseAspectRatio = (aspectRatio?: string): number | undefined => {
  if (!aspectRatio) return undefined;
  const [w, h] = aspectRatio.split('/').map(Number);
  return w && h ? w / h : undefined;
};

/** A CDN URL resized (and cropped) through `ImageTransformInput` params, appended, never concatenated. */
export const shopifyImageUrl = (
  url: string,
  { width, height, crop }: { width?: number; height?: number; crop?: Crop }
): string => {
  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    return url;
  }
  if (!isShopifyImageHost(parsed.hostname)) return url;
  if (width) parsed.searchParams.set('width', String(width));
  if (height) parsed.searchParams.set('height', String(height));
  if (crop) parsed.searchParams.set('crop', crop);
  return parsed.toString();
};

export const Image = ({
  data,
  src,
  alt,
  sizes,
  aspectRatio,
  crop,
  loading,
  fetchPriority,
  decoding = 'async',
  width,
  height,
  className,
  srcSetWidths,
}: ImageProps) => {
  const url = data?.url ?? src;
  if (!url) return null;

  const sourceWidth = width ?? data?.width ?? undefined;
  const sourceHeight = height ?? data?.height ?? undefined;
  const ratio = parseAspectRatio(aspectRatio);
  // Never ask the CDN for more pixels than the source has.
  const widths = (srcSetWidths ?? DEFAULT_WIDTHS).filter((w) => !sourceWidth || w <= sourceWidth);
  const cropFor = (w: number) =>
    ratio ? { width: w, height: Math.round(w / ratio), crop: crop ?? 'center' } : { width: w };

  const candidates = widths.map((w) => ({ url: shopifyImageUrl(url, cropFor(w)), width: w }));
  const fallback =
    candidates.reduce<(typeof candidates)[number] | undefined>(
      (best, candidate) =>
        !best || Math.abs(candidate.width - FALLBACK_WIDTH) < Math.abs(best.width - FALLBACK_WIDTH)
          ? candidate
          : best,
      undefined
    )?.url ?? url;

  const attrs: ImgHTMLAttributes<HTMLImageElement> = {
    src: fallback,
    srcSet:
      candidates.length > 0 ? candidates.map((c) => `${c.url} ${c.width}w`).join(', ') : undefined,
    sizes,
    alt: alt ?? data?.altText ?? '',
    width: sourceWidth,
    height: ratio && sourceWidth ? Math.round(sourceWidth / ratio) : sourceHeight,
    loading,
    fetchPriority,
    decoding,
    className,
  };

  return <img {...attrs} alt={attrs.alt} />;
};
