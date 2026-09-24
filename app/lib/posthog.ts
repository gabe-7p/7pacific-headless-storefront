/**
 * PostHog runtime config — the one place that decides whether PostHog runs.
 *
 * Read from the Oxygen env at request time (not baked in by Vite), so each
 * Oxygen environment can point at its own PostHog project: Production and
 * Preview carry different `PUBLIC_POSTHOG_KEY`s, and an environment with no key
 * sends nothing. The root loader hands the result to the browser via `<meta>`
 * tags (see root.tsx `Layout` → entry.client.tsx); lib/posthog.server.ts uses
 * it for server-side events.
 */
export type PostHogConfig = { key: string; host: string };

type PostHogEnv = {
  PUBLIC_POSTHOG_KEY?: string;
  PUBLIC_POSTHOG_HOST?: string;
  PUBLIC_POSTHOG_DEV?: string;
};

export const POSTHOG_KEY_META = 'posthog-key';
export const POSTHOG_HOST_META = 'posthog-host';

/**
 * Returns `null` when PostHog should stay off: no key/host configured, or a
 * local `pnpm dev` without the `PUBLIC_POSTHOG_DEV=true` opt-in (so day-to-day
 * dev traffic never lands in the project).
 */
export const getPostHogConfig = (env: PostHogEnv, isDev: boolean): PostHogConfig | null => {
  const key = env.PUBLIC_POSTHOG_KEY;
  const host = env.PUBLIC_POSTHOG_HOST;
  if (!key || !host) return null;
  if (isDev && env.PUBLIC_POSTHOG_DEV !== 'true') return null;
  return { key, host };
};

/**
 * CSP origins for a PostHog ingestion host: the host itself plus its assets
 * twin (`us.i.posthog.com` → `us-assets.i.posthog.com`), which serves the
 * lazy-loaded replay recorder and remote config. Empty when unset/invalid.
 */
export const getPostHogOrigins = (host: string | undefined): Array<string> => {
  if (!host) return [];
  try {
    const { origin, hostname } = new URL(host);
    const assets = hostname.replace(/^([a-z]+)\.i\.posthog\.com$/, '$1-assets.i.posthog.com');
    return assets === hostname ? [origin] : [origin, `https://${assets}`];
  } catch {
    return [];
  }
};
