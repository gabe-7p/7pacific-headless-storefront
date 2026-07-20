import { Analytics, getPaginationVariables } from '@shopify/hydrogen';
import type { ProductFilter } from '@shopify/hydrogen/storefront-api-types';
import { X } from 'lucide-react';
import { useState } from 'react';
import { Link, redirect, useLoaderData, useSearchParams } from 'react-router';
import type { CollectionQuery } from 'storefrontapi.generated';

import { MarketingSections } from '~/components/collection/MarketingSections';
import { ProductCard } from '~/components/collection/ProductCard';
import { Heading } from '~/components/common/Heading';
import { PaginatedResourceSection } from '~/components/common/PaginatedResourceSection';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '~/components/ui/accordion';
import { Button } from '~/components/ui/button';
import { PRODUCT_CARD_FRAGMENT } from '~/lib/fragments';
import { notFound } from '~/lib/http';
import { parseMarketingSections } from '~/lib/metafields';
import { redirectIfHandleIsLocalized } from '~/lib/redirect';
import { buildMeta } from '~/lib/seo';

import type { Route } from './+types/collections.$handle';

export const meta: Route.MetaFunction = ({ data }) => {
  return buildMeta({ title: data?.collection.title, description: data?.collection.description });
};

export async function loader({ context, params, request }: Route.LoaderArgs) {
  const { handle } = params;
  const { storefront } = context;
  const paginationVariables = getPaginationVariables(request, { pageBy: 24 });

  if (!handle) throw redirect('/');

  const url = new URL(request.url);
  // Each applied filter is a `filter` search param whose value is the JSON
  // `input` the Storefront API gave us for that facet value.
  const filters = url.searchParams.getAll('filter').reduce<Array<ProductFilter>>((acc, raw) => {
    try {
      acc.push(JSON.parse(raw) as ProductFilter);
    } catch {
      // ignore malformed filter params
    }
    return acc;
  }, []);

  const { collection } = await storefront.query(COLLECTION_QUERY, {
    // Product listings change with availability/merchandising: short cache.
    cache: storefront.CacheShort(),
    // No sortKey: the collection's own merchandised order is the display
    // order (drag to reorder in the Shopify admin).
    variables: {
      handle,
      filters,
      ...paginationVariables,
    },
  });

  if (!collection) {
    throw notFound('Collection not found');
  }

  redirectIfHandleIsLocalized(request, { handle, data: collection });

  return {
    collection,
    marketingSections: parseMarketingSections(collection.marketingSections?.value),
  };
}

const Collection = () => {
  const { collection, marketingSections } = useLoaderData<typeof loader>();
  const [searchParams] = useSearchParams();
  const [filtersOpen, setFiltersOpen] = useState(false);
  const appliedFilters = searchParams.getAll('filter');
  const facets = collection.products.filters ?? [];

  return (
    // Near full-bleed with ~20px outer margins so product imagery dominates the
    // viewport (matches live) — intentionally not wrapped in the max-width
    // Container the rest of the site uses.
    <div className="w-full px-5 py-10">
      <header className="mb-8">
        <Heading as="h1" size="lg">
          {collection.title}
        </Heading>
        {collection.description && (
          <p className="mt-2 max-w-2xl text-sm text-neutral-600">{collection.description}</p>
        )}
      </header>

      {facets.length > 0 && (
        <div className="mb-6 flex items-center gap-4 border-y border-neutral-200 py-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setFiltersOpen((open) => !open)}
            className="tracking-[0.15em] uppercase"
          >
            {filtersOpen ? 'Hide filters' : 'Filters'}
          </Button>
        </div>
      )}

      {appliedFilters.length > 0 && <AppliedFilters facets={facets} />}

      {/* Filters open as a collapsible panel above the grid (live uses a drawer),
          leaving the product grid the full page width. */}
      {facets.length > 0 && filtersOpen && (
        <div className="mb-8 border-b border-neutral-200 pb-6">
          <FilterGroups facets={facets} />
        </div>
      )}

      <PaginatedResourceSection
        connection={collection.products}
        resourcesClassName="grid grid-cols-1 gap-5 lg:grid-cols-2"
      >
        {({ node: product }) => (
          <ProductCard key={product.id} product={product} label={product.label?.value} />
        )}
      </PaginatedResourceSection>

      <MarketingSections sections={marketingSections} />

      <Analytics.CollectionView
        data={{ collection: { id: collection.id, handle: collection.handle } }}
      />
    </div>
  );
};

type Facet = NonNullable<NonNullable<CollectionQuery['collection']>['products']['filters']>[number];

const FilterGroups = ({ facets }: { facets: ReadonlyArray<Facet> }) => {
  const [searchParams] = useSearchParams();
  const applied = new Set(searchParams.getAll('filter'));

  const buildHref = (input: string, isApplied: boolean) => {
    const next = new URLSearchParams(searchParams);
    next.delete('filter');
    const values = new Set(applied);
    if (isApplied) values.delete(input);
    else values.add(input);
    values.forEach((value) => next.append('filter', value));
    return `?${next.toString()}`;
  };

  return (
    <Accordion type="multiple" defaultValue={facets.map((facet) => facet.id)}>
      {facets.map((facet) => (
        <AccordionItem key={facet.id} value={facet.id}>
          <AccordionTrigger className="text-xs font-semibold tracking-[0.15em] uppercase">
            {facet.label}
          </AccordionTrigger>
          <AccordionContent>
            <ul className="space-y-1.5">
              {facet.values.map((value) => {
                const isApplied = applied.has(value.input as string);
                return (
                  <li key={value.id}>
                    <Link
                      to={buildHref(value.input as string, isApplied)}
                      prefetch="intent"
                      preventScrollReset
                      className={
                        isApplied
                          ? 'flex items-center gap-2 text-sm font-medium text-black'
                          : 'flex items-center gap-2 text-sm text-neutral-600 transition-colors hover:text-black'
                      }
                    >
                      <span
                        className={
                          isApplied
                            ? 'flex size-4 items-center justify-center border border-black bg-black text-[10px] text-white'
                            : 'flex size-4 items-center justify-center border border-neutral-400'
                        }
                        aria-hidden
                      >
                        {isApplied && '✓'}
                      </span>
                      {value.label}
                      {typeof value.count === 'number' && (
                        <span className="text-neutral-400">({value.count})</span>
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
};

const AppliedFilters = ({ facets }: { facets: ReadonlyArray<Facet> }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const applied = searchParams.getAll('filter');

  const labelFor = (input: string) => {
    for (const facet of facets) {
      const match = facet.values.find((value) => value.input === input);
      if (match) return match.label;
    }
    return 'Filter';
  };

  const removeFilter = (input: string) => {
    const next = new URLSearchParams(searchParams);
    const remaining = applied.filter((value) => value !== input);
    next.delete('filter');
    remaining.forEach((value) => next.append('filter', value));
    setSearchParams(next, { preventScrollReset: true });
  };

  return (
    <div className="mb-6 flex flex-wrap items-center gap-2">
      {applied.map((input) => (
        <button
          key={input}
          type="button"
          onClick={() => removeFilter(input)}
          className="inline-flex items-center gap-1.5 border border-neutral-300 px-2.5 py-1 text-xs tracking-wide uppercase transition-colors hover:border-black"
        >
          {labelFor(input)}
          <X className="size-3" />
          <span className="sr-only">Remove filter</span>
        </button>
      ))}
    </div>
  );
};

// NOTE: https://shopify.dev/docs/api/storefront/latest/objects/collection
const COLLECTION_QUERY = `#graphql
  ${PRODUCT_CARD_FRAGMENT}
  query Collection(
    $handle: String!
    $country: CountryCode
    $language: LanguageCode
    $filters: [ProductFilter!]
    $first: Int
    $last: Int
    $startCursor: String
    $endCursor: String
  ) @inContext(country: $country, language: $language) {
    collection(handle: $handle) {
      id
      handle
      title
      description
      marketingSections: metafield(namespace: "custom", key: "marketing_sections") {
        value
      }
      products(
        first: $first
        last: $last
        before: $startCursor
        after: $endCursor
        filters: $filters
      ) {
        nodes {
          ...ProductCard
          label: metafield(namespace: "theme", key: "label") {
            value
          }
        }
        filters {
          id
          label
          type
          values {
            id
            label
            count
            input
          }
        }
        pageInfo {
          hasPreviousPage
          hasNextPage
          endCursor
          startCursor
        }
      }
    }
  }
` as const;

export default Collection;
