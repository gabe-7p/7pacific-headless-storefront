import { getPostHogOrigins } from '~/lib/analytics/posthog';

/**
 * The Content-Security-Policy header. Allowlist: self + Shopify's
 * CDN/scripts, its analytics and perf-kit collectors, the checkout and store
 * domains for the Storefront API and consent calls, PostHog's ingestion + assets
 * hosts, `blob:` workers for the session-replay recorder, and the Meta Pixel hosts
 * (fbevents.js from connect.facebook.net, beacons + the tracking image on
 * www.facebook.com). Fonts are self-hosted.
 * Every script tag carries the per-request nonce (React Router's `<Scripts>`
 * and `<ShopifyScripts nonce>`); a dropped nonce leaves pages rendering while
 * hydration is silently dead, so keep the console clear of CSP violations.
 */
export const createCsp = ({
  nonce,
  env,
}: {
  nonce: string;
  env: Pick<Env, 'PUBLIC_STORE_DOMAIN' | 'PUBLIC_CHECKOUT_DOMAIN' | 'PUBLIC_POSTHOG_HOST'>;
}): string => {
  const shopifyScripts = ['https://cdn.shopify.com', 'https://shopify.com'];
  const metaPixel = ['https://www.facebook.com', 'https://connect.facebook.net'];
  const posthog = getPostHogOrigins(env.PUBLIC_POSTHOG_HOST);
  const storeOrigins = [env.PUBLIC_CHECKOUT_DOMAIN, env.PUBLIC_STORE_DOMAIN]
    .filter((domain): domain is string => Boolean(domain))
    .map((domain) => `https://${domain}`);

  const directives: Record<string, Array<string>> = {
    'base-uri': ["'self'"],
    'default-src': ["'self'", `'nonce-${nonce}'`, ...shopifyScripts],
    'frame-ancestors': ["'none'"],
    'style-src': ["'self'", "'unsafe-inline'", 'https://cdn.shopify.com'],
    'connect-src': [
      "'self'",
      'https://cdn.shopify.com/',
      'https://monorail-edge.shopifysvc.com',
      // Shopify's perf-kit (loaded by <ShopifyScripts>) posts its metrics here.
      'https://otlp-http-production.shopifysvc.com',
      ...storeOrigins,
      ...posthog,
      ...metaPixel,
    ],
    'font-src': ["'self'", 'https://cdn.shopify.com'],
    // Explicit so the pixel's tracking image can be added.
    'img-src': ["'self'", ...shopifyScripts, 'https://www.facebook.com'],
    'script-src': [
      "'self'",
      ...shopifyScripts,
      ...posthog,
      'https://connect.facebook.net',
      `'nonce-${nonce}'`,
    ],
    'worker-src': ["'self'", 'blob:'],
  };

  return Object.entries(directives)
    .map(([name, sources]) => `${name} ${sources.join(' ')}`)
    .join('; ');
};

/** A fresh CSP nonce per request (base64url, 128 bits). */
export const createNonce = (): string => crypto.randomUUID().replace(/-/g, '');
