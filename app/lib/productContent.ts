/**
 * Types for the PDP content stored in Shopify product metafields
 * (`custom.*`, seeded once and read via the Storefront API). Parse the raw
 * values with `parseJsonMetafield` from `~/lib/metafields`.
 */

export type ProductDetailCard = { imageUrl: string; caption: string; subcaption: string };

/**
 * The Spec Card (`custom.spec_card`) — the locked seven-field PDP device from
 * the brand guidelines (Fabric / Weight / Use / Seams / Pockets / Fit /
 * Origin). Every field is optional: a missing value (e.g. an unweighed piece)
 * omits its row — values are never invented in code.
 */
export type SpecCardData = Partial<
  Record<'fabric' | 'weight' | 'use' | 'seams' | 'pockets' | 'fit' | 'origin', string>
>;

export type TechIcon = 'perforations' | 'grip-tape' | 'effort';
export type TechFeature = { heading: string; description: string; icon: TechIcon };
export type TechStack = {
  features: ReadonlyArray<TechFeature>;
  materials: ReadonlyArray<string>;
  details: string;
  care: ReadonlyArray<string>;
};
