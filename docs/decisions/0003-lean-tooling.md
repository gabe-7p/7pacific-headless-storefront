# 0003. Lean tooling — drop heavy-duty tools

- **Status**: Accepted
- **Date**: 2026-06-18

## Context

brooklyn (our reference repo) carries a large toolchain: Playwright/E2E, Storybook + Chromatic visual regression, Renovate, Sentry, Apollo + a ~20-package GraphQL codegen stack. Mirroring all of it into a brand-new, small storefront would add significant setup and maintenance overhead before it earns its keep.

## Decision

Keep a **lean** set and add tools only when they pay off:

- **Keep**: pnpm, TypeScript (strict), ESLint (flat) + Prettier, lint-staged + husky, **dependency-cruiser** (module boundaries), GraphQL codegen (Hydrogen's, not Apollo's), GitHub Actions CI.
  - _2026-10-31: the codegen step is gone — documents are typed in place by Hydrogen's TypeScript plugin, see [0010](0010-hydrogen-2026-10-library.md)._
- **Drop for now**: Playwright/E2E, Storybook + Chromatic, Renovate, Sentry.

Verification leans on the **Oxygen preview deploy per PR** (smoke-test against the real store) plus the type/lint/deps/build gate.

## Consequences

- Fast onboarding and a small dependency surface; less to maintain.
- We rely on preview deploys and manual smoke tests instead of automated E2E/visual regression for v1.
- Observability is Oxygen logs for now; Sentry can be added later if needed. Each dropped tool can be revisited as the app grows.
