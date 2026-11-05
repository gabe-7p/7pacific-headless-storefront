---
name: check
description: Run the full pre-PR quality gate (skills, types, lint, format, deps, tests, build)
---

Run these checks in sequence — the same gate CI enforces ([.github/workflows/ci.yml](../../.github/workflows/ci.yml)). Stop on the first failure and report what failed.

1. **Skills** (Hydrogen's agent skills match the installed package): `pnpm exec hydrogen skills check`
2. **Type check** (includes `hydrogen gql check`, the Storefront API query validation): `pnpm type-check`
3. **Lint** (includes the single-source selectors and `forbid-elements`; a disable needs a reason): `pnpm lint`
4. **Format**: `pnpm prettier:check` (on failure, `pnpm prettier` fixes it)
5. **Dependency rules**: `pnpm depcruise`
6. **Unused exports and dependencies**: `pnpm knip`
7. **Unit tests**: `pnpm test`
8. **Build**: `pnpm build`

After all checks complete (or one fails), print a summary:

```
## Pre-PR Check Results
- Skills:     PASS/FAIL
- Type check: PASS/FAIL
- Lint:       PASS/FAIL
- Format:     PASS/FAIL
- Deps:       PASS/FAIL
- Knip:       PASS/FAIL
- Tests:      PASS/FAIL
- Build:      PASS/FAIL
```

If any check fails:

- Show the relevant error output (first ~30 lines).
- Suggest a specific fix based on the error.
- If the fix is straightforward, offer to apply it and re-run.
