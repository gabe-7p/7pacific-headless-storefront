import { PostHogProvider } from '@posthog/react';
import { posthog } from 'posthog-js';
import { startTransition, StrictMode } from 'react';
import { hydrateRoot } from 'react-dom/client';
import { HydratedRouter } from 'react-router/dom';

import { NonceProvider } from '~/lib/nonce';
import { POSTHOG_HOST_META, POSTHOG_KEY_META } from '~/lib/posthog';
import { initPostHog } from '~/lib/posthog.client';

// Runtime config rendered into <head> by root.tsx `Layout` (see lib/posthog.ts).
// Absent → PostHog stays uninitialized and every capture is a no-op.
const readMeta = (name: string) =>
  document.querySelector<HTMLMetaElement>(`meta[name="${name}"]`)?.content;
const posthogKey = readMeta(POSTHOG_KEY_META);
const posthogHost = readMeta(POSTHOG_HOST_META);

if (posthogKey && posthogHost) {
  initPostHog({ key: posthogKey, host: posthogHost });
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
