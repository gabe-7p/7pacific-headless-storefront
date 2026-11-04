import {
  type CacheInstance,
  type CachingStrategy,
  createShopifyRequestContext,
  createShopifyRouteTemplates,
  createStorefrontClient,
  type RequestScopedPrivateStorefrontClient,
  type StorefrontApi,
} from '@shopify/hydrogen';
import { createContext } from 'react-router';

import { notFound, unavailable } from '~/lib/http';
import { MARKET } from '~/lib/i18n';

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
  // (lib/urls.test.ts pins this against `productUrl`.)
  productInCollection: '/products/:productHandle',
  // Known gap: Hydrogen's `article` template needs a `:blogHandle` segment, but
  // the app serves `/journal/:articleHandle`, so legacy `/blogs/journal/*` URLs
  // can only redirect through Shopify's admin redirect table.
});

type QueryDoc = StorefrontApi.DocumentNode;

// The client fills `$country` / `$language` from the request context.
type QueryVariables<Doc extends QueryDoc> = Omit<
  StorefrontApi.VariablesOf<Doc>,
  'country' | 'language'
>;

/**
 * Options of a Storefront read. `cache` is required, which is the type-level
 * enforcement of "every read passes an explicit cache"; `variables` is required
 * only when the document declares a required one.
 */
export type QueryStorefrontOptions<Doc extends QueryDoc> = { cache: CachingStrategy } & (Record<
  string,
  never
> extends QueryVariables<Doc>
  ? { variables?: QueryVariables<Doc> }
  : { variables: QueryVariables<Doc> });

/**
 * Runs a Storefront read and returns its data, or null when the API returned
 * none. GraphQL `errors` are returned by `graphql()`, not thrown, so they are
 * logged here, once, for every caller. Transport failures still throw.
 */
export const queryStorefront = async <const Doc extends QueryDoc>(
  client: StorefrontClient,
  doc: Doc,
  options: QueryStorefrontOptions<Doc>
): Promise<StorefrontApi.ResultOf<Doc> | null> => {
  // The client's rest-param type is conditional on the (generic) document and
  // cannot be resolved here; `options` is already checked against the same rules.
  const { data, errors } = (await client.graphql(doc, options as never)) as {
    data: StorefrontApi.ResultOf<Doc> | null;
    errors?: unknown;
  };
  if (errors) console.error(errors);
  return data ?? null;
};

/**
 * Like `queryStorefront`, but returns the `select`ed part of the result and
 * throws when it is missing: no data at all (the API is down) is
 * `unavailable()` (500); a null selected field (unknown handle) is
 * `notFound(message)` (404).
 */
export const queryStorefrontOrThrow = async <const Doc extends QueryDoc, T>(
  client: StorefrontClient,
  doc: Doc,
  options: QueryStorefrontOptions<Doc>,
  select: (data: StorefrontApi.ResultOf<Doc>) => T | null | undefined,
  message: string
): Promise<NonNullable<T>> => {
  const data = await queryStorefront(client, doc, options);
  if (!data) throw unavailable();
  const selected = select(data);
  if (selected === null || selected === undefined) throw notFound(message);
  return selected;
};

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
 * server-side. Caching: see .claude/rules/graphql-fragments.md.
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
      i18n: MARKET,
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
