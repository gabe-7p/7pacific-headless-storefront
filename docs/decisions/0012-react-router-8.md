# 0012. React Router 8

- **Status**: Accepted — refines [0010](0010-hydrogen-2026-10-library.md)
- **Date**: 2026-11-02

## Context

React Router 8 (8.0.0 in June 2026, 8.5.1 today) makes every `v8_*` future flag the only behavior: middleware always on, the raw request passed to loaders/actions/middleware (routing logic reads the `url` arg), trailing-slash-aware data requests, route-module splitting on by default, and the Vite Environment API as the only build path. Staying on 7.16 meant carrying every flag explicitly plus a pnpm patch for `@react-router/dev`'s Vite `envFile` deprecation (fixed upstream only in 8.1.0). Shopify's Hydrogen template is still on React Router 7.15, so nothing upstream had exercised Hydrogen 2026.10 + MiniOxygen 4.2 on v8; this ADR records what that took.

## Decision

Upgrade `react-router`, `@react-router/dev` and `@react-router/fs-routes` to 8.5.1 (exact pins, as before). Three things had to change beyond deleting the flags and the patch:

1. **Typed context keys instead of augmenting `RouterContextProvider`.** v8 re-exports the class from an internal module, so `declare module 'react-router' { interface RouterContextProvider { env … } }` no longer merges and `context.env` stops type-checking. The worker bindings (env, sub-request cache, `waitUntil`) now travel under `oxygenContext` ([app/lib/oxygen.ts](../../app/lib/oxygen.ts)) — the same `createContext` pattern as `storefrontClientContext` and `posthogContext`. `server.ts` sets it; the middleware, the root loader and `entry.server` read `context.get(oxygenContext)`.
2. **The worker entry is named explicitly in `vite.config.ts`.** On the Environment API path `react-router build` builds the ssr environment from `environments.ssr.build.rollupOptions.input`, else from its own server build — which exports `routes`/`entry`/`assets` and has no `fetch` handler, so workerd fails to start with an opaque `ERR_RUNTIME_FAILURE`. MiniOxygen 4.2's `build.ssr` default only applies to the classic `vite build --ssr` path, and so does its `oxygen.json` emit (the compatibility date `shopify hydrogen deploy` uploads next to the worker). The app now sets the ssr input to `server.ts` and emits `oxygen.json` from a ten-line plugin. Both go away when MiniOxygen's plugin learns the Environment API build.
3. **`<Links nonce>`.** v8's `Links` defaults its nonce from `<ServerRouter nonce>` on the server only; without the prop on the client, the dev-only critical-CSS link hydrates with a nonce mismatch warning. Passing `nonce` on both sides (as `Scripts` and `ScrollRestoration` already did) fixes it.

The `ssr.optimizeDeps.include` entries for `react-router > cookie` / `set-cookie-parser` are gone (v8 uses `cookie-es`, ESM). `future.unstable_optimizeDeps` stays.

## Consequences

- No future flags, no pnpm patch, no `envFile` noise; `pnpm dev` starts clean.
- Verified on the production preview build: every route, the `.data` requests (`/_.data`, `/x.data`, `/a/b/_.data`), the fetcher POST to `/api/subscribe`, the SPA `?variant=` redirect, `GET /api/cart`, the Meta Pixel funnel (`pnpm test:pixel`), and PostHog end to end — `$pageview` on document loads and client-side navigations, `collection_viewed`, `product_viewed`, `product_added_to_cart`, `cart_updated`, `cart_viewed`, web vitals, autocapture and session recording, with the same event list as the 7.16 build. (Headless Playwright needs `navigator.webdriver` and `userAgentData` hidden before posthog-js will capture anything: its bot filter drops every event otherwise, which is why the earlier runs looked empty.)
- The ssr-input + `oxygen.json` workaround in `vite.config.ts` is the one thing to re-check on a MiniOxygen bump: if the plugin starts handling the Environment API build, delete both.
- React Router 9 (estimated mid-2027) will require Node 24; nothing to do yet.
