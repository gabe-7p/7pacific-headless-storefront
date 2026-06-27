# Migration Status & Conventions Audit

Tracks the Impulse Liquid → Hydrogen migration (Linear epic **GD-1**) and the
conventions audit (**GD-32**). Each unit was built via the
[migration playbook](migration-playbook.md) and ships as its own PR.

## Migrated surface

| Area                          | Route / Component                                       | Ticket |
| ----------------------------- | ------------------------------------------------------- | ------ |
| Global layout (header/nav)    | `components/layout/Header`                              | GD-8   |
| Footer                        | `components/layout/Footer`                              | GD-2   |
| Announcement bar              | `components/layout/Announcement`                        | GD-10  |
| Cart (drawer + page)          | `components/cart/*`, `routes/cart`                      | GD-11  |
| Product card + color swatches | `components/collection/ProductCard`, `modules/product`  | GD-12  |
| Collection page               | `routes/collections.$handle`                            | GD-13  |
| Collections index             | `routes/collections._index`                             | GD-14  |
| Search + predictive           | `routes/search`, `components/search/*`                  | GD-15  |
| PDP shell + buy box           | `routes/products.$handle`                               | GD-17  |
| PDP color swatches            | `modules/product/ColorSwatches`                         | GD-18  |
| Feature carousel              | `modules/product/FeatureCarousel`                       | GD-19  |
| Tech stack                    | `modules/product/TechStack`                             | GD-20  |
| Bottom photography            | `components/product/BottomPhotography`                  | GD-21  |
| Related products              | `components/product/RelatedProducts`                    | GD-22  |
| Homepage                      | `routes/_index`, `components/home/*`                    | GD-23  |
| Our Story                     | `routes/pages.our-story`, `components/content/OurStory` | GD-24  |
| Contact                       | `routes/pages.contact-us`                               | GD-25  |
| Generic pages                 | `routes/pages.$handle`                                  | GD-26  |
| Blog + article                | `routes/blogs.$blogHandle.*`                            | GD-27  |
| 404 + legacy redirects        | `root` ErrorBoundary, `routes/$` (`storefrontRedirect`) | GD-29  |
| SEO/meta + JSON-LD            | `lib/seo` (`socialMeta`, `productJsonLd`)               | GD-30  |
| UI primitives                 | `components/ui/*` (shadcn: button, dialog, select, …)   | GD-16  |

## Conventions verified

The full gate is green per PR and enforces the conventions in
[.claude/rules/](../.claude/rules/):

- **`pnpm depcruise`** — no circular/boundary violations (data fetching stays in
  loaders/`lib`; components render typed props; modules imported via public API).
- **`pnpm lint`** — `const`-arrow components, no `any`, Tailwind-only, import order.
- **`pnpm type-check`** — generated GraphQL types resolve (no hand-written types).
- **`pnpm prettier:check`** / **`pnpm build`** — formatting + production build clean.

## Known follow-ups (noted in the relevant PRs)

- Announcement is a static centered message; the live theme scrolls a marquee.
- PDP feature/tech content is fully populated for **shorts**; tee/hat sets follow
  the same shape in `modules/product/content/product-features.ts`.
- Contact + newsletter actions validate/acknowledge; wiring delivery to a provider
  is pending (Storefront API has no contact mutation).
- Customer accounts are intentionally **not** rebuilt headless — we don't use the Customer
  Account API and there are no storefront-hosted `/account` pages (order history, addresses,
  profile). Checkout is Shopify-hosted (guest + Shop Pay). The header "Log in" icon links to
  Shopify's hosted account portal via `{store-domain}/account`, which 302-redirects there.
- **GD-31 production cutover** (custom domain on Oxygen, DNS, prod env, analytics)
  is an owner action and remains open.
