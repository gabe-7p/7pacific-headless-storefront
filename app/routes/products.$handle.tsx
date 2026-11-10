import { Cache, getSelectedProductOptions } from '@shopify/hydrogen';
import { Suspense } from 'react';
import { Await, useLoaderData, useLocation, useNavigate } from 'react-router';

import { ProductViewedTracker } from '~/components/analytics/Trackers';
import { Container } from '~/components/common/Container';
import { Heading } from '~/components/common/Heading';
import { Image } from '~/components/common/Image';
import { Price } from '~/components/common/Price';
import { Prose } from '~/components/common/Prose';
import { AddToCartBar } from '~/components/product/AddToCartBar';
import { BrandBanner } from '~/components/product/BrandBanner';
import { EditionTag } from '~/components/product/EditionTag';
import { ProductDetails } from '~/components/product/ProductDetails';
import { ProductForm } from '~/components/product/ProductForm';
import { Recommendations } from '~/components/product/Recommendations';
import { SpecCard } from '~/components/product/SpecCard';
import { StickyAddToCart } from '~/components/product/StickyAddToCart';
import { TechStack } from '~/components/product/TechStack';
import { deferQuery, notFound } from '~/lib/http';
import { IMAGE_SIZES } from '~/lib/imageSizes';
import { getColorSwatches } from '~/lib/product/colors';
import { getHeroImages, parseProductContent, selectRecommendedProducts } from '~/lib/product/page';
import { PRODUCT_QUERY, RECOMMENDATIONS_QUERY } from '~/lib/product/queries';
import {
  ProductProvider,
  resolveSelectedVariant,
  selectionTarget,
  useProductForm,
} from '~/lib/product/store';
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
    }).then((data) => selectRecommendedProducts(data, handle))
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

  return { ...parseProductContent(product), recommendations };
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
        const { to, skipRevalidate } = selectionTarget(result, product.handle, location.search);
        if (to === `${location.pathname}${location.search}`) return;
        void navigate(to, {
          replace: true,
          preventScrollReset: true,
          ...(skipRevalidate ? { defaultShouldRevalidate: false } : {}),
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

  const { desktop: heroDesktop, mobile: heroMobile } = getHeroImages(product, selectedVariant);

  return (
    <>
      <ProductViewedTracker product={product} variant={selectedVariant} />
      {/* Desktop stacks the photo and the buy card in one grid cell, so the
          hero is as tall as the taller of the two: the photo at its own
          aspect ratio (it never zooms past what the card needs, so the wide
          end shows the whole shot), or the card. `min-h` keeps live's 800px
          floor; below ~1213px that floor crops the photo's sides instead. */}
      <section className="overflow-hidden bg-field text-ink impulse:relative impulse:grid impulse:min-h-[50rem] impulse:text-ink-night">
        {/* Mobile: in-flow hero shot. Desktop: full-bleed cover hero behind the
            buy card — two images because live uses a distinct desktop vs mobile
            source (matches its .desktop-image / .mobile-image divs). */}
        {/* Mobile: full-bleed at the photo's own aspect ratio (Image's inline
            ratio), so the whole shot shows edge to edge with no side gutters. */}
        {heroMobile && (
          <Image data={heroMobile} sizes={IMAGE_SIZES.full} className="impulse:hidden" />
        )}
        {/* Desktop: stretched to the grid cell. Anchored right of centre
            horizontally, because the hero photos leave the left side clear for
            the buy card and put the subject on the right, which is the side a
            narrow (tablet) cell crops. Anchored to the top vertically, so the
            wide-screen zoom trims from the feet up and keeps the face. `max-h` caps the
            hero at its 1440px height (950px), so wider screens zoom in rather
            than grow the section; `min-h-full` still fills a taller cell
            (a long buy card), because min-height beats max-height. */}
        {heroDesktop && (
          <Image
            data={heroDesktop}
            sizes={IMAGE_SIZES.full}
            className="hidden object-cover object-[75%_0%] impulse:col-start-1 impulse:row-start-1 impulse:block impulse:h-full impulse:max-h-[59.375rem] impulse:min-h-full impulse:self-stretch"
          />
        )}
        <div className="hidden impulse:absolute impulse:inset-0 impulse:block impulse:bg-linear-to-r impulse:from-scrim/20 impulse:via-transparent impulse:to-transparent" />
        {/* The card carries its own left inset rather than the Container taking
            horizontal padding: `impulse:` is px and `md:` is rem, and Tailwind
            sorts breakpoints by unit first, so `impulse:` emits before `md:` and
            `md:px-0` would still win over an `impulse:px-8` at 769+. */}
        <Container className="px-0 sm:px-0 md:px-0 impulse:relative impulse:z-10 impulse:col-start-1 impulse:row-start-1 impulse:self-center impulse:py-10">
          {/* Live's card is 500px wide with 20px padding (460px of content) —
              the measure the description was authored against. */}
          <div className="flex flex-col bg-field text-ink impulse:ml-8 impulse:max-w-[500px]">
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
                className="text-2xl leading-[1.15] tracking-product md:text-[2rem]"
              >
                {title}
              </Heading>
              {/* font-medium, not bold: mono runs Regular/Medium only. The
                  non-breaking space holds the row when no variant resolves. */}
              <div className="mt-3 text-lg">
                {selectedVariant?.price ? (
                  <Price
                    data={selectedVariant.price}
                    compareAt={selectedVariant.compareAtPrice}
                    className="font-medium"
                  />
                ) : (
                  <span>&nbsp;</span>
                )}
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
              <ProductForm
                swatches={getColorSwatches(product.colorSiblings)}
                currentHandle={product.handle}
                selectedOptions={selectedVariant?.selectedOptions}
              />
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
