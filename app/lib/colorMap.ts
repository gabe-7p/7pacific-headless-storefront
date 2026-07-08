/**
 * Color map — typed port of the live theme's `assets/color-map.js`.
 *
 * 7Pacific models each color as a SEPARATE Shopify product (not a variant), with
 * sibling handles like `…-mint` / `…-midnight`. This module is the single source
 * of truth for color hexes and the handle ↔ color mapping used by color swatches.
 * See docs/decisions/0005-color-as-separate-product.md. Keep in sync with the
 * live store when products/colors change.
 */

export const COLOR_HEX = {
  'Mountain Mist': '#6A7E8D',
  Midnight: '#101820',
  Mint: '#B4C8C2',
  Tangerine: '#FF8A00',
  White: '#ffffff',
  Slate: '#ffffff',
} as const;

export type ColorName = keyof typeof COLOR_HEX;

/** Explicit handle → color name for the 9 live products. */
export const PRODUCT_COLOR_MAP: Readonly<Record<string, ColorName>> = {
  'airrail-6-performance-shorts-mountain-mist': 'Mountain Mist',
  'airrail-6-performance-shorts-mint': 'Mint',
  'airrail-6-performance-shorts-midnight': 'Midnight',
  'tracefiber-performance-tech-tee-white': 'White',
  'tracefiber-performance-tech-tee-mint': 'Mint',
  'tracefiber-performance-tech-tee-midnight': 'Midnight',
  'tracefiber-performance-tech-tee-tangerine': 'Tangerine',
  'tracefiber-performance-tech-tee-mountain-mist': 'Mountain Mist',
  'motionframe-running-hat-white': 'White',
};

export type ProductType = 'short' | 'shirt' | 'hat';

/** Colors available per product type, in display order. */
export const PRODUCT_TYPE_COLORS: Readonly<Record<ProductType, ReadonlyArray<ColorName>>> = {
  short: ['Mountain Mist', 'Mint', 'Midnight'],
  shirt: ['Mountain Mist', 'Mint', 'White', 'Midnight', 'Tangerine'],
  hat: ['White'],
};

// Color suffixes, longest-first so multi-word suffixes strip before single words.
const COLOR_SUFFIXES = [
  '-mountain-mist',
  '-midnight',
  '-mint',
  '-white',
  '-tangerine',
  '-slate',
] as const;

/** Infer the product type from a handle. */
export const getProductType = (handle: string): ProductType | null => {
  if (handle.includes('shorts') || handle.includes('short')) return 'short';
  if (handle.includes('tee') || handle.includes('shirt')) return 'shirt';
  if (handle.includes('hat')) return 'hat';
  return null;
};

/** Colors available for the product this handle belongs to. */
export const getAvailableColors = (handle: string): ReadonlyArray<ColorName> => {
  const type = getProductType(handle);
  return type ? PRODUCT_TYPE_COLORS[type] : [];
};

/** Strip any trailing color suffix to get the base product handle. */
export const getBaseProductHandle = (handle: string): string => {
  for (const suffix of COLOR_SUFFIXES) {
    if (handle.endsWith(suffix)) return handle.slice(0, -suffix.length);
  }
  return handle;
};

/** The currently-selected color for a handle (defaults to White). */
export const getCurrentColor = (handle: string): ColorName => {
  if (handle.endsWith('-mountain-mist')) return 'Mountain Mist';
  if (handle.endsWith('-midnight')) return 'Midnight';
  if (handle.endsWith('-mint')) return 'Mint';
  if (handle.endsWith('-white')) return 'White';
  if (handle.endsWith('-tangerine')) return 'Tangerine';
  if (handle.endsWith('-slate')) return 'Slate';
  return 'White';
};

/** Build the sibling product handle for a given color. */
export const getColorVariantHandle = (handle: string, color: ColorName): string => {
  const base = getBaseProductHandle(handle);
  const suffix = color.toLowerCase().replace(/\s+/g, '-');
  return `${base}-${suffix}`;
};

/** Hex for a color name (falls back to transparent if unknown). */
export const getColorHex = (color: ColorName): string => COLOR_HEX[color] ?? 'transparent';
