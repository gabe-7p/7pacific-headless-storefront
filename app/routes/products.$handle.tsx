import { Cache, getSelectedProductOptions } from '@shopify/hydrogen';
import { Suspense } from 'react';
import { Await, useLoaderData, useLocation, useNavigate } from 'react-router';

import { ProductViewedTracker } from '~/components/analytics/Trackers';
import { Container } from '~/components/common/Container';
import { Eyebrow } from '~/components/common/Eyebrow';
import { Heading } from '~/components/common/Heading';
import { Image } from '~/components/common/Image';
import { Prose } from '~/components/common/Prose';
import { AddToCartBar } from '~/components/product/AddToCartBar';
import { BrandBanner } from '~/components/product/BrandBanner';
import { ColorSwatches } from '~/components/product/ColorSwatches';
import { EditionTag } from '~/components/product/EditionTag';
import { ProductDetails } from '~/components/product/ProductDetails';
import { ProductForm } from '~/components/product/ProductForm';
import { ProductPrice } from '~/components/product/ProductPrice';
import { Recommendations } from '~/components/product/Recommendations';
import { SpecCard } from '~/components/product/SpecCard';
import { StickyAddToCart } from '~/components/product/StickyAddToCart';
import { TechStack } from '~/components/product/TechStack';
import { deferQuery, notFound } from '~/lib/http';
import { IMAGE_SIZES } from '~/lib/imageSizes';
import { getMetafieldImage, parseJsonMetafield } from '~/lib/metafields';
import { getColorSwatches } from '~/lib/product/colors';
import type { ProductDetailCard, SpecCardData, TechStackData } from '~/lib/product/content';
import { PRODUCT_QUERY, RECOMMENDATIONS_QUERY } from '~/lib/product/queries';
import { ProductProvider, resolveSelectedVariant, useProductForm } from '~/lib/product/store';
import { buildMeta } from '~/lib/seo';
import { queryStorefront, queryStorefrontOrThrow, storefrontClientContext } from '~/lib/storefront';
import { productUrl } from '~/lib/urls';

import type { Route } from './+types/products.$handle';

export const meta: Route.MetaFunction = ({ loaderData }) => {
  return [
    ...buildMeta({
      title: loaderData?.product.title,
      description: loaderData?.product.description,
      canonical: loaderData ? productUrl(loaderData.product.handle) : undefined,
    }),
  ];
};

export async function loader({ context, params, url }: Route.LoaderArgs) {
  const { handle } = params;
  if (!handle) throw notFound('Product not found');

  const storefront = context.get(storefrontClientContext);

  // Below the fold: "PLANNING TO SWEAT MORE?" (custom.recommended_products), deferred.
  const recommendations = deferQuery(
    queryStorefront(storefront, RECOMMENDATIONS_QUERY, {
      variables: { handle },
      cache: Cache.long(),
    }).then((data) => {
      const nodes = data?.product?.recommended?.references?.nodes ?? [];
      return (
        nodes
          // The metafield can reference other types; only products render.
          .flatMap((node) => ('handle' in node ? [node] : []))
          // Exclude the product being viewed; cap at 3 like live.
          .filter((node) => node.handle !== handle)
          .slice(0, 3)
      );
    })
  );

  // Above the fold — a failure here errors the whole page.
  const product = await queryStorefrontOrThrow(
    storefront,
    PRODUCT_QUERY,
    {
      variables: {
        handle,
        // The ?Size=… params pick the variant; unknown params are ignored.
        selectedOptions: getSelectedProductOptions({
          searchParams: url.searchParams,
        }),
      },
      // Price/availability-sensitive: keep the cache window short.
      cache: Cache.short(),
    },
    (data) => data.product,
    'Product not found'
  );

  return {
    product,
    recommendations,
    productDetails: parseJsonMetafield<Array<ProductDetailCard>>(product.productDetails),
    techStack: parseJsonMetafield<TechStackData>(product.techStack),
    specCard: parseJsonMetafield<SpecCardData>(product.specCard),
  };
}

const Product = () => {
  const { product } = useLoaderData<typeof loader>();
  const navigate = useNavigate();
  const location = useLocation();

  return (
    // The product-form store resolves size clicks client-side; `onSelect`
    // keeps the URL in sync (replace, no scroll reset) and skips the loader
    // when the selection resolved to a variant the page already has.
    <ProductProvider
      product={product}
      onSelect={(result) => {
        const target = productUrl(
          result.selectedVariant?.product?.handle ?? product.handle,
          result.selectedOptions
        );
        const current = `${location.pathname}${location.search}`;
        if (target === current) return;
        void navigate(target, {
          replace: true,
          preventScrollReset: true,
          ...(result.status === 'resolved' ? { defaultShouldRevalidate: false } : {}),
        });
      }}
    >
      <ProductPage />
    </ProductProvider>
  );
};

const ProductPage = () => {
  const { product, productDetails, techStack, specCard, recommendations } =
    useLoaderData<typeof loader>();
  const { selectedVariant: formVariant } = useProductForm();
  const selectedVariant = resolveSelectedVariant(formVariant, product);

  const { title, descriptionHtml } = product;

  // Dedicated per-product hero images (the theme's Background Image / …Mobile),
  // falling back to the variant image when a product has none.
  const heroDesktop = getMetafieldImage(product.heroImage) ?? selectedVariant?.image;
  const heroMobile = getMetafieldImage(product.heroImageMobile) ?? selectedVariant?.image;

  return (
    <>
      <ProductViewedTracker
        product={{ id: product.id, title: product.title, vendor: product.vendor }}
        variant={selectedVariant ?? null}
      />
      {/* `min-h` (not a fixed height) so a tall buy card grows the hero instead
          of overflowing it under the header and past the fold. */}
      <section className="overflow-hidden bg-field text-ink min-[769px]:relative min-[769px]:flex min-[769px]:min-h-[50rem] min-[769px]:items-center min-[769px]:py-10 min-[769px]:text-ink-night">
        {/* Mobile: in-flow hero shot. Desktop: full-bleed cover hero behind the
            buy card — two images because live uses a distinct desktop vs mobile
            source (matches its .desktop-image / .mobile-image divs). */}
        {/* Mobile: 75% wide, 400px tall, cover-center (measured on live). Width
            goes through the `width` prop — `Image`'s inline width beats any
            width utility. */}
        {heroMobile && (
          <Image
            data={heroMobile}
            width="75%"
            sizes="75vw"
            className="mx-auto h-[400px] object-cover min-[769px]:hidden"
          />
        )}
        {/* Desktop matches live's background-position: center — an off-center
            anchor cropped the top of the shot out of the frame. */}
        {heroDesktop && (
          <Image
            data={heroDesktop}
            sizes={IMAGE_SIZES.full}
            className="hidden object-cover object-center min-[769px]:absolute min-[769px]:inset-0 min-[769px]:block min-[769px]:size-full"
          />
        )}
        <div className="hidden min-[769px]:absolute min-[769px]:inset-0 min-[769px]:block min-[769px]:bg-linear-to-r min-[769px]:from-black/20 min-[769px]:via-transparent min-[769px]:to-transparent" />
        {/* The card carries its own left inset rather than the Container taking
            horizontal padding: Tailwind emits `md:` after `min-[769px]:`, so a
            `md:px-0` reset would win over `min-[769px]:px-8` at 769+. */}
        <Container className="px-0 sm:px-0 md:px-0 min-[769px]:relative min-[769px]:z-10">
          {/* Live's card is 500px wide with 20px padding (460px of content) —
              the measure the description was authored against. */}
          <div className="flex flex-col bg-field text-ink min-[769px]:ml-8 min-[769px]:max-w-[500px]">
            <div className="p-5">
              {/* Edition device above the name (7PA-246). */}
              <EditionTag
                number={product.editionNumber?.value}
                status={product.editionStatus?.value}
                className="mb-2 block"
              />
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
              {/* Locked PDP order (7PA-231): description → Spec Card → size
                  selector + Add to Cart. Color sits with the selection cluster
                  (color = separate product, not a variant option). */}
              {specCard && (
                <div className="mt-4">
                  <SpecCard data={specCard} />
                </div>
              )}
              <div className="mt-4">
                <Eyebrow className="mb-2 text-support">Color</Eyebrow>
                <ColorSwatches
                  swatches={getColorSwatches(product.colorSiblings)}
                  currentHandle={product.handle}
                  size="lg"
                  alwaysRender
                  selectedOptions={selectedVariant?.selectedOptions}
                />
              </div>
              <div className="mt-4">
                <ProductForm />
              </div>
              {/* The fit line moves into the Spec Card's FIT row when a spec
                  card exists — don't render it twice. */}
              {!specCard?.fit && product.fitNote?.value && (
                <p className="mt-3 text-xs text-support italic">{product.fitNote.value}</p>
              )}
            </div>
            <AddToCartBar product={product} />
          </div>
        </Container>
      </section>
      <StickyAddToCart product={product} />
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
    </>
  );
};

export default Product;
