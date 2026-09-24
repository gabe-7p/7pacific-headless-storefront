/// <reference types="vite/client" />
/// <reference types="react-router" />
/// <reference types="@shopify/oxygen-workers-types" />
/// <reference types="@shopify/hydrogen/react-router-types" />

// Enhance TypeScript's built-in typings.
import '@total-typescript/ts-reset';

declare global {
  // Merges into Hydrogen's global `Env` — must be an interface to augment it.
  // eslint-disable-next-line @typescript-eslint/consistent-type-definitions
  interface Env {
    /** [public] PostHog project API key (`phc_…`) — unset = PostHog off. See lib/posthog.ts. */
    PUBLIC_POSTHOG_KEY?: string;
    /** [public] PostHog ingestion host, e.g. https://us.i.posthog.com */
    PUBLIC_POSTHOG_HOST?: string;
    /** [public] `true` to send events from `pnpm dev` (off by default). */
    PUBLIC_POSTHOG_DEV?: string;
  }
}
