# Common Pitfalls

Stack-specific traps for this Hydrogen storefront. Check these before opening a PR.

## Never put GraphQL or fetching in a component

Data is fetched in loaders/actions and passed down as typed props. A component that calls `context.storefront` or defines a `#graphql` string is in the wrong layer — see [module-boundaries.md](module-boundaries.md).

## Handle nullable Storefront fields

The Storefront API makes most fields nullable, and `noUncheckedIndexedAccess` is on. Don't assume presence.

```ts
// ❌ BAD — image / first node may be undefined
const url = product.featuredImage.url;
const first = collection.products.nodes[0].title;

// ✅ GOOD
const url = product.featuredImage?.url;
const first = collection.products.nodes[0]?.title;
```

## Don't expose private tokens to the browser

`PUBLIC_*` env vars are safe client-side; `PRIVATE_STOREFRONT_API_TOKEN` and `SESSION_SECRET` are **server-only**. Never reference them in component code or pass them through loader return data.

## Avoid request waterfalls

Independent queries in a loader run in parallel; sequential `await`s serialize them.

```ts
// ❌ BAD — sequential
const product = await storefront.query(PRODUCT_QUERY, ...);
const recommended = await storefront.query(RECOMMENDED_QUERY, ...);

// ✅ GOOD — parallel
const [{ product }, { products: recommended }] = await Promise.all([
  storefront.query(PRODUCT_QUERY, ...),
  storefront.query(RECOMMENDED_QUERY, ...),
]);
```

## Defer below-the-fold data — and guard it

Critical (above-the-fold) data is `await`ed; below-the-fold data is returned as a promise and rendered with `<Suspense>`/`<Await>`. Deferred queries must `.catch` so a failure doesn't 500 the page.

```ts
const recommended = storefront.query(RECOMMENDED_QUERY, ...).catch((error: Error) => {
  console.error(error);
  return null;
});
```

## Regenerate types after editing any query/fragment

The typed result is keyed off the literal query string. After editing a `#graphql` string, run `pnpm graphql:generate` (or rely on `pnpm dev`/`build`, which run `--codegen`). A stale type is caught by `pnpm type-check` in CI.

## Use Hydrogen's `<Image>` and `<Money>`

Render Storefront images with `<Image data={...} sizes="..." />` (responsive srcset, CDN sizing) and prices with `<Money data={...} />` — don't hand-roll `<img>` or format currency manually.

## The "color = separate product" data model

The 9 live products are **separate Shopify products per color**, not variants. The color family (names, hexes, sibling links) lives in Shopify product metafields (`custom.color_*`), read via `lib/colors.ts`. Don't assume color is a `ProductVariant` selectedOption, and don't hardcode color/handle maps in the app.

## No `any`

`no-explicit-any` is a warning we treat as a defect — it hides type mismatches. Use `unknown` + narrowing, generics, or the generated types instead.

## Don't edit generated files

`storefrontapi.generated.d.ts` and `.react-router/types/*` are regenerated — edit the source query/fragment and re-run codegen.
