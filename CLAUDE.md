# 7Pacific Storefront — CLAUDE.md

Headless storefront for 7Pacific (DTC athletic apparel), migrated from a Shopify Liquid theme (Impulse) to **React Router 8 + Hydrogen (the 2026-10 library) on Oxygen**. We ship in small, independently deployable units — live pages only, English-only, marketing copy as typed TS constants.

This file is auto-loaded into every agent session. Read it first; follow the linked rules when a change touches their area.

## Stack

- **Framework**: React Router 8.5 (loaders/actions, server-first, root middleware; raw requests pass through, so routing logic reads the `url` arg) + **Hydrogen 2026.10** as a _library_ — the Storefront client, request handlers (`/api/cart`, checkout, permalinks, the Storefront API proxy), the client-side cart and product-form stores, and the analytics bus. React 19, Vite 8. Hydrogen owns no routing, build or CSP; the app does.
- **Hosting**: Oxygen (deploys from GitHub — preview per PR, production on `main`)
- **Data**: Shopify Storefront API 2026-10, typed in place by `@shopify/hydrogen/ts-plugin` (`gql()` documents, no codegen step; `hydrogen gql check` validates them). Guest checkout — no customer accounts
- **Styling**: Tailwind v4 (no CSS-in-JS, no runtime UI kit) + **shadcn/ui** for headless primitives — Radix behavior, vendored into `app/components/ui/` and styled with Tailwind
- **Language**: TypeScript (strict, `noUncheckedIndexedAccess`); package manager **pnpm**; Node 22

## Commands

| Task                           | Command                                                                                         |
| ------------------------------ | ----------------------------------------------------------------------------------------------- |
| Dev server (mini-oxygen)       | `pnpm dev` (`hydrogen skills check --mode=warn && vite dev`, http://localhost:3000)             |
| Build                          | `pnpm build` (`react-router build` → `dist/`)                                                   |
| Preview the worker build       | `pnpm preview`                                                                                  |
| Deploy to Oxygen (CI)          | `pnpm deploy`                                                                                   |
| Type check + query check       | `pnpm type-check` (`react-router typegen`, `tsc --noEmit`, `hydrogen gql check --fail-on-warn`) |
| Lint                           | `pnpm lint`                                                                                     |
| Format                         | `pnpm prettier` / check: `pnpm prettier:check`                                                  |
| Unit tests (Vitest)            | `pnpm test`                                                                                     |
| Meta Pixel funnel (Playwright) | `pnpm test:pixel` (offline stub) / `pnpm test:pixel:live` — see docs/META_PIXEL_TESTING.md      |
| Sync Hydrogen agent skills     | `pnpm exec hydrogen skills sync` (after a Hydrogen bump; `skills check` runs in CI)             |
| Dependency-boundary check      | `pnpm depcruise`                                                                                |
| Add a shadcn/ui primitive      | `pnpm dlx shadcn@latest add <name>`                                                             |
| Full pre-PR gate               | the `/check` command (mirrors CI)                                                               |

## Repo map

```
app/
  routes.ts      route config (flat-routes convention; Shopify-owned URLs are answered by the root middleware, not routes)
  routes/        one file per route (React Router flat convention); loader/action live here (+ colocated *.test.ts, ignored by routes.ts)
  components/    presentational only — layout/ analytics/ cart/ (CartDrawer, useCartDrawer.ts, CartMain, CartLineItem, CartSummary, CartError) product/ collection/ home/ content/ common/ ui/ (generated shadcn primitives)
  content/       typed marketing copy + brand content — links.ts (`HANDLES` = the ONE place a Shopify handle lives + `STORE_LINKS`), brand.ts (name, `siteUrl`, `provenance`, `shipping`, `seo`, announcement, footer labels, social, fallback nav), media.ts (external media ids), cart.ts (`CART_COPY`), join.ts, membership.ts, …
  lib/           request wiring (`shopifyMiddleware.ts`, `storefront.ts`, `oxygen.ts`, `csp.ts`), data (`fragments.ts`, `product/` incl. `product/page.ts`, `cart*.ts`; `cart.fixtures.ts` is test-only), `analytics/`, and cross-cutting helpers (`urls.ts`, `i18n.ts`, `money.ts`, `events.ts`, …) + colocated *.test.ts — file-by-file in [docs/architecture.md](docs/architecture.md#code-organization)
  assets/        bundled static assets imported by components (logo/tech-stack SVGs, favicon)
  styles/        tailwind.css — the single stylesheet (tokens + base layer; no other globals)
public/          static files served at the web root as-is (favicon.ico, og-home.jpg, topography.jpg, llms.txt — the GEO brand summary, copy mirrors Notion)
*-graphql-env.d.ts Storefront API schema environments written by the Hydrogen ts-plugin (gitignored, never edit)
.claude/skills/  hydrogen-* + migrate-to-hydrogen-2026-10 are synced from the package (`hydrogen skills sync`) — never hand-edit; `logs-*` and `replay-vision-*` are PostHog wizard output; `.agents/skills/` is a tracked twin written by the same sync
.codex/ .cursor/ .husky/ .vscode/  per-tool config (Codex/Cursor read CLAUDE.md; husky runs lint-staged on commit)
docs/            architecture.md, decisions/ (ADRs), runbooks/ (add-a-product), META_PIXEL_TESTING.md (the pixel checklist), tech-debt-plan.md (the cleanup backlog), migration-playbook.md (historical), doc index + lookup table
e2e/             the Playwright Meta Pixel funnel test (`pnpm test:pixel`; playwright.config.ts at the root)
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

The one-liners every agent must keep in mind: **components are `const` arrows (never `function`); fetching lives in loaders, not components; no `any`; every Storefront read passes an explicit `cache`; the cart is read with `useCart`, never a loader promise; images through `common/Image`, prices through `common/Price`; Tailwind for all styling — reach for a shadcn/ui primitive (in `components/ui/`) only for behaviorally-hard widgets, hand-build the rest.** ESLint and `/check` enforce these (dependency-cruiser layer rules will join them; see docs/tech-debt-plan.md) (`no-explicit-any` is a warning we treat as a defect; `components/ui/` is exempt from the const-arrow/no-`any` rules since it's generated).

## Brand single-sources (change once, applies everywhere)

Never hardcode brand values inline — edit the one source and every consumer follows:

- **Colors & font** → `app/styles/tailwind.css` `@theme`. Components reference **role tokens** — `bg-field`, `text-ink`, `text-support`, `border-border-subtle` (+ `-night` variants on dark surfaces) and the chrome tokens (`bg-nav`, `text-brand`, `bg-footer`, …) — **never raw palette names** (`court`/`carbon`/`graphite`/`zinc`/`ember`), so a palette revision edits tailwind.css only. Raw palette utilities are allowed only where the specific color is the point, with a comment at the call site.
- **Layout & motion** (page width, header/announcement heights, easing) → `app/styles/tailwind.css` `:root` (used via `max-w-(--page-max)`, `h-(--header-h)`, `ease-(--ease-brand)`; the sticky topbar offsets itself by `-top-(--announcement-h)`).
- **Brand content** (name, announcement, social, fallback nav) → [app/content/brand.ts](app/content/brand.ts); its facts are typed once and quoted everywhere: `BRAND.siteUrl` (origin), `BRAND.provenance` ("Designed in San Francisco"), `BRAND.shipping.threshold` (feeds the announcement and `BRAND.seo.defaultDescription`), `BRAND.footer` labels. Cart copy → [app/content/cart.ts](app/content/cart.ts) (`CART_COPY`); the error/404 strings → `MICROCOPY`. Marketing display prices → `PRODUCT_PRICES` in `content/links.ts` (keyed by the `STORE_LINKS` entry; mirrors Shopify).
- **Shopify handles & URL shapes** → every handle (collections, the journal blog, the menus, the contact page) is a key of `HANDLES` in [app/content/links.ts](app/content/links.ts), and every path is built by [app/lib/urls.ts](app/lib/urls.ts) (`productUrl`, `collectionUrl`, `pageUrl`, `journalUrl`, `cartUrl`, `dropUrl`, `athleteUrl`, `accountUrl`, `instagramProfileUrl`, `instagramPostUrl`, `youtubeWatchUrl`) — `STORE_LINKS` composes the two. Never write `'/collections/…'`, `blog(handle: "journal")` or a template-literal path at a call site; GraphQL documents take the handle as a `$variable`.
- **Market & locales** → [app/lib/i18n.ts](app/lib/i18n.ts): `MARKET` (`@inContext` country/language for the Storefront client and `<ShopifyScripts>`), `MONEY_LOCALE` (prices), `DATE_LOCALE` (the journal strip — en-GB on purpose, day-first). The currency is read live from the shop, not fixed.
- **Signup** (the roster newsletter + the drop waitlist) → one flow: copy in [app/content/join.ts](app/content/join.ts), one `common/JoinForm` posting a `list` field to `/api/subscribe`, one `common/JoinDialog` (`useJoinDialog().open(list)`; `Cta` opens the newsletter for `NEWSLETTER_HREF`). Never add a second signup form or endpoint — add a list.
- **Media on Shopify Files** (every image/video/poster URL) → built by the helpers in [app/lib/shopifyFiles.ts](app/lib/shopifyFiles.ts) (`shopifyImage`, `shopifyVideo`, `shopifyVideoThumbnail`, …) from the filename or media id Files shows — never a pasted `https://cdn.shopify.com/…` string, so the CDN roots live in one place. Content files hold images as `FilesImage` (`filesImage(filename, { v, width, height, alt })`) and image-or-video slots as `ContentMedia` (types in the same file); `common/ContentMedia` renders either (`LazyVideo` by default, a bare autoplay `<video>` only with `eager`).
- **SEO** (title format, default meta, canonical links) → [app/lib/seo.ts](app/lib/seo.ts) (`buildMeta()`; `buildMeta({ canonical: productUrl(handle) })` emits an absolute `<link rel="canonical">` on `BRAND.siteUrl` in [app/content/brand.ts](app/content/brand.ts), the one place the production origin is spelled).
- **Repeated UI** → shared components in `app/components/common/` (`Container`, `Logo`, `Heading`, `Cta`, `SpecLine`, `BrandDialog`, `Readout`, `Image`, `Price`). All titles render through `Heading` (multi-line via its `lines` prop); all CTAs through `Cta` (label in, arrow + variant handled once); mono spec-strip labels through `SpecLine`; night-tier modals through the `BrandDialog` shell; file/HUD chapter labels and corner brackets through `Readout`; every image through `Image` (`sizes` presets in `lib/imageSizes.ts`) and every price through `Price` — never hand-roll these class recipes at a callsite, never import `formatMoney` outside `lib/money.ts`, and never use a bare `<img>` outside `common/Image`.

## Domain note: color = separate product

Live products are **separate Shopify products per color**, not variants. The color family lives in Shopify product metafields (`custom.color_name`/`color_hex`/`color_siblings`), read via `lib/product/colors.ts` — don't model color as a `ProductVariant` selectedOption.

Adding/swapping a product or color is Shopify-only (no deploy) — see [docs/runbooks/add-a-product.md](docs/runbooks/add-a-product.md).

## Documentation discipline

**When you change code, update the documentation that describes it — in the same change, not later.** A PR that drifts from its docs is incomplete. Specifically:

- Changed a **convention or pattern**? Update the relevant `.claude/rules/*.md` in the same commit.
- Added/renamed/moved a **script, command, env var, or top-level directory**? Update this `CLAUDE.md` (Commands / Repo map) and the env var table in [docs/architecture.md](docs/architecture.md#environment--secrets).
- Introduced a **new pattern worth following** (or a sharp edge worth avoiding)? Add it to the right rule file so the next agent inherits it.
- Made a **decision that wasn't obvious**? Record the _why_ where future readers will look (rule file, or `docs/`).

If a change makes any doc here wrong, fixing the doc is part of the task — treat stale docs as a defect, the same as a failing test. When unsure where something belongs, leave a clear note in the PR description.

## Further reading

- [README.md](README.md) — setup, dev, deploy (fresh clone → `pnpm dev`).
- [docs/](docs/README.md) — doc index + an "if working on X, read Y" lookup table.
- [docs/architecture.md](docs/architecture.md) — request/data flow, code organization, module pattern, deployment.
- [docs/decisions/](docs/decisions/README.md) — ADRs: the _why_ behind settled choices.
