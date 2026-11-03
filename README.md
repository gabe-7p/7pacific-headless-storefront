# 7Pacific Storefront

Headless storefront for **7Pacific** (DTC athletic apparel): a **React Router 8** app with **Shopify Hydrogen 2026.10** (the library: Storefront client, cart, product form, analytics) on **Oxygen**. Migrated from a customized Impulse Liquid theme in small, independently deployable units.

- **Framework**: React Router 8 + Hydrogen 2026.10 · React 19 · Vite 8
- **Styling**: Tailwind CSS v4 + shadcn/ui (Radix headless primitives, vendored into `app/components/ui/`)
- **Data**: Shopify Storefront API 2026-10 (`gql()` documents typed in place by Hydrogen's TypeScript plugin) — guest checkout, no customer accounts
- **Hosting**: Oxygen (preview deploy per PR, production on `main`)

New here? Read [CLAUDE.md](CLAUDE.md) for conventions and [docs/](docs/README.md) for architecture and decisions.

## Prerequisites

- **Node 22** (or 24). With [nvm](https://github.com/nvm-sh/nvm): `nvm use` (reads [.nvmrc](.nvmrc)).
- **pnpm 11.7** — the version is pinned in `package.json`. Enable via Corepack (ships with Node):
  ```bash
  corepack enable
  ```
  Corepack installs the pinned pnpm automatically on first `pnpm` command.

## Setup

```bash
git clone https://github.com/gabe-7p/7pacific-headless-storefront.git
cd 7pacific-headless-storefront
nvm use            # Node 22
corepack enable    # pnpm 11.7
pnpm install
```

### Environment variables

The app needs Storefront API credentials to render live data, read from a gitignored `.env` at the repo root. The fastest way to create it is to pull from the linked Oxygen storefront:

```bash
pnpm shopify hydrogen link      # one-time: link this repo to the Hydrogen storefront
pnpm shopify hydrogen env pull  # writes real values into .env
```

Or write `.env` by hand. Every variable is listed in [docs/architecture.md](docs/architecture.md#environment--secrets).

> `.env` is gitignored and holds secrets — never commit it. See [docs/architecture.md](docs/architecture.md#environment--secrets) for which vars are public vs secret.

## Develop

```bash
pnpm dev          # Vite + MiniOxygen (workerd) dev server at http://localhost:3000
```

On boot you should see `[storefront] Connected to "<your shop>"` — confirmation the Storefront client is wired correctly. `GET /api/cart` returning `{"cart":null}` confirms Hydrogen's request handlers run in the root middleware.

## Common commands

| Task                           | Command                                            |
| ------------------------------ | -------------------------------------------------- |
| Dev server                     | `pnpm dev`                                         |
| Production build               | `pnpm build`                                       |
| Preview the production build   | `pnpm preview`                                     |
| Type check + GraphQL check     | `pnpm type-check`                                  |
| Lint                           | `pnpm lint`                                        |
| Format / check formatting      | `pnpm prettier` / `pnpm prettier:check`            |
| Unit tests (Vitest)            | `pnpm test`                                        |
| Meta Pixel funnel (Playwright) | `pnpm test:pixel` (see docs/META_PIXEL_TESTING.md) |
| Sync Hydrogen agent skills     | `pnpm exec hydrogen skills sync`                   |
| Dependency-boundary check      | `pnpm depcruise`                                   |
| Full pre-PR gate (in Claude)   | the `/check` command — mirrors CI                  |

## Quality gate

Every PR runs CI ([.github/workflows/ci.yml](.github/workflows/ci.yml)): skills check, type-check (incl. `hydrogen gql check`), lint, format check, dependency rules, unit tests, and build. Locally, a commit triggers the same checks on staged files via husky + lint-staged.

## Deploy

Oxygen deploys automatically from GitHub (the workflow runs `shopify hydrogen deploy --assets-dir dist/client --worker-dir dist/server`, which builds first):

- **Every PR** → a preview URL (smoke-test the migrated unit against the real store).
- **`main`** → production.

See [docs/architecture.md](docs/architecture.md#deployment) for the deploy pipeline and environment model.

## Project layout

```
app/
  routes/        one file per route; data loaders/actions live here
  components/    presentational components — layout/ cart/ product/ search/ common/ ui/ (shadcn primitives)
  lib/           storefront client + router contexts, cart/product stores, gql documents, csp, sitemap, shared utilities
  styles/        Tailwind + minimal globals
docs/            architecture, decision records, doc index
.claude/         agent settings, /check & /review_pr commands, coding rules
CLAUDE.md        conventions + entry point for humans and coding agents
```

Full detail in [docs/architecture.md](docs/architecture.md).
