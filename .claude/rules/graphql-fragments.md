# GraphQL & Fragments

How we write Storefront API operations. The whole approach is the Hydrogen-native one: co-located tagged-template strings + `@shopify/hydrogen-codegen`. No Apollo, no client cache, no separate `.graphql` files.

## The pattern

```ts
// 1. A reusable shape — shared fragments live in app/lib/fragments.ts
export const PRODUCT_CARD_FRAGMENT = `#graphql
  fragment ProductCard on Product {
    id
    handle
    title
    featuredImage { id url altText width height }
    priceRange { minVariantPrice { amount currencyCode } }
  }
` as const;

// 2. A query composes it — co-located in the loader that runs it
const PRODUCT_QUERY = `#graphql
  query Product($handle: String!, $country: CountryCode, $language: LanguageCode)
    @inContext(country: $country, language: $language) {
    product(handle: $handle) { ...ProductCard }
  }
  ${PRODUCT_CARD_FRAGMENT}
` as const;

// 3. Run it — fully typed, no annotations
const { product } = await context.storefront.query(PRODUCT_QUERY, {
  variables: { handle },
});
```

## Rules

- **Every operation string starts with the `#graphql` comment and ends with `as const`.** The `#graphql` triggers editor highlighting + GraphQL lint; `as const` is load-bearing — codegen keys the result type off the literal string, so without it you lose type inference.
- **Shared shapes are fragments in `app/lib/fragments.ts`**; one-off queries stay co-located in their loader. Compose fragments by spreading (`...ProductCard`) and interpolating the fragment string (`${PRODUCT_CARD_FRAGMENT}`) into the query.
- **Keep base fragments lean** — only fields every consumer needs. Feature-specific fields (PDP gallery, tech-stack metafields) belong in the query that needs them, not in the shared base fragment.
- **Import generated types, never hand-write them.** `ProductCardFragment`, `ProductQuery`, etc. come from `'storefrontapi.generated'`.
- **Run `pnpm graphql:generate` after editing any query/fragment.** `pnpm dev` and `pnpm build` run codegen automatically; `pnpm type-check` in CI catches a stale/mismatched type.
- **Localize where relevant** with `@inContext(country:$country, language:$language)` and the matching `$country`/`$language` variables (we're English/US for v1, but keep the directive).
- **Set an explicit `cache:` on every `storefront.query`** — never rely on the implicit default, so caching intent is reviewable. The policy:

  | Strategy       | Use for                                                                          | Current users                                                |
  | -------------- | -------------------------------------------------------------------------------- | ------------------------------------------------------------ |
  | `CacheLong()`  | Rarely-changing content: menus, static pages, curated recommendations            | header/footer menus, contact page, home, PDP recommendations |
  | `CacheShort()` | Price/availability-sensitive listings: the PDP product, collection product grids | `PRODUCT_QUERY`, `COLLECTION_QUERY`                          |
  | (none)         | Mutations and `context.cart` (Hydrogen manages cart freshness itself)            | cart action                                                  |

- **No GraphQL in components** — see [module-boundaries.md](module-boundaries.md).

## Fragment naming

PascalCase fragment name → `<Name>Fragment` type. Query const in `SCREAMING_SNAKE_CASE` ending `_QUERY`/`_MUTATION`/`_FRAGMENT`. See [naming-conventions.md](naming-conventions.md).

## Don't edit the generated files

`storefrontapi.generated.d.ts` is an output — change the source operation and regenerate.
