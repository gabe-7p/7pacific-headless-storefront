import { getPostHogOrigins } from '~/lib/posthog';

/**
 * The Content-Security-Policy header, app-owned since Hydrogen 2026.10
 * (classic's `createContentSecurityPolicy` is gone). Same allowlist as before:
 * self + Shopify's CDN/scripts, the checkout and store domains for the
 * Storefront API and consent calls, PostHog's ingestion + assets hosts, and
 * `blob:` workers for the session-replay recorder. Fonts are self-hosted.
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
      ...storeOrigins,
      ...posthog,
    ],
    'font-src': ["'self'", 'https://cdn.shopify.com'],
    'script-src': ["'self'", ...shopifyScripts, ...posthog, `'nonce-${nonce}'`],
    'worker-src': ["'self'", 'blob:'],
  };

  return Object.entries(directives)
    .map(([name, sources]) => `${name} ${sources.join(' ')}`)
    .join('; ');
};

/** A fresh CSP nonce per request (base64url, 128 bits). */
export const createNonce = (): string => crypto.randomUUID().replace(/-/g, '');
