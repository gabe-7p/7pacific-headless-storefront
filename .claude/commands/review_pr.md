---
name: review-pr
description: Review a pull request against 7Pacific's Hydrogen engineering standards
arguments:
  pr: The PR number or GitHub URL to review (optional — will prompt if not provided)
---

# 7Pacific PR Review

Review PR `$ARGUMENTS.pr` against our engineering standards for the Hydrogen storefront.

## Steps

1. **Fetch PR details**: `gh pr view` and `gh pr diff` to get the content.
2. **Check CI status**: `gh pr checks`.
3. **Read the standards**: the files in [.claude/rules/](../rules/) are the source of truth — read the ones relevant to the diff (module boundaries, naming, GraphQL fragments, common pitfalls, testing).
4. **Analyze the diff** against the dimensions below.
5. **Output the structured review** in the format below.

## Review Dimensions

### 1. Architecture & module boundaries

- Data fetching only in route loaders/actions and `lib/` — never in UI components (see [module-boundaries.md](../rules/module-boundaries.md)).
- Files in the right place (feature modules, `components/layout`, `components/ui`); no dumping into generic locations.
- No circular or orphan deps (dependency-cruiser passes).
- DRY — shared logic extracted, copy lives in `content/` not inline in JSX.

### 2. Type safety

- No `any` (the `no-explicit-any` warning is treated as a defect).
- Generated GraphQL types imported from `storefrontapi.generated` / `customer-accountapi.generated`, never hand-written.
- Nullable Storefront fields handled (optional chaining / guards); honors `noUncheckedIndexedAccess`.
- `import type` for type-only imports.

### 3. GraphQL & data fetching

- Queries are co-located `#graphql` template `const`s ending in `as const`; shared shapes are fragments in `app/lib/fragments.ts` (see [graphql-fragments.md](../rules/graphql-fragments.md)).
- Parallel fetches use `Promise.all` (no request waterfalls); below-the-fold data is deferred and `.catch`-guarded.
- Sensible caching (`CacheLong`/`CacheShort`) on storefront queries.
- `PRIVATE_*` tokens never reach client code.

### 4. Accessibility (a11y)

- Semantic elements; images have `alt`; interactive controls are real buttons/links and keyboard-reachable.
- Form inputs have labels; focus states preserved; color is not the only signal.

### 5. Performance

- Hydrogen `<Image>` with `sizes` for responsive images; no unbounded queries (pagination where lists can grow).
- No heavy client JS where a server-rendered loader would do; defer below-the-fold work.

### 6. SEO

- Route `meta` set (title/description); canonical + OG where relevant; structured data (JSON-LD) on product pages.
- Legacy URLs preserved or 301-redirected.

### 7. Testing

- Behavior covered by colocated `*.test.tsx` (once the Vitest harness exists); pure logic (e.g. `colorMap`) has unit tests (see [testing-conventions.md](../rules/testing-conventions.md)).
- Until then, the PR describes the manual verification done against the live store / preview deploy.

### 8. Code style

- Components are `const` arrow functions (never the `function` keyword) — enforced by ESLint.
- Tailwind utility classes, no inline `style={{}}` objects.
- Self-documenting names; comments explain _why_, not _what_.

## Output Format

### Quick Summary

- PR size, scope, risk level (Low/Medium/High).

### What's Good

- Patterns that follow the standards.

### Issues Found

**Blockers (Must Fix)** — issues blocking approval.
**Warnings (Should Fix)** — architecture concerns, missing error/null handling, missing a11y.
**Suggestions (Consider)** — style, refactors.

### Metrics

- Type Safety | Architecture Alignment | a11y | Test Coverage (each 1–5).

### CI/CD Status

If any checks fail, diagnose the root cause and suggest a fix.

### Final Recommendation

- **Ship it!** — ready to merge
- **Minor changes needed** — quick fixes then merge
- **Needs work** — significant changes required
- **Consider splitting** — PR too large/complex
