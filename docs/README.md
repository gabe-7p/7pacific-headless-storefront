# Docs

Documentation for the 7Pacific Hydrogen storefront. Start with the root [CLAUDE.md](../CLAUDE.md) (conventions + entry point) and [README.md](../README.md) (setup/dev/deploy).

## Contents

- [architecture.md](architecture.md) — stack, request/data flow, code organization, the module pattern, env model, deployment.
- [decisions/](decisions/README.md) — Architecture Decision Records (the _why_ behind settled choices).

## If you're working on X, read Y

| If you're…                                              | Read                                                                                                                                                                             |
| ------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Setting up the repo locally                             | [README.md](../README.md)                                                                                                                                                        |
| Learning the conventions (start here)                   | [CLAUDE.md](../CLAUDE.md)                                                                                                                                                        |
| Understanding how data flows                            | [architecture.md](architecture.md) · [.claude/rules/module-boundaries.md](../.claude/rules/module-boundaries.md)                                                                 |
| Writing or changing a GraphQL query/fragment            | [.claude/rules/graphql-fragments.md](../.claude/rules/graphql-fragments.md)                                                                                                      |
| Adding/naming a component or data helper                | [.claude/rules/naming-conventions.md](../.claude/rules/naming-conventions.md)                                                                                                    |
| Building UI / using a shadcn/ui primitive               | [.claude/rules/ui-components.md](../.claude/rules/ui-components.md) · [decisions/0006-shadcn-ui-for-headless-primitives.md](decisions/0006-shadcn-ui-for-headless-primitives.md) |
| Building a new feature / module                         | [architecture.md](architecture.md#the-module-pattern-how-features-grow)                                                                                                          |
| Touching products or color swatches                     | [decisions/0005-color-as-separate-product.md](decisions/0005-color-as-separate-product.md) · [.claude/rules/common-pitfalls.md](../.claude/rules/common-pitfalls.md)             |
| Avoiding common bugs (nullability, waterfalls, secrets) | [.claude/rules/common-pitfalls.md](../.claude/rules/common-pitfalls.md)                                                                                                          |
| Adding env vars                                         | [.env.example](../.env.example) · [architecture.md](architecture.md#environment--secrets)                                                                                        |
| Running the pre-PR gate / reviewing a PR                | [.claude/commands/check.md](../.claude/commands/check.md) · [.claude/commands/review_pr.md](../.claude/commands/review_pr.md)                                                    |
| Understanding why a choice was made                     | [decisions/](decisions/README.md)                                                                                                                                                |

## Keeping docs current

Docs are part of the change, not an afterthought — see [CLAUDE.md → Documentation discipline](../CLAUDE.md#documentation-discipline). If a code change makes anything here wrong, fix it in the same PR.
