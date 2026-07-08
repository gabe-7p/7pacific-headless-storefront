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
import { TextLink } from '~/components/common/TextLink';
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
    { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
    { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossOrigin: 'anonymous' },
    {
      rel: 'stylesheet',
      href: 'https://fonts.googleapis.com/css2?family=Barlow:wght@400;500;600;700&display=swap',
    },
    { rel: 'icon', type: 'image/svg+xml', href: favicon },
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
    <div className="mx-auto flex min-h-[60vh] max-w-(--page-max) flex-col justify-center px-4 py-20">
      {!isNotFound && (
        <p className="text-brand text-sm font-semibold tracking-[0.2em] uppercase">{errorStatus}</p>
      )}
      <Heading
        as="h1"
        size="xl"
        variant={isNotFound ? 'quiet' : 'brand'}
        className={isNotFound ? undefined : 'mt-3'}
      >
        {isNotFound ? '404 Page Not Found' : 'Something went wrong'}
      </Heading>
      <p className="mt-4 max-w-md text-sm text-neutral-700">
        {isNotFound
          ? 'The page you were looking for does not exist.'
          : 'An unexpected error occurred. Please try again.'}
      </p>
      {isNotFound ? (
        <TextLink to="/" className="mt-4 inline-block w-fit text-neutral-700">
          Continue shopping
        </TextLink>
      ) : (
        <a
          href="/"
          className="bg-brand text-brand-text mt-8 inline-block w-fit px-6 py-3 text-sm font-bold tracking-[0.15em] uppercase transition-opacity hover:opacity-90"
        >
          Back to shopping
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
