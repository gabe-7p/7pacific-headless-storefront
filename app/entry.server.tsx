import { isbot } from 'isbot';
import { renderToReadableStream } from 'react-dom/server';
import { type EntryContext, type RouterContextProvider, ServerRouter } from 'react-router';

import { createCsp, createNonce } from '~/lib/csp';
import { NonceProvider } from '~/lib/nonce';

export default async function handleRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  reactRouterContext: EntryContext,
  context: RouterContextProvider
) {
  // CSP is app-owned since Hydrogen 2026.10 (lib/csp.ts). One nonce per
  // request, threaded to <Scripts> and <ShopifyScripts> through NonceProvider.
  const nonce = createNonce();
  const csp = createCsp({ nonce, env: context.env });

  const body = await renderToReadableStream(
    <NonceProvider value={nonce}>
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
  responseHeaders.set('Content-Security-Policy', csp);

  return new Response(body, {
    headers: responseHeaders,
    status: responseStatusCode,
  });
}
