/**
 * Throwable HTTP responses for loaders/actions. Missing handles and unknown
 * resources are 404s (rendered by the root ErrorBoundary's not-found branch),
 * never `throw new Error` — that would surface as a 500.
 */
export const notFound = (message = 'Not found') => new Response(message, { status: 404 });

/** `Cache-Control` for the crawler surfaces (robots, sitemaps): one day. */
export const CACHE_ONE_DAY = `max-age=${60 * 60 * 24}`;

/**
 * Wraps a deferred (below-the-fold) query: log and resolve to null instead of
 * rejecting. See common-pitfalls.md → "Defer below-the-fold data".
 */
export const deferQuery = <T>(query: Promise<T>): Promise<T | null> =>
  query.catch((error: unknown) => {
    console.error(error);
    return null;
  });
