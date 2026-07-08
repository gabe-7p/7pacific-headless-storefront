import {
  Analytics,
  getAdjacentAndFirstAvailableVariants,
  getProductOptions,
  getSelectedProductOptions,
  Image,
  useOptimisticVariant,
  useSelectedOptionInUrlParam,
} from '@shopify/hydrogen';
import { Suspense } from 'react';
import { Await, redirect, useLoaderData } from 'react-router';

import { Container } from '~/components/common/Container';
import { AddToCartBar } from '~/components/product/AddToCartBar';
import { BrandBanner } from '~/components/product/BrandBanner';
import { ColorSwatches } from '~/components/product/ColorSwatches';
import { ProductDetails } from '~/components/product/ProductDetails';
import { ProductForm } from '~/components/product/ProductForm';
import { ProductPrice } from '~/components/product/ProductPrice';
import { Recommendations } from '~/components/product/Recommendations';
import { StickyAddToCart } from '~/components/product/StickyAddToCart';
import { TechStack } from '~/components/product/TechStack';
import { PRODUCT_CARD_FRAGMENT } from '~/lib/fragments';
import { parseJsonMetafield } from '~/lib/metafields';
import type { ProductDetailCard, TechStack as TechStackData } from '~/lib/productContent';
import { redirectIfHandleIsLocalized } from '~/lib/redirect';
import { pageTitle } from '~/lib/seo';

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
    productDetails: parseJsonMetafield<Array<ProductDetailCard>>(product.productDetails),
    techStack: parseJsonMetafield<TechStackData>(product.techStack),
  };
}

/**
 * Load data for rendering content below the fold. This data is deferred and will be
 * fetched after the initial page load. If it's unavailable, the page should still 200.
 * Make sure to not throw any errors here, as it will cause the page to 500.
 */
function loadDeferredData({ context, params }: Route.LoaderArgs) {
  const { handle } = params;

  // "PLANNING TO SWEAT MORE?" — read the curated recommended_products metafield
  // references. Deferred + guarded so a failure never 500s the PDP.
  const recommendations = context.storefront
    .query(RECOMMENDATIONS_QUERY, {
      variables: { handle: handle! },
      cache: context.storefront.CacheLong(),
    })
    .then(({ product }) => {
      const nodes = product?.recommended?.references?.nodes ?? [];
      // Exclude the product being viewed; cap at 3 like live.
      return nodes.filter((node) => node.handle !== handle).slice(0, 3);
    })
    .catch((error: Error) => {
      console.error(error);
      return null;
    });

  return { recommendations };
}

const Product = ({ loaderData }: { loaderData: Route.ComponentProps }) => {
  const { product, productDetails, techStack, recommendations } = useLoaderData<typeof loader>();

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

  const { title, descriptionHtml } = product;

  return (
    <>
      <section className="overflow-hidden bg-neutral-100 text-neutral-900 lg:relative lg:flex lg:h-[46rem] lg:items-center lg:text-white">
        {selectedVariant?.image && (
          <Image
            data={selectedVariant.image}
            sizes="100vw"
            className="aspect-[3/4] w-full object-contain object-bottom sm:aspect-[4/3] lg:absolute lg:inset-0 lg:size-full lg:object-[80%_bottom]"
          />
        )}
        <div className="hidden lg:absolute lg:inset-0 lg:block lg:bg-linear-to-r lg:from-black/20 lg:via-transparent lg:to-transparent" />
        <Container className="px-0 sm:px-0 md:px-0 lg:relative lg:z-10 lg:px-8">
          <div className="flex flex-col bg-white text-neutral-900 lg:max-w-md">
            <div className="p-8 md:p-10">
              <h1 className="text-2xl font-bold tracking-wide uppercase md:text-3xl">{title}</h1>
              <div className="mt-3 text-lg">
                <ProductPrice
                  price={selectedVariant?.price}
                  compareAtPrice={selectedVariant?.compareAtPrice}
                />
              </div>
              {descriptionHtml && (
                <div
                  className="mt-4 text-sm leading-7 text-neutral-600 [&_p]:mb-4 [&_p:last-child]:mb-0"
                  dangerouslySetInnerHTML={{ __html: descriptionHtml }}
                />
              )}
              <div className="mt-6">
                <p className="mb-2 text-xs font-semibold tracking-[0.15em] text-neutral-500 uppercase">
                  Color
                </p>
                <ColorSwatches handle={product.handle} size="lg" alwaysRender />
              </div>
              <div className="mt-6">
                <ProductForm productOptions={productOptions} />
              </div>
              {product.fitNote?.value && (
                <p className="mt-4 text-sm text-neutral-500 italic">{product.fitNote.value}</p>
              )}
            </div>
            <AddToCartBar selectedVariant={selectedVariant} />
          </div>
        </Container>
      </section>
      <StickyAddToCart selectedVariant={selectedVariant} />
      {productDetails && productDetails.length > 0 && <ProductDetails cards={productDetails} />}
      {techStack && <TechStack data={techStack} />}
      <BrandBanner />
      <Suspense fallback={null}>
        <Await resolve={recommendations}>
          {(products) =>
            products && products.length > 0 ? <Recommendations products={products} /> : null
          }
        </Await>
      </Suspense>
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
    fitNote: metafield(namespace: "custom", key: "fit_note") {
      value
    }
    productDetails: metafield(namespace: "custom", key: "product_details") {
      value
    }
    techStack: metafield(namespace: "custom", key: "tech_stack") {
      value
    }
  }
  ${PRODUCT_VARIANT_FRAGMENT}
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

const RECOMMENDATIONS_QUERY = `#graphql
  ${PRODUCT_CARD_FRAGMENT}
  query ProductRecommendations($handle: String!, $country: CountryCode, $language: LanguageCode)
    @inContext(country: $country, language: $language) {
    product(handle: $handle) {
      recommended: metafield(namespace: "custom", key: "recommended_products") {
        references(first: 10) {
          nodes {
            ... on Product {
              ...ProductCard
            }
          }
        }
      }
    }
  }
` as const;

export default Product;
