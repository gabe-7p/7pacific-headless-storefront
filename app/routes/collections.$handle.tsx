import { Cache, gql } from '@shopify/hydrogen';
import { redirect, useLoaderData } from 'react-router';

import { CollectionViewedTracker } from '~/components/analytics/Trackers';
import { LoadMore, useLoadMore } from '~/components/collection/LoadMore';
import { ProductCard } from '~/components/collection/ProductCard';
import { Heading } from '~/components/common/Heading';
import { BaselineMasthead } from '~/components/content/BaselineMasthead';
import { HANDLES } from '~/content/links';
import { PRODUCT_CARD_FRAGMENT } from '~/lib/fragments';
import { notFound } from '~/lib/http';
import { buildMeta } from '~/lib/seo';
import { storefrontClientContext } from '~/lib/storefront';
import { collectionUrl } from '~/lib/urls';

import type { Route } from './+types/collections.$handle';

/** The shop-all collection opens on the drop page's BASELINE masthead instead
    of the generic title/description header, so both entry points to ED. 01 —
    the nav's Shop link and /drops/baseline — read the same above the fold. */
const SHOP_ALL_HANDLE = HANDLES.shopAllCollection;

const PAGE_SIZE = 24;

export const meta: Route.MetaFunction = ({ loaderData }) => {
  return buildMeta({
    title: loaderData?.collection.title,
    description: loaderData?.collection.description,
  });
};

export async function loader({ context, params, url }: Route.LoaderArgs) {
  const { handle } = params;
  if (!handle) throw redirect('/');

  const { data, errors } = await context.get(storefrontClientContext).graphql(COLLECTION_QUERY, {
    // No sort or filter variables: the collection's own merchandised order is
    // the display order (drag to reorder in the Shopify admin).
    variables: { handle, first: PAGE_SIZE, after: url.searchParams.get('after') || undefined },
    // Product listings change with availability/merchandising: short cache.
    cache: Cache.short(),
  });
  if (errors) console.error(errors);
  const collection = data?.collection;
  if (!collection) throw notFound('Collection not found');

  const { products, ...rest } = collection;
  return {
    collection: rest,
    products: products.nodes,
    pageInfo: products.pageInfo,
    // Everything but the cursor: a change here resets the accumulated grid.
    dataSearch: handle,
  };
}

const Collection = () => {
  const loaderData = useLoaderData<typeof loader>();
  const { collection } = loaderData;
  const { nodes, pageInfo, isLoading, loadMore } = useLoadMore(loaderData);
  const isShopAll = collection.handle === SHOP_ALL_HANDLE;

  return (
    <div>
      <CollectionViewedTracker id={collection.id} handle={collection.handle} />
      {isShopAll ? (
        <BaselineMasthead withDropLink />
      ) : (
        // The generic collection header; the shop-all page gets the masthead
        // above instead, which carries its own h1 and intro copy.
        <header className="w-full px-5 pt-10 pb-8">
          <Heading as="h1" size="lg">
            {collection.title}
          </Heading>
          {collection.description && (
            <p className="mt-2 max-w-2xl text-sm text-support">{collection.description}</p>
          )}
        </header>
      )}

      {/* Near full-bleed with ~20px outer margins so product imagery dominates
          the viewport (matches live) — intentionally not wrapped in the
          max-width Container the rest of the site uses. */}
      <div className="w-full px-5 pb-10">
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
          {nodes.map((product) => (
            <ProductCard key={product.id} product={product} label={product.label?.value} />
          ))}
        </div>
        <LoadMore
          pathname={collectionUrl(collection.handle)}
          pageInfo={pageInfo}
          isLoading={isLoading}
          onLoad={loadMore}
        />
      </div>
    </div>
  );
};

const COLLECTION_QUERY = gql(
  `
    query Collection(
      $handle: String!
      $first: Int!
      $after: String
      $country: CountryCode
      $language: LanguageCode
    ) @inContext(country: $country, language: $language) {
      collection(handle: $handle) {
        id
        handle
        title
        description
        products(first: $first, after: $after) {
          nodes {
            ...ProductCard
            label: metafield(namespace: "theme", key: "label") {
              value
            }
          }
          pageInfo {
            hasNextPage
            endCursor
          }
        }
      }
    }
  `,
  [PRODUCT_CARD_FRAGMENT]
);

export default Collection;
