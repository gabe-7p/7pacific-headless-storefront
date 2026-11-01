# Module Boundaries: where data fetching and logic live

## Rule

Data fetching and GraphQL live in **route loaders/actions** and **`app/lib/`** (and a feature module's own `lib/`). The **root middleware** (`app/root.tsx`) is the one place the request-scoped Storefront client is built and Hydrogen's request handlers run; loaders read the client from `storefrontClientContext`. **UI components are presentational** — they receive already-fetched, typed data as props and never fetch it themselves. The one piece of client-owned data is the cart: components read it through `useCart` (the Hydrogen cart store), never through a loader.

## Layer responsibilities

| Layer                     | Location                                                                                                       | Does                                                                                                                            | Does NOT                                                                                                        |
| ------------------------- | -------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------- |
| **Middleware** (root)     | `app/root.tsx`                                                                                                 | Build the per-request Storefront client, run `handleShopifyRoutes` / `handleShopifyRedirects`, apply Shopify's response headers | Fetch page data, render                                                                                         |
| **Route** (loader/action) | `app/routes/*`                                                                                                 | Read params, `context.get(storefrontClientContext).graphql(...)`, shape the data the page needs, set `meta`                     | Render complex UI inline, hold business logic that belongs in `lib/`                                            |
| **Lib**                   | `app/lib/`, `app/modules/<m>/lib/`                                                                             | GraphQL fragments, query helpers, pure logic (e.g. `colors`), cross-component utilities                                         | Render JSX, import React components                                                                             |
| **Component**             | `app/components/*` (incl. generated shadcn primitives in `app/components/ui/`), `app/modules/<m>/components/*` | Render typed props with Tailwind, local UI state, accessibility; read the cart via `useCart`                                    | Fetch, define/run GraphQL (a `gql()` document would ship to the browser), reach into another module's internals |

## Examples

```tsx
// ❌ BAD — component fetches its own data
export const ProductCard = ({ handle }: { handle: string }) => {
  const { product } = useLoaderData<typeof loader>(); // not its data to own
  // ...
};

// ✅ GOOD — loader fetches, component renders typed props
// routes/collections.$handle.tsx
export async function loader({ context, params }: Route.LoaderArgs) {
  const { data } = await context.get(storefrontClientContext).graphql(COLLECTION_QUERY, {
    variables: { handle: params.handle },
    cache: Cache.short(),
  });
  if (!data?.collection) throw notFound();
  return { collection: data.collection };
}

// components/collection/ProductCard.tsx
export const ProductCard = ({ product }: { product: ProductCardData }) => {
  // pure render — no fetching, no GraphQL
};
```

## More boundaries

- **GraphQL documents never live in a component file.** Co-locate them in the loader that runs them, or — if shared — in `app/lib/fragments.ts` / `app/lib/productQueries.ts`; components import the exported _types_ only. See [graphql-fragments.md](graphql-fragments.md).
- **Shopify-owned URLs are not routes.** `/api/cart`, `/checkout`, cart and buy permalinks, the Storefront API proxy, `/api/mcp` and `?variant=` redirects are answered by `handleShopifyRoutes` in the root middleware; don't add route files for them.
- **Modules don't reach into each other's internals.** Import a module through its public entry, not deep paths into its `components/`/`lib/`.
- **Copy lives in `content/`, not JSX.** Marketing/product copy goes in typed `content/*.ts` constants, imported by the component.
- **Tailwind only — no inline `style={{}}` objects.** Use utility classes (and `clsx`/variants for conditional styling). This applies to the shadcn/ui primitives too: they're styled with Tailwind/`cn()`, not a runtime kit. Two data-driven exceptions: the swatch's `backgroundColor` and `common/Image`'s inline `width` + `aspect-ratio` (a per-image ratio from the source dimensions — and it deliberately beats an `aspect-*` utility on the call site, exactly as Hydrogen's classic `Image` did).
- **Reach for a shadcn/ui primitive only for behaviorally-hard widgets** (modal/drawer, dropdown, select, accordion, tooltip); hand-build visual/brand components. See [ui-components.md](ui-components.md).

## Enforcement

`dependency-cruiser` ([.dependency-cruiser.cjs](../../.dependency-cruiser.cjs)) fails the build on circular and (warns on) orphan modules. `pnpm depcruise` runs locally and in CI. As feature modules land, boundary rules (e.g. "components must not import the storefront client") are added there.

## Why

- **Reusable & isolated**: a presentational component renders from plain props, so it drops into any page (and any preview) without dragging data-fetching along.
- **Predictable**: a reader knows fetching is in loaders, rendering is in components — no hunting.
- **Cacheable & fast**: Hydrogen caches at the loader/query layer; scattering fetches into components defeats that and creates waterfalls.
