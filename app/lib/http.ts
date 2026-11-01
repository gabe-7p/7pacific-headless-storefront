/**
 * Throwable HTTP responses for loaders/actions. Missing handles and unknown
 * resources are 404s (rendered by the root ErrorBoundary's not-found branch),
 * never `throw new Error` — that would surface as a 500.
 */
export const notFound = (message = 'Not found') => new Response(message, { status: 404 });

/** `Cache-Control` for the crawler surfaces (robots, sitemaps): one day. */
export const CACHE_ONE_DAY = `max-age=${60 * 60 * 24}`;

/**
 * Below-the-fold data is returned from loaders as a promise and rendered with
 * `<Suspense>`/`<Await>`; a rejection would 500 the whole page, so every
 * deferred query goes through here: log and resolve to null instead.
 */
export const deferQuery = <T>(query: Promise<T>): Promise<T | null> =>
  query.catch((error: unknown) => {
    console.error(error);
    return null;
  });
