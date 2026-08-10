import { Analytics, getShopAnalytics, useNonce } from '@shopify/hydrogen';
import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  type ShouldRevalidateFunction,
  useMatches,
  useRouteError,
  useRouteLoaderData,
} from 'react-router';

import favicon from '~/assets/favicon.svg';
import { Cta } from '~/components/common/Cta';
import { Heading } from '~/components/common/Heading';
import { MICROCOPY } from '~/content/microcopy';
import { FOOTER_QUERY, HEADER_QUERY } from '~/lib/fragments';

import type { Route } from './+types/root';
import { PageLayout } from './components/layout/PageLayout';
import tailwindCss from './styles/tailwind.css?url';

export type RootLoader = typeof loader;

/**
 * Root data (menus, cart, shop analytics) only revalidates on mutations and
 * explicit useRevalidator calls — not on sub-navigations. Deliberate perf
 * trade-off: https://remix.run/docs/en/main/route/should-revalidate
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
    {
      rel: 'preconnect',
      href: 'https://cdn.shopify.com',
    },
    {
      rel: 'preconnect',
      href: 'https://shop.app',
    },
    { rel: 'icon', type: 'image/svg+xml', href: favicon },
    // Legacy fallback (public/favicon.ico): browsers and tools that ignore the
    // SVG link probe /favicon.ico directly — without it that request 404s.
    { rel: 'alternate icon', type: 'image/x-icon', href: '/favicon.ico' },
  ];
}

export async function loader(args: Route.LoaderArgs) {
  const deferredData = loadDeferredData(args);
  const criticalData = await loadCriticalData(args);

  const { storefront, env } = args.context;

  return {
    ...deferredData,
    ...criticalData,
    publicStoreDomain: env.PUBLIC_STORE_DOMAIN,
    shop: getShopAnalytics({
      storefront,
      publicStorefrontId: env.PUBLIC_STOREFRONT_ID,
    }),
    consent: {
      checkoutDomain: env.PUBLIC_CHECKOUT_DOMAIN,
      storefrontAccessToken: env.PUBLIC_STOREFRONT_API_TOKEN,
      withPrivacyBanner: false,
      country: args.context.storefront.i18n.country,
      language: args.context.storefront.i18n.language,
    },
  };
}

/** Awaited before first byte — a failure here errors the whole page. */
async function loadCriticalData({ context }: Route.LoaderArgs) {
  const { storefront } = context;

  const header = await storefront.query(HEADER_QUERY, {
    cache: storefront.CacheLong(),
    variables: { headerMenuHandle: 'main-menu' },
  });

  // Confirms the typed Storefront client is wired and returning live data.
  // Dev-only — `header.shop.name` is a typed `shop { name }` result from HEADER_QUERY.
  if (import.meta.env.DEV) {
    // eslint-disable-next-line no-console -- intentional dev-only connectivity check (GD-4)
    console.log(`[storefront] Connected to "${header.shop.name}"`);
  }

  return { header };
}

/** Returned as promises and awaited in-component — must never throw. */
function loadDeferredData({ context }: Route.LoaderArgs) {
  const { storefront, cart } = context;

  const footer = storefront
    .query(FOOTER_QUERY, {
      cache: storefront.CacheLong(),
      variables: { footerMenuHandle: 'footer' },
    })
    .catch((error: Error) => {
      console.error(error); // log, don't throw — the page still renders
      return null;
    });
  return {
    cart: cart.get(),
    footer,
  };
}

export const Layout = ({ children }: { children?: React.ReactNode }) => {
  const nonce = useNonce();

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <link rel="stylesheet" href={tailwindCss}></link>
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
    <Analytics.Provider cart={data.cart} shop={data.shop} consent={data.consent}>
      {isBareChrome ? (
        <Outlet />
      ) : (
        <PageLayout {...data}>
          <Outlet />
        </PageLayout>
      )}
    </Analytics.Provider>
  );
};

export const ErrorBoundary = () => {
  const rootData = useRouteLoaderData<RootLoader>('root');
  const error = useRouteError();
  let errorMessage = 'Unknown error';
  let errorStatus = 500;

  if (isRouteErrorResponse(error)) {
    errorMessage = error?.data?.message ?? error.data;
    errorStatus = error.status;
  } else if (error instanceof Error) {
    errorMessage = error.message;
  }

  const isNotFound = errorStatus === 404;

  const content = (
    // Live doesn't centre the 404 vertically — it sits a fixed distance below
    // the header, flush with the page gutter.
    // Past --page-max the centring margin is the gutter, so the padding drops
    // to zero — that's what puts live's text 20px from the viewport edge.
    // Both gutters use arbitrary min-widths so Tailwind orders them by width
    // (a named `md:` would sort after `min-[1440px]:` and win at 1440).
    <div className="mx-auto min-h-[60vh] max-w-(--page-max) px-3 pt-[120px] pb-20 min-[768px]:px-5 min-[768px]:pt-[155px] min-[1440px]:px-0">
      {!isNotFound && (
        <p className="text-support text-sm font-medium tracking-caps uppercase">{errorStatus}</p>
      )}
      <Heading
        as="h1"
        size={isNotFound ? 'none' : 'xl'}
        variant={isNotFound ? 'quiet' : 'brand'}
        className={isNotFound ? 'max-w-md text-[18.7px] font-semibold md:text-[22px]' : 'mt-3'}
      >
        {/* 404 copy is locked microcopy (7PA-243) — verbatim. */}
        {isNotFound ? MICROCOPY.notFound : 'Something went wrong'}
      </Heading>
      {!isNotFound && (
        <p className="mt-4 max-w-md text-sm text-ink">
          An unexpected error occurred. Please try again.
        </p>
      )}
      {isNotFound ? (
        <Cta href="/" size="sm" className="mt-6">
          Homepage
        </Cta>
      ) : (
        <Cta href="/" variant="brand" size="lg" className="mt-8">
          Back to shopping
        </Cta>
      )}
      {!isNotFound && errorMessage && (
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
    <Analytics.Provider cart={rootData.cart} shop={rootData.shop} consent={rootData.consent}>
      <PageLayout {...rootData}>{content}</PageLayout>
    </Analytics.Provider>
  );
};

export default App;
