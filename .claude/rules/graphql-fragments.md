# GraphQL & Fragments

How we write Storefront API operations on Hydrogen 2026.10: `gql()` documents typed in place by Hydrogen's TypeScript plugin. No codegen step, no generated file, no Apollo, no separate `.graphql` files.

## The pattern

```ts
// 1. A reusable shape — shared fragments live in app/lib/fragments.ts
import { gql, type StorefrontApi } from '@shopify/hydrogen';

export const PRODUCT_CARD_FRAGMENT = gql(
  `
    fragment ProductCard on Product {
      id
      handle
      title
      featuredImage { ...Image }
      priceRange { minVariantPrice { amount currencyCode } }
    }
  `,
  [IMAGE_FRAGMENT]
);

// 2. A query composes it — co-located in the loader that runs it. Spread the
//    fragment AND pass its document in the second argument.
const PRODUCT_QUERY = gql(
  `
    query Product($handle: String!, $country: CountryCode, $language: LanguageCode)
      @inContext(country: $country, language: $language) {
      product(handle: $handle) { ...ProductCard }
    }
  `,
  [PRODUCT_CARD_FRAGMENT]
);

// 3. Run it from a loader through queryStorefrontOrThrow (or queryStorefront for
//    a nullable read) — the client comes from the root middleware; `cache` is
//    required, GraphQL `errors` are logged, a null `product` is a 404.
const product = await queryStorefrontOrThrow(
  context.get(storefrontClientContext),
  PRODUCT_QUERY,
  { variables: { handle }, cache: Cache.short() },
  (data) => data.product,
  'Product not found'
);
```

## Rules

- **Every document is a `gql()` call.** The TypeScript plugin (`@shopify/hydrogen/ts-plugin` in `tsconfig.json`) types the result off the literal source, so the string must be a literal, never built from variables.
- **Compose fragments through the second argument** (`gql(source, [FRAGMENT])`). A fragment that itself composes fragments carries them along — don't pass the same fragment twice through two parents (duplicate definition error at runtime; `gql()` only dedupes identical strings, and a parent's string differs from its child's). `PRODUCT_CARD_FRAGMENT` already includes `ColorSiblings`, `Image` and `Edition`; a query that spreads them takes only `PRODUCT_CARD_FRAGMENT`. When two parents in one document need the same leaf, chain them so it has a single carrier: `PRODUCT_VARIANT_FRAGMENT` takes `MEDIA_IMAGE_REF_FRAGMENT` (which carries `Image`) rather than `IMAGE_FRAGMENT`, because `PRODUCT_QUERY` needs both.
- **Types come from `StorefrontApi.ResultOf<typeof DOC>`** (and `VariablesOf`). A fragment's data type is read off a _shape query_ that spreads it (see `ProductCardData` in `lib/fragments.ts`) — `gql()` returns a branded string, not a gql.tada document, so `FragmentOf` does not apply. Export those types next to the document; components import only the type (erased at build time), never the document, so no query ships to the browser.
- **`graphql()` returns `{ data, errors, headers }`.** GraphQL errors are returned, not thrown, so don't call `graphql()` from a loader directly: `queryStorefront` / `queryStorefrontOrThrow` (`lib/storefront.ts`) log `errors` and hand back `data` or `null` (or the selected value, else a 404/500). Transport failures throw (`StorefrontApiError`, `StorefrontTimeoutError`).
- **Set an explicit `cache:` on every read** — there is no implicit default; a read without one hits the API on every request. `cache` is a required option of `queryStorefront` / `queryStorefrontOrThrow`, so the type checker enforces it; a direct `.graphql(...)` call without `cache` (or with `country`/`language` in `variables`) fails `no-restricted-syntax`. Mutations and the cart never cache.

  | Strategy        | Use for                                                                          | Current users                                                            |
  | --------------- | -------------------------------------------------------------------------------- | ------------------------------------------------------------------------ |
  | `Cache.long()`  | Rarely-changing content: menus, static pages, journal, curated recommendations   | chrome, home grid, pages, journal, robots, sitemaps, PDP recommendations |
  | `Cache.short()` | Price/availability-sensitive listings: the PDP product, collection product grids | the PDP product, the collection grid                                     |
  | (none)          | The cart (Hydrogen's handlers manage it)                                         | `cartHandlers`                                                           |

- **`$country` / `$language` are injected.** Declare them with `@inContext` and leave them out of `variables`; the client fills them from the request context's i18n (`MARKET` in `lib/i18n.ts`, EN/US). Any other handle a document needs (the journal blog, a menu, a page) is also a declared variable, passed from `HANDLES` in `content/links.ts` — never an inline literal.
- **Union and interface selections are typed as the full union.** A metafield `references` / `reference` is a union of every referenceable type; select `__typename` in the inline fragment, derive the shape from the fragment's result type, and narrow with `'handle' in node` (`lib/product/colors.ts`); a helper that has no fragment to lean on accepts a structural, all-optional shape instead (`lib/metafields.ts`).
- **Keep base fragments lean** — only fields every consumer needs. Feature-specific fields (PDP hero metafields, tech stack) belong in the query that needs them (`lib/product/queries.ts`).
- **`hydrogen gql check --fail-on-warn` is part of `pnpm type-check`.** It validates every document against the bundled Storefront API schema (the plugin alone does not run under `tsc`). The plugin writes `storefront-graphql-env.d.ts` / `customer-account-graphql-env.d.ts` at the repo root — gitignored, never edited.
- **No GraphQL in components** — see [module-boundaries.md](module-boundaries.md).

## Naming

Query/mutation/fragment constants in `SCREAMING_SNAKE_CASE` ending `_QUERY` / `_FRAGMENT`; fragment names PascalCase (`ProductCard` → `ProductCardData` type). See [naming-conventions.md](naming-conventions.md).
