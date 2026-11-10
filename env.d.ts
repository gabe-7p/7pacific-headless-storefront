/// <reference types="vite/client" />
/// <reference types="react-router" />
/// <reference types="@shopify/oxygen-workers-types" />

// Enhance TypeScript's built-in typings.
import '@total-typescript/ts-reset';

// The worker bindings (env, cache, waitUntil) travel on the router context
// under the typed `oxygenContext` key — see app/lib/oxygen.ts.

declare global {
  /**
   * The Oxygen worker environment (`.env` locally; a linked storefront injects
   * these on Oxygen). `server.ts` threads it onto the router context under
   * `oxygenContext` (lib/oxygen.ts), so the root middleware, loaders and
   * entry.server read one shape via `context.get(oxygenContext).env`.
   */
  // eslint-disable-next-line @typescript-eslint/consistent-type-definitions -- global augmentation must be an interface
  interface Env {
    PUBLIC_STORE_DOMAIN: string;
    PUBLIC_STOREFRONT_ID?: string;
    PRIVATE_STOREFRONT_API_TOKEN?: string;
    /** [secret] Dev Dashboard app client id — Admin API access for saving signups (lib/adminApi.server.ts). */
    PRIVATE_SHOPIFY_ADMIN_CLIENT_ID?: string;
    /** [secret] Dev Dashboard app client secret, paired with the client id above. */
    PRIVATE_SHOPIFY_ADMIN_CLIENT_SECRET?: string;
    PUBLIC_CHECKOUT_DOMAIN?: string;
    /** [public] PostHog project API key (`phc_…`) — unset = PostHog off. See lib/analytics/posthog.ts. */
    PUBLIC_POSTHOG_KEY?: string;
    /** [public] PostHog ingestion host, e.g. https://us.i.posthog.com */
    PUBLIC_POSTHOG_HOST?: string;
    /** [public] `true` to send events from `pnpm dev` (off by default). */
    PUBLIC_POSTHOG_DEV?: string;
    /** [public] Meta Pixel ID (shared with the Facebook & Instagram app) — unset = pixel off. See lib/analytics/meta-pixel.client.ts. */
    PUBLIC_META_PIXEL_ID?: string;
    /** [public] Meta domain-verification token — renders the `facebook-domain-verification` meta tag when set. */
    PUBLIC_META_DOMAIN_VERIFICATION?: string;
    /** [server] `true` reads the header from the `main-menu-test` Shopify menu instead of `main-menu` (local preview of nav changes). Never set on Production. */
    HEADER_MENU_TEST?: string;
  }
}
