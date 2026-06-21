# 0002. Tailwind CSS for styling (no UI kit)

- **Status**: Accepted
- **Date**: 2026-06-17

## Context

We need a styling approach for a custom-designed brand storefront. Our sibling internal app (brooklyn) uses Mantine, but that's a data-dense application UI kit — wrong fit for a bespoke marketing/commerce front end. We want full design control, small client payload, and a system coding agents can apply consistently.

## Decision

Use **Tailwind CSS v4** with utility classes. No component UI kit (no Mantine), and **no inline `style={{}}` objects** — conditional styling uses `clsx`/variants. This is the one place the storefront intentionally diverges from brooklyn's stack; everything else (tooling, formatting, TS config) mirrors it.

## Consequences

- Full visual control to match the brand; styles live next to markup; minimal runtime CSS.
- Shared primitives (Button, Accordion, etc.) get built into `components/ui/` rather than imported from a kit.
- Cost: no off-the-shelf components — we build our own. Accepted, since the design is custom anyway.
