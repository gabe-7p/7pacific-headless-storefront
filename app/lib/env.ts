import { createContext } from 'react-router';

/**
 * The Oxygen worker environment (`.env` locally; a linked storefront injects
 * these on Oxygen). `env.d.ts` merges this into the global `Env` so
 * `server.ts` and the middleware share one shape.
 */
export type AppEnv = {
  PUBLIC_STORE_DOMAIN: string;
  PUBLIC_STOREFRONT_ID?: string;
  PUBLIC_STOREFRONT_API_TOKEN?: string;
  PRIVATE_STOREFRONT_API_TOKEN?: string;
  PUBLIC_CHECKOUT_DOMAIN?: string;
  /** Unused since the 2026.10 migration (no customer accounts); harmless on Oxygen. */
  SESSION_SECRET?: string;
  /** [public] PostHog project API key (`phc_…`) — unset = PostHog off. See lib/posthog.ts. */
  PUBLIC_POSTHOG_KEY?: string;
  /** [public] PostHog ingestion host, e.g. https://us.i.posthog.com */
  PUBLIC_POSTHOG_HOST?: string;
  /** [public] `true` to send events from `pnpm dev` (off by default). */
  PUBLIC_POSTHOG_DEV?: string;
};

/** React Router request context carrying the worker env (set in server.ts). */
export const envContext = createContext<Env>();
