# GraphQL & Fragments

How we write Storefront API operations. The whole approach is the Hydrogen-native one: co-located tagged-template strings + `@shopify/hydrogen-codegen`. No Apollo, no client cache, no separate `.graphql` files — with one deliberate exception, the IDE mirror below.

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

## The IDE mirror: `app/lib/fragments.ide.graphql`

The editor's GraphQL extension (vscode-graphql) indexes project documents with `graphql-tag-pluck`, which **cannot see** our `` `#graphql …` as const `` template strings (no `gql` tag; `as const` detaches the `/* GraphQL */` magic comment it would otherwise recognize). With nothing indexed, every cross-file spread — `...ProductCard` in `_index.tsx`, `collections.$handle.tsx`, `products.$handle.tsx` — shows a false `Unknown fragment` error in the IDE, even though codegen, type-check, and the build are all fine.

The fix is `app/lib/fragments.ide.graphql`: a **byte-for-byte mirror of `PRODUCT_CARD_FRAGMENT`'s runtime value** (which interpolates `ColorSiblings`), listed in `.graphqlrc.ts` `documents` so the LSP loads it as a plain GraphQL file — no plucking involved. Rules:

- **It exists for the IDE only.** Don't import it, don't add operations to it, don't format it (`.prettierignore` excludes it — prettier would break the byte-match).
- **`app/lib/fragments.ide.test.ts` fails when it drifts** from `PRODUCT_CARD_FRAGMENT`. To regenerate after editing the fragment: bundle `app/lib/fragments.ts` with the repo's esbuild (`node_modules/.pnpm/esbuild@*/node_modules/esbuild/bin/esbuild app/lib/fragments.ts --bundle --format=cjs --platform=node --outfile=/tmp/fragments.cjs`), then `node -e "require('fs').writeFileSync('app/lib/fragments.ide.graphql', require('/tmp/fragments.cjs').PRODUCT_CARD_FRAGMENT)"`.
- **Add a new shared fragment to the mirror only when another file's query spreads it.** Fragments spread solely inside `fragments.ts`'s own templates (Money, CartLine, Menu…) don't need mirroring — the LSP parses open files with its own `#graphql`-aware parser.
- Codegen also reads the mirror (documents come from `.graphqlrc.ts`) and dedupes the fragment types by name — that's expected and harmless; don't "fix" the resulting ordering of `storefrontapi.generated.d.ts`.

Don't restructure the TS fragment constants to appease the IDE instead: a `(/* GraphQL */ \`…\`) as const`wrapper satisfies the plucker but **breaks`@shopify/graphql-codegen`'s `${FRAGMENT}` interpolation lookup** (`Variable "X" not found`), and dropping `as const` breaks codegen typing. The mirror is the only shape that keeps both tools working.

## Fragment naming

PascalCase fragment name → `<Name>Fragment` type. Query const in `SCREAMING_SNAKE_CASE` ending `_QUERY`/`_MUTATION`/`_FRAGMENT`. See [naming-conventions.md](naming-conventions.md).

## Don't edit the generated files

`storefrontapi.generated.d.ts` is an output — change the source operation and regenerate.
