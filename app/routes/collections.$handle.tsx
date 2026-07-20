import { Analytics, getPaginationVariables } from '@shopify/hydrogen';
import { redirect, useLoaderData } from 'react-router';

import { MarketingSections } from '~/components/collection/MarketingSections';
import { ProductCard } from '~/components/collection/ProductCard';
import { Heading } from '~/components/common/Heading';
import { PaginatedResourceSection } from '~/components/common/PaginatedResourceSection';
import { PRODUCT_CARD_FRAGMENT } from '~/lib/fragments';
import { notFound } from '~/lib/http';
import { parseMarketingSections } from '~/lib/metafields';
import { redirectIfHandleIsLocalized } from '~/lib/redirect';
import { buildMeta } from '~/lib/seo';

import type { Route } from './+types/collections.$handle';

export const meta: Route.MetaFunction = ({ loaderData }) => {
  return buildMeta({
    title: loaderData?.collection.title,
    description: loaderData?.collection.description,
  });
};

export async function loader({ context, params, request }: Route.LoaderArgs) {
  const { handle } = params;
  const { storefront } = context;
  const paginationVariables = getPaginationVariables(request, { pageBy: 24 });

  if (!handle) throw redirect('/');

  const { collection } = await storefront.query(COLLECTION_QUERY, {
    // Product listings change with availability/merchandising: short cache.
    cache: storefront.CacheShort(),
    // No sort or filter variables: the collection's own merchandised order is
    // the display order (drag to reorder in the Shopify admin).
    variables: {
      handle,
      ...paginationVariables,
    },
  });

  if (!collection) {
    throw notFound('Collection not found');
  }

  redirectIfHandleIsLocalized(request, { handle, data: collection });

  return {
    collection,
    marketingSections: parseMarketingSections(collection.marketingSections?.value),
  };
}

const Collection = () => {
  const { collection, marketingSections } = useLoaderData<typeof loader>();

  return (
    // Near full-bleed with ~20px outer margins so product imagery dominates the
    // viewport (matches live) — intentionally not wrapped in the max-width
    // Container the rest of the site uses.
    <div className="w-full px-5 py-10">
      <header className="mb-8">
        <Heading as="h1" size="lg">
          {collection.title}
        </Heading>
        {collection.description && (
          <p className="mt-2 max-w-2xl text-sm text-neutral-600">{collection.description}</p>
        )}
      </header>

      <PaginatedResourceSection
        connection={collection.products}
        resourcesClassName="grid grid-cols-1 gap-5 lg:grid-cols-2"
      >
        {({ node: product }) => (
          <ProductCard key={product.id} product={product} label={product.label?.value} />
        )}
      </PaginatedResourceSection>

      <MarketingSections sections={marketingSections} />

      <Analytics.CollectionView
        data={{ collection: { id: collection.id, handle: collection.handle } }}
      />
    </div>
  );
};

// NOTE: https://shopify.dev/docs/api/storefront/latest/objects/collection
const COLLECTION_QUERY = `#graphql
  ${PRODUCT_CARD_FRAGMENT}
  query Collection(
    $handle: String!
    $country: CountryCode
    $language: LanguageCode
    $first: Int
    $last: Int
    $startCursor: String
    $endCursor: String
  ) @inContext(country: $country, language: $language) {
    collection(handle: $handle) {
      id
      handle
      title
      description
      marketingSections: metafield(namespace: "custom", key: "marketing_sections") {
        value
      }
      products(first: $first, last: $last, before: $startCursor, after: $endCursor) {
        nodes {
          ...ProductCard
          label: metafield(namespace: "theme", key: "label") {
            value
          }
        }
        pageInfo {
          hasPreviousPage
          hasNextPage
          endCursor
          startCursor
        }
      }
    }
  }
` as const;

export default Collection;
