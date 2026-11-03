# Architecture

How the 7Pacific Hydrogen storefront is put together. For day-to-day conventions see [CLAUDE.md](../CLAUDE.md) and [.claude/rules/](../.claude/rules/); for _why_ specific choices were made see [decisions/](decisions/README.md).

## The stack

| Layer     | Choice                                                                                                                         |
| --------- | ------------------------------------------------------------------------------------------------------------------------------ |
| Framework | **React Router 8** (middleware) + **Hydrogen 2026.10** as a library, Vite 8                                                    |
| Runtime   | Oxygen (Shopify's edge worker hosting)                                                                                         |
| UI        | React 19 + **Tailwind CSS v4**; **shadcn/ui** (Radix) for headless primitives                                                  |
| Data      | Shopify **Storefront API** (guest checkout — no customer accounts)                                                             |
| Types     | `gql()` documents typed in place by `@shopify/hydrogen/ts-plugin` (gql.tada)                                                   |
| Language  | TypeScript (strict, `noUncheckedIndexedAccess`)                                                                                |
| Tooling   | pnpm, TypeScript (strict), ESLint (flat), Prettier, dependency-cruiser, Vitest, Playwright (pixel funnel), husky + lint-staged |

## Request & data flow

The app is **server-first**. Since Hydrogen 2026.10, Hydrogen is a library the app composes into one request lifecycle (the _root middleware_, [app/lib/shopifyMiddleware.ts](../app/lib/shopifyMiddleware.ts), registered by [app/root.tsx](../app/root.tsx)); it owns no routing, build or CSP.

```
Browser ── request ──▶ Oxygen worker (server.ts: env + sub-request cache + waitUntil on the router context)
                         │
                         ▼
              root middleware (app/lib/shopifyMiddleware.ts)
                ├─ data request? (`.data` — React Router 8 passes raw requests) → bodyless copy at the normalized `url` for Hydrogen
                ├─ createRequestStorefrontClient()        one private Storefront API client per request
                ├─ handleShopifyRoutes()  ──▶ answers Shopify-owned URLs before the router:
                │       /api/cart (cart store), /checkout, /cart/ID:QTY + /buy permalinks,
                │       /api/<version>/graphql.json proxy, /api/mcp, /.well-known/ucp, ?variant= redirects
                ├─ context.set(storefrontClientContext)   loaders read the client from here
                ├─ next()  ──▶  route loader  ──▶  client.graphql(DOC, { variables, cache })  ──▶  Storefront API
                │                  │
                │                  ▼   typed data → React components render (Tailwind + shadcn/ui) → HTML streamed
                ├─ 404? handleShopifyRedirects()          Shopify's URL redirect table, /admin
                └─ requestContext.applyResponseHeaders()  Shopify's cookies/cache headers onto every response
```

- **The cart lives in the browser.** The root loader seeds `CartProvider` with `cartHandlers.get()`; every cart surface reads `useCart(selector)` and mutates through `useCartForm` / the product form, which post to `/api/cart` (optimistic lines settle when the handler confirms). No `/cart` action route, no loader promise for the cart. The drawer is `components/cart/CartDrawer`: the header bag, the PDP add-to-cart and Shopify's `openCart` standard action all open it through `useCartDrawer()`.
- **The PDP's variant selection is client-side.** `ProductProvider` + `useProductForm` ([lib/product/store.ts](../app/lib/product/store.ts)) resolve option clicks against `adjacentVariants` / the encoded variant fields; `onSelect` rewrites the URL without a loader round-trip.
- **Every Storefront read passes an explicit `cache`** (`Cache.long()` for menus/pages/journal/recommendations, `Cache.short()` for the PDP product and collection grids). There is no implicit default; a read without one hits the API every request.
- **Critical (above-the-fold) data** is `await`ed in the loader; **below-the-fold data** is returned as a promise (through `deferQuery` in [lib/http.ts](../app/lib/http.ts)) and rendered with `<Suspense>`/`<Await>`.
- **Analytics** go through the bus `<ShopifyScripts>` creates at `window.Shopify.analytics` (the bus helpers in [lib/analytics/shopify.ts](../app/lib/analytics/shopify.ts), tracker components in [components/analytics/Trackers.tsx](../app/components/analytics/Trackers.tsx)); destinations — Shopify's own analytics, the Meta Pixel ([lib/analytics/meta-pixel.client.ts](../app/lib/analytics/meta-pixel.client.ts), event mapping in `meta-pixel.ts`, [ADR 0011](decisions/0011-meta-pixel-as-bus-destination.md)) and PostHog ([lib/analytics/posthog.client.ts](../app/lib/analytics/posthog.client.ts), event names and property builders in [lib/analytics/posthog.events.ts](../app/lib/analytics/posthog.events.ts)) — receive events only once Customer Privacy allows. Anything that must wait for a piece of `window.Shopify` (the bus, Standard Actions, Customer Privacy) polls through the one helper in [lib/shopifyRuntime.ts](../app/lib/shopifyRuntime.ts).
- **CSP and the nonce are app code** ([lib/csp.ts](../app/lib/csp.ts), [lib/nonce.tsx](../app/lib/nonce.tsx)), set in `entry.server.tsx`.

See [.claude/rules/module-boundaries.md](../.claude/rules/module-boundaries.md) for the loader-fetches / component-renders rule, and [.claude/rules/common-pitfalls.md](../.claude/rules/common-pitfalls.md) for caching, deferral, and nullability.

## GraphQL

Documents are `gql()` calls from `@shopify/hydrogen` — a query string plus the fragments it spreads — typed in place by the `@shopify/hydrogen/ts-plugin` entry in `tsconfig.json` (which writes the gitignored `*-graphql-env.d.ts` schema environments at the repo root). Shared fragments and the chrome queries live in [app/lib/fragments.ts](../app/lib/fragments.ts), the PDP's in [app/lib/product/queries.ts](../app/lib/product/queries.ts); result types come from `StorefrontApi.ResultOf<typeof DOC>`. `hydrogen gql check` (part of `pnpm type-check`) validates every document against the schema. Full rules: [.claude/rules/graphql-fragments.md](../.claude/rules/graphql-fragments.md).

## Code organization

Today the code is organized by **domain folders**:

```
app/
  routes/        one file per route (React Router flat convention)
  components/
    layout/      Header, Footer, PageLayout, Aside, Announcement
    analytics/   Trackers (route-driven publishers to the Shopify analytics bus + the PostHog and Meta Pixel bridges)
    cart/        CartDrawer (the Aside drawer + useCartDrawer, the openCart target), CartMain / CartLineItem / CartSummary
    product/     PDP components (ProductForm, ColorSwatches, TechStack, …)
    collection/  ProductCard, LoadMore
    home/        homepage sections
    content/     static-page compositions (OurStory, FirstLightTeaser, BaselineDrop, BaselineMasthead, NotFound, athlete-signing/ — the signing page as a root + one file per section)
    common/      shared primitives (Container, Heading, Cta, Prose, JoinForm + JoinDialog/useJoinDialog, …)
  content/       typed marketing copy + brand content: links.ts (HANDLES — the one place a Shopify handle lives — and STORE_LINKS), brand.ts (name, announcement, social, fallback nav), media.ts (external media ids); athlete-signing/ = types + one file per athlete + the handle registry
  lib/           (+ colocated *.test.ts)
    shopifyMiddleware.ts  the root middleware (Hydrogen's request lifecycle)
    storefront.ts   the request-scoped Storefront client, router context key, route templates
    oxygen.ts       the `oxygenContext` key: env + sub-request cache + waitUntil, set by server.ts
    cart.server.ts  the `/api/cart` handlers · cart.ts the client store (`CartProvider`, `useCart`, `useCartForm`)
    fragments.ts    shared gql fragments + chrome queries · http.ts `notFound`, `deferQuery`
    i18n.ts         MARKET, MONEY_LOCALE, DATE_LOCALE · money.ts price formats (`brand` / `compact` / `cart`)
    urls.ts         every URL shape · shopifyFiles.ts Shopify Files CDN helpers · imageSizes.ts `sizes` presets for common/Image
    seo.ts          page-title format, `buildMeta()` · sitemap.ts the sitemaps · csp.ts + nonce.tsx the CSP header and nonce
    shopifyRuntime.ts  the one wait-for-`window.Shopify` poll
    metafields.ts   metafield JSON/image parsing · countdown.ts drop-timer math · journalFormat.ts journal dates
    forms.ts        shared form primitives (email rule, `{ ok, errors }`) · cn.ts class merging
    product/        queries.ts (PDP gql documents + types), store.ts (product-form store), content.ts (metafield JSON shapes), display.ts (short titles/size labels), colors.ts (swatches)
    analytics/      shopify.ts (the bus), posthog.ts (runtime config), posthog.client.ts / posthog.server.ts (the two SDKs), posthog.events.ts (event names + builders), meta-pixel.ts (event mapping), meta-pixel.client.ts (the pixel as a bus destination) — no barrel: import by path
  styles/        tailwind.css — the single stylesheet (no separate globals)
```

Site chrome (announcement/header/footer) is applied globally: `root.tsx`'s `App` wraps every route's `<Outlet/>` in `PageLayout`. A route can opt out with `export const handle: RouteHandle = { chrome: false }` (type exported from `app/root.tsx`) — it then renders bare and owns its full page, including the `main` landmark. Used by one-off chrome-less pages like the athlete signing pages (`routes/athletes.$handle.tsx`).

### The module pattern (how features grow)

When a feature accumulates enough surface area to stand on its own, promote it to a self-contained module. (The PDP was trialed as `modules/product/` and deliberately dissolved back into `components/product/` + `lib/` while the app is this small — a half-adopted module boundary cost more than it bought. The pattern below remains the target shape if a feature genuinely outgrows the flat layout.)

```
app/modules/<feature>/
  index.ts        public API — the ONLY entry other code imports from
  components/      feature components
  lib/            feature data helpers + fragments
  content/        typed marketing/product copy constants (not inline in JSX)
  types.ts        feature-local types
  constants.ts    feature-local constants
  CLAUDE.md       module-level notes: what it owns, gotchas, "update me on change"
```

Rules for modules:

- **Other code imports a module only through its `index.ts`** — never reach into its `components/` or `lib/` internals.
- **Modules don't import each other's internals**; share through `app/lib/` or each module's public API.
- **Copy lives in `content/`**, not hardcoded in JSX (English-only typed constants for v1).
- A module owns a **module-level `CLAUDE.md`** so an agent working inside it gets focused context.

> This is the target shape we migrate into as features mature; we don't pre-create empty module folders. Boundaries will be enforced over time by [dependency-cruiser](../.dependency-cruiser.cjs) (layer rules are planned in [tech-debt-plan.md](tech-debt-plan.md); today it checks cycles and orphans).

## Domain model: color = separate product

Live products are **separate Shopify products per color**, not Shopify variants. Color "swatches" navigate between sibling product handles; the family (names, hexes, ordered sibling references) lives in Shopify product metafields (`custom.color_*`), read via `lib/product/colors.ts`. Don't model color as a `ProductVariant` selectedOption. Rationale: [decisions/0005-color-as-separate-product.md](decisions/0005-color-as-separate-product.md).

## Environment & secrets

Configuration is via environment variables, listed below (shape in the global `Env` interface in [env.d.ts](../env.d.ts); `server.ts` puts the worker bindings on the router context under the typed `oxygenContext` key ([app/lib/oxygen.ts](../app/lib/oxygen.ts), [ADR 0012](decisions/0012-react-router-8.md)), and the middleware, loaders and `entry.server` read `context.get(oxygenContext).env`). `PUBLIC_*` vars are safe in the browser; `PRIVATE_STOREFRONT_API_TOKEN` is **server-only** and must never reach client code. Locally they live in gitignored `.env`; in production they're set per-environment in Oxygen (`shopify hydrogen env pull/push`). PostHog's `PUBLIC_POSTHOG_*` vars are read at request time (not inlined by Vite), so Production and Preview can point at different PostHog projects without a rebuild — and `getPostHogConfig` (`lib/analytics/posthog.ts`) keeps PostHog off on `*.myshopify.dev` hosts regardless, so preview-deployment testing never shows up as shopper sessions even when an environment carries the production key. See [ADR 0008](decisions/0008-posthog-analytics.md).

| Variable                          | Access | What it is                                                                                            |
| --------------------------------- | ------ | ----------------------------------------------------------------------------------------------------- |
| `PUBLIC_STORE_DOMAIN`             | public | myshopify domain, e.g. `7pacific.myshopify.com`                                                       |
| `PUBLIC_STOREFRONT_API_TOKEN`     | public | Written by `hydrogen env pull`; unused by the app (private token only)                                |
| `PRIVATE_STOREFRONT_API_TOKEN`    | secret | Private (delegate) Storefront API token, server-only                                                  |
| `PUBLIC_STOREFRONT_ID`            | public | Numeric storefront id, used by Shopify Analytics                                                      |
| `PUBLIC_CHECKOUT_DOMAIN`          | public | Checkout domain, used by the consent API and checkout links                                           |
| `PUBLIC_POSTHOG_KEY`              | public | PostHog project API key (`phc_…`); unset = PostHog off. Only honoured on the custom domain            |
| `PUBLIC_POSTHOG_HOST`             | public | PostHog ingestion host, `https://us.i.posthog.com`                                                    |
| `PUBLIC_POSTHOG_DEV`              | public | `true` to also send from `pnpm dev` / `*.myshopify.dev` previews; off by default, never on Production |
| `PUBLIC_META_PIXEL_ID`            | public | Meta Pixel ID, the same one the Facebook & Instagram app uses on checkout; unset = no pixel           |
| `PUBLIC_META_DOMAIN_VERIFICATION` | public | Optional Meta domain-verification token; renders the `facebook-domain-verification` meta tag          |

`PUBLIC_CUSTOMER_ACCOUNT_API_CLIENT_ID`, `PUBLIC_CUSTOMER_ACCOUNT_API_URL`, `SHOP_ID` and `SESSION_SECRET` (the classic Hydrogen keys `hydrogen env pull` writes to `.env`) are not read anywhere — the store has no customer accounts and the cart is identified by Shopify's own cookies — so don't add them to Oxygen, and delete them from any environment that has them.

## Deployment

Oxygen builds and deploys from GitHub ([the workflow](../.github/workflows/oxygen-deployment-1000149496.yml) runs `shopify hydrogen deploy --assets-dir dist/client --worker-dir dist/server`; the CLI runs `pnpm build` first and uploads React Router's `dist/client` assets and the `dist/server/index.js` worker):

- **Pull request** → Oxygen builds a **preview deployment** with its own URL. This is our primary way to verify a migrated unit against the real store (in place of E2E/visual-regression tooling for v1).
- **`main`** → **production** deployment.

CI ([.github/workflows/ci.yml](../.github/workflows/ci.yml)) runs the quality gate (skills check · type-check + `hydrogen gql check` · lint · format · deps · unit tests · build) on every PR independently of the Oxygen build.

## Migration context

This repo replaces a customized **Impulse v8** Liquid theme; the port is complete (live pages only, English-only, marketing copy as typed TS constants — no search route). The historical process is in [migration-playbook.md](migration-playbook.md); the original plan lived in Linear epic **GD-1**.
