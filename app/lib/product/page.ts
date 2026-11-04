import { getMetafieldImage, parseJsonMetafield } from '~/lib/metafields';
import type { ProductDetailCard, SpecCardData, TechStackData } from '~/lib/product/content';
import type {
  ProductData,
  ProductPageData,
  ProductVariantData,
  RecommendationsData,
} from '~/lib/product/queries';

/** How many recommended products the PDP shows, like live. */
const RECOMMENDATIONS_LIMIT = 3;

/**
 * The PDP's recommendation row from `custom.recommended_products`: the
 * metafield can reference other types and only products render, the product
 * being viewed never recommends itself, and the row caps at three.
 */
export const selectRecommendedProducts = (data: RecommendationsData | null, handle: string) =>
  (data?.product?.recommended?.references?.nodes ?? [])
    .flatMap((node) => ('handle' in node ? [node] : []))
    .filter((node) => node.handle !== handle)
    .slice(0, RECOMMENDATIONS_LIMIT);

/**
 * Parses the PDP's JSON metafields and takes the raw values off `product`, so
 * the loader doesn't serialize the same content twice on every load and
 * revalidation. A missing or malformed metafield parses to null and its
 * section is skipped.
 */
export const parseProductContent = ({
  productDetails,
  techStack,
  specCard,
  ...product
}: ProductData): {
  product: ProductPageData;
  productDetails: Array<ProductDetailCard> | null;
  techStack: TechStackData | null;
  specCard: SpecCardData | null;
} => ({
  product,
  productDetails: parseJsonMetafield<Array<ProductDetailCard>>(productDetails),
  techStack: parseJsonMetafield<TechStackData>(techStack),
  specCard: parseJsonMetafield<SpecCardData>(specCard),
});

/**
 * The PDP hero's two sources: the dedicated per-product images (the theme's
 * Background Image / …Mobile), falling back to the variant image when a
 * product has none.
 */
export const getHeroImages = (
  product: Pick<ProductPageData, 'heroImage' | 'heroImageMobile'>,
  variant: Pick<ProductVariantData, 'image'> | null | undefined
) => ({
  desktop: getMetafieldImage(product.heroImage) ?? variant?.image,
  mobile: getMetafieldImage(product.heroImageMobile) ?? variant?.image,
});
