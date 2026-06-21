# Product module

Self-contained product feature. Import only via the public API (`~/modules/product`) — don't reach into `components/` or `lib/` from outside.

## What it owns

- `lib/colorMap.ts` — the typed source of truth for color hexes and the handle ↔ color mapping. 7Pacific models **each color as a separate Shopify product** (sibling handles like `…-mint`), not a variant — see [docs/decisions/0005-color-as-separate-product.md](../../../docs/decisions/0005-color-as-separate-product.md).
- `components/ColorSwatches.tsx` — renders a swatch per available color, each linking to the sibling color product.

## Keep in sync

When products or colors change in Shopify, update `lib/colorMap.ts` (`PRODUCT_COLOR_MAP`, `PRODUCT_TYPE_COLORS`, `COLOR_HEX`) in the same change. This file is hand-maintained — a stale map silently links swatches to the wrong/missing handles.

## Growing this module

As the PDP lands (Phase 4), add `ProductForm`, `SizeSelector`, gallery, etc. here under `components/`, with feature copy in `content/`. Reach for shadcn/ui primitives (`~/components/ui`) for behaviorally-hard widgets; hand-build brand visuals. Re-export the public pieces from `index.ts`.
