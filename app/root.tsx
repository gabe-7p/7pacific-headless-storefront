import { usePostHog } from '@posthog/react';
import { Cache } from '@shopify/hydrogen';
import { ShopifyScripts } from '@shopify/hydrogen/react';
import { useEffect } from 'react';
import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  type ShouldRevalidateFunction,
  useLocation,
  useMatches,
  useNavigate,
  useRouteError,
  useRouteLoaderData,
} from 'react-router';

import favicon from '~/assets/favicon.svg';
import {
  CartAnalyticsTracker,
  MetaPixelBridge,
  PageViewedTracker,
  PostHogBridge,
} from '~/components/analytics/Trackers';
import { Cta } from '~/components/common/Cta';
import { Heading } from '~/components/common/Heading';
import { NotFound } from '~/components/content/NotFound';
import { HANDLES } from '~/content/links';
import {
  getPostHogConfig,
  getRouteErrorException,
  POSTHOG_HOST_META,
  POSTHOG_KEY_META,
} from '~/lib/analytics/posthog';
import { CartProvider } from '~/lib/cart';
import { cartHandlers } from '~/lib/cart.server';
import { FOOTER_QUERY, HEADER_QUERY } from '~/lib/fragments';
import { deferQuery } from '~/lib/http';
import { MARKET } from '~/lib/i18n';
import { useNonce } from '~/lib/nonce';
import { shopifyMiddleware } from '~/lib/shopifyMiddleware';
import { routeTemplates, storefrontClientContext } from '~/lib/storefront';

import type { Route } from './+types/root';
import { PageLayout } from './components/layout/PageLayout';
import tailwindCss from './styles/tailwind.css?url';

export type RootLoader = typeof loader;

/** Every request runs through Hydrogen's lifecycle first — see lib/shopifyMiddleware. */
export const middleware: Route.MiddlewareFunction[] = [shopifyMiddleware];

/**
 * Root data (menus, shop identity) only revalidates on mutations and explicit
 * useRevalidator calls — not on sub-navigations. The cart lives in the client
 * store now, so it never needs the root loader to re-run.
 */
export const shouldRevalidate: ShouldRevalidateFunction = ({ formMethod, currentUrl, nextUrl }) => {
  if (formMethod && formMethod !== 'GET') return true;
  if (currentUrl.toString() === nextUrl.toString()) return true;
  return false;
};

/**
 * The Tailwind stylesheet is linked in Layout, not here — links() insertion
 * breaks dev HMR ("failed to execute 'insertBefore' on 'Node'"):
 * https://github.com/remix-run/remix/issues/9242
 */
export function links() {
  return [
    { rel: 'preconnect', href: 'https://cdn.shopify.com' },
    { rel: 'preconnect', href: 'https://shop.app' },
    { rel: 'icon', type: 'image/svg+xml', href: favicon },
    // Legacy fallback (public/favicon.ico): browsers and tools that ignore the
    // SVG link probe /favicon.ico directly — without it that request 404s.
    { rel: 'alternate icon', type: 'image/x-icon', href: '/favicon.ico' },
  ];
}

export async function loader({ context, request, url }: Route.LoaderArgs) {
  const { env } = context;
  const storefront = context.get(storefrontClientContext);

  // Below the fold: deferred and guarded (never throws).
  const footer = deferQuery(
    storefront
      .graphql(FOOTER_QUERY, {
        variables: { footerMenuHandle: HANDLES.footerMenu },
        cache: Cache.long(),
      })
      .then(({ data }) => data)
  );

  // Above the fold, in parallel: the header chrome and the visitor's cart.
  // The cart is awaited so the first paint has it (no empty-then-filled flicker).
  const [headerResult, cartResult] = await Promise.all([
    storefront.graphql(HEADER_QUERY, {
      variables: { headerMenuHandle: HANDLES.headerMenu },
      cache: Cache.long(),
    }),
    cartHandlers.get({ storefrontClient: storefront, request }),
  ]);
  if (headerResult.errors) console.error(headerResult.errors);
  if (!headerResult.data) throw new Response('Shop unavailable', { status: 500 });
  const header = headerResult.data;

  // Confirms the typed Storefront client is wired and returning live data.
  if (import.meta.env.DEV) {
    // eslint-disable-next-line no-console -- intentional dev-only connectivity check (GD-4)
    console.log(`[storefront] Connected to "${header.shop.name}"`);
  }

  return {
    header,
    footer,
    cartData: cartResult.data,
    publicStoreDomain: env.PUBLIC_STORE_DOMAIN,
    posthog: getPostHogConfig(env, {
      isDev: import.meta.env.DEV,
      hostname: url.hostname,
    }),
    // Meta Pixel (lib/analytics/meta-pixel.client.ts): the ID reaches the
    // browser through this loader, never through a client-side env read.
    metaPixelId: env.PUBLIC_META_PIXEL_ID || null,
    metaDomainVerification: env.PUBLIC_META_DOMAIN_VERIFICATION || null,
    // What <ShopifyScripts> needs: shop identity for analytics + consent, and
    // the active currency for browse events (they carry no price of their own).
    shop: {
      shopId: header.shop.id,
      storefrontId: env.PUBLIC_STOREFRONT_ID ?? '',
      myshopifyDomain: env.PUBLIC_STORE_DOMAIN,
    },
    currency: header.localization.country.currency.isoCode,
  };
}

export const Layout = ({ children }: { children?: React.ReactNode }) => {
  const nonce = useNonce();
  const navigate = useNavigate();
  // Absent when the root loader itself failed (bare error page).
  const rootData = useRouteLoaderData<RootLoader>('root');

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <link rel="stylesheet" href={tailwindCss}></link>
        {/* Shopify's runtime: Standard Actions (the cart contract), the
            analytics bus, Customer Privacy + the consent banner where a
            visitor's region requires one (nothing in the US). */}
        {rootData && (
          <ShopifyScripts
            shop={rootData.shop}
            i18n={{ ...MARKET, currency: rootData.currency }}
            analytics={{ channel: 'hydrogen' }}
            consent={{ mode: 'default-banner' }}
            navigate={navigate}
            routes={routeTemplates}
            nonce={nonce}
          />
        )}
        {/* Runtime PostHog config for entry.client (per-Oxygen-environment; absent = off). */}
        {rootData?.posthog && <meta name={POSTHOG_KEY_META} content={rootData.posthog.key} />}
        {rootData?.posthog && <meta name={POSTHOG_HOST_META} content={rootData.posthog.host} />}
        {/* Meta domain verification (Events Manager → Brand Safety → Domains); optional. */}
        {rootData?.metaDomainVerification && (
          <meta name="facebook-domain-verification" content={rootData.metaDomainVerification} />
        )}
        <Meta />
        <Links />
      </head>
      {/* bg-field: the brand's Court field — the page ground per Meridian on Carbon. */}
      <body className="bg-field font-sans text-nav-text antialiased">
        {children}
        <ScrollRestoration nonce={nonce} />
        <Scripts nonce={nonce} />
      </body>
    </html>
  );
};

/**
 * Route-level layout options. A route opts out of the site chrome
 * (announcement/header/footer) with `export const handle: RouteHandle =
 * { chrome: false }` — it then owns its full page, including a `main`
 * landmark (see routes/athletes.$handle.tsx).
 */
export type RouteHandle = { chrome?: boolean };

const App = () => {
  const data = useRouteLoaderData<RootLoader>('root');
  const matches = useMatches();
  const isBareChrome = matches.some(
    (match) => (match.handle as RouteHandle | undefined)?.chrome === false
  );

  if (!data) {
    return <Outlet />;
  }

  return (
    <CartProvider initialData={data.cartData}>
      <PageViewedTracker />
      <CartAnalyticsTracker />
      <PostHogBridge />
      <MetaPixelBridge pixelId={data.metaPixelId} />
      {isBareChrome ? (
        <Outlet />
      ) : (
        <PageLayout {...data}>
          <Outlet />
        </PageLayout>
      )}
    </CartProvider>
  );
};

export const ErrorBoundary = () => {
  const rootData = useRouteLoaderData<RootLoader>('root');
  const error = useRouteError();
  const posthog = usePostHog();
  const { pathname } = useLocation();
  let errorMessage = 'Unknown error';
  let errorStatus = 500;

  if (isRouteErrorResponse(error)) {
    errorMessage = error?.data?.message ?? error.data;
    errorStatus = error.status;
  } else if (error instanceof Error) {
    errorMessage = error.message;
  }

  const isNotFound = errorStatus === 404;

  useEffect(() => {
    if (isNotFound) return;
    if (isRouteErrorResponse(error)) {
      const { status, statusText } = error;
      posthog.captureException(getRouteErrorException(error), { status, statusText, pathname });
    } else {
      posthog.captureException(error);
    }
  }, [error, isNotFound, pathname, posthog]);

  const content = isNotFound ? (
    <NotFound />
  ) : (
    // Same offset/gutter treatment as the 404 (see components/content/NotFound
    // for the live-parity rationale) so both error surfaces sit identically.
    <div className="mx-auto min-h-[60vh] max-w-(--page-max) px-3 pt-[120px] pb-20 min-[768px]:px-5 min-[768px]:pt-[155px] min-[1440px]:px-0">
      <p className="text-support text-sm font-medium tracking-caps uppercase">{errorStatus}</p>
      <Heading as="h1" size="xl" className="mt-3">
        Something went wrong
      </Heading>
      <p className="mt-4 max-w-md text-sm text-ink">
        An unexpected error occurred. Please try again.
      </p>
      <Cta href="/" variant="brand" size="lg" className="mt-8">
        Back to shopping
      </Cta>
      {errorMessage && (
        <pre className="mt-8 max-w-full overflow-x-auto text-left text-xs text-support">
          {errorMessage}
        </pre>
      )}
    </div>
  );

  // Render inside the site chrome when root data is available (the common
  // route-level 404). If the root loader itself failed, fall back to bare.
  if (!rootData) return content;

  return (
    <CartProvider initialData={rootData.cartData}>
      <PageLayout {...rootData}>{content}</PageLayout>
    </CartProvider>
  );
};

export default App;
