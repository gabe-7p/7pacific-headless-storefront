# 0009. Stay on the Hydrogen 2026-04 line; migrate to 2026-10 as a separate project

- **Status**: Superseded by [0010](0010-hydrogen-2026-10-library.md) (the migration shipped the same week)
- **Date**: 2026-10-31

## Context

On 2026-10-14 Shopify shipped Hydrogen **2026-10**, a rewrite: Hydrogen becomes a framework-agnostic _library_ composed into a plain React Router (or Next/Nuxt/…) app. It removes the framework surface this repo is built on — `createHydrogenContext`, the `hydrogen()` Vite plugin, `shopify hydrogen dev/build`, `Analytics.Provider`, `CartForm`/`useOptimisticCart`, `<Image>`, `<Money>`, `<Pagination>`, `getSitemap*`, `getSeoMeta`, the CSP/nonce helpers and `hydrogen-codegen` (replaced by gql.tada). Shopify now documents everything up to **2026.4.x** as "Legacy Hydrogen", with the note that existing storefronts "continue to work, no action required today". Storefront API 2026-04 is supported until at least April 2027.

The latest release on our line is **2026.4.8** (2026-10-21). npm's `latest` dist-tag points at 2026.10.2, and semver treats `2026.10` as a minor bump over `2026.4`, so a caret range silently installs the rewrite.

## Decision

1. **Upgrade in place to 2026.4.8** (Storefront API 2026-04, React Router 7.16, Vite 8, MiniOxygen 4.2, consent via the Customer Privacy API). Pin `@shopify/hydrogen` with a **tilde** (`~2026.4.8`) so no refresh can cross into 2026.10.
2. **Treat the 2026-10 migration as its own project**, scoped and sequenced separately (toolchain + request wiring → data layer → cart → PDP → collections/images/money → analytics + consent → sitemaps/CSP → docs), each step shippable to an Oxygen preview. The migration shape and the repo-specific change list are recorded in the PR that introduced this ADR.

## Consequences

- Easy: the upgrade is a dependency bump plus one Vite config change; every convention in `.claude/rules/` still holds.
- Cost: we are on a fixes-only line. New commerce capabilities (the shared Liquid-compatible cart contract, UCP/agentic checkout, the client-side cart and product-form stores, codegen-free typed GraphQL) land on 2026-10 only.
- Not doing: adopting React 19, React Router middleware (`future.v8_middleware`) or `@shopify/cli` 4.x/5.x on this line — those move together with the migration.
- `h2 upgrade` cannot be relied on for this line (its changelog feed ends at 2026.4.3); bumps are done by hand against the `2026-04` dist-tag.
