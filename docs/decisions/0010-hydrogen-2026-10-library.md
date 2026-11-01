# 0010. Hydrogen 2026-10: Hydrogen as a library inside a React Router app

- **Status**: Accepted — supersedes [0009](0009-stay-on-hydrogen-2026-04.md); refines [0004](0004-native-graphql-pattern.md) and [0008](0008-posthog-analytics.md)
- **Date**: 2026-11-01

## Context

Hydrogen 2026-10 (GA 2026-10-14) stops being a framework. The app owns `server.ts`, routing, the build and CSP; Hydrogen supplies commerce primitives that compose into one request lifecycle: a Storefront API client, request handlers for the URLs Shopify owns (`/api/cart`, checkout, cart and buy permalinks, the Storefront API proxy, MCP/UCP, `?variant=` redirects), a client-side cart store on the same "standard actions" contract Liquid themes use, a product-form store, an analytics bus with consent gating, and typed GraphQL through a TypeScript plugin. Everything up to 2026.4 is "Legacy Hydrogen": fixes only, no new commerce capability. [ADR 0009](0009-stay-on-hydrogen-2026-04.md) parked the move while the scope was understood; this ADR makes it.

Gabe's decisions going in (2026-10-31): React 19 first as its own PR; PostHog stays, but as a consent-gated destination on the bus with its SDK opted in from Customer Privacy ("Option C"); the cart keeps discount codes only — gift cards and the `/discount/:code` route go (no standard-action support), `/cart/ID:QTY` permalinks come from the library.

## Decision

Migrate to `@shopify/hydrogen` `^2026.10.2` on React Router 7.16 (`future.v8_middleware`), React 19, Vite 8, Shopify CLI 4.8, shipped as a stack: React 19 (#255) → repo-owned seams in front of every Hydrogen presentational API (#256) → the migration itself.

- **Request lifecycle** lives in the root middleware (`app/root.tsx`): one private Storefront client per request (`lib/storefront.ts`), `handleShopifyRoutes` before the router, `handleShopifyRedirects` after a 404, `applyResponseHeaders` on every response. `server.ts` only threads the Oxygen bindings.
- **Data** is `gql()` documents typed in place (`@shopify/hydrogen/ts-plugin`, `hydrogen gql check` in `pnpm type-check`); every read passes an explicit `cache`. Codegen, `storefrontapi.generated.d.ts`, `.graphqlrc.ts` and the IDE fragment mirror are gone.
- **Cart** is the client store: `CartProvider` seeded by the root loader, `useCart` everywhere, `useCartForm` line/discount forms posting to `/api/cart`. No `/cart` action route. Existing open carts were lost once at cutover (the cookie moved).
- **PDP** uses the product-form store: size values are real links that resolve client-side; add-to-cart is the store's form and opens the drawer after the cart handles it.
- **Presentation we own now**: `common/Image` (responsive `srcset`/`sizes`/crop, contract pinned by `Image.test.tsx`), `common/Price` + `lib/money.ts` on `formatMoney`, `collection/LoadMore` cursor pagination, `lib/sitemap.ts` (products, collections, pages and the journal), `lib/csp.ts` + `lib/nonce.tsx`.
- **Analytics**: `<ShopifyScripts consent={{ mode: 'default-banner' }}>` creates the bus; tracker components publish page, product, collection and cart views; `useCartAnalytics` publishes cart deltas; PostHog registers as a destination and its SDK follows `analyticsProcessingAllowed()` (`lib/posthog.client.ts`). Shopify's banner shows only where a visitor's region requires it.
- **Tooling**: `vite dev` / `react-router build` / `vite preview`; `shopify hydrogen deploy --assets-dir dist/client --worker-dir dist/server` in the Oxygen workflow; `hydrogen skills sync` keeps the packaged agent skills in `.claude/skills` (checked in CI).

## Consequences

- Easy: the commerce surface tracks Shopify's roadmap (agentic checkout, UCP, app-compatible cart) without replatforming again; size clicks and cart edits are instant; one fewer build step; agent skills ship with the package.
- Cost: more app-owned code (image, CSP, sitemaps, pagination) and a larger root middleware to understand; the consent gate means EU/UK funnel events in PostHog depend on the banner.
- Known sharp edges: the MiniOxygen `compatibilityDate` override in `vite.config.ts` (drop when MiniOxygen supports `2026-10-01`); `SESSION_SECRET` is unused but still set on Oxygen; the collection browse suite (filters/sort) is available but not adopted — merchandised order is still the product decision.
- Not doing: customer accounts, Shop Pay button, predictive search, markets — all available in the library when wanted.
