/**
 * Locked utility microcopy from the Brand Guidelines (05 Channels → Website),
 * implemented by 7PA-243. These strings are verbatim spec — don't reword them
 * here; the guidelines page is the source of truth.
 */
export const MICROCOPY = {
  emptyCart: "Cart's empty. Try the new drop.",
  notFound: '404. We took a wrong turn at Lands End. Try the homepage.',
  /** The 404's button back to the homepage. */
  notFoundCta: 'Homepage',
  /** The route error boundary's non-404 surface. */
  serverError: {
    heading: 'Something went wrong',
    body: 'An unexpected error occurred. Please try again.',
    cta: 'Back to shopping',
  },
} as const;
