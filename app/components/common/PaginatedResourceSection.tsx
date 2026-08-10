import { Pagination } from '@shopify/hydrogen';
import type * as React from 'react';

import { CtaLabel } from '~/components/common/Cta';
import { buttonVariants } from '~/components/ui/button';
import { cn } from '~/lib/cn';

// Pagination's PreviousLink/NextLink render their own <Link>, so Cta can't
// wrap them — compose buttonVariants + CtaLabel directly instead (the same
// documented exception AddToCartButton uses).
const PAGINATION_CTA = cn(buttonVariants({ variant: 'brand-outline', size: 'sm' }), 'my-6');

/**
 * Wraps Hydrogen's <Pagination> with the shared load-previous/load-more
 * controls for paginated resource grids (currently the collection page).
 * The links only render when there's an adjacent page, so an unpaginated
 * grid shows no controls.
 */
export const PaginatedResourceSection = <NodesType,>({
  connection,
  children,
  resourcesClassName,
}: {
  connection: React.ComponentProps<typeof Pagination<NodesType>>['connection'];
  children: React.FunctionComponent<{ node: NodesType; index: number }>;
  resourcesClassName?: string;
}) => {
  return (
    <Pagination connection={connection}>
      {({ nodes, isLoading, PreviousLink, NextLink }) => {
        const resourcesMarkup = nodes.map((node, index) => children({ node, index }));

        return (
          <div>
            <PreviousLink className={PAGINATION_CTA}>
              {isLoading ? 'Loading…' : <CtaLabel>Load previous</CtaLabel>}
            </PreviousLink>
            {resourcesClassName ? (
              <div className={resourcesClassName}>{resourcesMarkup}</div>
            ) : (
              resourcesMarkup
            )}
            <NextLink className={PAGINATION_CTA}>
              {isLoading ? 'Loading…' : <CtaLabel>Load more</CtaLabel>}
            </NextLink>
          </div>
        );
      }}
    </Pagination>
  );
};
