import { Cache, gql } from '@shopify/hydrogen';
import { Link, useLoaderData } from 'react-router';

import { Container } from '~/components/common/Container';
import { Heading } from '~/components/common/Heading';
import { JOURNAL } from '~/content/journal';
import { HANDLES } from '~/content/links';
import { notFound } from '~/lib/http';
import { formatJournalDate } from '~/lib/journalFormat';
import { buildMeta } from '~/lib/seo';
import { storefrontClientContext } from '~/lib/storefront';
import { journalUrl } from '~/lib/urls';

import type { Route } from './+types/journal._index';

export const meta: Route.MetaFunction = () =>
  buildMeta({ title: JOURNAL.title, description: JOURNAL.tagline });

export async function loader({ context }: Route.LoaderArgs) {
  const { data } = await context.get(storefrontClientContext).graphql(JOURNAL_QUERY, {
    variables: { blogHandle: HANDLES.journalBlog },
    // Curated, rarely-changing content.
    cache: Cache.long(),
  });
  if (!data?.blog) throw notFound('Journal not found');
  return { articles: data.blog.articles.nodes };
}

const Journal = () => {
  const { articles } = useLoaderData<typeof loader>();

  return (
    <Container className="py-16 md:py-24">
      <Heading as="h1" size="display">
        {JOURNAL.title}
      </Heading>
      <p className="mt-3 max-w-md text-support">{JOURNAL.tagline}</p>

      <ul className="mt-12 flex max-w-[65ch] flex-col">
        {articles.map((article) => (
          <li key={article.id} className="border-border-subtle border-t">
            <Link
              to={journalUrl(article.handle)}
              prefetch="intent"
              className="block py-6 transition-opacity hover:opacity-70"
            >
              {/* Mono metadata strip — the journal's spec-strip device. */}
              <span className="tracking-spec font-mono text-xs text-support uppercase">
                {formatJournalDate(article.publishedAt)}
              </span>
              <Heading as="h2" size="none" className="mt-2 text-2xl md:text-3xl">
                {article.title}
              </Heading>
              {article.excerpt && <p className="mt-2 text-base text-support">{article.excerpt}</p>}
            </Link>
          </li>
        ))}
      </ul>
    </Container>
  );
};

const JOURNAL_QUERY = gql(`
  query Journal($blogHandle: String!, $country: CountryCode, $language: LanguageCode)
    @inContext(country: $country, language: $language) {
    blog(handle: $blogHandle) {
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
`);

export default Journal;
