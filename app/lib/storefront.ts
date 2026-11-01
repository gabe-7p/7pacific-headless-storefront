import {
  type CacheInstance,
  type CachingStrategy,
  createShopifyRequestContext,
  createShopifyRouteTemplates,
  createStorefrontClient,
  type RequestScopedPrivateStorefrontClient,
} from '@shopify/hydrogen';
import { createContext } from 'react-router';

/** English/US only for v1 — no locale detection. */
export const I18N = { country: 'US', language: 'EN' } as const;

// The bare client type defaults its per-call extras to `{}`, which erases the
// `cache` option from `graphql()`; carry it through the alias so every
// `Cache.long()` call site type-checks (migrate-to-hydrogen-2026-10 skill).
type CacheOptions = { cache?: CachingStrategy };

export type StorefrontClient = RequestScopedPrivateStorefrontClient<CacheOptions>;

/** The request-scoped Storefront API client, set by the root middleware. */
export const storefrontClientContext = createContext<StorefrontClient>();

/**
 * Where Shopify's own URL shapes map onto this app's routes. Passed to
 * `handleShopifyRoutes`, `handleShopifyRedirects` and `ShopifyScripts` so
 * handler-owned URLs, redirect targets and agent-resolved links agree.
 * Only non-default shapes need listing.
 */
export const routeTemplates = createShopifyRouteTemplates({
  // Products never nest under a collection path on this storefront.
  productInCollection: '/products/:productHandle',
});

const BUYER_IP_HEADERS = ['oxygen-buyer-ip', 'cf-connecting-ip', 'x-forwarded-for'] as const;

/**
 * The customer's IP for the private client (Shopify's bot/abuse signals).
 * Oxygen sets `oxygen-buyer-ip`; MiniOxygen sets nothing, so dev falls back
 * to localhost. Production without a header is a misconfiguration.
 */
const getBuyerIp = (headers: Headers): string => {
  for (const header of BUYER_IP_HEADERS) {
    const ip = headers.get(header)?.split(',')[0]?.trim();
    if (ip) return ip;
  }
  if (process.env.NODE_ENV !== 'production') return '127.0.0.1';
  throw new Error(`${BUYER_IP_HEADERS.join(', ')} is required for private Storefront API clients`);
};

/**
 * One private Storefront API client per request. The private token stays
 * server-side; `cache` + `waitUntil` give catalog reads the Oxygen sub-request
 * cache (opt in per query with `cache: Cache.long()` / `Cache.short()`).
 */
export const createRequestStorefrontClient = (
  request: Request,
  env: Env,
  cache: CacheInstance,
  waitUntil: ExecutionContext['waitUntil']
): StorefrontClient => {
  if (!env.PRIVATE_STOREFRONT_API_TOKEN) {
    throw new Error(
      'PRIVATE_STOREFRONT_API_TOKEN is not set (see docs/architecture.md → Environment).'
    );
  }
  if (!env.PUBLIC_STORE_DOMAIN) {
    throw new Error('PUBLIC_STORE_DOMAIN is not set (see docs/architecture.md → Environment).');
  }

  return createStorefrontClient({
    type: 'private',
    requestContext: createShopifyRequestContext({
      request,
      i18n: I18N,
      buyerIp: getBuyerIp(request.headers),
    }),
    config: {
      storeDomain: env.PUBLIC_STORE_DOMAIN,
      privateStorefrontToken: env.PRIVATE_STOREFRONT_API_TOKEN,
      storefrontId: env.PUBLIC_STOREFRONT_ID,
      cache,
      waitUntil,
    },
  });
};
