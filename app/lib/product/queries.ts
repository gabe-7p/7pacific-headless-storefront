import { gql, type StorefrontApi } from '@shopify/hydrogen';

import {
  COLOR_SIBLINGS_FRAGMENT,
  EDITION_FRAGMENT,
  MEDIA_IMAGE_REF_FRAGMENT,
  PRODUCT_CARD_FRAGMENT,
} from '~/lib/fragments';

/**
 * Every variant field the PDP, the product-form store and the cart need.
 * `Image` arrives through `MEDIA_IMAGE_REF_FRAGMENT`, the one carrier it can
 * have in `PRODUCT_QUERY`: `gql()` appends each fragment's string, so a second
 * carrier would define `Image` twice and fail at runtime.
 */
const PRODUCT_VARIANT_FRAGMENT = gql(
  `
    fragment ProductVariant on ProductVariant {
      availableForSale
      compareAtPrice {
        amount
        currencyCode
      }
      id
      image {
        ...Image
      }
      price {
        amount
        currencyCode
      }
      product {
        title
        handle
      }
      selectedOptions {
        name
        value
      }
      sku
      title
    }
  `,
  [MEDIA_IMAGE_REF_FRAGMENT]
);

/**
 * The PDP query. `selectedOrFirstAvailableVariant` + `adjacentVariants` +
 * the encoded variant fields are what the product-form store resolves option
 * clicks against client-side (no loader round-trip per size click).
 */
export const PRODUCT_QUERY = gql(
  `
    query Product(
      $handle: String!
      $selectedOptions: [SelectedOptionInput!]!
      $country: CountryCode
      $language: LanguageCode
    ) @inContext(country: $country, language: $language) {
      product(handle: $handle) {
        id
        title
        vendor
        handle
        descriptionHtml
        description
        encodedVariantExistence
        encodedVariantAvailability
        options {
          name
          optionValues {
            name
            firstSelectableVariant {
              ...ProductVariant
            }
          }
        }
        selectedOrFirstAvailableVariant(
          selectedOptions: $selectedOptions
          ignoreUnknownOptions: true
          caseInsensitiveMatch: true
        ) {
          ...ProductVariant
        }
        adjacentVariants(
          selectedOptions: $selectedOptions
          ignoreUnknownOptions: true
          caseInsensitiveMatch: true
        ) {
          ...ProductVariant
        }
        fitNote: metafield(namespace: "custom", key: "fit_note") {
          value
        }
        ...ColorSiblings
        productDetails: metafield(namespace: "custom", key: "product_details") {
          value
        }
        techStack: metafield(namespace: "custom", key: "tech_stack") {
          value
        }
        # The Spec Card (7PA-231) — the locked seven-field JSON device
        # (fabric/weight/use/seams/pockets/fit/origin); see lib/product/content.
        specCard: metafield(namespace: "custom", key: "spec_card") {
          value
        }
        # Edition device (7PA-246) — rendered above the product name.
        ...Edition
        # Dedicated PDP hero images (the theme's "Background Image" / "…Mobile"),
        # per product. Falls back to the variant image when unset.
        heroImage: metafield(namespace: "custom", key: "hero_image") {
          ...MediaImageRef
        }
        heroImageMobile: metafield(namespace: "custom", key: "hero_image_mobile") {
          ...MediaImageRef
        }
      }
    }
  `,
  [PRODUCT_VARIANT_FRAGMENT, COLOR_SIBLINGS_FRAGMENT, EDITION_FRAGMENT]
);

/**
 * "PLANNING TO SWEAT MORE?" — the curated recommended_products metafield
 * references. Deferred on the PDP.
 */
export const RECOMMENDATIONS_QUERY = gql(
  `
    query ProductRecommendations($handle: String!, $country: CountryCode, $language: LanguageCode)
      @inContext(country: $country, language: $language) {
      product(handle: $handle) {
        recommended: metafield(namespace: "custom", key: "recommended_products") {
          references(first: 10) {
            nodes {
              ... on Product {
                __typename
                ...ProductCard
              }
            }
          }
        }
      }
    }
  `,
  [PRODUCT_CARD_FRAGMENT]
);

type ProductQueryResult = StorefrontApi.ResultOf<typeof PRODUCT_QUERY>;
export type ProductData = NonNullable<ProductQueryResult['product']>;
export type ProductVariantData = NonNullable<ProductData['selectedOrFirstAvailableVariant']>;

/** The product the PDP renders: raw JSON metafields parsed and removed (`parseProductContent`). */
export type ProductPageData = Omit<ProductData, 'productDetails' | 'techStack' | 'specCard'>;

export type RecommendationsData = StorefrontApi.ResultOf<typeof RECOMMENDATIONS_QUERY>;
