---
name: review-pr
description: Review a pull request against 7Pacific's Hydrogen engineering standards
arguments:
  pr: The PR number or GitHub URL to review (optional — will prompt if not provided)
---

# 7Pacific PR Review

Review PR `$ARGUMENTS.pr` against our standards for the Hydrogen storefront.

## Steps

1. **Fetch the PR**: `gh pr view` and `gh pr diff`.
2. **Check CI**: `gh pr checks`.
3. **Read the standards**: the files in [.claude/rules/](../rules/) are the source of truth — read the ones the diff touches (module boundaries, naming, GraphQL fragments, common pitfalls).
4. **Analyze the diff** against the dimensions below.
5. **Output the review** in the format below.

## Review Dimensions

1. **Architecture & boundaries** — fetching only in loaders/actions and `lib/`, never in components ([module-boundaries.md](../rules/module-boundaries.md)); files in the right place; no circular/orphan deps; copy in `content/` not JSX; DRY.
2. **Type safety** — no `any`; generated GraphQL types imported (never hand-written); nullable Storefront fields guarded (`noUncheckedIndexedAccess`); `import type` for type-only imports.
3. **GraphQL & data fetching** — co-located `#graphql` `const`s ending `as const`, shared shapes as fragments ([graphql-fragments.md](../rules/graphql-fragments.md)); `Promise.all` (no waterfalls); deferred below-the-fold data `.catch`-guarded; sensible caching; `PRIVATE_*` tokens never client-side.
4. **Accessibility** — semantic elements; `alt` on images; real, keyboard-reachable controls; labeled inputs; color isn't the only signal.
5. **Performance** — Hydrogen `<Image>` with `sizes`; pagination on growable lists; defer below-the-fold work; no needless client JS.
6. **SEO** — route `meta` (title/description), canonical + OG where relevant, product JSON-LD; legacy URLs preserved or 301'd.
7. **Code style** — `const` arrow components (never `function`); Tailwind utilities, no inline `style={{}}`; self-documenting names; comments explain _why_; **docs updated alongside the change** (see CLAUDE.md → Documentation discipline).

## Output Format

### Summary

PR size, scope, risk (Low/Medium/High).

### What's good

Patterns that follow the standards.

### Issues

- **Blockers (must fix)** — block approval.
- **Warnings (should fix)** — boundary/null/a11y gaps, missing doc updates.
- **Suggestions (consider)** — style, refactors.

### CI status

If checks fail, diagnose the root cause and suggest a fix.

### Recommendation

**Ship it** · **Minor changes** · **Needs work** · **Consider splitting**.
