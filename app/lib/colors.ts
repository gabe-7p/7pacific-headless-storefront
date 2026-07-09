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
 * Adding a product/color is a Shopify-only task: set the three metafields on
 * the new product and append it to every sibling's color_siblings list. No
 * code changes required (the old hand-maintained lib/colorMap.ts is gone).
 */

export type ColorSwatch = { handle: string; name: string; hex: string };

type SiblingNode = {
  handle?: string;
  colorName?: { value?: string | null } | null;
  colorHex?: { value?: string | null } | null;
};

type ColorSiblingsMetafield = {
  references?: { nodes: Array<SiblingNode> } | null;
} | null;

/** Map a product's `colorSiblings` metafield into renderable swatches. */
export const getColorSwatches = (colorSiblings?: ColorSiblingsMetafield): Array<ColorSwatch> =>
  (colorSiblings?.references?.nodes ?? []).flatMap((node) =>
    node.handle && node.colorName?.value && node.colorHex?.value
      ? [{ handle: node.handle, name: node.colorName.value, hex: node.colorHex.value }]
      : []
  );
