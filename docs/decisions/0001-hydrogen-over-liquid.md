# 0001. Migrate from Liquid (Impulse) to Hydrogen + Oxygen

- **Status**: Accepted
- **Date**: 2026-06-17

## Context

The 7Pacific storefront runs a purchased and customized Impulse v8 Liquid theme (Archetype Themes) with vanilla JS. It has no build tooling, no type safety, no component model, and limited room for the custom interactive experiences the brand wants. We want a modern React codebase a small team — and coding agents — can navigate and extend safely.

## Decision

Rebuild the storefront as a headless **Hydrogen** app on **React Router 7**, hosted on **Oxygen**, consuming the Storefront and Customer Account APIs. Migrate incrementally — **live pages only**, shipped as small independently deployable units — rather than a big-bang rewrite. Keep the Liquid theme live until each surface is cut over.

## Consequences

- Type-safe, component-based, testable code with a real toolchain (TS, ESLint, codegen, CI).
- First-class hosting/caching on Oxygen with preview-per-PR deploys.
- Cost: a full migration effort (tracked in Linear epic GD-1) and running two stacks during cutover.
- We deliberately scope to live pages and drop unused Impulse demo templates.
