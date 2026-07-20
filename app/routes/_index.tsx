import { useLoaderData } from 'react-router';

import { FadeIn, MotionProvider } from '~/components/common/Motion';
import { CoreValues } from '~/components/home/CoreValues';
import { FirstDrop } from '~/components/home/FirstDrop';
import { Hero } from '~/components/home/Hero';
import { TestedInTraining } from '~/components/home/TestedInTraining';
import { HOMEPAGE_COLLECTION_HANDLE } from '~/content/links';
import { PRODUCT_CARD_FRAGMENT } from '~/lib/fragments';
import { buildMeta } from '~/lib/seo';

import type { Route } from './+types/_index';

export const meta: Route.MetaFunction = () => {
  return buildMeta({ absoluteTitle: '7Pacific · Lightweight and Breathable Training Gear' });
};

export async function loader({ context }: Route.LoaderArgs) {
  // Grid order is merchant-controlled: the manual homepage collection's
  // product order IS the display order (reorder in Shopify admin).
  const { collection, products } = await context.storefront.query(HOME_PRODUCTS_QUERY, {
    variables: { handle: HOMEPAGE_COLLECTION_HANDLE },
    cache: context.storefront.CacheLong(),
  });

  // Fall back to all products if the collection is missing/empty, so a
  // misconfigured collection never blanks the homepage.
  const nodes = collection?.products.nodes.length ? collection.products.nodes : products.nodes;

  return { products: nodes };
}

const Homepage = () => {
  const { products } = useLoaderData<typeof loader>();
  return (
    <MotionProvider>
      <Hero />
      {/* First Drop is the primary above/at-the-fold content — render it
          immediately (no scroll-reveal gate) so it's painted on load rather
          than staying invisible until 30% scrolls into view. The lower
          sections keep the scroll-triggered fade. */}
      <FirstDrop products={products} />
      <FadeIn>
        <CoreValues />
      </FadeIn>
      <FadeIn>
        <TestedInTraining />
      </FadeIn>
    </MotionProvider>
  );
};

const HOME_PRODUCTS_QUERY = `#graphql
  ${PRODUCT_CARD_FRAGMENT}
  query HomeProducts($handle: String!, $country: CountryCode, $language: LanguageCode)
    @inContext(country: $country, language: $language) {
    collection(handle: $handle) {
      products(first: 12) {
        nodes {
          ...ProductCard
        }
      }
    }
    products(first: 12) {
      nodes {
        ...ProductCard
      }
    }
  }
` as const;

export default Homepage;
