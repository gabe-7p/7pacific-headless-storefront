---
name: check
description: Run the full pre-PR quality gate (format, lint, types, deps, build)
---

Run these checks in sequence — the same gate CI enforces ([.github/workflows/ci.yml](../../.github/workflows/ci.yml)). Stop on the first failure and report what failed.

1. **Format**: `pnpm prettier --write $(git diff --name-only --diff-filter=ACMR HEAD -- '*.ts' '*.tsx' '*.css' '*.json' '*.md')`
2. **Codegen** (GraphQL types must be current): `pnpm graphql:generate`
3. **Type check**: `pnpm type-check`
4. **Lint**: `pnpm lint`
5. **Dependency rules**: `pnpm depcruise`
6. **Build**: `pnpm build`

After all checks complete (or one fails), print a summary:

```
## Pre-PR Check Results
- Format:     PASS/FAIL
- Codegen:    PASS/FAIL
- Type check: PASS/FAIL
- Lint:       PASS/FAIL
- Deps:       PASS/FAIL
- Build:      PASS/FAIL
```

If any check fails:

- Show the relevant error output (first ~30 lines).
- Suggest a specific fix based on the error.
- If the fix is straightforward, offer to apply it and re-run.
