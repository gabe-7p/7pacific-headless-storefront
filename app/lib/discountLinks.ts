import { discountUrl } from '~/lib/urls';

/**
 * Creator discount links: `7pacificapparel.com/discount/<CODE>`.
 *
 * Shopify's own shareable link lives on the checkout subdomain, which serves
 * the Online Store redirect theme. That theme sends the visitor here with the
 * code as `?discount=<CODE>`, so both shapes end at the `/discount/:code`
 * route, which puts the code on the visitor's cart and lands them on the page
 * the link names (`?redirect=/products/x`, else the homepage). The landing URL
 * keeps the link's UTMs and carries `creator_code`, which the PostHog bridge
 * reads (lib/analytics/posthog.client.ts) and Shopify's session reports see in
 * the landing-page URL.
 */

/** The param the Online Store redirect theme appends (and Shopify's `/discount` links use). */
const DISCOUNT_PARAM = 'discount';
/** Where to land after applying the code: a same-origin path. */
const REDIRECT_PARAM = 'redirect';
/** The landing-page marker: the code a creator link applied. */
export const CREATOR_CODE_PARAM = 'creator_code';

/** Shopify caps a discount code at 255 characters. */
const MAX_CODE_LENGTH = 255;

/**
 * Tracking tags for a link shared without any: Shopify's sessions report and
 * PostHog's `utm_*` breakdowns then still group visits by code.
 */
const DEFAULT_UTM = { utm_source: 'creator', utm_medium: 'discount_link' } as const;

/** A trimmed code, or null when it's empty or longer than Shopify allows. */
export const normalizeDiscountCode = (raw: string | null | undefined): string | null => {
  const code = raw?.trim();
  return code && code.length <= MAX_CODE_LENGTH ? code : null;
};

/** A same-origin path to land on: the given one when it is a plain `/path`, else `/`. */
const landingPath = (raw: string | null): string =>
  raw && raw.startsWith('/') && !raw.startsWith('//') && !raw.startsWith('/\\') ? raw : '/';

/**
 * Where a `/discount/:code` link lands: the `redirect` path (with any query it
 * carries), plus the link's other params (UTMs first among them), plus
 * `creator_code`. A link with no `utm_source` gets the default creator UTMs.
 * Returns a path and query, never an absolute URL, so it can't leave the site.
 */
export const discountLandingUrl = (link: URL, code: string): string => {
  const target = new URL(landingPath(link.searchParams.get(REDIRECT_PARAM)), link.origin);
  // A `//host` or `/\host` path is filtered above; this guards the rest.
  if (target.origin !== link.origin) return discountLandingUrl(new URL('/', link.origin), code);

  link.searchParams.forEach((value, key) => {
    if (key === REDIRECT_PARAM || key === DISCOUNT_PARAM || key === CREATOR_CODE_PARAM) return;
    if (!target.searchParams.has(key)) target.searchParams.append(key, value);
  });
  if (!target.searchParams.has('utm_source')) {
    target.searchParams.set('utm_source', DEFAULT_UTM.utm_source);
    target.searchParams.set('utm_medium', DEFAULT_UTM.utm_medium);
    target.searchParams.set('utm_campaign', code.toLowerCase());
  }
  target.searchParams.set(CREATOR_CODE_PARAM, code);
  return `${target.pathname}${target.search}`;
};

/**
 * The `/discount/:code` link for a page that arrived with `?discount=<CODE>`
 * (the redirect theme's hand-off), or null when there's no usable code. The
 * page's path becomes `redirect` and its other params ride along, so
 * `discountLandingUrl` rebuilds the same page.
 */
export const discountLinkFromQuery = (url: URL): string | null => {
  const code = normalizeDiscountCode(url.searchParams.get(DISCOUNT_PARAM));
  if (!code || url.pathname.startsWith(discountUrl(''))) return null;
  const params = new URLSearchParams(url.searchParams);
  params.delete(DISCOUNT_PARAM);
  params.set(REDIRECT_PARAM, url.pathname);
  return `${discountUrl(code)}?${params.toString()}`;
};
