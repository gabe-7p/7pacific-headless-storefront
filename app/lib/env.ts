/**
 * The Oxygen worker environment (`.env` locally; a linked storefront injects
 * these on Oxygen). `env.d.ts` merges this into the global `Env` and declares
 * it on the router context, so `server.ts`, the root middleware and loaders
 * read one shape as `context.env`.
 */
export type AppEnv = {
  PUBLIC_STORE_DOMAIN: string;
  PUBLIC_STOREFRONT_ID?: string;
  PUBLIC_STOREFRONT_API_TOKEN?: string;
  PRIVATE_STOREFRONT_API_TOKEN?: string;
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
};
