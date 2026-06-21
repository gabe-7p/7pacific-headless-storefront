# 7Pacific Storefront — CLAUDE.md

Headless storefront for 7Pacific (DTC athletic apparel), migrating from a Shopify Liquid theme (Impulse) to **Hydrogen + Oxygen**. We ship the migration as small, independently deployable units — live pages only, English-only, marketing copy as typed TS constants.

This file is auto-loaded into every agent session. Read it first; follow the linked rules when a change touches their area.

## Stack

- **Framework**: Hydrogen 2026.1.1 on React Router 7 (loaders/actions, server-first), React 18, Vite 6
- **Hosting**: Oxygen (deploys from GitHub — preview per PR, production on `main`)
- **Data**: Shopify Storefront API + Customer Account API, typed via `@shopify/hydrogen-codegen`
- **Styling**: Tailwind v4 (no CSS-in-JS, no UI kit)
- **Language**: TypeScript (strict, `noUncheckedIndexedAccess`); package manager **pnpm**; Node 22

## Commands

| Task                      | Command                                        |
| ------------------------- | ---------------------------------------------- |
| Dev server (mini-oxygen)  | `pnpm dev`                                     |
| Build                     | `pnpm build`                                   |
| Type check                | `pnpm type-check`                              |
| Lint                      | `pnpm lint`                                    |
| Format                    | `pnpm prettier` / check: `pnpm prettier:check` |
| Regenerate GraphQL types  | `pnpm graphql:generate`                        |
| Dependency-boundary check | `pnpm depcruise`                               |
| Full pre-PR gate          | the `/check` command (mirrors CI)              |

## Repo map

```
app/
  routes/        one file per route (React Router flat convention); loader/action live here
  components/    presentational only — layout/ cart/ product/ search/ common/
  lib/           fragments.ts, context.ts, session.ts, cross-cutting utils (+ colorMap.ts, future)
  graphql/       customer-account/ operations
  styles/        tailwind.css + minimal globals
*.generated.d.ts storefront / customer-account types (GENERATED — never edit)
.claude/         settings.json (hooks), commands/ (/check, /review_pr), rules/
```

`~/*` is the path alias for `app/*`.

## Conventions (the rules are the source of truth)

Full detail in [.claude/rules/](.claude/rules/) — read the relevant file before changing that area:

- [module-boundaries.md](.claude/rules/module-boundaries.md) — data fetching in loaders/`lib/`, components render typed props; no GraphQL in components.
- [graphql-fragments.md](.claude/rules/graphql-fragments.md) — co-located `#graphql` strings `as const` + codegen; import generated types, never hand-write.
- [naming-conventions.md](.claude/rules/naming-conventions.md) — `const` arrow components, `getX`/`getXOrThrow`, fragment/query naming.
- [common-pitfalls.md](.claude/rules/common-pitfalls.md) — nullable Storefront fields, no waterfalls, never expose `PRIVATE_*`, no `any`.

The one-liners every agent must keep in mind: **components are `const` arrows (never `function`); fetching lives in loaders, not components; no `any`; import generated GraphQL types; Tailwind only.** ESLint, dependency-cruiser, and `/check` enforce these.

## Domain note: color = separate product

The 9 live products are **separate Shopify products per color**, not variants. Color switching navigates between sibling handles via `lib/colorMap.ts` — don't model color as a `ProductVariant` selectedOption.

## Documentation discipline

**When you change code, update the documentation that describes it — in the same change, not later.** A PR that drifts from its docs is incomplete. Specifically:

- Changed a **convention or pattern**? Update the relevant `.claude/rules/*.md` (and the Cursor mirror at `.cursor/rules/code-style.mdc`) in the same commit.
- Added/renamed/moved a **script, command, env var, or top-level directory**? Update this `CLAUDE.md` (Commands / Repo map) and `.env.example`.
- Introduced a **new pattern worth following** (or a sharp edge worth avoiding)? Add it to the right rule file so the next agent inherits it.
- Made a **decision that wasn't obvious**? Record the _why_ where future readers will look (rule file, or `docs/` once it exists).

If a change makes any doc here wrong, fixing the doc is part of the task — treat stale docs as a defect, the same as a failing test. When unsure where something belongs, leave a clear note in the PR description.

> Note: a fuller `README.md` and `docs/` (setup, architecture, decision records) arrive in GD-7. Until then, this file is the entry point for both humans and agents.
