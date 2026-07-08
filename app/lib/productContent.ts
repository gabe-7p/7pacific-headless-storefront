/**
 * Types for the PDP content stored in Shopify product metafields
 * (`custom.*`, seeded once and read via the Storefront API). Parse the raw
 * values with `parseJsonMetafield` from `~/lib/metafields`.
 */

export type ProductDetailCard = { imageUrl: string; caption: string; subcaption: string };

export type TechIcon = 'perforations' | 'grip-tape' | 'effort';
export type TechFeature = { heading: string; description: string; icon: TechIcon };
export type TechStack = {
  features: ReadonlyArray<TechFeature>;
  materials: ReadonlyArray<string>;
  details: string;
  care: ReadonlyArray<string>;
};
