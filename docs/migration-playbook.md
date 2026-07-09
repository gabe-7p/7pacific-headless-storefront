# Migration Playbook: Liquid → Hydrogen

The repeatable, step-by-step process for porting one page or component from the live Impulse
Liquid theme to this Hydrogen storefront with **high visual and functional fidelity**. Follow it in
order for every migration unit; don't skip the verification loop.

## Reference sources (the ground truth)

| Source                                                                  | Use it for                                                                        |
| ----------------------------------------------------------------------- | --------------------------------------------------------------------------------- |
| **Live storefront** — https://7pacificapparel.com                       | The source of truth for look, feel, spacing, type, color, motion, and behavior.   |
| **Liquid codebase** — `/Users/gabrieldalessandro/shopify-storefront-v2` | Section/snippet structure, exact asset names + their Shopify source, JS behavior. |
| This repo's `.claude/rules/*` + [CLAUDE.md](../CLAUDE.md)               | How the React/TS/Tailwind code must be written (boundaries, naming, fragments).   |

**Rule of the playbook: always compare against the live site, never against your memory of it.**
Open both side by side; re-screenshot after every change. "Close enough" is not done.

---

## 1. Pre-migration audit

Before writing any React, inventory the unit from the Liquid source so you know exactly what
you're reproducing. Produce a short written audit (in the PR description or a scratch note):

1. **Locate the Liquid source.** Find the section/snippet/template in
   `shopify-storefront-v2/{sections,snippets,templates,layout}/`. A live page's JSON template
   (`templates/*.json`) lists the sections it renders, in order — start there, then open each
   referenced `sections/*.liquid` and the `snippets/*.liquid` they `{% render %}`.
2. **Map structure.** Write the DOM/section tree: wrapper → blocks → elements. Note Liquid loops
   (`{% for %}`), conditionals (`{% if %}`), and `{% schema %}` settings that drive layout.
3. **Inventory styles.** Find the controlling CSS (theme stylesheet in `assets/`, inline
   `{% style %}`, or section settings). Record: container max-width, paddings/margins, font family
   - weights + sizes, colors (hex), breakpoints, hover/focus states, transitions/animations
     (duration + easing). Cross-check the live site's computed styles with DevTools — the Liquid
     source can lag what's deployed.
4. **Inventory assets.** List every image/SVG/video/icon the unit uses, by filename (see §2).
5. **Inventory behavior.** Note every interaction: hovers, clicks, drawers/modals, form submits,
   scroll effects, responsive changes, JS in `assets/*.js` (e.g. `color-map.js`, `theme.js`).
6. **Map data → Storefront API.** Decide what comes from a loader (products, menu, cart,
   metafields) vs. typed content constants (marketing copy → `content/*.ts` or `lib/brand.ts`).
7. **Flag deviations & unknowns.** If the live site differs from the Liquid source, the live site
   wins — record the deviation. If you can't find an asset or verify a behavior, flag it; don't guess.

**Audit checklist (all must be answered before coding):** source files found · structure mapped ·
styles recorded (incl. computed-from-live) · assets listed with Shopify source · behaviors listed ·
data source decided · deviations/unknowns flagged.

---

## 2. Asset handling (no placeholders, no regeneration)

Use the **same assets** as the live theme. Never substitute, recreate, approximate, or AI-generate
an asset.

1. **Find the reference in Liquid.** Search the Liquid repo for the asset name
   (`grep -r "white_logo" shopify-storefront-v2/`). Theme assets are referenced via
   `{{ 'name.svg' | asset_url }}` (theme `assets/`) or `{{ settings.x | image_url }}` /
   `{{ 'name.svg' | file_url }}` (Shopify **Files**, served from the CDN).
2. **Resolve to the Shopify source.** Theme-bundled assets live in
   `shopify-storefront-v2/assets/`. Files-hosted assets resolve to a CDN URL
   (`https://cdn.shopify.com/s/files/.../files/<name>`); grab the canonical file by name from
   Shopify Files / the live page's rendered `src`.
3. **Vendor into the build.** Put static brand assets in `app/assets/` and import them
   (`import whiteLogo from '~/assets/white_logo.svg'` → Vite returns a URL string). Storefront
   **product/CMS images come from the API** at render time — render those with Hydrogen's
   `<Image data={...} sizes="..." />`, not a vendored copy.
4. **Verify fidelity.** Confirm the vendored asset's intrinsic dimensions / viewBox match the
   original (set correct `width`/`height` to avoid layout shift). For multi-tone assets (e.g. the
   logo on light vs. dark backgrounds) vendor each variant — see [Logo.tsx](../app/components/common/Logo.tsx).
5. **If you can't locate it, stop and flag it** — do not ship a placeholder.

---

## 3. Implementation conventions

Translate Liquid into React + TypeScript following the repo rules (the rules files are the source
of truth — read the relevant one before changing that area).

- **Layering.** Data fetching/GraphQL lives in route **loaders/actions** and `app/lib/`; components
  are **presentational** and render typed props. No `context.storefront` or `#graphql` in a
  component. See [module-boundaries.md](../.claude/rules/module-boundaries.md).
- **GraphQL.** Co-located `#graphql` template strings ending `as const`; shared shapes are fragments
  in `app/lib/fragments.ts`; import generated types, never hand-write; run `pnpm graphql:generate`
  after edits. See [graphql-fragments.md](../.claude/rules/graphql-fragments.md).
- **Components.** `const` arrow functions, PascalCase, one per file; props as a `type`. Data helpers
  `getX` / `getXOrThrow` by null behavior. See [naming-conventions.md](../.claude/rules/naming-conventions.md).
- **Styling.** Tailwind v4 only — no inline `style={{}}` (the dynamic-color swatch is the one
  documented exception), no CSS-in-JS. Reach for a **shadcn/ui primitive** in `app/components/ui/`
  only for behaviorally-hard widgets (modal/drawer, dropdown, select, accordion, tooltip);
  hand-build everything visual. See [ui-components.md](../.claude/rules/ui-components.md).
- **Brand single-sources — never hardcode.** Colors/font → `app/styles/tailwind.css` `@theme`
  (use `bg-nav`, `text-brand`, …). Layout/motion (page width, header heights, easing) →
  `tailwind.css` `:root` (use `max-w-(--page-max)`, `h-(--header-h)`, `ease-(--ease-brand)`).
  Content/links (name, wordmark, announcement, social, newsletter, fallback nav) →
  [app/lib/brand.ts](../app/lib/brand.ts). SEO titles → [app/lib/seo.ts](../app/lib/seo.ts).
  Repeated UI → `app/components/common/` (`Container`, `Logo`, `Heading`). If a brand value would be
  reused, put it in its single source and import it — don't redefine it inline.
- **Content.** Marketing/product copy → typed `content/*.ts` constants, not JSX literals.
- **Domain gotcha.** Color = a separate Shopify product (not a variant); switch colors by navigating
  sibling handles via the `custom.color_siblings` metafield, read by [lib/colors.ts](../app/lib/colors.ts). See
  [common-pitfalls.md](../.claude/rules/common-pitfalls.md).
- **Nullability.** Storefront fields are mostly nullable and `noUncheckedIndexedAccess` is on —
  optional-chain and guard. Use `<Image>`/`<Money>`. Parallelize independent loader queries; defer +
  `.catch` below-the-fold data.

---

## 4. Visual verification loop (Playwright)

Iterate screenshot → compare → fix until the build matches the live page to **~98%**. Use the
Playwright MCP browser tools.

**Setup**

- Run the Hydrogen build locally (`pnpm dev`, default `http://localhost:3000`).
- **Every unit MUST be verified at BOTH viewports — this is non-negotiable, not desktop-only:**
  **mobile 390×844** and **desktop 1440×900**, with a fixed **deviceScaleFactor of 2** for both (so
  screenshots are directly comparable). A unit checked at only one viewport is not done. The live
  Liquid theme is responsive (different header, nav drawer, grid columns, and spacing per breakpoint),
  so a desktop-only pass will miss real mobile drift.
- Capture both **full-page** and **component-level** (scoped to the migrated unit's bounding box).

**Loop, per viewport**

1. `browser_resize` to the viewport, `browser_navigate` to the **live** URL, settle the page
   (`browser_wait_for` networkidle; dismiss cookie/popup overlays), `browser_take_screenshot`
   (full-page + the component) into the scratchpad as `live-<unit>-<viewport>.png`.
2. Repeat against `localhost` → `hydrogen-<unit>-<viewport>.png`.
3. **Compare.** Two-track:
   - **Structured visual checklist** (primary, see below) — go through it item by item.
   - **Pixel diff** (when you want a number): run `pixelmatch` (via a one-off Node script in the
     scratchpad, `pnpm dlx pixelmatch-cli` or `npx`) on same-size full-page PNGs →
     `% changed = diffPixels / totalPixels`. **98% accuracy = ≤2% changed pixels** AND zero failed
     checklist items in the layout/typography/color/asset categories.
4. **Identify diffs** in: layout & spacing, typography (family/size/weight/line-height/letter-
   spacing), color (background/text/border, exact hex), and assets (correct file, sized, no shift).
5. **Fix the code**, re-run the loop. Keep going — don't stop at the first acceptable-looking pass.

**Structured visual checklist (each must match the live site)**

- [ ] Container width, alignment, and outer padding match.
- [ ] Vertical rhythm: section padding, gaps between elements.
- [ ] Font family, size, weight, line-height, letter-spacing, case (uppercase/tracking).
- [ ] Colors: background, text, borders, hover/active states — exact hex.
- [ ] Assets: correct file, correct intrinsic size, no layout shift, crisp at 2×.
- [ ] Responsive: layout at mobile vs. desktop breakpoints matches.
- [ ] Interactive/visual states: hover, focus, open/closed, disabled.

**When a diff is ambiguous** (is it really off, or just anti-aliasing/dynamic content?): inspect
computed styles on both sides with `browser_evaluate` (`getComputedStyle`) and compare the actual
values rather than eyeballing pixels. Dynamic content (live prices, rotating hero) is expected to
differ — exclude those regions from the pixel diff and verify them structurally instead. If still
unsure, flag it in the PR rather than silently accepting it.

> Screenshots are scratch artifacts — keep them in the session scratchpad, never commit them.

---

## 5. Functional verification

Confirm behavior, not just looks, with Playwright + manual checks. **Run these at both the desktop
(1440×900) and mobile (390×844) viewports** — interactions differ by breakpoint (e.g. the desktop
nav becomes a mobile drawer, the cart opens differently), so each must be exercised at both sizes.

- **Navigation:** every link resolves to the right route; active states correct; prefetch works.
- **Cart:** add / update qty / remove; drawer opens with the line; badge count updates; checkout
  redirects. Use `browser_click` + `browser_wait_for`.
- **Forms:** newsletter/contact submit, validation errors, success state (assert the action runs and
  the response renders).
- **Hovers & transitions:** `browser_hover` the interactive elements; confirm the state change and
  that easing/duration match the live `--ease-brand` timing.
- **Responsive breakpoints:** resize across the mobile↔desktop boundary; confirm drawers/menus swap
  correctly.
- **Console & network:** `browser_console_messages` shows no errors; no failed GraphQL requests;
  codegen types resolve (`pnpm type-check`).

---

## 6. Definition of done

A migrated unit is complete only when **all** pass:

- [ ] Pre-migration audit written; deviations/unknowns flagged.
- [ ] Same assets as live (no placeholders/regenerated); correctly sized, no layout shift.
- [ ] Code follows the rules: loader/component boundary, fragments + generated types, `const` arrow
      components, Tailwind-only, brand values from their single source, copy in `content/`.
- [ ] Visual loop done at **BOTH** mobile (390×844) **and** desktop (1440×900), full-page + component:
      ≤2% pixel diff (excluding dynamic regions) **and** zero failed checklist items. One-viewport
      passes do not count.
- [ ] Functional verification passed at **both** viewports (nav, cart/forms as applicable, hovers,
      responsive drawer/menu swap, no console/network errors).
- [ ] Gate green: `pnpm type-check && pnpm lint && pnpm prettier:check && pnpm depcruise && pnpm build`
      (the `/check` command).
- [ ] Docs updated in the same change if a convention/pattern/asset/env/script changed
      (see [CLAUDE.md → Documentation discipline](../CLAUDE.md#documentation-discipline)).
- [ ] Oxygen preview deploy smoke-tested against the live store.

---

_This playbook is the standard process for the Impulse → Hydrogen migration. If you discover a
better step, update this file in the same PR._
