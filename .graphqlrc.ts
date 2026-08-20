import { getSchema } from '@shopify/hydrogen-codegen';
import type { IGraphQLConfig } from 'graphql-config';

const graphqlConfig: IGraphQLConfig = {
  projects: {
    default: {
      schema: getSchema('storefront'),
      // The .graphql mirror exists for the editor's GraphQL LSP only: its
      // project indexer (graphql-tag-pluck) cannot see fragments defined in
      // `#graphql … as const` template strings, so cross-file spreads like
      // `...ProductCard` would show `Unknown fragment` in the IDE. The mirror
      // is kept in sync by app/lib/fragments.ide.test.ts. Hydrogen codegen
      // uses its own document discovery and ignores this entry.
      documents: [
        './*.{ts,tsx,js,jsx}',
        './app/**/*.{ts,tsx,js,jsx}',
        './app/lib/fragments.ide.graphql',
      ],
    },
  },
};

export default graphqlConfig;
