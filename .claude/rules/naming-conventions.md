# Naming Conventions

## Components

- **`const` arrow functions, PascalCase**, one component per file, file named after the component (`ProductCard.tsx` → `export const ProductCard = ...`). Never the `function` keyword — enforced by `react/function-component-definition`.
- Effect-only components that render `null` may share a file, e.g. `components/analytics/Trackers.tsx`.
- Props type is `type` (not `interface`), named `<Component>Props` when it needs a name, or inlined for tiny components.
- **Exception: `app/components/ui/`** holds generated shadcn/ui primitives. They use the `function` keyword and shadcn's own naming (`DialogContent`, `SelectTrigger`, …) and are ESLint-exempt — don't rewrite them to match this convention. See [ui-components.md](ui-components.md).

## Data helpers: `queryStorefront` vs `queryStorefrontOrThrow`

Storefront reads reveal their not-found behavior in the name, and both helpers live in [`lib/storefront.ts`](../../app/lib/storefront.ts):

- **Returns `null` when the API gave no data → plain `queryStorefront`.** It logs GraphQL `errors` (which `graphql()` returns instead of throwing) and returns `data ?? null`.
- **Throws when the selected part is missing → `queryStorefrontOrThrow`.** It takes a selector and the not-found message, returns the selected value (non-null), throws `notFound(message)` (404) when it is null, and `unavailable()` (500) when the API returned no data at all.

`cache` is a required key of the options, so a read without one doesn't type-check.

```ts
// ✅ returns null when the API gave no data — caller must check
const contact = await queryStorefront(storefront, CONTACT_PAGE_QUERY, {
  variables: { handle: HANDLES.contactPage },
  cache: Cache.long(),
});
const contactPage = contact?.page ?? null;

// ✅ throws notFound('Page not found') when `page` is null — `page` is guaranteed
const page = await queryStorefrontOrThrow(
  storefront,
  PAGE_QUERY,
  { variables: { handle }, cache: Cache.long() },
  (data) => data.page,
  'Page not found'
);
```

Throw with `notFound()` / `unavailable()` from [`lib/http.ts`](../../app/lib/http.ts), never `new Response(…, { status })` inline. For any other single-record helper keep the same split: `getX` returns `null`/`undefined` when missing, `getXOrThrow` throws. Don't use `fetchX`, `loadX`, `getXOrFail`, or `getXIfExists`. Collection fetches keep natural plural names (`getProducts`, `listCollections`).

## GraphQL

- Document constants (`gql()` calls): **`SCREAMING_SNAKE_CASE`** ending in `_QUERY` / `_MUTATION` / `_FRAGMENT` (e.g. `PRODUCT_QUERY`, `PRODUCT_CARD_FRAGMENT`).
- Fragment names: **PascalCase** (`ProductCard`, `ColorSiblings`); the exported data type is `<Name>Data` (`ProductCardData`), read off `StorefrontApi.ResultOf`.
- Operation names: PascalCase (`query Product`). See [graphql-fragments.md](graphql-fragments.md).

## Files & routes

- Route files follow React Router's flat convention (`collections.$handle.tsx`, `journal.$handle.tsx`) — don't rename them by hand.
- Non-route files: `camelCase.ts` for utilities/logic (`colors.ts`), `PascalCase.tsx` for components.
- Typed content constants: `content/<topic>.ts` (e.g. `content/our-story.ts`).

## Variables & types

- `camelCase` for variables/functions, `PascalCase` for types and components.
- `Array<T>` over `T[]` for array annotations.
- Prefer `const`; avoid `let` where a functional expression reads as clearly.
- Booleans read as predicates: `isLoading`, `hasNextPage`, `canCheckout`.

## Why

The name should tell you null-safety and shape at the call site, so reviewers and Claude don't have to open the definition to know whether a value can be null or what a fragment contains.
