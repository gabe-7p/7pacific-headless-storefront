import { Analytics, getPaginationVariables } from '@shopify/hydrogen';
import type {
  ProductCollectionSortKeys,
  ProductFilter,
} from '@shopify/hydrogen/storefront-api-types';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/components/ui/select';
import { PRODUCT_CARD_FRAGMENT } from '~/lib/fragments';
import { parseMarketingSections } from '~/lib/metafields';
import { redirectIfHandleIsLocalized } from '~/lib/redirect';
import { buildMeta } from '~/lib/seo';

import type { Route } from './+types/collections.$handle';

export const meta: Route.MetaFunction = ({ data }) => {
  return buildMeta({ title: data?.collection.title, description: data?.collection.description });
};

type SortOption = {
  value: string;
  label: string;
  sortKey: ProductCollectionSortKeys;
  reverse: boolean;
};

const SORT_OPTIONS: ReadonlyArray<SortOption> = [
  { value: 'featured', label: 'Featured', sortKey: 'COLLECTION_DEFAULT', reverse: false },
  { value: 'best-selling', label: 'Best selling', sortKey: 'BEST_SELLING', reverse: false },
  { value: 'price-asc', label: 'Price: Low to High', sortKey: 'PRICE', reverse: false },
  { value: 'price-desc', label: 'Price: High to Low', sortKey: 'PRICE', reverse: true },
  { value: 'newest', label: 'Newest', sortKey: 'CREATED', reverse: true },
  { value: 'title-asc', label: 'A–Z', sortKey: 'TITLE', reverse: false },
];

const sortFromParam = (value: string | null): SortOption =>
  SORT_OPTIONS.find((option) => option.value === value) ?? SORT_OPTIONS[0]!;

export async function loader({ context, params, request }: Route.LoaderArgs) {
  const { handle } = params;
  const { storefront } = context;
  const paginationVariables = getPaginationVariables(request, { pageBy: 24 });

  if (!handle) throw redirect('/');

  const url = new URL(request.url);
  const sort = sortFromParam(url.searchParams.get('sort'));
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
    variables: {
      handle,
      filters,
      sortKey: sort.sortKey,
      reverse: sort.reverse,
      ...paginationVariables,
    },
  });

  if (!collection) {
    throw new Response(`Collection ${handle} not found`, { status: 404 });
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

      <div className="mb-6 flex items-center justify-between gap-4 border-y border-neutral-200 py-3">
        {facets.length > 0 ? (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setFiltersOpen((open) => !open)}
            className="tracking-[0.15em] uppercase"
          >
            {filtersOpen ? 'Hide filters' : 'Filters'}
          </Button>
        ) : (
          <span />
        )}
        <SortSelect />
      </div>

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

const SortSelect = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const active = sortFromParam(searchParams.get('sort'));
  return (
    <div className="flex items-center gap-2">
      <span className="text-xs tracking-wide text-neutral-500 uppercase">Sort</span>
      <Select
        value={active.value}
        onValueChange={(value) => {
          const next = new URLSearchParams(searchParams);
          next.set('sort', value);
          setSearchParams(next, { preventScrollReset: true });
        }}
      >
        <SelectTrigger size="sm" className="w-44 text-xs">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {SORT_OPTIONS.map((option) => (
            <SelectItem key={option.value} value={option.value} className="text-xs">
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
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
    $sortKey: ProductCollectionSortKeys!
    $reverse: Boolean
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
        sortKey: $sortKey
        reverse: $reverse
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
