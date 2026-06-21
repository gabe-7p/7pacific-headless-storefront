# Module Boundaries: where data fetching and logic live

## Rule

Data fetching and GraphQL live in **route loaders/actions** and **`app/lib/`** (and a feature module's own `lib/`). **UI components are presentational** — they receive already-fetched, typed data as props and never fetch it themselves.

## Layer responsibilities

| Layer                     | Location                                           | Does                                                                                                                       | Does NOT                                                                             |
| ------------------------- | -------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------ |
| **Route** (loader/action) | `app/routes/*`                                     | Read params, call `context.storefront`/`context.customerAccount`/`context.cart`, shape the data the page needs, set `meta` | Render complex UI inline, hold business logic that belongs in `lib/`                 |
| **Lib**                   | `app/lib/`, `app/modules/<m>/lib/`                 | GraphQL fragments, query helpers, pure logic (e.g. `colorMap`), cross-component utilities                                  | Render JSX, import React components                                                  |
| **Component**             | `app/components/*`, `app/modules/<m>/components/*` | Render typed props with Tailwind, local UI state, accessibility                                                            | Call `context.storefront`, define/run GraphQL, reach into another module's internals |

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
  const { collection } = await context.storefront.query(COLLECTION_QUERY, {
    variables: { handle: params.handle },
  });
  return { collection };
}

// components/product/ProductCard.tsx
export const ProductCard = ({ product }: { product: ProductCardFragment }) => {
  // pure render — no fetching, no GraphQL
};
```

## More boundaries

- **GraphQL strings never live in a component file.** Co-locate them in the loader that runs them, or — if shared — in `app/lib/fragments.ts`. See [graphql-fragments.md](graphql-fragments.md).
- **Modules don't reach into each other's internals.** Import a module through its public entry, not deep paths into its `components/`/`lib/`.
- **Copy lives in `content/`, not JSX.** Marketing/product copy goes in typed `content/*.ts` constants, imported by the component.
- **Tailwind only — no inline `style={{}}` objects.** Use utility classes (and `clsx`/variants for conditional styling).

## Enforcement

`dependency-cruiser` ([.dependency-cruiser.cjs](../../.dependency-cruiser.cjs)) fails the build on circular and (warns on) orphan modules. `pnpm depcruise` runs locally and in CI. As feature modules land, boundary rules (e.g. "components must not import the storefront client") are added there.

## Why

- **Testable**: presentational components render from mock props with no network; loaders are tested separately.
- **Predictable**: a reader knows fetching is in loaders, rendering is in components — no hunting.
- **Cacheable & fast**: Hydrogen caches at the loader/query layer; scattering fetches into components defeats that and creates waterfalls.
