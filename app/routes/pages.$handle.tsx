import { useLoaderData } from 'react-router';

import { Container } from '~/components/common/Container';
import { Heading } from '~/components/common/Heading';
import { Prose } from '~/components/common/Prose';
import { notFound } from '~/lib/http';
import { redirectIfHandleIsLocalized } from '~/lib/redirect';
import { buildMeta } from '~/lib/seo';

import type { Route } from './+types/pages.$handle';

export const meta: Route.MetaFunction = ({ data }) => {
  // Use the first in-body image (feature/landing pages) as the share image.
  const ogImage = data?.page.body.match(/<img[^>]+src="([^"]+)"/i)?.[1];

  return buildMeta({
    title: data?.page.title,
    description: data?.page.seo?.description,
    image: ogImage,
  });
};

export async function loader({ context, request, params }: Route.LoaderArgs) {
  if (!params.handle) {
    throw notFound('Page not found');
  }

  const { page } = await context.storefront.query(PAGE_QUERY, {
    variables: {
      handle: params.handle,
    },
    cache: context.storefront.CacheLong(),
  });

  if (!page) {
    throw notFound('Page not found');
  }

  redirectIfHandleIsLocalized(request, { handle: params.handle, data: page });

  return {
    page,
  };
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
