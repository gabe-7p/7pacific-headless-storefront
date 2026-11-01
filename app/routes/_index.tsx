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
import { HOMEPAGE_COLLECTION_HANDLE } from '~/content/links';
import { PRODUCT_CARD_FRAGMENT } from '~/lib/fragments';
import { buildMeta } from '~/lib/seo';
import { storefrontClientContext } from '~/lib/storefront';

import type { Route } from './+types/_index';

export const meta: Route.MetaFunction = () => {
  return buildMeta({
    absoluteTitle: '7Pacific · Lightweight and Breathable Training Gear',
    // Share previews (iMessage, Slack, …) show a dedicated 1200×630 card:
    // the hero shot with the black wordmark overlaid (public/og-home.jpg).
    // Must be an absolute URL — scrapers don't resolve relative paths.
    image: 'https://7pacificapparel.com/og-home.jpg',
  });
};

export async function loader({ context }: Route.LoaderArgs) {
  const storefront = context.get(storefrontClientContext);

  // Grid order is merchant-controlled: the manual homepage collection's
  // product order IS the display order (reorder in Shopify admin).
  const { data } = await storefront.graphql(HOME_PRODUCTS_QUERY, {
    variables: { handle: HOMEPAGE_COLLECTION_HANDLE },
    cache: Cache.long(),
  });

  if (data?.collection?.products.nodes.length) {
    return { products: data.collection.products.nodes };
  }

  // Fall back to all products only if the collection is missing/empty, so a
  // misconfigured collection never blanks the homepage.
  const fallback = await storefront.graphql(HOME_PRODUCTS_FALLBACK_QUERY, { cache: Cache.long() });
  return { products: fallback.data?.products.nodes ?? [] };
}

const Homepage = () => {
  const { products } = useLoaderData<typeof loader>();
  return (
    <MotionProvider>
      <Hero />
      {/* The Name/Spec marquee sits flush below the hero, painted on load
          (no scroll-reveal gate) so the banner never pops in or shifts. */}
      <NameSpecBanner />
      {/* Baseline intro sits right under the banner, near the fold — painted
          on load (no scroll-reveal gate) like the other fold sections; it
          deepens the story (drop page + film). */}
      <BaselineIntro />
      {/* Drop 02 teaser follows the Baseline intro, near the fold — painted
          on load (no scroll-reveal gate) so the countdown never pops in.
          Toggled by FEATURE_FLAGS.dropTwoTeaser (content/flags.ts). */}
      {FEATURE_FLAGS.dropTwoTeaser && <DropTwo />}
      {/* First Drop is the primary above/at-the-fold content — render it
          immediately (no scroll-reveal gate) so it's painted on load rather
          than staying invisible until 30% scrolls into view. The lower
          sections keep the scroll-triggered fade. */}
      <FirstDrop products={products} />
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
