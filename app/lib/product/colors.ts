/**
 * Color swatches, data-driven from Shopify (color = SEPARATE product, not a
 * variant — see docs/decisions/0005-color-as-separate-product.md).
 *
 * Each product carries three metafields, seeded in Shopify admin:
 *   custom.color_name      — display name ("Mountain Mist")
 *   custom.color_hex       — swatch hex ("#6A7E8D")
 *   custom.color_siblings  — ordered product references for the whole color
 *                            family, INCLUDING the product itself
 *
 * Adding a product/color: docs/runbooks/add-a-product.md.
 */

import type { ProductCardData } from '~/lib/fragments';

export type ColorSwatch = { handle: string; name: string; hex: string };

/**
 * What `...ColorSiblings` selects — derived from the fragment in
 * `lib/fragments.ts` so this shape can't drift from the query. Metafield
 * references are a union of every referenceable type; a non-product node
 * carries only `__typename` and is skipped below.
 */
type ColorSiblingsMetafield = ProductCardData['colorSiblings'];

/** Relative luminance above which a swatch disappears against the white card. */
const LIGHT_SWATCH_LUMINANCE = 0.75;

const toLinear = (channel: number) => {
  const value = channel / 255;
  return value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
};

/**
 * Whether a swatch hex needs a visible frame on a white card: WCAG relative
 * luminance over 0.75 counts as light. That frames white and off-whites (cream
 * #F5F5DC is 0.90, light grey #EDEDED 0.85); the palest live color after White
 * is Mint at 0.55. A malformed hex reads as not light.
 */
export const isLightSwatch = (hex: string): boolean => {
  const match = /^#?([0-9a-f]{3}|[0-9a-f]{6})$/i.exec(hex.trim());
  if (!match?.[1]) return false;
  const digits = match[1];
  const full = digits.length === 3 ? digits.replace(/./g, '$&$&') : digits;
  const [red, green, blue] = [0, 2, 4].map((start) =>
    toLinear(Number.parseInt(full.slice(start, start + 2), 16))
  ) as [number, number, number];
  return 0.2126 * red + 0.7152 * green + 0.0722 * blue > LIGHT_SWATCH_LUMINANCE;
};

/** Map a product's `colorSiblings` metafield into renderable swatches. */
export const getColorSwatches = (
  colorSiblings?: ColorSiblingsMetafield | null
): Array<ColorSwatch> =>
  (colorSiblings?.references?.nodes ?? []).flatMap((node) =>
    'handle' in node && node.handle && node.colorName?.value && node.colorHex?.value
      ? [{ handle: node.handle, name: node.colorName.value, hex: node.colorHex.value }]
      : []
  );
