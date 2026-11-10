import { isRouteErrorResponse } from 'react-router';

/**
 * Throwable HTTP responses for loaders/actions. Missing handles and unknown
 * resources are 404s (rendered by the root ErrorBoundary's not-found branch),
 * never `throw new Error` — that would surface as a 500.
 */
export const notFound = (message = 'Not found') => new Response(message, { status: 404 });

export type RouteErrorDescription = { status: number; message: string; isNotFound: boolean };

/**
 * What the root ErrorBoundary shows for a thrown value: a route `Response`/
 * `data()` (whose `data` is untyped, so it is string-coerced; an object body
 * would otherwise crash the boundary when rendered), an `Error`, or anything else.
 */
export const describeRouteError = (error: unknown): RouteErrorDescription => {
  const { status, message } = ((): { status: number; message: string } => {
    if (isRouteErrorResponse(error)) {
      const body: unknown = error.data;
      const text =
        typeof body === 'string'
          ? body
          : body &&
              typeof body === 'object' &&
              'message' in body &&
              typeof body.message === 'string'
            ? body.message
            : body == null
              ? ''
              : JSON.stringify(body);
      return { status: error.status, message: text };
    }
    if (error instanceof Error) return { status: 500, message: error.message };
    return { status: 500, message: typeof error === 'string' ? error : 'Unknown error' };
  })();
  return { status, message, isNotFound: status === 404 };
};

/** A 500 for a dependency the page cannot render without (shop chrome, sitemap data). */
export const unavailable = (message = 'Service unavailable') =>
  new Response(message, { status: 500 });

/** `Cache-Control` for the crawler surfaces (robots, sitemaps): one day. */
export const CACHE_ONE_DAY = `max-age=${60 * 60 * 24}`;

/**
 * `Cache-Control` for pages and their navigation data: a browser may keep a
 * copy but must check with the server before reusing it. Without a header,
 * browsers fall back to their own guess and can show a page from before the
 * last deploy until a hard refresh. Hashed /assets/ files stay long-cached.
 */
const CACHE_REVALIDATE = 'no-cache';

/** Sets CACHE_REVALIDATE unless the response already chose its own policy. */
export const withRevalidate = (headers: Headers) => {
  if (!headers.has('Cache-Control')) headers.set('Cache-Control', CACHE_REVALIDATE);
  return headers;
};

/**
 * Wraps a deferred (below-the-fold) query: log and resolve to null instead of
 * rejecting. See common-pitfalls.md → "Defer below-the-fold data".
 */
export const deferQuery = <T>(query: Promise<T>): Promise<T | null> =>
  query.catch((error: unknown) => {
    console.error(error);
    return null;
  });
