import { Analytics, getShopAnalytics, useNonce } from '@shopify/hydrogen';
import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  type ShouldRevalidateFunction,
  useRouteError,
  useRouteLoaderData,
} from 'react-router';

import favicon from '~/assets/favicon.svg';
import { Heading } from '~/components/common/Heading';
import { Button } from '~/components/ui/button';
import { MICROCOPY } from '~/content/microcopy';
import { FOOTER_QUERY, HEADER_QUERY } from '~/lib/fragments';

import type { Route } from './+types/root';
import { PageLayout } from './components/layout/PageLayout';
import tailwindCss from './styles/tailwind.css?url';

export type RootLoader = typeof loader;

/**
 * This is important to avoid re-fetching root queries on sub-navigations
 */
export const shouldRevalidate: ShouldRevalidateFunction = ({ formMethod, currentUrl, nextUrl }) => {
  // revalidate when a mutation is performed e.g add to cart, login...
  if (formMethod && formMethod !== 'GET') return true;

  // revalidate when manually revalidating via useRevalidator
  if (currentUrl.toString() === nextUrl.toString()) return true;

  // Defaulting to no revalidation for root loader data to improve performance.
  // When using this feature, you risk your UI getting out of sync with your server.
  // Use with caution. If you are uncomfortable with this optimization, update the
  // line below to `return defaultShouldRevalidate` instead.
  // For more details see: https://remix.run/docs/en/main/route/should-revalidate
  return false;
};

/**
 * The Tailwind stylesheet is added via a <link> in the Layout component
 * (not here) to prevent a bug in development HMR updates.
 *
 * This avoids the "failed to execute 'insertBefore' on 'Node'" error
 * that occurs after editing and navigating to another page.
 *
 * It's a temporary fix until the issue is resolved.
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
  // Start fetching non-critical data without blocking time to first byte
  const deferredData = loadDeferredData(args);

  // Await the critical data required to render initial state of the page
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
      // localize the privacy banner
      country: args.context.storefront.i18n.country,
      language: args.context.storefront.i18n.language,
    },
  };
}

/**
 * Load data necessary for rendering content above the fold. This is the critical data
 * needed to render the page. If it's unavailable, the whole page should 400 or 500 error.
 */
async function loadCriticalData({ context }: Route.LoaderArgs) {
  const { storefront } = context;

  const [header] = await Promise.all([
    storefront.query(HEADER_QUERY, {
      cache: storefront.CacheLong(),
      variables: {
        headerMenuHandle: 'main-menu', // Adjust to your header menu handle
      },
    }),
    // Add other queries here, so that they are loaded in parallel
  ]);

  // Confirms the typed Storefront client is wired and returning live data.
  // Dev-only — `header.shop.name` is a typed `shop { name }` result from HEADER_QUERY.
  if (import.meta.env.DEV) {
    // eslint-disable-next-line no-console -- intentional dev-only connectivity check (GD-4)
    console.log(`[storefront] Connected to "${header.shop.name}"`);
  }

  return { header };
}

/**
 * Load data for rendering content below the fold. This data is deferred and will be
 * fetched after the initial page load. If it's unavailable, the page should still 200.
 * Make sure to not throw any errors here, as it will cause the page to 500.
 */
function loadDeferredData({ context }: Route.LoaderArgs) {
  const { storefront, cart } = context;

  // defer the footer query (below the fold)
  const footer = storefront
    .query(FOOTER_QUERY, {
      cache: storefront.CacheLong(),
      variables: {
        footerMenuHandle: 'footer', // Adjust to your footer menu handle
      },
    })
    .catch((error: Error) => {
      // Log query errors, but don't throw them so the page can still render
      console.error(error);
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
      <body className="font-sans text-nav-text antialiased">
        {children}
        <ScrollRestoration nonce={nonce} />
        <Scripts nonce={nonce} />
      </body>
    </html>
  );
};

const App = () => {
  const data = useRouteLoaderData<RootLoader>('root');

  if (!data) {
    return <Outlet />;
  }

  return (
    <Analytics.Provider cart={data.cart} shop={data.shop} consent={data.consent}>
      <PageLayout {...data}>
        <Outlet />
      </PageLayout>
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
        <p className="text-concrete text-sm font-medium tracking-caps uppercase">{errorStatus}</p>
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
        <p className="mt-4 max-w-md text-sm text-neutral-700">
          An unexpected error occurred. Please try again.
        </p>
      )}
      {isNotFound ? (
        <Button asChild variant="brand-outline" size="sm" className="mt-6">
          <a href="/">Homepage</a>
        </Button>
      ) : (
        <a
          href="/"
          className="bg-brand text-brand-text mt-8 inline-block w-fit px-6 py-3 font-mono text-sm font-medium tracking-caps uppercase transition-opacity hover:opacity-90"
        >
          [ Back to shopping ]
        </a>
      )}
      {!isNotFound && errorMessage && (
        <pre className="mt-8 max-w-full overflow-x-auto text-left text-xs text-neutral-400">
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
