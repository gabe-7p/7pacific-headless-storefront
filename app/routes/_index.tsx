import { Cache, gql } from '@shopify/hydrogen';
import { useLoaderData } from 'react-router';

import { FadeIn, MotionProvider } from '~/components/common/Motion';
import { BaselineIntro } from '~/components/home/BaselineIntro';
import { CoreValues } from '~/components/home/CoreValues';
import { DropTwo } from '~/components/home/DropTwo';
import { FirstDrop } from '~/components/home/FirstDrop';
import { Hero } from '~/components/home/Hero';
import { NameSpecBanner } from '~/components/home/NameSpecBanner';
import { Roster } from '~/components/home/Roster';
import { FEATURE_FLAGS } from '~/content/flags';
import { HOME_META } from '~/content/home';
import { HANDLES } from '~/content/links';
import { PRODUCT_CARD_FRAGMENT } from '~/lib/fragments';
import { buildMeta } from '~/lib/seo';
import { queryStorefront, storefrontClientContext } from '~/lib/storefront';

import type { Route } from './+types/_index';

export const meta: Route.MetaFunction = () => {
  return buildMeta({
    absoluteTitle: HOME_META.title,
    // Share previews (iMessage, Slack, …) show a dedicated 1200×630 card:
    // the hero shot with the black wordmark overlaid (public/og-home.jpg).
    // Absolute: scrapers don't resolve relative paths.
    image: HOME_META.ogImage,
  });
};

export async function loader({ context }: Route.LoaderArgs) {
  const storefront = context.get(storefrontClientContext);

  const data = await queryStorefront(storefront, HOME_PRODUCTS_QUERY, {
    variables: { handle: HANDLES.homepageCollection },
    cache: Cache.long(),
  });

  if (data?.collection?.products.nodes.length) {
    return { products: data.collection.products.nodes };
  }

  // Fall back to all products only if the collection is missing/empty, so a
  // misconfigured collection never blanks the homepage.
  const fallback = await queryStorefront(storefront, HOME_PRODUCTS_FALLBACK_QUERY, {
    cache: Cache.long(),
  });
  return { products: fallback?.products.nodes ?? [] };
}

const Homepage = () => {
  const { products } = useLoaderData<typeof loader>();
  return (
    <MotionProvider>
      <Hero />
      {/* Fold group: painted on load (no scroll-reveal gate) so nothing pops in
          or shifts. DropTwo is toggled by FEATURE_FLAGS.dropTwoTeaser. */}
      <NameSpecBanner />
      <BaselineIntro />
      {FEATURE_FLAGS.dropTwoTeaser && <DropTwo />}
      <FirstDrop products={products} />
      {/* The lower sections keep the scroll-triggered fade. */}
      <FadeIn>
        <CoreValues />
      </FadeIn>
      <FadeIn>
        <Roster />
      </FadeIn>
    </MotionProvider>
  );
};

const HOME_PRODUCTS_QUERY = gql(
  `
    query HomeProducts($handle: String!, $country: CountryCode, $language: LanguageCode)
      @inContext(country: $country, language: $language) {
      collection(handle: $handle) {
        products(first: 12) {
          nodes {
            ...ProductCard
          }
        }
      }
    }
  `,
  [PRODUCT_CARD_FRAGMENT]
);

const HOME_PRODUCTS_FALLBACK_QUERY = gql(
  `
    query HomeProductsFallback($country: CountryCode, $language: LanguageCode)
      @inContext(country: $country, language: $language) {
      products(first: 12) {
        nodes {
          ...ProductCard
        }
      }
    }
  `,
  [PRODUCT_CARD_FRAGMENT]
);

export default Homepage;
