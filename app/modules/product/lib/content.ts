/**
 * Types + parsers for the PDP content stored in Shopify product metafields
 * (`custom.*`, seeded once and read via the Storefront API). Parsing lives here
 * so the loader hands components already-typed props (module-boundaries).
 */

export type ProductDetailCard = { imageUrl: string; caption: string; subcaption: string };

/**
 * Parse a JSON metafield's raw `value` string into a typed shape. Returns null
 * on a missing or malformed value so a bad metafield degrades gracefully
 * (section omitted) instead of 500-ing the PDP.
 */
export const parseJsonMetafield = <T>(metafield?: { value?: string | null } | null): T | null => {
  if (!metafield?.value) return null;
  try {
    return JSON.parse(metafield.value) as T;
  } catch {
    return null;
  }
};
