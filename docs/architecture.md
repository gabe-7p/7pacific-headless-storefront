# Architecture

How the 7Pacific Hydrogen storefront is put together. For day-to-day conventions see [CLAUDE.md](../CLAUDE.md) and [.claude/rules/](../.claude/rules/); for _why_ specific choices were made see [decisions/](decisions/README.md).

## The stack

| Layer     | Choice                                                                        |
| --------- | ----------------------------------------------------------------------------- |
| Framework | Hydrogen 2026.1 on **React Router 7** (not Remix), Vite 6                     |
| Runtime   | Oxygen (Shopify's edge worker hosting)                                        |
| UI        | React 18 + **Tailwind CSS v4**; **shadcn/ui** (Radix) for headless primitives |
| Data      | Shopify **Storefront API** (guest checkout — no customer accounts)            |
| Types     | `@shopify/hydrogen-codegen` → `*.generated.d.ts`                              |
| Language  | TypeScript (strict, `noUncheckedIndexedAccess`)                               |
| Tooling   | pnpm, ESLint (flat), Prettier, dependency-cruiser                             |

## Request & data flow

Hydrogen is **server-first**. Data is fetched on the edge in route loaders/actions; components only render.

```
Browser ── request ──▶ Oxygen worker
                         │
                         ▼
              route loader / action  ──▶  context.storefront.query(...)  ──▶  Shopify Storefront API
                         │                 context.cart
                         ▼
              typed data returned to the route
                         │
                         ▼
              React components render (Tailwind + shadcn/ui primitives)  ──▶  HTML streamed to browser
```

- **`context`** (built in [app/lib/context.ts](../app/lib/context.ts)) exposes `storefront`, `cart`, `session`, and `env` to every loader/action.
- **Critical (above-the-fold) data** is `await`ed in the loader; **below-the-fold data** is returned as a promise and rendered with `<Suspense>`/`<Await>` so it doesn't block first byte.
- **Independent queries run in parallel** (`Promise.all`) to avoid request waterfalls.

See [.claude/rules/module-boundaries.md](../.claude/rules/module-boundaries.md) for the loader-fetches / component-renders rule, and [.claude/rules/common-pitfalls.md](../.claude/rules/common-pitfalls.md) for caching, deferral, and nullability.

## GraphQL

Queries are co-located `#graphql` tagged-template `const`s ending in `as const`; shared shapes are fragments in [app/lib/fragments.ts](../app/lib/fragments.ts). `pnpm graphql:generate` reads those strings and emits typed results into `storefrontapi.generated.d.ts`, which you import from — never hand-write response types. Full rules: [.claude/rules/graphql-fragments.md](../.claude/rules/graphql-fragments.md).

## Code organization

Today the code is organized by **domain folders**:

```
app/
  routes/        one file per route (React Router flat convention)
  components/
    layout/      Header, Footer, PageLayout, Aside, NewsletterPopup, Announcement
    cart/        cart UI
    product/     PDP components (ProductForm, ColorSwatches, TechStack, …)
    collection/  ProductCard, MarketingSections
    home/        homepage sections
    content/     static-page compositions (OurStory)
    common/      shared primitives (Container, Heading, Prose, TextLink, Eyebrow, …)
  content/       typed marketing copy + store links (links.ts)
  lib/           fragments.ts, context.ts, session.ts, colors.ts, metafields.ts, seo.ts, … (+ colocated *.test.ts)
  styles/        tailwind.css + globals
```

Site chrome (announcement/header/footer) is applied globally: `root.tsx`'s `App` wraps every route's `<Outlet/>` in `PageLayout`. A route can opt out with `export const handle: RouteHandle = { chrome: false }` (type exported from `app/root.tsx`) — it then renders bare and owns its full page, including the `main` landmark. Used by one-off chrome-less pages like `routes/amir-smith.tsx`.

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

The 9 live products are **separate Shopify products per color**, not Shopify variants. Color "swatches" navigate between sibling product handles; the family (names, hexes, ordered sibling references) lives in Shopify product metafields (`custom.color_*`), read via `lib/colors.ts`. Don't model color as a `ProductVariant` selectedOption. Rationale: [decisions/0005-color-as-separate-product.md](decisions/0005-color-as-separate-product.md).

## Environment & secrets

Configuration is via environment variables ([.env.example](../.env.example) documents each). `PUBLIC_*` vars are safe in the browser; `PRIVATE_STOREFRONT_API_TOKEN` and `SESSION_SECRET` are **server-only** and must never reach client code. Locally they live in gitignored `.env`; in production they're set per-environment in Oxygen (`shopify hydrogen env pull/push`).

## Deployment

Oxygen builds and deploys from GitHub:

- **Pull request** → Oxygen builds a **preview deployment** with its own URL. This is our primary way to verify a migrated unit against the real store (in place of E2E/visual-regression tooling for v1).
- **`main`** → **production** deployment.

CI ([.github/workflows/ci.yml](../.github/workflows/ci.yml)) runs the quality gate (type-check · lint · format · deps · unit tests · build) on every PR independently of the Oxygen build.

## Migration context

This repo replaces a customized **Impulse v8** Liquid theme. We migrate **live pages only** (home, product, collection, our-story, contact, cart, search), English-only, with marketing copy as typed TS constants. The full migration plan lives in Linear epic **GD-1** ("Refactor" project); each ticket maps _what exists now → what it becomes_ and ships independently.
