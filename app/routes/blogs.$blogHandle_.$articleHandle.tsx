import { Link, useLoaderData } from 'react-router';

import { ArticleCard, formatArticleDate } from '~/components/blog/ArticleCard';
import { Container } from '~/components/common/Container';
import { Heading } from '~/components/common/Heading';
import { SectionHeader } from '~/components/common/SectionHeader';
import { Button } from '~/components/ui/button';
import { ARTICLE_CARD_FRAGMENT } from '~/lib/fragments';
import { pageTitle } from '~/lib/seo';

import type { Route } from './+types/blogs.$blogHandle_.$articleHandle';

export const meta: Route.MetaFunction = ({ data }) => {
  return [
    { title: pageTitle(data?.article.title) },
    { name: 'description', content: data?.article.seo?.description ?? '' },
  ];
};

export async function loader({ context, params }: Route.LoaderArgs) {
  const { blogHandle, articleHandle } = params;
  if (!blogHandle || !articleHandle) throw new Response('Not Found', { status: 404 });

  const { blog } = await context.storefront.query(ARTICLE_QUERY, {
    variables: { blogHandle, articleHandle },
    cache: context.storefront.CacheLong(),
  });

  if (!blog?.articleByHandle) throw new Response('Not Found', { status: 404 });

  const related = blog.articles.nodes.filter((node) => node.handle !== articleHandle).slice(0, 3);

  return {
    blog: { handle: blog.handle, title: blog.title },
    article: blog.articleByHandle,
    related,
  };
}

const Article = () => {
  const { blog, article, related } = useLoaderData<typeof loader>();

  return (
    <Container className="max-w-3xl py-12 md:py-16">
      <nav className="text-xs tracking-wide text-neutral-500 uppercase">
        <Link to="/" className="hover:underline">
          Home
        </Link>
        {' / '}
        <Link to={`/blogs/${blog.handle}`} className="hover:underline">
          {blog.title}
        </Link>
      </nav>

      <p className="mt-6 text-xs tracking-wide text-neutral-500 uppercase">
        {article.tags.length > 0 && <span>{article.tags.join(' · ')} · </span>}
        {formatArticleDate(article.publishedAt)}
      </p>

      <Heading as="h1" size="lg" className="mt-3">
        {article.title}
      </Heading>

      <div
        className="mt-8 [&_a]:text-brand [&_a]:underline [&_h2]:mt-8 [&_h2]:text-lg [&_h2]:font-bold [&_h2]:tracking-wide [&_h2]:uppercase [&_h3]:mt-6 [&_h3]:font-semibold [&_img]:mt-6 [&_img]:w-full [&_li]:mt-1 [&_li]:text-sm [&_li]:leading-6 [&_li]:text-neutral-600 [&_p]:mt-4 [&_p]:text-sm [&_p]:leading-7 [&_p]:text-neutral-600 [&_ul]:mt-4 [&_ul]:list-disc [&_ul]:pl-5"
        dangerouslySetInnerHTML={{ __html: article.contentHtml }}
      />

      <hr className="mt-12 border-neutral-200" />
      <div className="mt-8 flex justify-center">
        <Button asChild variant="brand">
          <Link to={`/blogs/${blog.handle}`}>Back to {blog.title}</Link>
        </Button>
      </div>

      {related.length > 0 && (
        <div className="mt-16">
          <SectionHeader heading="You may also like" />
          <div className="flex flex-col gap-10">
            {related.map((item) => (
              <ArticleCard key={item.id} article={item} blogHandle={blog.handle} />
            ))}
          </div>
        </div>
      )}
    </Container>
  );
};

const ARTICLE_QUERY = `#graphql
  ${ARTICLE_CARD_FRAGMENT}
  query Article($blogHandle: String!, $articleHandle: String!, $country: CountryCode, $language: LanguageCode)
    @inContext(country: $country, language: $language) {
    blog(handle: $blogHandle) {
      handle
      title
      articleByHandle(handle: $articleHandle) {
        id
        title
        contentHtml
        publishedAt
        tags
        seo {
          description
          title
        }
      }
      articles(first: 4, sortKey: PUBLISHED_AT, reverse: true) {
        nodes {
          ...ArticleCard
        }
      }
    }
  }
` as const;

export default Article;
