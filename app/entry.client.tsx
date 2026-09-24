import { PostHogProvider } from '@posthog/react';
import { NonceProvider } from '@shopify/hydrogen';
import posthog from 'posthog-js';
import { startTransition, StrictMode } from 'react';
import { hydrateRoot } from 'react-dom/client';
import { HydratedRouter } from 'react-router/dom';

const posthogToken = import.meta.env.VITE_PUBLIC_POSTHOG_PROJECT_TOKEN;
const posthogHost = import.meta.env.VITE_PUBLIC_POSTHOG_HOST;

if (import.meta.env.DEV && !posthogToken) {
  throw new Error(
    'VITE_PUBLIC_POSTHOG_PROJECT_TOKEN variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once VITE_PUBLIC_POSTHOG_PROJECT_TOKEN is configured'
  );
}
if (import.meta.env.DEV && !posthogHost) {
  throw new Error(
    'VITE_PUBLIC_POSTHOG_HOST variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once VITE_PUBLIC_POSTHOG_HOST is configured'
  );
}

const posthogClient =
  posthogToken && posthogHost
    ? posthog.init(posthogToken, {
        api_host: posthogHost,
        defaults: '2026-05-30',
        capture_exceptions: true,
        tracing_headers: [window.location.hostname],
        logs: {
          serviceName: 'storefront-web',
          environment: import.meta.env.MODE,
        },
      })
    : undefined;

if (!window.location.origin.includes('webcache.googleusercontent.com')) {
  startTransition(() => {
    const existingNonce = document.querySelector<HTMLScriptElement>('script[nonce]')?.nonce;
    const router = <HydratedRouter />;

    hydrateRoot(
      document,
      <StrictMode>
        <NonceProvider value={existingNonce}>
          {posthogClient ? (
            <PostHogProvider client={posthogClient}>{router}</PostHogProvider>
          ) : (
            router
          )}
        </NonceProvider>
      </StrictMode>
    );
  });
}
