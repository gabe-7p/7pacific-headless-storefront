import { createContentSecurityPolicy, type HydrogenRouterContextProvider } from '@shopify/hydrogen';
import { isbot } from 'isbot';
import { renderToReadableStream } from 'react-dom/server';
import type { EntryContext } from 'react-router';
import { ServerRouter } from 'react-router';

import { getPostHogOrigins } from '~/lib/posthog';

export default async function handleRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  reactRouterContext: EntryContext,
  context: HydrogenRouterContextProvider
) {
  const posthogOrigins = getPostHogOrigins(context.env.PUBLIC_POSTHOG_HOST);
  const { nonce, header, NonceProvider } = createContentSecurityPolicy({
    shop: {
      checkoutDomain: context.env.PUBLIC_CHECKOUT_DOMAIN,
      storeDomain: context.env.PUBLIC_STORE_DOMAIN,
    },
    // Brand fonts are self-hosted (@fontsource-variable imports in
    // tailwind.css, bundled by Vite and served same-origin), so no
    // third-party font hosts are allowed. These are merged with Hydrogen's
    // defaults.
    styleSrc: ["'self'", "'unsafe-inline'", 'https://cdn.shopify.com'],
    fontSrc: ["'self'", 'https://cdn.shopify.com'],
    // PostHog: events + remote config go to the ingestion host; posthog-js
    // lazy-loads its extensions (session-replay recorder, …) from the matching
    // assets host. connectSrc merges with Hydrogen's defaults; scriptSrc does
    // not (Hydrogen only appends the nonce), so it restates the baseline —
    // the same Shopify hosts Hydrogen's default-src allows scripts from.
    connectSrc: posthogOrigins,
    scriptSrc: ["'self'", 'https://cdn.shopify.com', 'https://shopify.com', ...posthogOrigins],
    workerSrc: ["'self'", 'blob:'],
  });

  const body = await renderToReadableStream(
    <NonceProvider>
      <ServerRouter context={reactRouterContext} url={request.url} nonce={nonce} />
    </NonceProvider>,
    {
      nonce,
      signal: request.signal,
      onError(error) {
        console.error(error);
        responseStatusCode = 500;
      },
    }
  );

  if (isbot(request.headers.get('user-agent'))) {
    await body.allReady;
  }

  responseHeaders.set('Content-Type', 'text/html');
  responseHeaders.set('Content-Security-Policy', header);

  return new Response(body, {
    headers: responseHeaders,
    status: responseStatusCode,
  });
}
