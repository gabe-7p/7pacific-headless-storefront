import { Image } from '@shopify/hydrogen';
import { Link, useLoaderData } from 'react-router';

import { Container } from '~/components/common/Container';
import { Heading } from '~/components/common/Heading';
import { pageTitle } from '~/lib/seo';

import type { Route } from './+types/collections._index';

export const meta: Route.MetaFunction = () => {
  return [{ title: pageTitle('Collections') }];
};

export async function loader({ context }: Route.LoaderArgs) {
  const { collections } = await context.storefront.query(STORE_COLLECTIONS_QUERY, {
    variables: { first: 24 },
    cache: context.storefront.CacheLong(),
  });
  return { collections: collections.nodes };
}

const CollectionsIndex = () => {
  const { collections } = useLoaderData<typeof loader>();
  return (
    <Container className="py-10 md:py-14">
      <header className="mb-8">
        <Heading as="h1" size="lg">
          Collections
        </Heading>
      </header>
      <div className="grid grid-cols-1 gap-x-4 gap-y-10 sm:grid-cols-2 md:grid-cols-3">
        {collections.map((collection) => {
          // Collections without their own image fall back to the first product's
          // image (matches the live Catalog page).
          const image = collection.image ?? collection.products.nodes[0]?.featuredImage;
          return (
            <Link
              key={collection.id}
              to={`/collections/${collection.handle}`}
              prefetch="intent"
              className="group flex flex-col"
              aria-label={collection.title}
            >
              <div className="aspect-[4/3] overflow-hidden bg-neutral-100">
                {image && (
                  <Image
                    data={image}
                    sizes="(min-width: 768px) 33vw, 100vw"
                    className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                )}
              </div>
              <Heading as="h2" size="sm" className="mt-3">
                {collection.title}
              </Heading>
            </Link>
          );
        })}
      </div>
    </Container>
  );
};

const STORE_COLLECTIONS_QUERY = `#graphql
  query StoreCollections($first: Int, $country: CountryCode, $language: LanguageCode)
    @inContext(country: $country, language: $language) {
    collections(first: $first, sortKey: TITLE) {
      nodes {
        id
        title
        handle
        image {
          id
          url
          altText
          width
          height
        }
        products(first: 1) {
          nodes {
            featuredImage {
              id
              url
              altText
              width
              height
            }
          }
        }
      }
    }
  }
` as const;

export default CollectionsIndex;
