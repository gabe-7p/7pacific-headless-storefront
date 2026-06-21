# Naming Conventions

## Components

- **`const` arrow functions, PascalCase**, one component per file, file named after the component (`ProductCard.tsx` → `export const ProductCard = ...`). Never the `function` keyword — enforced by `react/function-component-definition`.
- Props type is `type` (not `interface`), named `<Component>Props` when it needs a name, or inlined for tiny components.

## Data helpers: `getX` vs `getXOrThrow`

Single-record fetch/lookup helpers reveal their not-found behavior in the name:

- **Returns `null`/`undefined` when missing → plain `getX`.**
- **Throws when missing → `getXOrThrow`.**

```ts
// ✅ returns null when not found — caller must check
export const getProductByHandle = async (
  { handle }: { handle: string },
  storefront: Storefront
) => {
  const { product } = await storefront.query(PRODUCT_QUERY, { variables: { handle } });
  return product; // may be null
};

// ✅ throws when not found — caller gets a guaranteed value
export const getProductByHandleOrThrow = async (
  { handle }: { handle: string },
  storefront: Storefront
) => {
  const product = await getProductByHandle({ handle }, storefront);
  if (!product) throw new Response('Product not found', { status: 404 });
  return product;
};
```

Don't use `fetchX`, `loadX`, `getXOrFail`, or `getXIfExists` for single-record fetches. Collection fetches keep natural plural names (`getProducts`, `listCollections`).

## GraphQL

- Query/mutation string constants: **`SCREAMING_SNAKE_CASE`** ending in `_QUERY` / `_MUTATION` / `_FRAGMENT` (e.g. `PRODUCT_QUERY`, `CART_QUERY_FRAGMENT`).
- Fragment names: **PascalCase** (`ProductCard`, `CollectionCard`) → codegen emits `ProductCardFragment`.
- Operation names: PascalCase (`query Product` → `ProductQuery`). See [graphql-fragments.md](graphql-fragments.md).

## Files & routes

- Route files follow React Router's flat convention (`collections.$handle.tsx`, `account.orders._index.tsx`) — don't rename them by hand.
- Non-route files: `camelCase.ts` for utilities/logic (`colorMap.ts`), `PascalCase.tsx` for components.
- Typed content constants: `content/<topic>.ts` (e.g. `content/our-story.ts`).

## Variables & types

- `camelCase` for variables/functions, `PascalCase` for types and components.
- `Array<T>` over `T[]` for array annotations.
- Prefer `const`; avoid `let` where a functional expression reads as clearly.
- Booleans read as predicates: `isLoading`, `hasNextPage`, `canCheckout`.

## Why

The name should tell you null-safety and shape at the call site, so reviewers and Claude don't have to open the definition to know whether a value can be null or what a fragment contains.
