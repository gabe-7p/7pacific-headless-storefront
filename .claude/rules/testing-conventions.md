# Testing Conventions

> The Vitest + React Testing Library harness lands in **GD-5**. These are the conventions tests follow once it exists; until then, verify behavior with `pnpm dev` against the live store and on the PR's Oxygen preview deploy, and describe that verification in the PR.

## Where tests live

Colocate a `*.test.tsx` (or `*.test.ts`) next to the file it tests — `ProductCard.tsx` → `ProductCard.test.tsx`, `colorMap.ts` → `colorMap.test.ts`. No separate top-level `__tests__` tree for unit tests.

## What to test, and how

- **Pure logic** (e.g. `lib/colorMap.ts`, size mapping, formatters): fast unit tests covering the real branches and edge cases — not just the happy path.
- **Components**: render with **mock loader/props data** and assert what the user sees and can do (DOM + interactions: color-swatch navigation, size selection, add-to-cart handler fired). Test behavior, not implementation details.
- Prefer React Testing Library queries by role/label/text (mirrors how users and assistive tech find things) over test-ids.

## Never hit the network

Tests must be deterministic and runnable offline. **Mock the Storefront/Customer-Account client at the boundary** — never make real GraphQL requests. A test that fails because the store is unreachable is a broken test, not a signal.

## Fixtures

Build typed fixtures/factories for Storefront shapes (e.g. a `makeProductCard(overrides)` returning a `ProductCardFragment`) and reuse them. Don't hand-construct large response objects inline in every test.

## Running (once GD-5 lands)

- All tests: `pnpm test`
- Single file: `pnpm test path/to/file.test.tsx`
- Watch: `pnpm test --watch`

## Why

Colocated, mock-driven tests stay close to the code, run fast in CI, and give a real signal about behavior — which is what lets us ship migrated units independently with confidence.
