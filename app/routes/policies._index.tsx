import { useLoaderData } from 'react-router';
import type { PoliciesQuery, PolicyItemFragment } from 'storefrontapi.generated';

import { Container } from '~/components/common/Container';
import { Heading } from '~/components/common/Heading';
import { TextLink } from '~/components/common/TextLink';
import { notFound } from '~/lib/http';
import { buildMeta } from '~/lib/seo';

import type { Route } from './+types/policies._index';

export const meta: Route.MetaFunction = () => {
  return buildMeta({ title: 'Policies' });
};

export async function loader({ context }: Route.LoaderArgs) {
  const data: PoliciesQuery = await context.storefront.query(POLICIES_QUERY, {
    cache: context.storefront.CacheLong(),
  });

  const shopPolicies = data.shop;
  const policies: Array<PolicyItemFragment> = [
    shopPolicies?.privacyPolicy,
    shopPolicies?.shippingPolicy,
    shopPolicies?.termsOfService,
    shopPolicies?.refundPolicy,
    shopPolicies?.subscriptionPolicy,
  ].filter((policy): policy is PolicyItemFragment => policy != null);

  if (!policies.length) {
    throw notFound('No policies found');
  }

  return { policies };
}

const Policies = () => {
  const { policies } = useLoaderData<typeof loader>();

  return (
    // No live counterpart (live 404s on /policies), so this just mirrors the
    // policy pages' centred column for internal consistency.
    <Container className="py-16 md:py-24">
      <div className="mx-auto max-w-[400px]">
        <Heading
          as="h1"
          variant="quiet"
          size="none"
          className="text-center text-[22px] font-semibold tracking-normal"
        >
          Policies
        </Heading>
        <nav className="mt-8 flex flex-col gap-2">
          {policies.map((policy) => (
            <TextLink key={policy.id} to={`/policies/${policy.handle}`} prefetch="intent">
              {policy.title}
            </TextLink>
          ))}
        </nav>
      </div>
    </Container>
  );
};

const POLICIES_QUERY = `#graphql
  fragment PolicyItem on ShopPolicy {
    id
    title
    handle
  }
  query Policies ($country: CountryCode, $language: LanguageCode)
    @inContext(country: $country, language: $language) {
    shop {
      privacyPolicy {
        ...PolicyItem
      }
      shippingPolicy {
        ...PolicyItem
      }
      termsOfService {
        ...PolicyItem
      }
      refundPolicy {
        ...PolicyItem
      }
      subscriptionPolicy {
        id
        title
        handle
      }
    }
  }
` as const;

export default Policies;
