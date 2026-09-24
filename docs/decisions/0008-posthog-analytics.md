# 0008. PostHog for product analytics and session replay

- **Status**: Accepted (revisits the "Sentry later" note in [0003](0003-lean-tooling.md))
- **Date**: 2026-09-23

## Context

We need to see how shoppers move through the site: which pages they visit, in what order, where they drop off, and replays of real visits. Shopify Analytics (fed by Hydrogen's `<Analytics.Provider>`) reports commerce totals but not paths or replays. PostHog covers funnels, paths, heatmaps, session replay and exception tracking in one tool, on a free tier that fits our traffic.

## Decision

Adopt **PostHog (US Cloud)**, set up with the PostHog wizard and then adapted to Oxygen:

- **Client** (`posthog-js` + `@posthog/react`): initialized in [entry.client.tsx](../../app/entry.client.tsx) before hydration. Pinned `defaults` capture a `$pageview` on every history change, so client-side navigations count once each. Session replay runs with `maskAllInputs`. Autocapture, heatmaps and exception capture stay on. Commerce events (`product_viewed`, `product_added_to_cart`, `checkout_started`) are captured where they happen. `PostHogProvider` is always mounted, so `usePostHog()` is safe when PostHog is off.
- **Server** (`posthog-node`): a per-request client ([lib/posthog.server.ts](../../app/lib/posthog.server.ts)) on `context.posthog` for action-side events (`cart_modified`, `newsletter_subscribed`, …). It **must import `posthog-node/edge`**. The default Node build pulls in `path`/`process` and crashes MiniOxygen/workerd on load. The edge build has no AsyncLocalStorage, so a `before_send` hook reattaches the visitor's `X-POSTHOG-DISTINCT-ID`/`-SESSION-ID` (sent by posthog-js `tracing_headers`). Events flush in `waitUntil` after the response, never on its critical path.
- **Config is runtime, not build-time.** `PUBLIC_POSTHOG_KEY`/`_HOST` come from the Oxygen env. The root loader renders them as `<meta>` tags for the client, and `getPostHogConfig` ([lib/posthog.ts](../../app/lib/posthog.ts)) is the single on/off switch. That's what lets Production and Preview use **separate PostHog projects** from one build. Local `pnpm dev` stays silent unless `PUBLIC_POSTHOG_DEV=true`.
- **CSP**: entry.server allows the ingestion host and its `-assets` twin (script + connect), plus `worker-src 'self' blob:`, derived from `PUBLIC_POSTHOG_HOST`.
- **Consent**: PostHog runs for every visitor. The store sells to the US only and shows no privacy banner.
- **No ad-blocker proxy** for now. Blocked visitors are lost, and an `/ingest` route can be added later.

## Consequences

- Paths, funnels and replays are available without extra tracking calls. Autocapture covers clicks and form submits.
- One more vendor script on the client (lazy-loaded recorder/extensions from the PostHog assets host).
- Commerce events are hand-placed in components and routes rather than bridged from Hydrogen's `Analytics.subscribe`. That's simpler, but a new add-to-cart surface needs its own capture.
- If we ever sell outside the US or show a consent banner, gate `posthog.init` on the Customer Privacy API first.
- Not doing: a reverse proxy, identified users (guest checkout only), or feature flags / experiments.
