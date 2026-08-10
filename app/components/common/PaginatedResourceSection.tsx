import { Pagination } from '@shopify/hydrogen';
import type * as React from 'react';

/**
 * Wraps Hydrogen's <Pagination> with the shared load-previous/load-more
 * controls for paginated resource grids (currently the collection page).
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
            <PreviousLink>{isLoading ? 'Loading...' : <span>↑ Load previous</span>}</PreviousLink>
            {resourcesClassName ? (
              <div className={resourcesClassName}>{resourcesMarkup}</div>
            ) : (
              resourcesMarkup
            )}
            <NextLink>{isLoading ? 'Loading...' : <span>Load more ↓</span>}</NextLink>
          </div>
        );
      }}
    </Pagination>
  );
};
