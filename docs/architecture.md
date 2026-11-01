# Architecture

How the 7Pacific Hydrogen storefront is put together. For day-to-day conventions see [CLAUDE.md](../CLAUDE.md) and [.claude/rules/](../.claude/rules/); for _why_ specific choices were made see [decisions/](decisions/README.md).

## The stack

| Layer     | Choice                                                                        |
| --------- | ----------------------------------------------------------------------------- |
| Framework | **React Router 7** (middleware) + **Hydrogen 2026.10** as a library, Vite 8   |
| Runtime   | Oxygen (Shopify's edge worker hosting)                                        |
| UI        | React 19 + **Tailwind CSS v4**; **shadcn/ui** (Radix) for headless primitives |
| Data      | Shopify **Storefront API** (guest checkout — no customer accounts)            |
| Types     | `gql()` documents typed in place by `@shopify/hydrogen/ts-plugin` (gql.tada)  |
| Language  | TypeScript (strict, `noUncheckedIndexedAccess`)                               |
| Tooling   | pnpm, ESLint (flat), Prettier, dependency-cruiser                             |

## Request & data flow

The app is **server-first**. Since Hydrogen 2026.10, Hydrogen is a library the app composes into one request lifecycle (the _root middleware_, [app/lib/shopifyMiddleware.ts](../app/lib/shopifyMiddleware.ts), registered by [app/root.tsx](../app/root.tsx)); it owns no routing, build or CSP.

```
Browser ── request ──▶ Oxygen worker (server.ts: env + sub-request cache + waitUntil on the router context)
                         │
                         ▼
              root middleware (app/lib/shopifyMiddleware.ts)
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
- **Analytics** go through the bus `<ShopifyScripts>` creates at `window.Shopify.analytics` (the bus helpers in [lib/analytics/shopify.ts](../app/lib/analytics/shopify.ts), tracker components in [components/analytics/Trackers.tsx](../app/components/analytics/Trackers.tsx)); destinations — Shopify's own analytics and PostHog ([lib/analytics/posthog.client.ts](../app/lib/analytics/posthog.client.ts), event names and property builders in [lib/analytics/posthog.events.ts](../app/lib/analytics/posthog.events.ts)) — receive events only once Customer Privacy allows. Anything that must wait for a piece of `window.Shopify` (the bus, Standard Actions, Customer Privacy) polls through the one helper in [lib/shopifyRuntime.ts](../app/lib/shopifyRuntime.ts).
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
    analytics/   Trackers (route-driven publishers to the Shopify analytics bus + the PostHog bridge)
    cart/        CartDrawer (the Aside drawer + useCartDrawer, the openCart target), CartMain / CartLineItem / CartSummary
    product/     PDP components (ProductForm, ColorSwatches, TechStack, …)
    collection/  ProductCard, MarketingSections
    home/        homepage sections
    content/     static-page compositions (OurStory, FirstLightTeaser, athlete-signing/ — the signing page as a root + one file per section)
    common/      shared primitives (Container, Heading, Cta, Prose, JoinForm + JoinDialog/useJoinDialog, …)
  content/       typed marketing copy + brand content: links.ts (HANDLES — the one place a Shopify handle lives — and STORE_LINKS), brand.ts (name, wordmark, announcement, social, fallback nav), media.ts (external media ids); athlete-signing/ = types + one file per athlete + the handle registry
  lib/           storefront.ts, i18n.ts (MARKET, MONEY_LOCALE, DATE_LOCALE), urls.ts (every URL shape), cart.server.ts, cart.ts, product/ (queries, store, content, display, colors), fragments.ts, csp.ts, sitemap.ts, shopifyRuntime.ts, … (+ colocated *.test.ts)
    analytics/   shopify.ts (the bus), posthog.ts (runtime config), posthog.client.ts / posthog.server.ts (the two SDKs), posthog.events.ts (event names + builders) — no barrel: client and server stay separate imports
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

> This is the target shape we migrate into as features mature; we don't pre-create empty module folders. Boundaries are enforced over time by [dependency-cruiser](../.dependency-cruiser.cjs).

## Domain model: color = separate product

The 9 live products are **separate Shopify products per color**, not Shopify variants. Color "swatches" navigate between sibling product handles; the family (names, hexes, ordered sibling references) lives in Shopify product metafields (`custom.color_*`), read via `lib/product/colors.ts`. Don't model color as a `ProductVariant` selectedOption. Rationale: [decisions/0005-color-as-separate-product.md](decisions/0005-color-as-separate-product.md).

## Environment & secrets

Configuration is via environment variables, listed below (shape in [app/lib/env.ts](../app/lib/env.ts); `server.ts` puts the worker env on the router context, and the middleware and loaders read it as `context.env` — declared in `env.d.ts`). `PUBLIC_*` vars are safe in the browser; `PRIVATE_STOREFRONT_API_TOKEN` is **server-only** and must never reach client code. Locally they live in gitignored `.env`; in production they're set per-environment in Oxygen (`shopify hydrogen env pull/push`). PostHog's `PUBLIC_POSTHOG_*` vars are read at request time (not inlined by Vite), so Production and Preview can point at different PostHog projects without a rebuild. See [ADR 0008](decisions/0008-posthog-analytics.md).

| Variable                          | Access | What it is                                                                                   |
| --------------------------------- | ------ | -------------------------------------------------------------------------------------------- |
| `PUBLIC_STORE_DOMAIN`             | public | myshopify domain, e.g. `7pacific.myshopify.com`                                              |
| `PUBLIC_STOREFRONT_API_TOKEN`     | public | Public Storefront API access token                                                           |
| `PRIVATE_STOREFRONT_API_TOKEN`    | secret | Private (delegate) Storefront API token, server-only                                         |
| `PUBLIC_STOREFRONT_ID`            | public | Numeric storefront id, used by Shopify Analytics                                             |
| `PUBLIC_CHECKOUT_DOMAIN`          | public | Checkout domain, used by the consent API and checkout links                                  |
| `PUBLIC_POSTHOG_KEY`              | public | PostHog project API key (`phc_…`); unset = PostHog off. Different key per Oxygen environment |
| `PUBLIC_POSTHOG_HOST`             | public | PostHog ingestion host, `https://us.i.posthog.com`                                           |
| `PUBLIC_POSTHOG_DEV`              | public | `true` to send events from `pnpm dev`; off by default, never set on Oxygen                   |
| `PUBLIC_META_PIXEL_ID`            | public | Meta Pixel ID, the same one the Facebook & Instagram app uses on checkout; unset = no pixel  |
| `PUBLIC_META_DOMAIN_VERIFICATION` | public | Optional Meta domain-verification token; renders the `facebook-domain-verification` meta tag |

`SESSION_SECRET` (the classic Hydrogen session cookie key) is no longer read anywhere — the store has no customer accounts and the cart is identified by Shopify's own cookies — so it can be deleted from every Oxygen environment.

## Deployment

Oxygen builds and deploys from GitHub ([the workflow](../.github/workflows/oxygen-deployment-1000149496.yml) runs `shopify hydrogen deploy --assets-dir dist/client --worker-dir dist/server`; the CLI runs `pnpm build` first and uploads React Router's `dist/client` assets and the `dist/server/index.js` worker):

- **Pull request** → Oxygen builds a **preview deployment** with its own URL. This is our primary way to verify a migrated unit against the real store (in place of E2E/visual-regression tooling for v1).
- **`main`** → **production** deployment.

CI ([.github/workflows/ci.yml](../.github/workflows/ci.yml)) runs the quality gate (skills check · type-check + `hydrogen gql check` · lint · format · deps · unit tests · build) on every PR independently of the Oxygen build.

## Migration context

This repo replaces a customized **Impulse v8** Liquid theme. The migration shipped **live pages only** (home, product, collection, our-story, contact, cart — no search route), English-only, with marketing copy as typed TS constants; post-migration surfaces (journal, drops teaser, athlete signing pages) have since been added on top. The original migration plan lives in Linear epic **GD-1** ("Refactor" project); each ticket maps _what exists now → what it becomes_ and ships independently.
