import { useEffect, useState } from 'react';
import { Link, useFetcher } from 'react-router';

import { CtaLabel } from '~/components/common/Cta';
import { buttonVariants } from '~/components/ui/button';
import { cn } from '~/lib/cn';

type PageInfo = { hasNextPage: boolean; endCursor?: string | null };

type Page<T> = { products: ReadonlyArray<T>; pageInfo: PageInfo; dataSearch: string };

// A Link that renders its own anchor, so Cta can't wrap it — compose
// buttonVariants + CtaLabel directly (the same documented exception the
// add-to-cart button uses).
const LOAD_MORE_CTA = cn(buttonVariants({ variant: 'brand-outline', size: 'sm' }), 'my-6');

/**
 * Cursor pagination for a product grid. The grid's loader returns the first
 * page; each "Load more" is a real GET link to `?after=<cursor>` (works
 * without JS, crawlable) that JavaScript upgrades to a fetcher load whose
 * products append in place. The accumulated list resets when the browse
 * state (`dataSearch`) changes.
 */
export const useLoadMore = <T,>(initial: Page<T>) => {
  const fetcher = useFetcher<Page<T>>();
  const [nodes, setNodes] = useState(initial.products);
  const [pageInfo, setPageInfo] = useState(initial.pageInfo);

  useEffect(() => {
    setNodes(initial.products);
    setPageInfo(initial.pageInfo);
  }, [initial.products, initial.pageInfo, initial.dataSearch]);

  const loaded = fetcher.data;
  useEffect(() => {
    if (!loaded) return;
    setNodes((current) => [...current, ...loaded.products]);
    setPageInfo(loaded.pageInfo);
  }, [loaded]);

  return {
    nodes,
    pageInfo,
    isLoading: fetcher.state !== 'idle',
    loadMore: (href: string) => {
      void fetcher.load(href);
    },
  };
};

export const LoadMore = ({
  pathname,
  pageInfo,
  isLoading,
  onLoad,
}: {
  pathname: string;
  pageInfo: PageInfo;
  isLoading: boolean;
  onLoad: (href: string) => void;
}) => {
  if (!pageInfo.hasNextPage || !pageInfo.endCursor) return null;
  const href = `${pathname}?after=${encodeURIComponent(pageInfo.endCursor)}`;

  return (
    <Link
      to={href}
      preventScrollReset
      className={LOAD_MORE_CTA}
      aria-busy={isLoading}
      onClick={(event) => {
        if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
        event.preventDefault();
        onLoad(href);
      }}
    >
      {isLoading ? 'Loading…' : <CtaLabel>Load more</CtaLabel>}
    </Link>
  );
};
