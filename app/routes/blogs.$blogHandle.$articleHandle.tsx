import { Image } from '@shopify/hydrogen';
import { useLoaderData } from 'react-router';

import { Container } from '~/components/common/Container';
import { Heading } from '~/components/common/Heading';
import { pageTitle } from '~/lib/seo';

import type { Route } from './+types/blogs.$blogHandle.$articleHandle';

export const meta: Route.MetaFunction = ({ data }) => {
  return [{ title: pageTitle(data?.article?.title) }];
};

export async function loader({ context, params }: Route.LoaderArgs) {
  const { blogHandle, articleHandle } = params;
  if (!blogHandle || !articleHandle) throw new Response('Not found', { status: 404 });

  const { blog } = await context.storefront.query(ARTICLE_QUERY, {
    variables: { blogHandle, articleHandle },
  });

  if (!blog?.articleByHandle) throw new Response('Not found', { status: 404 });

  return { article: blog.articleByHandle };
}

const formatDate = (value: string) =>
  new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'long', day: 'numeric' }).format(
    new Date(value)
  );

const Article = () => {
  const { article } = useLoaderData<typeof loader>();
  return (
    <Container className="max-w-3xl py-12 md:py-16">
      <header className="mb-8 text-center">
        <p className="text-xs tracking-wide text-neutral-500 uppercase">
          {formatDate(article.publishedAt)}
          {article.author?.name ? ` · ${article.author.name}` : ''}
        </p>
        <Heading as="h1" size="lg" className="mt-3">
          {article.title}
        </Heading>
      </header>
      {article.image && (
        <Image
          data={article.image}
          sizes="(min-width: 768px) 768px, 100vw"
          className="mb-10 w-full"
        />
      )}
      <div
        className="text-sm leading-relaxed text-neutral-700 [&_a]:underline [&_h2]:mt-8 [&_h2]:mb-3 [&_h2]:text-lg [&_h2]:font-bold [&_h2]:tracking-wide [&_h2]:uppercase [&_img]:my-6 [&_p]:mb-4"
        dangerouslySetInnerHTML={{ __html: article.contentHtml }}
      />
    </Container>
  );
};

const ARTICLE_QUERY = `#graphql
  query Article(
    $blogHandle: String!
    $articleHandle: String!
    $country: CountryCode
    $language: LanguageCode
  ) @inContext(country: $country, language: $language) {
    blog(handle: $blogHandle) {
      articleByHandle(handle: $articleHandle) {
        title
        contentHtml
        publishedAt
        author: authorV2 {
          name
        }
        image {
          id
          url
          altText
          width
          height
        }
        seo {
          description
          title
        }
      }
    }
  }
` as const;

export default Article;
