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
import { Eyebrow } from '~/components/common/Eyebrow';
import { Heading } from '~/components/common/Heading';
import { Prose } from '~/components/common/Prose';
import { AddToCartBar } from '~/components/product/AddToCartBar';
import { BrandBanner } from '~/components/product/BrandBanner';
import { ColorSwatches } from '~/components/product/ColorSwatches';
import { ProductDetails } from '~/components/product/ProductDetails';
import { ProductForm } from '~/components/product/ProductForm';
import { ProductPrice } from '~/components/product/ProductPrice';
import { Recommendations } from '~/components/product/Recommendations';
import { StickyAddToCart } from '~/components/product/StickyAddToCart';
import { TechStack } from '~/components/product/TechStack';
import { getColorSwatches } from '~/lib/colors';
import { PRODUCT_CARD_FRAGMENT } from '~/lib/fragments';
import { notFound } from '~/lib/http';
import { getMetafieldImage, parseJsonMetafield } from '~/lib/metafields';
import type { ProductDetailCard, TechStack as TechStackData } from '~/lib/productContent';
import { redirectIfHandleIsLocalized } from '~/lib/redirect';
import { buildMeta } from '~/lib/seo';

import type { Route } from './+types/products.$handle';

export const meta: Route.MetaFunction = ({ data }) => {
  return [
    ...buildMeta({ title: data?.product.title, description: data?.product.description }),
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
    throw notFound('Product not found');
  }

  const [{ product }] = await Promise.all([
    storefront.query(PRODUCT_QUERY, {
      variables: { handle, selectedOptions: getSelectedProductOptions(request) },
      // Price/availability-sensitive: keep the cache window short.
      cache: storefront.CacheShort(),
    }),
    // Add other queries here, so that they are loaded in parallel
  ]);

  if (!product?.id) {
    throw notFound('Product not found');
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

  // No handle → the critical loader is about to 404; skip the deferred fetch.
  if (!handle) return { recommendations: Promise.resolve(null) };

  // "PLANNING TO SWEAT MORE?" — read the curated recommended_products metafield
  // references. Deferred + guarded so a failure never 500s the PDP.
  const recommendations = context.storefront
    .query(RECOMMENDATIONS_QUERY, {
      variables: { handle },
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

  // Dedicated per-product hero images (the theme's Background Image / …Mobile),
  // falling back to the variant image when a product has none.
  const heroDesktop = getMetafieldImage(product.heroImage) ?? selectedVariant?.image;
  const heroMobile = getMetafieldImage(product.heroImageMobile) ?? selectedVariant?.image;

  return (
    <>
      {/* The floating-card layout holds down to 769px (live's Impulse
          breakpoint), not Tailwind's `lg`; below that the hero stacks. `min-h`
          (not a fixed height) so a tall buy card grows the hero instead of
          overflowing it under the header and past the fold; the vertical
          padding keeps the card inset like live's. */}
      <section className="overflow-hidden bg-neutral-100 text-neutral-900 min-[769px]:relative min-[769px]:flex min-[769px]:min-h-[46rem] min-[769px]:items-center min-[769px]:py-10 min-[769px]:text-white">
        {/* Mobile: in-flow hero shot. Desktop: full-bleed cover hero behind the
            buy card — two images because live uses a distinct desktop vs mobile
            source (matches its .desktop-image / .mobile-image divs). */}
        {heroMobile && (
          <Image
            data={heroMobile}
            sizes="100vw"
            className="aspect-[3/4] w-full object-contain object-bottom sm:aspect-[4/3] min-[769px]:hidden"
          />
        )}
        {heroDesktop && (
          <Image
            data={heroDesktop}
            sizes="100vw"
            className="hidden object-cover min-[769px]:absolute min-[769px]:inset-0 min-[769px]:block min-[769px]:size-full min-[769px]:object-[80%_bottom]"
          />
        )}
        <div className="hidden min-[769px]:absolute min-[769px]:inset-0 min-[769px]:block min-[769px]:bg-linear-to-r min-[769px]:from-black/20 min-[769px]:via-transparent min-[769px]:to-transparent" />
        {/* The card carries its own left inset rather than the Container taking
            horizontal padding: Tailwind emits `md:` after `min-[769px]:`, so a
            `md:px-0` reset would win over `min-[769px]:px-8` at 769+. */}
        <Container className="px-0 sm:px-0 md:px-0 min-[769px]:relative min-[769px]:z-10">
          {/* Live's card is 500px wide with 20px padding (460px of content) —
              the measure the description was authored against. */}
          <div className="flex flex-col bg-white text-neutral-900 min-[769px]:ml-8 min-[769px]:max-w-[500px]">
            <div className="p-5">
              {/* Product-name tier: 24px, 32px from md, +0.04em, lh 1.15
                  (face/weight from the Heading brand variant). */}
              <Heading
                as="h1"
                size="none"
                className="text-2xl leading-[1.15] tracking-product md:text-[2rem] md:leading-[1.15]"
              >
                {title}
              </Heading>
              <div className="mt-3 text-lg">
                <ProductPrice
                  price={selectedVariant?.price}
                  compareAtPrice={selectedVariant?.compareAtPrice}
                />
              </div>
              {descriptionHtml && (
                <Prose html={descriptionHtml} variant="description" className="mt-4" />
              )}
              <div className="mt-6">
                <Eyebrow className="mb-2 text-neutral-500">Color</Eyebrow>
                <ColorSwatches
                  swatches={getColorSwatches(product.colorSiblings)}
                  currentHandle={product.handle}
                  size="lg"
                  alwaysRender
                />
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
    colorSiblings: metafield(namespace: "custom", key: "color_siblings") {
      references(first: 10) {
        nodes {
          ... on Product {
            handle
            colorName: metafield(namespace: "custom", key: "color_name") {
              value
            }
            colorHex: metafield(namespace: "custom", key: "color_hex") {
              value
            }
          }
        }
      }
    }
    productDetails: metafield(namespace: "custom", key: "product_details") {
      value
    }
    techStack: metafield(namespace: "custom", key: "tech_stack") {
      value
    }
    # Dedicated PDP hero images (the theme's "Background Image" / "…Mobile"),
    # per product. Falls back to the variant image when unset.
    heroImage: metafield(namespace: "custom", key: "hero_image") {
      reference {
        ... on MediaImage {
          image {
            id
            url
            altText
            width
            height
          }
        }
      }
    }
    heroImageMobile: metafield(namespace: "custom", key: "hero_image_mobile") {
      reference {
        ... on MediaImage {
          image {
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
