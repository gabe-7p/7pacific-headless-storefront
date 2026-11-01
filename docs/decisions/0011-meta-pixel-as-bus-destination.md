# 0011. Meta Pixel as a destination on the Shopify analytics bus

- **Status**: Accepted (revisits [0003](0003-lean-tooling.md)'s "no Playwright" for one targeted browser test)
- **Date**: 2026-11-01

## Context

The Shopify "Facebook & Instagram" app fires `InitiateCheckout` and `Purchase` from the hosted checkout, but nothing fired on the storefront, so Meta saw the bottom of the funnel only. Hydrogen 2026.10 already runs a consent-gated analytics bus ([0010](0010-hydrogen-2026-10-library.md)) that every route publishes to, and PostHog already consumes it as a destination.

## Decision

- **The pixel is a bus destination** (`lib/analytics/meta-pixel.client.ts`), not a `<script>` snippet in the head. `setup()` only subscribes; `fbevents.js` is injected (with the CSP nonce) from the first subscriber callback, which the bus runs only once Customer Privacy allows analytics. Calls queue in the official stub until the script flushes them, `init` first. One registration per page lifetime, set inside the ready callback like the PostHog bridge; the bus also ignores a second destination with the same name.
- **Mapping** (`lib/analytics/meta-pixel.ts`, pure, unit-tested): `page_viewed` → `PageView`; `product_viewed` → `ViewContent`; `product_added_to_cart` → `AddToCart` with `num_items` = the quantity delta (skipped when ≤ 0) and `value` = unit price × delta; `search_viewed` → `Search` (nothing publishes it yet: no search route). **Not** `InitiateCheckout`/`Purchase` — the checkout pixel owns those and firing them here would double-count.
- **`content_ids`** use Shopify's catalog format `shopify_<country>_<productId>_<variantId>` so storefront events match the app's checkout events and the synced catalog. `toMetaContentId` is the one place to change if the Purchase events turn out to use bare variant ids.
- **Config is runtime**: `PUBLIC_META_PIXEL_ID` (and optional `PUBLIC_META_DOMAIN_VERIFICATION`) travel from `context.env` through the root loader; no client module reads env. CSP appends the Meta hosts unconditionally.
- **Verification**: a Playwright test (`pnpm test:pixel`, `e2e/`) drives the production preview build — dev runs Strict Mode, which double-invokes effects and makes "exactly one event" assertions meaningless — and intercepts `facebook.com/tr`, so nothing reaches Meta. By default it serves a local stand-in for `fbevents.js`: the real script enforces the pixel's Traffic Permissions allow-list, which excludes `localhost`. `pnpm test:pixel:live` uses the real script. See [docs/META_PIXEL_TESTING.md](../META_PIXEL_TESTING.md).

## Consequences

- One more consent-gated vendor script, loaded lazily; no analytics library added.
- Search events are mapped but silent until a search route exists.
- Playwright is back as a dev dependency for this one funnel test (0003 dropped it for broad E2E; this is a narrow regression check that CI does not run — it needs a Storefront API token and Chromium).
- Local and preview verification against Meta's real script requires the domain on the pixel's Traffic Permissions allow-list.
