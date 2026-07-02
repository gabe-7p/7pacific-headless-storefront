# 0007. Motion for animation (not GSAP)

- **Status**: Accepted (extends [0002](0002-tailwind-for-styling.md))
- **Date**: 2026-06-26

## Context

The storefront is a bespoke DTC athletic-apparel brand, and motion is where "premium" is felt — scroll reveals, cart/drawer transitions, product and hover micro-interactions. Tailwind (ADR [0002](0002-tailwind-for-styling.md)) handles static styling but not orchestrated, interruptible, gesture-driven animation. We evaluated two real options: **Motion** (the React library formerly published as Framer Motion) and **GSAP** + ScrollTrigger.

GSAP's ScrollTrigger is best-in-class for pinned/scrubbed scroll choreography, but its model is imperative — refs, timelines built in effects, manual cleanup — which sits awkwardly against our "components are presentational, render typed props" boundary ([module-boundaries.md](../../.claude/rules/module-boundaries.md)). Motion is declarative (`<m.div animate=…>`), so animation reads as more props/JSX, and it covers the 80% a storefront actually needs: `AnimatePresence` exit animations (cart drawer / `Aside`), `whileHover`/`whileTap`/drag gestures, `whileInView` scroll reveals, and layout animations. It also ships a `LazyMotion` path that loads only the feature set we use (~5–15kb vs the full ~34kb), which matters on a server-first Oxygen edge stack — the same payload concern that drove ADR 0002.

## Decision

Adopt **Motion** (`motion`, imported via `motion/react`) as the storefront's animation library. Use it through the brand wrapper in [app/components/common/Motion.tsx](../../app/components/common/Motion.tsx): a strict `<LazyMotion features={domAnimation}>` provider plus `m.*` components (never the full `motion.*`), so the small feature bundle is enforced. Animation vocabulary (easing, durations, the `FadeIn` reveal) is single-sourced there, the same way `tailwind.css @theme` single-sources color. Tailwind v4 remains the only styling system; Motion adds behavior, not styling.

**We are not adopting GSAP.** It was removed (the `greensock/gsap-skills` marketplace and its tooling). If we later build a signature scroll set-piece that genuinely needs pinning/scrubbing (Motion's one real gap), we'll revisit GSAP scoped to that single component — not as a general dependency.

## Consequences

- Declarative animation that fits the presentational-component model; reveals/gestures/exit transitions without imperative ref wrangling.
- `LazyMotion` + `m` keeps the client payload small and consistent with the server-first stack; `strict` makes accidental full-`motion` imports fail loudly.
- Reduced-motion is respected automatically by Motion's transform/opacity tweens.
- Cost: Motion is weaker than GSAP ScrollTrigger for complex pinned/scrubbed scroll timelines — accepted, and revisited per-component if a real need appears.
- Not doing: a second animation system, runtime CSS-in-JS, or GSAP as a baseline dependency.
