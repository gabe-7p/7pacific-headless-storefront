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

## Adding a primitive

```bash
pnpm dlx shadcn@latest add <name>   # e.g. dialog, select, accordion, tooltip
```

It reads [`components.json`](../../components.json) (aliased to `~/*`, base color `neutral`, new-york style) and writes to `app/components/ui/`. Then restyle the generated classes to match the brand. Already scaffolded: `button`, `dialog`, `select`, `accordion`, `sheet`. (Add primitives only when a consumer exists — unused generated files get deleted.)

## Rules for `app/components/ui/`

- **Generated, not authored.** These files don't follow the repo's component conventions (they use the `function` keyword and occasional `any`). `app/components/ui/**` is therefore **exempt** in [eslint.config.js](../../eslint.config.js) from `react/function-component-definition` and `@typescript-eslint/no-explicit-any`. Don't "fix" generated files to use const arrows.
- **Restyle, don't re-architect.** Change Tailwind classes to match the brand; keep the Radix structure/behavior. If you need to update a primitive, re-run `shadcn add` and re-apply your styling rather than hand-patching internals.
- **Tokens live in `app/styles/tailwind.css`.** The shadcn base-color CSS variables (`--background`, `--primary`, `--border`, …) and the `@theme inline` mapping sit alongside the brand `@theme` tokens. They don't collide — keep both.
- **Primitives are still presentational.** No data fetching or GraphQL in `components/ui/` — same boundary as every other component (see [module-boundaries.md](module-boundaries.md)).

## Why this split

Hand-building everything means re-deriving focus/keyboard/ARIA mechanics for each modal and menu — slow and error-prone. Adopting a styled kit means fighting its look on a bespoke storefront. shadcn/ui threads the needle: Radix supplies the hard behavior, we supply the styling, and the source lives in our repo so nothing is locked away.
