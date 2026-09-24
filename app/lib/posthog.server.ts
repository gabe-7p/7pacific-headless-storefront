// The edge build: Oxygen runs on workerd, and posthog-node's default (Node)
// entry imports `path`/`process` and crashes MiniOxygen on load.
import { PostHog } from 'posthog-node/edge';

import { getPostHogConfig } from '~/lib/posthog';

/**
 * Per-request server-side PostHog client, or `undefined` when PostHog is off
 * (see getPostHogConfig).
 *
 * posthog-js sends `X-POSTHOG-DISTINCT-ID` / `X-POSTHOG-SESSION-ID` on the
 * app's own fetches (its `tracing_headers` option), so loader/action requests
 * say which visitor they belong to. The Node build binds those through
 * AsyncLocalStorage (`withContext`); the edge build has no context store and
 * would send every server event as a fresh anonymous id, cut off from the
 * visitor's journey. `before_send` re-attaches them instead — safe because the
 * client lives for exactly one request.
 */
export const createPostHogClient = (env: Env, request: Request) => {
  const config = getPostHogConfig(env, import.meta.env.DEV);
  if (!config) return undefined;

  const distinctId = request.headers.get('X-POSTHOG-DISTINCT-ID');
  const sessionId = request.headers.get('X-POSTHOG-SESSION-ID');

  return new PostHog(config.key, {
    host: config.host,
    // Send each event as it's captured; server.ts flushes the rest in
    // waitUntil, after the response has gone out.
    flushAt: 1,
    flushInterval: 0,
    enableExceptionAutocapture: true,
    // eslint-disable-next-line @typescript-eslint/naming-convention -- PostHog's option name
    before_send: (event) => {
      if (!event) return event;
      const properties = { ...event.properties };
      // No distinctId passed → the SDK minted an anonymous one and flagged it.
      const isAnonymous = properties.$process_person_profile === false;
      if (isAnonymous && distinctId) delete properties.$process_person_profile;
      if (sessionId && !properties.$session_id) properties.$session_id = sessionId;
      return {
        ...event,
        distinctId: isAnonymous && distinctId ? distinctId : event.distinctId,
        properties,
      };
    },
  });
};
