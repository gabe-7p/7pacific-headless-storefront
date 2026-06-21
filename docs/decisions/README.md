# Architecture Decision Records

Short, dated records of decisions that shaped this repo and the _why_ behind them — so future contributors (and coding agents) don't re-litigate settled choices or accidentally undo them.

## How to add one

1. Copy the format below into `NNNN-short-title.md` (next number in sequence).
2. Keep it short: context → decision → consequences.
3. A decision is **immutable once accepted**. To change it, add a new ADR that supersedes the old one (link both ways) rather than editing history.

## Format

```markdown
# NNNN. Title

- **Status**: Accepted | Superseded by [NNNN](NNNN-x.md)
- **Date**: YYYY-MM-DD

## Context

What problem/forces led to this decision.

## Decision

What we chose.

## Consequences

What this makes easy, what it costs, what we're explicitly not doing.
```

## Index

| ADR                                               | Decision                                             |
| ------------------------------------------------- | ---------------------------------------------------- |
| [0001](0001-hydrogen-over-liquid.md)              | Migrate from Liquid (Impulse) to Hydrogen + Oxygen   |
| [0002](0002-tailwind-for-styling.md)              | Tailwind CSS for styling (no UI kit)                 |
| [0003](0003-lean-tooling.md)                      | Lean tooling — drop Playwright/Storybook/Sentry/etc. |
| [0004](0004-native-graphql-pattern.md)            | Hydrogen-native GraphQL pattern (no Apollo)          |
| [0005](0005-color-as-separate-product.md)         | Keep "color = separate product" data model for v1    |
| [0006](0006-shadcn-ui-for-headless-primitives.md) | shadcn/ui for headless primitives (refines 0002)     |
