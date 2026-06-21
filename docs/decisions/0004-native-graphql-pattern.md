# 0004. Hydrogen-native GraphQL pattern (no Apollo)

- **Status**: Accepted
- **Date**: 2026-06-20

## Context

brooklyn uses Apollo Client with separate `.graphql` operation files, `typed-document-node`, the near-operation-file preset, and zod-schema generation — appropriate for a client-side app driving an Apollo cache. Hydrogen fetches data **server-side in route loaders/actions**; there is no client cache and no `useQuery`.

## Decision

Use the **Hydrogen-native** GraphQL pattern: co-located `#graphql` tagged-template `const`s ending in `as const`, shared shapes as fragments in `app/lib/fragments.ts`, typed by `@shopify/hydrogen-codegen` into `*.generated.d.ts`. Call them with `context.storefront.query(...)` / `.mutate(...)`. Do **not** introduce Apollo or a parallel codegen stack.

## Consequences

- Minimal machinery; queries read top-to-bottom next to where they run; full type inference keyed off the literal query string (so `as const` is load-bearing).
- Engineers must run `pnpm graphql:generate` after editing a query/fragment (CI's type-check catches staleness).
- The whole rule set lives in [.claude/rules/graphql-fragments.md](../../.claude/rules/graphql-fragments.md).
