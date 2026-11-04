import { Cache, gql } from '@shopify/hydrogen';
import { useLoaderData } from 'react-router';

import { Container } from '~/components/common/Container';
import { Heading } from '~/components/common/Heading';
import { Prose } from '~/components/common/Prose';
import { notFound } from '~/lib/http';
import { buildMeta } from '~/lib/seo';
import { queryStorefrontOrThrow, storefrontClientContext } from '~/lib/storefront';

import type { Route } from './+types/pages.$handle';

export const meta: Route.MetaFunction = ({ loaderData }) => {
  // Use the first in-body image (feature/landing pages) as the share image.
  const ogImage = loaderData?.page.body.match(/<img[^>]+src="([^"]+)"/i)?.[1];

  return buildMeta({
    title: loaderData?.page.title,
    description: loaderData?.page.seo?.description,
    image: ogImage,
  });
};

export async function loader({ context, params }: Route.LoaderArgs) {
  if (!params.handle) {
    throw notFound('Page not found');
  }

  const page = await queryStorefrontOrThrow(
    context.get(storefrontClientContext),
    PAGE_QUERY,
    { variables: { handle: params.handle }, cache: Cache.long() },
    (data) => data.page,
    'Page not found'
  );

  return { page };
}

const Page = () => {
  const { page } = useLoaderData<typeof loader>();

  return (
    <Container className="max-w-[60rem] py-12 md:py-16">
      <Heading as="h1" size="display">
        {page.title}
      </Heading>
      <Prose html={page.body} className="mt-6" />
    </Container>
  );
};

const PAGE_QUERY = gql(`
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
`);

export default Page;
