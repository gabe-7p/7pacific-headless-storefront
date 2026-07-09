# 7Pacific Storefront — CLAUDE.md

Headless storefront for 7Pacific (DTC athletic apparel), migrating from a Shopify Liquid theme (Impulse) to **Hydrogen + Oxygen**. We ship the migration as small, independently deployable units — live pages only, English-only, marketing copy as typed TS constants.

This file is auto-loaded into every agent session. Read it first; follow the linked rules when a change touches their area.

## Stack

- **Framework**: Hydrogen 2026.1.1 on React Router 7 (loaders/actions, server-first), React 18, Vite 6
- **Hosting**: Oxygen (deploys from GitHub — preview per PR, production on `main`)
- **Data**: Shopify Storefront API, typed via `@shopify/hydrogen-codegen` (guest checkout — no customer accounts)
- **Styling**: Tailwind v4 (no CSS-in-JS, no runtime UI kit) + **shadcn/ui** for headless primitives — Radix behavior, vendored into `app/components/ui/` and styled with Tailwind
- **Language**: TypeScript (strict, `noUncheckedIndexedAccess`); package manager **pnpm**; Node 22

## Commands

| Task                      | Command                                        |
| ------------------------- | ---------------------------------------------- |
| Dev server (mini-oxygen)  | `pnpm dev`                                     |
| Build                     | `pnpm build`                                   |
| Type check                | `pnpm type-check`                              |
| Lint                      | `pnpm lint`                                    |
| Format                    | `pnpm prettier` / check: `pnpm prettier:check` |
| Unit tests (Vitest)       | `pnpm test`                                    |
| Regenerate GraphQL types  | `pnpm graphql:generate`                        |
| Dependency-boundary check | `pnpm depcruise`                               |
| Add a shadcn/ui primitive | `pnpm dlx shadcn@latest add <name>`            |
| Full pre-PR gate          | the `/check` command (mirrors CI)              |

## Repo map

```
app/
  routes/        one file per route (React Router flat convention); loader/action live here
  components/    presentational only — layout/ cart/ product/ collection/ home/ content/ common/ ui/ (generated shadcn primitives)
  content/       typed marketing copy + store links (links.ts = the ONE place product/collection handles live)
  lib/           fragments.ts, context.ts, session.ts, colors.ts, productContent.ts, cross-cutting utils (+ colocated *.test.ts)
  styles/        tailwind.css + minimal globals
public/          static files served at the web root as-is (favicon.ico)
*.generated.d.ts storefront types (GENERATED — never edit)
docs/            architecture.md, decisions/ (ADRs), doc index + lookup table
.claude/         settings.json (hooks), commands/ (/check, /review_pr), rules/
```

`~/*` is the path alias for `app/*`. As a feature grows it can be promoted to a self-contained `app/modules/<feature>/` (public `index.ts` + components/lib/content) — see [docs/architecture.md](docs/architecture.md#the-module-pattern-how-features-grow).

## Conventions (the rules are the source of truth)

Full detail in [.claude/rules/](.claude/rules/) — read the relevant file before changing that area:

- [module-boundaries.md](.claude/rules/module-boundaries.md) — data fetching in loaders/`lib/`, components render typed props; no GraphQL in components.
- [graphql-fragments.md](.claude/rules/graphql-fragments.md) — co-located `#graphql` strings `as const` + codegen; import generated types, never hand-write.
- [naming-conventions.md](.claude/rules/naming-conventions.md) — `const` arrow components, `getX`/`getXOrThrow`, fragment/query naming.
- [common-pitfalls.md](.claude/rules/common-pitfalls.md) — nullable Storefront fields, no waterfalls, never expose `PRIVATE_*`, no `any`.
- [ui-components.md](.claude/rules/ui-components.md) — when to reach for a shadcn/ui primitive vs. hand-build, how to add/restyle one, the `components/ui/` lint exemption.

The one-liners every agent must keep in mind: **components are `const` arrows (never `function`); fetching lives in loaders, not components; no `any`; import generated GraphQL types; Tailwind for all styling — reach for a shadcn/ui primitive (in `components/ui/`) only for behaviorally-hard widgets, hand-build the rest.** ESLint, dependency-cruiser, and `/check` enforce these (`components/ui/` is exempt from the const-arrow/no-`any` rules since it's generated).

## Brand single-sources (change once, applies everywhere)

Never hardcode brand values inline — edit the one source and every consumer follows:

- **Colors & font** → `app/styles/tailwind.css` `@theme` (used via `bg-nav`, `text-brand`, `bg-footer`, …).
- **Layout & motion** (page width, header/announcement heights, easing) → `app/styles/tailwind.css` `:root` (used via `max-w-(--page-max)`, `h-(--header-h)`, `ease-(--ease-brand)`; `--topbar-h` is derived).
- **Content & links** (name, wordmark, announcement, social, newsletter, fallback nav) → [app/lib/brand.ts](app/lib/brand.ts).
- **SEO** (title format, default meta) → [app/lib/seo.ts](app/lib/seo.ts) (`pageTitle()`).
- **Repeated UI** → shared components in `app/components/common/` (`Container`, `Logo`, `Heading`) and brand `Button` variant.

## Domain note: color = separate product

The 9 live products are **separate Shopify products per color**, not variants. The color family lives in Shopify product metafields (`custom.color_name`/`color_hex`/`color_siblings`), read via `lib/colors.ts` — don't model color as a `ProductVariant` selectedOption.

## How to add/swap a product or color (Shopify-only — no deploy)

1. **Create the product** in Shopify admin (one product per color, handle ending in the color suffix, e.g. `…-slate`). Publish it to the **7Pacific Headless Storefront** channel.
2. **Set its color metafields**: `custom.color_name` ("Slate"), `custom.color_hex` (`#8A8F98`), `custom.color_siblings` (ordered list of ALL products in the color family, **including the new product itself**).
3. **Update every sibling's `custom.color_siblings`** to include the new product (the list is the swatch row, in display order).
4. **Set the PDP content metafields**: `custom.hero_image` + `custom.hero_image_mobile` (file_reference — the desktop/mobile PDP hero, falls back to the variant image if unset), and if it's a new product type also `custom.fit_note`, `custom.product_details` (JSON), `custom.tech_stack` (JSON), `custom.recommended_products`.
5. **Add it to collections**: `summer-25` (the shop-all collection page) and `homepage-first-drop` (drag into position — its order IS the homepage grid order).
6. Only if a CTA should target it: update [app/content/links.ts](app/content/links.ts) — the one place product/collection handles appear in code.

## Documentation discipline

**When you change code, update the documentation that describes it — in the same change, not later.** A PR that drifts from its docs is incomplete. Specifically:

- Changed a **convention or pattern**? Update the relevant `.claude/rules/*.md` (and the Cursor mirror at `.cursor/rules/code-style.mdc`) in the same commit.
- Added/renamed/moved a **script, command, env var, or top-level directory**? Update this `CLAUDE.md` (Commands / Repo map) and `.env.example`.
- Introduced a **new pattern worth following** (or a sharp edge worth avoiding)? Add it to the right rule file so the next agent inherits it.
- Made a **decision that wasn't obvious**? Record the _why_ where future readers will look (rule file, or `docs/` once it exists).

If a change makes any doc here wrong, fixing the doc is part of the task — treat stale docs as a defect, the same as a failing test. When unsure where something belongs, leave a clear note in the PR description.

## Further reading

- [README.md](README.md) — setup, dev, deploy (fresh clone → `pnpm dev`).
- [docs/](docs/README.md) — doc index + an "if working on X, read Y" lookup table.
- [docs/architecture.md](docs/architecture.md) — request/data flow, code organization, module pattern, deployment.
- [docs/decisions/](docs/decisions/README.md) — ADRs: the _why_ behind settled choices.
