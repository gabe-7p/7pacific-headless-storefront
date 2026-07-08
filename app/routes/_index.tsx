import { useLoaderData } from 'react-router';

import { FadeIn, MotionProvider } from '~/components/common/Motion';
import { CoreValues } from '~/components/home/CoreValues';
import { FirstDrop } from '~/components/home/FirstDrop';
import { Hero } from '~/components/home/Hero';
import { TestedInTraining } from '~/components/home/TestedInTraining';
import { HOME_FIRST_DROP } from '~/content/home';
import { PRODUCT_CARD_FRAGMENT } from '~/lib/fragments';
import { buildMeta } from '~/lib/seo';

import type { Route } from './+types/_index';

export const meta: Route.MetaFunction = () => {
  return buildMeta({ absoluteTitle: '7Pacific — Lightweight and Breathable Training Gear' });
};

export async function loader({ context }: Route.LoaderArgs) {
  const { products } = await context.storefront.query(HOME_PRODUCTS_QUERY, {
    cache: context.storefront.CacheLong(),
  });

  // Match the live homepage's display order; unknown handles sort last.
  const order = HOME_FIRST_DROP.productOrder as ReadonlyArray<string>;
  const rank = (handle: string) => {
    const index = order.indexOf(handle);
    return index === -1 ? order.length : index;
  };
  const sorted = [...products.nodes].sort((a, b) => rank(a.handle) - rank(b.handle));

  return { products: sorted };
}

const Homepage = () => {
  const { products } = useLoaderData<typeof loader>();
  return (
    <MotionProvider>
      <Hero />
      <FadeIn>
        <FirstDrop products={products} />
      </FadeIn>
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
  query HomeProducts($country: CountryCode, $language: LanguageCode)
    @inContext(country: $country, language: $language) {
    products(first: 12) {
      nodes {
        ...ProductCard
      }
    }
  }
` as const;

export default Homepage;
