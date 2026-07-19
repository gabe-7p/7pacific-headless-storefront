import { Image } from '@shopify/hydrogen';
import { Link, useLoaderData } from 'react-router';

import { Container } from '~/components/common/Container';
import { Heading } from '~/components/common/Heading';
import { EditionTag } from '~/components/product/EditionTag';
import { type DropMetaobject, parseDrop, sortDropsByEditionDesc } from '~/lib/drops';
import { buildMeta } from '~/lib/seo';

import type { Route } from './+types/drops._index';

export const meta: Route.MetaFunction = () =>
  buildMeta({
    title: 'Drops',
    description: 'Every 7Pacific drop, archived. Edition-numbered, permanent.',
  });

export async function loader({ context }: Route.LoaderArgs) {
  const { metaobjects } = await context.storefront.query(DROPS_QUERY, {
    // Curated, rarely-changing content.
    cache: context.storefront.CacheLong(),
  });
  const drops = sortDropsByEditionDesc(
    (metaobjects?.nodes ?? []).map((node) => parseDrop(node as DropMetaobject))
  );
  return { drops };
}

const Drops = () => {
  const { drops } = useLoaderData<typeof loader>();

  return (
    <Container className="py-16 md:py-24">
      <Heading as="h1" size="display">
        Drops
      </Heading>
      <p className="mt-3 max-w-md text-neutral-600">
        Every drop, kept. Nothing here gets taken down.
      </p>

      <div className="mt-12 flex flex-col gap-12">
        {drops.map((drop) => (
          <Link
            key={drop.handle}
            to={`/drops/${drop.handle}`}
            prefetch="intent"
            className="group block"
          >
            {drop.anchorImage && (
              <Image
                data={drop.anchorImage}
                sizes="(min-width: 768px) 100vw, 100vw"
                className="aspect-[16/9] w-full object-cover"
              />
            )}
            <div className="mt-4 flex flex-col gap-1">
              {/* The archive rows carry no other Ember, so a LIVE drop earns
                  the accent here (7PA-230 ration, 7PA-246 device). */}
              <EditionTag number={drop.editionNumber} status={drop.status} accent />
              <Heading as="h2" size="none" className="text-3xl md:text-4xl">
                {drop.title}
              </Heading>
            </div>
          </Link>
        ))}
      </div>
    </Container>
  );
};

const DROPS_QUERY = `#graphql
  query Drops($country: CountryCode, $language: LanguageCode)
    @inContext(country: $country, language: $language) {
    metaobjects(type: "drop", first: 20) {
      nodes {
        handle
        fields {
          key
          value
          reference {
            ... on MediaImage {
              image { id url altText width height }
            }
          }
        }
      }
    }
  }
` as const;

export default Drops;
