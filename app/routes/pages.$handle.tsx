import { useLoaderData } from 'react-router';

import { Container } from '~/components/common/Container';
import { Heading } from '~/components/common/Heading';
import { redirectIfHandleIsLocalized } from '~/lib/redirect';
import { pageTitle } from '~/lib/seo';

import type { Route } from './+types/pages.$handle';

export const meta: Route.MetaFunction = ({ data }) => {
  const title = pageTitle(data?.page.title);
  const description = data?.page.seo?.description ?? '';
  // Use the first in-body image (feature/landing pages) as the share image.
  const ogImage = data?.page.body.match(/<img[^>]+src="([^"]+)"/i)?.[1];

  return [
    { title },
    { name: 'description', content: description },
    { property: 'og:title', content: title },
    { property: 'og:description', content: description },
    ...(ogImage ? [{ property: 'og:image', content: ogImage }] : []),
  ];
};

export async function loader(args: Route.LoaderArgs) {
  // Start fetching non-critical data without blocking time to first byte
  const deferredData = loadDeferredData(args);

  // Await the critical data required to render initial state of the page
  const criticalData = await loadCriticalData(args);

  return { ...deferredData, ...criticalData };
}

/**
 * Load data necessary for rendering content above the fold. This is the critical data
 * needed to render the page. If it's unavailable, the whole page should 400 or 500 error.
 */
async function loadCriticalData({ context, request, params }: Route.LoaderArgs) {
  if (!params.handle) {
    throw new Error('Missing page handle');
  }

  const [{ page }] = await Promise.all([
    context.storefront.query(PAGE_QUERY, {
      variables: {
        handle: params.handle,
      },
    }),
    // Add other queries here, so that they are loaded in parallel
  ]);

  if (!page) {
    throw new Response('Not Found', { status: 404 });
  }

  redirectIfHandleIsLocalized(request, { handle: params.handle, data: page });

  return {
    page,
  };
}

/**
 * Load data for rendering content below the fold. This data is deferred and will be
 * fetched after the initial page load. If it's unavailable, the page should still 200.
 * Make sure to not throw any errors here, as it will cause the page to 500.
 */
function loadDeferredData({ context }: Route.LoaderArgs) {
  return {};
}

const Page = () => {
  const { page } = useLoaderData<typeof loader>();

  return (
    <Container className="max-w-[60rem] py-12 md:py-16">
      <Heading as="h1" size="display">
        {page.title}
      </Heading>
      <div
        className="mt-6 [&_a]:text-brand [&_a]:underline [&_h2]:mt-8 [&_h2]:text-lg [&_h2]:font-bold [&_h2]:tracking-wide [&_h2]:uppercase [&_h3]:mt-6 [&_h3]:text-sm [&_h3]:font-semibold [&_h3]:tracking-[0.1em] [&_h3]:text-neutral-900 [&_h3]:uppercase [&_img]:mt-4 [&_img]:w-full [&_li]:mt-1 [&_li]:text-sm [&_li]:leading-6 [&_li]:text-neutral-600 [&_p]:mt-4 [&_p]:text-sm [&_p]:leading-7 [&_p]:text-neutral-600 [&_strong]:font-semibold [&_strong]:text-neutral-900 [&_ul]:mt-4 [&_ul]:list-disc [&_ul]:pl-5"
        dangerouslySetInnerHTML={{ __html: page.body }}
      />
    </Container>
  );
};

const PAGE_QUERY = `#graphql
  query Page(
    $language: LanguageCode,
    $country: CountryCode,
    $handle: String!
  )
  @inContext(language: $language, country: $country) {
    page(handle: $handle) {
      handle
      id
      title
      body
      seo {
        description
        title
      }
    }
  }
` as const;

export default Page;
