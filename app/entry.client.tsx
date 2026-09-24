import { PostHogProvider } from '@posthog/react';
import { NonceProvider } from '@shopify/hydrogen';
import { posthog } from 'posthog-js';
import { startTransition, StrictMode } from 'react';
import { hydrateRoot } from 'react-dom/client';
import { HydratedRouter } from 'react-router/dom';

import { POSTHOG_HOST_META, POSTHOG_KEY_META } from '~/lib/posthog';

// Runtime config rendered into <head> by root.tsx `Layout` (see lib/posthog.ts).
// Absent → PostHog stays uninitialized and every capture is a no-op.
const readMeta = (name: string) =>
  document.querySelector<HTMLMetaElement>(`meta[name="${name}"]`)?.content;
const posthogKey = readMeta(POSTHOG_KEY_META);
const posthogHost = readMeta(POSTHOG_HOST_META);

if (posthogKey && posthogHost) {
  posthog.init(posthogKey, {
    api_host: posthogHost,
    // Pinned defaults: pageviews on every history change (client-side
    // navigations included), plus pageleave.
    defaults: '2026-05-30',
    capture_exceptions: true,
    // Tag the app's own fetches (loader/action requests) with the visitor's
    // ids, so lib/posthog.server.ts can attribute server-side events.
    tracing_headers: [window.location.hostname],
    session_recording: { maskAllInputs: true },
    logs: {
      serviceName: 'storefront-web',
      environment: import.meta.env.MODE,
    },
  });
}

if (!window.location.origin.includes('webcache.googleusercontent.com')) {
  startTransition(() => {
    const existingNonce = document.querySelector<HTMLScriptElement>('script[nonce]')?.nonce;

    hydrateRoot(
      document,
      <StrictMode>
        <NonceProvider value={existingNonce}>
          {/* Always mounted, so usePostHog() is never undefined — even with PostHog off. */}
          <PostHogProvider client={posthog}>
            <HydratedRouter />
          </PostHogProvider>
        </NonceProvider>
      </StrictMode>
    );
  });
}
