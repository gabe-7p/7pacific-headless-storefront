import { Link, useLoaderData } from 'react-router';
import type { PoliciesQuery, PolicyItemFragment } from 'storefrontapi.generated';

import { Heading } from '~/components/common/Heading';
import { buildMeta } from '~/lib/seo';

import type { Route } from './+types/policies._index';

export const meta: Route.MetaFunction = () => {
  return buildMeta({ title: 'Policies' });
};

export async function loader({ context }: Route.LoaderArgs) {
  const data: PoliciesQuery = await context.storefront.query(POLICIES_QUERY);

  const shopPolicies = data.shop;
  const policies: Array<PolicyItemFragment> = [
    shopPolicies?.privacyPolicy,
    shopPolicies?.shippingPolicy,
    shopPolicies?.termsOfService,
    shopPolicies?.refundPolicy,
    shopPolicies?.subscriptionPolicy,
  ].filter((policy): policy is PolicyItemFragment => policy != null);

  if (!policies.length) {
    throw new Response('No policies found', { status: 404 });
  }

  return { policies };
}

const Policies = () => {
  const { policies } = useLoaderData<typeof loader>();

  return (
    <div className="policies">
      <Heading as="h1" variant="quiet" className="my-8 tracking-normal">
        Policies
      </Heading>
      <div>
        {policies.map((policy) => (
          <fieldset key={policy.id}>
            <Link to={`/policies/${policy.handle}`}>{policy.title}</Link>
          </fieldset>
        ))}
      </div>
    </div>
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
