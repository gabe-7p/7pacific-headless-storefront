import { Image } from '@shopify/hydrogen';
import { Link, useLoaderData } from 'react-router';

import { Container } from '~/components/common/Container';
import { Heading } from '~/components/common/Heading';
import { pageTitle } from '~/lib/seo';

import type { Route } from './+types/blogs.$blogHandle._index';

export const meta: Route.MetaFunction = ({ data }) => {
  return [{ title: pageTitle(data?.blog?.title) }];
};

export async function loader({ context, params }: Route.LoaderArgs) {
  if (!params.blogHandle) throw new Response('Not found', { status: 404 });

  const { blog } = await context.storefront.query(BLOG_QUERY, {
    variables: { blogHandle: params.blogHandle, first: 24 },
  });

  if (!blog?.articles) throw new Response('Not found', { status: 404 });

  return { blog };
}

const formatDate = (value: string) =>
  new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'long', day: 'numeric' }).format(
    new Date(value)
  );

const BlogIndex = () => {
  const { blog } = useLoaderData<typeof loader>();
  return (
    <Container className="py-10 md:py-14">
      <Heading as="h1" size="lg" className="mb-8">
        {blog.title}
      </Heading>
      <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
        {blog.articles.nodes.map((article) => (
          <Link
            key={article.id}
            to={`/blogs/${blog.handle}/${article.handle}`}
            prefetch="intent"
            className="group flex flex-col"
          >
            <div className="aspect-[3/2] overflow-hidden bg-neutral-100">
              {article.image && (
                <Image
                  data={article.image}
                  sizes="(min-width: 1024px) 33vw, 100vw"
                  className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              )}
            </div>
            <p className="mt-3 text-xs tracking-wide text-neutral-500 uppercase">
              {formatDate(article.publishedAt)}
            </p>
            <Heading as="h2" size="sm" className="mt-1">
              {article.title}
            </Heading>
          </Link>
        ))}
      </div>
    </Container>
  );
};

const BLOG_QUERY = `#graphql
  query Blog($blogHandle: String!, $first: Int, $country: CountryCode, $language: LanguageCode)
    @inContext(country: $country, language: $language) {
    blog(handle: $blogHandle) {
      title
      handle
      articles(first: $first) {
        nodes {
          id
          title
          handle
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
  }
` as const;

export default BlogIndex;
