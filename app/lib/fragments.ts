import { gql, type StorefrontApi } from '@shopify/hydrogen';

// ---------------------------------------------------------------------------
// Shared Storefront API documents. `gql()` returns a typed, branded query
// string; compose fragments by spreading `...Name` and passing the fragment
// document in the second argument. Types come from `StorefrontApi.ResultOf`.
// Server-only: route loaders and lib/ import these, components import only
// the exported *types* (erased at build time), so no query reaches the browser.
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
        description
        primaryDomain {
          url
        }
        brand {
          logo {
            image {
              url
            }
          }
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
export type MenuData = NonNullable<HeaderData['menu']>;

// ---------------------------------------------------------------------------
// Base building-block fragments — only the fields every consumer needs.
// Feature-specific extras (PDP hero metafields, tech stack, …) belong in the
// query that needs them (lib/productQueries.ts), not here.
// ---------------------------------------------------------------------------

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
      # Edition device (7PA-246): ED. XX · STATUS, rendered in the card's mono
      # spec strip.
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

// A `gql()` fragment is a branded string, not a gql.tada document, so
// `FragmentOf` does not apply. The fragment's data type is read off a shape
// query that spreads it (never executed — it exists for the type alone).
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
