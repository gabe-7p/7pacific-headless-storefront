/**
 * The single safe-parse layer for JSON stored in Shopify metafields
 * (`custom.*` values read via the Storefront API). Parsing lives in lib so
 * loaders hand components already-typed props (module-boundaries) and a bad
 * metafield degrades gracefully (section omitted) instead of 500-ing the page.
 */

const parseJson = <T>(value?: string | null): T | null => {
  if (!value) return null;
  try {
    return JSON.parse(value) as T;
  } catch {
    return null;
  }
};

/** Parse a JSON metafield's raw `value` into a typed shape; null when missing/malformed. */
export const parseJsonMetafield = <T>(metafield?: { value?: string | null } | null): T | null =>
  parseJson<T>(metafield?.value);

export type MarketingSection = {
  imageUrl: string;
  heading: string;
  body: string;
  align?: 'left' | 'right';
};

/** Parse a collection's `custom.marketing_sections` JSON metafield value. */
export const parseMarketingSections = (value?: string | null): Array<MarketingSection> =>
  parseJson<Array<MarketingSection>>(value) ?? [];

type MetafieldImage = {
  id?: string | null;
  url: string;
  altText?: string | null;
  width?: number | null;
  height?: number | null;
};

type ImageReferenceMetafield = { reference?: { image?: MetafieldImage | null } | null } | null;

/**
 * Pull the `<Image data>`-shaped image out of a `file_reference` (image)
 * metafield's resolved `reference { ... on MediaImage { image {…} } }`.
 * Returns null when the metafield or its reference is absent, so callers can
 * fall back to another image.
 */
export const getMetafieldImage = (metafield?: ImageReferenceMetafield): MetafieldImage | null =>
  metafield?.reference?.image ?? null;
