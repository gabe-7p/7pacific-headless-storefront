import { type Shop } from '@shopify/hydrogen/storefront-api-types';
import { useLoaderData } from 'react-router';

import { Container } from '~/components/common/Container';
import { Heading } from '~/components/common/Heading';
import { Prose } from '~/components/common/Prose';
import { notFound } from '~/lib/http';
import { buildMeta } from '~/lib/seo';

import type { Route } from './+types/policies.$handle';

type SelectedPolicies = keyof Pick<
  Shop,
  'privacyPolicy' | 'shippingPolicy' | 'termsOfService' | 'refundPolicy'
>;

export const meta: Route.MetaFunction = ({ data }) => {
  return buildMeta({ title: data?.policy.title });
};

export async function loader({ params, context }: Route.LoaderArgs) {
  if (!params.handle) {
    throw notFound('Policy not found');
  }

  const policyName = params.handle.replace(/-([a-z])/g, (_: unknown, m1: string) =>
    m1.toUpperCase()
  ) as SelectedPolicies;

  const data = await context.storefront.query(POLICY_CONTENT_QUERY, {
    cache: context.storefront.CacheLong(),
    variables: {
      privacyPolicy: false,
      shippingPolicy: false,
      termsOfService: false,
      refundPolicy: false,
      [policyName]: true,
      language: context.storefront.i18n?.language,
    },
  });

  const policy = data.shop?.[policyName];

  if (!policy) {
    throw notFound('Policy not found');
  }

  return { policy };
}

const Policy = () => {
  const { policy } = useLoaderData<typeof loader>();

  return (
    // Live renders policies in a narrow centred column. It has no /policies
    // index, so there's no "back" link to offer.
    <Container className="py-16 md:py-24">
      <div className="mx-auto max-w-[400px]">
        <Heading
          as="h1"
          variant="quiet"
          size="none"
          className="text-center text-[22px] font-semibold tracking-normal"
        >
          {policy.title}
        </Heading>
        <Prose html={policy.body} variant="policy" className="mt-8" />
      </div>
    </Container>
  );
};

// NOTE: https://shopify.dev/docs/api/storefront/latest/objects/Shop
const POLICY_CONTENT_QUERY = `#graphql
  fragment Policy on ShopPolicy {
    body
    handle
    id
    title
    url
  }
  query Policy(
    $country: CountryCode
    $language: LanguageCode
    $privacyPolicy: Boolean!
    $refundPolicy: Boolean!
    $shippingPolicy: Boolean!
    $termsOfService: Boolean!
  ) @inContext(language: $language, country: $country) {
    shop {
      privacyPolicy @include(if: $privacyPolicy) {
        ...Policy
      }
      shippingPolicy @include(if: $shippingPolicy) {
        ...Policy
      }
      termsOfService @include(if: $termsOfService) {
        ...Policy
      }
      refundPolicy @include(if: $refundPolicy) {
        ...Policy
      }
    }
  }
` as const;

export default Policy;
