import { Analytics, getPaginationVariables } from '@shopify/hydrogen';
import { redirect, useLoaderData } from 'react-router';

import { ProductCard } from '~/components/collection/ProductCard';
import { Heading } from '~/components/common/Heading';
import { PaginatedResourceSection } from '~/components/common/PaginatedResourceSection';
import { BaselineMasthead } from '~/components/content/BaselineMasthead';
import { STORE_LINKS } from '~/content/links';
import { PRODUCT_CARD_FRAGMENT } from '~/lib/fragments';
import { notFound } from '~/lib/http';
import { redirectIfHandleIsLocalized } from '~/lib/redirect';
import { buildMeta } from '~/lib/seo';

import type { Route } from './+types/collections.$handle';

/** The shop-all collection's handle, derived from its one source in links.ts.
    That collection opens on the drop page's BASELINE masthead instead of the
    generic title/description header, so both entry points to ED. 01 — the nav's
    Shop link and /drops/baseline — read the same above the fold. */
const SHOP_ALL_HANDLE = STORE_LINKS.shopAll.replace('/collections/', '');

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

  return { collection };
}

const Collection = () => {
  const { collection } = useLoaderData<typeof loader>();
  const isShopAll = collection.handle === SHOP_ALL_HANDLE;

  return (
    <div>
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
        <PaginatedResourceSection
          connection={collection.products}
          resourcesClassName="grid grid-cols-1 gap-5 lg:grid-cols-2"
        >
          {({ node: product }) => (
            <ProductCard key={product.id} product={product} label={product.label?.value} />
          )}
        </PaginatedResourceSection>

        <Analytics.CollectionView
          data={{ collection: { id: collection.id, handle: collection.handle } }}
        />
      </div>
    </div>
  );
};

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
