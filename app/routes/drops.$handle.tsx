import { Image } from '@shopify/hydrogen';
import { useLoaderData } from 'react-router';

import { ProductCard } from '~/components/collection/ProductCard';
import { Container } from '~/components/common/Container';
import { Heading } from '~/components/common/Heading';
import { EditionTag } from '~/components/product/EditionTag';
import { canRenderFilm, type DropMetaobject, isArchived, parseDrop } from '~/lib/drops';
import { PRODUCT_CARD_FRAGMENT } from '~/lib/fragments';
import { notFound } from '~/lib/http';
import { buildMeta } from '~/lib/seo';

import type { Route } from './+types/drops.$handle';

export const meta: Route.MetaFunction = ({ data }) =>
  buildMeta({
    title: data?.drop.title,
    description: data?.drop.editorial ?? undefined,
  });

export async function loader({ context, params }: Route.LoaderArgs) {
  const { handle } = params;
  if (!handle) throw notFound('Drop not found');

  const { metaobject } = await context.storefront.query(DROP_QUERY, {
    variables: { handle },
    cache: context.storefront.CacheLong(),
  });
  if (!metaobject) throw notFound('Drop not found');

  return { drop: parseDrop(metaobject as DropMetaobject) };
}

/**
 * A drop page, in the locked order (05 Channels → Website → Drop pages):
 * title plate → 1-paragraph editorial → anchor image → the SKUs → 90-second
 * film → closing image. Each drop keeps its URL forever; an archived drop
 * still renders, with its cards no longer linking to a live purchase.
 */
const Drop = () => {
  const { drop } = useLoaderData<typeof loader>();
  const archived = isArchived(drop);

  return (
    <article className="pb-24">
      {/* 1 — Title plate */}
      <Container className="py-16 md:py-24">
        <EditionTag number={drop.editionNumber} status={drop.status} accent />
        <Heading as="h1" size="none" className="mt-2 text-5xl md:text-7xl">
          {drop.title}
        </Heading>
      </Container>

      {/* 2 — One-paragraph editorial */}
      {drop.editorial && (
        <Container>
          <p className="max-w-[65ch] text-lg leading-[1.65] whitespace-pre-line text-neutral-700">
            {drop.editorial}
          </p>
        </Container>
      )}

      {/* 3 — Anchor image (full-bleed) */}
      {drop.anchorImage && (
        <Image
          data={drop.anchorImage}
          sizes="100vw"
          className="mt-12 h-auto w-full object-cover md:mt-16"
        />
      )}

      {/* 4 — The SKUs in the drop */}
      {drop.products.length > 0 && (
        <Container className="mt-16 md:mt-24">
          {archived && (
            <p className="tracking-spec mb-6 font-mono text-xs text-neutral-500 uppercase">
              Archived · this drop has closed
            </p>
          )}
          <div className="grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3">
            {drop.products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </Container>
      )}

      {/* 5 — The 90-second film. Renders only with captions: drop films carry
          music and room sound, so an uncaptioned one would be inaccessible. */}
      {canRenderFilm(drop) && (
        <div className="mt-16 md:mt-24">
          <video
            src={drop.filmUrl ?? undefined}
            controls
            playsInline
            preload="none"
            className="bg-carbon aspect-video w-full"
          >
            <track kind="captions" src={drop.filmCaptionsUrl ?? undefined} default />
          </video>
        </div>
      )}

      {/* 6 — Closing image */}
      {drop.closingImage && (
        <Image
          data={drop.closingImage}
          sizes="100vw"
          className="mt-16 h-auto w-full object-cover md:mt-24"
        />
      )}
    </article>
  );
};

const DROP_QUERY = `#graphql
  ${PRODUCT_CARD_FRAGMENT}
  query Drop($handle: String!, $country: CountryCode, $language: LanguageCode)
    @inContext(country: $country, language: $language) {
    metaobject(handle: { type: "drop", handle: $handle }) {
      handle
      fields {
        key
        value
        reference {
          ... on MediaImage {
            image { id url altText width height }
          }
        }
        references(first: 12) {
          nodes {
            ... on Product {
              ...ProductCard
            }
          }
        }
      }
    }
  }
` as const;

export default Drop;
