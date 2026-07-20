import { Image } from '@shopify/hydrogen';
import { useLoaderData } from 'react-router';

import { Container } from '~/components/common/Container';
import { Heading } from '~/components/common/Heading';
import { Prose } from '~/components/common/Prose';
import { notFound } from '~/lib/http';
import { formatJournalDate, readingTimeMinutes } from '~/lib/journal';
import { buildMeta } from '~/lib/seo';

import type { Route } from './+types/journal.$handle';

export const meta: Route.MetaFunction = ({ loaderData }) =>
  buildMeta({
    title: loaderData?.article.title,
    description: loaderData?.article.excerpt ?? undefined,
    image: loaderData?.article.image?.url,
  });

export async function loader({ context, params }: Route.LoaderArgs) {
  const { handle } = params;
  if (!handle) throw notFound('Article not found');

  const { blog } = await context.storefront.query(ARTICLE_QUERY, {
    variables: { handle },
    cache: context.storefront.CacheLong(),
  });
  const article = blog?.articleByHandle;
  if (!article) throw notFound('Article not found');

  return { article };
}

/**
 * A journal article — the one surface the type table sets at 18px body
 * (65ch measure, lh 1.65), under a mono metadata strip. One full-bleed image
 * per piece at most: restraint over gallery.
 */
const Article = () => {
  const { article } = useLoaderData<typeof loader>();
  const minutes = readingTimeMinutes(article.contentHtml);

  const meta = [formatJournalDate(article.publishedAt), minutes ? `${minutes} min read` : null]
    .filter(Boolean)
    .join(' · ');

  return (
    <article className="pb-24">
      <Container className="py-16 md:py-24">
        <p className="tracking-spec font-mono text-xs text-neutral-500 uppercase">{meta}</p>
        <Heading as="h1" size="none" className="mt-3 max-w-[20ch] text-4xl md:text-6xl">
          {article.title}
        </Heading>
      </Container>

      {article.image && (
        <Image data={article.image} sizes="100vw" className="h-auto w-full object-cover" />
      )}

      <Container className={article.image ? 'pt-12 md:pt-16' : ''}>
        <Prose html={article.contentHtml} variant="journal" />
      </Container>
    </article>
  );
};

const ARTICLE_QUERY = `#graphql
  query JournalArticle($handle: String!, $country: CountryCode, $language: LanguageCode)
    @inContext(country: $country, language: $language) {
    blog(handle: "journal") {
      articleByHandle(handle: $handle) {
        id
        handle
        title
        excerpt
        contentHtml
        publishedAt
        image {
          id
          url
          altText
          width
          height
        }
      }
    }
  }
` as const;

export default Article;
