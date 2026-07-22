import { Link, useLoaderData } from 'react-router';

import { Container } from '~/components/common/Container';
import { Heading } from '~/components/common/Heading';
import { notFound } from '~/lib/http';
import { formatJournalDate } from '~/lib/journal';
import { buildMeta } from '~/lib/seo';

import type { Route } from './+types/journal._index';

export const meta: Route.MetaFunction = () =>
  buildMeta({
    title: 'Journal',
    description: 'Training pieces, founder letters, and what the crew is on.',
  });

export async function loader({ context }: Route.LoaderArgs) {
  const { blog } = await context.storefront.query(JOURNAL_QUERY, {
    // Curated, rarely-changing content.
    cache: context.storefront.CacheLong(),
  });
  if (!blog) throw notFound('Journal not found');
  return { articles: blog.articles.nodes };
}

const Journal = () => {
  const { articles } = useLoaderData<typeof loader>();

  return (
    <Container className="py-16 md:py-24">
      <Heading as="h1" size="display">
        Journal
      </Heading>
      <p className="mt-3 max-w-md text-graphite">
        Training pieces, founder letters, and what the crew is on.
      </p>

      <ul className="mt-12 flex max-w-[65ch] flex-col">
        {articles.map((article) => (
          <li key={article.id} className="border-border-subtle border-t">
            <Link
              to={`/journal/${article.handle}`}
              prefetch="intent"
              className="block py-6 transition-opacity hover:opacity-70"
            >
              {/* Mono metadata strip — the journal's spec-strip device. */}
              <span className="tracking-spec font-mono text-xs text-graphite uppercase">
                {formatJournalDate(article.publishedAt)}
              </span>
              <Heading as="h2" size="none" className="mt-2 text-2xl md:text-3xl">
                {article.title}
              </Heading>
              {article.excerpt && <p className="mt-2 text-base text-graphite">{article.excerpt}</p>}
            </Link>
          </li>
        ))}
      </ul>
    </Container>
  );
};

const JOURNAL_QUERY = `#graphql
  query Journal($country: CountryCode, $language: LanguageCode)
    @inContext(country: $country, language: $language) {
    blog(handle: "journal") {
      articles(first: 20, sortKey: PUBLISHED_AT, reverse: true) {
        nodes {
          id
          handle
          title
          excerpt
          publishedAt
        }
      }
    }
  }
` as const;

export default Journal;
