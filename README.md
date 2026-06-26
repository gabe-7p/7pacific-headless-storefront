# 7Pacific Storefront

Headless storefront for **7Pacific** (DTC athletic apparel), built on **Shopify Hydrogen + Oxygen**. We're migrating the live store from a customized Impulse Liquid theme to Hydrogen, shipping in small, independently deployable units.

- **Framework**: Hydrogen 2026.1 on React Router 7 · React 18 · Vite 6
- **Styling**: Tailwind CSS v4 + shadcn/ui (Radix headless primitives, vendored into `app/components/ui/`)
- **Data**: Shopify Storefront API (typed via GraphQL codegen) — guest checkout, no customer accounts
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

The app needs Storefront API credentials to render live data. Copy the template and fill it in:

```bash
cp .env.example .env
```

The fastest way to populate it is to pull from the linked Oxygen storefront:

```bash
pnpm shopify hydrogen link      # one-time: link this repo to the Hydrogen storefront
pnpm shopify hydrogen env pull  # writes real values into .env
```

Or fill `.env` by hand using the comments in [.env.example](.env.example). `SESSION_SECRET` can be generated locally:

```bash
openssl rand -hex 32
```

> `.env` is gitignored and holds secrets — never commit it. See [.env.example](.env.example) for which vars are public vs secret.

## Develop

```bash
pnpm dev          # mini-oxygen dev server at http://localhost:3000 (runs codegen)
```

On boot you should see `[storefront] Connected to "<your shop>"` — confirmation the Storefront client is wired correctly.

## Common commands

| Task                         | Command                                 |
| ---------------------------- | --------------------------------------- |
| Dev server                   | `pnpm dev`                              |
| Production build             | `pnpm build`                            |
| Preview the production build | `pnpm preview`                          |
| Type check                   | `pnpm type-check`                       |
| Lint                         | `pnpm lint`                             |
| Format / check formatting    | `pnpm prettier` / `pnpm prettier:check` |
| Regenerate GraphQL types     | `pnpm graphql:generate`                 |
| Dependency-boundary check    | `pnpm depcruise`                        |
| Full pre-PR gate (in Claude) | the `/check` command — mirrors CI       |

## Quality gate

Every PR runs CI ([.github/workflows/ci.yml](.github/workflows/ci.yml)): type-check, lint, format check, dependency rules, and build. Locally, a commit triggers the same checks on staged files via husky + lint-staged.

## Deploy

Oxygen deploys automatically from GitHub:

- **Every PR** → a preview URL (smoke-test the migrated unit against the real store).
- **`main`** → production.

See [docs/architecture.md](docs/architecture.md#deployment) for the deploy pipeline and environment model.

## Project layout

```
app/
  routes/        one file per route; data loaders/actions live here
  components/    presentational components — layout/ cart/ product/ search/ common/ ui/ (shadcn primitives)
  lib/           GraphQL fragments, context, session, shared utilities
  styles/        Tailwind + minimal globals
docs/            architecture, decision records, doc index
.claude/         agent settings, /check & /review_pr commands, coding rules
CLAUDE.md        conventions + entry point for humans and coding agents
```

Full detail in [docs/architecture.md](docs/architecture.md).
