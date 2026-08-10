import { getSchema } from '@shopify/hydrogen-codegen';
import type { IGraphQLConfig } from 'graphql-config';

const graphqlConfig: IGraphQLConfig = {
  projects: {
    default: {
      schema: getSchema('storefront'),
      documents: ['./*.{ts,tsx,js,jsx}', './app/**/*.{ts,tsx,js,jsx}'],
    },
  },
};

export default graphqlConfig;
