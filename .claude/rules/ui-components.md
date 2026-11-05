# UI Components: shadcn/ui primitives vs. hand-built

How we get accessible interactive widgets without giving up a custom, on-brand look. See ADR [0006](../../docs/decisions/0006-shadcn-ui-for-headless-primitives.md) for the _why_.

## The split: when to reach for a primitive

| You're building…                                                                                                                      | Use                                                 | Why                                                                                                                        |
| ------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| A **behaviorally-hard** interactive widget — modal/drawer, dropdown menu, popover, select, combobox, accordion, tabs, tooltip, toast  | A **shadcn/ui primitive** from `app/components/ui/` | Focus trap, return-focus, scroll-lock, keyboard nav, and ARIA are easy to get subtly wrong by hand. Radix gets them right. |
| Anything **visual / brand-facing** — buttons, cards, product grids, marketing sections, layout (`Box`/`Stack`/`Group`-style wrappers) | **Hand-built** with Tailwind                        | These are the brand. A kit would only get in the way; the win from a primitive (a11y mechanics) isn't there.               |

If a widget isn't on the left list, default to hand-building it with Tailwind.

## What shadcn/ui is here

It is **not a runtime UI kit**. The CLI copies component _source_ into `app/components/ui/`; we own and restyle that source. The only runtime deps are lightweight headless **Radix** primitives plus `class-variance-authority`, `clsx`, `tailwind-merge`, and `lucide-react` (icons). Tailwind v4 remains the **only** styling system — primitives are styled with the same utility classes as everything else, merged via [`cn()`](../../app/lib/cn.ts).

Enforced: `react/forbid-elements` blocks `<h1>`–`<h6>` outside `common/Heading`, `<img>` outside `common/Image`, and `<video>` outside `LazyVideo`/`ContentMedia`/`MediaSlot`/`Hero`/`FounderVideo`; `react/forbid-dom-props` blocks `style`. The "one brand CTA per page" rule is counted by the e2e `data-variant="brand"` assertions.

## Adding a primitive

```bash
pnpm dlx shadcn@latest add <name>   # e.g. dialog, select, accordion, tooltip
```

It reads [`components.json`](../../components.json) (aliased to `~/*`, base color `neutral`, new-york style) and writes to `app/components/ui/`. Then restyle the generated classes to match the brand. Already scaffolded: `button`, `dialog`, `sheet`. (Add primitives only when a consumer exists — unused generated files get deleted, which is how `select` and `accordion` went.)

**Brand CTAs render through [`common/Cta`](../../app/components/common/Cta.tsx), not raw `Button variant="brand"`.** `Cta` owns the CTA anatomy via `CtaLabel` (label + trailing `ArrowRight`; on hover/focus-visible the whole label slides right — a second arrow enters from the left edge while the trailing one exits, both clipped by the label's overflow-hidden wrapper; one transform, no opacity fades, `motion-reduce` swaps instantly. `CtaLabel` is size-agnostic: each Button `size` variant publishes the slide travel as `[--cta-slide:…]` (icon width + gap) and the label inherits the button's gap, so every per-size CTA fact lives on that one line in `button.tsx`). `Cta` renders a `Link`, `<a>`, or `<button>` from its props — so a device change is one edit, not a per-callsite hunt. The one exception is the PDP add-to-cart button in `product/AddToCartBar` (the product-form store's submit, `register('addToCart')`), which composes `buttonVariants({ variant: 'brand' })` + `CtaLabel` directly; the collection grid's `LoadMore` link does the same with `brand-outline`. Same principle for titles: every heading renders through `common/Heading` (`brand`/`quiet`/`caps` variants) — never retype heading classes. The one exception is `Prose`, which styles CMS-supplied HTML via `[&_h2]:` selectors and must mirror `Heading`'s weights manually.

**Terminology (keep comments consistent):** the CTA glyph is an **ArrowRight arrow-slide** — not a "chevron" (retired Aug 2026) and not a "bracket device". The display weight is **500 (Medium)** everywhere — the type system has no Bold display tier — with one scoped exception: **campaign/drop pages** (Gabe, Aug 2026). Their section titles use `Heading`'s `campaign` variant — Archivo **Narrow** (`--font-display-narrow`, `wdth` 87.5) at weight **450** with caps tracking — and their oversized stat figures render in full-width **Archivo Light** (`--font-archivo`) instead of the usual numbers-are-mono treatment. All three Archivo cuts (condensed 75 / narrow 87.5 / full 100) alias the same variable font file in `tailwind.css` — no new font ships. Don't reach for the campaign faces outside drop/campaign surfaces.

## Rules for `app/components/ui/`

- **Generated, not authored.** These files don't follow the repo's component conventions (they use the `function` keyword and occasional `any`). `app/components/ui/**` is therefore **exempt** in [eslint.config.js](../../eslint.config.js) from `react/function-component-definition` and `@typescript-eslint/no-explicit-any`. Don't "fix" generated files to use const arrows.
- **Restyle, don't re-architect.** Change Tailwind classes to match the brand; keep the Radix structure/behavior. If you need to update a primitive, re-run `shadcn add` and re-apply your styling rather than hand-patching internals.
- **Local deviations must be re-applied after a regenerate.** `sheet.tsx` carries four: an `overlayClassName` pass-through (the mobile menu doesn't dim the page, the cart drawer does), live's `CloseIcon` in place of lucide's `XIcon`, a `focus-visible:` ring on the close button (stock is `focus:`; `dialog.tsx` keeps the stock `focus:`), and a default `aria-describedby={undefined}` on `SheetContent`, ahead of the props spread, so no caller has to silence Radix's missing-description warning (a sheet that adds a `SheetDescription` passes its id through props). `dialog.tsx` carries none beyond the type-only `React` import (we run React 19, which the templates target, so the overlays are stock function components; the `forwardRef` wrappers the React 18 build needed are gone). `button.tsx` carries seven: the `brandCta` shared const + the three `brand*` variants built on it, the per-size `[--cta-slide:…]` vars, the `has-[>svg,>[data-cta-label]]:px-*` selector extensions, `lg` at brand height `h-9` (stock shadcn is `h-10`), and the single corner radius — the cva base declares `rounded-brand` (stock shadcn is `rounded-md`) and every size-variant `rounded-md` is stripped, so radius is declared in exactly one place. The sixth: `cursor-pointer` in the cva base. The seventh: the unused stock variants (`default`, `destructive`, `secondary`, `ghost`, `link`), the `icon*` sizes and every `dark:` utility are removed (nothing sets a `.dark` class; the default variant is `outline`). A `shadcn add` would silently drop all of these. Open question: dialogs close with lucide's `XIcon` while every drawer uses the traced `CloseIcon`; decide once which one both use.
- **A regenerated primitive's small radii render square.** shadcn's `--radius` chains to `--radius-brand` (2px), so `--radius-sm` and `--radius-md` resolve to 0 and a generated `rounded-sm` or `rounded-md` shows no corner, with no warning. `rounded-lg` is 2px and `rounded-xl` 6px. Set `rounded-brand` on a new primitive.
- **Tokens live in `app/styles/tailwind.css`.** The shadcn base-color CSS variables (`--background`, `--primary`, `--border`, …) and the `@theme inline` mapping sit alongside the brand `@theme` tokens. They don't collide — keep both.
- **Primitives are still presentational.** No data fetching or GraphQL in `components/ui/` — same boundary as every other component (see [module-boundaries.md](module-boundaries.md)).

## Drawers: `Aside` vs. composing `Sheet` directly

`layout/Aside` is the shared drawer, but it is a _fixed recipe_ — 350/450px wide, opaque
`bg-background`, an `h-16` left-aligned header with the floating `CloseIcon`, and a
`showHeader={false}` branch that also forces a transparent scrim. Reach for it when that
recipe is what you want (the cart, the mobile menu). When a drawer needs its own width,
ground, or header chrome, **compose `Sheet`/`SheetContent` directly the way `Aside` itself
does** rather than widening `Aside` with props for a single caller —
[`product/SizeGuide`](../../app/components/product/SizeGuide.tsx) is the worked example
(560px, centred title, text CLOSE via `SheetClose`, `showCloseButton={false}`).

Two gotchas either way: `sm:max-w-none` is required to beat the primitive's `sm:max-w-sm`,
and `gap-0 p-0` kills its flex gap and padding so each section can re-apply `px-5`. Neither needs
`aria-describedby={undefined}`: `SheetContent` defaults it.

**The size-guide drawer is the one translucent surface.** `bg-field/80` + `backdrop-blur-xs`
— everywhere else stays opaque (`--color-field` / `--color-field-night`), and faded Carbon
is banned outright in `tailwind.css`. It's an overlay _on_ the product, so the product reads
through it; don't spread the treatment to other panels without a reason that specific. The
measurement table outlines itself in `border-ink` for the same reason — at this alpha a
`border-border-subtle` frame loses its edge against whatever is showing through. Its interior
hairlines stay subtle, so the device reads as one table rather than a grid of boxes.

The `Sheet` scrim is what makes any of this survivable: the page is dimmed by `bg-black/50`
_before_ the panel composites over it, which holds the backdrop in a narrow band whatever
the hero behind it. Measured across the live PDPs at 80%, `text-support` lands 5.67–5.82:1
and `text-ink` 12.9–13.2:1. **70% was the floor** — it measured 4.89–5.09:1, clearing AA's
4.5:1 for the support tier by a hair and nothing more. Drop below that, or lose the scrim,
and the body copy fails. Re-measure the composite (not the token) before touching either.

## Ember is once per page — with one sanctioned exception

The accent appears once per page, and form errors don't claim it: they render through `common/FieldError` in `--color-error`, which sits on the support tier. The BASELINE drop page (`components/content/BaselineDrop.tsx`) deliberately repeats it (live dot, stat glyphs, per-piece Shop links) because the approved mock does; its one `brand` button is still the closer's SHOP THE DROP. Don't copy that onto other pages.

## File/HUD devices stay on night editorial surfaces

`common/Readout` (`SectionLabel`, `CornerBrackets`), the `--grain` photo veil
(`GrainVeil`, `GradedMedia grain`) and the `--file-grid` 72px ground in
`tailwind.css` are the "issued file" vocabulary from the brand world doc — numbered
chapters, mono readouts, a photo mount, grain over photography. They belong to the
night-surface editorial pages (athlete signings, Our Story) and assume a `field-night`
ground. Don't scatter them onto product or commerce surfaces, and keep grain on photos
only, never under body copy. Chapter numbers encode order in a file; don't number things
that aren't a sequence. `Readout`'s `TypeOnReadout` and `Caret` are the exception: they work
on either ground (the 404 is light, and the countdown uses the caret).

## Icons: match live, don't approximate

Header/drawer glyphs live in [`app/components/common/icons.tsx`](../../app/components/common/icons.tsx), traced from the live theme's sprite (all on a `64x64` viewBox). lucide's hamburger, person, bag, and X differ visibly in weight and shape, so **don't** substitute them there. `lucide-react` is still fine for incidental UI (chevrons, steppers, the mail glyph).

## Matching live: measure, don't eyeball

Parity work is driven by the rendered DOM, not screenshots alone. Read the live value with `getComputedStyle` / `getBoundingClientRect` at 375 / 768 / 1440, implement to that number, then re-measure. Screenshots confirm composition; they don't tell you a heading is weight 500 rather than 700, or that a breakpoint is 769px rather than 768px. Several audit tickets described the _symptom_ correctly but guessed the value — the measurement is the source of truth, and where they disagreed the ticket was corrected in the PR.

The verification loop (from the retired migration playbook):

- Check **both** viewports — mobile 390×844 and desktop 1440×900, `deviceScaleFactor` 2. A one-viewport pass doesn't count; live is responsive and a desktop-only pass misses mobile drift.
- Per viewport: screenshot live and local at the same size (full page + the unit's bounding box), then compare layout and spacing, typography, color and assets item by item. A pixel diff is optional (≤2% changed, dynamic regions excluded).
- Fix, re-run. Compare against the live site, never against memory.

## Why this split

Hand-building everything means re-deriving focus/keyboard/ARIA mechanics for each modal and menu — slow and error-prone. Adopting a styled kit means fighting its look on a bespoke storefront. shadcn/ui threads the needle: Radix supplies the hard behavior, we supply the styling, and the source lives in our repo so nothing is locked away.
