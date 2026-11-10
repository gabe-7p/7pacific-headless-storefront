import { isbot } from 'isbot';
import { renderToReadableStream } from 'react-dom/server';
import { type EntryContext, type RouterContextProvider, ServerRouter } from 'react-router';

import { createCsp, createNonce } from '~/lib/csp';
import { withRevalidate } from '~/lib/http';
import { NonceProvider } from '~/lib/nonce';
import { oxygenContext } from '~/lib/oxygen';

export default async function handleRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  reactRouterContext: EntryContext,
  context: RouterContextProvider
) {
  // CSP is app-owned (lib/csp.ts). One nonce per request, threaded to
  // <Scripts> and <ShopifyScripts> through NonceProvider.
  const nonce = createNonce();
  const csp = createCsp({ nonce, env: context.get(oxygenContext).env });

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
  // Pages revalidate on every load, so a deploy shows up without a hard refresh.
  withRevalidate(responseHeaders);

  return new Response(body, {
    headers: responseHeaders,
    status: responseStatusCode,
  });
}

/** Client-side navigations fetch `.data`: same policy as the page itself. */
export function handleDataRequest(response: Response) {
  withRevalidate(response.headers);
  return response;
}
