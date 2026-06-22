import { useLoaderData } from 'react-router';

import { CoreValues } from '~/components/home/CoreValues';
import { FirstDrop } from '~/components/home/FirstDrop';
import { Hero } from '~/components/home/Hero';
import { TestedInTraining } from '~/components/home/TestedInTraining';
import { HOME_FIRST_DROP } from '~/content/home';
import { PRODUCT_CARD_FRAGMENT } from '~/lib/fragments';
import { DEFAULT_DESCRIPTION } from '~/lib/seo';

import type { Route } from './+types/_index';

export const meta: Route.MetaFunction = () => {
  return [
    { title: '7Pacific — Lightweight and Breathable Training Gear' },
    { name: 'description', content: DEFAULT_DESCRIPTION },
  ];
};

export async function loader({ context }: Route.LoaderArgs) {
  const { collection } = await context.storefront.query(HOME_COLLECTION_QUERY, {
    variables: { handle: HOME_FIRST_DROP.collectionHandle },
    cache: context.storefront.CacheLong(),
  });

  return { products: collection?.products.nodes ?? [] };
}

const Homepage = () => {
  const { products } = useLoaderData<typeof loader>();
  return (
    <>
      <Hero />
      <FirstDrop products={products} />
      <CoreValues />
      <TestedInTraining />
    </>
  );
};

const HOME_COLLECTION_QUERY = `#graphql
  ${PRODUCT_CARD_FRAGMENT}
  query HomeCollection($handle: String!, $country: CountryCode, $language: LanguageCode)
    @inContext(country: $country, language: $language) {
    collection(handle: $handle) {
      id
      products(first: 12) {
        nodes {
          ...ProductCard
        }
      }
    }
  }
` as const;

export default Homepage;
