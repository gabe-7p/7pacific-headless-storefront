/**
 * Throwable HTTP responses for loaders/actions. Missing handles and unknown
 * resources are 404s (rendered by the root ErrorBoundary's not-found branch),
 * never `throw new Error` — that would surface as a 500.
 */
export const notFound = (message = 'Not found') => new Response(message, { status: 404 });
