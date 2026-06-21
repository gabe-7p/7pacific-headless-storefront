# 0005. Keep "color = separate product" data model for v1

- **Status**: Accepted
- **Date**: 2026-06-18

## Context

In the existing store, each color of a product is a **separate Shopify product** with its own handle and template — not a Shopify variant. The Liquid theme links siblings via `assets/color-map.js` (a hand-maintained map of handle ↔ color). The "correct" Shopify model would be one product with color as a variant option, but restructuring the catalog is risky (URLs, inventory, SEO, merchandising) and orthogonal to the front-end migration.

## Decision

**Preserve the existing data model for v1.** The PDP is a single `products.$handle` route; color swatches navigate between sibling handles using a typed `lib/colorMap.ts` (ported from `color-map.js`). Do not assume color is a `ProductVariant` selectedOption.

## Consequences

- The migration stays front-end-only; no catalog restructuring, no URL/SEO churn during the rebuild.
- `colorMap.ts` is hand-maintained and must be updated when products/colors change — it's a known sharp edge (flagged in [.claude/rules/common-pitfalls.md](../../.claude/rules/common-pitfalls.md)).
- Consolidating to single-product-with-variants remains a documented future option, out of scope for v1; a future ADR would supersede this one.
