import { gql, type StorefrontApi } from '@shopify/hydrogen';

// ---------------------------------------------------------------------------
// Shared Storefront API documents — see .claude/rules/graphql-fragments.md.
// Components import only the exported *types*, so no query reaches the browser.
// ---------------------------------------------------------------------------

const MENU_ITEM_FRAGMENT = gql(`
  fragment MenuItem on MenuItem {
    id
    resourceId
    tags
    title
    type
    url
  }
`);

const PARENT_MENU_ITEM_FRAGMENT = gql(
  `
    fragment ParentMenuItem on MenuItem {
      ...MenuItem
      items {
        ...MenuItem
      }
    }
  `,
  [MENU_ITEM_FRAGMENT]
);

const MENU_FRAGMENT = gql(
  `
    fragment Menu on Menu {
      id
      items {
        ...ParentMenuItem
      }
    }
  `,
  [PARENT_MENU_ITEM_FRAGMENT]
);

/**
 * Root chrome: the shop identity (+ the currency Shopify's scripts need for
 * browse events) and the header menu. `@inContext` is filled from the client's
 * i18n automatically.
 */
export const HEADER_QUERY = gql(
  `
    query Header($headerMenuHandle: String!, $country: CountryCode, $language: LanguageCode)
      @inContext(language: $language, country: $country) {
      shop {
        id
        name
        primaryDomain {
          url
        }
      }
      localization {
        country {
          currency {
            isoCode
          }
        }
      }
      menu(handle: $headerMenuHandle) {
        ...Menu
      }
    }
  `,
  [MENU_FRAGMENT]
);

export const FOOTER_QUERY = gql(
  `
    query Footer($footerMenuHandle: String!, $country: CountryCode, $language: LanguageCode)
      @inContext(language: $language, country: $country) {
      menu(handle: $footerMenuHandle) {
        ...Menu
      }
    }
  `,
  [MENU_FRAGMENT]
);

export type HeaderData = StorefrontApi.ResultOf<typeof HEADER_QUERY>;
export type FooterData = StorefrontApi.ResultOf<typeof FOOTER_QUERY>;

/**
 * Color = separate product: the ordered color family lives in the
 * custom.color_siblings metafield (each sibling carries its own name/hex).
 */
export const COLOR_SIBLINGS_FRAGMENT = gql(`
  fragment ColorSiblings on Product {
    colorSiblings: metafield(namespace: "custom", key: "color_siblings") {
      references(first: 10) {
        nodes {
          ... on Product {
            __typename
            handle
            colorName: metafield(namespace: "custom", key: "color_name") {
              value
            }
            colorHex: metafield(namespace: "custom", key: "color_hex") {
              value
            }
          }
        }
      }
    }
  }
`);

/** The minimal product shape for grids, carousels, and recommendation rows. */
export const PRODUCT_CARD_FRAGMENT = gql(
  `
    fragment ProductCard on Product {
      id
      handle
      title
      featuredImage {
        id
        url
        altText
        width
        height
      }
      # First two images: [0] is the resting card image, [1] crossfades in on
      # hover (matches the live card's product-image-hover behavior).
      images(first: 2) {
        nodes {
          id
          url
          altText
          width
          height
        }
      }
      priceRange {
        minVariantPrice {
          amount
          currencyCode
        }
      }
      # Edition device: ED. XX · STATUS, rendered in the card's mono spec strip.
      editionNumber: metafield(namespace: "custom", key: "edition_number") {
        value
      }
      editionStatus: metafield(namespace: "custom", key: "edition_status") {
        value
      }
      ...ColorSiblings
    }
  `,
  [COLOR_SIBLINGS_FRAGMENT]
);

// Type-only shape query (never executed): see graphql-fragments.md → "Rules".
const PRODUCT_CARD_SHAPE_QUERY = gql(
  `
    query ProductCardShape {
      products(first: 1) {
        nodes {
          ...ProductCard
        }
      }
    }
  `,
  [PRODUCT_CARD_FRAGMENT]
);

/** The data a `<ProductCard>` renders — what `...ProductCard` selects. */
export type ProductCardData = StorefrontApi.ResultOf<
  typeof PRODUCT_CARD_SHAPE_QUERY
>['products']['nodes'][number];
