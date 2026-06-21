# 0006. shadcn/ui for headless primitives

- **Status**: Accepted (refines [0002](0002-tailwind-for-styling.md))
- **Date**: 2026-06-20

## Context

ADR [0002](0002-tailwind-for-styling.md) chose Tailwind and "no UI kit," noting that shared primitives (Button, Accordion, etc.) would be "built into `components/ui/` rather than imported from a kit." Building those from scratch means re-deriving the hard parts of interactive widgets — focus traps, return-focus, scroll-lock, keyboard navigation, ARIA — for every modal, drawer, dropdown, and select. That's slow and easy to get subtly wrong (our hand-rolled `Aside` drawer had no focus trap or return-focus). A styled runtime kit (Mantine, MUI) would solve a11y but impose an aesthetic we'd fight on a bespoke storefront, and add client hydration cost against a server-first stack.

## Decision

Adopt **shadcn/ui** for the small set of behaviorally-hard primitives (dialog/drawer, select, dropdown-menu, accordion, tooltip, button to start). shadcn is **not a runtime kit** — its CLI copies component _source_ into `app/components/ui/`, depending only on lightweight headless **Radix** primitives plus `class-variance-authority`/`clsx`/`tailwind-merge`/`lucide-react`. We own and restyle that source. **Tailwind v4 stays the only styling system**; visual/brand components are still hand-built. This is exactly the `components/ui/` outcome ADR 0002 anticipated, with Radix supplying behavior instead of us hand-writing it. See [.claude/rules/ui-components.md](../../.claude/rules/ui-components.md).

## Consequences

- Accessible, correct interactive widgets without fighting a kit's look; the source lives in our repo (`components/ui/`), styled with `cn()` + Tailwind.
- `components/ui/**` is generated and exempt from the const-arrow / no-`any` ESLint rules; we restyle but don't re-author it, and update by re-running `shadcn add`.
- New deps: Radix, `class-variance-authority`, `tailwind-merge`, `lucide-react`, `tw-animate-css`. shadcn base-color tokens live in `app/styles/tailwind.css` alongside the brand `@theme` tokens.
- Not doing: adopting a runtime styled kit, or using shadcn for brand/visual components — those stay hand-built in Tailwind.
