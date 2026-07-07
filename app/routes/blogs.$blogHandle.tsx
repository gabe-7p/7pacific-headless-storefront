import { useLoaderData } from 'react-router';

import { ArticleCard } from '~/components/blog/ArticleCard';
import { Container } from '~/components/common/Container';
import { SectionHeader } from '~/components/common/SectionHeader';
import { ARTICLE_CARD_FRAGMENT } from '~/lib/fragments';
import { redirectIfHandleIsLocalized } from '~/lib/redirect';
import { pageTitle } from '~/lib/seo';

import type { Route } from './+types/blogs.$blogHandle';

export const meta: Route.MetaFunction = ({ data }) => {
  return [{ title: pageTitle(data?.blog.title) }];
};

export async function loader({ context, params, request }: Route.LoaderArgs) {
  const { blogHandle } = params;
  if (!blogHandle) throw new Response('Missing blog handle', { status: 404 });

  const { blog } = await context.storefront.query(BLOG_QUERY, {
    variables: { blogHandle },
    cache: context.storefront.CacheLong(),
  });

  if (!blog) throw new Response('Not Found', { status: 404 });

  redirectIfHandleIsLocalized(request, { handle: blogHandle, data: blog });

  return { blog };
}

const Blog = () => {
  const { blog } = useLoaderData<typeof loader>();
  const articles = blog.articles.nodes;

  return (
    <Container className="max-w-4xl py-12 md:py-16">
      <SectionHeader heading={blog.title} />

      {articles.length === 0 ? (
        <p className="text-sm text-neutral-600">No posts yet — check back soon.</p>
      ) : (
        <div className="flex flex-col gap-10">
          {articles.map((article) => (
            <ArticleCard key={article.id} article={article} blogHandle={blog.handle} />
          ))}
        </div>
      )}
    </Container>
  );
};

const BLOG_QUERY = `#graphql
  ${ARTICLE_CARD_FRAGMENT}
  query Blog($blogHandle: String!, $country: CountryCode, $language: LanguageCode)
    @inContext(country: $country, language: $language) {
    blog(handle: $blogHandle) {
      handle
      title
      articles(first: 20, sortKey: PUBLISHED_AT, reverse: true) {
        nodes {
          ...ArticleCard
        }
      }
    }
  }
` as const;

export default Blog;
