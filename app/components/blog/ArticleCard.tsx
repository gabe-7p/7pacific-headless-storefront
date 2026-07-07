import { Image } from '@shopify/hydrogen';
import { Link } from 'react-router';
import type { ArticleCardFragment } from 'storefrontapi.generated';

/** Format a Shopify ISO date as e.g. "Jun 05, 2023". */
export const formatArticleDate = (value: string) =>
  new Date(value).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' });

/**
 * Blog article card — thumbnail, tag + date meta, and title, linking to the
 * article. Presentational; renders the typed `ArticleCardFragment` it's given.
 */
export const ArticleCard = ({
  article,
  blogHandle,
}: {
  article: ArticleCardFragment;
  blogHandle: string;
}) => {
  const to = `/blogs/${blogHandle}/${article.handle}`;

  return (
    <article className="group flex flex-col gap-4 sm:flex-row">
      {article.image && (
        <Link to={to} prefetch="intent" className="block shrink-0 sm:w-52">
          <Image
            data={article.image}
            sizes="(min-width: 640px) 13rem, 100vw"
            className="aspect-[4/3] w-full object-cover"
          />
        </Link>
      )}
      <div className="flex flex-col">
        <p className="text-xs tracking-wide text-neutral-500 uppercase">
          {article.tags.length > 0 && <span>{article.tags.join(' · ')} · </span>}
          {formatArticleDate(article.publishedAt)}
        </p>
        <Link
          to={to}
          prefetch="intent"
          className="mt-2 text-lg font-bold tracking-wide uppercase group-hover:underline"
        >
          {article.title}
        </Link>
      </div>
    </article>
  );
};
