# 7Pacific Storefront — CLAUDE.md

Headless storefront for 7Pacific (DTC athletic apparel), migrated from a Shopify Liquid theme (Impulse) to **React Router 7 + Hydrogen (the 2026-10 library) on Oxygen**. We ship in small, independently deployable units — live pages only, English-only, marketing copy as typed TS constants.

This file is auto-loaded into every agent session. Read it first; follow the linked rules when a change touches their area.

## Stack

- **Framework**: React Router 7.16 (loaders/actions, server-first, root middleware) + **Hydrogen 2026.10** as a _library_ — the Storefront client, request handlers (`/api/cart`, checkout, permalinks, the Storefront API proxy), the client-side cart and product-form stores, and the analytics bus. React 19, Vite 8. Hydrogen owns no routing, build or CSP; the app does.
- **Hosting**: Oxygen (deploys from GitHub — preview per PR, production on `main`)
- **Data**: Shopify Storefront API 2026-10, typed in place by `@shopify/hydrogen/ts-plugin` (`gql()` documents, no codegen step; `hydrogen gql check` validates them). Guest checkout — no customer accounts
- **Styling**: Tailwind v4 (no CSS-in-JS, no runtime UI kit) + **shadcn/ui** for headless primitives — Radix behavior, vendored into `app/components/ui/` and styled with Tailwind
- **Language**: TypeScript (strict, `noUncheckedIndexedAccess`); package manager **pnpm**; Node 22

## Commands

| Task                           | Command                                                                                    |
| ------------------------------ | ------------------------------------------------------------------------------------------ |
| Dev server (mini-oxygen)       | `pnpm dev` (`vite dev`, http://localhost:3000)                                             |
| Build                          | `pnpm build` (`react-router build` → `dist/`)                                              |
| Preview the worker build       | `pnpm preview`                                                                             |
| Deploy to Oxygen (CI)          | `pnpm deploy`                                                                              |
| Type check + query check       | `pnpm type-check` (tsc + `hydrogen gql check`)                                             |
| Lint                           | `pnpm lint`                                                                                |
| Format                         | `pnpm prettier` / check: `pnpm prettier:check`                                             |
| Unit tests (Vitest)            | `pnpm test`                                                                                |
| Meta Pixel funnel (Playwright) | `pnpm test:pixel` (offline stub) / `pnpm test:pixel:live` — see docs/META_PIXEL_TESTING.md |
| Sync Hydrogen agent skills     | `pnpm exec hydrogen skills sync` (after a Hydrogen bump; `skills check` runs in CI)        |
| Dependency-boundary check      | `pnpm depcruise`                                                                           |
| Add a shadcn/ui primitive      | `pnpm dlx shadcn@latest add <name>`                                                        |
| Full pre-PR gate               | the `/check` command (mirrors CI)                                                          |

## Repo map

```
app/
  routes.ts      route config (flat-routes convention; Shopify-owned URLs are answered by the root middleware, not routes)
  routes/        one file per route (React Router flat convention); loader/action live here (+ colocated *.test.ts, ignored by routes.ts)
  components/    presentational only — layout/ analytics/ cart/ (CartDrawer + useCartDrawer, CartMain, CartLineItem, CartSummary) product/ collection/ home/ content/ common/ ui/ (generated shadcn primitives)
  content/       typed marketing copy + brand content — links.ts (`HANDLES` = the ONE place a Shopify handle lives + `STORE_LINKS`), brand.ts (name, wordmark, announcement, social, fallback nav), media.ts (external media ids), join.ts, membership.ts, …
  lib/           shopifyMiddleware.ts (the root middleware: Hydrogen's request lifecycle), storefront.ts (request-scoped client, router context, route templates), i18n.ts (`MARKET`, `MONEY_LOCALE`, `DATE_LOCALE`), urls.ts (every URL shape: `productUrl`, `collectionUrl`, `pageUrl`, `journalUrl`, `cartUrl`, `youtubeWatchUrl`), cart.server.ts (the `/api/cart` handlers) / cart.ts (the client store: `CartProvider`, `useCart`, `useCartForm`), product/ (PDP: queries.ts gql documents + types, store.ts product-form store, content.ts metafield JSON shapes, display.ts short titles/size labels, colors.ts swatches), fragments.ts (shared gql fragments + chrome queries), http.ts (notFound, deferQuery), csp.ts, sitemap.ts, shopifyRuntime.ts (the one wait-for-`window.Shopify` poll), analytics/ (shopify.ts = the bus, posthog.ts = config, posthog.client.ts / posthog.server.ts = the SDKs, posthog.events.ts = event names + builders, meta-pixel.ts = Meta event mapping + `toMetaContentId`, meta-pixel.client.ts = the pixel as a bus destination; no barrel — import by path), cross-cutting utils (+ colocated *.test.ts)
  assets/        bundled static assets imported by components (logo/tech-stack SVGs, favicon)
  styles/        tailwind.css — the single stylesheet (tokens + base layer; no other globals)
public/          static files served at the web root as-is (favicon.ico, llms.txt — the GEO brand summary, copy mirrors Notion)
*-graphql-env.d.ts Storefront API schema environments written by the Hydrogen ts-plugin (gitignored, never edit)
.claude/skills/  hydrogen-* + migrate-to-hydrogen-2026-10 are synced from the package (`hydrogen skills sync`) — never hand-edit
docs/            architecture.md, decisions/ (ADRs), META_PIXEL_TESTING.md (the pixel checklist), doc index + lookup table
e2e/             the Playwright Meta Pixel funnel test (`pnpm test:pixel`; playwright.config.ts at the root)
patches/         pnpm patches applied at install (`patchedDependencies` in pnpm-workspace.yaml) — today one: @react-router/dev 7.16's Vite `envFile` deprecation, dropped with the React Router 8 upgrade
.claude/         settings.json (hooks), commands/ (/check, /review_pr), rules/
```

`~/*` is the path alias for `app/*`. As a feature grows it can be promoted to a self-contained `app/modules/<feature>/` (public `index.ts` + components/lib/content) — see [docs/architecture.md](docs/architecture.md#the-module-pattern-how-features-grow).

## Conventions (the rules are the source of truth)

Full detail in [.claude/rules/](.claude/rules/) — read the relevant file before changing that area:

- [module-boundaries.md](.claude/rules/module-boundaries.md) — the root middleware builds the request-scoped Storefront client; loaders read it from `storefrontClientContext` and fetch; components render typed props; no GraphQL in components.
- [graphql-fragments.md](.claude/rules/graphql-fragments.md) — `gql()` documents with composed fragments, `Cache.long()/short()` on every read, types from `StorefrontApi.ResultOf`; never hand-write response types.
- [naming-conventions.md](.claude/rules/naming-conventions.md) — `const` arrow components, `getX`/`getXOrThrow`, fragment/query naming.
- [common-pitfalls.md](.claude/rules/common-pitfalls.md) — nullable Storefront fields, no waterfalls, never expose `PRIVATE_*`, no `any`.
- [ui-components.md](.claude/rules/ui-components.md) — when to reach for a shadcn/ui primitive vs. hand-build, how to add/restyle one, the `components/ui/` lint exemption.

The one-liners every agent must keep in mind: **components are `const` arrows (never `function`); fetching lives in loaders, not components; no `any`; every Storefront read passes an explicit `cache`; the cart is read with `useCart`, never a loader promise; images through `common/Image`, prices through `common/Price`; Tailwind for all styling — reach for a shadcn/ui primitive (in `components/ui/`) only for behaviorally-hard widgets, hand-build the rest.** ESLint, dependency-cruiser, and `/check` enforce these (`no-explicit-any` is a warning we treat as a defect; `components/ui/` is exempt from the const-arrow/no-`any` rules since it's generated).

## Brand single-sources (change once, applies everywhere)

Never hardcode brand values inline — edit the one source and every consumer follows:

- **Colors & font** → `app/styles/tailwind.css` `@theme`. Components reference **role tokens** — `bg-field`, `text-ink`, `text-support`, `border-border-subtle` (+ `-night` variants on dark surfaces) and the chrome tokens (`bg-nav`, `text-brand`, `bg-footer`, …) — **never raw palette names** (`court`/`carbon`/`graphite`/`zinc`/`ember`), so a palette revision edits tailwind.css only. Raw palette utilities are allowed only where the specific color is the point, with a comment at the call site.
- **Layout & motion** (page width, header/announcement heights, easing) → `app/styles/tailwind.css` `:root` (used via `max-w-(--page-max)`, `h-(--header-h)`, `ease-(--ease-brand)`; the sticky topbar offsets itself by `-top-(--announcement-h)`).
- **Brand content** (name, wordmark, announcement, social, fallback nav) → [app/content/brand.ts](app/content/brand.ts).
- **Shopify handles & URL shapes** → every handle (collections, the journal blog, the menus, the contact page) is a key of `HANDLES` in [app/content/links.ts](app/content/links.ts), and every path is built by [app/lib/urls.ts](app/lib/urls.ts) (`productUrl`, `collectionUrl`, `pageUrl`, `journalUrl`, `cartUrl`, `youtubeWatchUrl`) — `STORE_LINKS` composes the two. Never write `'/collections/…'`, `blog(handle: "journal")` or a template-literal path at a call site; GraphQL documents take the handle as a `$variable`.
- **Market & locales** → [app/lib/i18n.ts](app/lib/i18n.ts): `MARKET` (`@inContext` country/language for the Storefront client and `<ShopifyScripts>`), `MONEY_LOCALE` (prices), `DATE_LOCALE` (the journal strip — en-GB on purpose, day-first). The currency is read live from the shop, not fixed.
- **Signup** (the roster newsletter + the drop waitlist) → one flow: copy in [app/content/join.ts](app/content/join.ts), one `common/JoinForm` posting a `list` field to `/api/subscribe`, one `common/JoinDialog` (`useJoinDialog().open(list)`; `Cta` opens the newsletter for `NEWSLETTER_HREF`). Never add a second signup form or endpoint — add a list.
- **Media on Shopify Files** (every image/video/poster URL) → built by the helpers in [app/lib/shopifyFiles.ts](app/lib/shopifyFiles.ts) (`shopifyImage`, `shopifyVideo`, `shopifyVideoThumbnail`, …) from the filename or media id Files shows — never a pasted `https://cdn.shopify.com/…` string, so the CDN roots live in one place.
- **SEO** (title format, default meta) → [app/lib/seo.ts](app/lib/seo.ts) (`buildMeta()`).
- **Repeated UI** → shared components in `app/components/common/` (`Container`, `Logo`, `Heading`, `Cta`, `SpecLine`, `BrandDialog`, `Readout`, `Image`, `Price`). All titles render through `Heading` (multi-line via its `lines` prop); all CTAs through `Cta` (label in, arrow + variant handled once); mono spec-strip labels through `SpecLine`; night-tier modals through the `BrandDialog` shell; file/HUD chapter labels and corner brackets through `Readout`; every image through `Image` (`sizes` presets in `lib/imageSizes.ts`) and every price through `Price` — never hand-roll these class recipes at a callsite, and never import Hydrogen's `Image`/`Money` outside those two files.

## Domain note: color = separate product

The 9 live products are **separate Shopify products per color**, not variants. The color family lives in Shopify product metafields (`custom.color_name`/`color_hex`/`color_siblings`), read via `lib/product/colors.ts` — don't model color as a `ProductVariant` selectedOption.

## How to add/swap a product or color (Shopify-only — no deploy)

1. **Create the product** in Shopify admin (one product per color, handle ending in the color suffix, e.g. `…-slate`). Publish it to the **7Pacific Headless Storefront** channel.
2. **Set its color metafields**: `custom.color_name` ("Slate"), `custom.color_hex` (`#8A8F98`), `custom.color_siblings` (ordered list of ALL products in the color family, **including the new product itself**).
3. **Update every sibling's `custom.color_siblings`** to include the new product (the list is the swatch row, in display order).
4. **Set the PDP content metafields**: `custom.hero_image` + `custom.hero_image_mobile` (file_reference — the desktop/mobile PDP hero, falls back to the variant image if unset), `custom.spec_card` (JSON — the locked seven-key Spec Card: `fabric`/`weight`/`use`/`seams`/`pockets`/`fit`/`origin`; omit a key rather than invent a value, the row is skipped), and if it's a new product type also `custom.fit_note`, `custom.product_details` (JSON), `custom.tech_stack` (JSON), `custom.recommended_products`.
   - ⚠️ **`custom.product_details` is per-color, not per-product-type.** Its `imageUrl`s are absolute CDN URLs, so copying a sibling's JSON verbatim (the captions ARE shared) silently ships another color's photos on the PDP. Swap every `imageUrl` to that color's own shot; keep `caption`/`subcaption`. Nothing in code can catch this — product images carry no alt text, so there's no way to map a photo to a caption automatically.
5. **Add it to collections**: `baseline` (the shop-all collection page, titled BASELINE) and `homepage-first-drop` (drag into position — its order IS the homepage grid order).
6. Only if a CTA should target it: update [app/content/links.ts](app/content/links.ts) — the one place product/collection handles appear in code.

## Documentation discipline

**When you change code, update the documentation that describes it — in the same change, not later.** A PR that drifts from its docs is incomplete. Specifically:

- Changed a **convention or pattern**? Update the relevant `.claude/rules/*.md` (and the Cursor mirror at `.cursor/rules/code-style.mdc`) in the same commit.
- Added/renamed/moved a **script, command, env var, or top-level directory**? Update this `CLAUDE.md` (Commands / Repo map) and the env var table in [docs/architecture.md](docs/architecture.md#environment--secrets).
- Introduced a **new pattern worth following** (or a sharp edge worth avoiding)? Add it to the right rule file so the next agent inherits it.
- Made a **decision that wasn't obvious**? Record the _why_ where future readers will look (rule file, or `docs/` once it exists).

If a change makes any doc here wrong, fixing the doc is part of the task — treat stale docs as a defect, the same as a failing test. When unsure where something belongs, leave a clear note in the PR description.

## Further reading

- [README.md](README.md) — setup, dev, deploy (fresh clone → `pnpm dev`).
- [docs/](docs/README.md) — doc index + an "if working on X, read Y" lookup table.
- [docs/architecture.md](docs/architecture.md) — request/data flow, code organization, module pattern, deployment.
- [docs/decisions/](docs/decisions/README.md) — ADRs: the _why_ behind settled choices.
