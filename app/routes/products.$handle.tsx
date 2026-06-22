import {
  Analytics,
  getAdjacentAndFirstAvailableVariants,
  getProductOptions,
  getSelectedProductOptions,
  Image,
  useOptimisticVariant,
  useSelectedOptionInUrlParam,
} from '@shopify/hydrogen';
import { redirect, useLoaderData } from 'react-router';

import { Container } from '~/components/common/Container';
import { BottomPhotography } from '~/components/product/BottomPhotography';
import { ProductForm } from '~/components/product/ProductForm';
import { ProductPrice } from '~/components/product/ProductPrice';
import { RelatedProducts } from '~/components/product/RelatedProducts';
import { PRODUCT_CARD_FRAGMENT } from '~/lib/fragments';
import { redirectIfHandleIsLocalized } from '~/lib/redirect';
import { pageTitle } from '~/lib/seo';
import { ColorSwatches, FeatureCarousel, TechStack } from '~/modules/product';

import type { Route } from './+types/products.$handle';

export const meta: Route.MetaFunction = ({ data }) => {
  return [
    { title: pageTitle(data?.product.title) },
    {
      rel: 'canonical',
      href: `/products/${data?.product.handle}`,
    },
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
async function loadCriticalData({ context, params, request }: Route.LoaderArgs) {
  const { handle } = params;
  const { storefront } = context;

  if (!handle) {
    throw new Error('Expected product handle to be defined');
  }

  const [{ product }] = await Promise.all([
    storefront.query(PRODUCT_QUERY, {
      variables: { handle, selectedOptions: getSelectedProductOptions(request) },
    }),
    // Add other queries here, so that they are loaded in parallel
  ]);

  if (!product?.id) {
    throw new Response(null, { status: 404 });
  }

  // The API handle might be localized, so redirect to the localized handle
  redirectIfHandleIsLocalized(request, { handle, data: product });

  return {
    product,
  };
}

/**
 * Load data for rendering content below the fold. This data is deferred and will be
 * fetched after the initial page load. If it's unavailable, the page should still 200.
 * Make sure to not throw any errors here, as it will cause the page to 500.
 */
function loadDeferredData({ context }: Route.LoaderArgs) {
  // Related products (below the fold) — deferred and guarded so a failure can't
  // 500 the page. Config-driven from the summer-25 collection for now.
  const relatedProducts = context.storefront
    .query(RELATED_PRODUCTS_QUERY, {
      cache: context.storefront.CacheLong(),
    })
    .catch((error: Error) => {
      console.error(error);
      return null;
    });

  return { relatedProducts };
}

const Product = () => {
  const { product, relatedProducts } = useLoaderData<typeof loader>();

  // Optimistically selects a variant with given available variant information
  const selectedVariant = useOptimisticVariant(
    product.selectedOrFirstAvailableVariant,
    getAdjacentAndFirstAvailableVariants(product)
  );

  // Sets the search param to the selected variant without navigation
  // only when no search params are set in the url
  useSelectedOptionInUrlParam(selectedVariant.selectedOptions);

  // Get the product options array
  const productOptions = getProductOptions({
    ...product,
    selectedOrFirstAvailableVariant: selectedVariant,
  });

  const { title, description } = product;

  return (
    <>
      <section className="relative flex min-h-[85vh] items-center overflow-hidden bg-neutral-900 text-white">
        {selectedVariant?.image && (
          <Image
            data={selectedVariant.image}
            sizes="100vw"
            className="absolute inset-0 size-full object-cover"
          />
        )}
        <div className="absolute inset-0 bg-linear-to-r from-black/80 via-black/40 to-transparent" />
        <Container className="relative z-10">
          <div className="max-w-md bg-black/70 p-8 backdrop-blur-sm md:p-10">
            <h1 className="text-2xl font-bold tracking-wide uppercase md:text-3xl">{title}</h1>
            <div className="mt-3 text-lg">
              <ProductPrice
                price={selectedVariant?.price}
                compareAtPrice={selectedVariant?.compareAtPrice}
              />
            </div>
            {description && (
              <p className="mt-4 line-clamp-8 text-sm leading-relaxed text-white/75">
                {description}
              </p>
            )}
            <div className="mt-6">
              <p className="mb-2 text-xs font-semibold tracking-[0.15em] text-white/70 uppercase">
                Color
              </p>
              <ColorSwatches handle={product.handle} size="lg" tone="light" />
            </div>
            <div className="mt-6">
              <ProductForm productOptions={productOptions} selectedVariant={selectedVariant} />
            </div>
          </div>
        </Container>
      </section>

      <FeatureCarousel handle={product.handle} />
      <TechStack handle={product.handle} />
      <BottomPhotography />
      <RelatedProducts products={relatedProducts} currentHandle={product.handle} />

      <Analytics.ProductView
        data={{
          products: [
            {
              id: product.id,
              title: product.title,
              price: selectedVariant?.price.amount || '0',
              vendor: product.vendor,
              variantId: selectedVariant?.id || '',
              variantTitle: selectedVariant?.title || '',
              quantity: 1,
            },
          ],
        }}
      />
    </>
  );
};

const PRODUCT_VARIANT_FRAGMENT = `#graphql
  fragment ProductVariant on ProductVariant {
    availableForSale
    compareAtPrice {
      amount
      currencyCode
    }
    id
    image {
      __typename
      id
      url
      altText
      width
      height
    }
    price {
      amount
      currencyCode
    }
    product {
      title
      handle
    }
    selectedOptions {
      name
      value
    }
    sku
    title
    unitPrice {
      amount
      currencyCode
    }
  }
` as const;

const PRODUCT_FRAGMENT = `#graphql
  fragment Product on Product {
    id
    title
    vendor
    handle
    descriptionHtml
    description
    encodedVariantExistence
    encodedVariantAvailability
    options {
      name
      optionValues {
        name
        firstSelectableVariant {
          ...ProductVariant
        }
        swatch {
          color
          image {
            previewImage {
              url
            }
          }
        }
      }
    }
    selectedOrFirstAvailableVariant(selectedOptions: $selectedOptions, ignoreUnknownOptions: true, caseInsensitiveMatch: true) {
      ...ProductVariant
    }
    adjacentVariants (selectedOptions: $selectedOptions) {
      ...ProductVariant
    }
    seo {
      description
      title
    }
  }
  ${PRODUCT_VARIANT_FRAGMENT}
` as const;

const RELATED_PRODUCTS_QUERY = `#graphql
  ${PRODUCT_CARD_FRAGMENT}
  query RelatedProducts($country: CountryCode, $language: LanguageCode)
    @inContext(country: $country, language: $language) {
    products(first: 10, sortKey: BEST_SELLING) {
      nodes {
        ...ProductCard
      }
    }
  }
` as const;

const PRODUCT_QUERY = `#graphql
  query Product(
    $country: CountryCode
    $handle: String!
    $language: LanguageCode
    $selectedOptions: [SelectedOptionInput!]!
  ) @inContext(country: $country, language: $language) {
    product(handle: $handle) {
      ...Product
    }
  }
  ${PRODUCT_FRAGMENT}
` as const;

export default Product;
