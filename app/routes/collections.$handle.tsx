import { Cache, gql } from '@shopify/hydrogen';
import { useLoaderData } from 'react-router';

import { CollectionViewedTracker } from '~/components/analytics/Trackers';
import { LoadMore, useLoadMore } from '~/components/collection/LoadMore';
import { ProductCard } from '~/components/collection/ProductCard';
import { Heading } from '~/components/common/Heading';
import { MediaSlot } from '~/components/common/MediaSlot';
import { DropMasthead, type DropMastheadContent } from '~/components/content/DropMasthead';
import { BASELINE_DROP } from '~/content/baseline-drop';
import { COLLECTION_BANNERS } from '~/content/collection-banners';
import { FIRST_LIGHT_MASTHEAD } from '~/content/first-light';
import { HANDLES } from '~/content/links';
import { PRODUCT_CARD_FRAGMENT } from '~/lib/fragments';
import { notFound } from '~/lib/http';
import { IMAGE_SIZES } from '~/lib/imageSizes';
import { buildMeta } from '~/lib/seo';
import { queryStorefrontOrThrow, storefrontClientContext } from '~/lib/storefront';
import { collectionUrl } from '~/lib/urls';

import type { Route } from './+types/collections.$handle';

const PAGE_SIZE = 24;

export const meta: Route.MetaFunction = ({ loaderData }) => {
  return buildMeta({
    title: loaderData?.collection.title,
    description: loaderData?.collection.description,
  });
};

export async function loader({ context, params, url }: Route.LoaderArgs) {
  const { handle } = params;
  if (!handle) throw notFound('Collection not found');

  const collection = await queryStorefrontOrThrow(
    context.get(storefrontClientContext),
    COLLECTION_QUERY,
    {
      // No sort or filter variables: the collection's own merchandised order is
      // the display order (drag to reorder in the Shopify admin).
      variables: { handle, first: PAGE_SIZE, after: url.searchParams.get('after') || undefined },
      // Product listings change with availability/merchandising: short cache.
      cache: Cache.short(),
    },
    (data) => data.collection,
    'Collection not found'
  );

  const { products, ...rest } = collection;
  return {
    collection: rest,
    products: products.nodes,
    pageInfo: products.pageInfo,
    // Everything but the cursor: a change here resets the accumulated grid.
    dataSearch: handle,
  };
}

/** Drop collections open on their drop's masthead instead of the plain title. */
const DROP_MASTHEADS: Partial<Record<string, DropMastheadContent>> = {
  [HANDLES.shopAllCollection]: BASELINE_DROP,
  [HANDLES.firstLightCollection]: FIRST_LIGHT_MASTHEAD,
};

const Collection = () => {
  const loaderData = useLoaderData<typeof loader>();
  const { collection } = loaderData;
  const { nodes, pageInfo, isLoading, loadMore } = useLoadMore(loaderData);
  const masthead = DROP_MASTHEADS[collection.handle];
  const banner = COLLECTION_BANNERS[collection.handle];

  return (
    <div>
      <CollectionViewedTracker id={collection.id} handle={collection.handle} />
      {banner && (
        // Pulled up under the sticky header, which stays transparent over it
        // until the page scrolls (`layout/Header`).
        <MediaSlot
          media={banner}
          ratio="banner"
          sizes={IMAGE_SIZES.full}
          loading="eager"
          className="-mt-(--header-h)"
        />
      )}
      {masthead ? (
        <DropMasthead drop={masthead} withDropLink />
      ) : (
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
          max-width Container the rest of the site uses. One card per row on
          mobile; three from `md` with a 4px gutter between columns. The row
          gap stays wider because each card's name and spec strip sit under
          its image. */}
      <div className="w-full px-5 pb-10">
        <div className="grid grid-cols-1 gap-5 md:grid-cols-3 md:gap-x-1 md:gap-y-6">
          {nodes.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              label={product.label?.value}
              sizes={IMAGE_SIZES.third}
            />
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
